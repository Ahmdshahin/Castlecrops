import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';

export async function GET() {
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('id', 'catalog_pdf_url')
    .single();

  if (!data?.value) {
    return NextResponse.json({ error: 'Catalog not found' }, { status: 404 });
  }

  return NextResponse.redirect(data.value);
}
