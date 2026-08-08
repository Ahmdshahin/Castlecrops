const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres:GEbPDETiHh3GGZHv@db.nocischkvnhxkzpaockq.supabase.co:5432/postgres'
  });

  try {
    await client.connect();
    
    console.log('Updating admin user roles...');
    
    // Get current roles for 'admin'
    const res = await client.query('SELECT roles FROM admin_users WHERE username = $1', ['admin']);
    
    if (res.rows.length > 0) {
      let currentRoles = res.rows[0].roles || [];
      if (!currentRoles.includes('farms-gallery')) {
        currentRoles.push('farms-gallery');
        await client.query('UPDATE admin_users SET roles = $1::jsonb WHERE username = $2', [JSON.stringify(currentRoles), 'admin']);
        console.log('Successfully added farms-gallery to admin roles.');
      } else {
        console.log('Admin already has farms-gallery role.');
      }
    } else {
      console.log('Admin user not found.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
