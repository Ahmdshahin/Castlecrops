const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// We cannot execute CREATE TABLE via supabase-js REST api.
// We need to ask the user to run SQL in their Supabase SQL Editor.
