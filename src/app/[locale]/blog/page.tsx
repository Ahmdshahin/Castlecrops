import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import Image from 'next/image';

export const revalidate = 3600;

import { generateLocalizedMetadata } from '../../../utils/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'seo' });
  return generateLocalizedMetadata({ t, locale: resolvedParams.locale, page: 'blog', path: '/blog' });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  setRequestLocale(locale);
  const t = await getTranslations();

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, cover_image_url, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  return (
    <main className="pt-[120px]">
      <section id="blog" className="relative overflow-hidden min-h-screen">
        {/* Luxury Illustration Background */}
        <div className="fixed inset-0 z-0 pointer-events-none select-none blog-bg-container blog-bg">
          <Image src="/images/blog_bg.jpg" alt="Luxury Texture" fill sizes="100vw" className="object-cover object-center" loading="lazy" />
        </div>

        <div className="relative z-10 section-head">
          <span className="eyebrow">{t('blogPage.eyebrow')}</span>
          <h2>{t('blogPage.title')}</h2>
          <p>{t('blogPage.desc')}</p>
        </div>

        <div className="relative z-10 container pb-24">
          {(!posts || posts.length === 0) ? (
            <div className="text-center py-20 border border-gold-dim bg-black-soft text-cream-dim">
               {t('home.noArticles')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts?.map(post => (
                <Link 
                  key={post.id} 
                  href={`/${locale}/blog/${post.slug}`}
                  className="group bg-black-soft border border-gold-dim/30 rounded-xl overflow-hidden hover:border-gold transition-colors duration-300 flex flex-col h-full shadow-lg"
                >
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image 
                      src={post.cover_image_url || '/logo_dark.png'} 
                      alt={post.title[locale] || post.title.en} 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-gold text-sm mb-3">
                      {new Date(post.published_at).toLocaleDateString()}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold font-serif text-cream mb-3 group-hover:text-gold-bright transition-colors">
                      {post.title[locale] || post.title.en}
                    </h3>
                    <p className="text-cream-dim text-sm md:text-base leading-relaxed mb-6 flex-grow">
                      {post.excerpt[locale] || post.excerpt.en}
                    </p>
                    <span className="text-gold text-sm font-semibold mt-auto flex items-center gap-2 group-hover:gap-3 transition-all">
                      {t('home.readArticle')} 
                      <span className={locale === 'en' ? '' : 'rotate-180'}>&rarr;</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
