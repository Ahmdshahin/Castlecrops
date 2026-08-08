"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Global component that silently tracks network status.
 * When the user regains an internet connection after being offline,
 * it automatically revalidates the current route to fetch fresh data.
 */
export function NetworkStatusTracker() {
  const router = useRouter();

  useEffect(() => {
    // Only run in the browser
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      // Re-fetch Server Components and revalidate stale data silently
      router.refresh();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [router]);

  return null;
}
