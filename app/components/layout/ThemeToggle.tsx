"use client"

import * as React from "react"
import { IconMoon as Moon, IconSun as Sun } from "@tabler/icons-react"
import { useTheme } from "next-themes"

import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui"
import { useLocale } from "@/components/providers/LocaleProvider"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const { tooltip } = useLocale()

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="h-9 w-9 px-0"
                    aria-label={tooltip("toggleTheme")}
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">{tooltip("toggleTheme")}</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent>{tooltip("toggleTheme")}</TooltipContent>
        </Tooltip>
    )
}
