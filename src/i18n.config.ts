// i18n.config.ts
// Central config — adding a new language later means:
//   1. Add its code to `locales` below
//   2. Add its <html lang> label to `labels`
//   3. Drop a new /messages/xx.json file with the same keys as en.json
// No other code changes needed — routing, switcher, and RTL all read from here.

export const locales = ["ar", "en", "fr", "tr", "pl"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Only Arabic is RTL. Every other locale (including future additions) is LTR by default.
export const rtlLocales: Locale[] = ["ar"];

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

// Labels shown in the language switcher dropdown
export const localeLabels: Record<Locale, { native: string; flag: string }> = {
  ar: { native: "العربية", flag: "🇸🇦" },
  en: { native: "English", flag: "🇺🇸" },
  fr: { native: "Français", flag: "🇫🇷" },
  tr: { native: "Türkçe", flag: "🇹🇷" },
  pl: { native: "Polski", flag: "🇵🇱" },
};

// Maps locale -> Intl locale tag used for Intl.NumberFormat / Intl.DateTimeFormat
export const intlLocaleTag: Record<Locale, string> = {
  ar: "ar-SA",
  en: "en-US",
  fr: "fr-FR",
  tr: "tr-TR",
  pl: "pl-PL",
};

// Maps locale -> default currency shown in quote/price contexts.
// Adjust per market once pricing display is enabled (currently RFQ-only per the intake form).
export const currencyByLocale: Record<Locale, string> = {
  ar: "SAR",
  en: "USD",
  fr: "EUR",
  tr: "TRY",
  pl: "PLN",
};

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(intlLocaleTag[locale]).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency?: string) {
  return new Intl.NumberFormat(intlLocaleTag[locale], {
    style: "currency",
    currency: currency ?? currencyByLocale[locale],
  }).format(value);
}

export function formatDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocaleTag[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
