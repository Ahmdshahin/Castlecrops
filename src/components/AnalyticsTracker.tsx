'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { logPageVisit } from '../app/actions/analytics';

export function AnalyticsTracker() {
  const pathname = usePathname();
  // Using a ref to prevent strict mode double-firing from logging twice
  const trackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Only track if we haven't tracked this specific path yet on this render cycle
    if (trackedPath.current !== pathname) {
      trackedPath.current = pathname;
      const userAgent = window.navigator.userAgent;
      
      // Fire and forget, fetch country from client-side API as fallback for non-Vercel hosting
      fetch('https://get.geojs.io/v1/ip/country.json')
        .then(res => res.json())
        .then(data => {
          logPageVisit(pathname, userAgent, data.country).catch(() => {});
        })
        .catch(() => {
          logPageVisit(pathname, userAgent).catch(() => {});
        });
    }
  }, [pathname]);

  return null;
}
