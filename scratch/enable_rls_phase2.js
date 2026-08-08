const { Client } = require('pg');

const sql = `
-- 1. Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- admin_users has no public read policies. Only the service role key will be able to access it.
`;

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres:GEbPDETiHh3GGZHv@db.nocischkvnhxkzpaockq.supabase.co:5432/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to DB. Applying Phase 2 RLS policies...');
    await client.query(sql);
    console.log('Successfully enabled RLS and created policies for Phase 2.');
  } catch (err) {
    console.error('Error applying RLS:', err);
  } finally {
    await client.end();
  }
}

main();
