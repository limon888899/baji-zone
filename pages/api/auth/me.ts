import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const session = cookies.session;
  if (!session) return res.status(200).json({ user: null });

  const user = await prisma.user.findUnique({ where: { id: session } });
  res.status(200).json({ user: user ? { id: user.id, email: user.email, role: user.role } : null });
}
