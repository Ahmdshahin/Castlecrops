import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { supabaseAdmin as supabase } from '../../../../services/supabaseAdmin';
import Image from 'next/image';
import { ShareButtons } from '../../../../components/ShareButtons';

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const resolvedParams = await params;
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, body, cover_image_url')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!post) return {};

  const title = `${post.title[resolvedParams.locale] || post.title.en} | Castle Crops Blog`;
  // Create a short description from the body
  const bodyText = post.body[resolvedParams.locale] || post.body.en;
  const description = bodyText ? (bodyText.length > 150 ? bodyText.substring(0, 150) + '...' : bodyText) : '';
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
    }
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string, slug: string }>;
}) {
  const resolvedParams = await params;
  setRequestLocale(resolvedParams.locale);
  const t = await getTranslations('blogPage');
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!post) {
    return (
      <main className="flex min-h-screen flex-col pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <Link href={`/${resolvedParams.locale}/blog`} className="text-gold hover:text-gold-bright mb-8 inline-block">
          {resolvedParams.locale === 'ar' ? <>&rarr;</> : <>&larr;</>} {t('backToBlog')}
        </Link>
        <h1 className="text-4xl font-bold font-serif-latin text-gold-bright mb-4">
          Article Not Found
        </h1>
      </main>
    );
  }

  const title = post.title[resolvedParams.locale] || post.title.en;
  const body = post.body[resolvedParams.locale] || post.body.en;

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
      <Link href={`/${resolvedParams.locale}/blog`} className="text-gold hover:text-gold-bright mb-8 inline-block">
        {resolvedParams.locale === 'ar' ? <>&rarr;</> : <>&larr;</>} {t('backToBlog')}
      </Link>
      
      <span className="text-gold text-sm mb-4 block">
        {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}
      </span>
      <h1 className="text-4xl md:text-5xl font-bold font-serif-latin text-gold-bright mb-8">
        {title}
      </h1>
      
      {post.cover_image_url && (
        <div className="relative w-full h-64 md:h-96 bg-black-soft border border-gold-dim mb-12 overflow-hidden">
          <Image src={post.cover_image_url} alt={title} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" priority />
        </div>
      )}

      <div className="prose prose-invert prose-gold max-w-none text-cream-dim whitespace-pre-wrap">
        {body}
      </div>

      <ShareButtons title={title} locale={resolvedParams.locale} />
    </main>
  );
}
