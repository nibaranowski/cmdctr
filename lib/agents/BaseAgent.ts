import { Agent, AgentCreateInput, AgentUpdateInput } from '../../models/Agent';
import { CoreObject } from '../../models/CoreObject';

import { logger } from './logger';

export interface AgentContext {
  company_id: string;
  metabox_id?: string;
  phase_id?: string;
  core_object_id?: string;
  user_id?: string;
  metadata?: Record<string, any>;
}

export interface AgentResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

export interface AgentActivity {
  id: string;
  agent_id: string;
  core_object_id?: string;
  user_id?: string;
  type: string;
  message: string;
  timestamp: string;
  data?: Record<string, any>;
}

export abstract class BaseAgent {
  public id: string;
  public name: string;
  public description?: string;
  public company_id: string;
  public metabox_id?: string;
  public phase_id?: string;
  public agent_type: 'ai' | 'human' | 'hybrid';
  public status: 'active' | 'idle' | 'busy' | 'offline' | 'error' | 'maintenance';
  public capabilities: string[];
  public skills: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    description?: string;
  }>;
  public current_core_object_id?: string;
  public performance_metrics: {
    tasks_completed: number;
    tasks_failed: number;
    average_completion_time_hours: number;
    success_rate: number;
    last_activity: string;
  };
  public availability: {
    is_available: boolean;
    working_hours?: {
      start: string;
      end: string;
      timezone: string;
    };
    max_concurrent_tasks: number;
    current_task_count: number;
  };
  public configuration: {
    model?: string;
    api_keys?: Record<string, string>;
    settings?: Record<string, unknown>;
    webhooks?: Array<{
      url: string;
      events: string[];
      secret?: string;
    }>;
  };
  public permissions: {
    can_create_tasks: boolean;
    can_assign_tasks: boolean;
    can_access_projects: boolean;
    can_manage_other_agents: boolean;
    can_access_company_data: boolean;
  };
  public created_at: string;
  public updated_at: string;
  public last_heartbeat?: string;
  public metadata?: Record<string, unknown>;

  constructor(agentData: AgentCreateInput) {
    this.id = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = agentData.name;
    this.company_id = agentData.company_id;
    this.agent_type = agentData.agent_type;
    this.status = 'idle';
    this.capabilities = agentData.capabilities || [];
    this.skills = agentData.skills || [];
    this.performance_metrics = {
      tasks_completed: 0,
      tasks_failed: 0,
      average_completion_time_hours: 1,
      success_rate: 100,
      last_activity: new Date().toISOString()
    };
    this.availability = {
      is_available: true,
      max_concurrent_tasks: agentData.max_concurrent_tasks || 1,
      current_task_count: 0
    };
    this.configuration = {};
    this.permissions = {
      can_create_tasks: agentData.permissions?.can_create_tasks || false,
      can_assign_tasks: agentData.permissions?.can_assign_tasks || false,
      can_access_projects: agentData.permissions?.can_access_projects || true,
      can_manage_other_agents: agentData.permissions?.can_manage_other_agents || false,
      can_access_company_data: agentData.permissions?.can_access_company_data || true
    };
    this.created_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
    
    // Set optional properties only if provided
    if (agentData.description) {
      this.description = agentData.description;
    }
    if (agentData.metabox_id) {
      this.metabox_id = agentData.metabox_id;
    }
    if (agentData.phase_id) {
      this.phase_id = agentData.phase_id;
    }
    if (agentData.working_hours) {
      this.availability.working_hours = agentData.working_hours;
    }
    if (agentData.configuration?.model) {
      this.configuration.model = agentData.configuration.model;
    }
    if (agentData.configuration?.api_keys) {
      this.configuration.api_keys = agentData.configuration.api_keys;
    }
    if (agentData.configuration?.settings) {
      this.configuration.settings = agentData.configuration.settings;
    }
    if (agentData.configuration?.webhooks) {
      this.configuration.webhooks = agentData.configuration.webhooks;
    }
  }

  abstract execute(context: AgentContext): Promise<AgentResult>;

  protected updateStatus(status: Agent['status']): void {
    this.status = status;
    this.updated_at = new Date().toISOString();
    if (status === 'active' || status === 'busy') {
      this.last_heartbeat = new Date().toISOString();
    }
  }

  protected async logActivity(activity: Omit<AgentActivity, 'id' | 'agent_id' | 'timestamp'>): Promise<void> {
    const fullActivity: AgentActivity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      agent_id: this.id,
      timestamp: new Date().toISOString(),
      ...activity
    };

    // Update performance metrics
    this.performance_metrics.last_activity = fullActivity.timestamp;
    this.updated_at = fullActivity.timestamp;

    // In a real implementation, this would be saved to the database
    logger.info(`Agent Activity [${this.name}]:`, fullActivity);
  }

  protected async handleError(error: Error): Promise<AgentResult> {
    logger.error(`Agent ${this.name} error:`, error);
    this.updateStatus('error');
    this.performance_metrics.tasks_failed++;
    this.updateSuccessRate();

    await this.logActivity({
      type: 'error',
      message: error.message,
      data: { error_stack: error.stack }
    });

    return {
      success: false,
      error: error.message,
      metadata: {
        agent_id: this.id,
        agent_name: this.name,
        metabox_id: this.metabox_id,
        phase_id: this.phase_id,
        timestamp: new Date().toISOString(),
      }
    };
  }

  protected createResult<T>(data: T, metadata?: Record<string, any>): AgentResult<T> {
    this.performance_metrics.tasks_completed++;
    this.updateSuccessRate();
    this.updateStatus('active');

    return {
      success: true,
      data,
      metadata: {
        agent_id: this.id,
        agent_name: this.name,
        metabox_id: this.metabox_id,
        phase_id: this.phase_id,
        timestamp: new Date().toISOString(),
        ...metadata,
      }
    };
  }

  private updateSuccessRate(): void {
    const total = this.performance_metrics.tasks_completed + this.performance_metrics.tasks_failed;
    if (total > 0) {
      this.performance_metrics.success_rate = (this.performance_metrics.tasks_completed / total) * 100;
    }
  }

  public toAgentModel(): Agent {
    const agent: Agent = {
      id: this.id,
      name: this.name,
      company_id: this.company_id,
      agent_type: this.agent_type,
      status: this.status,
      capabilities: this.capabilities,
      skills: this.skills,
      performance_metrics: this.performance_metrics,
      availability: this.availability,
      configuration: this.configuration,
      permissions: this.permissions,
      created_at: this.created_at,
      updated_at: this.updated_at
    };

    // Only add optional properties if they have values
    if (this.description) {
      agent.description = this.description;
    }
    if (this.metabox_id) {
      agent.metabox_id = this.metabox_id;
    }
    if (this.phase_id) {
      agent.phase_id = this.phase_id;
    }
    if (this.current_core_object_id) {
      agent.current_core_object_id = this.current_core_object_id;
    }
    if (this.last_heartbeat) {
      agent.last_heartbeat = this.last_heartbeat;
    }
    if (this.metadata) {
      agent.metadata = this.metadata;
    }

    return agent;
  }
} 