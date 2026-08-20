import { setRequestLocale } from 'next-intl/server';
import { SealDivider } from '../../../../components/SealDivider';
import Image from 'next/image';

export default async function ScanLandingPage({
  params,
}: {
  params: Promise<{ locale: string, slug: string }>;
}) {
  const resolvedParams = await params;
  setRequestLocale(resolvedParams.locale);

  // Here we would fetch the product by scan_page_slug
  // For now, static layout
  
  return (
    <main className="flex min-h-screen flex-col pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full items-center text-center">
      <div className="mb-12 animate-in fade-in zoom-in duration-700">
        <Image src="/logo_dark.png" alt="Castle Crops" width={160} height={80} className="object-contain logo-dark-only" />
        <Image src="/logo_light.png" alt="Castle Crops" width={160} height={80} className="object-contain logo-light-only" />
      </div>
      
      <div className="bg-black-soft border border-gold p-8 md:p-12 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <h1 className="text-3xl md:text-4xl font-serif-latin text-gold-bright mb-4">
          Thank you for choosing Castle Crops
        </h1>
        <p className="text-cream-dim text-lg mb-8">
          You are holding a 100% natural, hand-selected product that meets world-class quality standards.
        </p>
        
        <SealDivider />
        
        <div className="mt-8">
          <span className="text-gold uppercase tracking-widest text-xs font-semibold mb-2 block">
            VERIFIED PRODUCT
          </span>
          <h2 className="text-2xl font-serif-latin text-gold-bright mb-4">
            [Product Name]
          </h2>
          <p className="text-cream-dim mb-6">
            [Product Description from database]
          </p>
        </div>
        
        <div className="mt-12 flex justify-center gap-6">
          <a href={`/${resolvedParams.locale}/products`} className="text-gold border-b border-gold hover:text-gold-bright transition-colors">
            View All Products
          </a>
          <a href={`/${resolvedParams.locale}`} className="text-gold border-b border-gold hover:text-gold-bright transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
