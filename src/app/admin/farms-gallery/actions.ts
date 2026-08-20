'use server';

import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { requireAdminRole } from '../actions';
import { logAdminAction } from '../../../lib/auditLogger';

export async function updateFarmsGallery(galleryJson: string) {
  await requireAdminRole('farmsGallery');
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 'farms_gallery', value: galleryJson, updated_at: new Date().toISOString() });
      
    if (error) {
      return { success: false, error: error.message };
    }
    
    let details = {};
    try {
      const parsed = JSON.parse(galleryJson);
      details = {
        total_items_saved: parsed.length,
        items_summary: parsed.map((item: Record<string, unknown>) => item.type).join(', ')
      };
    } catch {
      // ignore parse error
    }
    
    await logAdminAction('UPDATE_FARMS_GALLERY', details);
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

import { uploadImage } from '../../../utils/upload';

export async function uploadFarmsGalleryImage(formData: FormData) {
  await requireAdminRole('farmsGallery');
  try {
    const file = formData.get('file') as File | null;
    if (!file) return { error: 'No file provided' };
    
    if (file.size > 1.5 * 1024 * 1024) {
      return { error: 'Image size must be less than 1.5 MB.' };
    }
    const url = await uploadImage(file);
    await logAdminAction('UPLOAD_FARMS_GALLERY_IMAGE', { url });
    return { url };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}
