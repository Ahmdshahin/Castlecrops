'use client';

import React, { createContext, useContext } from 'react';
import { adminDict, AdminLang, AdminTranslation } from '../../lib/admin-i18n';

interface AdminLangContextType {
  lang: AdminLang;
  t: AdminTranslation;
  isRtl: boolean;
}

const AdminLangContext = createContext<AdminLangContextType>({
  lang: 'en',
  t: adminDict.en,
  isRtl: false
});

export const AdminLangProvider = ({ 
  lang, 
  children 
}: { 
  lang: AdminLang, 
  children: React.ReactNode 
}) => {
  const t = adminDict[lang] || adminDict.en;
  const isRtl = lang === 'ar';
  
  return (
    <AdminLangContext.Provider value={{ lang, t, isRtl }}>
      <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full h-full flex flex-1 overflow-hidden">
        {children}
      </div>
    </AdminLangContext.Provider>
  );
};

export const useAdminT = () => useContext(AdminLangContext);
