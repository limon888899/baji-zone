import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const [users, txs, games] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.aggregate({ _sum: { amount: true } }),
    prisma.game.count()
  ]);

  return res.status(200).json({
    users,
    deposits: await prisma.transaction.count({ where: { type: 'DEPOSIT' } }),
    revenue: Number(txs._sum.amount ?? 0),
    games
  });
}
