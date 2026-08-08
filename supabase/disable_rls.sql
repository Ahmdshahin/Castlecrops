-- Disable Row Level Security to allow the ANON_KEY to insert dummy data and operate the Admin Panel.
-- Run this in your Supabase SQL Editor.

ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_submissions DISABLE ROW LEVEL SECURITY;
