import * as React from "react"

import { cn } from "../../lib/utils"
import { formatCurrency } from "../../lib/format"
import { Separator } from "./Separator"

/** Row kind. `add` shows the value as given; `subtract` renders it signed (−|amount|) in a deduction tone. */
type AmountLineKind = "add" | "subtract"

export interface AmountLine {
  /**
   * Row type. `"line"` (default) = a labeled amount; `"subtotal"` = a dashed running
   * total within the breakdown; `"heading"` = a section label (no amount).
   */
  type?: "line" | "subtotal" | "heading"
  /** Left-hand label (line item / section / subtotal name). */
  label: React.ReactNode
  /** The amount. Pass a positive number and use `kind` to convey a deduction. Omitted for `heading`. */
  amount?: number
  /** `add` (default) renders the value as-is; `subtract` renders it as −|amount| in a deduction tone. */
  kind?: AmountLineKind
  /** Secondary note shown under the label (e.g. 過失割合30% / ノンフリート20等級 / 特約名). */
  note?: React.ReactNode
}

export interface AmountBreakdownTotal {
  /** Total label (例: 今回支払額 / 年間保険料 / お支払金額). */
  label: React.ReactNode
  /** The derived total. */
  amount: number
  /** Tone of the emphasized total row. Default `neutral`. */
  tone?: "neutral" | "positive" | "negative"
}

export interface AmountBreakdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The line items, in order. Mix `line` / `subtotal` / `heading` rows. */
  lines: AmountLine[]
  /** The emphasized derived total at the bottom. */
  total: AmountBreakdownTotal
  /** Optional formula caption under the total (例: 今回支払額 = 認定損害額 − 過失相殺 − 免責 − 既払金). */
  formula?: React.ReactNode
  /**
   * Value formatter. Defaults to `formatCurrency` (JPY / ja-JP) so the common case is
   * RSC-safe — pass your own (a function prop) only from a `"use client"` boundary.
   */
  formatValue?: (value: number) => string
  /** Localized labels for derived accessible text. */
  labels?: {
    breakdown?: (totalLabel: string) => string
    deduction?: string
  }
}

const TOTAL_TONE: Record<NonNullable<AmountBreakdownTotal["tone"]>, string> = {
  neutral: "text-foreground",
  positive: "text-success-strong",
  negative: "text-destructive",
}

/** The "減算" / deduction prefix is rendered as a real `−` glyph so the sign never rides on colour alone. */
function lineValue(line: AmountLine, format: (v: number) => string): string {
  if (line.amount == null) return ""
  return line.kind === "subtract" ? `−${format(Math.abs(line.amount))}` : format(line.amount)
}

/**
 * AmountBreakdown — the read-only money-derivation ledger: labeled line items, signed
 * deductions, optional per-section subtotals, and an emphasized derived total, with an
 * optional formula caption. The "labeled lines → ± adjustments → total" block every
 * 請求 / 見積 / 査定 / 支払 / 精算 / 控除 / 給与明細 screen needs (認定損害額 − 過失相殺 −
 * 免責 − 既払金 = 今回支払額 / 基本保険料 ＋ 特約 − 各割引 = 年間保険料).
 *
 * Read-only by design — for an editable line-item grid with column totals use
 * `EditableDataTable`; for a single signed delta use `Statistic`/`Delta`; for the
 * back-office KPI strip use `StatGroup`. RSC-safe by default (formatValue defaults to
 * `formatCurrency`); pass a custom `formatValue` only from a client boundary.
 */
export const AmountBreakdown = React.forwardRef<HTMLDivElement, AmountBreakdownProps>(
  ({ lines, total, formula, formatValue = formatCurrency, labels, className, ...props }, ref) => {
    const tone = total.tone ?? "neutral"
    const breakdownLabel =
      typeof total.label === "string" ? (labels?.breakdown?.(total.label) ?? `${total.label} breakdown`) : undefined
    const deductionLabel = labels?.deduction ?? "Deduction"
    return (
      <div
        ref={ref}
        className={cn("w-full text-sm", className)}
        role="table"
        aria-label={breakdownLabel}
        {...props}
      >
        <div className="flex flex-col">
          {lines.map((line, i) => {
            if (line.type === "heading") {
              return (
                <div
                  key={i}
                  role="row"
                  className="px-1 pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground first:pt-0"
                >
                  {line.label}
                </div>
              )
            }
            const isSubtotal = line.type === "subtotal"
            const isDeduction = line.kind === "subtract"
            return (
              <div
                key={i}
                role="row"
                className={cn(
                  "flex items-baseline justify-between gap-4 px-1 py-1.5",
                  isSubtotal && "mt-1 border-t border-dashed border-border pt-2 font-medium"
                )}
              >
                <div className="min-w-0">
                  <div className={cn("truncate", isSubtotal ? "text-foreground" : "text-foreground")}>{line.label}</div>
                  {line.note != null && (
                    <div className="truncate text-xs text-muted-foreground">{line.note}</div>
                  )}
                </div>
                <div
                  role="cell"
                  className={cn(
                    "shrink-0 whitespace-nowrap tabular-nums",
                    isDeduction ? "text-destructive" : "text-foreground",
                    isSubtotal && "font-semibold"
                  )}
                >
                  {isDeduction && <span className="sr-only">{deductionLabel} </span>}
                  {lineValue(line, formatValue)}
                </div>
              </div>
            )
          })}
        </div>

        <Separator className="my-2" />

        <div role="row" className="flex items-baseline justify-between gap-4 px-1 pt-1">
          <div className="text-base font-semibold text-foreground">{total.label}</div>
          <div role="cell" className={cn("shrink-0 whitespace-nowrap text-xl font-bold tabular-nums", TOTAL_TONE[tone])}>
            {formatValue(total.amount)}
          </div>
        </div>

        {formula != null && (
          <p className="px-1 pt-2 text-xs text-muted-foreground">{formula}</p>
        )}
      </div>
    )
  }
)
AmountBreakdown.displayName = "AmountBreakdown"
