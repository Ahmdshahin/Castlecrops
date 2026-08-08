'use server';

import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '../../../utils/upload';
import { requireAdminRole } from '../actions';
import { logAdminAction } from '../../../lib/auditLogger';

export async function createCategory(formData: FormData) {
  await requireAdminRole('categories');
  const slug = formData.get('slug') as string;
  let image_url = formData.get('image_url') as string;
  const image_file = formData.get('image_file') as File | null;
  if (image_file && image_file.size > 0) {
    const uploadedUrl = await uploadImage(image_file);
    if (uploadedUrl) image_url = uploadedUrl;
  }
  const sort_order = parseInt(formData.get('sort_order') as string || '0', 10);
  const is_featured = formData.get('is_featured') === 'on';
  
  const name: Record<string, string | null> = {};
  const description: Record<string, string | null> = {};
  
  ['En', 'Ar', 'Fr', 'Pl', 'Tr'].forEach(lang => {
    name[lang.toLowerCase()] = formData.get(`name${lang}`) as string;
    description[lang.toLowerCase()] = formData.get(`desc${lang}`) as string;
  });

  const { error } = await supabase
    .from('categories')
    .insert({
      slug,
      name,
      description,
      image_url: image_url || null,
      sort_order,
      is_featured
    });

  if (error) {
    console.error('Error creating category:', error);
    return { success: false, error: error.message };
  }

  await logAdminAction('CREATE_CATEGORY', { slug });

  revalidatePath('/admin/categories');
  revalidatePath('/[locale]/products', 'page');
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdminRole('categories');
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminAction('DELETE_CATEGORY', { id });

  revalidatePath('/admin/categories');
  revalidatePath('/[locale]/products', 'page');
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdminRole('categories');
  const slug = formData.get('slug') as string;
  const name: Record<string, string | null> = {};
  const description: Record<string, string | null> = {};

  ['En', 'Ar', 'Fr', 'Pl', 'Tr'].forEach(lang => {
    name[lang.toLowerCase()] = formData.get(`name${lang}`) as string;
    description[lang.toLowerCase()] = formData.get(`desc${lang}`) as string;
  });

  let image_url = formData.get('image_url') as string;
  const image_file = formData.get('image_file') as File | null;
  if (image_file && image_file.size > 0) {
    const uploadedUrl = await uploadImage(image_file);
    if (uploadedUrl) image_url = uploadedUrl;
  }
  
  const sort_order = parseInt(formData.get('sort_order') as string) || 0;
  const is_featured = formData.get('is_featured') === 'on';

  const { error } = await supabase
    .from('categories')
    .update({
      slug,
      name,
      description,
      image_url: image_url || null,
      sort_order,
      is_featured
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating category:', error);
    return { error: error.message };
  }

  await logAdminAction('UPDATE_CATEGORY', { id, slug });

  revalidatePath('/admin/categories');
  revalidatePath('/[locale]/products', 'page');
  return { success: true };
}
