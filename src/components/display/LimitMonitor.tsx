import * as React from "react"
import { IconCircleCheck, IconAlertTriangle, IconCircleX } from "@tabler/icons-react"

import { cn } from "../../lib/utils"

export type LimitState = "ok" | "near" | "over" | "critical"

export type LimitDirection = "ceiling" | "floor"

export interface ClassifyLimitOptions {
  /**
   * The soft / regulatory limit in the value's own units (基準値). For `"ceiling"` the value
   * should stay BELOW it (拘束13h / 連続運転4h / 過積載 / 残業上限); for `"floor"` ABOVE it
   * (休息期間11h).
   */
  limit: number
  /** A hard / absolute limit (上限・最大). Beyond it → `critical`. Optional. */
  hardLimit?: number
  /** Margin before `limit` that flags `near` (基準間近). Default 0 (no near tier). Value units. */
  warnWithin?: number
  /** `"ceiling"` (default): value must stay below the limit. `"floor"`: value must stay above it. */
  direction?: LimitDirection
}

/**
 * Pure classifier: a value vs a named soft / hard limit → `{ state, over }`. The
 * regulatory-limit sibling of `classifyExpiry` (date vs deadline) and `flagValue` (value vs
 * range). `over` = signed distance PAST the soft limit (positive once breached; negative = the
 * remaining headroom). Limits are in the value's own units — never fractions of a max.
 */
export function classifyLimit(
  value: number,
  { limit, hardLimit, warnWithin = 0, direction = "ceiling" }: ClassifyLimitOptions
): { state: LimitState; over: number } {
  if (direction === "floor") {
    const over = limit - value // positive once below the floor
    if (hardLimit != null && value <= hardLimit) return { state: "critical", over }
    if (value < limit) return { state: "over", over }
    if (value <= limit + warnWithin) return { state: "near", over }
    return { state: "ok", over }
  }
  const over = value - limit // positive once past the ceiling
  if (hardLimit != null && value >= hardLimit) return { state: "critical", over }
  if (value >= limit) return { state: "over", over }
  if (value >= limit - warnWithin) return { state: "near", over }
  return { state: "ok", over }
}

const STATE_PILL: Record<LimitState, string> = {
  ok: "bg-success-subtle text-success",
  near: "bg-warning-subtle text-warning",
  over: "bg-destructive-subtle text-destructive",
  critical: "bg-destructive text-destructive-foreground",
}

const STATE_BAR: Record<LimitState, string> = {
  ok: "bg-success",
  near: "bg-warning",
  over: "bg-destructive",
  critical: "bg-destructive",
}

const STATE_ICON: Record<LimitState, React.ComponentType<{ className?: string }>> = {
  ok: IconCircleCheck,
  near: IconAlertTriangle,
  over: IconAlertTriangle,
  critical: IconCircleX,
}

const DEFAULT_LABELS: Record<LimitState, string> = {
  ok: "Within limit",
  near: "Near limit",
  over: "Over limit",
  critical: "Critical",
}

export interface LimitMonitorReadoutLabels {
  floorShortfall?: (value: React.ReactNode) => React.ReactNode
  floorHeadroom?: (value: React.ReactNode) => React.ReactNode
  ceilingOver?: (value: React.ReactNode) => React.ReactNode
  ceilingHeadroom?: (value: React.ReactNode) => React.ReactNode
}

export interface LimitMonitorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Measured value. */
  value: number
  /** Soft / regulatory limit in value units (基準). */
  limit: number
  /** Hard / absolute limit (上限). Drawn as a second line; beyond it → `critical`. Optional. */
  hardLimit?: number
  /** Margin before `limit` that flags `near`. Value units. */
  warnWithin?: number
  /** `"ceiling"` (default) value must stay below, or `"floor"` (休息期間) value must stay above. */
  direction?: LimitDirection
  /** Bar normalisation max. Default = the largest of `value` / `hardLimit` / `limit`×1.25. */
  max?: number
  /** The metric name (拘束時間 / 連続運転 / 過積載率). */
  label?: React.ReactNode
  /** Format the value + limit readout. Default `toLocaleString`. */
  formatValue?: (value: number) => React.ReactNode
  /** Override the state chip labels. */
  labels?: Partial<Record<LimitState, React.ReactNode>>
  /** Override the remaining / exceeded readout. */
  readoutLabels?: LimitMonitorReadoutLabels
}

