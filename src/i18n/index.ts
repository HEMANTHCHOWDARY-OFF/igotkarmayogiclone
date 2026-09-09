import { Language, LanguageInfo, TranslationDictionary } from "./types";
import { en } from "./locales/en";
import { hi } from "./locales/hi";
import { te } from "./locales/te";
import { ta } from "./locales/ta";

export * from "./types";

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "en", label: "English", subLabel: "English", nativeName: "EN" },
  { code: "hi", label: "हिन्दी", subLabel: "Hindi", nativeName: "हि" },
  { code: "te", label: "తెలుగు", subLabel: "Telugu", nativeName: "తె" },
  { code: "ta", label: "தமிழ்", subLabel: "Tamil", nativeName: "த" },
];

export const translations: Record<Language, TranslationDictionary> = {
  en,
  hi,
  te,
  ta,
};

/**
 * Translate a key into the target language with robust fallback to English.
 * Supports template parameter replacements like {step} and {total}.
 */
export function translate(
  lang: Language,
  key: string,
  params?: Record<string, string | number>,
  defaultText?: string
): string {
  let template = translations[lang]?.[key] || translations.en?.[key] || defaultText || key;

  if (params && typeof template === "string") {
    Object.entries(params).forEach(([paramKey, paramVal]) => {
      template = template.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramVal));
    });
  }

  return template;
}
