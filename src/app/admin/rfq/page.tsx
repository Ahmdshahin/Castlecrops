import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { RfqList } from './RfqList';

export default async function AdminRFQ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : '';
  const pageSize = 12;

  let query = supabase
    .from('rfq_submissions')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`);
  }

  const { data: rfqs, count, error } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    return <div className="text-red-500">Error loading RFQs: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-serif-latin text-gold-bright mb-8">RFQ Inbox</h1>
      
      <div className="bg-black-soft border border-gold-dim p-6 rounded-2xl">
        <RfqList 
          initialRfqs={rfqs || []} 
          totalCount={count || 0}
          currentPage={page}
          pageSize={pageSize}
          searchQuery={search}
        />
      </div>
    </div>
  );
}
