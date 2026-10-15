import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import prisma from '../../../../lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-08-16' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { amount, userId } = req.body;
  if (!amount || Number(amount) <= 0) return res.status(400).json({ message: 'Invalid amount' });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{ price_data: { currency: 'usd', product_data: { name: `Deposit ${amount}` }, unit_amount: Math.round(Number(amount) * 100) }, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/cancel`,
      metadata: { userId: userId || 'demo-user' }
    });

    // create a pending transaction linked to this session
    const tx = await prisma.transaction.create({ data: { userId: userId || 'demo-user', type: 'DEPOSIT', amount: Number(amount), status: 'PENDING', meta: { checkoutSessionId: session.id } } });

    return res.status(200).json({ url: session.url, sessionId: session.id, transaction: tx });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'stripe_error' });
  }
}
