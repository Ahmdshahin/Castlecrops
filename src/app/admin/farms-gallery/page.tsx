import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { FarmsGalleryForm } from './FarmsGalleryForm';
import { cookies } from "next/headers";
import { getAdminT } from "../../../lib/admin-i18n";

export const dynamic = 'force-dynamic';

export default async function FarmsGalleryPage() {
  const cookieStore = await cookies();
  const adminLangCookie = cookieStore.get('admin_lang')?.value || 'en';
  const t = getAdminT(adminLangCookie);

  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 'farms_gallery').single();
  
  let galleryData = [];
  try {
    if (settings?.value) {
      galleryData = JSON.parse(settings.value);
    }
  } catch {
    galleryData = [];
  }

  return (
    <div>
      <h1 className="text-3xl font-serif-latin text-gold-bright mb-8">{t.sidebar.farmsGallery}</h1>
      <p className="text-cream-dim mb-8">{t.common.farmsGalleryDesc}</p>
      
      <FarmsGalleryForm initialData={galleryData} />
    </div>
  );
}
