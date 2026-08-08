'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../../utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminSupabase = createSupabaseClient(supabaseUrl, supabaseKey);

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Invalid email or password' };
  }

  redirect('/admin');
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function requireAdminRole(requiredRole?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await adminSupabase
    .from('admin_users')
    .select('roles, email')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    throw new Error('Unauthorized');
  }

  const roles = (data.roles as string[]) || [];

  if (requiredRole && !roles.includes(requiredRole)) {
    throw new Error('Forbidden: Insufficient privileges');
  }

  return { id: user.id, email: data.email, roles };
}

export async function sendPasswordResetEmail(formData: FormData) {
  const email = formData.get('email') as string;
  if (!email) {
    return { error: 'Email is required' };
  }

  const supabase = await createClient();
  
  // Need the origin for the redirect URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/api/auth/callback?next=/admin/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
