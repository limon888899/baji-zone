import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from './db';
import cookie from 'cookie';
import { readSessionToken } from './session';

export async function getUserFromRequest(req: NextApiRequest) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const userId = readSessionToken(cookies.session);
  if (!userId) return null;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.status !== 'ACTIVE') return null;
    return user;
  } catch {
    return null;
  }
}

export async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== 'ADMIN') {
    res.status(user ? 403 : 401).json({ message: 'Admin access required' });
    return null;
  }
  return user;
}
