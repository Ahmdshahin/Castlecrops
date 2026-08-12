import { setRequestLocale, getTranslations } from 'next-intl/server';
import { RfqForm } from '../../../components/RfqForm';
import { getSiteSettings } from '../../../services/settings';
import { SocialIcons } from '../../../components/SocialIcons';

export const revalidate = 3600; // ISR cache
import { parsePhoneNumber } from 'libphonenumber-js/min';
import Image from 'next/image';

function getPhoneDisplay(phoneStr: string) {
  try {
    const phoneNumber = parsePhoneNumber(phoneStr);
    if (phoneNumber && phoneNumber.country) {
      return { 
        countryCode: phoneNumber.country.toLowerCase(), 
        formatted: phoneNumber.formatInternational(),
        original: phoneStr
      };
    }
  } catch {
    // ignore
  }
  return { countryCode: '', formatted: phoneStr, original: phoneStr };
}

import { generateLocalizedMetadata } from '../../../utils/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'seo' });
  return generateLocalizedMetadata({ t, locale: resolvedParams.locale, page: 'contact', path: '/contact' });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  setRequestLocale(locale);
  const t = await getTranslations();

  const settings = await getSiteSettings();

  return (
    <main className="pt-[120px]">
      <section id="contact">
        <div className="section-head">
          <span className="eyebrow">{t('contact.eyebrow')}</span>
          <h2>{t('contact.title')}</h2>
          <p>{t('contact.pageDesc')}</p>
        </div>

        <div className="container contact-grid">
          <div className="contact-form">
            <RfqForm />
          </div>
          
          <div className="contact-side">
            <div className="contact-info-card">
              <h3>{t('contact.infoTitle')}</h3>
              
              <div className="contact-info-row" style={{ alignItems: 'flex-start' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <div className="flex flex-col gap-2">
                  {(settings['contact_phone'] || '+20 102 625 7581').split('\n').map((phone: string, i: number) => {
                    const display = getPhoneDisplay(phone.trim());
                    return (
                      <span key={i} dir="ltr" className="flex items-center gap-3">
                        {display.countryCode && (
                          <Image 
                            src={`https://flagcdn.com/w40/${display.countryCode}.png`} 
                            width={20} 
                            height={15}
                            alt={display.countryCode.toUpperCase()}
                            className="rounded-sm shadow-sm inline-block"
                          />
                        )}
                        <span>{display.formatted}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
              
              <div className="contact-info-row" style={{ alignItems: 'flex-start' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <div className="flex flex-col gap-1">
                  {(settings['contact_email'] || 'sales@castlecrops.com').split('\n').map((email: string, i: number) => (
                    <span key={i}>{email.trim()}</span>
                  ))}
                </div>
              </div>
              
              <div className="contact-info-row" style={{ alignItems: 'flex-start' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <div className="flex flex-col gap-1">
                  {(settings['contact_address'] || 'Bani Saleh, Faiyum, Faiyum Governorate, Egypt').split('\n').map((address: string, i: number) => (
                    <span key={i}>{address.trim()}</span>
                  ))}
                </div>
              </div>
              
              <SocialIcons settings={settings} className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-cream-line" />
            </div>

            <div className="wa-card">
              <div>
                <strong>WhatsApp</strong>
                <p>{t('contact.waDesc')}</p>
              </div>
              {settings['whatsapp_url'] && (
                <a href={settings['whatsapp_url']} target="_blank" rel="noreferrer" className="btn btn-solid" style={{padding: '10px 16px', minWidth: 'auto'}}>
                   <span>{t('contact.waCta')}</span>
                </a>
              )}
            </div>

            <div className="mt-8 rounded-2xl overflow-hidden border border-gold-dim"
              dangerouslySetInnerHTML={{ __html: settings['google_maps_iframe'] || `<iframe src="https://maps.google.com/maps?q=29.35626271443157,30.80591314155633&hl=en&z=15&output=embed" width="100%" height="300" style="border:0;display:block;" allowfullscreen loading="lazy"></iframe>` }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
