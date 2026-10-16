import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/db';
import cookie from 'cookie';
import { createSessionToken, SESSION_TTL_SECONDS } from '../../../lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password || password.length > 128) {
    return res.status(400).json({ success: false, message: 'Enter a valid email and password.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, message: 'This account is not active.' });
    }

    const token = createSessionToken(user.id);
    res.setHeader('Set-Cookie', cookie.serialize('session', token, {
      httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
      path: '/', maxAge: SESSION_TTL_SECONDS
    }));
    return res.status(200).json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ success: false, message: 'Unable to sign in right now.' });
  }
}
