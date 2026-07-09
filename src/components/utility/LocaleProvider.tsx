"use client"

import * as React from "react"

/**
 * Locale coordination primitive. gunjo is a Japanese-brand kit, but several
 * built-in, user-visible strings on the older shadcn-derived components
 * (DataTable "No results." / Pagination "Previous" / Combobox "Search...")
 * default to English, and there is no single switch to localize them — a
 * consumer otherwise overrides `labels`/`placeholder` on every instance.
 *
 * `LocaleProvider` supplies one `locale` + a string bundle that those
 * components read. Precedence is: per-instance prop > provider bundle >
 * built-in default. It is fully backward compatible: with no provider mounted,
 * components keep their built-in English default (the `en` bundle), so existing
 * trees render exactly as before. Wrap the app once to switch:
 *
 * ```tsx
 * <LocaleProvider locale="ja">
 *   <App />
 * </LocaleProvider>
 * ```
 *
 * (#326)
 */

export type Locale = "en" | "ja"

/**
 * The built-in string keys read by components. To add a localizable string:
 * add a key here, then a value to BOTH `en` and `ja` in {@link LOCALE_BUNDLES}.
 */
export interface LocaleStrings {
    /** DataTable empty-state text. */
    noResults: string
    /** DataTable filter input placeholder. */
    filterPlaceholder: string
    /** DataTable rows-per-page label. */
    rowsPerPage: string
    /** Previous-page / previous-item label (DataTable, MediaLightbox). */
    previous: string
    /** Next-page / next-item label (DataTable, MediaLightbox). */
    next: string
    /** Search placeholder (Combobox, SearchInput). */
    searchPlaceholder: string
    /** SearchableAccordion search placeholder. */
    searchItemsPlaceholder: string
    /** MediaPickerDialog asset-search placeholder. */
    searchAssetsPlaceholder: string
    /** CommandPalette empty message. */
    commandEmpty: string
    /** Close control label (Dialog, Sheet, Modal, PageAside, MediaLightbox, …). */
    close: string
    /** Expand/open control label (Accordion, PageAside). */
    open: string
}

const EN_STRINGS: LocaleStrings = {
    noResults: "No results.",
    filterPlaceholder: "Filter...",
    rowsPerPage: "Rows per page",
    previous: "Previous",
    next: "Next",
    searchPlaceholder: "Search...",
    searchItemsPlaceholder: "Search items...",
    searchAssetsPlaceholder: "Search assets...",
    commandEmpty: "No results found.",
    close: "Close",
    open: "Open",
}

const JA_STRINGS: LocaleStrings = {
    noResults: "該当なし",
    filterPlaceholder: "絞り込み…",
    rowsPerPage: "表示件数",
    previous: "前へ",
    next: "次へ",
    searchPlaceholder: "検索…",
    searchItemsPlaceholder: "項目を検索…",
    searchAssetsPlaceholder: "素材を検索…",
    commandEmpty: "見つかりませんでした",
    close: "閉じる",
    open: "開く",
}

/** Built-in bundles. `en` is the default when no provider is mounted. */
export const LOCALE_BUNDLES: Record<Locale, LocaleStrings> = {
    en: EN_STRINGS,
    ja: JA_STRINGS,
}

interface LocaleContextValue {
    locale: Locale
    strings: LocaleStrings
}

const LocaleContext = React.createContext<LocaleContextValue | undefined>(undefined)

export interface LocaleProviderProps {
    children: React.ReactNode
    /** Active locale; selects the built-in bundle. Default `"en"`. */
    locale?: Locale
    /**
     * Override individual strings on top of the selected bundle (e.g. a custom
     * "No results." wording). Highest bundle-level precedence; per-instance
     * component props still win over this.
     */
    strings?: Partial<LocaleStrings>
}

export function LocaleProvider({ children, locale = "en", strings }: LocaleProviderProps) {
    const value = React.useMemo<LocaleContextValue>(
        () => ({
            locale,
            strings: strings ? { ...LOCALE_BUNDLES[locale], ...strings } : LOCALE_BUNDLES[locale],
        }),
        [locale, strings]
    )
    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

/**
 * Read the active locale + string bundle. Backward compatible: returns the `en`
 * bundle (built-in defaults) when no `LocaleProvider` is mounted — it never
 * throws, so components degrade to their previous English behavior.
 */
export function useLocale(): LocaleContextValue {
    return React.useContext(LocaleContext) ?? { locale: "en", strings: EN_STRINGS }
}

/** Convenience: the active string bundle only. */
export function useLocaleStrings(): LocaleStrings {
    return useLocale().strings
}
