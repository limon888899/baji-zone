import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import prisma from '../../../lib/db';
import { readSessionToken } from '../../../lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET' && req.method !== 'PUT') {
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const userId = readSessionToken(cookies.session);
    if (!userId) return res.status(401).json({ message: 'Authentication required.' });
    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, status: true } });
    if (!actor || actor.status !== 'ACTIVE' || actor.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required.' });
    }

    if (req.method === 'GET') {
      const txs = await prisma.transaction.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, email: true } } }
      });
      return res.status(200).json(txs);
    }

    const id = typeof req.body?.id === 'string' ? req.body.id : '';
    const status = req.body?.status;
    if (!id || (status !== 'SUCCESS' && status !== 'FAILED')) {
      return res.status(400).json({ message: 'A valid transaction ID and final status are required.' });
    }

    const result = await prisma.$transaction(async (db) => {
      const tx = await db.transaction.findUnique({ where: { id } });
      if (!tx) return { error: 'NOT_FOUND' as const };
      if (tx.status !== 'PENDING') return { error: 'ALREADY_FINAL' as const, currentStatus: tx.status };

      const changed = await db.transaction.updateMany({
        where: { id, status: 'PENDING' },
        data: { status }
      });
      if (changed.count !== 1) return { error: 'ALREADY_FINAL' as const, currentStatus: 'PROCESSED' };

      if (status === 'SUCCESS' && tx.type === 'DEPOSIT') {
        await db.user.update({ where: { id: tx.userId }, data: { balance: { increment: tx.amount } } });
      }
      return { transaction: { ...tx, status } };
    });

    if ('error' in result && result.error === 'NOT_FOUND') return res.status(404).json({ message: 'Transaction not found.' });
    if ('error' in result && result.error === 'ALREADY_FINAL') {
      return res.status(409).json({ message: 'Transaction has already been processed.', status: result.currentStatus });
    }
    return res.status(200).json(('transaction' in result) ? result.transaction : null);
  } catch (error) {
    console.error('Admin transaction operation failed');
    return res.status(500).json({ message: 'Unable to process transaction.' });
  }
}
