"use client"

import * as React from "react"
import { IconChevronLeft } from "@tabler/icons-react"

import { cn } from "../../lib/utils"

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Page title. */
  title: React.ReactNode
  /** Optional secondary line under the title. */
  subtitle?: React.ReactNode
  /** Back handler — renders a ≥44px back button in the leading slot. */
  onBack?: () => void
  /** Accessible label for the back button. Default `"Back"`. */
  backLabel?: string
  /** Extra leading element. Renders in the leading slot — *alongside* the back button when `onBack` is also set, otherwise on its own. */
  leading?: React.ReactNode
  /** Trailing action(s) — e.g. a close / refresh / menu button. */
  actions?: React.ReactNode
  /** Stick to the top of the scroll container. Default `true`. */
  sticky?: boolean
  /** Title alignment. `center` is the iOS-style centered title; default `left`. */
  align?: "left" | "center"
}

/**
 * PageHeader — the mobile app bar / page header every consumer phone screen opens with: a
 * leading back button, a title (+ optional subtitle), and a trailing action slot, sticky to
 * the top with a `<header>` landmark, a bottom border and safe-area-inset padding (notch).
 * Touch targets are ≥44px. The kit's `Header` / `AppRail` are desktop app/docs chrome; this
 * is the lightweight per-page bar for a phone (booking flows, finders, trackers, detail pages).
 */
export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  ({ className, title, subtitle, onBack, backLabel = "Back", leading, actions, sticky = true, align = "left", ...props }, ref) => {
    // Render BOTH the back button and any `leading` element — never let one silently shadow the
    // other (passing both used to drop onBack's handler + aria-label with no type error).
    const backButton = onBack ? (
      <button
        type="button"
        onClick={onBack}
        aria-label={backLabel}
        className="-ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-md text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
      >
        <IconChevronLeft className="size-6" aria-hidden="true" />
      </button>
    ) : null

    const back =
      backButton != null || leading != null ? (
        <>
          {backButton}
          {leading}
        </>
      ) : null

    const centered = align === "center"

    return (
      <header
        ref={ref}
        className={cn(
          "z-30 w-full border-b border-border bg-background pt-[env(safe-area-inset-top)]",
          sticky && "sticky top-0",
          className
        )}
        {...props}
      >
        <div className="flex min-h-14 w-full items-center gap-2 px-2">
          {back != null ? <div className="flex shrink-0 items-center">{back}</div> : centered ? <div className="size-11 shrink-0" /> : null}

          <div className={cn("flex min-w-0 flex-col justify-center", centered ? "flex-1 items-center text-center" : "flex-1 px-1")}>
            <h1 className="truncate text-base font-semibold leading-tight text-foreground">{title}</h1>
            {subtitle != null && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>

          {actions != null ? (
            <div className="flex shrink-0 items-center gap-1">{actions}</div>
          ) : centered && back != null ? (
            <div className="size-11 shrink-0" />
          ) : null}
        </div>
      </header>
    )
  }
)
PageHeader.displayName = "PageHeader"
