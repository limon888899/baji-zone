Deployment (Vercel) — Recommended

I recommend deploying Baji Zone to Vercel for the following reasons:
- First-class Next.js support (serverless / edge functions)
- Easy environment variable management and automatic preview deployments
- Free tier available for testing and staging

Quick setup (recommended — Vercel)
1) Create a Vercel account (https://vercel.com) and connect your GitHub account.
2) Import the repository: limon888899/baji-zone.
3) Set environment variables in the Vercel project settings (Production & Preview):
   - DATABASE_URL (your production Postgres)
   - NEXT_PUBLIC_BASE_URL (https://your-vercel-domain.vercel.app)
   - JWT_SECRET (strong secret)
   - STRIPE_SECRET_KEY (use test keys for sandbox)
   - NEXT_PUBLIC_STRIPE_KEY (publishable test key)
   - STRIPE_WEBHOOK_SECRET (optional for webhook validation)
   - AUTO_APPROVE_MINUTES (optional)
4) Configure a webhook in Stripe to point to: https://your-vercel-domain.vercel.app/api/payments/stripe/webhook (set webhook signing secret in STRIPE_WEBHOOK_SECRET)
5) Deploy — Vercel will build and deploy automatically. After deploy, run migrations & seed via a one-off job or CI step (or run locally and push DB to production):
   - npx prisma migrate deploy
   - npx prisma db seed (or run prisma:seed script)

Notes
- Vercel Serverless functions have execution time limits; heavy jobs (reports/exports) should be offloaded to background workers or run via server cron.
- For maximum control, a Docker-based VPS (DigitalOcean, AWS ECS, or Render.com) is an alternative.

How I integrated your provided logo
- I updated the Header component to load `/logo.png` from the `public/` folder.
- Please add the image you provided (the large Bazi Zone circular logo) to the repository at `public/logo.png`.
  - On your machine: save the image (right-click → Save as) as `logo.png`, then place it into the `public/` folder of the project.
  - Commit & push:
    git add public/logo.png
    git commit -m "Add brand logo"
    git push

If you'd like, I can add the logo to the repo for you — either upload it if you grant me access here, or you can paste the file via the GitHub web UI.

If you want me to complete the deploy flow on Vercel for you, say "Deploy to Vercel" and I will prepare: 
- Vercel project setup instructions with exact environment variables,
- a GitHub Actions workflow (optional) to run migrations & seed after deploy,
- instructions to configure Stripe webhooks.

Summary of next steps I will take (automatic with sandbox/placeholder):
- Continue using sandbox placeholders for payments (Stripe test keys).
- Keep developing game engines (Dice, Slots, Card Flip) and admin features.
- Integrate your logo after you add `public/logo.png` (or I can upload it with your permission).
- Prepare a Vercel-ready deploy config and a step-by-step deploy guide (or run it for you if you request).

If you want me to proceed now to configure Vercel and finalize the deploy files, reply: "Deploy to Vercel" — otherwise upload the `logo.png` to `public/` and I'll finish styling to match the design.