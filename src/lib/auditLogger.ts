import { createClient } from '../utils/supabase/server';
import { supabaseAdmin } from '../services/supabaseAdmin';

/**
 * Logs an administrative action to the admin_audit_logs table.
 * Uses the Supabase Service Role key (adminSupabase) to write to the DB.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function logAdminAction(action: string, details: any = {}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return; // Only log if there's an authenticated user (admin)

    await supabaseAdmin.from('admin_audit_logs').insert({
      admin_id: user.id,
      action,
      details,
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}
