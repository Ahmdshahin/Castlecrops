'use server';

import { supabaseAdmin as supabase } from '../services/supabaseAdmin';
export async function uploadImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  
  // Security Check 1: File Size Limit (e.g. 5 MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds the 5MB limit.');
  }

  // Security Check 2: MIME Type Whitelist
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WEBP, GIF, and SVG are allowed.');
  }
  
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Security Check 3: Strict Extension extraction based on MIME type to prevent bypassing
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg'
  };
  const ext = mimeToExt[file.type] || 'png';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  
  const { error } = await supabase.storage
    .from('media')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false
    });
    
  if (error) {
    console.error('Upload Error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
  
  const { data: publicUrlData } = supabase.storage
    .from('media')
    .getPublicUrl(fileName);
    
  return publicUrlData.publicUrl;
}

export async function uploadPdf(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  
  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB limit for PDF
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds the 15MB limit.');
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Invalid file type. Only PDF is allowed.');
  }
  
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const fileName = `catalog-${Date.now()}-${Math.random().toString(36).substring(7)}.pdf`;
  
  const { error } = await supabase.storage
    .from('media')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false
    });
    
  if (error) {
    console.error('Upload Error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
  
  const { data: publicUrlData } = supabase.storage
    .from('media')
    .getPublicUrl(fileName);
    
  return publicUrlData.publicUrl;
}

export async function getGalleryImages(): Promise<{ name: string, url: string, created_at: string | null }[]> {
  const { data: files, error } = await supabase.storage
    .from('media')
    .list('', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    });

  if (error || !files) {
    console.error('Error fetching gallery images:', error);
    return [];
  }

  // Filter out the `.emptyFolderPlaceholder` if it exists
  const validFiles = files.filter(f => f.name !== '.emptyFolderPlaceholder');

  return validFiles.map(file => {
    const { data } = supabase.storage.from('media').getPublicUrl(file.name);
    return {
      name: file.name,
      url: data.publicUrl,
      created_at: file.created_at
    };
  });
}
