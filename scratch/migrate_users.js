const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrate() {
  console.log('Fetching old users...');
  
  // We don't really need to migrate passwords since we can't decrypt bcrypt.
  // We will just recreate 'admin' with the password 'castlecropsadmin'.
  const email = 'admin@admin.castlecrops.local';
  const password = process.env.ADMIN_PASSWORD || 'castlecropsadmin';
  const username = 'admin';
  const roles = [
    'dashboard', 'categories', 'products', 'blog', 
    'certifications', 'rfq', 'gallery', 'languages', 
    'settings', 'users'
  ]; // all roles for main admin

  console.log('Creating/Updating Supabase Auth user for admin...');
  
  // Try to find if user exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  let authUser = users?.find(u => u.email === email);

  if (authUser) {
    console.log('Admin user exists in Auth. Updating password...');
    await supabase.auth.admin.updateUserById(authUser.id, { password });
  } else {
    console.log('Creating new Admin user in Auth...');
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (error) throw error;
    authUser = data.user;
  }

  console.log('Cleaning old admin_users table...');
  await supabase.from('admin_users').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  console.log('Inserting new admin into admin_users...');
  const { error: insertError } = await supabase.from('admin_users').insert({
    id: authUser.id,
    username,
    roles
  });

  if (insertError) {
    console.error('Error inserting admin_user:', insertError);
  } else {
    console.log('Migration successful!');
  }
}

migrate().catch(console.error);
