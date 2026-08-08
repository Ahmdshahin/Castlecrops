const { Client } = require('pg');

const sql = `
-- Drop existing policies if they exist (to avoid conflicts when running multiple times)
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
DROP POLICY IF EXISTS "Allow public read access to blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public read access to certifications" ON public.certifications;
DROP POLICY IF EXISTS "Allow public read access to site_settings" ON public.site_settings;

-- 1. Enable Row Level Security (RLS) on all public tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 2. Create Policies to allow public read access (SELECT) for content tables
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to blog_posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Allow public read access to site_settings" ON public.site_settings FOR SELECT USING (true);
`;

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres:GEbPDETiHh3GGZHv@db.nocischkvnhxkzpaockq.supabase.co:5432/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to DB. Applying RLS policies...');
    await client.query(sql);
    console.log('Successfully enabled RLS and created policies.');
  } catch (err) {
    console.error('Error applying RLS:', err);
  } finally {
    await client.end();
  }
}

main();
