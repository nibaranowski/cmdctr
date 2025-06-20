import { z } from 'zod';

export interface CoreObject {
  id: string;
  metabox_id: string;
  title: string;
  description?: string;
  status: 'active' | 'archived' | 'draft' | 'completed' | 'blocked' | 'pending';
  phase_id: string;
  assigned_user_id?: string;
  agent_id?: string;
  activity_log: Array<{
    id: string;
    agent_id?: string;
    core_object_id?: string;
    user_id?: string;
    type: string;
    message: string;
    timestamp: string; // ISO8601
  }>;
  data?: Record<string, unknown>;
  created_at: string; // ISO8601
  updated_at: string; // ISO8601
  metadata?: Record<string, unknown>;
}

export const CoreObjectSchema = z.object({
  id: z.string(),
  metabox_id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'archived', 'draft', 'completed', 'blocked', 'pending']),
  phase_id: z.string(),
  assigned_user_id: z.string().optional(),
  agent_id: z.string().optional(),
  activity_log: z.array(z.object({
    id: z.string(),
    agent_id: z.string().optional(),
    core_object_id: z.string().optional(),
    user_id: z.string().optional(),
    type: z.string(),
    message: z.string(),
    timestamp: z.string().datetime()
  })),
  data: z.record(z.unknown()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  metadata: z.record(z.unknown()).optional()
});

export interface CoreObjectCreateInput {
  metabox_id: string;
  title: string;
  description?: string;
  status?: CoreObject['status'];
  phase_id: string;
  assigned_user_id?: string;
  agent_id?: string;
  data?: Record<string, unknown>;
}

export interface CoreObjectUpdateInput {
  title?: string;
  description?: string;
  status?: CoreObject['status'];
  phase_id?: string;
  assigned_user_id?: string;
  agent_id?: string;
  data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface CoreObjectFilter {
  metabox_id?: string;
  phase_id?: string;
  assigned_user_id?: string;
  agent_id?: string;
  status?: CoreObject['status'][];
  created_at_before?: string;
  created_at_after?: string;
}

// Example for TDD
export const exampleCoreObject: CoreObject = {
  id: 'coreobj_123',
  metabox_id: 'metabox_abc',
  title: 'Investor: Sequoia Capital',
  description: 'Top-tier VC, warm intro via John',
  status: 'active',
  phase_id: 'phase_target',
  assigned_user_id: 'user_1',
  agent_id: 'agent_1',
  activity_log: [
    {
      id: 'act_1',
      agent_id: 'agent_1',
      user_id: 'user_1',
      type: 'comment',
      message: 'Intro sent',
      timestamp: '2024-06-01T12:00:00Z'
    }
  ],
  data: { email: 'partner@sequoiacap.com', last_contacted: '2024-06-01' },
  created_at: '2024-06-01T12:00:00Z',
  updated_at: '2024-06-01T12:00:00Z'
}; 