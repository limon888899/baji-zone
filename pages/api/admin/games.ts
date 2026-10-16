import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '../../../lib/requireAdmin';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    const { id } = req.query;
    if (id) {
      const game = await prisma.game.findUnique({ where: { id: String(id) } });
      return res.status(game ? 200 : 404).json(game ?? { message: 'Game not found' });
    }
    return res.status(200).json(await prisma.game.findMany({ orderBy: { createdAt: 'desc' } }));
  }
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  if (req.method === 'POST') {
    const { slug, titleEn, titleBn, type, config } = req.body ?? {};
    if (typeof slug !== 'string' || !slug.trim() || typeof titleEn !== 'string' || !titleEn.trim() || typeof titleBn !== 'string' || !titleBn.trim()) {
      return res.status(400).json({ message: 'Slug and both titles are required.' });
    }
    try {
      const game = await prisma.game.create({ data: { slug: slug.trim(), titleEn: titleEn.trim(), titleBn: titleBn.trim(), type: typeof type === 'string' ? type : 'dice', config: config ?? {} } });
      return res.status(201).json(game);
    } catch {
      return res.status(400).json({ message: 'Could not create game. Check the slug and fields.' });
    }
  }
  if (req.method === 'PUT') {
    const { id, ...data } = req.body ?? {};
    if (typeof id !== 'string' || !id) return res.status(400).json({ message: 'ID required' });
    const allowed: Record<string, unknown> = {};
    for (const key of ['slug', 'titleEn', 'titleBn', 'type', 'thumbnail', 'config']) {
      if (key in data) allowed[key] = data[key];
    }
    try {
      return res.status(200).json(await prisma.game.update({ where: { id }, data: allowed }));
    } catch {
      return res.status(404).json({ message: 'Game not found or invalid fields.' });
    }
  }
  if (req.method === 'DELETE') {
    const id = typeof req.query.id === 'string' ? req.query.id : '';
    if (!id) return res.status(400).json({ message: 'ID required' });
    try {
      return res.status(200).json(await prisma.game.delete({ where: { id } }));
    } catch {
      return res.status(404).json({ message: 'Game not found.' });
    }
  }
  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  return res.status(405).json({ message: 'Method not allowed' });
}
