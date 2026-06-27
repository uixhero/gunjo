import * as React from "react"
import { IconAlertTriangle, IconAlertCircle, IconInfoCircle, IconCircle } from "@tabler/icons-react"

import { cn } from "../../lib/utils"

/** Severity of an action item. Drives ordering, the leading icon, and the tone — never colour alone. */
export type ActionSeverity = "critical" | "warning" | "info" | "neutral"

export interface ActionItem {
  /** Stable key. Falls back to the array index. */
  id?: string | number
  /** Severity — sets the icon, tone, and (when sorted) the position. Default `neutral`. */
  severity?: ActionSeverity
  /** Short category chip (種別): 失効リスク / 遅延拡大 / 更新 / 満期 …. */
  kind?: React.ReactNode
  /** The headline — what needs doing, and on whom/what (列車・顧客・区間). */
  title: React.ReactNode
  /** Secondary detail line (recommended action, context). */
  detail?: React.ReactNode
  /** Trailing secondary text — due / time / count (右寄せ). */
  meta?: React.ReactNode
  /** Override the severity icon. */
  icon?: React.ReactNode
  /** Trailing action buttons (対応・確認 …). Rendered as siblings, never nested in the row button. */
  actions?: React.ReactNode
  /** Make the row's body activatable (open detail). Opt-in — omit to keep the row presentational. */
  onSelect?: () => void
}

export interface ActionQueueProps extends Omit<React.HTMLAttributes<HTMLUListElement>, "children"> {
  /** The action items. */
  items: ActionItem[]
  /** Sort by severity (critical → neutral) before rendering. Default `true`. */
  sortBySeverity?: boolean
  /** Shown (as a dashed placeholder) when there are no items. */
  emptyLabel?: React.ReactNode
}

const SEVERITY: Record<
  ActionSeverity,
  { rank: number; Icon: typeof IconAlertTriangle; label: string; row: string; icon: string }
> = {
  // `row` strings are literal so Tailwind v4 keeps them; tone tokens mirror Alert.
  critical: { rank: 0, Icon: IconAlertTriangle, label: "重大", row: "border-destructive-border bg-destructive-subtle", icon: "text-destructive" },
  warning: { rank: 1, Icon: IconAlertCircle, label: "警告", row: "border-warning-border bg-warning-subtle", icon: "text-warning" },
  info: { rank: 2, Icon: IconInfoCircle, label: "情報", row: "border-info-border bg-info-subtle", icon: "text-info" },
  neutral: { rank: 3, Icon: IconCircle, label: "通常", row: "border-border bg-card", icon: "text-muted-foreground" },
}

/**
 * ActionQueue — the severity-sorted "action-needed" worklist: the triage surface every
 * back-office / dispatch / ops / CRM home screen opens with (失効防止 / 更新 / 満期 / 誕生日,
 * ダイヤ乱れ・遅延・運休, アラート対応). Each row carries a severity (icon + tone, never colour
 * alone, with an sr-only severity label), a category chip, a headline + detail, trailing
 * meta (due / time / count) and optional action buttons; rows sort critical → neutral.
 *
 * The other half of the morning dashboard alongside `StatGroup` (the KPI strip). For a single
 * notice use `Alert`; for an ambient bell tray use `NotificationCenter`; this is the inline,
 * act-now list. Presentational by default — `onSelect` makes a row's body activatable.
 */
export const ActionQueue = React.forwardRef<HTMLUListElement, ActionQueueProps>(
  ({ items, sortBySeverity = true, emptyLabel = "対応が必要な項目はありません", className, ...props }, ref) => {
    const ordered = sortBySeverity
      ? [...items].sort((a, b) => SEVERITY[a.severity ?? "neutral"].rank - SEVERITY[b.severity ?? "neutral"].rank)
      : items

    if (ordered.length === 0) {
      return (
        <p className={cn("rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground", className)}>
          {emptyLabel}
        </p>
      )
    }

    return (
      <ul ref={ref} role="list" className={cn("flex w-full flex-col gap-2", className)} {...props}>
        {ordered.map((item, i) => {
          const sev = SEVERITY[item.severity ?? "neutral"]
          const Icon = sev.Icon
          const body = (
            <>
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                {item.kind != null && (
                  <span className="inline-flex shrink-0 items-center rounded bg-background/70 px-1.5 py-0.5 text-xs font-medium">
                    {item.kind}
                  </span>
                )}
                <span className="min-w-0 font-medium text-foreground">{item.title}</span>
              </div>
              {item.detail != null && <p className="mt-0.5 text-sm text-muted-foreground">{item.detail}</p>}
            </>
          )
          return (
            <li
              key={item.id ?? i}
              className={cn("flex items-start gap-3 rounded-md border border-l-4 px-3 py-2.5", sev.row)}
            >
              <span className={cn("mt-0.5 shrink-0", sev.icon)} aria-hidden="true">
                {item.icon ?? <Icon className="size-5" />}
              </span>
              <span className="sr-only">{sev.label}：</span>
              <div className="min-w-0 flex-1">
                {item.onSelect ? (
                  <button
                    type="button"
                    onClick={item.onSelect}
                    className="block w-full rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {body}
                  </button>
                ) : (
                  body
                )}
              </div>
              {(item.meta != null || item.actions != null) && (
                <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
                  {item.meta != null && <span className="whitespace-nowrap text-xs text-muted-foreground">{item.meta}</span>}
                  {item.actions != null && <div className="flex items-center gap-1.5">{item.actions}</div>}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    )
  }
)
ActionQueue.displayName = "ActionQueue"
