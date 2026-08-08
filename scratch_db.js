const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    
    console.log('Creating farms_gallery table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS farms_gallery (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        type text NOT NULL CHECK (type IN ('image', 'video')),
        media_url text NOT NULL,
        sort_order int DEFAULT 0,
        is_featured boolean DEFAULT false,
        created_at timestamptz DEFAULT now()
      );
      
      ALTER TABLE farms_gallery ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Enable read access for all users" ON farms_gallery;
      CREATE POLICY "Enable read access for all users" ON farms_gallery FOR SELECT USING (true);
    `);
    
    console.log('Seeding initial placeholder data...');
    const res = await client.query('SELECT COUNT(*) FROM farms_gallery');
    if (parseInt(res.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO farms_gallery (type, media_url, sort_order, is_featured)
        VALUES 
        ('image', '/images/farms/farm_scene.jpg', 1, false),
        ('video', 'https://www.youtube.com/embed/ScMzIvxBSi4', 2, true),
        ('image', '/images/farms/date_palm.jpg', 3, false),
        ('image', '/images/farms/olive_orchard.jpg', 4, false),
        ('image', '/images/farms/olive_oil_process.jpg', 5, false);
      `);
    }

    console.log('Successfully created farms_gallery table.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
