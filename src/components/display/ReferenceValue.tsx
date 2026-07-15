import * as React from "react"
import { IconAlertTriangle, IconArrowDown, IconArrowUp, IconCheck } from "@tabler/icons-react"

import { cn } from "../../lib/utils"

export type RangeFlag = "normal" | "high" | "low" | "critical-high" | "critical-low"

export interface ReferenceRange {
    /** Lower bound of the normal range. A value below it flags `low`. */
    low?: number
    /** Upper bound of the normal range. A value above it flags `high`. */
    high?: number
    /** At/below this, flag `critical-low` (異常低値 / パニック値). */
    criticalLow?: number
    /** At/above this, flag `critical-high` (異常高値 / パニック値). */
    criticalHigh?: number
}

/**
 * Pure classifier: judge a `value` against a `ReferenceRange`. Exported so
 * tables and charts can flag/colour cells without re-deriving. Critical bounds
 * win over normal bounds. (#241)
 */
export function flagValue(value: number, range: ReferenceRange): RangeFlag {
    const { low, high, criticalLow, criticalHigh } = range
    if (criticalHigh != null && value >= criticalHigh) return "critical-high"
    if (criticalLow != null && value <= criticalLow) return "critical-low"
    if (high != null && value > high) return "high"
    if (low != null && value < low) return "low"
    return "normal"
}

export type ReferenceValueTone = "success" | "warning" | "destructive"

const FLAG_CONFIG: Record<
    RangeFlag,
    { code: string; tone: ReferenceValueTone; icon: typeof IconCheck; defaultLabel: string }
> = {
    normal: { code: "", tone: "success", icon: IconCheck, defaultLabel: "基準値内" },
    high: { code: "H", tone: "warning", icon: IconArrowUp, defaultLabel: "高値" },
    low: { code: "L", tone: "warning", icon: IconArrowDown, defaultLabel: "低値" },
    "critical-high": { code: "HH", tone: "destructive", icon: IconAlertTriangle, defaultLabel: "異常高値" },
    "critical-low": { code: "LL", tone: "destructive", icon: IconAlertTriangle, defaultLabel: "異常低値" },
}

const TONE_TEXT: Record<ReferenceValueTone, string> = {
    success: "text-success-strong",
    warning: "text-warning",
    destructive: "text-destructive",
}

const TONE_CHIP: Record<ReferenceValueTone, string> = {
    success: "bg-success-subtle text-success-subtle-foreground",
    warning: "bg-warning-subtle text-warning-subtle-foreground",
    destructive: "bg-destructive-subtle text-destructive-subtle-foreground",
}

function formatBound(range: ReferenceRange, format: (v: number) => React.ReactNode): React.ReactNode {
    const lo = range.low != null ? format(range.low) : null
    const hi = range.high != null ? format(range.high) : null
    if (lo != null && hi != null) {
        return (
            <>
                {lo}–{hi}
            </>
        )
    }
    if (hi != null) return <>≤{hi}</>
    if (lo != null) return <>≥{lo}</>
    return null
}

export interface ReferenceValueProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
    /** The measured value. */
    value: number
    /** The reference range it's judged against. */
    range: ReferenceRange
    /** Format the value (and the range bounds). Default: `String(value)`. */
    format?: (value: number) => React.ReactNode
    /** Unit suffix (e.g. `"℃"`, `"mg"`, `"mEq/L"`). */
    unit?: string
    /**
     * Localized flag labels (announced + used when `showLabel`). Defaults to JA
     * (高値/低値/異常…), which assume **higher = worse** (clinical). For domains
     * where LOW is bad (grades, inventory-vs-safety-stock), override `labels` so
     * `high`/`low` read correctly. (#291)
     */
    labels?: Partial<Record<RangeFlag, string>>
    /** Show the flag label text visibly next to the code. Default `false` (code chip only; label is sr-only). */
    showLabel?: boolean
    /** Show the normal-range text (e.g. `基準 36.0–37.5`). Default `false`. */
    showRange?: boolean
    /** Label preceding the range text. Default `"基準"`. */
    rangeLabel?: string
    /** Hide the flag chip entirely (value is still toned + sr-only flag text kept). Default `false`. */
    hideFlag?: boolean
    /**
     * When the value is in range (`normal`), give it an **affirmative** success
     * chip (✓ + `positiveLabel`) and success tone — for a passing / above-average
     * value that deserves a positive highlight, not just the absence of a warning
     * (e.g. a gradebook). The consumer decides when a value is "good". Ignored for
     * abnormal values (their flag wins). Default `false`. (#291)
     */
    affirmative?: boolean
    /** Label for the affirmative chip. Default: the `normal` label (e.g. pass "良"). (#291) */
    positiveLabel?: string
    /** Compact size for table cells. Default `"default"`. */
    size?: "default" | "inline"
}

