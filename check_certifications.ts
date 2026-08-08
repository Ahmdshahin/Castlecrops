import { supabaseAdmin } from './src/services/supabaseAdmin';

async function run() {
  const { data } = await supabaseAdmin.from('categories').select('*').limit(1);
  console.log(JSON.stringify(data, null, 2));
}

run();
