import prisma from './db';
import cookie from 'cookie';

export async function getUserFromRequest(req: any) {
  const cookies = cookie.parse(req.headers?.cookie || '');
  const session = cookies.session;
  if (!session) return null;
  try {
    const user = await prisma.user.findUnique({ where: { id: session } });
    return user;
  } catch (e) {
    return null;
  }
}

export async function requireAdmin(req: any, res: any) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== 'ADMIN') {
    res.status(403).json({ message: 'Admin access required' });
    return null;
  }
  return user;
}
