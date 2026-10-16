import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail) ||
      !adminPassword || adminPassword.length < 12 || adminPassword.length > 128) {
    throw new Error('Set ADMIN_EMAIL and a unique ADMIN_PASSWORD (12–128 characters) before running the seed script.');
  }

  const pw = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: pw, role: 'ADMIN', status: 'ACTIVE' },
    create: {
      email: adminEmail, password: pw, name: 'Administrator',
      role: 'ADMIN', status: 'ACTIVE', balance: 0
    }
  });

  await prisma.adminConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      data: {
        site: { name: 'Baji Zone', supportedLang: ['en', 'bn'] },
        gameDefaults: { minBet: 10, maxBet: 10000, payoutMultiplier: 2.4 },
        payment: { defaultGateway: 'stripe', allowManualAdjust: true }
      }
    }
  });

  await prisma.game.upsert({
    where: { slug: 'dice' },
    update: {},
    create: {
      slug: 'dice', titleEn: 'Lucky Dice', titleBn: 'লাকি ডাইস',
      type: 'dice', config: { multiplier: 2.4, winChance: 0.35 }
    }
  });

  await prisma.game.upsert({
    where: { slug: 'slots' },
    update: {},
    create: {
      slug: 'slots', titleEn: 'Classic Slots', titleBn: 'ক্লাসিক স্লটস',
      type: 'slots', config: { reels: 3 }
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
