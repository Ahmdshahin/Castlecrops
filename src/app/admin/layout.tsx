import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { logoutAction } from "./actions";
import { cookies } from "next/headers";
import { createClient } from "../../utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { DialogProvider } from "../../components/admin/CustomDialog";
import { LayoutUI } from "../../components/admin/LayoutUI";
import { ThemeProvider } from "../../components/ThemeProvider";
import { AdminLangProvider } from "../../components/admin/AdminLangProvider";
import { AdminLang } from "../../lib/admin-i18n";
import NextTopLoader from 'nextjs-toploader';
import "../globals.css";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminSupabase = createSupabaseClient(supabaseUrl, supabaseKey);
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Admin Panel | Castle Crops",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const adminLangCookie = (cookieStore.get('admin_lang')?.value as AdminLang) || 'en';
  let roles: string[] = [];
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    try {
      const { data } = await adminSupabase
        .from('admin_users')
        .select('roles')
        .eq('id', user.id)
        .single();
      
      roles = (data?.roles as string[]) || [];
    } catch {
      // Ignored here, handled by proxy.ts
    }
  }

  const isRtl = adminLangCookie === 'ar';

  return (
    <html
      lang={adminLangCookie}
      dir={isRtl ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className={`h-screen overflow-hidden flex bg-black-matte text-cream ${isRtl ? 'font-sans-ar' : 'font-sans-latin'} transition-colors duration-300`}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <NextTopLoader
            color="#C6A87C"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #C6A87C,0 0 5px #C6A87C"
            zIndex={1600}
            showAtBottom={false}
          />
          <DialogProvider>
            <AdminLangProvider lang={adminLangCookie}>
              <LayoutUI
                roles={roles}
                logoutAction={logoutAction}
              >
                {children}
              </LayoutUI>
            </AdminLangProvider>
          </DialogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
