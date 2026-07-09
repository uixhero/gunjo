"use client"

import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"

import { cn } from "../../lib/utils"

/** Marker tone for an itinerary item (per kind — flight / hotel / activity …). */
export type ItineraryTone = "default" | "primary" | "info" | "success" | "warning" | "muted"

export interface ItineraryItem {
  id?: string | number
  /** Time label (08:00 / 終日 / チェックイン 15:00). */
  time?: React.ReactNode
  /** Leading marker icon (drives the per-kind dot — flight ✈ / hotel 🏨 / activity). */
  icon?: React.ReactNode
  /** Marker tone. Default `default`. */
  tone?: ItineraryTone
  /** Primary line (便名 / ホテル名 / アクティビティ). */
  title: React.ReactNode
  /** Secondary line. */
  description?: React.ReactNode
  /** Rich content slot (flight dep→arr block, hotel nights, map …). */
  content?: React.ReactNode
  /** Right-aligned trailing (badge / meta). */
  trailing?: React.ReactNode
  /** Make the row tappable (opens detail). Opt-in — adds a chevron + ≥44px target. */
  onSelect?: () => void
}

export interface ItineraryDay {
  /** Day label (1日目 / 6月27日(土)). */
  label: React.ReactNode
  /** Optional secondary (place / date). */
  sublabel?: React.ReactNode
  items: ItineraryItem[]
}

export interface ItineraryProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Day-grouped items (each day a section with a header + a timeline). */
  days?: ItineraryDay[]
  /** Flat items (no day grouping). Ignored if `days` is given. */
  items?: ItineraryItem[]
}

const MARKER_TONE: Record<ItineraryTone, string> = {
  default: "border-border bg-secondary text-secondary-foreground",
  primary: "border-primary/40 bg-primary/15 text-foreground",
  info: "border-info-border bg-info-subtle text-info",
  success: "border-success-border bg-success-subtle text-success",
  warning: "border-warning-border bg-warning-subtle text-warning",
  muted: "border-border bg-muted text-muted-foreground",
}

function ItineraryRow({ item, isLast }: { item: ItineraryItem; isLast: boolean }) {
  const body = (
    <>
      {item.time != null && <div className="text-xs tabular-nums text-muted-foreground">{item.time}</div>}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 font-medium text-foreground">{item.title}</div>
        {item.trailing != null && <div className="shrink-0">{item.trailing}</div>}
        {item.onSelect != null && item.trailing == null && (
          <IconChevronRight className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
      {item.description != null && <div className="mt-0.5 text-sm text-muted-foreground">{item.description}</div>}
      {item.content != null && <div className="mt-2">{item.content}</div>}
    </>
  )
  return (
    <li className="flex gap-3">
      {/* marker + connector spine */}
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border",
            MARKER_TONE[item.tone ?? "default"]
          )}
          aria-hidden="true"
        >
          {item.icon}
        </span>
        {!isLast && <span className="w-px flex-1 bg-border" />}
      </div>
      {/* body */}
      <div className={cn("min-w-0 flex-1", isLast ? "pb-1" : "pb-5")}>
        {item.onSelect ? (
          <button
            type="button"
            onClick={item.onSelect}
            className="-mx-2 block min-h-11 w-[calc(100%+1rem)] cursor-pointer rounded-md px-2 py-1 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {body}
          </button>
        ) : (
          body
        )}
      </div>
    </li>
  )
}

/**
 * Itinerary — the day-grouped, mixed-kind trip/journey timeline: a vertical sequence of items
 * (flight / hotel / activity / transit leg …), each with a per-kind icon+tone marker, a time,
 * a title + secondary, an optional rich content slot, and an opt-in tappable row. Group by day
 * (`days`) with day headers, or pass flat `items`. The traveller-facing trip-plan / 乗換経路 /
 * journey view — richer than Timeline (per-item kind + content + tap), and the right call over
 * RouteStops (whose status/予実 vocabulary is delivery-locked, wrong for a forward plan).
 */
export const Itinerary = React.forwardRef<HTMLDivElement, ItineraryProps>(
  ({ className, days, items, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {days != null ? (
          <div className="flex flex-col gap-5">
            {days.map((day, di) => (
              <section key={di}>
                <div className="mb-3 flex items-baseline gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{day.label}</h3>
                  {day.sublabel != null && <span className="text-xs text-muted-foreground">{day.sublabel}</span>}
                </div>
                <ol className="flex flex-col">
                  {day.items.map((item, ii) => (
                    <ItineraryRow key={item.id ?? ii} item={item} isLast={ii === day.items.length - 1} />
                  ))}
                </ol>
              </section>
            ))}
          </div>
        ) : (
          <ol className="flex flex-col">
            {(items ?? []).map((item, ii) => (
              <ItineraryRow key={item.id ?? ii} item={item} isLast={ii === (items?.length ?? 0) - 1} />
            ))}
          </ol>
        )}
      </div>
    )
  }
)
Itinerary.displayName = "Itinerary"
