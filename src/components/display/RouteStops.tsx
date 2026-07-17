import * as React from "react"
import { IconCheck, IconClock, IconX } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Badge } from "./Badge"
import { Delta } from "./Delta"

export type RouteStopStatus = "pending" | "current" | "completed" | "failed" | "delayed"

export interface RouteStopItem {
    /** Stable key. */
    id: string
    /** Number shown in the marker. Defaults to the 1-based index. */
    seq?: number
    /** Primary line — customer / destination. */
    title: React.ReactNode
    /** Secondary line — address. */
    description?: React.ReactNode
    /** Status drives the marker, the status label, and (for `current`) `aria-current`. */
    status: RouteStopStatus
    /** Planned ETA, `"HH:MM"`. */
    plannedTime?: string
    /** Actual arrival, `"HH:MM"`. */
    actualTime?: string
    /** Delay in minutes (+late / −early). Computed from the times when both are `"HH:MM"` and this is omitted. */
    delayMinutes?: number
    /**
     * Free-form date / timestamp for a MULTI-DAY timeline — `2025/05/16`, `5/16〜5/29`,
     * `2025/06/02 通関許可`. Shown as the stop's time line; use this instead of the
     * `"HH:MM"` `plannedTime`/`actualTime` when a stop spans calendar dates (shipment /
     * cross-dock / project tracking). When set, the intraday delay readout is skipped.
     */
    dateLabel?: React.ReactNode
    /** Extra meta (個数 etc.) shown by the title. */
    meta?: React.ReactNode
    /** Trailing per-stop actions (status update, reschedule). */
    actions?: React.ReactNode
}

export interface RouteStopsProps extends Omit<React.HTMLAttributes<HTMLOListElement>, "children"> {
    stops: RouteStopItem[]
    /**
     * Localized / domain status labels. The defaults are neutral
     * (`未着手 / 進行中 / 完了 / 失敗 / 遅延`); override per domain — e.g. delivery
     * `{ pending: "未配", current: "配送中", failed: "不在" }`. (#282)
     */
    statusLabels?: Partial<Record<RouteStopStatus, string>>
    /** Localized label shown next to the current stop. Default `"現在地"`. */
    currentLabel?: string
    /** Hide the planned / actual time + delay column. Default `false`. */
    hideTimes?: boolean
    /** Localized labels for the planned / actual times. */
    timeLabels?: { planned?: string; actual?: string }
    /** Localized labels for the signed delay. */
    delayLabels?: { late?: string; early?: string; onTime?: string }
    /** Format the absolute delay minutes. Default `"<n>分"`. */
    formatDelay?: (minutes: number) => React.ReactNode
}

type BadgeVariant = "secondary" | "info" | "success" | "destructive" | "warning"

const STATUS_CONFIG: Record<
    RouteStopStatus,
    { label: string; badge: BadgeVariant; marker: string; icon?: typeof IconCheck }
> = {
    // Neutral, domain-agnostic defaults — the status keys are generic, so the
    // labels should be too. Delivery / care / manufacturing vocab is applied per
    // domain via `statusLabels` (e.g. delivery: pending "未配", current "配送中",
    // failed "不在"). (#282)
    pending: { label: "未着手", badge: "secondary", marker: "bg-muted text-muted-foreground" },
    current: { label: "進行中", badge: "info", marker: "bg-primary text-primary-foreground" },
    completed: { label: "完了", badge: "success", marker: "bg-success-strong text-success-strong-foreground", icon: IconCheck },
    failed: { label: "失敗", badge: "destructive", marker: "bg-destructive-strong text-destructive-strong-foreground", icon: IconX },
    delayed: { label: "遅延", badge: "warning", marker: "bg-warning-strong text-warning-strong-foreground", icon: IconClock },
}

function parseHM(t?: string): number | null {
    if (!t) return null
    const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim())
    if (!m) return null
    return Number(m[1]) * 60 + Number(m[2])
}

/**
 * Ordered route / itinerary / process-chain list. Numbered stops with a per-stop
 * status (pending / current / completed / failed / delayed) driving the marker and
 * a status label — labels default to neutral vocab (`未着手 / 進行中 / 完了 / 失敗 /
 * 遅延`) and are overridden per domain via `statusLabels`. The current stop is wired
 * with `aria-current="step"`, and a trailing
 * actions slot. Two time modes: an INTRADAY planned-vs-actual `"HH:MM"` pair with a
 * signed delay (via `Delta`) for same-day delivery routes; or a free-form per-stop
 * `dateLabel` for a MULTI-DAY / multi-week dated timeline (shipment / customs /
 * cross-dock — `5/12 輸出通関 → 5/16〜5/29 海上輸送 → 6/2 通関許可 → 6/5 納品`). For
 * delivery tracking, freight/shipment tracking, picking walk-paths and any
 * sequenced-stop flow. (#228)
 */
