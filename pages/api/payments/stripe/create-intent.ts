import type { NextApiRequest, NextApiResponse } from 'next';

// Legacy endpoint disabled: it accepted a caller-supplied userId and could create
// unverified payment intents. Use the authenticated checkout-session endpoint.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Allow', 'POST');
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  return res.status(410).json({
    message: 'This legacy payment endpoint is disabled. Use /api/payments/stripe/create-checkout-session.'
  });
}
