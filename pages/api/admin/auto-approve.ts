import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '../../../lib/requireAdmin';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ message: 'Method not allowed' }); }
  const minutes = Number(process.env.AUTO_APPROVE_MINUTES ?? 5);
  if (!Number.isFinite(minutes) || minutes < 5 || minutes > 1440) {
    return res.status(500).json({ success: false, message: 'AUTO_APPROVE_MINUTES must be between 5 and 1440.' });
  }
  try {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    const pending = await prisma.transaction.findMany({
      where: { status: 'PENDING', type: 'DEPOSIT', createdAt: { lt: cutoff } },
      select: { id: true, userId: true, amount: true }
    });
    const results: Array<{ id: string; userId: string; amount: number }> = [];
    for (const tx of pending) {
      const approved = await prisma.$transaction(async (db) => {
        const changed = await db.transaction.updateMany({ where: { id: tx.id, status: 'PENDING', type: 'DEPOSIT' }, data: { status: 'SUCCESS' } });
        if (changed.count !== 1) return false;
        await db.user.update({ where: { id: tx.userId }, data: { balance: { increment: tx.amount } } });
        return true;
      });
      if (approved) results.push({ id: tx.id, userId: tx.userId, amount: tx.amount });
    }
    return res.status(200).json({ success: true, approved: results.length, details: results });
  } catch {
    console.error('Auto-approve failed');
    return res.status(500).json({ success: false, message: 'Auto-approve failed' });
  }
}
