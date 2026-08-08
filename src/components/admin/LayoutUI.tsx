'use client';
import { usePathname } from 'next/navigation';

import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { AdminLangSwitcher } from './AdminLangSwitcher';
import { useAdminT } from './AdminLangProvider';
import { AdminSidebar } from './AdminSidebar';
import Link from 'next/link';

export function LayoutUI({ 
  children, 
  roles,
  logoutAction
}: { 
  children: React.ReactNode, 
  roles?: string[],
  logoutAction?: (payload: FormData) => void
}) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login' || pathname === '/admin/forgot-password' || pathname === '/admin/reset-password';
  const { t, lang } = useAdminT();
  const isRtl = lang === 'ar';
  
  const [isPinned, setIsPinned] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const saved = localStorage.getItem('sidebar_pinned');
    if (saved !== null) {
      setIsPinned(saved === 'true');
    }
  }, []);

  const togglePin = () => {
    const newState = !isPinned;
    setIsPinned(newState);
    localStorage.setItem('sidebar_pinned', String(newState));
  };

  return (
    <>
      {!isLogin && (
        <aside 
          data-pinned={isPinned}
          className={`group/sidebar relative z-40 transition-all duration-300 shrink-0 h-full bg-black-soft border-l border-r border-gold-dim flex flex-col gap-6 overflow-y-auto overflow-x-hidden ${isPinned ? 'w-64 p-4' : 'w-20 py-4 px-2'} ${mounted ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className={`flex items-center ${isPinned ? 'justify-between mb-2' : 'justify-center mb-2'}`}>
            <div className={`text-gold-bright font-serif-latin text-2xl font-bold whitespace-nowrap transition-opacity duration-300 ${isPinned ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
              Castle Crops
            </div>
            
            <button 
              onClick={togglePin}
              className={`p-2 text-gold-dim hover:text-gold transition-colors bg-black-soft hover:bg-black-matte rounded-xl border border-gold-dim/20 shrink-0`}
              title={isPinned ? "Collapse sidebar" : "Expand sidebar"}
              aria-label={isPinned ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isPinned ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              )}
            </button>
          </div>

          <AdminSidebar roles={roles} isPinned={isPinned} />

          <div className="mt-auto border-t border-gold-dim/30 pt-4 w-full">
            <form action={logoutAction} className="flex">
              <button type="submit" className={`text-red-400 hover:text-red-300 transition-colors flex items-center gap-3 py-2 w-full rounded-lg ${isPinned ? 'px-4' : 'justify-center'}`} title="Logout">
                <svg className={`w-5 h-5 shrink-0 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className={`whitespace-nowrap transition-all duration-300 ${isPinned ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                  Logout
                </span>
              </button>
            </form>
          </div>
        </aside>
      )}
      <main className={"flex-1 overflow-y-auto bg-black-matte relative" + (isLogin ? " flex items-center justify-center p-0" : " p-10")}>
        {!isLogin && (
          <div className="absolute top-6 ltr:right-10 rtl:left-10 z-50 flex items-center gap-4 bg-black-soft/50 backdrop-blur px-4 py-2 rounded-2xl border border-gold-dim/20">
            <Link
              href={`/${lang}`}
              target="_blank"
              className="text-sm text-cream hover:text-gold transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              <span className="hidden sm:inline whitespace-nowrap">{t.sidebar.backToWebsite}</span>
            </Link>
            <div className="w-px h-4 bg-gold-dim/30 mx-1"></div>
            <AdminLangSwitcher />
            <ThemeToggle />
          </div>
        )}
        <div className={!isLogin ? "pt-2" : ""}>
          {children}
        </div>
      </main>
    </>
  );
}
