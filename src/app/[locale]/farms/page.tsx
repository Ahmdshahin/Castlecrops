import { setRequestLocale, getTranslations } from 'next-intl/server';
import { SealDivider } from '../../../components/SealDivider';
import Image from 'next/image';
import { getSiteSettings } from '../../../services/settings';

type GalleryItemType = 'image' | 'video';

type GalleryItem = {
  id: string;
  type: GalleryItemType;
  url: string;
  localizedUrls?: Record<string, string>;
  isFeatured: boolean;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'seo' });
  return {
    title: `Our Farms - ${t('title')}`,
    description: t('description'),
  };
}

export default async function FarmsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  
  const settings = await getSiteSettings();
  let galleryItems: GalleryItem[] = [];
  try {
    if (settings['farms_gallery']) {
      galleryItems = JSON.parse(settings['farms_gallery']);
    }
  } catch (e) {
    console.error('Failed to parse farms gallery', e);
  }
  
  // Fallback to placeholders if empty
  if (galleryItems.length === 0) {
    galleryItems = [
      { id: '1', type: 'image', url: '/images/farms/farm_scene.jpg', isFeatured: false },
      { id: '2', type: 'video', url: 'https://www.youtube.com/embed/ScMzIvxBSi4', isFeatured: true },
      { id: '3', type: 'image', url: '/images/farms/date_palm.jpg', isFeatured: false },
      { id: '4', type: 'image', url: '/images/farms/olive_orchard.jpg', isFeatured: false },
      { id: '5', type: 'image', url: '/images/farms/olive_oil_process.jpg', isFeatured: false },
    ];
  }

  return (
    <main>
      <section className="farms" id="farms" style={{ paddingTop: '120px' }}>
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

      <section>
        <div className="section-head">
          <h2>{t('farms.galleryEyebrow')}</h2>
          <p>{t('farms.galleryTitle')}</p>
        </div>
        
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryItems.map((item) => {
              const videoUrl = item.type === 'video' ? (item.localizedUrls?.[locale] || item.url) : '';
              
              return (
                <div 
                  key={item.id} 
                  className={`relative bg-black-soft border border-gold-dim/50 flex items-center justify-center text-cream-dim hover:border-gold transition-colors overflow-hidden rounded-2xl ${
                    item.isFeatured ? 'lg:col-span-2' : ''
                  } h-64 md:h-80 w-full`}
                >
                  {item.type === 'video' ? (
                    <iframe 
                      className="w-full h-full"
                      src={videoUrl} 
                      title="Farm Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <Image src={item.url} alt="Farm Scene" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" loading="lazy" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-24 max-w-6xl mx-auto space-y-24">
            {/* Block 1: Date Palms (Image Left, Text Right) */}
            <div className="flex flex-col md:flex-row items-center gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="w-full md:w-1/2 relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image src="/images/farms/date_palm.jpg" alt="Date Palm Grove" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <h3 className="text-3xl md:text-4xl text-gold-bright font-serif">
                  {t('farms.block1Title')}
                </h3>
                <p className="text-lg text-cream-dim leading-relaxed">
                  {t('farms.block1Desc')}
                </p>
              </div>
            </div>

            {/* Block 2: Olive Orchards (Text Left, Image Right) */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <div className="w-full md:w-1/2 relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image src="/images/farms/olive_orchard.jpg" alt="Olive Orchard" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <h3 className="text-3xl md:text-4xl text-gold-bright font-serif">
                  {t('farms.block2Title')}
                </h3>
                <p className="text-lg text-cream-dim leading-relaxed">
                  {t('farms.block2Desc')}
                </p>
              </div>
            </div>

            {/* Block 3: Olive Oil Extraction (Image Left, Text Right) */}
            <div className="flex flex-col md:flex-row items-center gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <div className="w-full md:w-1/2 relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image src="/images/farms/olive_oil_process.jpg" alt="Olive Oil Extraction" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <h3 className="text-3xl md:text-4xl text-gold-bright font-serif">
                  {t('farms.block3Title')}
                </h3>
                <p className="text-lg text-cream-dim leading-relaxed">
                  {t('farms.block3Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
