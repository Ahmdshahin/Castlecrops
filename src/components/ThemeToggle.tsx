'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ThemeToggle() {
  const [theme, setThemeState] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    // eslint-disable-next-line
    setThemeState(currentTheme);
  }, []);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
    document.documentElement.setAttribute('data-theme', newTheme);
    router.refresh(); // Tell Next.js to refresh server components with the new cookie
  };

  if (!theme) {
    return <div style={{ width: 40, height: 40 }}></div>;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="theme-toggle-btn p-2 text-cream hover:text-gold-bright transition-colors duration-200"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={24} strokeWidth={1.5} /> : <Moon size={24} strokeWidth={1.5} />}
    </button>
  );
}
