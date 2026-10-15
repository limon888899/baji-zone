import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '../../../lib/requireAdmin';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    // Auto-approve pending deposits older than X minutes (configurable)
    const olderThanMinutes = Number(process.env.AUTO_APPROVE_MINUTES ?? 5);
    const cutoff = new Date(Date.now() - olderThanMinutes * 60 * 1000);

    const pending = await prisma.transaction.findMany({ where: { status: 'PENDING', type: 'DEPOSIT', createdAt: { lt: cutoff } } });

    const results: any[] = [];

    for (const tx of pending) {
      const updated = await prisma.transaction.update({ where: { id: tx.id }, data: { status: 'SUCCESS' } });
      // increment user balance
      await prisma.user.update({ where: { id: tx.userId }, data: { balance: { increment: tx.amount } as any } });
      results.push({ id: tx.id, userId: tx.userId, amount: tx.amount });
    }

    return res.status(200).json({ success: true, approved: results.length, details: results });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Auto-approve failed' });
  }
}
