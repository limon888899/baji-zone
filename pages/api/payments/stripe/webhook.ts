import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import prisma from '../../../../lib/db';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({ message: 'Stripe webhook is not configured.' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
  let body: Buffer;
  try {
    body = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer | string) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });
  } catch {
    return res.status(400).json({ message: 'Unable to read webhook request.' });
  }

  let event: Stripe.Event;
  try {
    const signature = req.headers['stripe-signature'];
    if (typeof signature !== 'string') return res.status(400).json({ message: 'Missing Stripe signature.' });
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).json({ message: 'Invalid Stripe webhook signature.' });
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== 'paid') return res.status(200).json({ received: true });
  const transactionId = session.metadata?.transactionId || session.client_reference_id;
  const metadataUserId = session.metadata?.userId;
  if (!transactionId || !metadataUserId || session.currency !== 'usd' || typeof session.amount_total !== 'number') {
    return res.status(400).json({ message: 'Payment session metadata is invalid.' });
  }

  try {
    await prisma.$transaction(async (db) => {
      const tx = await db.transaction.findUnique({ where: { id: transactionId } });
      if (!tx || tx.type !== 'DEPOSIT' || tx.userId !== metadataUserId) {
        throw new Error('Payment transaction mismatch');
      }
      if (Math.round(tx.amount * 100) !== session.amount_total) {
        throw new Error('Payment amount mismatch');
      }
      const changed = await db.transaction.updateMany({
        where: { id: tx.id, status: 'PENDING', type: 'DEPOSIT' },
        data: { status: 'SUCCESS', meta: { source: 'stripe', checkoutSessionId: session.id } }
      });
      if (changed.count === 1) {
        await db.user.update({ where: { id: tx.userId }, data: { balance: { increment: tx.amount } } });
      }
    });
  } catch {
    return res.status(500).json({ message: 'Unable to process payment event.' });
  }
  return res.status(200).json({ received: true });
}
