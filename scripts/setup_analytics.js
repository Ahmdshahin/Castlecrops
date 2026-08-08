const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres:GEbPDETiHh3GGZHv@db.nocischkvnhxkzpaockq.supabase.co:5432/postgres"
  });

  try {
    await client.connect();
    
    console.log('Creating page_visits table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS page_visits (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        path text NOT NULL,
        user_agent text,
        created_at timestamptz DEFAULT now()
      );
      
      -- Add index on created_at for fast queries
      CREATE INDEX IF NOT EXISTS idx_page_visits_created_at ON page_visits(created_at);
      
      -- Optional: RLS policies (in case you want to use supabase JS to read it)
      ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
      
      -- Allow anonymous inserts if using supabase client (though we'll use server actions so service role bypasses RLS)
      DROP POLICY IF EXISTS "Enable insert for all" ON page_visits;
      CREATE POLICY "Enable insert for all" ON page_visits FOR INSERT WITH CHECK (true);
    `);
    
    console.log('Successfully created page_visits table.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
