import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import prisma from '../../../lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-08-16' });

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const buf = await new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

  const sig = req.headers['stripe-signature'] as string | undefined;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  let event: Stripe.Event;
  try {
    if (!webhookSecret) {
      // fallback - try to parse JSON
      event = JSON.parse(buf.toString()) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(buf, sig || '', webhookSecret);
    }
  } catch (err) {
    console.error('webhook signature error', err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const pi = event.data.object as Stripe.PaymentIntent;
      const metaUser = pi.metadata?.userId;
      // find transaction by meta
      const tx = await prisma.transaction.findFirst({ where: { meta: { path: ['stripePI'], equals: pi.id } } } as any).catch(()=> null);
      if (tx) {
        await prisma.transaction.update({ where: { id: tx.id }, data: { status: 'SUCCESS' } });
        await prisma.user.update({ where: { id: tx.userId }, data: { balance: { increment: tx.amount } as any } });
      }
      break;
    case 'payment_intent.payment_failed':
      // handle
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}
