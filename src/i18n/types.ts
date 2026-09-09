export type Language = "en" | "hi" | "te" | "ta";

export interface LanguageInfo {
  code: Language;
  label: string;
  subLabel: string;
  nativeName: string;
  flag?: string;
}

export type TranslationDictionary = Record<string, string>;
