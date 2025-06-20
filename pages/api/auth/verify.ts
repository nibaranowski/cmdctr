import { NextApiRequest, NextApiResponse } from 'next';

import { logAuthEvent, logUserEvent } from '../../../lib/audit';
import dbConnect from '../../../lib/mongodb';
import { MagicLinkToken } from '../../../models/MagicLinkToken';
import { Session } from '../../../models/Session';
import { User } from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Valid token is required' });
    }

    await dbConnect();

    // Validate token from database
    const tokenData = await validateMagicLinkToken(token);
    if (!tokenData) {
      // Log failed token validation
      await logAuthEvent('auth.magic_link_expired', 'unknown', undefined, {
        token_provided: `${token.substring(0, 10)  }...`,
        reason: 'invalid_or_expired',
      }, req);

      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Find or create user
    let user = await User.findOne({ email: tokenData.email }).exec();
    let isNewUser = false;
    
    if (!user) {
      user = await User.create({
        email: tokenData.email,
        name: tokenData.email.split('@')[0], // Default name from email
        role: 'member',
        permissions: ['read'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      isNewUser = true;
      
      // Log new user creation
      await logUserEvent('user.created', user._id.toString(), user.email, {
        role: user.role,
        permissions: user.permissions,
      }, req);
    }

    // Create session
    const session = await createUserSession(user._id, req);

    // Invalidate used token
    await invalidateToken(token);

    // Log successful magic link usage and login
    await logAuthEvent('auth.magic_link_used', user.email, user._id.toString(), {
      is_new_user: isNewUser,
      session_id: session.id,
    }, req);

    await logAuthEvent('auth.session_created', user.email, user._id.toString(), {
      session_id: session.id,
      device: session.device,
      ip: session.ip,
    }, req);

    // Set session cookie
    res.setHeader('Set-Cookie', `session=${session.id}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`);

    return res.status(200).json({ 
      success: true, 
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
      },
      session: session.id,
    });

  } catch (error) {
    console.error('Token verification error:', error);
    
    // Log verification error
    try {
      await logAuthEvent('auth.login_failed', 'unknown', undefined, {
        reason: 'verification_error',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        token_provided: req.query.token ? `${(req.query.token as string).substring(0, 10)  }...` : 'none',
      }, req);
    } catch (auditError) {
      console.error('Failed to log audit event:', auditError);
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function validateMagicLinkToken(token: string): Promise<{ email: string } | null> {
  const record = await MagicLinkToken.findOne({ token }).exec();
  if (!record || record.used || record.expiresAt < new Date()) {
    return null;
  }
  return { email: record.email };
}

async function createUserSession(userId: string, req: NextApiRequest) {
  const session = await Session.create({
    userId,
    device: req.headers['user-agent'] || 'Unknown',
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown',
    location: 'Unknown', // TODO: Implement IP geolocation
    createdAt: new Date(),
    lastActive: new Date(),
    isActive: true,
  });

  return {
    id: session._id,
    userId: session.userId,
    device: session.device,
    ip: session.ip,
    location: session.location,
    createdAt: session.createdAt,
    lastActive: session.lastActive,
    isActive: session.isActive,
  };
}

async function invalidateToken(token: string) {
  await MagicLinkToken.updateOne({ token }, { used: true }).exec();
} 