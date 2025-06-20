/**
 * Audit Logging Utility
 * Provides centralized audit logging for security events, user actions, and system activities
 */

import { NextApiRequest } from 'next';

import { AuditLog, AuditEventType, AuditSeverity, IAuditLog } from '../models/AuditLog';

import dbConnect from './mongodb';

export interface AuditLogData {
  event_type: AuditEventType;
  severity?: AuditSeverity;
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
  company_id?: string;
}

export interface AuditLogQuery {
  event_type?: AuditEventType;
  severity?: AuditSeverity;
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  session_id?: string;
  company_id?: string;
  start_date?: Date;
  end_date?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Get client IP address from request
 */
function getClientIP(req: NextApiRequest): string | undefined {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    (req.headers['x-real-ip'] as string) ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress
  );
}

/**
 * Get user agent from request
 */
function getUserAgent(req: NextApiRequest): string | undefined {
  return req.headers['user-agent'] as string;
}

/**
 * Log an audit event
 */
export async function logAuditEvent(data: AuditLogData, req?: NextApiRequest): Promise<IAuditLog> {
  try {
    await dbConnect();

    // Extract IP and user agent from request if provided
    const ip_address = data.ip_address || (req ? getClientIP(req) : undefined);
    const user_agent = data.user_agent || (req ? getUserAgent(req) : undefined);

    const auditLog = await AuditLog.create({
      ...data,
      ip_address,
      user_agent,
      timestamp: new Date(),
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUDIT] ${data.event_type} (${data.severity || 'low'}):`, {
        user: data.user_email || data.user_id,
        ip: ip_address,
        details: data.details,
      });
    }

    return auditLog;
  } catch (error) {
    console.error('Failed to log audit event:', error);
    throw error;
  }
}

/**
 * Query audit logs with filters
 */
export async function queryAuditLogs(query: AuditLogQuery): Promise<{
  logs: IAuditLog[];
  total: number;
  hasMore: boolean;
}> {
  try {
    await dbConnect();

    const filter: any = {};

    // Apply filters
    if (query.event_type) filter.event_type = query.event_type;
    if (query.severity) filter.severity = query.severity;
    if (query.user_id) filter.user_id = query.user_id;
    if (query.user_email) filter.user_email = query.user_email;
    if (query.ip_address) filter.ip_address = query.ip_address;
    if (query.session_id) filter.session_id = query.session_id;
    if (query.company_id) filter.company_id = query.company_id;

    // Date range filter
    if (query.start_date || query.end_date) {
      filter.timestamp = {};
      if (query.start_date) filter.timestamp.$gte = query.start_date;
      if (query.end_date) filter.timestamp.$lte = query.end_date;
    }

    const limit = query.limit || 50;
    const offset = query.offset || 0;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ timestamp: -1 })
        .skip(offset)
        .limit(limit + 1) // Get one extra to check if there are more
        .exec(),
      AuditLog.countDocuments(filter).exec(),
    ]);

    const hasMore = logs.length > limit;
    const results = hasMore ? logs.slice(0, limit) : logs;

    return {
      logs: results,
      total,
      hasMore,
    };
  } catch (error) {
    console.error('Failed to query audit logs:', error);
    throw error;
  }
}

/**
 * Convenience functions for common audit events
 */

export async function logAuthEvent(
  event_type: AuditEventType,
  user_email: string,
  user_id?: string,
  details?: Record<string, any>,
  req?: NextApiRequest
): Promise<IAuditLog> {
  const severity: AuditSeverity = 
    event_type.includes('failed') || event_type.includes('expired') ? 'medium' : 'low';

  return logAuditEvent({
    event_type,
    severity,
    user_email,
    user_id,
    details,
  }, req);
}

export async function logSecurityEvent(
  event_type: AuditEventType,
  severity: AuditSeverity,
  details?: Record<string, any>,
  req?: NextApiRequest
): Promise<IAuditLog> {
  return logAuditEvent({
    event_type,
    severity,
    details,
  }, req);
}

export async function logUserEvent(
  event_type: AuditEventType,
  user_id: string,
  user_email: string,
  details?: Record<string, any>,
  req?: NextApiRequest
): Promise<IAuditLog> {
  return logAuditEvent({
    event_type,
    severity: 'low',
    user_id,
    user_email,
    details,
  }, req);
}

export async function logSystemEvent(
  event_type: AuditEventType,
  severity: AuditSeverity,
  details?: Record<string, any>,
  req?: NextApiRequest
): Promise<IAuditLog> {
  return logAuditEvent({
    event_type,
    severity,
    details,
  }, req);
}

/**
 * Get audit statistics
 */
export async function getAuditStats(company_id?: string, days: number = 30): Promise<{
  total_events: number;
  events_by_type: Record<string, number>;
  events_by_severity: Record<string, number>;
  recent_activity: number;
}> {
  try {
    await dbConnect();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const filter: any = { timestamp: { $gte: startDate } };
    if (company_id) filter.company_id = company_id;

    const [totalEvents, eventsByType, eventsBySeverity, recentActivity] = await Promise.all([
      AuditLog.countDocuments(filter),
      AuditLog.aggregate([
        { $match: filter },
        { $group: { _id: '$event_type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      AuditLog.aggregate([
        { $match: filter },
        { $group: { _id: '$severity', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      AuditLog.countDocuments({
        ...filter,
        timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
      })
    ]);

    return {
      total_events: totalEvents,
      events_by_type: eventsByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      events_by_severity: eventsBySeverity.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      recent_activity: recentActivity,
    };
  } catch (error) {
    console.error('Failed to get audit stats:', error);
    throw error;
  }
}

/**
 * Clean up old audit logs (manual cleanup)
 */
export async function cleanupOldAuditLogs(olderThanDays: number = 365): Promise<number> {
  try {
    await dbConnect();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await AuditLog.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    console.log(`Cleaned up ${result.deletedCount} audit logs older than ${olderThanDays} days`);
    return result.deletedCount || 0;
  } catch (error) {
    console.error('Failed to cleanup old audit logs:', error);
    throw error;
  }
} 