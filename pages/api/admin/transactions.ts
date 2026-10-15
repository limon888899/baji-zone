import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const txs = await prisma.transaction.findMany({ orderBy: { createdAt: 'desc' } });
    return res.status(200).json(txs);
  }

  if (req.method === 'PUT') {
    const { id, status } = req.body;
    const updated = await prisma.transaction.update({ where: { id }, data: { status } });
    // optionally apply to user balance on success
    if (status === 'SUCCESS') {
      const tx = await prisma.transaction.findUnique({ where: { id } });
      if (tx) await prisma.user.update({ where: { id: tx.userId }, data: { balance: { increment: tx.amount } as any } });
    }
    return res.status(200).json(updated);
  }

  return res.status(405).end();
}
