/**
 * Number / currency / percent formatting helpers. Fintech, commerce and
 * analytics screens all hand-roll yen/signed/compact formatters (cold-test #32
 * transfer + #33 portfolio both did) because the library shipped none — only an
 * `en-US` chart default. These are locale-aware, JPY-first, and tree-shakeable.
 * (#180)
 */

export interface FormatNumberOptions {
    /** BCP-47 locale. Default `"ja-JP"`. */
    locale?: string
    /** Force a leading `+` on positive values (negatives always show `-`). */
    signed?: boolean
    /** Compact notation (e.g. `1.2万` / `1.2M`). */
    compact?: boolean
    minimumFractionDigits?: number
    maximumFractionDigits?: number
}

export interface FormatCurrencyOptions extends FormatNumberOptions {
    /** ISO 4217 currency code. Default `"JPY"`. */
    currency?: string
}

export interface FormatPercentOptions extends Omit<FormatNumberOptions, "compact"> {
    /**
     * Treat the input as an already-scaled percent (e.g. `33.5` → `33.5%`)
     * instead of a ratio (`0.335` → `33.5%`). Default `false` (ratio).
     */
    asPercentValue?: boolean
}

function withSign(formatted: string, value: number, signed?: boolean): string {
    return signed && value > 0 ? `+${formatted}` : formatted
}

/** Format money. Defaults to JPY / `ja-JP` (`¥1,234,567`). */
export function formatCurrency(value: number, options: FormatCurrencyOptions = {}): string {
    const {
        locale = "ja-JP",
        currency = "JPY",
        signed,
        compact,
        minimumFractionDigits,
        maximumFractionDigits,
    } = options
    const formatted = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        notation: compact ? "compact" : "standard",
        ...(minimumFractionDigits !== undefined ? { minimumFractionDigits } : {}),
        ...(maximumFractionDigits !== undefined ? { maximumFractionDigits } : {}),
    }).format(value)
    return withSign(formatted, value, signed)
}

/** Format a grouped number (`1,234,567`). */
export function formatNumber(value: number, options: FormatNumberOptions = {}): string {
    const { locale = "ja-JP", signed, compact, minimumFractionDigits, maximumFractionDigits } = options
    const formatted = new Intl.NumberFormat(locale, {
        notation: compact ? "compact" : "standard",
        ...(minimumFractionDigits !== undefined ? { minimumFractionDigits } : {}),
        ...(maximumFractionDigits !== undefined ? { maximumFractionDigits } : {}),
    }).format(value)
    return withSign(formatted, value, signed)
}

/** Format a percentage. Input is a ratio by default (`0.335` → `33.5%`). */
export function formatPercent(value: number, options: FormatPercentOptions = {}): string {
    const { locale = "ja-JP", signed, asPercentValue, minimumFractionDigits, maximumFractionDigits = 1 } = options
    const ratio = asPercentValue ? value / 100 : value
    const formatted = new Intl.NumberFormat(locale, {
        style: "percent",
        ...(minimumFractionDigits !== undefined ? { minimumFractionDigits } : {}),
        maximumFractionDigits,
    }).format(ratio)
    return withSign(formatted, value, signed)
}
