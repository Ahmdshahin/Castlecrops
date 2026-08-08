const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres:GEbPDETiHh3GGZHv@db.nocischkvnhxkzpaockq.supabase.co:5432/postgres'
  });

  try {
    await client.connect();
    
    console.log('Seeding farms_gallery into site_settings...');
    
    const initialData = [
      { id: '1', type: 'image', url: '/images/farms/farm_scene.jpg', isFeatured: false },
      { id: '2', type: 'video', url: 'https://www.youtube.com/embed/ScMzIvxBSi4', isFeatured: true },
      { id: '3', type: 'image', url: '/images/farms/date_palm.jpg', isFeatured: false },
      { id: '4', type: 'image', url: '/images/farms/olive_orchard.jpg', isFeatured: false },
      { id: '5', type: 'image', url: '/images/farms/olive_oil_process.jpg', isFeatured: false }
    ];
    
    await client.query(`
      INSERT INTO site_settings (id, value) 
      VALUES ($1, $2)
      ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value
    `, ['farms_gallery', JSON.stringify(initialData)]);
    
    console.log('Successfully seeded farms_gallery into site_settings.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
