import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getUserFromRequest } from '../../../../lib/requireAdmin';
import prisma from '../../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ message: 'Method not allowed' }); }
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Please sign in to continue.' });
  const amount = req.body?.amount;
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 1 || amount > 1000000) {
    return res.status(400).json({ message: 'Invalid amount.' });
  }
  if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_BASE_URL) {
    return res.status(503).json({ message: 'Payments are not configured.' });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
  try {
    const transaction = await prisma.transaction.create({
      data: { userId: user.id, type: 'DEPOSIT', amount, status: 'PENDING', meta: { source: 'stripe' } }
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: { currency: 'usd', product_data: { name: 'Baji Zone deposit' }, unit_amount: Math.round(amount * 100) },
        quantity: 1
      }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/cancel`,
      client_reference_id: transaction.id,
      metadata: { transactionId: transaction.id, userId: user.id }
    });
    await prisma.transaction.update({ where: { id: transaction.id }, data: { meta: { source: 'stripe', checkoutSessionId: session.id } } });
    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout creation failed');
    return res.status(502).json({ message: 'Unable to start payment.' });
  }
}
