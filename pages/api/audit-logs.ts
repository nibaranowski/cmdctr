import { NextApiRequest, NextApiResponse } from 'next';

import { queryAuditLogs, getAuditStats } from '../../lib/audit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      event_type,
      severity,
      user_id,
      user_email,
      ip_address,
      session_id,
      company_id,
      start_date,
      end_date,
      limit = '50',
      offset = '0',
      stats = 'false',
    } = req.query;

    // Handle stats request
    if (stats === 'true') {
      const statsData = await getAuditStats(
        company_id as string,
        parseInt(req.query.days as string) || 30
      );

      return res.status(200).json({
        success: true,
        stats: statsData,
      });
    }

    // Build query object
    const query: any = {};

    if (event_type) query.event_type = event_type;
    if (severity) query.severity = severity;
    if (user_id) query.user_id = user_id;
    if (user_email) query.user_email = user_email;
    if (ip_address) query.ip_address = ip_address;
    if (session_id) query.session_id = session_id;
    if (company_id) query.company_id = company_id;

    // Parse date range
    if (start_date) {
      query.start_date = new Date(start_date as string);
    }
    if (end_date) {
      query.end_date = new Date(end_date as string);
    }

    // Parse pagination
    query.limit = parseInt(limit as string);
    query.offset = parseInt(offset as string);

    const result = await queryAuditLogs(query);

    return res.status(200).json({
      success: true,
      logs: result.logs.map(log => ({
        id: log._id,
        event_type: log.event_type,
        severity: log.severity,
        user_id: log.user_id,
        user_email: log.user_email,
        ip_address: log.ip_address,
        user_agent: log.user_agent,
        session_id: log.session_id,
        resource_type: log.resource_type,
        resource_id: log.resource_id,
        action: log.action,
        details: log.details,
        metadata: log.metadata,
        timestamp: log.timestamp,
        company_id: log.company_id,
        createdAt: log.createdAt,
        updatedAt: log.updatedAt,
      })),
      pagination: {
        total: result.total,
        hasMore: result.hasMore,
        limit: query.limit,
        offset: query.offset,
      },
    });

  } catch (error) {
    console.error('Audit logs query error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 