const { Client } = require('pg');
async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres:GEbPDETiHh3GGZHv@db.nocischkvnhxkzpaockq.supabase.co:5432/postgres'
  });
  await client.connect();
  await client.query(`
    UPDATE page_visits 
    SET country = (ARRAY['EG', 'US', 'GB', 'AE', 'SA', 'FR', 'DE', 'IT', 'ES', 'BR', 'IN', 'CN', 'JP', 'AU', 'CA', 'RU', 'ZA'])[floor(random() * 17) + 1]
    WHERE country = 'Unknown' OR country IS NULL
  `);
  console.log('Updated existing visits with random countries.');
  await client.end();
}
main();
