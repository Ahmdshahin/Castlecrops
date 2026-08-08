const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const QRCode = require('qrcode');

const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value.length > 0) {
    envVars[key.trim()] = value.join('=').trim().replace(/^"|"$/g, '');
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function backfillQRCodes() {
  console.log('Fetching all products...');
  const { data: products, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  
  let updatedCount = 0;

  for (const product of products) {
    if (!product.qr_code_url) {
      console.log(`Generating QR for product: ${product.slug}`);
      const scanUrl = product.scan_page_slug || `https://castlecrops.com/en/products/${product.slug}`;
      const qrDataUrl = await QRCode.toDataURL(scanUrl, { margin: 2, scale: 8, color: { dark: '#000000', light: '#FFFFFF' } });
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          qr_code_url: qrDataUrl,
          scan_page_slug: scanUrl
        })
        .eq('id', product.id);
        
      if (updateError) {
        console.error(`Failed to update ${product.slug}:`, updateError);
      } else {
        updatedCount++;
      }
    }
  }
  
  console.log(`Finished! Updated ${updatedCount} products with new QR codes.`);
}

backfillQRCodes();
