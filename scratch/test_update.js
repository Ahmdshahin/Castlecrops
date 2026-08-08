import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: posts } = await supabase.from('blog_posts').select('id, is_featured').limit(1);
  if (posts && posts.length > 0) {
    const id = posts[0].id;
    const { data, error } = await supabase.from('blog_posts').update({ is_featured: true }).eq('id', id).select();
    console.log("Update Error:", error);
    console.log("Updated Data:", data);
  }
}
run();
