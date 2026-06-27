import * as React from "react"

import { cn } from "../../lib/utils"
import { Card } from "./Card"
import { Statistic, type StatisticProps } from "./Statistic"

type ColCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

interface ResponsiveCols {
  base?: ColCount
  sm?: ColCount
  md?: ColCount
  lg?: ColCount
  xl?: ColCount
}

// Literal per-breakpoint class maps — Tailwind v4 tree-shakes dynamically-composed
// classes, so every column class must appear verbatim in source.
const BASE_COLS: Record<ColCount, string> = {
  1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6", 7: "grid-cols-7", 8: "grid-cols-8",
}
const SM_COLS: Record<ColCount, string> = {
  1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5", 6: "sm:grid-cols-6", 7: "sm:grid-cols-7", 8: "sm:grid-cols-8",
}
const MD_COLS: Record<ColCount, string> = {
  1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4", 5: "md:grid-cols-5", 6: "md:grid-cols-6", 7: "md:grid-cols-7", 8: "md:grid-cols-8",
}
const LG_COLS: Record<ColCount, string> = {
  1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6", 7: "lg:grid-cols-7", 8: "lg:grid-cols-8",
}
const XL_COLS: Record<ColCount, string> = {
  1: "xl:grid-cols-1", 2: "xl:grid-cols-2", 3: "xl:grid-cols-3", 4: "xl:grid-cols-4", 5: "xl:grid-cols-5", 6: "xl:grid-cols-6", 7: "xl:grid-cols-7", 8: "xl:grid-cols-8",
}

function colClasses(cols: ColCount | ResponsiveCols): string {
  if (typeof cols === "number") return BASE_COLS[cols]
  return cn(
    BASE_COLS[cols.base ?? 2],
    cols.sm != null && SM_COLS[cols.sm],
    cols.md != null && MD_COLS[cols.md],
    cols.lg != null && LG_COLS[cols.lg],
    cols.xl != null && XL_COLS[cols.xl]
  )
}

export interface StatGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The metrics — each rendered as a `Statistic`. */
  items: StatisticProps[]
  /** Column count, fixed or responsive (`{ base: 2, md: 4 }`). Default `{ base: 2, md: 4 }`. */
  cols?: ColCount | ResponsiveCols
  /** Wrap each `Statistic` in a `Card` (the back-office summary strip). Default `true`. */
  card?: boolean
}

/**
 * StatGroup — the summary metric strip: a responsive grid of `Statistic`s
 * (Card-wrapped by default). The KPI row almost every back-office screen opens
 * with (件数 / 金額 / 期限 / アラート …). Presentational and RSC-safe (no function
 * props) — pass plain data. For one metric use `Statistic`; for the row, use this.
 */
export const StatGroup = React.forwardRef<HTMLDivElement, StatGroupProps>(
  ({ items, cols = { base: 2, md: 4 }, card = true, className, ...props }, ref) => (
    <div ref={ref} className={cn("grid w-full gap-4", colClasses(cols), className)} {...props}>
      {items.map((stat, i) =>
        card ? (
          <Card key={i} className="p-4">
            <Statistic {...stat} />
          </Card>
        ) : (
          <Statistic key={i} {...stat} />
        )
      )}
    </div>
  )
)
StatGroup.displayName = "StatGroup"
