import * as React from "react"
import { IconCircleCheck, IconAlertTriangle, IconCircleX, IconCircleDashed } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import type { SemanticTone } from "../../lib/semantic-tone"

export type ExpiryState = "valid" | "expiring" | "expired" | "missing"

const DAY_MS = 86_400_000

function toDate(value: string | number | Date | null | undefined): Date | null {
  if (value == null || value === "") return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

/** Whole days from `today` to `value` (negative once past). Compares calendar days (local midnight). */
function fullDaysUntil(value: Date, today: Date): number {
  const a = Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
  const b = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.round((a - b) / DAY_MS)
}

export interface ClassifyExpiryOptions {
  /** "Today" for the comparison. Defaults to `new Date()`. Pass it for SSR determinism. */
  today?: string | number | Date
  /** Days-before-expiry that count as `expiring`. Default 30. */
  warnWithinDays?: number
}

/**
 * Pure classifier: an expiry date → `{ state, days }` (the date-domain sibling of `flagValue`).
 * `days` = whole days until expiry (negative once past). `missing` when no date.
 */
export function classifyExpiry(
  value: string | number | Date | null | undefined,
  options: ClassifyExpiryOptions = {}
): { state: ExpiryState; days: number | null } {
  const date = toDate(value)
  if (date == null) return { state: "missing", days: null }
  const today = toDate(options.today) ?? new Date()
  const warn = options.warnWithinDays ?? 30
  const days = fullDaysUntil(date, today)
  if (days < 0) return { state: "expired", days }
  if (days <= warn) return { state: "expiring", days }
  return { state: "valid", days }
}

type ExpirySemanticTone = Extract<SemanticTone, "success" | "warning" | "destructive" | "muted">

const STATE_TONE: Record<ExpiryState, ExpirySemanticTone> = {
  valid: "success",
  expiring: "warning",
  expired: "destructive",
  missing: "muted",
}

const TONE_PILL: Record<ExpirySemanticTone, string> = {
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  destructive: "bg-destructive-subtle text-destructive",
  muted: "bg-muted text-muted-foreground",
}

const STATE_ICON: Record<ExpiryState, React.ComponentType<{ className?: string }>> = {
  valid: IconCircleCheck,
  expiring: IconAlertTriangle,
  expired: IconCircleX,
  missing: IconCircleDashed,
}

const STATE_LABEL: Record<ExpiryState, string> = {
  valid: "有効",
  expiring: "期限間近",
  expired: "失効",
  missing: "未登録",
}

function defaultFormatDate(d: Date): string {
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`
}

export interface ExpiryBadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Expiry date — ISO string / timestamp / Date. `null`/omitted → `missing`. */
  value?: string | number | Date | null
  /** "Today" for the comparison. Defaults to `new Date()`. Pass it for SSR determinism (like Gantt's `today`). */
  today?: string | number | Date
  /** Days-before-expiry that count as `expiring`. Default 30. */
  warnWithinDays?: number
  /** Show the date next to the state chip. Default `true`. */
  showDate?: boolean
  /** Hide the 残N日 / N日超過 remaining readout. */
  hideRemaining?: boolean
  /** Format the date. Default `YYYY/MM/DD`. */
  formatDate?: (d: Date) => string
  /** Format the remaining/overdue readout. Default Japanese labels. */
  formatRemaining?: (days: number, state: ExpiryState) => React.ReactNode
  /** Override the per-state label (有効 / 期限間近 / 失効 / 未登録). */
  labels?: Partial<Record<ExpiryState, React.ReactNode>>
  /** Class applied to the state chip only. Useful when aligning status chips in tables or lists. */
  stateClassName?: string
  /** Where the state chip is rendered relative to date and remaining text. Default `start`. */
  statePosition?: "start" | "end"
}

/**
 * ExpiryBadge — the date-vs-deadline currency indicator: classifies an expiry date against today
 * into 有効 / 期限間近 / 失効 / 未登録 and shows a colour-safe state chip (icon + label, never colour
 * alone), the date, and a 残N日 / N日超過 readout. The date-domain sibling of `Meter` (value vs a
 * capacity) and `ReferenceValue` (value vs a numeric range) — this is value vs a *deadline*. For
 * licence / 資格 / 適性診断 / 健診 / 車検 / 保険 / 認証 / 点検 currency across crew, asset and
 * compliance consoles. Pairs with the pure `classifyExpiry()` helper. SSR-safe: pass `today` in
 * for determinism (defaults to `new Date()`).
 */
export const ExpiryBadge = React.forwardRef<HTMLSpanElement, ExpiryBadgeProps>(
  (
    { className, value, today, warnWithinDays = 30, showDate = true, hideRemaining = false, formatDate = defaultFormatDate, formatRemaining, labels, stateClassName, statePosition = "start", ...props },
    ref
  ) => {
    const { state, days } = classifyExpiry(value, { today, warnWithinDays })
    const tone = STATE_TONE[state]
    const Icon = STATE_ICON[state]
    const label = labels?.[state] ?? STATE_LABEL[state]
    const date = toDate(value)

    let remaining: React.ReactNode | null = null
    if (!hideRemaining && days != null) {
      remaining = formatRemaining?.(days, state) ?? (days < 0 ? `${Math.abs(days)}日超過` : days === 0 ? "本日まで" : `残${days}日`)
    }

    const stateChip = (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
          TONE_PILL[tone],
          stateClassName
        )}
      >
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </span>
    )

    return (
      <span ref={ref} className={cn("inline-flex items-center gap-1.5 align-middle", className)} {...props}>
        {statePosition === "start" ? stateChip : null}
        {showDate && date != null && (
          <span className="text-xs tabular-nums text-muted-foreground">{formatDate(date)}</span>
        )}
        {remaining != null && (
          <span
            className={cn(
              "text-xs tabular-nums",
              state === "expired" ? "text-destructive" : state === "expiring" ? "text-warning" : "text-muted-foreground"
            )}
          >
            {remaining}
          </span>
        )}
        {statePosition === "end" ? stateChip : null}
      </span>
    )
  }
)
ExpiryBadge.displayName = "ExpiryBadge"
