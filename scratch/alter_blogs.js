import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const sql = `ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;`;
  const { data, error } = await supabase.rpc('execute_sql', { query: sql }).catch(() => ({ error: null })); // this RPC might not exist, but let's try.
  
  if (error) {
    console.error("RPC failed, inserting directly is not possible without RPC. Using direct API instead if we can, but we can't alter tables via rest api.");
  }
}
run();