/**
 * LimitMonitor — value against a NAMED regulatory limit (soft + optional hard) with near/over
 * states and a bar that shows how close (or how far past) the value sits, with the limit drawn
 * as a line. The "value vs a named limit" sibling of `ExpiryBadge` (value vs a deadline),
 * `ReferenceValue` (value vs a range) and `Meter` (value vs a capacity) — limits are in the
 * value's own units, the breach tone is DERIVED from them (unlike Meter's fraction-of-max
 * thresholds + reference-only `target`). For 改善基準告示 (拘束時間/連続運転/休息期間), SLA
 * budgets, quotas, 過積載, 残業, rate limits. `direction="floor"` for must-stay-above limits
 * (休息期間). Pairs with the pure `classifyLimit()` helper. RSC-safe.
 */
const LimitMonitor = React.forwardRef<HTMLDivElement, LimitMonitorProps>(
  (
    { className, value, limit, hardLimit, warnWithin = 0, direction = "ceiling", max, label, formatValue, labels, readoutLabels, ...props },
    ref
  ) => {
    const { state, over } = classifyLimit(value, { limit, hardLimit, warnWithin, direction })
    const fmt = (v: number): React.ReactNode => (formatValue ? formatValue(v) : v.toLocaleString())
    const Icon = STATE_ICON[state]
    const stateLabel = labels?.[state] ?? DEFAULT_LABELS[state]

    const cap = max ?? Math.max(value, hardLimit ?? 0, limit * 1.25)
    const pct = (v: number) => `${Math.max(0, Math.min(100, (v / cap) * 100))}%`

    // Readout: how far past, or how much headroom (floor inverts the wording).
    const overAbs = Math.abs(over)
    const readout =
      direction === "floor"
        ? over > 0
          ? readoutLabels?.floorShortfall?.(fmt(overAbs)) ?? <>Short by {fmt(overAbs)}</>
          : readoutLabels?.floorHeadroom?.(fmt(overAbs)) ?? <>{fmt(overAbs)} above floor</>
        : over >= 0
          ? readoutLabels?.ceilingOver?.(fmt(overAbs)) ?? <>{fmt(overAbs)} over limit</>
          : readoutLabels?.ceilingHeadroom?.(fmt(overAbs)) ?? <>{fmt(overAbs)} remaining</>

    return (
      <div
        ref={ref}
        role="group"
        aria-label={typeof label === "string" ? label : props["aria-label"] ?? "Limit monitor"}
        className={cn("w-full", className)}
        data-slot="limit-monitor"
        {...props}
      >
        <div className="flex items-baseline justify-between gap-2">
          {label != null ? <span className="truncate text-sm font-medium text-foreground">{label}</span> : <span />}
          <span className="flex items-center gap-2">
            <span className="text-sm tabular-nums text-foreground">
              {fmt(value)}
              <span className="text-muted-foreground"> / {fmt(limit)}</span>
            </span>
            <span
              className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", STATE_PILL[state])}
            >
              <Icon className="size-3.5 shrink-0" aria-hidden="true" />
              {stateLabel}
            </span>
          </span>
        </div>

        <div className="relative mt-1.5 h-2 w-full rounded-full bg-muted">
          <div className={cn("h-full rounded-full", STATE_BAR[state])} style={{ width: pct(value) }} />
          {/* soft limit line */}
          <span
            aria-hidden="true"
            className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-foreground/50"
            style={{ left: pct(limit) }}
          />
          {/* hard limit line */}
          {hardLimit != null ? (
            <span
              aria-hidden="true"
              className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-destructive"
              style={{ left: pct(hardLimit) }}
            />
          ) : null}
        </div>

        <p className="mt-1 text-xs tabular-nums text-muted-foreground">{readout}</p>
      </div>
    )
  }
)
LimitMonitor.displayName = "LimitMonitor"

export { LimitMonitor }
