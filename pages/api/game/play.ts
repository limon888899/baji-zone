import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from '../../../lib/requireAdmin';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ message: 'Method not allowed' }); }
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Please sign in to play.' });

  const amount = req.body?.amount;
  const gameSlug = typeof req.body?.gameId === 'string' ? req.body.gameId : '';
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0 || amount > 10000) {
    return res.status(400).json({ message: 'Bet must be a number between 0 and 10000.' });
  }
  try {
    const game = await prisma.game.findUnique({ where: { slug: gameSlug } });
    if (!game) return res.status(404).json({ message: 'Game not found.' });
    const config = typeof game.config === 'string' ? JSON.parse(game.config) : (game.config as any);
    const multiplier = Number(config?.multiplier ?? 2.4);
    const winChance = Number(config?.winChance ?? 0.35);
    if (!Number.isFinite(multiplier) || multiplier < 0 || !Number.isFinite(winChance) || winChance < 0 || winChance > 1) {
      return res.status(400).json({ message: 'Game configuration is invalid.' });
    }
    const randomWin = Math.random() < winChance;
    const payout = randomWin ? Math.round(amount * multiplier * 100) / 100 : 0;
    const round = Date.now();

    const result = await prisma.$transaction(async (db) => {
      const debit = await db.user.updateMany({
        where: { id: user.id, status: 'ACTIVE', balance: { gte: amount } },
        data: { balance: { decrement: amount } }
      });
      if (debit.count !== 1) return null;
      if (payout > 0) await db.user.update({ where: { id: user.id }, data: { balance: { increment: payout } } });
      await db.gameSession.create({
        data: { userId: user.id, gameId: game.id, amount, status: randomWin ? 'WON' : 'LOST', result: { won: randomWin, payout, round } }
      });
      return { won: randomWin, payout, round };
    });
    if (!result) return res.status(400).json({ message: 'Insufficient balance.' });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Game play failed');
    return res.status(500).json({ message: 'Unable to play this game right now.' });
  }
}
