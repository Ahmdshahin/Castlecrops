import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { BlogList } from './BlogList';

export default async function AdminBlog() {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="text-red-500">Error loading posts: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-serif-latin text-gold-bright mb-8">Blog Posts</h1>
      <BlogList initialPosts={posts || []} />
    </div>
  );
}
