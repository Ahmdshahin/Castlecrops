'use client';

import { useState, useEffect } from 'react';

export type TextSize = 'normal' | 'large' | 'extra-large';

export interface A11yPreferences {
  textSize: TextSize;
  highContrast: boolean;
  reduceMotion: boolean;
  readableFont: boolean;
  underlineLinks: boolean;
}

export const defaultPreferences: A11yPreferences = {
  textSize: 'normal',
  highContrast: false,
  reduceMotion: false,
  readableFont: false,
  underlineLinks: false,
};

export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState<A11yPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('castle_crops_a11y');
      if (stored) {
        // eslint-disable-next-line
        setPreferences(prev => ({ ...prev, ...JSON.parse(stored) }));
      }
    } catch (e) {
      console.warn('Could not load accessibility preferences', e);
    }
    setIsLoaded(true);
  }, []);

  // Sync to localStorage and DOM whenever preferences change
  useEffect(() => {
    if (!isLoaded || !preferences) return;

    try {
      const prefString = JSON.stringify(preferences);
      localStorage.setItem('castle_crops_a11y', prefString);
      if (prefString) {
        document.cookie = `castle_crops_a11y=${encodeURIComponent(prefString)}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch (e) {
      console.warn('Could not save accessibility preferences', e);
    }

    const html = document.documentElement;
    if (html) {
      html.setAttribute('data-a11y-text-size', (preferences.textSize || 'normal').toString());
      html.setAttribute('data-a11y-high-contrast', String(!!preferences.highContrast));
      html.setAttribute('data-a11y-reduce-motion', String(!!preferences.reduceMotion));
      html.setAttribute('data-a11y-readable-font', String(!!preferences.readableFont));
      html.setAttribute('data-a11y-underline-links', String(!!preferences.underlineLinks));
    }

  }, [preferences, isLoaded]);

  const updatePreference = <K extends keyof A11yPreferences>(key: K, value: A11yPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return {
    preferences,
    updatePreference,
    resetPreferences,
    isLoaded
  };
}
