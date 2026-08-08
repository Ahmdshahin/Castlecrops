import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { SettingsForm } from './SettingsForm';
import { cookies } from "next/headers";
import { getAdminT } from "../../../lib/admin-i18n";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const adminLangCookie = cookieStore.get('admin_lang')?.value || 'en';
  const t = getAdminT(adminLangCookie);

  const { data: settings } = await supabase.from('site_settings').select('*');
  
  // Convert array of {id, value} to a key-value object
  const settingsMap = settings?.reduce((acc: Record<string, string>, curr: { id: string, value: string }) => {
    acc[curr.id] = curr.value;
    return acc;
  }, {}) || {};

  return (
    <div>
      <h1 className="text-3xl font-serif-latin text-gold-bright mb-8">{t.sidebar.settings}</h1>
      <p className="text-cream-dim mb-8">{t.common.settingsDescription || 'Manage contact information, social media links, and Google Maps embed.'}</p>
      
      <SettingsForm initialSettings={settingsMap} />
    </div>
  );
}
