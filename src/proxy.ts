// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, type Locale } from "./i18n.config";
import { updateSession } from "./utils/supabase/middleware";

const LOCALE_COOKIE = "NEXT_LOCALE";

function detectFromAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale;
  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());

  for (const lang of preferred) {
    if ((locales as readonly string[]).includes(lang)) return lang as Locale;
  }
  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Admin Routes using Supabase Auth
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const { supabaseResponse, user } = await updateSession(request);
    
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    
    // Role validation is now handled per-action or page using requireAdminRole
    // to avoid complex db calls in middleware for every request.
    // We just return the updated session cookies here.
    return supabaseResponse;
  }

  // Update session anyway for non-protected admin routes if they are under /admin (like login)
  if (pathname.startsWith('/admin')) {
    const { supabaseResponse } = await updateSession(request);
    return supabaseResponse;
  }

  const pathnameHasLocaleMatch = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocaleMatch) {
    const response = NextResponse.next();
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    if (cookieLocale !== pathnameHasLocaleMatch) {
      response.cookies.set(LOCALE_COOKIE, pathnameHasLocaleMatch, { maxAge: 60 * 60 * 24 * 365, path: '/' });
    }
    return response;
  }

  // 1. Cookie wins if the user already picked a language before
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    cookieLocale && (locales as readonly string[]).includes(cookieLocale)
      ? (cookieLocale as Locale)
      : detectFromAcceptLanguage(request.headers.get("accept-language")); // 2. else browser detection

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, { maxAge: 60 * 60 * 24 * 365 });
  return response;
}

// Next.js actually looks for `middleware` export in `middleware.ts` but since this file is `proxy.ts`
// we export it as both proxy and middleware to ensure compatibility.
export const proxy = middleware;

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
