import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '../../../lib/requireAdmin';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ message: 'Method not allowed' }); }
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  try {
    const [totalUsers, totalDeposits, totalRevenue, totalGames] = await Promise.all([
      prisma.user.count(),
      prisma.transaction.count({ where: { type: 'DEPOSIT', status: 'SUCCESS' } }),
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: 'SUCCESS', type: 'DEPOSIT' } }),
      prisma.game.count()
    ]);
    return res.status(200).json({ totalUsers, totalDeposits, totalRevenue, totalGames, revenue: Number(totalRevenue._sum.amount ?? 0) });
  } catch {
    return res.status(500).json({ message: 'Unable to load admin reports.' });
  }
}
