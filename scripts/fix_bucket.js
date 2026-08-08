require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAndCreateBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error listing buckets:', error);
    return;
  }

  const mediaBucket = buckets.find(b => b.name === 'media');
  if (!mediaBucket) {
    console.log('Media bucket not found. Creating...');
    const { error: createError } = await supabase.storage.createBucket('media', {
      public: true, // MUST BE PUBLIC FOR IMAGES TO LOAD
    });
    if (createError) {
      console.error('Error creating bucket:', createError);
    } else {
      console.log('Media bucket created successfully.');
    }
  } else {
    console.log('Media bucket exists. Ensuring it is public...');
    // updateBucket to ensure public: true
    const { error: updateError } = await supabase.storage.updateBucket('media', {
      public: true,
    });
    if (updateError) {
      console.error('Error updating bucket to public:', updateError);
    } else {
      console.log('Media bucket is now public.');
    }
  }
}

checkAndCreateBucket();
