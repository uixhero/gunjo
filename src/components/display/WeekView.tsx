"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

export type WeekEventTone =
    | "default"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "destructive"
    | "muted"

export interface WeekEvent {
    id: string
    /** Start — `"YYYY-MM-DDTHH:mm"` or a `Date`. */
    start: string | Date
    /** End — `"YYYY-MM-DDTHH:mm"` or a `Date`. */
    end: string | Date
    label: React.ReactNode
    tone?: WeekEventTone
    /** Plain-text label folded into the event's accessible name. */
    ariaLabel?: string
}

export interface WeekViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
    /** Any date within the week to display. */
    weekOf: string | Date
    events?: WeekEvent[]
    /** Number of day columns (7 = full week, 5 = Mon–Fri workweek). Default 7. */
    dayCount?: number
    /** 0 = Sunday (default), 1 = Monday. */
    weekStartsOn?: 0 | 1
    /** First / last visible hour. Default 8 / 21. */
    startHour?: number
    endHour?: number
    /** Pixels per hour. Default 48. */
    hourHeight?: number
    /** The date treated as today (injectable — SSR-safe). */
    today?: string | Date
    /** Accessible name for the calendar. */
    label?: React.ReactNode
    /** 7 short weekday labels starting Sunday. Default 日 月 火 …. */
    weekdayLabels?: string[]
    onSelectEvent?: (event: WeekEvent) => void
}

const EVENT_TONE: Record<WeekEventTone, string> = {
    default: "bg-secondary text-secondary-foreground border-border",
    primary: "bg-primary/15 text-foreground border-primary/40",
    info: "bg-info-subtle text-info-subtle-foreground border-info-border",
    success: "bg-success-subtle text-success-subtle-foreground border-success-border",
    warning: "bg-warning-subtle text-warning-subtle-foreground border-warning-border",
    destructive: "bg-destructive-subtle text-destructive-subtle-foreground border-destructive-border",
    muted: "bg-muted text-muted-foreground border-border",
}

const DEFAULT_WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"]

function toDate(value: string | Date): Date {
    if (value instanceof Date) return value
    // "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm"
    const [datePart, timePart] = value.split("T")
    const [y, m, d] = datePart.split("-").map(Number)
    const [hh, mm] = (timePart ?? "0:0").split(":").map(Number)
    return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0)
}

function dateKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function hhmm(d: Date): string {
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

interface Positioned {
    event: WeekEvent
    startMin: number
    endMin: number
    col: number
    cols: number
}

// Lay events out into side-by-side columns within overlap clusters.
function packDay(items: { event: WeekEvent; startMin: number; endMin: number }[]): Positioned[] {
    const sorted = [...items].sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin)
    const out: Positioned[] = []
    let cluster: Positioned[] = []
    let clusterEnd = -1

    const flush = () => {
        const cols = Math.max(1, ...cluster.map((p) => p.col + 1))
        for (const p of cluster) p.cols = cols
        cluster = []
        clusterEnd = -1
    }

    for (const it of sorted) {
        if (cluster.length && it.startMin >= clusterEnd) flush()
        // first free column in the current cluster
        const used = new Set(cluster.filter((p) => p.endMin > it.startMin).map((p) => p.col))
        let col = 0
        while (used.has(col)) col++
        const p: Positioned = { ...it, col, cols: 1 }
        cluster.push(p)
        out.push(p)
        clusterEnd = Math.max(clusterEnd, it.endMin)
    }
    flush()
    return out
}

/**
 * Week-view time-grid calendar: day columns × an hour axis with events positioned
 * by start/end time and **overlap-packed** into side-by-side columns, plus a time
 * gutter, weekday/date headers and an optional today highlight. Owns the week math
 * (pass `weekOf` + `events`); `today` is injectable (SSR-safe). Events are
 * focusable buttons with a composed accessible name. For appointments, bookings,
 * shift schedules, week schedulers and any time-of-day calendar. (#142)
 */
