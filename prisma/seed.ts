import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const pw = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@local.com' },
    update: {},
    create: {
      email: 'admin@local.com',
      password: pw,
      name: 'Administrator',
      role: 'ADMIN',
      balance: 10000
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

  // sample games
  await prisma.game.upsert({
    where: { slug: 'dice' },
    update: {},
    create: {
      slug: 'dice',
      titleEn: 'Lucky Dice',
      titleBn: 'লাকি ডাইস',
      type: 'dice',
      config: { multiplier: 2.4, winChance: 0.35 }
    }
  });

  await prisma.game.upsert({
    where: { slug: 'slots' },
    update: {},
    create: {
      slug: 'slots',
      titleEn: 'Classic Slots',
      titleBn: 'ক্লাসিক স্লটস',
      type: 'slots',
      config: { reels: 3 }
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
