import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from '../../../lib/requireAdmin';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ message: 'Method not allowed' }); }
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Please sign in to continue.' });

  const amount = req.body?.amount;
  const gateway = typeof req.body?.gateway === 'string' ? req.body.gateway.slice(0, 40) : 'manual';
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 1 || amount > 1000000) {
    return res.status(400).json({ success: false, message: 'Deposit amount must be between 1 and 1000000.' });
  }
  try {
    const transaction = await prisma.transaction.create({
      data: { userId: user.id, type: 'DEPOSIT', amount, status: 'PENDING', meta: { gateway, source: 'api' } }
    });
    return res.status(201).json({ success: true, transaction });
  } catch {
    return res.status(500).json({ success: false, message: 'Deposit failed' });
  }
}
