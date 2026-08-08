'use server';

import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { requireAdminRole } from '../actions';
import { logAdminAction } from '../../../lib/auditLogger';

export async function updateRfqStatus(id: string, status: 'new' | 'contacted' | 'resolved') {
  await requireAdminRole('rfq');
  const { error } = await supabase
    .from('rfq_submissions')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating RFQ:', error);
    return { error: 'Failed to update RFQ status' };
  }

  await logAdminAction('UPDATE_RFQ_STATUS', { rfq_id: id, status });
  revalidatePath('/admin/rfq');
  return { success: true };
}

export async function deleteRfq(id: string) {
  await requireAdminRole('rfq');
  const { error } = await supabase
    .from('rfq_submissions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting RFQ:', error);
    return { error: 'Failed to delete RFQ' };
  }

  await logAdminAction('DELETE_RFQ', { rfq_id: id });
  revalidatePath('/admin/rfq');
  return { success: true };
}
