"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { locales, localeLabels, type Locale } from "../i18n.config";

const LOCALE_COOKIE = "NEXT_LOCALE";
const LOCALE_STORAGE_KEY = "castlecrops_locale"; // requirement #4 fallback for client-side reads

import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ currentLocale, enabledLocales }: { currentLocale: Locale, enabledLocales: string[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: Locale) {
    if (next === currentLocale) {
      setOpen(false);
      return;
    }
    // Persist choice both ways: cookie for the server (SEO/SSR), localStorage as a client fallback
    // eslint-disable-next-line
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);

    const segments = pathname.split("/");
    segments[1] = next; // first segment after the leading slash is always the locale
    const newPath = segments.join("/") || `/${next}`;

    startTransition(() => {
      router.push(newPath);
      router.refresh();
    });
    setOpen(false);
  }

  return (
    <div className="lang-switcher">
      <button
        className="lang-toggle flex items-center gap-2 text-cream hover:text-gold-bright transition-colors duration-200"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch Language"
        disabled={isPending}
      >
        <span className="globe-icon"><Globe size={24} strokeWidth={1.5} /></span>
        <span className="lang-text flex items-center gap-2">
          <span>{localeLabels[currentLocale].flag}</span>
          <span>{localeLabels[currentLocale].native}</span>
        </span>
      </button>

      {open && (
        <ul className="lang-switcher__menu" role="listbox">
          {locales.filter(loc => enabledLocales.includes(loc)).map((loc) => (
            <li key={loc}>
              <button
                role="option"
                aria-selected={loc === currentLocale}
                onClick={() => switchTo(loc)}
              >
                <span>{localeLabels[loc].flag}</span>
                <span>{localeLabels[loc].native}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/*
Minimal companion styles (adapt to the site's existing gold/black theme):

.lang-switcher { position: relative; }
.lang-switcher__trigger {
  display:flex; align-items:center; gap:8px;
  border:1px solid var(--gold-dim); color:var(--gold-bright); background:transparent;
  padding:7px 14px; font-size:13px; cursor:pointer;
}
.lang-switcher__menu {
  position:absolute; top:110%; inset-inline-end:0; z-index:50;
  background:var(--black-soft); border:1px solid var(--gold-dim);
  list-style:none; margin:0; padding:6px; min-width:160px;
}
.lang-switcher__menu button {
  width:100%; display:flex; gap:10px; align-items:center;
  background:none; border:none; color:var(--cream); padding:9px 10px; cursor:pointer; font-size:14px;
}
.lang-switcher__menu button:hover { background:rgba(201,162,39,0.12); color:var(--gold-bright); }
*/
