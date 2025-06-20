import { NextApiRequest, NextApiResponse } from 'next';

import { logAuthEvent } from '../../../lib/audit';
import dbConnect from '../../../lib/mongodb';
import { Session } from '../../../models/Session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      return getSessions(req, res);
    case 'DELETE':
      return revokeSession(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getSessions(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const sessions = await Session.find({ userId, isActive: true }).exec();

    // Log session query
    await logAuthEvent('auth.session_created', 'unknown', userId, {
      action: 'query_sessions',
      session_count: sessions.length,
    }, req);

    return res.status(200).json({
      success: true,
      sessions: sessions.map(session => ({
        id: session._id,
        device: session.device,
        location: session.location,
        ip: session.ip,
        lastActive: session.lastActive,
        isCurrent: false, // TODO: Determine current session
      })),
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    
    // Log session query error
    try {
      await logAuthEvent('auth.login_failed', 'unknown', req.headers['x-user-id'] as string, {
        action: 'query_sessions',
        reason: 'server_error',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      }, req);
    } catch (auditError) {
      console.error('Failed to log audit event:', auditError);
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function revokeSession(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sessionId } = req.body;
    const userId = req.headers['x-user-id'] as string;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const result = await Session.updateOne(
      { _id: sessionId, userId },
      { isActive: false }
    ).exec();

    if (result.modifiedCount === 0) {
      // Log failed session revocation
      await logAuthEvent('auth.login_failed', 'unknown', userId, {
        action: 'revoke_session',
        session_id: sessionId,
        reason: 'session_not_found_or_already_revoked',
      }, req);

      return res.status(404).json({ error: 'Session not found or already revoked' });
    }

    // Log successful session revocation
    await logAuthEvent('auth.session_revoked', 'unknown', userId, {
      session_id: sessionId,
    }, req);

    return res.status(200).json({
      success: true,
      message: 'Session revoked successfully',
    });

  } catch (error) {
    console.error('Revoke session error:', error);
    
    // Log session revocation error
    try {
      await logAuthEvent('auth.login_failed', 'unknown', req.headers['x-user-id'] as string, {
        action: 'revoke_session',
        session_id: req.body.sessionId,
        reason: 'server_error',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      }, req);
    } catch (auditError) {
      console.error('Failed to log audit event:', auditError);
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
} 