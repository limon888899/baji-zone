import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import prisma from '../../../lib/db';
import { readSessionToken } from '../../../lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const userId = readSessionToken(cookies.session);
    if (!userId) return res.status(401).json({ message: 'Authentication required.' });
    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, status: true } });
    if (!actor || actor.status !== 'ACTIVE' || actor.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required.' });
    }
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, status: true, balance: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Admin user listing failed');
    return res.status(500).json({ message: 'Unable to load users.' });
  }
}
