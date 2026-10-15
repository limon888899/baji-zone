# Baji Zone — initial scaffold

Baji Zone: rewrite-from-scratch bilingual (Bangla/English) game portal scaffold with admin panel and payment stubs.

Quick start (development)
1. Copy example env:
   cp .env.example .env
   Edit .env with your DB and Stripe test keys.

2. Start with Docker (recommended):
   docker compose up --build

3. Or run locally:
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run prisma:seed
   npm run dev

Default admin
- email: admin@local.com
- password: admin123

What is included in this batch
- package.json, Dockerfile, docker-compose.yml
- .env.example
- prisma/schema.prisma and prisma/seed.ts
- basic README

What I'll deliver next (next batch)
- Landing page (full design), global _app, Tailwind config, i18n helper
- Games hub and each game frontend components (Dice fully working)
- Backend API endpoints (auth, wallet, transactions, game play, admin config)
- Admin panel UI and CRUD endpoints (games, users, payments)
- Payment stubs (Stripe sandbox + placeholders for bKash)
- CI / deploy notes

Notes & security
- This is a development scaffold. Do NOT use test keys or default admin in production.
- Real payment integration requires production keys and PCI compliance.
