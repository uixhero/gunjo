import * as React from "react"

import { cn } from "../../lib/utils"

export interface BottomActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left content — the running summary (合計金額 / 到着まで○分 / 件数). Takes the remaining width. */
  children?: React.ReactNode
  /** Right-aligned action(s) — the primary CTA (+ optional secondary), each ≥44px. */
  actions?: React.ReactNode
  /** Stack the actions full-width below the summary (instead of summary | actions in a row). */
  stack?: boolean
  /** Stick to the bottom of the scroll container. Default `true`. */
  sticky?: boolean
  /** Center + cap the content width (for tablet/desktop). e.g. `"md"` → max-w-md. Default none (full width). */
  maxWidth?: "sm" | "md" | "lg" | "xl"
}

const MAX_WIDTH: Record<NonNullable<BottomActionBarProps["maxWidth"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
}

/**
 * BottomActionBar — the sticky mobile action dock every transactional / real-time consumer
 * screen ends with: a running summary on the left (合計金額 / 到着まで○分 / 選択件数) and the
 * primary CTA on the right (呼ぶ / 支払う / 予約する), pinned to the bottom with a top border and
 * safe-area-inset padding (home-indicator). The bottom bookend to PageHeader (the top app bar) —
 * for checkout, ride-hailing, booking, food-order, seat-select. Set `stack` for a full-width CTA
 * below the summary. RSC-safe (no client deps).
 */
export const BottomActionBar = React.forwardRef<HTMLDivElement, BottomActionBarProps>(
  ({ className, children, actions, stack = false, sticky = true, maxWidth, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-30 w-full border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur",
          sticky && "sticky bottom-0",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex w-full gap-3 px-4 py-3",
            stack ? "flex-col" : "min-h-16 flex-row items-center",
            maxWidth && cn("mx-auto", MAX_WIDTH[maxWidth])
          )}
        >
          {children != null && <div className={cn("min-w-0", stack ? "order-1" : "flex-1")}>{children}</div>}
          {actions != null && (
            <div
              className={cn(
                "flex shrink-0 items-center gap-2",
                stack ? "order-2 [&>*]:flex-1" : "justify-end"
              )}
            >
              {actions}
            </div>
          )}
        </div>
      </div>
    )
  }
)
BottomActionBar.displayName = "BottomActionBar"
