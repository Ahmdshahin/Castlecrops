import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Amiri, Almarai } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, getDirection, type Locale } from "../../i18n.config";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { getSiteSettings } from "../../services/settings";
import dynamic from "next/dynamic";
import "../globals.css";

const AccessibilityWidget = dynamic(() => import("../../components/AccessibilityWidget").then(mod => mod.AccessibilityWidget));
import { AnalyticsTracker } from "../../components/AnalyticsTracker";
import { NetworkStatusTracker } from "../../components/NetworkStatusTracker";


const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-jost",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-almarai",
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'seo' });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
    title: {
      template: `%s | ${t('title')}`,
      default: t('title')
    },
    description: t('description'),
    alternates: {
      canonical: './',
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: './',
      siteName: 'Castle Crops',
      images: [
        {
          url: '/herosection.png',
          width: 1200,
          height: 630,
          alt: 'Castle Crops - Premium Dates, Olives & Olive Oil',
        }
      ],
      locale: resolvedParams.locale,
      type: 'website',
    },
    twitter: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: ['/herosection.png'],
      card: 'summary_large_image',
    },
    icons: {
      icon: [
        { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icon-48x48.png', sizes: '48x48', type: 'image/png' },
        { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const revalidate = 3600;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Await params because in Next.js 15+ App Router, `params` is a promise
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }
  
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = getDirection(locale);

  const settings = await getSiteSettings();
  
  const enabledLocales = locales.filter(loc => {
    if (loc === 'en') return true;
    return settings[`lang_${loc}_enabled`] !== 'false';
  });

  const cookieStore = await import('next/headers').then(m => m.cookies());
  const theme = cookieStore.get('theme')?.value || 'dark';
  
  let prefs = {
    textSize: 'normal',
    highContrast: false,
    reduceMotion: false,
    underlineLinks: false,
    readableFont: false
  };
  
  const a11yCookie = cookieStore.get('castle_crops_a11y')?.value;
  if (a11yCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(a11yCookie));
      prefs = { ...prefs, ...parsed };
    } catch {
      // Ignore parsing errors
    }
  }

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cormorant.variable} ${jost.variable} ${amiri.variable} ${almarai.variable} h-full antialiased`}
      data-theme={theme}
      data-a11y-text-size={prefs.textSize}
      data-a11y-high-contrast={String(prefs.highContrast)}
      data-a11y-reduce-motion={String(prefs.reduceMotion)}
      data-a11y-underline-links={String(prefs.underlineLinks)}
      data-a11y-readable-font={String(prefs.readableFont)}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://nocischkvnhxkzpaockq.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://nocischkvnhxkzpaockq.supabase.co" />
      </head>
      <body className={`lang-${locale}`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <AnalyticsTracker />
          <NetworkStatusTracker />
          <Header enabledLocales={enabledLocales} whatsappUrl={settings['whatsapp_url']} />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <AccessibilityWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
