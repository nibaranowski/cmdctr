import { z } from 'zod';

export interface AgentContext {
  userId: string;
  organizationId: string;
  metadata?: Record<string, any>;
}

export interface AgentResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

export interface BaseAgent {
  name: string;
  description: string;
  phase: string;
  metaBox: string;
  execute(context: AgentContext): Promise<AgentResult>;
}

export const AgentManifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  phase: z.string(),
  metaBox: z.string(),
  config: z.record(z.any()).optional(),
});

export type AgentManifest = z.infer<typeof AgentManifestSchema>;

export interface MetaBoxConfig {
  id: string;
  name: string;
  description: string;
  phases: string[];
  agents: AgentManifest[];
}

export const MetaBoxSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  phases: z.array(z.string()),
  agents: z.array(AgentManifestSchema),
}); 