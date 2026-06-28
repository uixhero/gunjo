import * as React from "react"

import { cn } from "../../lib/utils"
import { Delta, type DeltaTone } from "./Delta"

export type LeaderboardTone =
  | "default"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "destructive"
  | "muted"

export interface LeaderboardItem {
  id: string | number
  /** Primary label — the ranked entity (系統 / 営業所 / 商品 / 担当). */
  label: React.ReactNode
  /** Secondary line under the label. */
  sublabel?: React.ReactNode
  /** Numeric metric driving the bar (and the value display unless `valueLabel` is set). */
  value: number
  /** Preformatted value display (overrides `formatValue`). */
  valueLabel?: React.ReactNode
  /** 0–1 bar fill. When omitted, derived from `value / max`. */
  fraction?: number
  /** Signed change vs a prior period — rendered as a `Delta` chip. */
  delta?: number
  /** Preformatted delta display (passed to the `Delta`). */
  deltaLabel?: React.ReactNode
  /** Tone for this row's bar (and delta default). Default `primary`. */
  tone?: LeaderboardTone
  /** Leading icon / avatar. */
  icon?: React.ReactNode
  /** Right-aligned extra (a badge, a secondary metric). */
  trailing?: React.ReactNode
  /** Make the row selectable (opens a detail). */
  onSelect?: () => void
}

export interface LeaderboardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /**
   * Pre-ordered rows — **rank is the array position** (index + 1). The caller decides the
   * order (best-first for a top-N, worst-first for "needs attention"); the component never
   * re-sorts. This keeps "who is #1" the caller's explicit choice.
   */
  items: LeaderboardItem[]
  /** Accessible name for the ranked list. */
  label?: React.ReactNode
  /** Show the numbered rank chip. Default `true`. */
  showRank?: boolean
  /** Show the inline value bar. Default `true`. */
  showBar?: boolean
  /** Normalise bars against this max. Default = the largest item `value`. */
  max?: number
  /** Format the numeric value. Default `value.toLocaleString()`. */
  formatValue?: (value: number, item: LeaderboardItem) => React.ReactNode
  /** Format the delta number (passed through to `Delta`). */
  formatDelta?: (delta: number) => React.ReactNode
  /**
   * Tone per delta sign. Override when "up is bad" — e.g. an accident-rate / cost ranking:
   * `{ positive: "destructive", negative: "success" }`. Default `Delta`'s (up = success).
   */
  deltaTones?: Partial<Record<"positive" | "negative" | "zero", DeltaTone>>
  /** Emphasise the first N rank chips (solid). Default `3`. */
  highlightTop?: number
  /** Highlight one row (others dim slightly). */
  selectedId?: string | number
}

const TONE_BAR: Record<LeaderboardTone, string> = {
  default: "bg-foreground/35",
  primary: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground/40",
}

/**
 * Leaderboard / ranking list: a pre-ordered list of entities, each with a **rank chip**, a
 * label, an optional **value bar** (normalised against the max), and an optional **`Delta`**
 * for period-over-period change. The caller orders the items (best-first for a top-N,
 * worst-first for "worst performers / needs attention"); rank = array position, so "who is
 * #1" stays an explicit caller decision. Distinct from a `BarChart` (no rank/order semantics)
 * and `StatGroup` (unordered KPI cluster). Rows are focusable buttons when `onSelect` is set.
 *
 * Use `deltaTones={{ positive: "destructive", negative: "success" }}` for "up is bad"
 * rankings (事故率 / コスト / 苦情件数) so a rising value reads red.
 */
const Leaderboard = React.forwardRef<HTMLDivElement, LeaderboardProps>(
  (
    {
      className,
      items,
      label,
      showRank = true,
      showBar = true,
      max,
      formatValue,
      formatDelta,
      deltaTones,
      highlightTop = 3,
      selectedId,
      ...props
    },
    ref
  ) => {
    const peak = max ?? items.reduce((m, it) => Math.max(m, it.value), 0)
    const fmt = (it: LeaderboardItem): React.ReactNode =>
      it.valueLabel ?? (formatValue ? formatValue(it.value, it) : it.value.toLocaleString())

    return (
      <div
        ref={ref}
        role="group"
        aria-label={typeof label === "string" ? label : "ランキング"}
        className={cn("w-full", className)}
        data-slot="leaderboard"
        {...props}
      >
        <ol className="flex flex-col gap-1">
          {items.map((it, i) => {
            const rank = i + 1
            const tone = it.tone ?? "primary"
            const frac =
              it.fraction != null
                ? Math.max(0, Math.min(1, it.fraction))
                : peak > 0
                  ? Math.max(0, Math.min(1, it.value / peak))
                  : 0
            const top = rank <= highlightTop
            const selected = selectedId != null && it.id === selectedId
            const dim = selectedId != null && !selected

            const inner = (
              <>
                {showRank ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                      top ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {rank}
                  </span>
                ) : null}

                {it.icon != null ? <span className="shrink-0 text-muted-foreground">{it.icon}</span> : null}

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="truncate text-sm font-medium text-foreground">{it.label}</span>
                    {it.sublabel != null ? (
                      <span className="truncate text-xs text-muted-foreground">{it.sublabel}</span>
                    ) : null}
                  </span>
                  {showBar ? (
                    <span className="mt-1 flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <span
                        className={cn("h-full rounded-full", TONE_BAR[tone])}
                        style={{ width: `${frac * 100}%` }}
                      />
                    </span>
                  ) : null}
                </span>

                <span className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-semibold tabular-nums text-foreground">{fmt(it)}</span>
                  {it.delta != null ? (
                    <Delta value={it.delta} tones={deltaTones} format={formatDelta} className="text-xs" />
                  ) : null}
                  {it.trailing}
                </span>
              </>
            )

            const rowClass = cn(
              "flex items-center gap-3 rounded-md px-2 py-2 text-left",
              selected && "bg-accent",
              dim && "opacity-60"
            )

            return (
              <li key={it.id}>
                {it.onSelect ? (
                  <button
                    type="button"
                    onClick={it.onSelect}
                    aria-current={selected ? "true" : undefined}
                    className={cn(
                      rowClass,
                      "w-full transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                  >
                    {inner}
                  </button>
                ) : (
                  <div className={rowClass}>{inner}</div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    )
  }
)
Leaderboard.displayName = "Leaderboard"

export { Leaderboard }
