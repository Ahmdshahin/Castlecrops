-- Supabase Schema for Castle Crops

-- Enum for product categories
CREATE TYPE product_category AS ENUM ('dates', 'olives', 'olive_oil');

-- Enum for generic status
CREATE TYPE generic_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE cert_status AS ENUM ('reserved', 'active');
CREATE TYPE rfq_status AS ENUM ('new', 'contacted', 'resolved');

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    category product_category NOT NULL,
    -- JSONB for localized fields: { "en": "...", "ar": "..." }
    name JSONB NOT NULL DEFAULT '{}'::jsonb,
    description JSONB NOT NULL DEFAULT '{}'::jsonb,
    image_url TEXT,
    packaging_options JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of strings
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    qr_code_url TEXT,
    scan_page_slug TEXT,
    meta_title JSONB NOT NULL DEFAULT '{}'::jsonb,
    meta_description JSONB NOT NULL DEFAULT '{}'::jsonb,
    og_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title JSONB NOT NULL DEFAULT '{}'::jsonb,
    excerpt JSONB NOT NULL DEFAULT '{}'::jsonb,
    body JSONB NOT NULL DEFAULT '{}'::jsonb,
    cover_image_url TEXT,
    published_at TIMESTAMPTZ,
    status generic_status DEFAULT 'draft',
    meta_title JSONB NOT NULL DEFAULT '{}'::jsonb,
    meta_description JSONB NOT NULL DEFAULT '{}'::jsonb,
    og_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certifications Table
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    issuing_body TEXT,
    valid_until DATE,
    certificate_file_url TEXT,
    status cert_status DEFAULT 'reserved',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company Stats Table (Single row expected)
CREATE TABLE company_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    founding_year INTEGER NOT NULL,
    standout_metric_value TEXT NOT NULL,
    standout_metric_label JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Info Table (Single row expected)
CREATE TABLE contact_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_phones JSONB NOT NULL DEFAULT '[]'::jsonb,
    official_email TEXT,
    map_lat NUMERIC,
    map_lng NUMERIC,
    address JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RFQ Submissions Table
CREATE TABLE rfq_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    product TEXT,
    quantity TEXT,
    message TEXT,
    locale TEXT,
    status rfq_status DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social Links Table
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial Data for Social Links
INSERT INTO social_links (platform, url) VALUES
('LinkedIn', ''),
('Facebook', ''),
('Instagram', ''),
('TikTok', ''),
('X', ''),
('YouTube', '');

-- Admin Audit Logs Table
CREATE TABLE admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
