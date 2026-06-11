"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { CopyButton } from "../inputs/CopyButton"

export interface ColorSwatchProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
    /** CSS color value (hex, rgb, hsl, var(--token), etc.). */
    color: string
    /** Optional label override. Defaults to `color`. */
    label?: string
    /** Show a copy-to-clipboard button. Default true. */
    copyable?: boolean
    /** Accessible label and tooltip for the copy button. */
    copyLabel?: string
    /** Label shown briefly after copying. */
    copiedLabel?: string
    /** Duration in milliseconds to keep copied feedback visible. Default 5000. */
    copiedDuration?: number
    size?: "sm" | "default" | "lg"
}

const SIZE_MAP = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
} as const

const ColorSwatch = React.forwardRef<HTMLDivElement, ColorSwatchProps>(
    (
        { className, color, label, copyable = true, copyLabel, copiedLabel = "Copied", copiedDuration = 5000, size = "default", ...props },
        ref
    ) => {
        const display = label ?? color

        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center gap-2 rounded-md border border-input bg-transparent p-1.5 pr-2 text-sm",
                    className
                )}
                {...props}
            >
                <span
                    aria-hidden
                    className={cn(
                        "shrink-0 rounded border border-border/50",
                        SIZE_MAP[size]
                    )}
                    style={{ backgroundColor: color }}
                />
                <span className="font-mono text-xs">{display}</span>
                {copyable ? (
                    <CopyButton
                        value={color}
                        copyLabel={copyLabel ?? `Copy ${color}`}
                        copiedLabel={copiedLabel}
                        copiedDuration={copiedDuration}
                        className="ml-auto h-5 w-5 text-muted-foreground hover:text-foreground"
                    />
                ) : null}
            </div>
        )
    }
)
ColorSwatch.displayName = "ColorSwatch"

export { ColorSwatch }
