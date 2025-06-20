import { NextApiRequest, NextApiResponse } from 'next';

import { sendEmail } from '../../../lib/email';
import dbConnect from '../../../lib/mongodb';
import { Invite } from '../../../models/Invite';
import { User } from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      return createInvite(req, res);
    case 'GET':
      return getInvites(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function createInvite(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, role, permissions, companyId } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create invite
    const invite = await Invite.create({
      email,
      role: role || 'team_member',
      permissions: permissions || ['read'],
      companyId,
      invitedBy: req.headers['x-user-id'] as string || 'system',
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
    });

    // Send invite email
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/accept-invite?inviteId=${invite._id}`;
    await sendEmail({
      to: email,
      subject: 'You are invited to join cmdctr',
      text: `You have been invited to join cmdctr. Click this link to accept: ${inviteLink}\nThis invite will expire in 7 days.`,
      html: `<p>You have been invited to join cmdctr.<br>Click <a href="${inviteLink}">here</a> to accept. This invite will expire in 7 days.</p>`
    });

    return res.status(201).json({
      success: true,
      invite: {
        id: invite._id,
        email: invite.email,
        role: invite.role,
        permissions: invite.permissions,
        status: invite.status,
        expiresAt: invite.expiresAt,
      },
    });

  } catch (error) {
    console.error('Create invite error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getInvites(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { status, companyId } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (companyId) filter.companyId = companyId;

    const invites = await Invite.find(filter).exec();

    return res.status(200).json({
      success: true,
      invites: invites.map(invite => ({
        id: invite._id,
        email: invite.email,
        role: invite.role,
        permissions: invite.permissions,
        status: invite.status,
        expiresAt: invite.expiresAt,
        createdAt: invite.createdAt,
      })),
    });

  } catch (error) {
    console.error('Get invites error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 