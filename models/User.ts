// User model for MongoDB
// See: https://mongoosejs.com/docs/guide.html
import mongoose, { Document, Schema } from 'mongoose';
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

export interface IUser extends Document {
  name: string;
  email: string;
  avatar_url?: string;
  roles: Array<'founder' | 'ops_manager' | 'team_member' | 'investor' | 'partner' | 'external_expert'>;
  last_login: Date;
  company_id?: string;
  isActive: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar_url: { type: String },
  roles: { 
    type: [String], 
    enum: ['founder', 'ops_manager', 'team_member', 'investor', 'partner', 'external_expert'],
    default: ['team_member']
  },
  last_login: { type: Date, default: Date.now },
  company_id: { type: String },
  isActive: { type: Boolean, default: true },
  permissions: { type: [String], default: ['read'] },
}, {
  timestamps: true,
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export const UserZodSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar_url: z.string().url(),
  roles: z.array(z.enum(['founder', 'ops_manager', 'team_member', 'investor', 'partner', 'external_expert'])),
  last_login: z.string().datetime(),
  company_id: z.string(),
}); 