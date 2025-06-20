import { z } from 'zod';

export interface Phase {
  id: string;
  name: string;
  order: number;
  agent_id?: string;
  metabox_id: string;
  description?: string;
  created_at: string; // ISO8601
  updated_at: string; // ISO8601
}

export const PhaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  order: z.number().int().nonnegative(),
  agent_id: z.string().optional(),
  metabox_id: z.string().min(1),
  description: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export type PhaseInput = z.input<typeof PhaseSchema>;
export type PhaseOutput = z.output<typeof PhaseSchema>;

// Example for TDD
export const examplePhase: Phase = {
  id: 'phase_target',
  name: 'Target List',
  order: 1,
  agent_id: 'InvestorResearchAgent',
  metabox_id: 'metabox_abc',
  description: 'Initial investor research phase',
  created_at: '2024-06-01T12:00:00Z',
  updated_at: '2024-06-01T12:00:00Z'
}; 