import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { amount, gameId, userId } = req.body ?? {};
  const bet = Number(amount || 0);

  // get game config
  const game = await prisma.game.findUnique({ where: { slug: gameId } });
  const multiplier = game?.config?.multiplier ?? 2.4;
  const winChance = game?.config?.winChance ?? 0.35;

  const randomWin = Math.random() < winChance;
  const payout = randomWin ? Math.round(bet * multiplier) : 0;

  const result = { won: randomWin, payout, round: Date.now() };

  await prisma.gameSession.create({ data: { userId: userId ?? 'demo-user', gameId: gameId ?? 'dice', amount: bet, status: randomWin ? 'WON' : 'LOST', result } });

  return res.status(200).json({ success: true, ...result });
}
