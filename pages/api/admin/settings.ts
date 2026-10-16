import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '../../../lib/requireAdmin';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  if (req.method === 'GET') {
    const settings = await prisma.adminConfig.findUnique({ where: { id: 1 } });
    return res.status(200).json(settings ?? { id: 1, data: { brand: 'Baji Zone', defaultLanguage: 'bn' } });
  }
  if (req.method === 'POST') {
    if (!req.body || typeof req.body.data !== 'object' || req.body.data === null || Array.isArray(req.body.data)) {
      return res.status(400).json({ message: 'A valid settings object is required.' });
    }
    const updated = await prisma.adminConfig.upsert({ where: { id: 1 }, update: { data: req.body.data }, create: { data: req.body.data } });
    return res.status(200).json(updated);
  }
  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ message: 'Method not allowed' });
}
