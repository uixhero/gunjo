"use client"

import * as React from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { TooltipButton } from "../inputs/TooltipButton"

export type CalendarEventTone =
    | "default"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "destructive"
    | "muted"

export interface CalendarEvent {
    id: string
    /** The day this event sits on — `"YYYY-MM-DD"` or a `Date`. */
    date: string | Date
    label: React.ReactNode
    tone?: CalendarEventTone
    /** Plain-text label folded into the day's composed accessible name. */
    ariaLabel?: string
}

export interface EventCalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
    /** Any date within the month to display (`"YYYY-MM"` / `"YYYY-MM-DD"` / `Date`). */
    month: string | Date
    events?: CalendarEvent[]
    /** The date treated as "today" (injectable — SSR-safe). Default: nothing marked. */
    today?: string | Date
    /** 0 = Sunday (default), 1 = Monday. */
    weekStartsOn?: 0 | 1
    /** Max event chips per day before a "＋N" affordance. Default `3`. */
    maxPerDay?: number
    /** Accessible name for the grid. */
    label?: React.ReactNode
    /** 7 short weekday labels starting Sunday. Default `日 月 火 水 木 金 土`. */
    weekdayLabels?: string[]
    /** Render an event chip (default: a tone pill). */
    renderEvent?: (event: CalendarEvent) => React.ReactNode
    onSelectDate?: (iso: string) => void
    onSelectEvent?: (event: CalendarEvent) => void
    /** When provided, renders a header with the month title + prev/next buttons. */
    onMonthChange?: (month: Date) => void
}

const EVENT_TONE: Record<CalendarEventTone, string> = {
    default: "bg-secondary text-secondary-foreground",
    primary: "bg-primary/10 text-foreground",
    info: "bg-info-subtle text-info-subtle-foreground",
    success: "bg-success-subtle text-success-subtle-foreground",
    warning: "bg-warning-subtle text-warning-subtle-foreground",
    destructive: "bg-destructive-subtle text-destructive-subtle-foreground",
    muted: "bg-muted text-muted-foreground",
}

const DEFAULT_WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"]

function toDate(value: string | Date): Date {
    if (value instanceof Date) return value
    const [y, m, d] = value.split("-").map(Number)
    return new Date(y, (m || 1) - 1, d || 1)
}

