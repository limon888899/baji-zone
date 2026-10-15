import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import prisma from '../../../lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-08-16' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { amount, userId, currency = 'usd' } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({ amount: Math.round(Number(amount) * 100), currency, metadata: { userId } });

    const tx = await prisma.transaction.create({ data: { userId: userId ?? 'demo-user', type: 'DEPOSIT', amount: Number(amount), status: 'PENDING', meta: { stripePI: paymentIntent.id } } });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret, transaction: tx });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'stripe_error' });
  }
}
