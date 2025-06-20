import { z } from 'zod';

export interface Integration {
  id: string;
  company_id: string;
  type: 'stripe' | 'clerk' | 'firebase' | 'sentry' | 'posthog' | 'mercury' | 'slack' | 'zapier';
  config: Record<string, unknown>;
  status: 'active' | 'inactive' | 'error' | 'pending';
}

export const IntegrationSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  type: z.enum(['stripe', 'clerk', 'firebase', 'sentry', 'posthog', 'mercury', 'slack', 'zapier']),
  config: z.record(z.unknown()),
  status: z.enum(['active', 'inactive', 'error', 'pending']),
}); 