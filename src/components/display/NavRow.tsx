import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"

import { cn } from "../../lib/utils"

export interface NavRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Leading icon. */
  icon?: React.ReactNode
  /** Primary label. */
  label: React.ReactNode
  /** Secondary line under the label. */
  description?: React.ReactNode
  /** Right-aligned current value (お支払い方法 → 口座振替 / 現在の設定). */
  value?: React.ReactNode
  /**
   * Trailing accessory. Defaults to a chevron when `onSelect` is set. Pass a control
   * (a `Switch`, a `Badge`) for a NON-navigation control row, or `null` to suppress.
   */
  trailing?: React.ReactNode
  /**
   * The row opens a dialog / sheet (sets `aria-haspopup="dialog"`). Use for a row that
   * reveals a detail in place; omit for a row that navigates to another screen.
   */
  opensDialog?: boolean
  /** Make the whole row a tappable navigation/disclosure button (NOT a toggle). */
  onSelect?: () => void
}

const ROW = "flex w-full items-center gap-3 px-3 py-2 text-left [min-height:52px]"

/**
 * NavRow — the flush settings / nav-list row: a leading icon, a label (+ description), a
 * right-aligned current value, and a trailing chevron — the `[icon] label … value [›]` row
 * every settings / account / マイページ / menu screen is built from. With `onSelect` the whole
 * row is a NAVIGATION / disclosure `<button>` (chevron default, `aria-haspopup="dialog"` via
 * `opensDialog`) — deliberately NOT `aria-pressed`: a row that opens a detail is navigation,
 * not a toggle (the a11y trap of using ListCard.onSelect here). Without `onSelect` it is a
 * static control row — put a `Switch` / `Badge` in `trailing`. Group rows in `SettingGroup`
 * for the rounded-container + hairline-divider look. Distinct from ListCard (a bordered card
 * with aria-pressed selection). RSC-safe except the opt-in `onSelect`.
 */
const NavRow = React.forwardRef<HTMLDivElement, NavRowProps>(
  ({ className, icon, label, description, value, trailing, opensDialog, onSelect, ...props }, ref) => {
    const interactive = onSelect != null
    const trailingNode = trailing !== undefined ? trailing : interactive ? <IconChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" /> : null

    const inner = (
      <>
        {icon != null ? <span className="shrink-0 text-muted-foreground">{icon}</span> : null}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium text-foreground">{label}</span>
          {description != null ? (
            <span className="truncate text-xs text-muted-foreground">{description}</span>
          ) : null}
        </span>
        {value != null ? (
          <span className="max-w-[45%] shrink-0 truncate text-sm tabular-nums text-muted-foreground">{value}</span>
        ) : null}
        {trailingNode}
      </>
    )

    if (interactive) {
      return (
        <button
          type="button"
          onClick={onSelect}
          aria-haspopup={opensDialog ? "dialog" : undefined}
          data-slot="nav-row"
          className={cn(
            ROW,
            "transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
            className
          )}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {inner}
        </button>
      )
    }

    return (
      <div ref={ref} data-slot="nav-row" className={cn(ROW, className)} {...props}>
        {inner}
      </div>
    )
  }
)
NavRow.displayName = "NavRow"

export interface SettingGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional group heading shown above the container. */
  label?: React.ReactNode
  /** `NavRow`s (and other rows) — divided by hairlines inside one rounded container. */
  children: React.ReactNode
}

/**
 * SettingGroup — the rounded container that groups `NavRow`s with hairline dividers (the
 * iOS/Android grouped-settings block). An optional heading sits above it. Pair with `NavRow`.
 */
const SettingGroup = React.forwardRef<HTMLDivElement, SettingGroupProps>(
  ({ className, label, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex w-full flex-col gap-1.5", className)} {...props}>
        {label != null ? (
          <p className="px-1 text-xs font-medium text-muted-foreground">{label}</p>
        ) : null}
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">{children}</div>
      </div>
    )
  }
)
SettingGroup.displayName = "SettingGroup"

export { NavRow, SettingGroup }
