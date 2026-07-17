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
    /**
     * Tone direction.
     * - `"higher-is-worse"` (default) — capacity / load: near-full warns, over is destructive.
     * - `"higher-is-better"` — occupancy / utilisation / SLA / yield / capability: at/above
     *   `target` is success, just under warns, well under is destructive. (#256)
     * - `"fill-is-good"` — coverage / fulfillment / completion: tone follows fill toward
     *   `max` (the goal) with **no `target` needed** — at/near full is success, well under
     *   is destructive. (#286)
     * - `"neutral"` — a gauge that just **fills up over time** (occupancy, capacity through
     *   the night): **no judgment colour** (a steady `primary` fill), with `target` drawn as
     *   a reference marker. Use this instead of `higher-is-better` for 満席率 / 稼働率 so a
     *   low reading early in service doesn't read as a red "failure". Override with `tone`
     *   for a fixed brand colour. (#343)
     */
    direction?: "higher-is-worse" | "higher-is-better" | "fill-is-good" | "neutral"
    /**
     * Goal value (same units as `value`) drawn as a marker line on the track. With
     * `direction="higher-is-better"` it also drives the auto tone (success at/above
     * target). With the default direction it is a visual reference only (e.g. a
     * soft cap / SLA floor). (#256)
     */
    target?: number
    /** Force the fill tone instead of deriving it from thresholds. */
    tone?: MeterTone
    /** Accessible name — a `meter` needs one. */
    label?: React.ReactNode
    /** Override the announced value text. Default `"<value><unit> / <max><unit>（<pct>%）"`. */
    valueText?: string
    /** Unit suffix for the default readout / value text (e.g. `"kg"`, `"m³"`). */
    unit?: string
    /**
     * Format the numbers in the **visible** readout (and the value text) — e.g.
     * `formatValue={formatCurrency}` for grouped JPY, or a custom `"32 / 推奨32字"`.
     * Overrides the default `round(n,1) + unit`. (#308)
     */
    formatValue?: (value: number) => string
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

// For `direction="higher-is-better"`: at/above `target` is success, the band just
// under it (down to this fraction of target) warns, and below that is destructive.
// e.g. a 90% occupancy target warns at 81–90% and fails under 81%. Without a target
// there is nothing to judge against, so it stays success (never cries wolf).
const HIGHER_IS_BETTER_WARNING_BAND = 0.9

function deriveToneHigherIsBetter(value: number, target: number | undefined): MeterTone {
    if (target === undefined) return "success"
    if (value >= target) return "success"
    if (value >= target * HIGHER_IS_BETTER_WARNING_BAND) return "warning"
    return "destructive"
}

/**
 * Capacity / utilisation meter. A `value`-against-`max` bar (`role="meter"`)
 * whose tone is derived from thresholds (near-full → warning, over →
 * destructive), with an optional `incoming` overlay to preview the result of a
 * pending change and a compact `inline` size for table cells. For warehouse
 * fill, truck load, storage usage and quota. (#230)
 *
 * Set `direction="higher-is-better"` with a `target` to flip the semantics for
 * occupancy, utilisation, SLA uptime, yield or process capability — at/above the
 * target marker is success, just under it warns, well under is destructive. The
 * `target` line also renders (as a reference only) under the default direction. (#256)
 *
 * `direction="fill-is-good"` tones by fill toward `max` (the implicit goal, no
 * `target` needed) — for coverage / fulfillment / completion. (#286) For a gauge
 * that just fills up over time (occupancy / 満席率 / 稼働率) use `direction="neutral"`:
 * a steady `primary` fill with `target` as a reference marker and **no failure
 * colouring** — so a low reading early on doesn't cry wolf. (#343) Pass
 * `formatValue` to format the visible readout (e.g. grouped JPY). (#308) A
 * percentage meter (unit `"%"`, max 100) shows the value once, not `/ 100%（%）`. (#277)
 */
const Meter = React.forwardRef<HTMLDivElement, MeterProps>(
    (
        {
            className,
            value,
            max = 100,
            incoming,
            thresholds,
            direction = "higher-is-worse",
            target,
            tone,
            label,
            valueText,
            unit = "",
            formatValue,
            size = "default",
            showValue = true,
            "aria-label": ariaLabel,
            ...props
        },
        ref
    ) => {
        const safeMax = max > 0 ? max : 100
        const frac = value / safeMax
        const incFrac = incoming && incoming > 0 ? incoming / safeMax : 0
        const projected = frac + incFrac

        const higherIsBetter = direction === "higher-is-better"
        const fillIsGood = direction === "fill-is-good"
        const neutral = direction === "neutral"
        const projectedValue = value + (incFrac > 0 ? (incoming as number) : 0)
        const resolvedTone =
            tone ??
            (neutral
                ? // a fills-up-over-time gauge: no judgment colour, just a steady fill. (#343)
                  "primary"
                : higherIsBetter
                  ? deriveToneHigherIsBetter(projectedValue, target)
                  : fillIsGood
                    ? // fill toward max is the goal — judge against max as the implicit target
                      deriveToneHigherIsBetter(projectedValue, safeMax)
                    : deriveTone(projected, thresholds))
        const basePct = Math.min(100, Math.max(0, frac * 100))
        const incPct = incFrac > 0 ? Math.min(100 - basePct, incFrac * 100) : 0
        const pct = Math.round(frac * 100)
        const projectedPct = Math.round(projected * 100)
        const targetPct =
            target !== undefined ? Math.min(100, Math.max(0, (target / safeMax) * 100)) : null
        const isOver = direction === "higher-is-worse" && projected > (thresholds?.over ?? 1)

        const fmt = (n: number) => (formatValue ? formatValue(n) : `${Math.round(n * 10) / 10}${unit}`)
        // A percentage meter (unit "%" against a 0–100 range) doesn't need the
        // redundant "/ 100%（pct%）" — just show the value once. (#277)
        const isPercentMeter = !formatValue && unit === "%" && safeMax === 100
        const readout =
            incFrac > 0
                ? `${fmt(value)} + ${fmt(incoming as number)} → ${projectedPct}%`
                : isPercentMeter
                  ? fmt(value)
                  : `${fmt(value)} / ${fmt(safeMax)}（${pct}%）`
        const targetText = target !== undefined ? ` (target ${fmt(target)})` : ""
        const resolvedValueText = valueText ?? readout + targetText

        const bar = (
            <div
                role="meter"
                aria-label={typeof label === "string" ? label : ariaLabel}
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
                {targetPct !== null ? (
                    <div
                        aria-hidden
                        className="absolute inset-y-[-1.5px] w-0.5 -translate-x-1/2 rounded-full bg-foreground/80 ring-1 ring-background"
                        style={{ left: `${targetPct}%` }}
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
                            {formatValue
                                ? formatValue(projectedValue)
                                : isOver
                                  ? `${projectedPct}%↑`
                                  : `${projectedPct}%`}
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
