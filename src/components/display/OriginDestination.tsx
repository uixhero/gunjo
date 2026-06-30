import * as React from "react"
import { IconArrowNarrowRight, IconArrowsExchange } from "@tabler/icons-react"

import { cn } from "../../lib/utils"

export interface OriginDestinationEndpoint {
  /** Main label — 東京 / HND / 上海港 / 新宿. */
  label: React.ReactNode
  /** Secondary — code / time / platform (06:00発 / JPTYO / 1番線). */
  sub?: React.ReactNode
}

export interface OriginDestinationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSwap"> {
  /** Origin endpoint. */
  from: OriginDestinationEndpoint
  /** Destination endpoint. */
  to: OriginDestinationEndpoint
  /** Intermediate stops (経由 / layover), shown between from and to. */
  via?: OriginDestinationEndpoint[]
  /** Content for the connector between endpoints — a duration / mode icon. Default an arrow. */
  connector?: React.ReactNode
  /** Show a swap button between from and to (出発⇄到着). Only when there is no `via`. */
  onSwap?: () => void
  /** Compact single-line layout for a result row (06:00発 → 08:27着). Default `false` (a prominent header). */
  inline?: boolean
  /** Accessible name. Defaults to "<from> から <to>". */
  label?: React.ReactNode
  /** Accessible label for the swap button. */
  swapLabel?: string
}

function endpointText(e: OriginDestinationEndpoint): string {
  return typeof e.label === "string" ? e.label : ""
}

/**
 * OriginDestination — the A→B route header: `出発 → 到着` (東京 → 新大阪 / HND → CTS / POL → POD /
 * 新宿 → 大阪), each endpoint a label + optional sub (code / time / platform), joined by an arrow
 * (or a `connector` slot for a duration / mode icon), with an optional swap button and `via`
 * stops. The compact identity of every transit/freight search & result screen — a *horizontal*
 * A→B across the top, NOT a vertical sequence (that's RouteStops / Itinerary, which go DOWN the
 * page). `inline` gives the small single-line variant for a result row (発→着 times). RSC-safe
 * except the opt-in `onSwap`.
 */
const OriginDestination = React.forwardRef<HTMLDivElement, OriginDestinationProps>(
  ({ className, from, to, via, connector, onSwap, inline = false, label, swapLabel = "Swap origin and destination", ...props }, ref) => {
    const endpoints = [from, ...(via ?? []), to]
    const canSwap = onSwap != null && (via == null || via.length === 0)
    const ariaLabel =
      typeof label === "string" ? label : `${endpointText(from)} to ${endpointText(to)}`

    const Arrow = (
      <IconArrowNarrowRight
        className={cn("shrink-0 text-muted-foreground", inline ? "size-4" : "size-5")}
        aria-hidden="true"
      />
    )

    if (inline) {
      return (
        <div
          ref={ref}
          role="group"
          aria-label={ariaLabel}
          className={cn("inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-sm tabular-nums", className)}
          data-slot="origin-destination"
          {...props}
        >
          {endpoints.map((e, i) => (
            <React.Fragment key={i}>
              {i > 0 ? Arrow : null}
              <span className="inline-flex items-baseline gap-1">
                <span className="font-semibold text-foreground">{e.label}</span>
                {e.sub != null ? <span className="text-xs text-muted-foreground">{e.sub}</span> : null}
              </span>
            </React.Fragment>
          ))}
        </div>
      )
    }

    const renderEndpoint = (e: OriginDestinationEndpoint, align: "start" | "end") => (
      <span className={cn("flex min-w-0 flex-col", align === "end" ? "items-end text-right" : "items-start")}>
        <span className="truncate text-lg font-bold text-foreground">{e.label}</span>
        {e.sub != null ? <span className="truncate text-xs tabular-nums text-muted-foreground">{e.sub}</span> : null}
      </span>
    )

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn("flex w-full items-center gap-3", className)}
        data-slot="origin-destination"
        {...props}
      >
        {renderEndpoint(from, "start")}

        <span className="flex shrink-0 flex-col items-center gap-0.5">
          {canSwap ? (
            <button
              type="button"
              onClick={onSwap}
              aria-label={swapLabel}
              className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <IconArrowsExchange className="size-4" aria-hidden="true" />
            </button>
          ) : via != null && via.length > 0 ? (
            <span className="flex items-center gap-1">
              {via.map((v, i) => (
                <React.Fragment key={i}>
                  {Arrow}
                  <span className="text-xs text-muted-foreground">{v.label}</span>
                </React.Fragment>
              ))}
              {Arrow}
            </span>
          ) : (
            Arrow
          )}
          {connector != null ? <span className="text-xs tabular-nums text-muted-foreground">{connector}</span> : null}
        </span>

        {renderEndpoint(to, "end")}
      </div>
    )
  }
)
OriginDestination.displayName = "OriginDestination"

export { OriginDestination }
