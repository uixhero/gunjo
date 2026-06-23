"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface CurrencyInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "type"> {
    value?: number
    defaultValue?: number
    /** Fires with the numeric value (or `undefined` when cleared). */
    onValueChange?: (value: number | undefined) => void
    /** ISO 4217 currency for the symbol + grouping. Default `"JPY"`. */
    currency?: string
    /** BCP-47 locale for the symbol + grouping. Default `"ja-JP"`. */
    locale?: string
    /** Show the currency symbol as a leading adornment. Default `true`. */
    showSymbol?: boolean
    min?: number
    max?: number
    /** Optional visible label rendered above the control and associated via `htmlFor`. */
    label?: React.ReactNode
    /** Optional helper text under the control, wired via `aria-describedby`. */
    description?: React.ReactNode
}

function getCurrencySymbol(locale: string, currency: string): string {
    try {
        const parts = new Intl.NumberFormat(locale, { style: "currency", currency }).formatToParts(0)
        return parts.find((part) => part.type === "currency")?.value ?? ""
    } catch {
        return currency
    }
}

/**
 * Money editor: a currency-symbol-prefixed, thousands-grouped, right-aligned
 * amount input that formats while typing (`1,000,000`) and emits a numeric value.
 * JPY-first / whole currency units. Pairs with `formatCurrency` for display. (#176)
 */
const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    (
        {
            className,
            value,
            defaultValue,
            onValueChange,
            currency = "JPY",
            locale = "ja-JP",
            showSymbol = true,
            min,
            max,
            onBlur,
            disabled,
            id,
            label,
            description,
            "aria-invalid": ariaInvalid,
            "aria-describedby": ariaDescribedby,
            ...props
        },
        ref
    ) => {
        const reactId = React.useId()
        const hasWrap = Boolean(label || description)
        const controlId = id ?? (hasWrap ? `${reactId}-currency` : undefined)
        const descriptionId = description ? `${reactId}-description` : undefined
        const describedBy = [descriptionId, ariaDescribedby].filter(Boolean).join(" ") || undefined
        const symbol = React.useMemo(() => getCurrencySymbol(locale, currency), [locale, currency])
        const group = React.useCallback(
            (n: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n),
            [locale]
        )
        const clamp = React.useCallback(
            (n: number) => {
                let result = n
                if (min !== undefined) result = Math.max(min, result)
                if (max !== undefined) result = Math.min(max, result)
                return result
            },
            [min, max]
        )

        const isControlled = value !== undefined
        const [internal, setInternal] = React.useState<number | undefined>(value ?? defaultValue)
        const current = isControlled ? value : internal

        // Draft string while editing so the field can be empty/partial without
        // snapping back; commit a number on each valid change. (cf. NumberInput #198)
        const [draft, setDraft] = React.useState<string | null>(null)
        const display = draft !== null ? draft : current !== undefined ? group(current) : ""

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const digits = event.target.value.replace(/[^\d]/g, "")
            if (digits === "") {
                setDraft("")
                if (!isControlled) setInternal(undefined)
                onValueChange?.(undefined)
                return
            }
            const next = clamp(Number(digits))
            setDraft(group(next))
            if (!isControlled) setInternal(next)
            onValueChange?.(next)
        }

        const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
            setDraft(null)
            onBlur?.(event)
        }

        const control = (
            <div
                className={cn(
                    "inline-flex h-9 w-full max-w-full items-center gap-1 rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
                    ariaInvalid && "border-destructive-border focus-within:ring-destructive-border",
                    disabled && "cursor-not-allowed opacity-50",
                    className
                )}
                data-slot="currency-input"
            >
                {showSymbol && symbol ? (
                    <span className="shrink-0 text-muted-foreground" aria-hidden="true">
                        {symbol}
                    </span>
                ) : null}
                <input
                    ref={ref}
                    id={controlId}
                    type="text"
                    inputMode="numeric"
                    value={display}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                    aria-invalid={ariaInvalid}
                    aria-describedby={describedBy}
                    className="w-full bg-transparent text-right font-normal tabular-nums text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
                    {...props}
                />
            </div>
        )

        if (!hasWrap) return control

        return (
            <div className="flex w-full flex-col gap-1.5">
                {label ? (
                    <label htmlFor={controlId} className="text-sm font-medium leading-none text-foreground">
                        {label}
                    </label>
                ) : null}
                {control}
                {description ? (
                    <p id={descriptionId} className="text-xs text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </div>
        )
    }
)
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
