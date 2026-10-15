# Production & Deployment notes

This document explains how to prepare and deploy Baji Zone to production. Do NOT use default seeds or test keys in production.

1) Environment variables
- DATABASE_URL: PostgreSQL connection string (production DB)
- NEXT_PUBLIC_BASE_URL: e.g., https://your-domain.com
- JWT_SECRET: strong random secret for session cookies
- STRIPE_SECRET_KEY: live Stripe secret key (starts with sk_live_...)
- NEXT_PUBLIC_STRIPE_KEY: publishable key (pk_live_...)
- STRIPE_WEBHOOK_SECRET: webhook signing secret from Stripe
- AUTO_APPROVE_MINUTES: integer minutes for auto-approve script (optional)

2) Recommended deploy targets
- Vercel: easiest for Next.js apps. Set environment variables in Vercel dashboard. Use docker only if you need custom infra.
- Docker: use the provided Dockerfile and docker-compose for self-hosting. Ensure you run under HTTPS and have a reverse proxy.

3) Stripe
- Use test keys while testing. Add webhook endpoint in Stripe dashboard pointing to /api/payments/stripe/webhook and set the webhook secret as STRIPE_WEBHOOK_SECRET.
- For Checkout, set success_url and cancel_url in the session creation.

4) Security hardening checklist (minimum)
- Use HTTPS and HSTS.
- Store secrets in environment variables or a secret manager.
- Enforce strong passwords and rotate default admin after initial setup.
- Enable rate limiting and monitoring.
- Add 2FA for admin accounts (not included by default).
- Implement CSRF protection on state-changing endpoints (cookie + token patterns).

5) Database migrations
- Use Prisma migrate for schema changes. Backup DB before migrating in production.

6) Monitoring & logging
- Integrate application logs with a logging service and capture errors. Use alerts for failed webhooks or payment anomalies.

7) PCI & Payments
- Do not store card details. Use Stripe Checkout or Elements. Follow Stripe's compliance guidance for PCI DSS.

8) Rollout
- Create a staging environment. Use feature flags for risky changes. Run smoke tests after deploy.

If you want, I can prepare a Vercel deploy configuration and a sample GitHub Actions workflow to deploy on push to main (requires setting secrets in repo settings).