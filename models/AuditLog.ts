// AuditLog model for MongoDB
// Tracks security events, user actions, and system activities
import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

export type AuditEventType = 
  | 'auth.login'
  | 'auth.logout'
  | 'auth.login_failed'
  | 'auth.password_reset'
  | 'auth.magic_link_sent'
  | 'auth.magic_link_used'
  | 'auth.magic_link_expired'
  | 'auth.session_created'
  | 'auth.session_revoked'
  | 'auth.invite_created'
  | 'auth.invite_accepted'
  | 'auth.invite_expired'
  | 'auth.role_changed'
  | 'auth.permissions_updated'
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'user.deactivated'
  | 'user.reactivated'
  | 'system.error'
  | 'system.warning'
  | 'system.info'
  | 'security.suspicious_activity'
  | 'security.rate_limit_exceeded'
  | 'security.ip_blocked'
  | 'security.account_locked';

export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AuditLog {
  id: string;
  event_type: AuditEventType;
  severity: AuditSeverity;
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  resource_type?: string;
  resource_id?: string;
  action?: string;
  details?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: string;
  company_id?: string;
}

export interface IAuditLog extends Document {
  event_type: AuditEventType;
  severity: AuditSeverity;
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  resource_type?: string;
  resource_id?: string;
  action?: string;
  details?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: Date;
  company_id?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  event_type: { 
    type: String, 
    required: true,
    enum: [
      'auth.login', 'auth.logout', 'auth.login_failed', 'auth.password_reset',
      'auth.magic_link_sent', 'auth.magic_link_used', 'auth.magic_link_expired',
      'auth.session_created', 'auth.session_revoked', 'auth.invite_created',
      'auth.invite_accepted', 'auth.invite_expired', 'auth.role_changed',
      'auth.permissions_updated', 'user.created', 'user.updated', 'user.deleted',
      'user.deactivated', 'user.reactivated', 'system.error', 'system.warning',
      'system.info', 'security.suspicious_activity', 'security.rate_limit_exceeded',
      'security.ip_blocked', 'security.account_locked'
    ]
  },
  severity: { 
    type: String, 
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  user_id: { type: String, index: true },
  user_email: { type: String, index: true },
  ip_address: { type: String, index: true },
  user_agent: { type: String },
  session_id: { type: String, index: true },
  resource_type: { type: String },
  resource_id: { type: String },
  action: { type: String },
  details: { type: Schema.Types.Mixed },
  metadata: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now, index: true },
  company_id: { type: String, index: true },
}, {
  timestamps: true,
});

// Indexes for efficient querying
AuditLogSchema.index({ event_type: 1, timestamp: -1 });
AuditLogSchema.index({ severity: 1, timestamp: -1 });
AuditLogSchema.index({ user_id: 1, timestamp: -1 });
AuditLogSchema.index({ ip_address: 1, timestamp: -1 });
AuditLogSchema.index({ company_id: 1, timestamp: -1 });

// TTL index to automatically delete old logs (keep for 1 year)
AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export const AuditLogZodSchema = z.object({
  id: z.string(),
  event_type: z.enum([
    'auth.login', 'auth.logout', 'auth.login_failed', 'auth.password_reset',
    'auth.magic_link_sent', 'auth.magic_link_used', 'auth.magic_link_expired',
    'auth.session_created', 'auth.session_revoked', 'auth.invite_created',
    'auth.invite_accepted', 'auth.invite_expired', 'auth.role_changed',
    'auth.permissions_updated', 'user.created', 'user.updated', 'user.deleted',
    'user.deactivated', 'user.reactivated', 'system.error', 'system.warning',
    'system.info', 'security.suspicious_activity', 'security.rate_limit_exceeded',
    'security.ip_blocked', 'security.account_locked'
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  user_id: z.string().optional(),
  user_email: z.string().email().optional(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
  session_id: z.string().optional(),
  resource_type: z.string().optional(),
  resource_id: z.string().optional(),
  action: z.string().optional(),
  details: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  timestamp: z.string().datetime(),
  company_id: z.string().optional(),
}); 