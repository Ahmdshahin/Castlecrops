'use client';

import { Link2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ShareButtons({ title, locale = 'en' }: { title: string, locale?: string }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const shareTextMap: Record<string, string> = {
    en: 'Share:',
    ar: 'شارك:',
    fr: 'Partager:',
    tr: 'Paylaş:',
    pl: 'Udostępnij:'
  };
  const shareText = shareTextMap[locale] || 'Share:';

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Only render on client to avoid hydration mismatch with window.location
  if (!url) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 mt-10 pt-6 border-t border-gold-dim/20 w-full" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <span className="text-sm font-semibold text-cream-dim mr-2 uppercase tracking-widest">{shareText}</span>
      
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-black-soft border border-gold/30 text-cream hover:text-gold-bright hover:border-gold transition-all shadow-[0_0_10px_rgba(201,162,39,0.05)] hover:shadow-[0_0_15px_rgba(201,162,39,0.2)]" aria-label="Share on Facebook">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      </a>
      
      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-black-soft border border-gold/30 text-cream hover:text-gold-bright hover:border-gold transition-all shadow-[0_0_10px_rgba(201,162,39,0.05)] hover:shadow-[0_0_15px_rgba(201,162,39,0.2)]" aria-label="Share on X (Twitter)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
        </svg>
      </a>
      
      <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-black-soft border border-gold/30 text-cream hover:text-gold-bright hover:border-gold transition-all shadow-[0_0_10px_rgba(201,162,39,0.05)] hover:shadow-[0_0_15px_rgba(201,162,39,0.2)]" aria-label="Share on LinkedIn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      </a>

      {/* WhatsApp Custom SVG */}
      <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-black-soft border border-gold/30 text-cream hover:text-gold-bright hover:border-gold transition-all shadow-[0_0_10px_rgba(201,162,39,0.05)] hover:shadow-[0_0_15px_rgba(201,162,39,0.2)]" aria-label="Share on WhatsApp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </a>
      
      <button onClick={copyToClipboard} className="p-3 rounded-full bg-black-soft border border-gold/30 text-cream hover:text-gold-bright hover:border-gold transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(201,162,39,0.05)] hover:shadow-[0_0_15px_rgba(201,162,39,0.2)] relative" aria-label="Copy link">
        {copied ? <Check size={18} className="text-green-500" /> : <Link2 size={18} />}
        {copied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-green-400 bg-black-soft border border-green-500/30 px-2 py-1 rounded">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}
