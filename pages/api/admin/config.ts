import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const cfg = await prisma.adminConfig.findUnique({ where: { id: 1 } });
    return res.status(200).json(cfg ?? { id: 1, data: {} });
  } else if (req.method === 'POST') {
    const { data } = req.body;
    const up = await prisma.adminConfig.upsert({ where: { id: 1 }, update: { data }, create: { data } });
    return res.status(200).json(up);
  }
  return res.status(405).end();
}
