import * as React from "react"

import { cn } from "../../lib/utils"
import { Statistic, type StatisticProps } from "./Statistic"

type ColCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

interface ResponsiveCols {
  base?: ColCount
  sm?: ColCount
  md?: ColCount
  lg?: ColCount
  xl?: ColCount
}

function resolveMaxCols(cols: ColCount | ResponsiveCols): ColCount {
  if (typeof cols === "number") return cols
  return Math.max(cols.base ?? 1, cols.sm ?? 1, cols.md ?? 1, cols.lg ?? 1, cols.xl ?? 1) as ColCount
}

function gridStyle(cols: ColCount | ResponsiveCols, style: React.CSSProperties | undefined): React.CSSProperties {
  const maxCols = resolveMaxCols(cols)

  return {
    ...style,
    // Keep the requested column count as the upper bound, but let narrow docs
    // preview frames wrap by available container width instead of viewport media queries.
    gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, max(12rem, calc((100% - (${maxCols} - 1) * 1rem) / ${maxCols}))), 1fr))`,
  }
}

export interface StatGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The metrics — each rendered as a `Statistic`. */
  items: StatisticProps[]
  /** Column count, fixed or responsive (`{ base: 1, sm: 2, md: 4 }`). Default `{ base: 1, sm: 2, md: 4 }`. */
  cols?: ColCount | ResponsiveCols
  /** Render each `Statistic` with its card surface. Default `true`. */
  card?: boolean
}

/**
 * StatGroup — the summary metric strip: a responsive grid of `Statistic`s
 * (card-surfaced by default). The KPI row almost every back-office screen opens
 * with (件数 / 金額 / 期限 / アラート …). Presentational and RSC-safe (no function
 * props) — pass plain data. For one metric use `Statistic`; for the row, use this.
 */
export const StatGroup = React.forwardRef<HTMLDivElement, StatGroupProps>(
  ({ items, cols = { base: 1, sm: 2, md: 4 }, card = true, className, style, ...props }, ref) => (
    <div ref={ref} className={cn("grid w-full gap-4", className)} style={gridStyle(cols, style)} {...props}>
      {items.map((stat, i) =>
        card ? (
          <Statistic key={i} {...stat} />
        ) : (
          <Statistic
            key={i}
            {...stat}
            className={cn("rounded-none border-0 bg-transparent p-0 shadow-none", stat.className)}
          />
        )
      )}
    </div>
  )
)
StatGroup.displayName = "StatGroup"
