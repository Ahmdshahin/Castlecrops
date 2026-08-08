import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import { CertificationList } from './CertificationList';

export const dynamic = 'force-dynamic';

export default async function CertificationsPage() {
  const { data: certifications } = await supabase
    .from('certifications')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div>
      <h1 className="text-3xl font-serif-latin text-gold-bright mb-8">Certifications & Awards</h1>
      <CertificationList initialCertifications={certifications || []} />
    </div>
  );
}
