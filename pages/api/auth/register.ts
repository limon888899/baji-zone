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
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
  }
  if (password.length < 8 || password.length > 128) {
    return res.status(400).json({ success: false, message: 'Password must be 8–128 characters long.' });
  }

  try {
    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, password: hash, name: email.split('@')[0] } });
    const token = createSessionToken(user.id);
    res.setHeader('Set-Cookie', cookie.serialize('session', token, {
      httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
      path: '/', maxAge: SESSION_TTL_SECONDS
    }));
    return res.status(201).json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }
    console.error('Registration failed');
    return res.status(500).json({ success: false, message: 'Unable to create account right now.' });
  }
}
