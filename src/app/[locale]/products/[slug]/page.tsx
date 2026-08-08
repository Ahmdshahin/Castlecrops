import { supabaseAdmin as supabase } from "../../../../services/supabaseAdmin";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ShareButtons } from "../../../../components/ShareButtons";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const resolvedParams = await params;
  const { data: product } = await supabase
    .from("products")
    .select("name, description, image_url")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!product) return {};

  const title = `${product.name[resolvedParams.locale] || product.name.en} | Castle Crops`;
  const description = product.description[resolvedParams.locale] || product.description.en;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    }
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string, slug: string }>;
}) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;
  const tNav = await getTranslations("nav");

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) {
    notFound();
  }

  const { data: categoryData } = await supabase
    .from("categories")
    .select("name, slug")
    .eq("slug", product.category)
    .single();

  let categoryTitle = product.category;

  if (categoryData && categoryData.name) {
    categoryTitle = categoryData.name[locale] || categoryData.name.en;
  } else {
    categoryTitle = String(product.category).charAt(0).toUpperCase() + String(product.category).slice(1);
  }

  return (
    <main className="pt-[120px] pb-20">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-cream-dim mb-8">
          <Link href={`/${locale}`} className="hover:text-gold transition-colors">{tNav('home')}</Link>
          <span>/</span>
          <Link href={`/${locale}/products`} className="hover:text-gold transition-colors">{tNav('products')}</Link>
          <span>/</span>
          <Link href={`/${locale}/products#${product.category}`} className="hover:text-gold transition-colors">{categoryTitle}</Link>
          <span>/</span>
          <span className="text-cream">{product.name[locale] || product.name.en}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image Gallery */}
          <div className="relative w-full aspect-square bg-black-soft border border-gold-dim/30 overflow-hidden group rounded">
            {product.image_url ? (
              <Image 
                src={product.image_url} 
                alt={product.name[locale] || product.name.en} 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gold-dim">
                Image Not Available
              </div>
            )}
            
            {product.is_featured && (
              <div className="absolute top-4 left-4 bg-gold text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {locale === 'en' ? 'Featured' : 'مميز'}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <span className="eyebrow block mb-2">{categoryTitle}</span>
            <h1 className="text-4xl md:text-5xl font-serif text-gold-bright mb-6">{product.name[locale] || product.name.en}</h1>
            
            <p className="text-lg text-cream-dim leading-relaxed mb-8">
              {product.description[locale] || product.description.en}
            </p>

            {/* Packaging Options */}
            {product.packaging_options && product.packaging_options.length > 0 && (
              <div className="mb-10 p-6 border border-cream-line bg-black-soft/50 rounded">
                <h3 className="text-xl font-serif text-cream mb-4 border-b border-cream-line pb-2">
                  {locale === 'en' ? 'Available Packaging' : 'خيارات التعبئة المتوفرة'}
                </h3>
                <ul className="grid grid-cols-2 gap-3">
                  {product.packaging_options.map((opt: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-cream-dim">
                      <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={`/${locale}/contact?product=${product.slug}`} 
                className="inline-flex justify-center items-center px-8 py-4 bg-gold text-black font-semibold uppercase tracking-wider hover:bg-gold-bright transition-colors text-center"
              >
                {locale === 'en' ? 'Request Export Quote' : 'طلب عرض سعر للتصدير'}
              </Link>
            </div>
            
            {/* Meta info */}
            <div className="mt-8 pt-6 border-t border-cream-line flex items-center justify-between text-sm text-cream-dim">
              <span>{locale === 'en' ? 'Origin: Local Farms' : 'المنشأ: مزارع محلية'}</span>
              <span>{locale === 'en' ? 'Category:' : 'الفئة:'} {categoryTitle}</span>
            </div>

            <ShareButtons title={product.name[locale] || product.name.en} locale={locale} />
          </div>
        </div>
      </div>
    </main>
  );
}
