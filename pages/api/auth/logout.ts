import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  res.setHeader('Set-Cookie', cookie.serialize('session', '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 }));
  res.status(200).json({ success: true });
}
