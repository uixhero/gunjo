"use client";

import * as React from "react";
import { type Locale, type HomeTranslations, type IntroTranslations, type HeaderKey, type TooltipKey, type PagesTranslations, type ThemeSwitcherStrings, type StabilityBadgeStrings, translations, getBilingualTitle } from "@/lib/translations";
import { getSectionLabels } from "@/lib/docs-content";
import type { SectionLabels } from "@/lib/docs-content";

const STORAGE_KEY = "gunjo-docs-locale";

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "ja";
  try {
    const fromQuery = new URLSearchParams(window.location.search).get("locale");
    if (fromQuery === "ja" || fromQuery === "en") return fromQuery;
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "ja" || v === "en") return v;
  } catch {
    // ignore
  }
  return "ja";
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: string) => string;
  bilingual: (key: string) => { en: string; ja: string; primary: string; secondary: string };
  header: (key: HeaderKey) => string;
  tooltip: (key: TooltipKey) => string;
  themeSwitcher: ThemeSwitcherStrings;
  stabilityBadge: StabilityBadgeStrings;
  home: HomeTranslations;
  intro: IntroTranslations;
  pages: PagesTranslations;
  sectionLabels: SectionLabels;
};

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("ja");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setLocaleState(getStoredLocale());
    setMounted(true);
  }, []);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      if (typeof document !== "undefined") {
        document.documentElement.lang = next === "ja" ? "ja" : "en";
      }
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale === "ja" ? "ja" : "en";
  }, [locale, mounted]);

  const t = React.useCallback(
    (key: string) => translations[locale].nav[key] ?? key,
    [locale]
  );

  const bilingual = React.useCallback(
    (key: string) => getBilingualTitle(locale, key),
    [locale]
  );

  const header = React.useCallback(
    (key: HeaderKey) => translations[locale].header[key],
    [locale]
  );

  const tooltip = React.useCallback(
    (key: TooltipKey) => translations[locale].tooltips[key],
    [locale]
  );

  const sectionLabels = React.useMemo(() => getSectionLabels(locale), [locale]);
  const home = React.useMemo(() => translations[locale].home, [locale]);
  const intro = React.useMemo(() => translations[locale].intro, [locale]);
  const pages = React.useMemo(() => translations[locale].pages, [locale]);
  const themeSwitcher = React.useMemo(
    () => translations[locale].themeSwitcher,
    [locale]
  );
  const stabilityBadge = React.useMemo(
    () => translations[locale].stabilityBadge,
    [locale]
  );

  const value = React.useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t, bilingual, header, tooltip, themeSwitcher, stabilityBadge, home, intro, pages, sectionLabels }),
    [locale, setLocale, t, bilingual, header, tooltip, themeSwitcher, stabilityBadge, home, intro, pages, sectionLabels]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
