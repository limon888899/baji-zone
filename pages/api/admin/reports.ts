import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const summary = {
    totalUsers: await prisma.user.count(),
    totalDeposits: await prisma.transaction.count({ where: { type: 'DEPOSIT' } }),
    totalRevenue: await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { status: 'SUCCESS', type: 'DEPOSIT' }
    }),
    totalGames: await prisma.game.count()
  };

  return res.status(200).json({
    ...summary,
    revenue: Number(summary.totalRevenue._sum.amount ?? 0)
  });
}
