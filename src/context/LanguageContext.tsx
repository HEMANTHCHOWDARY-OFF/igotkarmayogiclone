import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, SUPPORTED_LANGUAGES, translate } from "@/i18n";

export type { Language };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (k: string) => k,
});

const STORAGE_KEY = "gyanmarg_lang";
const LEGACY_STORAGE_KEY = "karmayogi_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved as Language;
      }
      return "en";
    } catch {
      return "en";
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      localStorage.setItem(LEGACY_STORAGE_KEY, lang);
    } catch {
      // storage unavailable
    }
  };

  const toggleLanguage = () => {
    // Quick toggle switches between English and Hindi
    setLanguage(language === "en" ? "hi" : "en");
  };

  const t = (key: string, params?: Record<string, string | number>, defaultText?: string): string => {
    return translate(language, key, params, defaultText);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
