'use client';

import { useAdminT } from './AdminLangProvider';
import { Languages } from 'lucide-react';

export function AdminLangSwitcher() {
  const { lang } = useAdminT();

  const toggleLang = () => {
    const nextLang = lang === 'en' ? 'ar' : 'en';
    document.cookie = `admin_lang=${nextLang}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-2 text-cream hover:text-gold transition-colors p-2 rounded-2xl focus:outline-none"
      title={`Switch to ${lang === 'en' ? 'Arabic' : 'English'}`}
    >
      <Languages size={18} className="text-gold-dim" />
      <span className="text-sm tracking-widest uppercase font-semibold">
        {lang === 'en' ? 'عربي' : 'EN'}
      </span>
    </button>
  );
}