const RouteStops = React.forwardRef<HTMLOListElement, RouteStopsProps>(
    (
        {
            className,
            stops,
            statusLabels,
            currentLabel = "現在地",
            hideTimes = false,
            timeLabels,
            delayLabels,
            formatDelay = (minutes) => `${Math.abs(minutes)}分`,
            ...props
        },
        ref
    ) => {
        return (
            <ol ref={ref} className={cn("flex w-full flex-col", className)} data-slot="route-stops" {...props}>
                {stops.map((stop, index) => {
                    const config = STATUS_CONFIG[stop.status]
                    const Icon = config.icon
                    const isLast = index === stops.length - 1
                    const label = statusLabels?.[stop.status] ?? config.label

                    const plannedMin = parseHM(stop.plannedTime)
                    const actualMin = parseHM(stop.actualTime)
                    const delay =
                        stop.delayMinutes ??
                        (plannedMin !== null && actualMin !== null ? actualMin - plannedMin : undefined)

                    return (
                        <li
                            key={stop.id}
                            aria-current={stop.status === "current" ? "step" : undefined}
                            className={cn(
                                "relative flex gap-3 rounded-md",
                                stop.status === "current" && "bg-muted/40"
                            )}
                        >
                            {/* Marker + connector */}
                            <div className="relative flex flex-col items-center">
                                <span
                                    className={cn(
                                        "z-10 mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                                        config.marker,
                                        stop.status === "current" && "ring-2 ring-ring ring-offset-2 ring-offset-background"
                                    )}
                                >
                                    {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : (stop.seq ?? index + 1)}
                                </span>
                                {!isLast ? <span className="w-px flex-1 bg-border" aria-hidden="true" /> : null}
                            </div>

                            {/* Body */}
                            <div className="flex min-w-0 flex-1 flex-col gap-1 pb-4 pr-1 pt-1">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span className="font-medium text-foreground">{stop.title}</span>
                                    <Badge variant={config.badge}>{label}</Badge>
                                    {stop.status === "current" ? (
                                        <span className="text-xs font-medium text-primary">{currentLabel}</span>
                                    ) : null}
                                    {stop.meta != null ? (
                                        <span className="text-xs text-muted-foreground">{stop.meta}</span>
                                    ) : null}
                                </div>

                                {stop.description != null ? (
                                    <p className="text-sm text-muted-foreground">{stop.description}</p>
                                ) : null}

                                {!hideTimes && stop.dateLabel != null ? (
                                    <p className="text-xs tabular-nums text-muted-foreground">{stop.dateLabel}</p>
                                ) : null}

                                {!hideTimes && stop.dateLabel == null && (stop.plannedTime || stop.actualTime || delay !== undefined) ? (
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs tabular-nums text-muted-foreground">
                                        {stop.plannedTime ? (
                                            <span>
                                                {timeLabels?.planned ?? "予定"} {stop.plannedTime}
                                            </span>
                                        ) : null}
                                        {stop.actualTime ? (
                                            <span>
                                                {timeLabels?.actual ?? "実績"} {stop.actualTime}
                                            </span>
                                        ) : null}
                                        {delay !== undefined && delay !== 0 ? (
                                            <Delta
                                                value={delay}
                                                hideArrow
                                                format={formatDelay}
                                                tones={{ positive: "destructive", negative: "success", zero: "muted" }}
                                                labels={{
                                                    positive: delayLabels?.late ?? "遅れ",
                                                    negative: delayLabels?.early ?? "早着",
                                                    zero: delayLabels?.onTime ?? "定刻",
                                                }}
                                                showLabel
                                            />
                                        ) : null}
                                    </div>
                                ) : null}

                                {stop.actions != null ? <div className="mt-1 flex flex-wrap gap-2">{stop.actions}</div> : null}
                            </div>
                        </li>
                    )
                })}
            </ol>
        )
    }
)
RouteStops.displayName = "RouteStops"

export { RouteStops }
