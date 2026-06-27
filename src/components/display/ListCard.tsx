import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"

import { cn } from "../../lib/utils"

/** Optional left accent rail tone. */
export type ListCardSeverity = "critical" | "warning" | "info" | "success" | "neutral"

export interface ListCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onSelect"> {
  /** Leading accessory — icon, avatar, colour dot, rank number, line chip. */
  leading?: React.ReactNode
  /** Primary line. */
  title: React.ReactNode
  /** Secondary line(s) under the title. */
  description?: React.ReactNode
  /** A wrapping row of chips/badges under the title (最速 / 最安 / おすすめ など). */
  tags?: React.ReactNode
  /** Right-aligned status slot — a Badge/pill (運行状況・在庫・ステータス). */
  status?: React.ReactNode
  /** Right-aligned secondary text — price / time / count / timestamp. */
  meta?: React.ReactNode
  /** Trailing accessory. Defaults to a chevron when `onSelect` is set. Pass `null` to suppress. */
  trailing?: React.ReactNode
  /** Optional left severity accent rail. */
  severity?: ListCardSeverity
  /** Selected/active visual state. */
  selected?: boolean
  /** Make the whole card a tappable button (≥44px target). Opt-in — omit to keep it presentational. */
  onSelect?: () => void
}

const ACCENT: Record<ListCardSeverity, string> = {
  critical: "border-l-4 border-l-destructive-border",
  warning: "border-l-4 border-l-warning-border",
  info: "border-l-4 border-l-info-border",
  success: "border-l-4 border-l-success-border",
  neutral: "",
}

/**
 * ListCard — the tappable list entry: one item in a scannable, mobile-dense list, with a
 * leading accessory, a title + secondary, optional tag chips, a right-aligned status pill
 * and meta (price / time / timestamp), and a trailing chevron. The result-card / status-row
 * primitive every consumer "list of things" screen opens with — search results, route /
 * product / listing comparisons, status lists (運行状況・在庫・端末), order/incident queues.
 *
 * Tappable rows (`onSelect`) are a real ≥44px `button` with hover/focus/selected states;
 * status never rides on colour alone (pass a Badge with an icon, and use `severity` for the
 * accent rail). For the KPI strip use `StatGroup`; for a severity-triaged alert worklist use
 * `ActionQueue`; for a money breakdown use `AmountBreakdown`. RSC-safe by default — `onSelect`
 * is the only function prop and is opt-in.
 */
export const ListCard = React.forwardRef<HTMLDivElement, ListCardProps>(
  (
    { leading, title, description, tags, status, meta, trailing, severity, selected, onSelect, className, ...props },
    ref
  ) => {
    const trailingNode =
      trailing !== undefined ? trailing : onSelect ? <IconChevronRight className="size-5" aria-hidden="true" /> : null

    const content = (
      <>
        {leading != null && <div className="flex shrink-0 items-center">{leading}</div>}
        <div className="min-w-0 flex-1">
          <div className="font-medium text-foreground">{title}</div>
          {description != null && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          {tags != null && <div className="mt-1.5 flex flex-wrap items-center gap-1.5">{tags}</div>}
        </div>
        {(status != null || meta != null) && (
          <div className="flex shrink-0 flex-col items-end gap-1 text-right">
            {status}
            {meta != null && <span className="whitespace-nowrap text-xs text-muted-foreground">{meta}</span>}
          </div>
        )}
        {trailingNode != null && (
          <div className="flex shrink-0 items-center self-center text-muted-foreground">{trailingNode}</div>
        )}
      </>
    )

    const base = cn(
      "flex w-full items-start gap-3 rounded-lg border bg-card p-3 text-left",
      severity && ACCENT[severity],
      selected && "border-ring ring-1 ring-ring",
      className
    )

    if (onSelect) {
      return (
        <button
          ref={ref as unknown as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onSelect}
          aria-pressed={selected || undefined}
          className={cn(
            base,
            "min-h-11 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            selected && "bg-accent"
          )}
        >
          {content}
        </button>
      )
    }

    return (
      <div ref={ref} className={base} {...props}>
        {content}
      </div>
    )
  }
)
ListCard.displayName = "ListCard"
