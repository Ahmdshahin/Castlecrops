import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // This notifies PostgREST to reload the schema cache. 
  // It only works if executed as a direct SQL query, which we can't do via REST.
  // Wait, RPC works if they have one.
  const { data, error } = await supabase.rpc('reload_schema_cache', {});
  console.log("RPC Error:", error);
}
run();
