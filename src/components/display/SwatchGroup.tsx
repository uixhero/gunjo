"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { SwatchGroupVariantKey } from "./generated/variant-keys"
import { swatchGroupDefaultVariantKey } from "./generated/default-variant-keys"

const swatchSizeClasses: Record<SwatchGroupVariantKey, string> = {
    sm: "h-6 w-6",
    default: "h-8 w-8",
    lg: "h-10 w-10",
}

export interface SwatchOption {
    value: string
    /** Accessible name for the swatch (e.g. the colour name). */
    label: string
    /** CSS colour value applied to the swatch (product data, not a token). */
    color: string
    disabled?: boolean
}

export interface SwatchGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
    options: SwatchOption[]
    value?: string
    onValueChange?: (value: string) => void
    /** Swatch size. Default `"default"`. */
    size?: SwatchGroupVariantKey
    /** Keep a selection — clicking the active swatch won't clear it. */
    disallowEmpty?: boolean
}

/**
 * Selectable colour swatches (single-select). A real `radiogroup` with roving
 * tabindex + arrow-key navigation; disabled (out-of-stock) swatches are skipped.
 * Colour values are product data, so they're applied via `style`, not tokens. (#172)
 */
export const SwatchGroup = React.forwardRef<HTMLDivElement, SwatchGroupProps>(
    ({ className, options, value, onValueChange, size = swatchGroupDefaultVariantKey, disallowEmpty, ...props }, ref) => {
        const enabledValues = options.filter((o) => !o.disabled).map((o) => o.value)
        const selectedIsEnabled = value !== undefined && enabledValues.includes(value)
        // Roving tabindex anchor: the selection, else the first enabled swatch.
        const tabbableValue = selectedIsEnabled ? value : enabledValues[0]

        const select = (next: string) => {
            if (disallowEmpty && next === value) return
            onValueChange?.(next)
        }

        const moveFocus = (currentValue: string, dir: 1 | -1) => {
            if (!enabledValues.length) return
            const idx = enabledValues.indexOf(currentValue)
            const start = idx === -1 ? 0 : idx
            const nextValue = enabledValues[(start + dir + enabledValues.length) % enabledValues.length]
            document.getElementById(`swatch-${nextValue}`)?.focus()
            select(nextValue)
        }

        return (
            <div
                ref={ref}
                role="radiogroup"
                className={cn("inline-flex flex-wrap items-center gap-2", className)}
                {...props}
            >
                {options.map((option) => {
                    const checked = option.value === value
                    return (
                        <button
                            key={option.value}
                            id={`swatch-${option.value}`}
                            type="button"
                            role="radio"
                            aria-checked={checked}
                            aria-label={option.label}
                            disabled={option.disabled}
                            tabIndex={option.value === tabbableValue ? 0 : -1}
                            onClick={() => select(option.value)}
                            onKeyDown={(e) => {
                                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                                    e.preventDefault()
                                    moveFocus(option.value, 1)
                                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                                    e.preventDefault()
                                    moveFocus(option.value, -1)
                                }
                            }}
                            className={cn(
                                "relative inline-flex items-center justify-center rounded-full border border-border ring-offset-background transition-shadow",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                // Selection is conveyed by the ring (visual) + aria-checked (a11y),
                                // so it stays legible on any product colour without a contrast hack.
                                checked && "ring-2 ring-ring ring-offset-2",
                                option.disabled && "cursor-not-allowed opacity-40",
                                swatchSizeClasses[size]
                            )}
                            style={{ backgroundColor: option.color }}
                        />
                    )
                })}
            </div>
        )
    }
)

SwatchGroup.displayName = "SwatchGroup"
