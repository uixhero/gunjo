"use client";

import * as React from "react";
import { LocaleProvider as KitLocaleProvider } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

/**
 * Bridges the docs-site locale (ja/en toggle) into @gunjo/ui's own
 * `LocaleProvider`, so built-in kit strings (DataTable "該当なし", Combobox
 * "検索…", Dialog close label, …) follow the site language. gunjo.jp dogfoods
 * the kit, so its component demos must speak the language the visitor picked.
 * (#326)
 */
export function KitLocaleBridge({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  return <KitLocaleProvider locale={locale}>{children}</KitLocaleProvider>;
}
