'use server';

import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { uploadImage } from '../../../utils/upload';
import { requireAdminRole } from '../actions';
import { revalidatePath } from 'next/cache';

export async function uploadGalleryImage(formData: FormData) {
  await requireAdminRole('gallery');
  const image_file = formData.get('image_file') as File | null;
  if (!image_file || image_file.size === 0) {
    return { success: false, error: 'No file provided' };
  }

  try {
    const uploadedUrl = await uploadImage(image_file);
    if (!uploadedUrl) {
      return { success: false, error: 'Upload failed' };
    }
    revalidatePath('/admin/gallery');
    return { success: true, url: uploadedUrl };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteGalleryImage(filename: string, fullUrl: string) {
  await requireAdminRole('gallery');
  const usages: string[] = [];

  // 1. Check Products
  const { data: products } = await supabase
    .from('products')
    .select('name')
    .eq('image_url', fullUrl);
  if (products && products.length > 0) {
    usages.push(`Products: ${products.map(p => (p.name as Record<string, string>)?.en || 'Unnamed').join(', ')}`);
  }

  // 2. Check Categories
  const { data: categories } = await supabase
    .from('categories')
    .select('name')
    .eq('image_url', fullUrl);
  if (categories && categories.length > 0) {
    usages.push(`Categories: ${categories.map(c => (c.name as Record<string, string>)?.en || 'Unnamed').join(', ')}`);
  }

  // 3. Check Blog Posts
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('title')
    .eq('cover_image_url', fullUrl);
  if (blogPosts && blogPosts.length > 0) {
    usages.push(`Blog Posts: ${blogPosts.map(b => (b.title as Record<string, string>)?.en || 'Unnamed').join(', ')}`);
  }

  // 4. Check Certifications
  const { data: certs } = await supabase
    .from('certifications')
    .select('name')
    .eq('image_url', fullUrl);
  if (certs && certs.length > 0) {
    usages.push(`Certifications: ${certs.map(c => (c.name as Record<string, string>)?.en || 'Unnamed').join(', ')}`);
  }

  if (usages.length > 0) {
    return { 
      success: false, 
      inUse: true, 
      message: 'This image cannot be deleted because it is currently in use.',
      usages 
    };
  }

  // Safe to delete
  const { error: dbError } = await supabase.from('media_gallery').delete().eq('url', fullUrl);
  if (dbError) return { success: false, inUse: false, message: dbError.message };

  const { error } = await supabase.storage.from('media').remove([filename]);
  
  if (error) {
    console.error('Delete error:', error);
    return { success: false, inUse: false, message: error.message };
  }

  revalidatePath('/admin/gallery');
  return { success: true };
}