function isoOf(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

interface DayCell {
    date: Date
    iso: string
    day: number
    inMonth: boolean
    isToday: boolean
}

/**
 * Month calendar with events. Renders a 週×曜日 day-cell grid for `month` and
 * places `events` as chips on their date (capped per day with a "＋N" overflow),
 * with today marked, out-of-month days de-emphasised, `role="grid"` semantics
 * (weekday columnheaders, day gridcells with a composed accessible name) and
 * roving-tabindex keyboard nav (arrows ±1 day / ±1 week, Home/End, Enter to
 * select). Owns the month math — pass `month` + `events`; `today` is injectable
 * (SSR-safe). For editorial / content calendars, schedules, bookings, any
 * events-on-dates view. (#142)
 */
const EventCalendar = React.forwardRef<HTMLDivElement, EventCalendarProps>(
    (
        {
            className,
            month,
            events = [],
            today,
            weekStartsOn = 0,
            maxPerDay = 3,
            label,
            weekdayLabels,
            renderEvent,
            onSelectDate,
            onSelectEvent,
            onMonthChange,
            ...props
        },
        ref
    ) => {
        const monthDate = toDate(month)
        const year = monthDate.getFullYear()
        const monthIndex = monthDate.getMonth()
        const todayIso = today !== undefined ? isoOf(toDate(today)) : null

        const weekdays = React.useMemo(() => {
            const base = weekdayLabels ?? DEFAULT_WEEKDAYS
            return Array.from({ length: 7 }, (_, i) => base[(i + weekStartsOn) % 7])
        }, [weekdayLabels, weekStartsOn])

        const weeks = React.useMemo<DayCell[][]>(() => {
            const first = new Date(year, monthIndex, 1)
            const lead = (first.getDay() - weekStartsOn + 7) % 7
            const start = new Date(year, monthIndex, 1 - lead)
            const result: DayCell[][] = []
            const cursor = new Date(start)
            // 6 weeks always covers any month layout.
            for (let w = 0; w < 6; w++) {
                const week: DayCell[] = []
                for (let d = 0; d < 7; d++) {
                    const iso = isoOf(cursor)
                    week.push({
                        date: new Date(cursor),
                        iso,
                        day: cursor.getDate(),
                        inMonth: cursor.getMonth() === monthIndex,
                        isToday: iso === todayIso,
                    })
                    cursor.setDate(cursor.getDate() + 1)
                }
                result.push(week)
            }
            return result
        }, [year, monthIndex, weekStartsOn, todayIso])

        const eventsByIso = React.useMemo(() => {
            const map = new Map<string, CalendarEvent[]>()
            for (const ev of events) {
                const iso = isoOf(toDate(ev.date))
                const list = map.get(iso)
                if (list) list.push(ev)
                else map.set(iso, [ev])
            }
            return map
        }, [events])

        const [active, setActive] = React.useState<[number, number]>([0, 0])
        const cellRefs = React.useRef(new Map<string, HTMLDivElement | null>())

        const focusCell = (r: number, c: number) => {
            const nr = Math.max(0, Math.min(weeks.length - 1, r))
            const nc = Math.max(0, Math.min(6, c))
            setActive([nr, nc])
            cellRefs.current.get(`${nr}-${nc}`)?.focus()
        }

        const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
            const [r, c] = active
            switch (event.key) {
                case "ArrowRight":
                    focusCell(c === 6 ? r + 1 : r, c === 6 ? 0 : c + 1)
                    break
                case "ArrowLeft":
                    focusCell(c === 0 ? r - 1 : r, c === 0 ? 6 : c - 1)
                    break
                case "ArrowDown":
                    focusCell(r + 1, c)
                    break
                case "ArrowUp":
                    focusCell(r - 1, c)
                    break
                case "Home":
                    focusCell(r, 0)
                    break
                case "End":
                    focusCell(r, 6)
                    break
                case "Enter":
                case " ": {
                    const cell = weeks[r]?.[c]
                    if (cell) onSelectDate?.(cell.iso)
                    break
                }
                default:
                    return
            }
            event.preventDefault()
        }

        const monthTitle = `${year}年${monthIndex + 1}月`

        return (
            <div ref={ref} className={cn("w-full", className)} data-slot="event-calendar" {...props}>
                {onMonthChange ? (
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="text-base font-semibold tabular-nums text-foreground" aria-live="polite">
                            {monthTitle}
                        </div>
                        <div className="flex items-center gap-1">
                            <TooltipButton
                                size="icon"
                                variant="outline"
                                aria-label="前の月"
                                tooltip="前の月"
                                onClick={() => onMonthChange(new Date(year, monthIndex - 1, 1))}
                            >
                                <IconChevronLeft className="h-4 w-4" />
                            </TooltipButton>
                            <TooltipButton
                                size="icon"
                                variant="outline"
                                aria-label="次の月"
                                tooltip="次の月"
                                onClick={() => onMonthChange(new Date(year, monthIndex + 1, 1))}
                            >
                                <IconChevronRight className="h-4 w-4" />
                            </TooltipButton>
                        </div>
                    </div>
                ) : null}

                <div
                    role="grid"
                    aria-label={typeof label === "string" ? label : monthTitle}
                    className="w-full overflow-hidden rounded-lg border border-border bg-card"
                    onKeyDown={onKeyDown}
                >
                    <div role="row" className="grid grid-cols-7 border-b border-border bg-muted">
                        {weekdays.map((w, i) => (
                            <div
                                key={i}
                                role="columnheader"
                                className="px-1 py-1.5 text-center text-xs font-medium text-muted-foreground"
                            >
                                {w}
                            </div>
                        ))}
                    </div>

                    {weeks.map((week, r) => (
                        <div role="row" key={r} className="grid grid-cols-7">
                            {week.map((cell, c) => {
                                const dayEvents = eventsByIso.get(cell.iso) ?? []
                                const shown = dayEvents.slice(0, maxPerDay)
                                const overflow = dayEvents.length - shown.length
                                const isActive = active[0] === r && active[1] === c
                                const eventSummary = dayEvents.length
                                    ? `、${dayEvents.length}件: ${dayEvents.map((e) => e.ariaLabel ?? (typeof e.label === "string" ? e.label : "")).filter(Boolean).join("、")}`
                                    : "、予定なし"
                                const accessibleName = `${cell.date.getMonth() + 1}月${cell.day}日${cell.isToday ? "、今日" : ""}${eventSummary}`

                                return (
                                    <div
                                        key={c}
                                        ref={(node) => {
                                            cellRefs.current.set(`${r}-${c}`, node)
                                        }}
                                        role="gridcell"
                                        tabIndex={isActive ? 0 : -1}
                                        aria-label={accessibleName}
                                        aria-selected={isActive}
                                        onFocus={() => setActive([r, c])}
                                        onClick={() => {
                                            setActive([r, c])
                                            onSelectDate?.(cell.iso)
                                        }}
                                        className={cn(
                                            "flex min-h-[84px] flex-col gap-1 border-b border-r border-border p-1 text-left align-top outline-none last:border-r-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                                            (c + 1) % 7 === 0 && "border-r-0",
                                            !cell.inMonth && "bg-muted/30",
                                            onSelectDate && "cursor-pointer hover:bg-muted/40"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs tabular-nums",
                                                cell.inMonth ? "text-foreground" : "text-muted-foreground/60",
                                                cell.isToday && "bg-primary font-semibold text-primary-foreground"
                                            )}
                                        >
                                            {cell.day}
                                        </span>
                                        <div className="flex min-w-0 flex-col gap-0.5">
                                            {shown.map((ev) =>
                                                renderEvent ? (
                                                    <React.Fragment key={ev.id}>{renderEvent(ev)}</React.Fragment>
                                                ) : (
                                                    <button
                                                        key={ev.id}
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onSelectEvent?.(ev)
                                                        }}
                                                        className={cn(
                                                            "w-full truncate rounded px-1 py-0.5 text-left text-[11px] leading-tight outline-none focus-visible:ring-1 focus-visible:ring-ring",
                                                            EVENT_TONE[ev.tone ?? "default"]
                                                        )}
                                                    >
                                                        {ev.label}
                                                    </button>
                                                )
                                            )}
                                            {overflow > 0 ? (
                                                <span className="px-1 text-[11px] text-muted-foreground">＋{overflow}件</span>
                                            ) : null}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
)
EventCalendar.displayName = "EventCalendar"

export { EventCalendar }
