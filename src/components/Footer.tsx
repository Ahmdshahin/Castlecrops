import Link from 'next/link';
import Image from 'next/image';
import { SocialIcons } from './SocialIcons';
import { getTranslations, getLocale } from 'next-intl/server';
import { getSiteSettings } from '../services/settings';

export const Footer = async () => {
  const locale = await getLocale();
  const t = await getTranslations('footer');
  const currentYear = new Date().getFullYear();

  const settings = await getSiteSettings();

  return (
    <footer id="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image src="/logo_dark.png" alt="Castle Crops Logo" width={64} height={64} className="object-contain mb-4 logo-dark-only" loading="lazy" />
          <Image src="/logo_light.png" alt="Castle Crops Logo" width={64} height={64} className="object-contain mb-4 logo-light-only" loading="lazy" />
          <p>{t('tagline')}</p>
          <SocialIcons settings={settings} className="flex flex-wrap gap-4 mt-6" />
        </div>
        
        <div className="footer-col">
          <h4>{t('productsHeading')}</h4>
          <Link href={`/${locale}/products#dates`}>
            <span>{t('datesLink')}</span>
          </Link>
          <Link href={`/${locale}/products#olives`}>
            <span>{t('olivesLink')}</span>
          </Link>
          <Link href={`/${locale}/products#olive-oil`}>
            <span>{t('oilLink')}</span>
          </Link>
        </div>
        
        <div className="footer-col">
          <h4>{t('companyHeading')}</h4>
          <Link href={`/${locale}/about`}>
            <span>{t('aboutLink')}</span>
          </Link>
          <Link href={`/${locale}/farms`}>
            <span>{t('farmsLink')}</span>
          </Link>
          <Link href={`/${locale}/blog`}>
            <span>{t('blogLink')}</span>
          </Link>
        </div>
        
        <div className="footer-col">
          <h4>{t('contactHeading')}</h4>
          <Link href={`/${locale}/contact`}>
            <span>{t('quoteLink')}</span>
          </Link>
          {settings['whatsapp_url'] && (
            <a href={settings['whatsapp_url']} target="_blank" rel="noreferrer">
              <span>{t('whatsappLink')}</span>
            </a>
          )}
        </div>
      </div>
      
      <div className="container footer-bottom">
        <div className="copy">
          <span>{t('copyright', { year: String(currentYear) })}</span>
        </div>
        <div className="legal flex gap-4">
          <a href="#"><span>{t('privacyLink')}</span></a>
          <a href="#"><span>{t('termsLink')}</span></a>
        </div>
      </div>
    </footer>
  );
};
