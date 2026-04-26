import { useRouter } from "next/router";
import en from "@/locales/en.json";
import uk from "@/locales/uk.json";

const dictionaries = { en, uk } as const;

export type Locale = keyof typeof dictionaries;
export const SUPPORTED_LOCALES: Locale[] = ["en", "uk"];
export const DEFAULT_LOCALE: Locale = "en";

/**
 * Map our app locale to the language code TMDB expects.
 * TMDB uses BCP-47-ish: en-US, uk-UA, etc.
 */
export const tmdbLanguageFromLocale = (locale: string | undefined): string => {
  switch (locale) {
    case "uk":
      return "uk-UA";
    case "en":
    default:
      return "en-US";
  }
};

/**
 * Resolve a "dot path" key like "header.signIn" against a nested object.
 */
const resolveKey = (dict: any, key: string): string | undefined => {
  return key
    .split(".")
    .reduce((acc, k) => (acc && typeof acc === "object" ? acc[k] : undefined), dict);
};

/**
 * Tiny i18n hook. Returns t(key, vars?) where vars replace {placeholder} tokens.
 * Falls back to English, then to the key itself, so missing strings stay obvious.
 */
export const useTranslation = () => {
  const { locale } = useRouter();
  const activeLocale = (
    SUPPORTED_LOCALES.includes(locale as Locale) ? locale : DEFAULT_LOCALE
  ) as Locale;

  const dict = dictionaries[activeLocale];
  const fallback = dictionaries[DEFAULT_LOCALE];

  const t = (key: string, vars?: Record<string, string | number>): string => {
    let value = resolveKey(dict, key) ?? resolveKey(fallback, key) ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }
    return value;
  };

  return { t, locale: activeLocale };
};
