"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LanguageCode, defaultLanguage } from "@/lib/i18n";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(defaultLanguage);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("gnoa_language") as
      | LanguageCode
      | null;
    if (stored) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("gnoa_language", lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}

