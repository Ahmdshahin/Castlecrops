'use server';

import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { requireAdminRole } from '../actions';
import { logAdminAction } from '../../../lib/auditLogger';

export async function clearAuditLogs() {
  await requireAdminRole('settings'); // Only someone with high privileges can clear logs
  
  const { error } = await supabase
    .from('admin_audit_logs')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all

  if (error) {
    return { error: error.message };
  }

  await logAdminAction('CLEAR_AUDIT_LOGS', { reason: 'Manual clearance' });
  revalidatePath('/admin/audit-logs');
  return { success: true };
}

export async function deleteAuditLogs(ids: string[]) {
  await requireAdminRole('settings');
  
  const { error } = await supabase
    .from('admin_audit_logs')
    .delete()
    .in('id', ids);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction('BULK_DELETE_AUDIT_LOGS', { count: ids.length });
  revalidatePath('/admin/audit-logs');
  return { success: true };
}
