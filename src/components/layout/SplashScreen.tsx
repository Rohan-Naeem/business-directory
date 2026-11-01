'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// First-visit splash only: shown once per browser session when the site
// is first entered, never on in-app navigation and never on every click.
// sessionStorage is used on purpose, so a new visit shows it again.
export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('gbh_splash_shown')) return;
    } catch {
      return;
    }
    setVisible(true);
    const progressTimer = setTimeout(() => setProgress(100), 50);
    const hideTimer = setTimeout(() => {
      try {
        sessionStorage.setItem('gbh_splash_shown', '1');
      } catch {
        // Splash is cosmetic; ignore storage failures.
      }
      setVisible(false);
    }, 1900);
    return () => {
      clearTimeout(progressTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
      <Image
        src="/logo.svg"
        alt="Global Bizz Hub logo"
        width={140}
        height={140}
        className="w-[140px] h-[140px]"
        priority
      />
      <p className="mt-4 text-2xl font-bold text-[#172B45]">Global Bizz Hub</p>
      <p className="mt-1 text-sm text-slate-500">Pakistan • USA • UK</p>
      <div className="mt-8 h-2 w-56 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[#2563EB] transition-all duration-[1700ms] ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
