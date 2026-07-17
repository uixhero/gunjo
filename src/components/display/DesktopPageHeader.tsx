import * as React from "react"

import { cn } from "../../lib/utils"

export interface DesktopPageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Page title. Rendered as the screen's h1. */
  title: React.ReactNode
  /** Optional context line above the title, such as an operator, depot, or breadcrumb. */
  eyebrow?: React.ReactNode
  /** Optional summary line below the title. */
  subtitle?: React.ReactNode
  /** Trailing controls or status for this screen. */
  actions?: React.ReactNode
}

/**
 * DesktopPageHeader — the lightweight per-screen title bar for an operations console or
 * dashboard. Unlike `Header`, it is content-level rather than app-shell chrome; unlike
 * `PageHeader`, it has no phone back affordance, safe-area padding, sticky default, or
 * inflated touch layout. Presentational and RSC-safe: pass controls through `actions`.
 */
export const DesktopPageHeader = React.forwardRef<HTMLElement, DesktopPageHeaderProps>(
  ({ className, title, eyebrow, subtitle, actions, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        "flex w-full flex-row flex-wrap items-end justify-between gap-6 gap-y-4 border-b border-border bg-background px-0 pb-4 pt-0",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {eyebrow != null && <div className="text-xs font-semibold text-muted-foreground">{eyebrow}</div>}
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle != null && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions != null && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
)
DesktopPageHeader.displayName = "DesktopPageHeader"
