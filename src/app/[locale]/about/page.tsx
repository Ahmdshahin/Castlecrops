import { setRequestLocale, getTranslations } from 'next-intl/server';
import { SealDivider } from '../../../components/SealDivider';
import Image from 'next/image';
import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';

export const revalidate = 3600; // ISR cache

import { generateLocalizedMetadata } from '../../../utils/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'seo' });
  return generateLocalizedMetadata({ t, locale: resolvedParams.locale, page: 'about', path: '/about' });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  setRequestLocale(locale);
  const t = await getTranslations();

  const { data: dbCertifications } = await supabase.from('certifications').select('*').order('sort_order', { ascending: true });
  
  const { data: dbSettings } = await supabase.from('site_settings').select('id, value');
  const settings = dbSettings?.reduce((acc, row) => ({ ...acc, [row.id]: row.value }), {} as Record<string, string>) || {};

  const visionTitle = settings[`vision_title_${locale}`] || t('about.visionTitle');
  const visionDesc = settings[`vision_desc_${locale}`] || t('about.visionDesc');

  return (
    <main className="pt-[120px]">
      <section>
        <div className="container about-grid">
          <div className="about-text">
            <span className="eyebrow">{t('about.eyebrow')}</span>
            <h2>{t('about.title')}</h2>
            <p>
              {t('about.paragraph1')}
            </p>
            <p>
              {t('about.paragraph2')}
            </p>
          </div>
          <div className="about-visual">
            <div className="frame">
              <div className="corner tl"></div>
              <div className="corner br"></div>
              <Image src="/logo_dark.png" alt="Castle Crops Emblem" width={280} height={280} className="mx-auto" priority={true} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black-soft/30 py-24 border-y border-gold-dim/20 mt-20 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="container max-w-4xl text-center relative z-10">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-6 border border-gold-dim/30">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-gold-bright mb-8 tracking-wide">{visionTitle}</h2>
          <p className="text-xl md:text-2xl text-cream leading-relaxed font-light italic whitespace-pre-wrap">
            &quot;{visionDesc}&quot;
          </p>
        </div>
      </section>

      <div className="container">
        <SealDivider />
      </div>

      <section>
        <div className="section-head">
          <span className="eyebrow">{t('aboutPage.certEyebrow')}</span>
          <h2>{t('aboutPage.certTitle')}</h2>
          <p>{t('aboutPage.certDesc')}</p>
        </div>

        <div className="container">
          <div className="badges-grid">
            {dbCertifications && dbCertifications.length > 0 ? (
              dbCertifications.map(cert => {
                let parsedName = cert.name;
                if (typeof parsedName === 'string') {
                  try {
                    parsedName = JSON.parse(parsedName);
                  } catch {
                    // Ignore, leave as string
                  }
                }

                const nameStr = (parsedName && typeof parsedName === 'object') 
                  ? (parsedName[locale] || parsedName.en) 
                  : (typeof parsedName === 'string' ? parsedName : 'Certification');
                
                const finalAlt = typeof nameStr === 'string' ? nameStr : 'Certification';

                return (
                  <div key={cert.id} className="badge-slot">
                    {cert.image_url ? (
                      <Image src={cert.image_url} alt={finalAlt} width={80} height={80} className="object-contain mb-2" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    )}
                    <span>{finalAlt}</span>
                  </div>
                );
              })
            ) : (
              <>
                <div className="badge-slot">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2">
                     <circle cx="12" cy="12" r="10" />
                   </svg>
                   <span>ISO 9001</span>
                   <span className="text-[10px] text-gold">{t('aboutPage.pending')}</span>
                </div>
                
                <div className="badge-slot">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2">
                     <circle cx="12" cy="12" r="10" />
                   </svg>
                   <span>HACCP</span>
                   <span className="text-[10px] text-gold">{t('aboutPage.pending')}</span>
                </div>
                
                <div className="badge-slot">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2">
                     <circle cx="12" cy="12" r="10" />
                   </svg>
                   <span>Halal</span>
                   <span className="text-[10px] text-gold">{t('aboutPage.pending')}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
