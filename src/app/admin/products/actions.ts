'use server';

import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '../../../utils/upload';
import QRCode from 'qrcode';
import { requireAdminRole } from '../actions';
import { logAdminAction } from '../../../lib/auditLogger';

export async function createProduct(formData: FormData) {
  await requireAdminRole('products');
  const nameEn = formData.get('nameEn') as string;
  const nameAr = formData.get('nameAr') as string;
  const nameFr = formData.get('nameFr') as string;
  const namePl = formData.get('namePl') as string;
  const nameTr = formData.get('nameTr') as string;
  const descEn = formData.get('descEn') as string;
  const descAr = formData.get('descAr') as string;
  const descFr = formData.get('descFr') as string;
  const descPl = formData.get('descPl') as string;
  const descTr = formData.get('descTr') as string;
  const category = formData.get('category') as string;
  const slug = formData.get('slug') as string;
  
  const metaTitleEn = formData.get('metaTitleEn') as string;
  const metaDescEn = formData.get('metaDescEn') as string;
  const ogImageUrl = formData.get('ogImageUrl') as string;
  
  let image_url = formData.get('image_url') as string;
  const image_file = formData.get('image_file') as File | null;
  if (image_file && image_file.size > 0) {
    const uploadedUrl = await uploadImage(image_file);
    if (uploadedUrl) image_url = uploadedUrl;
  }
  const sort_order = parseInt(formData.get('sort_order') as string) || 0;
  
  const packagingRaw = formData.get('packaging_options') as string;
  const packaging_options = packagingRaw.split(',').map(s => s.trim()).filter(Boolean);

  let scan_page_slug = formData.get('scan_page_slug') as string;
  if (!scan_page_slug || scan_page_slug.trim() === '') {
    scan_page_slug = `https://castlecrops.com/en/products/${slug}`;
  }
  const qr_code_url = await QRCode.toDataURL(scan_page_slug, { margin: 2, scale: 8, color: { dark: '#000000', light: '#FFFFFF' } });

  const { error } = await supabase
    .from('products')
    .insert({
      slug,
      category,
      name: { en: nameEn, ar: nameAr, fr: nameFr, pl: namePl, tr: nameTr },
      description: { en: descEn, ar: descAr, fr: descFr, pl: descPl, tr: descTr },
      packaging_options,
      sort_order,
      image_url: image_url || null,
      scan_page_slug,
      qr_code_url,
      meta_title: { en: metaTitleEn },
      meta_description: { en: metaDescEn },
      og_image_url: ogImageUrl || null
    });

  if (error) {
    console.error('Error creating product:', error);
    return { error: error.message };
  }

  await logAdminAction('CREATE_PRODUCT', { slug, category });

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAdminRole('products');
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction('DELETE_PRODUCT', { id });

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdminRole('products');
  const name = {
    en: formData.get('nameEn'),
    ar: formData.get('nameAr'),
    fr: formData.get('nameFr'),
    pl: formData.get('namePl'),
    tr: formData.get('nameTr'),
  };

  const description = {
    en: formData.get('descEn'),
    ar: formData.get('descAr'),
    fr: formData.get('descFr'),
    pl: formData.get('descPl'),
    tr: formData.get('descTr'),
  };
  
  let image_url = formData.get('image_url') as string;
  const image_file = formData.get('image_file') as File | null;
  if (image_file && image_file.size > 0) {
    const uploadedUrl = await uploadImage(image_file);
    if (uploadedUrl) image_url = uploadedUrl;
  }
  
  const metaTitleEn = formData.get('metaTitleEn') as string;
  const metaDescEn = formData.get('metaDescEn') as string;
  const ogImageUrl = formData.get('ogImageUrl') as string;

  const packaging_options = (formData.get('packaging_options') as string)
    .split(',')
    .map(o => o.trim());

  let scan_page_slug = formData.get('scan_page_slug') as string;
  if (!scan_page_slug || scan_page_slug.trim() === '') {
    scan_page_slug = `https://castlecrops.com/en/products/${formData.get('slug')}`;
  }
  const qr_code_url = await QRCode.toDataURL(scan_page_slug, { margin: 2, scale: 8, color: { dark: '#000000', light: '#FFFFFF' } });

  const { error } = await supabase.from('products').update({
    slug: formData.get('slug') as string,
    category: formData.get('category') as string,
    name,
    description,
    image_url: image_url || null,
    packaging_options,
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
    scan_page_slug,
    qr_code_url,
    meta_title: { en: metaTitleEn },
    meta_description: { en: metaDescEn },
    og_image_url: ogImageUrl || null
  }).eq('id', id);

  if (error) {
    console.error('Error updating product:', error);
    return { error: error.message };
  }

  await logAdminAction('UPDATE_PRODUCT', { id, slug: formData.get('slug') });

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}
