import { cache } from 'react';
import { supabaseAdmin as supabase } from './supabaseAdmin';

export const getSiteSettings = cache(async () => {
  const { data: settingsData, error } = await supabase.from('site_settings').select('*');
  
  if (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }
  
  const settings = settingsData?.reduce((acc: Record<string, string>, curr) => {
    acc[curr.id] = curr.value;
    return acc;
  }, {}) || {};

  return settings;
});
