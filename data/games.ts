export type GameDef = {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  type: 'dice' | 'slots' | 'card';
  thumbnail?: string;
};

const games: GameDef[] = [
  {
    id: 'g-dice-001',
    slug: 'dice',
    titleEn: 'Lucky Dice',
    titleBn: 'লাকি ডাইস',
    descriptionEn: 'Roll the dice — win multipliers based on outcome.',
    descriptionBn: 'ডাইস গড়ান — ফলাফল অনুযায়ী পুরস্কার পাবেন।',
    type: 'dice',
    thumbnail: '/images/games/dice.png'
  },
  {
    id: 'g-slots-001',
    slug: 'slots',
    titleEn: 'Classic Slots',
    titleBn: 'ক্লাসিক স্লটস',
    descriptionEn: 'Three-reel slot machine. (Coming soon)',
    descriptionBn: 'থ্রি-রিল স্লট মেশিন। (শীঘ্রই আসছে)',
    type: 'slots',
    thumbnail: '/images/games/slots.png'
  },
  {
    id: 'g-card-001',
    slug: 'card-flip',
    titleEn: 'Card Flip',
    titleBn: 'কর্ড ফ্লিপ',
    descriptionEn: 'Flip a card, guess color to win. (Coming soon)',
    descriptionBn: 'কার্ড উল্টান, রং অনুমান করে জিতুন। (শীঘ্রই আসছে)',
    type: 'card',
    thumbnail: '/images/games/card.png'
  }
];

export default games;
