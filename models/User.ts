// User model for MongoDB
// See: https://mongoosejs.com/docs/guide.html
import { z } from 'zod';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  roles: Array<'founder' | 'ops_manager' | 'team_member' | 'investor' | 'partner' | 'external_expert'>;
  last_login: string; // ISO8601
  company_id: string;
}

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar_url: z.string().url(),
  roles: z.array(z.enum(['founder', 'ops_manager', 'team_member', 'investor', 'partner', 'external_expert'])),
  last_login: z.string().datetime(),
  company_id: z.string(),
}); 