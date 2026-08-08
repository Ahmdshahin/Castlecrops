'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useAccessibilityPreferences, TextSize } from '../hooks/useAccessibilityPreferences';

const ToggleSwitch = ({ checked, onChange, label }: { checked: boolean, onChange: () => void, label: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-cream text-sm">{label}</span>
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-none transition-colors border border-gold-dim focus:outline-none focus:border-gold ${checked ? 'bg-gold' : 'bg-black-matte'}`}
    >
      <span className="sr-only">{label}</span>
      <span
        className={`inline-block h-3 w-3 transform rounded-none transition-transform ${
          checked ? 'translate-x-5 bg-black-matte' : 'translate-x-1 bg-gold-dim'
        } rtl:-translate-x-1 rtl:data-[checked=true]:-translate-x-5`}
      />
    </button>
  </div>
);

export const AccessibilityWidget = () => {
  const t = useTranslations('a11y');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  const { preferences, updatePreference, resetPreferences, isLoaded } = useAccessibilityPreferences();

  // Focus trap and escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }
      
      if (e.key === 'Tab' && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isLoaded) return null;

  const positionClasses = isRtl ? 'bottom-6 right-6' : 'bottom-6 left-6';
  const panelPositionClasses = isRtl ? 'bottom-16 right-0' : 'bottom-16 left-0';

  return (
    <div className={`fixed z-50 ${positionClasses}`}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="a11y-panel"
        aria-label={t('openLabel')}
        className="w-14 h-14 bg-black-matte border border-gold-dim rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-black-matte transition-colors focus:outline-none focus:border-gold"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="4" r="2"></circle>
          <path d="M16 8H8c-1.1 0-2 .9-2 2v2h2v7h2v-7h4v7h2v-7h2v-2c0-1.1-.9-2-2-2z"></path>
        </svg>
      </button>

      {isOpen && (
        <div
          id="a11y-panel"
          ref={panelRef}
          role="dialog"
          aria-label={t('title')}
          className={`absolute ${panelPositionClasses} w-72 bg-black-soft border border-gold-dim p-5 flex flex-col gap-5`}
        >
          <div className="flex justify-between items-center border-b border-gold-dim pb-3">
            <h2 className="text-gold-bright font-serif-latin text-lg m-0">{t('title')}</h2>
            <button 
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label={t('close')}
              className="text-cream-dim hover:text-gold"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Text Size */}
          <div className="flex flex-col gap-2">
            <span className="text-cream text-sm">{t('textSize')}</span>
            <div className="flex gap-2">
              {(['normal', 'large', 'extra-large'] as TextSize[]).map((size) => (
                <button
                  key={size}
                  aria-pressed={preferences.textSize === size}
                  onClick={() => updatePreference('textSize', size)}
                  className={`flex-1 py-1 text-xs border transition-colors ${
                    preferences.textSize === size 
                      ? 'bg-gold text-black-matte border-gold' 
                      : 'bg-transparent text-cream border-gold-dim hover:border-gold'
                  }`}
                >
                  {size === 'normal' ? t('textSizeNormal') : size === 'large' ? t('textSizeLarge') : t('textSizeExtraLarge')}
                </button>
              ))}
            </div>
          </div>

          <ToggleSwitch 
            label={t('highContrast')} 
            checked={preferences.highContrast} 
            onChange={() => updatePreference('highContrast', !preferences.highContrast)} 
          />
          <ToggleSwitch 
            label={t('reduceMotion')} 
            checked={preferences.reduceMotion} 
            onChange={() => updatePreference('reduceMotion', !preferences.reduceMotion)} 
          />
          <ToggleSwitch 
            label={t('readableFont')} 
            checked={preferences.readableFont} 
            onChange={() => updatePreference('readableFont', !preferences.readableFont)} 
          />
          <ToggleSwitch 
            label={t('underlineLinks')} 
            checked={preferences.underlineLinks} 
            onChange={() => updatePreference('underlineLinks', !preferences.underlineLinks)} 
          />

          <button 
            onClick={resetPreferences}
            className="mt-2 py-2 text-sm text-gold border border-gold hover:bg-gold hover:text-black-matte transition-colors w-full"
          >
            {t('reset')}
          </button>
        </div>
      )}
    </div>
  );
};
