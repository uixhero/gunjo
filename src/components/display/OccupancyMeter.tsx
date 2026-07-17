import * as React from "react"

import { cn } from "../../lib/utils"
import { Meter, type MeterProps, type MeterTone } from "./Meter"

export interface OccupancyMeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Caption label — e.g. `満席率`, `稼働率`. Also the meter's accessible name when a string. */
  label: React.ReactNode
  /** Current measured value. */
  value: number
  /** Upper bound. */
  max: number
  /** Unit suffix for the readout (e.g. `卓`, `%`). */
  unit?: string
  /**
   * The caption readout on the right of the label. Defaults to `<value> / <max><unit>`
   * (formatted with `formatValue`). Pass a node for a custom readout ("2 / 7卓 満席").
   */
  caption?: React.ReactNode
  /** Goal marker on the track. */
  target?: number
  /**
   * Tone direction, forwarded to `Meter`. Defaults to `"neutral"` — an occupancy /
   * capacity gauge that fills up over time should not paint a low reading red. (#343)
   */
  direction?: MeterProps["direction"]
  /** Force the fill tone (overrides `direction`'s auto tone). */
  tone?: MeterTone
  /** Format the numbers in the caption + value text. */
  formatValue?: (value: number) => string
  /** Meter size. */
  size?: MeterProps["size"]
}

/**
 * OccupancyMeter — a thin labeled gauge: a caption row (label + `<value> / <max>`
 * readout) above a `Meter` bar. The "2 / 7卓" caption that every occupancy /
 * capacity gauge re-handwrites, wrapped once. Defaults to `direction="neutral"`
 * so 満席率 / 稼働率 don't read as a red failure at low fill; pass `direction` /
 * `tone` / `target` to change the judgment. (#343)
 */
export const OccupancyMeter = React.forwardRef<HTMLDivElement, OccupancyMeterProps>(
  (
    { className, label, value, max, unit = "", caption, target, direction = "neutral", tone, formatValue, size, ...props },
    ref
  ) => {
    const fmt = (n: number) => (formatValue ? formatValue(n) : `${Math.round(n * 10) / 10}`)
    const readout = caption ?? `${fmt(value)} / ${fmt(max)}${unit}`
    return (
      <div ref={ref} className={cn("flex w-full flex-col gap-1.5", className)} {...props}>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{readout}</span>
        </div>
        <Meter
          value={value}
          max={max}
          unit={unit}
          target={target}
          direction={direction}
          tone={tone}
          formatValue={formatValue}
          size={size}
          showValue={false}
          label={typeof label === "string" ? label : undefined}
        />
      </div>
    )
  }
)
OccupancyMeter.displayName = "OccupancyMeter"
