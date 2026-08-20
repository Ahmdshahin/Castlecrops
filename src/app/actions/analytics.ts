'use server';

import { headers } from 'next/headers';
import { supabaseAdmin as supabase } from '../../services/supabaseAdmin';

export async function logPageVisit(path: string, userAgent?: string) {
  try {
    const headersList = await headers();
    const country = headersList.get('x-vercel-ip-country') || headersList.get('cf-ipcountry') || 'Unknown';

    // Only log public facing pages, ignore admin, api, _next paths etc.
    if (path.startsWith('/admin') || path.startsWith('/api') || path.startsWith('/_next')) {
      return { success: true, ignored: true };
    }

    const { error } = await supabase
      .from('page_visits')
      .insert([
        {
          path,
          user_agent: userAgent || 'Unknown',
          country
        }
      ]);

    if (error) {
      console.error('Failed to log page visit:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to log page visit:', error);
    return { success: false, error: 'Internal Server Error' };
  }
}
