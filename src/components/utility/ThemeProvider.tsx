"use client"

import * as React from "react"
import { IconMoon as Moon, IconSun as Sun } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Button, type ButtonProps } from "../inputs/Button"

/**
 * Theme coordination primitive. gunjo ships correct `.dark`-class tokens but no
 * runtime to drive them — out of the box a consumer relying on the OS setting
 * gets a permanently light page. `ThemeProvider` bridges `prefers-color-scheme`,
 * persists an explicit choice, and toggles the `.dark` class on the document so
 * every token follows. (#171)
 */

export type Theme = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

interface ThemeContextValue {
    /** The chosen preference, including `"system"`. */
    theme: Theme
    /** The concrete theme actually applied right now (`"system"` resolved). */
    resolvedTheme: ResolvedTheme
    setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

function getSystemTheme(): ResolvedTheme {
    if (typeof window === "undefined" || !window.matchMedia) return "light"
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export interface ThemeProviderProps {
    children: React.ReactNode
    /** Initial preference before any stored value is read. Default `"system"`. */
    defaultTheme?: Theme
    /** `localStorage` key for the persisted preference. Default `"gunjo-theme"`. */
    storageKey?: string
    /** Set `false` to skip persistence (e.g. a scoped preview). Default `true`. */
    enablePersistence?: boolean
    /** Element the `.dark` class is applied to. Default `document.documentElement`. */
    targetElement?: HTMLElement | null
}

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "gunjo-theme",
    enablePersistence = true,
    targetElement,
}: ThemeProviderProps) {
    const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
    const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>(
        defaultTheme === "dark" ? "dark" : "light"
    )

    // Read the stored preference after mount (avoids SSR/hydration mismatch).
    React.useEffect(() => {
        if (!enablePersistence) return
        try {
            const stored = window.localStorage.getItem(storageKey) as Theme | null
            if (stored === "light" || stored === "dark" || stored === "system") {
                setThemeState(stored)
            }
        } catch {
            /* localStorage unavailable (private mode / SSR) — keep default. */
        }
    }, [enablePersistence, storageKey])

    // Apply the resolved theme to the DOM and keep it in sync with the OS when
    // the preference is `"system"`.
    React.useEffect(() => {
        const root = targetElement ?? (typeof document !== "undefined" ? document.documentElement : null)
        if (!root) return

        const apply = (next: ResolvedTheme) => {
            root.classList.toggle("dark", next === "dark")
            setResolvedTheme(next)
        }

        if (theme === "system") {
            const mql = window.matchMedia("(prefers-color-scheme: dark)")
            apply(mql.matches ? "dark" : "light")
            const onChange = (e: MediaQueryListEvent) => apply(e.matches ? "dark" : "light")
            mql.addEventListener("change", onChange)
            return () => mql.removeEventListener("change", onChange)
        }

        apply(theme)
    }, [theme, targetElement])

    const setTheme = React.useCallback(
        (next: Theme) => {
            setThemeState(next)
            if (enablePersistence) {
                try {
                    window.localStorage.setItem(storageKey, next)
                } catch {
                    /* ignore */
                }
            }
        },
        [enablePersistence, storageKey]
    )

    const value = React.useMemo<ThemeContextValue>(
        () => ({ theme, resolvedTheme, setTheme }),
        [theme, resolvedTheme, setTheme]
    )

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
    const context = React.useContext(ThemeContext)
    if (!context) throw new Error("useTheme must be used within a ThemeProvider")
    return context
}

export interface ThemeScriptProps {
    storageKey?: string
    defaultTheme?: Theme
}

/**
 * Render once in `<head>` (or at the top of `<body>`) to set the `.dark` class
 * before first paint, eliminating the light-mode flash on dark loads. Mirrors
 * the stored preference / OS setting the provider will adopt on mount.
 */
export function ThemeScript({ storageKey = "gunjo-theme", defaultTheme = "system" }: ThemeScriptProps) {
    const script = `(function(){try{var k=${JSON.stringify(storageKey)};var d=${JSON.stringify(
        defaultTheme
    )};var t=localStorage.getItem(k)||d;var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=t==='dark'||(t==='system'&&m);document.documentElement.classList.toggle('dark',dark);}catch(e){}})();`
    return <script dangerouslySetInnerHTML={{ __html: script }} suppressHydrationWarning />
}

export interface ThemeToggleProps extends Omit<ButtonProps, "children" | "onClick"> {
    /** Accessible label / tooltip text. Default `"Toggle theme"`. */
    label?: string
}

/**
 * Minimal light/dark toggle composing `Button`. Flips between the two concrete
 * themes (a `"system"` preference resolves first, then toggles explicitly).
 */
export const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
    ({ label = "Toggle theme", variant = "ghost", size = "icon", className, ...props }, ref) => {
        const { resolvedTheme, setTheme } = useTheme()
        return (
            <Button
                ref={ref}
                variant={variant}
                size={size}
                className={className}
                aria-label={label}
                title={label}
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                {...props}
            >
                <Sun className={cn("h-4 w-4", resolvedTheme === "dark" && "hidden")} aria-hidden="true" />
                <Moon className={cn("h-4 w-4", resolvedTheme !== "dark" && "hidden")} aria-hidden="true" />
            </Button>
        )
    }
)
ThemeToggle.displayName = "ThemeToggle"
