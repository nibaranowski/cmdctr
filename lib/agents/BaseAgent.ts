import { Agent } from '../../models/Agent';
import { CoreObject } from '../../models/CoreObject';
import { MetaBox } from '../../models/MetaBox';
import { Phase } from '../../models/Phase';

export interface AgentContext {
  metabox: MetaBox;
  phase: Phase;
  coreObjects?: CoreObject[];
  userInput?: string;
  metadata?: Record<string, any>;
}

export interface AgentResult {
  success: boolean;
  message: string;
  data?: any;
  coreObjects?: CoreObject[];
  nextActions?: string[];
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
  protected agent: Agent;
  protected context: AgentContext;

  constructor(agent: Agent, context: AgentContext) {
    this.agent = agent;
    this.context = context;
  }

  /**
   * Execute the agent's main functionality
   */
  abstract execute(): Promise<AgentResult>;

  /**
   * Update agent status
   */
  protected async updateStatus(status: Agent['status'], message?: string): Promise<void> {
    this.agent.status = status;
    if (message) {
      this.agent.performance_metrics.last_activity = message;
    }
    this.agent.updated_at = new Date().toISOString();
    
    // In a real implementation, this would save to database
    console.log(`Agent ${this.agent.name} status updated to ${status}: ${message || ''}`);
  }

  /**
   * Log agent activity
   */
  protected logActivity(activity: string, metadata?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    // Update performance metrics with activity
    this.agent.performance_metrics.last_activity = timestamp;

    console.log(`[${timestamp}] ${this.agent.name}: ${activity}`);
  }

  /**
   * Get agent configuration
   */
  protected getConfig(): Record<string, any> {
    return this.agent.configuration || {};
  }

  /**
   * Validate required context
   */
  protected validateContext(): boolean {
    if (!this.context.metabox) {
      this.logActivity('Error: Missing metabox in context');
      return false;
    }
    if (!this.context.phase) {
      this.logActivity('Error: Missing phase in context');
      return false;
    }
    return true;
  }

  /**
   * Get core objects for this agent's phase
   */
  protected getCoreObjects(): CoreObject[] {
    return this.context.coreObjects || [];
  }

  /**
   * Create a new core object
   */
  protected createCoreObject(
    title: string,
    description: string,
    data?: Record<string, any>,
    metadata?: Record<string, any>
  ): CoreObject {
    return {
      id: `co_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      status: 'pending',
      phase_id: this.context.phase.id,
      metabox_id: this.context.metabox.id,
      agent_id: this.agent.id,
      activity_log: [],
      data: data || {},
      metadata: metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Update a core object
   */
  protected updateCoreObject(
    coreObject: CoreObject,
    updates: Partial<CoreObject>
  ): CoreObject {
    return {
      ...coreObject,
      ...updates,
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Get user input from context
   */
  protected getUserInput(): string | undefined {
    return this.context.userInput;
  }

  /**
   * Get metadata from context
   */
  protected getMetadata(): Record<string, any> {
    return this.context.metadata || {};
  }

  /**
   * Set metadata in context
   */
  protected setMetadata(key: string, value: any): void {
    if (!this.context.metadata) {
      this.context.metadata = {};
    }
    this.context.metadata[key] = value;
  }

  /**
   * Check if agent is active
   */
  protected isActive(): boolean {
    return this.agent.status === 'active';
  }

  /**
   * Check if agent is paused
   */
  protected isPaused(): boolean {
    return this.agent.status === 'idle';
  }

  /**
   * Check if agent is completed
   */
  protected isCompleted(): boolean {
    return this.agent.status === 'offline';
  }

  /**
   * Get agent type
   */
  protected getAgentType(): Agent['agent_type'] {
    return this.agent.agent_type;
  }

  /**
   * Get agent name
   */
  protected getAgentName(): string {
    return this.agent.name;
  }

  /**
   * Get agent description
   */
  protected getAgentDescription(): string {
    return this.agent.description || '';
  }

  protected async handleError(error: Error): Promise<AgentResult> {
    console.error(`Agent ${this.agent.name} error:`, error);
    await this.updateStatus('error', error.message);

    this.logActivity(error.message);

    return {
      success: false,
      message: error.message,
      metadata: {
        agent_id: this.agent.id,
        agent_name: this.agent.name,
        timestamp: new Date().toISOString(),
      }
    };
  }

  protected createResult<T>(data: T, metadata?: Record<string, any>): AgentResult {
    this.updateStatus('active');

    return {
      success: true,
      message: 'Operation successful',
      data,
      metadata: {
        agent_id: this.agent.id,
        agent_name: this.agent.name,
        timestamp: new Date().toISOString(),
        ...metadata,
      }
    };
  }

  public toAgentModel(): Agent {
    return this.agent;
  }
} 