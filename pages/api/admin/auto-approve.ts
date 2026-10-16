import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '../../../lib/requireAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  // Deposits must only be credited after a trusted payment provider confirms settlement.
  // Time-based approval can credit unpaid/manual deposits and is unsafe in production.
  return res.status(410).json({
    success: false,
    message: 'Automatic deposit approval is disabled. Use verified payment-provider webhooks or manually reconcile the payment before approval.'
  });
}
