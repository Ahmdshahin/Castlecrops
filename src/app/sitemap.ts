import { MetadataRoute } from 'next';
import { supabaseAdmin as supabase } from '../services/supabaseAdmin';

const LOCALES = ['en', 'ar', 'fr', 'pl', 'tr'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  const { data: products } = await supabase.from('products').select('slug, updated_at');
  const { data: blogPosts } = await supabase.from('blog_posts').select('slug, updated_at').eq('status', 'published');

  const sitemap: MetadataRoute.Sitemap = [];

  const addRoute = (route: string, lastModified?: string | Date) => {
    const url = `${baseUrl}${route}`;
    sitemap.push({
      url,
      lastModified: lastModified ? new Date(lastModified) : new Date(),
      alternates: {
        languages: LOCALES.reduce((acc, locale) => {
          acc[locale] = `${baseUrl}/${locale}${route === '/' ? '' : route}`;
          return acc;
        }, {} as Record<string, string>),
      },
    });
  };

  // Core static routes
  ['/', '/about', '/products', '/farms', '/blog', '/contact'].forEach((route) => {
    addRoute(route);
  });

  // Dynamic products
  products?.forEach((product) => {
    addRoute(`/products/${product.slug}`, product.updated_at);
  });

  // Dynamic blog posts
  blogPosts?.forEach((post) => {
    addRoute(`/blog/${post.slug}`, post.updated_at);
  });

  return sitemap;
}
