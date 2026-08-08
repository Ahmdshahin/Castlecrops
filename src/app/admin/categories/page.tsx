import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { CategoryList } from './CategoryList';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div>
      <h1 className="text-3xl font-serif-latin text-gold-bright mb-8">Categories</h1>
      <CategoryList initialCategories={categories || []} />
    </div>
  );
}
