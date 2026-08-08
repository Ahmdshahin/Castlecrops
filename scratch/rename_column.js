const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:GEbPDETiHh3GGZHv@db.nocischkvnhxkzpaockq.supabase.co:5432/postgres' });
client.connect().then(() => client.query("ALTER TABLE admin_users RENAME COLUMN username TO email")).then(() => console.log('Column renamed')).catch(console.error).finally(() => client.end());
