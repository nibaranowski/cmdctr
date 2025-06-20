import { NextApiRequest, NextApiResponse } from 'next';

import { logAuthEvent } from '../../../lib/audit';
import { sendEmail } from '../../../lib/email';
import dbConnect from '../../../lib/mongodb';
import { MagicLinkToken } from '../../../models/MagicLinkToken';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, ssoProvider } = req.body;

    if (!email && !ssoProvider) {
      return res.status(400).json({ error: 'Email or SSO provider is required' });
    }

    await dbConnect();

    if (ssoProvider) {
      // Handle SSO authentication
      if (ssoProvider === 'google') {
        const ssoUrl = await initiateSSO(ssoProvider);
        
        // Log SSO initiation
        await logAuthEvent('auth.login', email || 'unknown', undefined, {
          provider: ssoProvider,
          sso_url: ssoUrl,
        }, req);

        return res.status(200).json({ 
          success: true, 
          ssoUrl,
          message: `Redirecting to ${ssoProvider} for authentication` 
        });
      }
      // Microsoft and Apple SSO are currently disabled
      // if (ssoProvider === 'microsoft' || ssoProvider === 'apple') {
      //   const ssoUrl = await initiateSSO(ssoProvider);
      //   return res.status(200).json({ 
      //     success: true, 
      //     ssoUrl,
      //     message: `Redirecting to ${ssoProvider} for authentication` 
      //   });
      // }
      
      // Log unsupported SSO attempt
      await logAuthEvent('auth.login_failed', email || 'unknown', undefined, {
        provider: ssoProvider,
        reason: 'unsupported_provider',
      }, req);

      return res.status(400).json({ error: 'Unsupported SSO provider' });
    }

    // Handle magic link authentication
    if (!email || !email.includes('@')) {
      // Log invalid email attempt
      await logAuthEvent('auth.login_failed', email || 'invalid', undefined, {
        reason: 'invalid_email',
        email_provided: email,
      }, req);

      return res.status(400).json({ error: 'Valid email is required' });
    }

    const magicLink = await generateMagicLink(email);
    
    // Send email with magic link
    await sendEmail({
      to: email,
      subject: 'Your cmdctr Magic Login Link',
      text: `Click this link to log in: ${magicLink}\nThis link will expire in 15 minutes.`,
      html: `<p>Click <a href="${magicLink}">here</a> to log in. This link will expire in 15 minutes.</p>`
    });

    // Log magic link sent
    await logAuthEvent('auth.magic_link_sent', email, undefined, {
      link_expires_in: '15 minutes',
    }, req);

    return res.status(200).json({ 
      success: true, 
      message: 'Magic link sent to your email' 
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // Log login error
    try {
      await logAuthEvent('auth.login_failed', req.body.email || 'unknown', undefined, {
        reason: 'server_error',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      }, req);
    } catch (auditError) {
      console.error('Failed to log audit event:', auditError);
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function initiateSSO(provider: string): Promise<string> {
  // Only Google SSO is enabled for now
  const providers = {
    google: process.env.GOOGLE_OAUTH_URL,
    // microsoft: process.env.MICROSOFT_OAUTH_URL,
    // apple: process.env.APPLE_OAUTH_URL,
  };

  const ssoUrl = providers[provider as keyof typeof providers];
  if (!ssoUrl) {
    throw new Error(`Unsupported SSO provider: ${provider}`);
  }

  return ssoUrl;
}

async function generateMagicLink(email: string): Promise<string> {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Store token in database with expiration
  await MagicLinkToken.create({
    email,
    token,
    expiresAt,
    used: false,
    createdAt: new Date(),
  });

  return `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
} 