import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;
    if (id) {
      const game = await prisma.game.findUnique({ where: { id: String(id) } });
      return res.status(200).json(game ?? {});
    }

    const games = await prisma.game.findMany({ orderBy: { createdAt: 'desc' } });
    return res.status(200).json(games);
  }

  if (req.method === 'POST') {
    const { slug, titleEn, titleBn, type, config } = req.body;
    if (!slug || !titleEn || !titleBn) return res.status(400).json({ message: 'Missing required fields' });

    const g = await prisma.game.create({ data: { slug, titleEn, titleBn, type: type || 'dice', config: config || {} } });
    return res.status(201).json(g);
  }

  if (req.method === 'PUT') {
    const { id, ...data } = req.body;
    if (!id) return res.status(400).json({ message: 'ID required' });

    const g = await prisma.game.update({
      where: { id },
      data: {
        ...data,
        config: data.config ?? {}
      }
    });

    return res.status(200).json(g);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: 'ID required' });

    const deleted = await prisma.game.delete({ where: { id: String(id) } });
    return res.status(200).json(deleted);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
