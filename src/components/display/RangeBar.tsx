import * as React from "react"

import { cn } from "../../lib/utils"
import type { RangeBarVariantKey } from "./generated/variant-keys"
import { rangeBarDefaultVariantKey } from "./generated/default-variant-keys"

export interface RangeBarProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "role"> {
    /** Lower end of the whole scale (the left edge of the track). */
    min: number
    /** Upper end of the whole scale (the right edge of the track). */
    max: number
    /** Lower end of this row's range. `null` while unknown. */
    low: number | null | undefined
    /** Upper end of this row's range. `null` while unknown. */
    high: number | null | undefined
    /**
     * `"solid"` fills the range with the primary colour. `"gradient"` lays one
     * cool-to-warm ramp across the **whole scale** and shows only the part the
     * range covers, so the same value is the same colour on every row.
     */
    variant?: RangeBarVariantKey
    /** Accessible name: `"Temperature"` reads as "Temperature: 20–28°". */
    label?: string
    /** Unit appended to both ends in the accessible name (`"°"`, `" yen"`). */
    unit?: string
    /** Replace the whole accessible value text. */
    valueText?: string
}

const rangeBarFillClasses: Record<RangeBarVariantKey, string> = {
    solid: "bg-primary",
    gradient: "bg-gradient-to-r from-primary via-info to-warning",
}

function toPercent(value: number, min: number, max: number) {
    const span = max - min
    if (!(span > 0)) return 0
    return Math.min(100, Math.max(0, ((value - min) / span) * 100))
}

function round(value: number) {
    return Number(value.toFixed(3))
}

/**
 * RangeBar — one range, drawn where it sits inside a whole scale.
 *
 * A week of forecasts, the price band of each plan, the hours a site is open:
 * every row shares `min` / `max`, so the rows line up and the eye compares
 * positions, not numbers. The numbers themselves stay outside the bar, where
 * the caller puts them.
 *
 * It is not a Meter (one value from zero), not a DistributionBar (shares of a
 * whole that add up to 100%) and not a RangeSlider (an input with thumbs).
 *
 * A range whose two ends are equal is still drawn, as a dot the height of the
 * track: "20° to 20°" is an answer, not a missing value. An unknown range
 * (`null`) draws only the track.
 */
const RangeBar = React.forwardRef<HTMLDivElement, RangeBarProps>(
    (
        {
            className,
            min,
            max,
            low,
            high,
            variant = rangeBarDefaultVariantKey,
            label = "Range",
            unit = "",
            valueText,
            ...props
        },
        ref
    ) => {
        const known = low != null && high != null && Number.isFinite(low) && Number.isFinite(high)
        const lo = known ? Math.min(low, high) : 0
        const hi = known ? Math.max(low, high) : 0
        const start = toPercent(lo, min, max)
        const end = toPercent(hi, min, max)
        const centre = (start + end) / 2
        const text = valueText ?? (known ? `${lo}${unit}–${hi}${unit}` : "—")
        // The fill layer spans the whole track; clip-path shows the range. At
        // least the track's height stays visible, so an equal range is a dot.
        const clip = `inset(0 min(${round(100 - end)}%, calc(${round(100 - centre)}% - 0.5 * var(--range-bar-h))) 0 min(${round(start)}%, calc(${round(centre)}% - 0.5 * var(--range-bar-h))) round 9999px)`

        return (
            <div
                ref={ref}
                role="img"
                aria-label={`${label}: ${text}`}
                className={cn(
                    "relative h-1 w-full min-w-0 overflow-hidden rounded-full bg-muted [--range-bar-h:0.25rem]",
                    className
                )}
                {...props}
            >
                {known ? (
                    <span
                        aria-hidden
                        className={cn("absolute inset-0", rangeBarFillClasses[variant])}
                        style={{ clipPath: clip }}
                    />
                ) : null}
            </div>
        )
    }
)
RangeBar.displayName = "RangeBar"

export { RangeBar }
