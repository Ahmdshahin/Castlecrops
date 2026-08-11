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
    .select('*', { count: 'exact' });

  if (search) {
    query = query.ilike('action', `%${search}%`);
  }

  const { data: logs, count, error } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    console.error("Audit logs query error:", error);
  }

  let finalLogs = logs || [];
  if (finalLogs.length > 0) {
    const adminIds = Array.from(new Set(finalLogs.map(l => l.admin_id).filter(Boolean)));
    const { data: adminUsers } = await supabase
      .from('admin_users')
      .select('id, email')
      .in('id', adminIds);
      
    const adminMap = new Map((adminUsers || []).map(u => [u.id, u.email]));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    finalLogs = finalLogs.map((log: any) => ({
      ...log,
      admin: { email: adminMap.get(log.admin_id) || 'Unknown' }
    }));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif-latin text-gold-bright">Audit Logs</h1>
      </div>
      <AuditLogList 
        initialLogs={finalLogs} 
        totalCount={count || 0}
        currentPage={page}
        pageSize={pageSize}
        searchQuery={search}
      />
    </div>
  );
}
