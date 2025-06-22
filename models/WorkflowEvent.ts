import { z } from 'zod';

export type EventType = 
  | 'phase_change'
  | 'agent_action'
  | 'integration_trigger'
  | 'task_completed'
  | 'task_failed'
  | 'workflow_started'
  | 'workflow_completed'
  | 'workflow_failed'
  | 'webhook_received'
  | 'manual_trigger';

export type TriggerType = 
  | 'on_phase_change'
  | 'on_agent_action'
  | 'on_task_completion'
  | 'on_webhook'
  | 'on_schedule'
  | 'on_manual'
  | 'on_error';

export interface WorkflowEvent {
  id: string;
  company_id: string;
  event_type: EventType;
  trigger_type: TriggerType;
  source_id: string; // ID of the source (agent, phase, task, etc.)
  source_type: 'agent' | 'phase' | 'task' | 'workflow' | 'integration' | 'user';
  metadata: {
    phase_id?: string;
    agent_id?: string;
    task_id?: string;
    workflow_id?: string;
    integration_id?: string;
    user_id?: string;
    payload?: Record<string, unknown>;
    error?: string;
    retry_count?: number;
    execution_time_ms?: number;
  };
  timestamp: string; // ISO8601
  processed: boolean;
  processed_at?: string; // ISO8601
  created_at: string; // ISO8601
}

export const WorkflowEventSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  event_type: z.enum([
    'phase_change',
    'agent_action', 
    'integration_trigger',
    'task_completed',
    'task_failed',
    'workflow_started',
    'workflow_completed',
    'workflow_failed',
    'webhook_received',
    'manual_trigger'
  ]),
  trigger_type: z.enum([
    'on_phase_change',
    'on_agent_action',
    'on_task_completion',
    'on_webhook',
    'on_schedule',
    'on_manual',
    'on_error'
  ]),
  source_id: z.string(),
  source_type: z.enum(['agent', 'phase', 'task', 'workflow', 'integration', 'user']),
  metadata: z.object({
    phase_id: z.string().optional(),
    agent_id: z.string().optional(),
    task_id: z.string().optional(),
    workflow_id: z.string().optional(),
    integration_id: z.string().optional(),
    user_id: z.string().optional(),
    payload: z.record(z.unknown()).optional(),
    error: z.string().optional(),
    retry_count: z.number().int().min(0).optional(),
    execution_time_ms: z.number().positive().optional(),
  }),
  timestamp: z.string().datetime(),
  processed: z.boolean(),
  processed_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
});

export interface WorkflowTrigger {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  trigger_type: TriggerType;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
    value: unknown;
  }>;
  actions: Array<{
    type: 'webhook' | 'agent_action' | 'phase_transition' | 'notification' | 'integration_call';
    config: Record<string, unknown>;
    retry_config?: {
      max_retries: number;
      retry_delay_ms: number;
      backoff_multiplier: number;
    };
  }>;
  enabled: boolean;
  created_at: string; // ISO8601
  updated_at: string; // ISO8601
}

export const WorkflowTriggerSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  name: z.string().min(1, 'Trigger name is required'),
  description: z.string().optional(),
  trigger_type: z.enum([
    'on_phase_change',
    'on_agent_action',
    'on_task_completion',
    'on_webhook',
    'on_schedule',
    'on_manual',
    'on_error'
  ]),
  conditions: z.array(z.object({
    field: z.string(),
    operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'exists']),
    value: z.unknown()
  })),
  actions: z.array(z.object({
    type: z.enum(['webhook', 'agent_action', 'phase_transition', 'notification', 'integration_call']),
    config: z.record(z.unknown()),
    retry_config: z.object({
      max_retries: z.number().int().min(0),
      retry_delay_ms: z.number().positive(),
      backoff_multiplier: z.number().positive()
    }).optional()
  })).min(1, 'At least one action is required'),
  enabled: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
}); 