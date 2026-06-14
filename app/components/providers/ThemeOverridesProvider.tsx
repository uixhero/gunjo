"use client";

import * as React from "react";

export type ThemeOverrides = {
    // Primary hue 0-360. null = use compiled-in default from globals.css.
    primaryHue: number | null;
    // Border radius value as a string (e.g. "0.5rem"). null = default.
    radius: string | null;
    // Root font size in px (controls every rem-based size). null = default (16).
    fontScale: number | null;
};

const STORAGE_KEY = "gunjo-theme-overrides";

const DEFAULT_OVERRIDES: ThemeOverrides = {
    primaryHue: null,
    radius: null,
    fontScale: null,
};

interface ThemeOverridesContextValue {
    overrides: ThemeOverrides;
    setOverride: <K extends keyof ThemeOverrides>(
        key: K,
        value: ThemeOverrides[K]
    ) => void;
    reset: () => void;
    cssSnippet: string;
}

const ThemeOverridesContext = React.createContext<
    ThemeOverridesContextValue | undefined
>(undefined);

// Pulled from globals.css :root. Only saturation + lightness are reused — hue
// is what the slider drives. Keeping the original S/L means switching hue
// produces a balanced color, not a fluorescent disaster.
const PRIMARY_SAT = 62;
const PRIMARY_LIGHT = 49;

function buildCssText(overrides: ThemeOverrides): string {
    const parts: string[] = [];
    if (overrides.primaryHue !== null) {
        const value = `${overrides.primaryHue} ${PRIMARY_SAT}% ${PRIMARY_LIGHT}%`;
        parts.push(`  --primary: ${value};`);
        parts.push(`  --ring: ${value};`);
    }
    if (overrides.radius !== null) {
        parts.push(`  --radius: ${overrides.radius};`);
    }
    if (parts.length === 0 && overrides.fontScale === null) {
        return "";
    }
    const rootBlock = parts.length > 0 ? `:root, .dark {\n${parts.join("\n")}\n}` : "";
    const htmlBlock =
        overrides.fontScale !== null
            ? `html { font-size: ${overrides.fontScale}px; }`
            : "";
    return [rootBlock, htmlBlock].filter(Boolean).join("\n");
}

function loadFromStorage(): ThemeOverrides {
    if (typeof window === "undefined") return DEFAULT_OVERRIDES;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_OVERRIDES;
        const parsed = JSON.parse(raw);
        return {
            primaryHue:
                typeof parsed.primaryHue === "number" ? parsed.primaryHue : null,
            radius: typeof parsed.radius === "string" ? parsed.radius : null,
            fontScale:
                typeof parsed.fontScale === "number" ? parsed.fontScale : null,
        };
    } catch {
        return DEFAULT_OVERRIDES;
    }
}

export function ThemeOverridesProvider({ children }: { children: React.ReactNode }) {
    const [overrides, setOverrides] = React.useState<ThemeOverrides>(DEFAULT_OVERRIDES);
    const [hydrated, setHydrated] = React.useState(false);

    React.useEffect(() => {
        setOverrides(loadFromStorage());
        setHydrated(true);
    }, []);

    React.useEffect(() => {
        if (!hydrated) return;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
        } catch {
            // Storage may be disabled — fail silently rather than break theming.
        }
    }, [overrides, hydrated]);

    const setOverride = React.useCallback(
        <K extends keyof ThemeOverrides>(key: K, value: ThemeOverrides[K]) => {
            setOverrides((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const reset = React.useCallback(() => {
        setOverrides(DEFAULT_OVERRIDES);
    }, []);

    const cssText = React.useMemo(() => buildCssText(overrides), [overrides]);
    const cssSnippet = React.useMemo(
        () =>
            cssText.length > 0
                ? cssText
                : "/* No overrides — current theme uses GunjoUI defaults. */",
        [cssText]
    );

    const value = React.useMemo<ThemeOverridesContextValue>(
        () => ({ overrides, setOverride, reset, cssSnippet }),
        [overrides, setOverride, reset, cssSnippet]
    );

    return (
        <ThemeOverridesContext.Provider value={value}>
            {/* Inject overrides as a single style tag at end of head, so it
                cascades over globals.css. Empty string means no overrides. */}
            {cssText.length > 0 ? (
                <style data-gunjo-theme-overrides>{cssText}</style>
            ) : null}
            {children}
        </ThemeOverridesContext.Provider>
    );
}

export function useThemeOverrides(): ThemeOverridesContextValue {
    const ctx = React.useContext(ThemeOverridesContext);
    if (!ctx) {
        throw new Error(
            "useThemeOverrides must be used inside ThemeOverridesProvider"
        );
    }
    return ctx;
}
