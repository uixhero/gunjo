import * as React from "react"
import { IconArrowDown as ArrowDown, IconArrowUp as ArrowUp, IconMinus as Minus } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { formatNumber } from "../../lib/format"

export type DeltaSign = "positive" | "negative" | "zero"
export type DeltaTone = "success" | "destructive" | "warning" | "info" | "muted"

export interface DeltaProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
    /** The signed change. The sign drives the arrow, tone and label. */
    value: number
    /**
     * Format the numeric value. Default: signed, grouped, `ja-JP`
     * (`+1,000` / `−930`). Pass `formatCurrency` for ¥, or any formatter.
     * Receives the raw `value`; format `Math.abs(value)` to show magnitude only.
     */
    format?: (value: number) => React.ReactNode
    /**
     * Tone per sign. Default `{ positive: "success", negative: "destructive", zero: "muted" }`.
     * Override where positive isn't "good" — e.g. cash over/short
     * `{ positive: "warning", negative: "destructive", zero: "success" }`.
     */
    tones?: Partial<Record<DeltaSign, DeltaTone>>
    /**
     * Accessible (and optionally visible) label per sign — e.g.
     * `{ positive: "増加", negative: "減少", zero: "増減なし" }` or
     * `{ positive: "過剰", negative: "不足", zero: "一致" }`. Always announced so
     * meaning never rides on colour or arrow alone.
     */
    labels?: Partial<Record<DeltaSign, React.ReactNode>>
    /** Render the sign label visibly after the value. Default `false` → screen-reader-only. */
    showLabel?: boolean
    /** Hide the directional arrow. Default `false`. */
    hideArrow?: boolean
}

const DEFAULT_TONES: Record<DeltaSign, DeltaTone> = {
    positive: "success",
    negative: "destructive",
    zero: "muted",
}

const TONE_CLASS: Record<DeltaTone, string> = {
    success: "text-success-strong",
    destructive: "text-destructive",
    warning: "text-warning",
    info: "text-info",
    muted: "text-muted-foreground",
}

const SIGN_ICON: Record<DeltaSign, React.ComponentType<{ className?: string }>> = {
    positive: ArrowUp,
    negative: ArrowDown,
    zero: Minus,
}

const defaultFormat = (value: number) => formatNumber(value, { signed: true })

const signOf = (value: number): DeltaSign => (value > 0 ? "positive" : value < 0 ? "negative" : "zero")

/**
 * Inline signed-change atom: a value with a directional arrow, a sign-driven
 * tone, and a screen-reader (or visible) label. One primitive for gain/loss,
 * variance (差異) and cash over/short (過不足). Fits inside a table cell, unlike
 * the card-shaped `Statistic`.
 */
const Delta = React.forwardRef<HTMLSpanElement, DeltaProps>(
    ({ className, value, format = defaultFormat, tones, labels, showLabel = false, hideArrow = false, ...props }, ref) => {
        const sign = signOf(value)
        const tone = tones?.[sign] ?? DEFAULT_TONES[sign]
        const Icon = SIGN_ICON[sign]
        const label = labels?.[sign]

        return (
            <span
                ref={ref}
                className={cn("inline-flex items-center gap-1 font-medium tabular-nums", TONE_CLASS[tone], className)}
                {...props}
            >
                {hideArrow ? null : <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                <span>{format(value)}</span>
                {label != null ? (
                    showLabel ? (
                        <span className="font-normal">{label}</span>
                    ) : (
                        <span className="sr-only">{label}</span>
                    )
                ) : null}
            </span>
        )
    }
)
Delta.displayName = "Delta"

export { Delta }
