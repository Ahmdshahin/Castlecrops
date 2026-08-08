'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { requireAdminRole } from '../actions';
import { logAdminAction } from '../../../lib/auditLogger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getUsers(page: number = 1, pageSize: number = 50, search: string = '') {
  await requireAdminRole('users');
  let query = supabase.from('admin_users').select('id, email, roles, created_at', { count: 'exact' });
  
  if (search) {
    query = query.ilike('email', `%${search}%`);
  }
  
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
    
  if (error) throw new Error(error.message);
  return { users: data, count };
}

export async function saveUser(formData: FormData) {
  await requireAdminRole('users');
  const id = formData.get('id') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const rolesStr = formData.get('roles') as string;
  let roles = [];
  try { roles = JSON.parse(rolesStr || '[]'); } catch {}

  if (!email) return { success: false, error: 'Email is required' };
  
  if (id) {
    const updates: Record<string, unknown> = { email, roles };
    
    if (password) {
      const { error: authError } = await supabase.auth.admin.updateUserById(id, {
        email,
        password
      });
      if (authError) return { success: false, error: authError.message };
    } else {
      await supabase.auth.admin.updateUserById(id, { email });
    }

    const { error } = await supabase.from('admin_users').update(updates).eq('id', id);
    if (error) return { success: false, error: error.message };
    await logAdminAction('UPDATE_ADMIN_USER', { target_id: id, email, roles });
  } else {
    if (!password) return { success: false, error: 'Password is required for new users' };
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (authError || !authData.user) return { success: false, error: authError?.message || 'Failed to create user' };

    const { error } = await supabase.from('admin_users').insert({ 
      id: authData.user.id, 
      email, 
      roles 
    });
    
    if (error) return { success: false, error: error.message };
    await logAdminAction('CREATE_ADMIN_USER', { target_id: authData.user.id, email, roles });
  }
  
  revalidatePath('/admin/users');
  return { success: true };
}

export async function deleteUser(id: string) {
  await requireAdminRole('users');
  
  const { error: dbError } = await supabase.from('admin_users').delete().eq('id', id);
  if (dbError) return { success: false, error: dbError.message };

  const { error: authError } = await supabase.auth.admin.deleteUser(id);
  if (authError) return { success: false, error: authError.message };

  await logAdminAction('DELETE_ADMIN_USER', { target_id: id });

  revalidatePath('/admin/users');
  return { success: true };
}
