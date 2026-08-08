'use server';

import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '../../../utils/upload';
import { requireAdminRole } from '../actions';

export async function createCertification(formData: FormData) {
  await requireAdminRole('certifications');
  let image_url = formData.get('image_url') as string;
  const image_file = formData.get('image_file') as File | null;
  if (image_file && image_file.size > 0) {
    const uploadedUrl = await uploadImage(image_file);
    if (uploadedUrl) image_url = uploadedUrl;
  }
  const sort_order = parseInt(formData.get('sort_order') as string || '0', 10);
  
  const name: Record<string, string> = {};
  
  ['En', 'Ar', 'Fr', 'Pl', 'Tr'].forEach(lang => {
    name[lang.toLowerCase()] = (formData.get(`name${lang}`) as string) || '';
  });

  const { error } = await supabase
    .from('certifications')
    .insert({
      image_url,
      name,
      sort_order
    });

  if (error) {
    console.error('Error creating certification:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/certifications');
  revalidatePath('/[locale]/about', 'page');
  return { success: true };
}

export async function deleteCertification(id: string) {
  await requireAdminRole('certifications');
  const { error } = await supabase
    .from('certifications')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/certifications');
  revalidatePath('/[locale]/about', 'page');
  return { success: true };
}

export async function updateCertification(id: string, formData: FormData) {
  await requireAdminRole('certifications');
  const name: Record<string, string> = {};
  
  ['En', 'Ar', 'Fr', 'Pl', 'Tr'].forEach(lang => {
    name[lang.toLowerCase()] = (formData.get(`name${lang}`) as string) || '';
  });
  
  console.log('UPDATING CERTIFICATION ID:', id);
  console.log('NAME OBJECT CONSTRUCTED:', name);
  
  let image_url = formData.get('image_url') as string;
  const image_file = formData.get('image_file') as File | null;
  if (image_file && image_file.size > 0) {
    const uploadedUrl = await uploadImage(image_file);
    if (uploadedUrl) image_url = uploadedUrl;
  }
  const sort_order = parseInt(formData.get('sort_order') as string) || 0;

  const { error } = await supabase
    .from('certifications')
    .update({
      name,
      image_url,
      sort_order
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating certification:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/certifications');
  revalidatePath('/[locale]/about', 'page');
  return { success: true };
}
