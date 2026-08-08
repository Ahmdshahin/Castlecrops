import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';

export const dynamic = 'force-dynamic';

import { getAdminT } from "../../../lib/admin-i18n";
import { cookies } from "next/headers";
import { AuditLogList } from "./AuditLogList";

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const cookieStore = await cookies();
  const adminLangCookie = cookieStore.get('admin_lang')?.value || 'en';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = getAdminT(adminLangCookie);

  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : '';
  const pageSize = 50;

  let query = supabase
    .from('admin_audit_logs')
    .select('*, admin:admin_id(email)', { count: 'exact' });

  if (search) {
    query = query.ilike('action', `%${search}%`);
  }

  const { data: logs, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif-latin text-gold-bright">Audit Logs</h1>
      </div>
      <AuditLogList 
        initialLogs={logs || []} 
        totalCount={count || 0}
        currentPage={page}
        pageSize={pageSize}
        searchQuery={search}
      />
    </div>
  );
}
