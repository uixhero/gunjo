import * as React from "react"

import { cn } from "../../lib/utils"

export type MeterTone = "success" | "warning" | "destructive" | "info" | "primary" | "muted"

export interface MeterThresholds {
    /** Fraction of `max` (0–1) at/above which the auto tone is `warning`. Default `0.8`. */
    warning?: number
    /** Fraction of `max` (0–1) at/above which the auto tone is `destructive` (over). Default `1`. */
    over?: number
}

export interface MeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    /** Current measured value. */
    value: number
    /** Upper bound of the range. Default `100`. */
    max?: number
    /**
     * Extra amount layered on top of `value` as a striped overlay — preview the
     * result of a pending change ("after I add this shipment"). Drives the tone
     * too, so an overflow is flagged before it's committed.
     */
    incoming?: number
    /** Fractions of `max` that flip the auto tone. Default `{ warning: 0.8, over: 1 }`. */
    thresholds?: MeterThresholds
    /** Force the fill tone instead of deriving it from thresholds. */
    tone?: MeterTone
    /** Accessible name — a `meter` needs one. */
    label?: React.ReactNode
    /** Override the announced value text. Default `"<value><unit> / <max><unit>（<pct>%）"`. */
    valueText?: string
    /** Unit suffix for the default readout / value text (e.g. `"kg"`, `"m³"`). */
    unit?: string
    /** Size. `"inline"` is a thin bar + compact % for table cells. Default `"default"`. */
    size?: "default" | "sm" | "inline"
    /** Show the numeric readout. Default `true` (always compact for `inline`). */
    showValue?: boolean
}

const TONE_FILL: Record<MeterTone, string> = {
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
    info: "bg-info",
    primary: "bg-primary",
    muted: "bg-muted-foreground",
}

const TONE_TEXT: Record<MeterTone, string> = {
    success: "text-success-strong",
    warning: "text-warning",
    destructive: "text-destructive",
    info: "text-info",
    primary: "text-foreground",
    muted: "text-muted-foreground",
}

const BAR_HEIGHT = {
    default: "h-2.5",
    sm: "h-2",
    inline: "h-1.5",
} as const

// A subtle diagonal hatch over the incoming segment, theme-neutral.
const STRIPES = "repeating-linear-gradient(45deg, rgba(255,255,255,0.28) 0 4px, transparent 4px 8px)"

function deriveTone(frac: number, thresholds: MeterThresholds | undefined): MeterTone {
    const over = thresholds?.over ?? 1
    const warning = thresholds?.warning ?? 0.8
    if (frac >= over) return "destructive"
    if (frac >= warning) return "warning"
    return "success"
}

/**
 * Capacity / utilisation meter. A `value`-against-`max` bar (`role="meter"`)
 * whose tone is derived from thresholds (near-full → warning, over →
 * destructive), with an optional `incoming` overlay to preview the result of a
 * pending change and a compact `inline` size for table cells. For warehouse
 * fill, truck load, storage usage and quota. (#230)
 */
const Meter = React.forwardRef<HTMLDivElement, MeterProps>(
    (
        {
            className,
            value,
            max = 100,
            incoming,
            thresholds,
            tone,
            label,
            valueText,
            unit = "",
            size = "default",
            showValue = true,
            ...props
        },
        ref
    ) => {
        const safeMax = max > 0 ? max : 100
        const frac = value / safeMax
        const incFrac = incoming && incoming > 0 ? incoming / safeMax : 0
        const projected = frac + incFrac

        const resolvedTone = tone ?? deriveTone(projected, thresholds)
        const basePct = Math.min(100, Math.max(0, frac * 100))
        const incPct = incFrac > 0 ? Math.min(100 - basePct, incFrac * 100) : 0
        const pct = Math.round(frac * 100)
        const projectedPct = Math.round(projected * 100)
        const isOver = projected > (thresholds?.over ?? 1)

        const fmt = (n: number) => `${Math.round(n * 10) / 10}${unit}`
        const readout =
            incFrac > 0
                ? `${fmt(value)} + ${fmt(incoming as number)} → ${projectedPct}%`
                : `${fmt(value)} / ${fmt(safeMax)}（${pct}%）`
        const resolvedValueText = valueText ?? readout

        const bar = (
            <div
                role="meter"
                aria-label={typeof label === "string" ? label : undefined}
                aria-valuemin={0}
                aria-valuemax={safeMax}
                aria-valuenow={value}
                aria-valuetext={resolvedValueText}
                className={cn("relative w-full overflow-hidden rounded-full bg-secondary", BAR_HEIGHT[size])}
            >
                <div
                    className={cn("absolute inset-y-0 left-0 rounded-full transition-all", TONE_FILL[resolvedTone])}
                    style={{ width: `${basePct}%` }}
                />
                {incPct > 0 ? (
                    <div
                        className={cn("absolute inset-y-0 opacity-70 transition-all", TONE_FILL[resolvedTone])}
                        style={{ left: `${basePct}%`, width: `${incPct}%`, backgroundImage: STRIPES }}
                    />
                ) : null}
            </div>
        )

        if (size === "inline") {
            return (
                <div ref={ref} className={cn("flex w-full items-center gap-2", className)} data-slot="meter" {...props}>
                    <div className="min-w-0 flex-1">{bar}</div>
                    {showValue ? (
                        <span className={cn("shrink-0 text-xs tabular-nums", TONE_TEXT[resolvedTone])}>
                            {isOver ? `${projectedPct}%↑` : `${projectedPct}%`}
                        </span>
                    ) : null}
                </div>
            )
        }

        return (
            <div ref={ref} className={cn("flex w-full flex-col gap-1", className)} data-slot="meter" {...props}>
                {label != null || showValue ? (
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                        {label != null ? <span className="font-medium text-foreground">{label}</span> : <span />}
                        {showValue ? (
                            <span className={cn("tabular-nums", TONE_TEXT[resolvedTone])}>{readout}</span>
                        ) : null}
                    </div>
                ) : null}
                {bar}
            </div>
        )
    }
)
Meter.displayName = "Meter"

export { Meter }
