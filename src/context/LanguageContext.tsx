"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { setCookie } from "cookies-next";

export type Language = "English" | "Serbian";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children, initialLanguage = "English" }: { children: ReactNode; initialLanguage?: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    setCookie("language", lang, { maxAge: 60 * 60 * 24 * 365 });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
