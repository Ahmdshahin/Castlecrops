import { supabaseAdmin as supabase } from '../../services/supabaseAdmin';

export const dynamic = 'force-dynamic';

import { cookies } from "next/headers";
import { getAdminT } from "../../lib/admin-i18n";
import { VisitsBarChart } from "../../components/admin/VisitsBarChart";
import { TopPagesChart } from "../../components/admin/TopPagesChart";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const adminLangCookie = cookieStore.get('admin_lang')?.value || 'en';
  const t = getAdminT(adminLangCookie);

  const { count: rfqCount } = await supabase.from('rfq_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new');
  const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: blogCount } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true });
  
  // Analytics Counts
  const { count: totalVisits } = await supabase.from('page_visits').select('*', { count: 'exact', head: true });
  
  // Today visits (last 24 hours)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const { count: todayVisits } = await supabase
    .from('page_visits')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', yesterday.toISOString());

  // Chart Data Preparation
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data: recentVisits } = await supabase
    .from('page_visits')
    .select('created_at, path')
    .gte('created_at', sevenDaysAgo.toISOString());
    
  const barChartData: { label: string; value: number; dateString: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    barChartData.push({
      label: d.toLocaleDateString(adminLangCookie === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short' }),
      value: 0,
      dateString: d.toDateString()
    });
  }
  
  const topPagesMap: Record<string, number> = {};

  (recentVisits || []).forEach(visit => {
    const visitDate = new Date(visit.created_at).toDateString();
    const dayData = barChartData.find(d => d.dateString === visitDate);
    if (dayData) {
      dayData.value++;
    }
    
    const path = visit.path || '/';
    topPagesMap[path] = (topPagesMap[path] || 0) + 1;
  });
  
  const topPagesData = Object.entries(topPagesMap)
    .map(([path, visits]) => ({ path, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-serif-latin text-gold-bright mb-8">{t.sidebar.dashboard}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-black-soft border border-gold-dim p-6 rounded-2xl">
          <h3 className="text-cream-dim text-sm uppercase tracking-wider mb-2">{t.sidebar.todayVisits}</h3>
          <p className="text-4xl text-gold font-serif-latin">{todayVisits || 0}</p>
        </div>
        <div className="bg-black-soft border border-gold-dim p-6 rounded-2xl">
          <h3 className="text-cream-dim text-sm uppercase tracking-wider mb-2">{t.sidebar.totalVisits}</h3>
          <p className="text-4xl text-gold font-serif-latin">{totalVisits || 0}</p>
        </div>
        <div className="bg-black-soft border border-gold-dim p-6 rounded-2xl">
          <h3 className="text-cream-dim text-sm uppercase tracking-wider mb-2">{t.sidebar.rfq}</h3>
          <p className="text-4xl text-gold font-serif-latin">{rfqCount || 0}</p>
        </div>
        <div className="bg-black-soft border border-gold-dim p-6 rounded-2xl">
          <h3 className="text-cream-dim text-sm uppercase tracking-wider mb-2">{t.sidebar.products}</h3>
          <p className="text-4xl text-gold font-serif-latin">{productsCount || 0}</p>
        </div>
        <div className="bg-black-soft border border-gold-dim p-6 rounded-2xl">
          <h3 className="text-cream-dim text-sm uppercase tracking-wider mb-2">{t.sidebar.blog}</h3>
          <p className="text-4xl text-gold font-serif-latin">{blogCount || 0}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VisitsBarChart title={t.sidebar.visitsLast7Days} data={barChartData} />
        </div>
        <div className="lg:col-span-1">
          <TopPagesChart title={t.sidebar.topPages} data={topPagesData} />
        </div>
      </div>
    </div>
  );
}
