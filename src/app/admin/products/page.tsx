import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { ProductList } from './ProductList';
import { CategoryRow } from '../categories/CategoryList';

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : '';
  const filterCategory = typeof resolvedParams.category === 'string' ? resolvedParams.category : 'all';
  const pageSize = 12;

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' });
    
  if (filterCategory !== 'all') {
    query = query.eq('category', filterCategory);
  }
  
  if (search) {
    // Search by slug or English name
    query = query.or(`slug.ilike.%${search}%,name->>en.ilike.%${search}%`);
  }

  const { data: products, count, error: productsError } = await query
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (productsError || categoriesError) {
    return <div className="text-red-500">Error loading data: {(productsError || categoriesError)?.message}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-serif-latin text-gold-bright mb-8">Products</h1>
      <ProductList 
        initialProducts={products || []} 
        initialCategories={(categories as CategoryRow[]) || []}
        totalCount={count || 0}
        currentPage={page}
        pageSize={pageSize}
        searchQuery={search}
        categoryQuery={filterCategory}
      />
    </div>
  );
}
