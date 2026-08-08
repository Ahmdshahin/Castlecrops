require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function uploadFile(localPath, bucketName) {
  const fullPath = path.join(__dirname, 'public', localPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Not found: ${fullPath}`);
    return null;
  }

  const fileData = fs.readFileSync(fullPath);
  const ext = path.extname(fullPath);
  const fileName = path.basename(fullPath);
  
  const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : ext === '.svg' ? 'image/svg+xml' : 'image/jpeg';
  
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, fileData, {
      contentType: contentType,
      upsert: true
    });

  if (error) {
    console.error(`Error uploading ${localPath}:`, error.message);
    return null;
  }

  const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
  return publicData.publicUrl;
}

async function migrate() {
  const tables = [
    { name: 'products', col: 'image_url' },
    { name: 'categories', col: 'image_url' },
    { name: 'blog_posts', col: 'cover_image_url' },
    { name: 'certifications', col: 'image_url' }
  ];

  let totalUpdated = 0;

  for (const t of tables) {
    const { data: rows, error: fetchError } = await supabase.from(t.name).select(`id, ${t.col}`);
    if (fetchError || !rows) continue;

    for (const row of rows) {
      const currentUrl = row[t.col];
      if (currentUrl && currentUrl.startsWith('/images/')) {
        console.log(`Migrating ${t.name} ID ${row.id} image: ${currentUrl}`);
        const publicUrl = await uploadFile(currentUrl, 'media');
        if (publicUrl) {
          const { error: updateError } = await supabase
            .from(t.name)
            .update({ [t.col]: publicUrl })
            .eq('id', row.id);
          
          if (updateError) {
            console.error(`Failed to update DB for ${row.id}:`, updateError.message);
          } else {
            console.log(`  -> Updated to ${publicUrl}`);
            totalUpdated++;
          }
        }
      }
    }
  }

  // Also upload the blog_bg.jpg, hero_bg.jpg, products_bg.jpg just to have them in gallery
  const otherImages = [
    '/images/blog_bg.jpg',
    '/images/farms/hero_bg.jpg',
    '/images/products/products_bg.jpg'
  ];
  for (const img of otherImages) {
    console.log(`Uploading background image: ${img}`);
    await uploadFile(img, 'media');
  }

  console.log(`Migration complete. Updated ${totalUpdated} rows.`);
}

migrate();
