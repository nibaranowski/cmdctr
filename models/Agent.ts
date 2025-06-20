import { z } from 'zod';

export interface Agent {
  id: string;
  name: string;
  description?: string;
  company_id: string;
  metabox_id?: string; // Optional: agent can be company-wide or assigned to specific meta box
  phase_id?: string; // Optional: agent can be assigned to specific phase
  agent_type: 'ai' | 'human' | 'hybrid';
  status: 'active' | 'idle' | 'busy' | 'offline' | 'error' | 'maintenance';
  capabilities: string[]; // Array of capability strings
  skills: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    description?: string;
  }>;
  current_task_id?: string;
  current_core_object_id?: string; // Updated: now references CoreObject instead of Task
  current_phase_id?: string;
  performance_metrics: {
    tasks_completed: number;
    tasks_failed: number;
    average_completion_time_hours: number;
    success_rate: number; // Percentage
    last_activity: string; // ISO8601
  };
  availability: {
    is_available: boolean;
    working_hours?: {
      start: string; // HH:MM format
      end: string; // HH:MM format
      timezone: string;
    };
    max_concurrent_tasks: number;
    current_task_count: number;
  };
  configuration: {
    model?: string; // AI model identifier
    api_keys?: Record<string, string>;
    settings?: Record<string, unknown>;
    webhooks?: Array<{
      url: string;
      events: string[];
      secret?: string;
    }>;
  };
  permissions: {
    can_create_tasks: boolean;
    can_assign_tasks: boolean;
    can_access_projects: boolean;
    can_manage_other_agents: boolean;
    can_access_company_data: boolean;
  };
  created_at: string; // ISO8601
  updated_at: string; // ISO8601
  last_heartbeat?: string; // ISO8601
  metadata?: Record<string, unknown>;
}

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Agent name is required'),
  description: z.string().optional(),
  company_id: z.string(),
  metabox_id: z.string().optional(),
  phase_id: z.string().optional(),
  agent_type: z.enum(['ai', 'human', 'hybrid']),
  status: z.enum(['active', 'idle', 'busy', 'offline', 'error', 'maintenance']),
  capabilities: z.array(z.string()),
  skills: z.array(z.object({
    name: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    description: z.string().optional()
  })),
  current_task_id: z.string().optional(),
  current_core_object_id: z.string().optional(),
  current_phase_id: z.string().optional(),
  performance_metrics: z.object({
    tasks_completed: z.number().int().min(0),
    tasks_failed: z.number().int().min(0),
    average_completion_time_hours: z.number().positive(),
    success_rate: z.number().min(0).max(100),
    last_activity: z.string().datetime()
  }),
  availability: z.object({
    is_available: z.boolean(),
    working_hours: z.object({
      start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
      end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
      timezone: z.string()
    }).optional(),
    max_concurrent_tasks: z.number().int().min(1),
    current_task_count: z.number().int().min(0)
  }),
  configuration: z.object({
    model: z.string().optional(),
    api_keys: z.record(z.string()).optional(),
    settings: z.record(z.unknown()).optional(),
    webhooks: z.array(z.object({
      url: z.string().url(),
      events: z.array(z.string()),
      secret: z.string().optional()
    })).optional()
  }),
  permissions: z.object({
    can_create_tasks: z.boolean(),
    can_assign_tasks: z.boolean(),
    can_access_projects: z.boolean(),
    can_manage_other_agents: z.boolean(),
    can_access_company_data: z.boolean()
  }),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  last_heartbeat: z.string().datetime().optional(),
  metadata: z.record(z.unknown()).optional()
});

export interface AgentCreateInput {
  name: string;
  description?: string;
  company_id: string;
  metabox_id?: string;
  phase_id?: string;
  agent_type: Agent['agent_type'];
  capabilities?: string[];
  skills?: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    description?: string;
  }>;
  max_concurrent_tasks?: number;
  working_hours?: {
    start: string;
    end: string;
    timezone: string;
  };
  configuration?: Partial<Agent['configuration']>;
  permissions?: Partial<Agent['permissions']>;
}

export interface AgentUpdateInput {
  name?: string;
  description?: string;
  metabox_id?: string;
  phase_id?: string;
  status?: Agent['status'];
  capabilities?: string[];
  skills?: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    description?: string;
  }>;
  current_task_id?: string;
  current_core_object_id?: string;
  current_phase_id?: string;
  performance_metrics?: Partial<Agent['performance_metrics']>;
  availability?: Partial<Agent['availability']>;
  configuration?: Partial<Agent['configuration']>;
  permissions?: Partial<Agent['permissions']>;
  last_heartbeat?: string;
}

export interface AgentFilter {
  company_id: string;
  metabox_id?: string;
  phase_id?: string;
  agent_type?: Agent['agent_type'][];
  status?: Agent['status'][];
  capabilities?: string[];
  is_available?: boolean;
  current_core_object_id?: string;
  current_phase_id?: string;
  created_at_before?: string;
  created_at_after?: string;
}

export interface AgentAssignment {
  agent_id: string;
  core_object_id: string; // Updated: now references CoreObject instead of Task
  metabox_id?: string;
  phase_id?: string;
  assigned_at: string; // ISO8601
  assigned_by: string; // User ID
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimated_duration_hours?: number;
  notes?: string;
} 