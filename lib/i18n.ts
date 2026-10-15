export type Lang = 'en' | 'bn';

const dictionaries = {
  en: {
    nav: { home: 'Home', game: 'Game', admin: 'Admin', login: 'Login' },
    home: {
      headline: 'Welcome to Baji Zone',
      sub: 'Play, manage, and control your gaming world.',
      play: 'Play now',
      lang: 'বাংলা'
    },
    game: {
      title: 'Game Area',
      subtitle: 'This is the gameplay section.',
      start: 'Start game',
      balance: 'Balance'
    },
    admin: {
      heading: 'Admin Dashboard',
      sub: 'Control users, deposits, payouts, and game rules.'
    },
    auth: {
      signIn: 'Sign in',
      email: 'Email',
      password: 'Password'
    }
  },
  bn: {
    nav: { home: 'হোম', game: 'গেম', admin: 'অ্যাডমিন', login: 'লগইন' },
    home: {
      headline: 'বাজি জোনে স্বাগতম',
      sub: 'গেম খেলুন, পরিচালনা করুন, সবকিছু নিয়ন্ত্রণ করুন।',
      play: 'এখন খেলুন',
      lang: 'English'
    },
    game: {
      title: 'গেম এলাকা',
      subtitle: 'এখানে গেমের gameplay থাকবে।',
      start: 'গেম শুরু করুন',
      balance: 'ব্যালান্স'
    },
    admin: {
      heading: 'অ্যাডমিন ড্যাশবোর্ড',
      sub: 'ইউজার, ডিপোজিট, পেমেন্ট ও গেম রুল নিয়ন্ত্রণ করুন।'
    },
    auth: {
      signIn: 'লগইন করুন',
      email: 'ইমেইল',
      password: 'পাসওয়ার্ড'
    }
  }
};

export function getText(lang: Lang, key: string) {
  const parts = key.split('.');
  let value: any = dictionaries[lang];
  for (const part of parts) {
    value = value?.[part];
  }
  return value ?? key;
}
