import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  if (method === 'GET') {
    const games = await prisma.game.findMany();
    return res.status(200).json(games);
  }

  if (method === 'POST') {
    const { slug, titleEn, titleBn, type, config } = req.body;
    const game = await prisma.game.create({ data: { slug, titleEn, titleBn, type, config } });
    return res.status(201).json(game);
  }

  if (method === 'PUT') {
    const { id, data } = req.body;
    const updated = await prisma.game.update({ where: { id }, data });
    return res.status(200).json(updated);
  }

  if (method === 'DELETE') {
    const { id } = req.query;
    const del = await prisma.game.delete({ where: { id: String(id) } });
    return res.status(200).json(del);
  }

  return res.status(405).end();
}
