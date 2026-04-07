"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getDefaultUiLanguage,
  type UiCopy,
  uiCopy,
  type UiLanguage,
} from "@/lib/i18n/ui-copy";

const STORAGE_KEY = "poker-trainer-ui-language";

type UiLanguageContextValue = {
  language: UiLanguage;
  setLanguage: (language: UiLanguage) => void;
  copy: UiCopy;
};

const UiLanguageContext = createContext<UiLanguageContextValue | null>(null);

type UiLanguageProviderProps = {
  children: ReactNode;
};

export function UiLanguageProvider({ children }: UiLanguageProviderProps) {
  const [language, setLanguage] = useState<UiLanguage>(getDefaultUiLanguage());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedLanguage = window.localStorage.getItem(STORAGE_KEY);

    if (storedLanguage === "en" || storedLanguage === "vi") {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language);
    }

    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const value = useMemo<UiLanguageContextValue>(
    () => ({
      language,
      setLanguage,
      copy: uiCopy[language] as UiCopy,
    }),
    [language],
  );

  return (
    <UiLanguageContext.Provider value={value}>
      {children}
    </UiLanguageContext.Provider>
  );
}

export function useUiLanguage() {
  const context = useContext(UiLanguageContext);

  if (!context) {
    throw new Error("useUiLanguage must be used inside UiLanguageProvider.");
  }

  return context;
}

export function useUiCopy() {
  return useUiLanguage().copy;
}
