'use server';

import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '../../../utils/upload';
import { requireAdminRole } from '../actions';
import { logAdminAction } from '../../../lib/auditLogger';

export async function createBlogPost(formData: FormData) {
  await requireAdminRole('blog');
  const titleEn = formData.get('titleEn') as string;
  const titleAr = formData.get('titleAr') as string;
  const titleFr = formData.get('titleFr') as string;
  const titlePl = formData.get('titlePl') as string;
  const titleTr = formData.get('titleTr') as string;
  const excerptEn = formData.get('excerptEn') as string;
  const excerptAr = formData.get('excerptAr') as string;
  const excerptFr = formData.get('excerptFr') as string;
  const excerptPl = formData.get('excerptPl') as string;
  const excerptTr = formData.get('excerptTr') as string;
  const bodyEn = formData.get('bodyEn') as string;
  const bodyAr = formData.get('bodyAr') as string;
  const bodyFr = formData.get('bodyFr') as string;
  const bodyPl = formData.get('bodyPl') as string;
  const bodyTr = formData.get('bodyTr') as string;
  const slug = formData.get('slug') as string;
  const status = formData.get('status') as string;
  
  const metaTitleEn = formData.get('metaTitleEn') as string;
  const metaDescEn = formData.get('metaDescEn') as string;
  const ogImageUrl = formData.get('ogImageUrl') as string;
  
  let cover_image_url = formData.get('cover_image_url') as string;
  const image_file = formData.get('image_file') as File | null;
  if (image_file && image_file.size > 0) {
    const uploadedUrl = await uploadImage(image_file);
    if (uploadedUrl) cover_image_url = uploadedUrl;
  }

  const is_featured = formData.get('is_featured') === 'on';

  const payload: Record<string, unknown> = {
    slug,
    title: { en: titleEn, ar: titleAr, fr: titleFr, pl: titlePl, tr: titleTr },
    excerpt: { en: excerptEn, ar: excerptAr, fr: excerptFr, pl: excerptPl, tr: excerptTr },
    body: { en: bodyEn, ar: bodyAr, fr: bodyFr, pl: bodyPl, tr: bodyTr },
    cover_image_url: cover_image_url || null,
    status,
    is_featured,
    meta_title: { en: metaTitleEn },
    meta_description: { en: metaDescEn },
    og_image_url: ogImageUrl || null
  };

  if (status === 'published') {
    payload.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('blog_posts')
    .insert(payload);

  if (error) {
    console.error('Error creating post:', error);
    return { error: error.message };
  }

  await logAdminAction('CREATE_BLOG_POST', { slug });

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  await requireAdminRole('blog');
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction('DELETE_BLOG_POST', { id });

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  return { success: true };
}

export async function updateBlogPost(id: string, formData: FormData) {
  await requireAdminRole('blog');
  const titleEn = formData.get('titleEn') as string;
  const titleAr = formData.get('titleAr') as string;
  const titleFr = formData.get('titleFr') as string;
  const titlePl = formData.get('titlePl') as string;
  const titleTr = formData.get('titleTr') as string;
  const excerptEn = formData.get('excerptEn') as string;
  const excerptAr = formData.get('excerptAr') as string;
  const excerptFr = formData.get('excerptFr') as string;
  const excerptPl = formData.get('excerptPl') as string;
  const excerptTr = formData.get('excerptTr') as string;
  const bodyEn = formData.get('bodyEn') as string;
  const bodyAr = formData.get('bodyAr') as string;
  const bodyFr = formData.get('bodyFr') as string;
  const bodyPl = formData.get('bodyPl') as string;
  const bodyTr = formData.get('bodyTr') as string;
  const slug = formData.get('slug') as string;
  const status = formData.get('status') as string;
  
  const metaTitleEn = formData.get('metaTitleEn') as string;
  const metaDescEn = formData.get('metaDescEn') as string;
  const ogImageUrl = formData.get('ogImageUrl') as string;
  
  let cover_image_url = formData.get('cover_image_url') as string;
  const image_file = formData.get('image_file') as File | null;
  if (image_file && image_file.size > 0) {
    const uploadedUrl = await uploadImage(image_file);
    if (uploadedUrl) cover_image_url = uploadedUrl;
  }

  const is_featured = formData.get('is_featured') === 'on';

  const payload: Record<string, unknown> = {
    slug,
    title: { en: titleEn, ar: titleAr, fr: titleFr, pl: titlePl, tr: titleTr },
    excerpt: { en: excerptEn, ar: excerptAr, fr: excerptFr, pl: excerptPl, tr: excerptTr },
    body: { en: bodyEn, ar: bodyAr, fr: bodyFr, pl: bodyPl, tr: bodyTr },
    cover_image_url: cover_image_url || null,
    status,
    is_featured,
    meta_title: { en: metaTitleEn },
    meta_description: { en: metaDescEn },
    og_image_url: ogImageUrl || null
  };

  if (status === 'published') {
    // Only set if not already published (optional logic), but safe to just touch it or leave it
    // For simplicity, we just won't override it if updating to published unless we explicitly want to change the date
  }

  const { error } = await supabase
    .from('blog_posts')
    .update(payload)
    .eq('id', id);

  if (error) {
    console.error('Error updating post:', error);
    return { error: error.message };
  }

  await logAdminAction('UPDATE_BLOG_POST', { id, slug });

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  return { success: true };
}
