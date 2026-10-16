import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import prisma from '../../../lib/db';
import { readSessionToken } from '../../../lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ user: null, message: 'Method not allowed' });
  }
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const userId = readSessionToken(cookies.session);
    if (!userId) return res.status(200).json({ user: null });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.status !== 'ACTIVE') return res.status(200).json({ user: null });
    return res.status(200).json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Session lookup failed');
    return res.status(500).json({ user: null, message: 'Unable to check session.' });
  }
}
