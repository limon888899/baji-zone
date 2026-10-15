import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import Header from '../components/Header';

export default function App({ Component, pageProps }: AppProps) {
  const [lang, setLang] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as 'en' | 'bn' | null;
    if (saved === 'bn' || saved === 'en') setLang(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  return (
    <>
      <Header lang={lang} setLang={setLang} />
      <Component {...pageProps} lang={lang} />
    </>
  );
}
