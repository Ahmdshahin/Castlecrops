'use server';

import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { requireAdminRole } from '../actions';
import { logAdminAction } from '../../../lib/auditLogger';
import { uploadPdf } from '../../../utils/upload';

export async function updateSettings(formData: FormData) {
  await requireAdminRole('settings');
  const updatesMap = new Map<string, string[]>();
  
  for (const [key, value] of formData.entries()) {
    if (key === 'catalog_pdf_file' && value instanceof File && value.size > 0) {
      const url = await uploadPdf(value);
      if (url) {
        updatesMap.set('catalog_pdf_url', [url]);
      }
      continue;
    }

    if (typeof value === 'string' && !key.startsWith('$ACTION_ID_')) {
      if (!updatesMap.has(key)) {
        updatesMap.set(key, []);
      }
      if (value.trim() !== '') {
        updatesMap.get(key)!.push(value.trim());
      }
    }
  }

  // Ensure fields that were submitted as completely empty strings are saved as empty strings
  const updates = Array.from(updatesMap.entries()).map(([id, values]) => ({
    id,
    value: values.join('\n')
  }));

  const { error } = await supabase
    .from('site_settings')
    .upsert(updates, { onConflict: 'id' });

  if (error) {
    console.error('Error updating settings:', error);
    return { success: false, error: error.message };
  }

  await logAdminAction('UPDATE_SETTINGS', { updated_keys: updates.map(u => u.id) });

  revalidatePath('/', 'layout'); // Revalidate everything so headers/footers catch the new settings
  return { success: true };
}
