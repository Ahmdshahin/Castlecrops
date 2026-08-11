import { getTranslations, setRequestLocale } from "next-intl/server";
import { supabaseAdmin as supabase } from "../../../services/supabaseAdmin";
import Link from "next/link";
import Image from "next/image";
import { Database } from "../../../types/supabase";
import { getSiteSettings } from "../../../services/settings";

type ProductRow = Database['public']['Tables']['products']['Row'];
type LocalizedProduct = Omit<ProductRow, 'name' | 'description'> & {
  name: Record<string, string>;
  description: Record<string, string>;
};

export const revalidate = 3600; // ISR cache

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'seo' });
  const p = await getTranslations({ locale: resolvedParams.locale, namespace: 'nav' });
  return {
    title: p('products') || 'Products',
    description: t('description')
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  setRequestLocale(locale);
  const tPage = await getTranslations("productsPage");

  const [productsRes, dbCategoriesRes, settings] = await Promise.all([
    supabase
      .from("products")
      .select("id, slug, category, name, description, image_url, sort_order")
      .order("sort_order", { ascending: true }),
    supabase
      .from("categories")
      .select("id, slug, name, description, image_url, sort_order")
      .order("sort_order", { ascending: true }),
    getSiteSettings()
  ]);

  const productsData = productsRes.data;
  const dbCategories = dbCategoriesRes.data;
  const catalogPdfUrl = settings['catalog_pdf_url'];

  // Group products by category dynamically
  const products: LocalizedProduct[] = (productsData as unknown as LocalizedProduct[]) || [];
  const groupedProducts = products.reduce((acc, product) => {
    const cat = product.category;
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, LocalizedProduct[]>) || {};

  const categoriesList = dbCategories && dbCategories.length > 0 
    ? dbCategories 
    : [
        { slug: 'dates', name: { en: 'Elite Dates', ar: 'تمور النخبة', fr: "Dattes d'Élite", pl: "Elitarne Daktyle", tr: "Elit Hurmalar" }, description: { en: 'Premium hand-picked dates.', ar: 'تمور فاخرة مقطوفة يدوياً.' } },
        { slug: 'olives', name: { en: 'Artisan Olives', ar: 'زيتون الحرفيين', fr: "Olives Artisanales", pl: "Oliwki Rzemieślnicze", tr: "El Yapımı Zeytinler" }, description: { en: 'Traditionally cured olives.', ar: 'زيتون مخلل بالطرق التقليدية.' } },
        { slug: 'olive_oil', name: { en: 'Pure Olive Oil', ar: 'زيت الزيتون النقي', fr: "Huile d'Olive Pure", pl: "Czysta Oliwa z Oliwek", tr: "Saf Zeytinyağı" }, description: { en: 'Cold-pressed extra virgin olive oil.', ar: 'زيت زيتون بكر ممتاز معصور على البارد.' } }
      ];

  return (
    <main className="pt-[120px]">
      
      {catalogPdfUrl && (
        <div className="container mb-16 text-center">
          <a href="/api/catalog" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 mx-auto">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m0 0l-4-4m4 4l4-4" /></svg>
            {tPage('downloadCatalog') || 'Download Products Catalog'}
          </a>
        </div>
      )}

      {categoriesList.map((category) => {
        const catProducts = groupedProducts[category.slug] || [];
        if (catProducts.length === 0) return null; // Don't show empty categories
        
        return (
        <section id={category.slug} key={category.slug} className="mb-20">
          <div className="section-head">
            <span className="eyebrow">{tPage('ourCollection')}</span>
            <h2>
              {category.name[locale] || category.name['en']}
            </h2>
            <p>
              {category.description?.[locale] || category.description?.['en']}
            </p>
          </div>
          
          <div className="container products-grid">
            {catProducts.map((product: LocalizedProduct) => (
              <Link href={`/${locale}/products/${product.slug}`} key={product.id} className="product-card block group transition-all hover:border-gold-dim">
                {product.image_url ? (
                  <div className="relative w-full h-[240px] overflow-hidden">
                    <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={product.image_url} alt={product.name[locale] || product.name.en} fill className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                ) : (
                  <div className="relative w-full h-[240px] bg-black-soft/50 flex items-center justify-center">
                    <span className="text-cream-dim text-sm">No Image</span>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-2xl font-serif text-cream mb-2">{product.name[locale] || product.name.en}</h3>
                  <span className="tag block text-gold text-sm tracking-widest uppercase mb-4">
                    {category.name[locale] || category.name['en']}
                  </span>
                  <p className="text-cream-dim line-clamp-3 mb-6">
                    {product.description[locale] || product.description.en}
                  </p>
                  
                  <div className="rfq-link inline-flex items-center gap-2 text-gold-bright border-b border-gold-dim pb-1 transition-colors hover:border-gold-bright">
                    {tPage('viewDetails')}
                    <svg className={`w-4 h-4 ${locale === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        );
      })}
      
      {categoriesList.length === 0 && (
        <div className="text-center text-cream-dim py-20">
          {tPage('comingSoon')}
        </div>
      )}
    </main>
  );
}
