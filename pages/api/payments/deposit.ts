import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { userId, amount, gateway } = req.body;

  try {
    const transaction = await prisma.transaction.create({ data: { userId: userId ?? 'demo-user', type: 'DEPOSIT', amount: Number(amount), status: 'PENDING', meta: { gateway, source: 'api' } } });

    return res.status(200).json({ success: true, transaction });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Deposit failed' });
  }
}