/**
 * A measured value judged against a reference range — the value-vs-range
 * primitive that vitals, lab results, dose safety, SLA/quota and tolerance
 * bands all need. Renders the value + unit toned by its flag, a flag chip
 * (H/L/HH/LL) and screen-reader text, so the abnormal state never rides on
 * colour alone. Pair with the pure `flagValue()` for tables/charts. (#241)
 */
const ReferenceValue = React.forwardRef<HTMLSpanElement, ReferenceValueProps>(
    (
        {
            className,
            value,
            range,
            format = (v) => String(v),
            unit = "",
            labels,
            showLabel = false,
            showRange = false,
            rangeLabel = "基準",
            hideFlag = false,
            affirmative = false,
            positiveLabel,
            size = "default",
            ...props
        },
        ref
    ) => {
        const flag = flagValue(value, range)
        const config = FLAG_CONFIG[flag]
        const Icon = config.icon
        const label = labels?.[flag] ?? config.defaultLabel
        const isAbnormal = flag !== "normal"
        // Affirmative highlight only applies to an in-range value. (#291)
        const isAffirmative = affirmative && !isAbnormal && !hideFlag
        const affirmativeLabel = positiveLabel ?? label
        const rangeText = showRange ? formatBound(range, format) : null

        return (
            <span
                ref={ref}
                className={cn("inline-flex items-center gap-1.5", size === "inline" ? "text-sm" : "text-base", className)}
                {...props}
            >
                <span
                    className={cn(
                        "font-medium tabular-nums",
                        isAbnormal ? TONE_TEXT[config.tone] : isAffirmative ? TONE_TEXT.success : "text-foreground"
                    )}
                >
                    {format(value)}
                    {unit ? <span className="ml-0.5 text-xs font-normal text-muted-foreground">{unit}</span> : null}
                </span>

                {hideFlag ? null : isAbnormal ? (
                    <span
                        className={cn(
                            "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-semibold",
                            TONE_CHIP[config.tone]
                        )}
                    >
                        <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                        {config.code}
                        {showLabel ? <span className="font-normal">{label}</span> : null}
                    </span>
                ) : isAffirmative ? (
                    <span
                        className={cn(
                            "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-semibold",
                            TONE_CHIP.success
                        )}
                    >
                        <IconCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
                        {affirmativeLabel}
                    </span>
                ) : showLabel ? (
                    <span className="inline-flex items-center gap-0.5 text-xs text-success-strong">
                        <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                        {label}
                    </span>
                ) : null}

                {/* Announce the flag so it never rides on colour / code alone —
                    but only when it isn't already shown visibly (showLabel, or the
                    affirmative chip), otherwise a screen reader hears it twice. (#306, #291) */}
                {!showLabel && !isAffirmative ? <span className="sr-only">{label}</span> : null}

                {rangeText != null ? (
                    <span className="text-xs text-muted-foreground">
                        （{rangeLabel} {rangeText}
                        {unit}）
                    </span>
                ) : null}
            </span>
        )
    }
)
ReferenceValue.displayName = "ReferenceValue"

export { ReferenceValue }
