-- 1. Create the Admin Audit Logs table
CREATE TABLE admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add SEO fields to the products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS meta_title JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS meta_description JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS og_image_url TEXT;

-- 3. Add SEO fields to the blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS meta_title JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS meta_description JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS og_image_url TEXT;
