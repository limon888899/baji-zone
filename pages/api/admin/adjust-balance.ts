import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '../../../lib/requireAdmin';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { userId, amount, reason } = req.body;
  if (!userId || typeof amount !== 'number') return res.status(400).json({ message: 'userId and numeric amount required' });

  try {
    // create adjustment transaction
    const tx = await prisma.transaction.create({
      data: {
        userId,
        type: 'ADJUSTMENT',
        amount: Number(amount),
        status: 'SUCCESS',
        meta: { reason, adjustedBy: admin.id }
      }
    });

    // update user balance
    await prisma.user.update({ where: { id: userId }, data: { balance: { increment: amount } as any } });

    return res.status(200).json({ success: true, transaction: tx });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Adjustment failed' });
  }
}
