import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const settings = await prisma.adminConfig.findUnique({ where: { id: 1 } });
    return res.status(200).json(settings ?? { id: 1, data: { brand: 'Baji Zone', defaultLanguage: 'bn', security: { twofa: true } } });
  }

  if (req.method === 'POST') {
    const { data } = req.body;
    const updated = await prisma.adminConfig.upsert({
      where: { id: 1 },
      update: { data },
      create: { data }
    });
    return res.status(200).json(updated);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
