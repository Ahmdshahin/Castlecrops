const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:GEbPDETiHh3GGZHv@db.nocischkvnhxkzpaockq.supabase.co:5432/postgres' });
client.connect().then(() => client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'admin_users'")).then(res => console.log(res.rows)).catch(console.error).finally(() => client.end());
