import { Metadata } from 'next';
import { locales } from '../i18n.config';

type GenerateLocalizedMetadataParams = {
  t: (key: string) => string;
  locale: string;
  page: 'home' | 'about' | 'farms' | 'products' | 'contact' | 'blog';
  path: string;
};

export function generateLocalizedMetadata({
  t,
  locale,
  page,
  path,
}: GenerateLocalizedMetadataParams): Metadata {
  const languages: Record<string, string> = {};
  
  // Build hreflang for each supported locale
  locales.forEach((l) => {
    // If path is '/', the link is `/${l}`. If path is `/about`, it's `/${l}/about`
    languages[l] = `/${l}${path === '/' ? '' : path}`;
  });
  
  // x-default is usually english
  languages['x-default'] = `/en${path === '/' ? '' : path}`;

  const canonicalUrl = `/${locale}${path === '/' ? '' : path}`;

  return {
    title: t(`${page}.title`),
    description: t(`${page}.description`),
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: canonicalUrl,
      siteName: 'Castle Crops',
      images: [
        {
          url: '/herosection.png',
          width: 1200,
          height: 630,
          alt: 'Castle Crops - Premium Dates, Olives & Olive Oil',
        }
      ],
      locale,
      type: 'website',
    },
    twitter: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: ['/herosection.png'],
      card: 'summary_large_image',
    }
  };
}