const WeekView = React.forwardRef<HTMLDivElement, WeekViewProps>(
    (
        {
            className,
            weekOf,
            events = [],
            dayCount = 7,
            weekStartsOn = 0,
            startHour = 8,
            endHour = 21,
            hourHeight = 48,
            today,
            label,
            weekdayLabels,
            onSelectEvent,
            ...props
        },
        ref
    ) => {
        const base = toDate(weekOf)
        const todayKey = today !== undefined ? dateKey(toDate(today)) : null
        const startMinAbs = startHour * 60
        const totalMin = (endHour - startHour) * 60
        const gridHeight = (totalMin / 60) * hourHeight

        const days = React.useMemo(() => {
            const lead = (base.getDay() - weekStartsOn + 7) % 7
            const first = new Date(base.getFullYear(), base.getMonth(), base.getDate() - lead)
            const labels = weekdayLabels ?? DEFAULT_WEEKDAYS
            return Array.from({ length: dayCount }, (_, i) => {
                const d = new Date(first.getFullYear(), first.getMonth(), first.getDate() + i)
                return {
                    date: d,
                    key: dateKey(d),
                    weekday: labels[d.getDay()],
                    dayNum: d.getDate(),
                    isToday: dateKey(d) === todayKey,
                }
            })
        }, [base, dayCount, weekStartsOn, weekdayLabels, todayKey])

        const positionedByDay = React.useMemo(() => {
            const byDay = new Map<string, { event: WeekEvent; startMin: number; endMin: number }[]>()
            for (const ev of events) {
                const s = toDate(ev.start)
                const e = toDate(ev.end)
                const key = dateKey(s)
                const startMin = Math.max(startMinAbs, s.getHours() * 60 + s.getMinutes())
                const endMin = Math.min(endHour * 60, e.getHours() * 60 + e.getMinutes())
                if (endMin <= startMin) continue
                const list = byDay.get(key)
                if (list) list.push({ event: ev, startMin, endMin })
                else byDay.set(key, [{ event: ev, startMin, endMin }])
            }
            const result = new Map<string, Positioned[]>()
            for (const [key, list] of byDay) result.set(key, packDay(list))
            return result
        }, [events, startMinAbs, endHour])

        const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i)

        return (
            <div
                ref={ref}
                role="group"
                aria-label={typeof label === "string" ? label : "週間カレンダー"}
                className={cn("w-full max-w-full overflow-x-auto p-0 [contain:paint]", className)}
                data-slot="week-view"
                {...props}
            >
                <div className="min-w-[640px]">
                    {/* header: time-gutter spacer + day columns */}
                    <div
                        className="grid border-b border-border"
                        style={{ gridTemplateColumns: `3rem repeat(${dayCount}, minmax(0, 1fr))` }}
                    >
                        <div className="border-r border-border" />
                        {days.map((d) => (
                            <div
                                key={d.key}
                                className={cn(
                                    "flex flex-col items-center gap-0.5 border-r border-border px-1 py-1.5 text-center last:border-r-0",
                                    d.isToday && "bg-primary/5"
                                )}
                            >
                                <span className="text-xs text-muted-foreground">{d.weekday}</span>
                                <span
                                    className={cn(
                                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm tabular-nums",
                                        d.isToday && "bg-primary font-semibold text-primary-foreground"
                                    )}
                                >
                                    {d.dayNum}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* body: hour rows + positioned events */}
                    <div
                        className="grid"
                        style={{ gridTemplateColumns: `3rem repeat(${dayCount}, minmax(0, 1fr))` }}
                    >
                        {/* time gutter */}
                        <div className="border-r border-border">
                            {hours.map((h) => (
                                <div
                                    key={h}
                                    style={{ height: hourHeight }}
                                    className="relative border-b border-border/60"
                                >
                                    <span className="absolute -top-2 right-1 text-[10px] tabular-nums text-muted-foreground">
                                        {h}:00
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* day columns */}
                        {days.map((d) => {
                            const positioned = positionedByDay.get(d.key) ?? []
                            return (
                                <div
                                    key={d.key}
                                    className={cn("relative border-r border-border last:border-r-0", d.isToday && "bg-primary/5")}
                                    style={{ height: gridHeight }}
                                >
                                    {hours.map((h) => (
                                        <div key={h} style={{ height: hourHeight }} className="border-b border-border/60" />
                                    ))}
                                    {positioned.map((p) => {
                                        const top = ((p.startMin - startMinAbs) / 60) * hourHeight
                                        const height = ((p.endMin - p.startMin) / 60) * hourHeight
                                        const widthPct = 100 / p.cols
                                        const s = toDate(p.event.start)
                                        const e = toDate(p.event.end)
                                        const name = `${d.weekday}曜 ${hhmm(s)}〜${hhmm(e)} ${
                                            p.event.ariaLabel ?? (typeof p.event.label === "string" ? p.event.label : "")
                                        }`
                                        return (
                                            <button
                                                key={p.event.id}
                                                type="button"
                                                onClick={() => onSelectEvent?.(p.event)}
                                                aria-label={name}
                                                className={cn(
                                                    "absolute overflow-hidden rounded-md border px-1.5 py-1 text-left text-[11px] leading-tight shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                                                    EVENT_TONE[p.event.tone ?? "default"]
                                                )}
                                                style={{
                                                    top,
                                                    height: Math.max(16, height - 2),
                                                    left: `calc(${p.col * widthPct}% + 1px)`,
                                                    width: `calc(${widthPct}% - 2px)`,
                                                }}
                                            >
                                                <span className="block font-medium">{hhmm(s)}</span>
                                                <span className="block truncate">{p.event.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
)
WeekView.displayName = "WeekView"

export { WeekView }
