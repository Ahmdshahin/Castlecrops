'use server';

import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { requireAdminRole } from '../actions';

export async function updateFarmsGallery(galleryJson: string) {
  await requireAdminRole('farmsGallery');
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 'farms_gallery', value: galleryJson, updated_at: new Date().toISOString() });
      
    if (error) {
      return { success: false, error: error.message };
    }
    
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
    return { url };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}
