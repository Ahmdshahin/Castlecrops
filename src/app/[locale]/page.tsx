import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const SealDivider = dynamic(() => import('../../components/SealDivider').then(mod => mod.SealDivider), { ssr: true });

import { supabaseAdmin as supabase } from '../../services/supabaseAdmin';
import { getSiteSettings } from '../../services/settings';

export const revalidate = 3600; // Cache this page for 1 hour for maximum performance

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  setRequestLocale(locale);
  
  const [postsRes, t, categoriesRes, settings] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, cover_image_url, published_at')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(3),
    getTranslations(),
    supabase
      .from('categories')
      .select('id, slug, name, description, image_url')
      .eq('is_featured', true)
      .order('sort_order', { ascending: true }),
    getSiteSettings()
  ]);

  let posts = postsRes.data;
  const categories = categoriesRes.data;
  const catalogPdfUrl = settings['catalog_pdf_url'];
    
  if (!posts || posts.length === 0) {
    const { data: fallbackPosts } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, cover_image_url, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3);
    posts = fallbackPosts;
  }
    
  return (
    <main>
      <section className="hero" id="home">
        <div className="hero-bg">
          <Image src="/images/hero_bg.jpg" alt="Agricultural Illustrations" fill sizes="100vw" className="object-cover opacity-25 mix-blend-lighten" priority />
        </div>
        <div className="hero-veil"></div>
        <div className="hero-content">
          <Image src="/logo_dark.png" alt="Castle Crops Crest" width={150} height={150} className="hero-crest" priority={true} />
          <span className="hero-eyebrow">{t('hero.eyebrow')}</span>
          <h1>
            <>
              {t('hero.headline')}<br /><span>{t('hero.headlineHighlight')}</span>
            </>
          </h1>
          <p className="lead">
            {t('hero.lead')}
          </p>
          {catalogPdfUrl && (
            <div className="hero-download mb-8 flex justify-center relative z-10 w-full">
              <a href="/api/catalog" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 mx-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m0 0l-4-4m4 4l4-4" /></svg>
                {t('productsPage.downloadCatalog') || 'Download Products Catalog'}
              </a>
            </div>
          )}
          <div className="hero-ctas">
            <Link href={`/${locale}/contact`} className="btn btn-solid">
              <span>{t('hero.ctaQuote')}</span>
            </Link>
            <Link href={`/${locale}/products`} className="btn btn-ghost">
              <span>{t('hero.ctaProducts')}</span>
            </Link>
          </div>
        </div>
        <div className="scroll-cue">
          <span>{t('hero.scroll')}</span>
          <div className="line"></div>
        </div>
      </section>

      <div className="ticker-wrap">
        <div className="ticker">
          {Array(9).fill(0).map((_, i) => (
            <span key={i}>⯁ {t('ticker.text')}</span>
          ))}
        </div>
      </div>

      <div className="container">
        <SealDivider />
      </div>

      <section id="about">
        <div className="container about-grid">
          <div className="about-text">
            <span className="eyebrow">{t('about.eyebrow')}</span>
            <h2>{t('about.title')}</h2>
            <p>
              {t('about.paragraph1')}
            </p>
            <Link href={`/${locale}/about`} className="btn btn-ghost mt-4">
              <span>{t('about.cta')}</span>
            </Link>
          </div>
          <div className="about-visual">
            <div className="frame">
              <div className="corner tl"></div>
              <div className="corner br"></div>
              <Image src="/logo_dark.png" alt="Emblem" width={280} height={280} loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <SealDivider className="flip" />
      </div>

      <section className="farms" id="farms">
        <div className="section-head">
          <span className="eyebrow">{t('farms.eyebrow')}</span>
          <h2>{t('farms.title')}</h2>
          <p>
            {t('farms.lead')}
          </p>
        </div>

        <div className="container">
          <div className="farms-grid">
            <div className="farm-stat">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-gold mb-6">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
              </svg>
              <h3>{t('farms.stat1Title')}</h3>
              <p>{t('farms.stat1Desc')}</p>
            </div>
            
            <div className="farm-stat">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-gold mb-6">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2"/>
                <path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/>
                <path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/>
                <path d="M20 12h2"/>
                <path d="m6.34 17.66-1.41 1.41"/>
                <path d="m19.07 4.93-1.41 1.41"/>
              </svg>
              <h3>{t('farms.stat2Title')}</h3>
              <p>{t('farms.stat2Desc')}</p>
            </div>
            
            <div className="farm-stat">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-gold mb-6">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
              <h3>{t('farms.stat3Title')}</h3>
              <p>{t('farms.stat3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <SealDivider />
      </div>

      <section id="products" className="relative overflow-hidden py-24">
        {/* Luxury Illustration Background (Watermark Mode) */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none select-none products-bg"
          style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 90%)' }}
        >
          <Image src="/images/products_bg.jpg" alt="Luxury Texture" fill sizes="100vw" className="object-cover object-center" loading="lazy" />
        </div>

        <div className="relative z-10 section-head">
          <span className="eyebrow">{t('products.eyebrow')}</span>
          <h2>{t('products.title')}</h2>
          <p>{t('home.productsDesc')}</p>
        </div>

        <div className="relative z-10 container">
          <div className="products-grid">
            {categories?.map((cat) => (
              <Link key={cat.id} href={`/${locale}/products#${cat.slug}`} className="product-card block cursor-pointer group">
                <div className="relative w-full h-[240px] overflow-hidden">
                  <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={cat.image_url || '/logo_dark.png'} alt={cat.name[locale] || cat.name.en} fill className="object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-6">
                  <h3>{cat.name[locale] || cat.name.en}</h3>
                  <p>{cat.description[locale] || cat.description.en}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href={`/${locale}/products`} className="btn btn-ghost">
              <span>{t('home.viewCatalog')}</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        <SealDivider className="flip" />
      </div>

      <section id="blog">
        <div className="section-head">
          <span className="eyebrow">{t('home.blogEyebrow')}</span>
          <h2>{t('home.blogTitle')}</h2>
          <p>{t('home.blogDesc')}</p>
        </div>

        <div className="container">
          {(!posts || posts.length === 0) ? (
            <div className="text-center py-20 border border-gold-dim bg-black-soft text-cream-dim">
               {t('home.noArticles')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
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
          
          <div className="text-center mt-12">
            <Link href={`/${locale}/blog`} className="btn btn-ghost">
              <span>{t('home.viewAllArticles')}</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        <SealDivider />
      </div>

      <section id="markets">
        <div className="section-head">
          <span className="eyebrow">{t('markets.eyebrow')}</span>
          <h2>{t('markets.title')}</h2>
          <p>{t('home.marketsDesc')}</p>
        </div>

        <div className="container">
          <div className="markets-grid">
            <div className="market-col">
              <h3>{t('home.marketsCol1Title')}</h3>
              <p>{t('home.marketsCol1Desc')}</p>
              <ul className="check-list">
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {t('home.eu')}
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {t('home.na')}
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {t('home.me')}
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {t('home.ap')}
                </li>
              </ul>
            </div>
            <div className="market-col">
              <div className="trust-badge">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold mb-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <h4>{t('home.marketsCol2Title')}</h4>
                <p>{t('home.marketsCol2Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <SealDivider />
      </div>

      <section id="b2b" className="py-16">
        <div className="container">
          <div className="bg-black-soft border border-gold/50 p-8 md:p-12 text-center rounded-2xl relative overflow-hidden shadow-[0_0_30px_rgba(201,162,39,0.1)]">
            <div className="absolute inset-0 opacity-5 bg-[url('/images/hero_bg.jpg')] bg-cover mix-blend-overlay"></div>
            <div className="relative z-10">
              <svg className="w-12 h-12 text-gold mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h2 className="text-3xl md:text-4xl text-gold-bright font-serif-latin mb-4">
                {t('home.b2bTitle') || "Exporting Globally"}
              </h2>
              <p className="text-lg md:text-xl text-cream-dim max-w-3xl mx-auto leading-relaxed">
                {t('home.b2bDesc') || "Wholesale & Bulk inquiries welcome. We are fully equipped to handle massive container orders and international logistics to meet your global business needs."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <SealDivider />
      </div>

      <section id="contact">
        <div className="section-head">
          <span className="eyebrow">{t('contact.eyebrow')}</span>
          <h2>{t('contact.title')}</h2>
          <p>{t('home.contactDesc')}</p>
        </div>

        <div className="container text-center pb-20">
           <Link href={`/${locale}/contact`} className="btn btn-solid inline-flex px-12 py-4 text-lg">
             <span>{t('home.goToContact')}</span>
           </Link>
        </div>
      </section>

    </main>
  );
}
