"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

export type GanttItemTone =
    | "default"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "destructive"
    | "muted"

export interface GanttRow {
    id: string
    label: React.ReactNode
    /** Secondary line under the row label. */
    sublabel?: React.ReactNode
}

export interface GanttItem {
    id: string
    /** Which row this bar belongs to (matches a `rows[].id`). */
    rowId: string
    /** Start — `"YYYY-MM-DD"` / `"YYYY-MM-DDTHH:mm"` / `Date`. */
    start: string | Date
    /** End — same formats as `start`. */
    end: string | Date
    label: React.ReactNode
    tone?: GanttItemTone
    /** Plain-text label folded into the bar's accessible name. */
    ariaLabel?: string
}

export interface GanttProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
    rows: GanttRow[]
    items: GanttItem[]
    /** Visible time window start. */
    startDate: string | Date
    /** Visible time window end. */
    endDate: string | Date
    /** The date marked with a vertical line (injectable — SSR-safe). */
    today?: string | Date
    /** Height (px) of one bar lane. Default 28. */
    laneHeight?: number
    /** Width (px) of the sticky row-label gutter. Default 120. */
    rowLabelWidth?: number
    /** Min width (px) per day column. Default 44. */
    dayWidth?: number
    /** Accessible name. */
    label?: React.ReactNode
    onSelectItem?: (item: GanttItem) => void
}

const BAR_TONE: Record<GanttItemTone, string> = {
    default: "bg-secondary text-secondary-foreground border-border",
    primary: "bg-primary/15 text-foreground border-primary/40",
    info: "bg-info-subtle text-info-subtle-foreground border-info-border",
    success: "bg-success-subtle text-success-subtle-foreground border-success-border",
    warning: "bg-warning-subtle text-warning-subtle-foreground border-warning-border",
    destructive: "bg-destructive-subtle text-destructive-subtle-foreground border-destructive-border",
    muted: "bg-muted text-muted-foreground border-border",
}

const DAY_MS = 86_400_000

function toDate(value: string | Date): Date {
    if (value instanceof Date) return value
    const [datePart, timePart] = value.split("T")
    const [y, m, d] = datePart.split("-").map(Number)
    const [hh, mm] = (timePart ?? "0:0").split(":").map(Number)
    return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0)
}

interface PlacedItem {
    item: GanttItem
    leftPct: number
    widthPct: number
    lane: number
}

// Greedy lane packing within a row so overlapping bars stack vertically.
function packRow(items: { item: GanttItem; s: number; e: number; leftPct: number; widthPct: number }[]): {
    placed: PlacedItem[]
    lanes: number
} {
    const sorted = [...items].sort((a, b) => a.s - b.s || a.e - b.e)
    const laneEnds: number[] = []
    const placed: PlacedItem[] = []
    for (const it of sorted) {
        let lane = laneEnds.findIndex((end) => end <= it.s)
        if (lane === -1) {
            lane = laneEnds.length
            laneEnds.push(it.e)
        } else {
            laneEnds[lane] = it.e
        }
        placed.push({ item: it.item, leftPct: it.leftPct, widthPct: it.widthPct, lane })
    }
    return { placed, lanes: Math.max(1, laneEnds.length) }
}

/**
 * Gantt / resource timeline: resource rows × a horizontal time axis, with bars
 * positioned by start/end and **lane-packed within a row** so overlapping bars
 * stack instead of covering each other. Day-column gridlines + date headers, a
 * sticky row-label gutter, an optional today line, and a contained horizontal
 * scroll. Owns the time math (pass `startDate`/`endDate` + `rows` + `items`);
 * `today` is injectable (SSR-safe). Bars are focusable buttons with a composed
 * accessible name. For project schedules, production lines, room/equipment
 * timelines, delivery/route plans and any rows-over-time view. (#142)
 */
const Gantt = React.forwardRef<HTMLDivElement, GanttProps>(
    (
        {
            className,
            rows,
            items,
            startDate,
            endDate,
            today,
            laneHeight = 28,
            rowLabelWidth = 120,
            dayWidth = 44,
            label,
            onSelectItem,
            ...props
        },
        ref
    ) => {
        const rangeStart = toDate(startDate).getTime()
        const rangeEnd = toDate(endDate).getTime()
        const totalMs = Math.max(1, rangeEnd - rangeStart)
        const dayCount = Math.max(1, Math.round(totalMs / DAY_MS))
        const trackWidth = dayCount * dayWidth
        const todayMs = today !== undefined ? toDate(today).getTime() : null
        const todayPct =
            todayMs !== null && todayMs >= rangeStart && todayMs <= rangeEnd
                ? ((todayMs - rangeStart) / totalMs) * 100
                : null

        const days = React.useMemo(() => {
            const out: { key: string; m: number; d: number; weekend: boolean }[] = []
            const cursor = new Date(rangeStart)
            for (let i = 0; i < dayCount; i++) {
                out.push({
                    key: `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`,
                    m: cursor.getMonth() + 1,
                    d: cursor.getDate(),
                    weekend: cursor.getDay() === 0 || cursor.getDay() === 6,
                })
                cursor.setDate(cursor.getDate() + 1)
            }
            return out
        }, [rangeStart, dayCount])

        const placedByRow = React.useMemo(() => {
            const byRow = new Map<string, { item: GanttItem; s: number; e: number; leftPct: number; widthPct: number }[]>()
            for (const it of items) {
                const s = Math.max(rangeStart, toDate(it.start).getTime())
                const e = Math.min(rangeEnd, toDate(it.end).getTime())
                if (e <= s) continue
                const entry = {
                    item: it,
                    s,
                    e,
                    leftPct: ((s - rangeStart) / totalMs) * 100,
                    widthPct: ((e - s) / totalMs) * 100,
                }
                const list = byRow.get(it.rowId)
                if (list) list.push(entry)
                else byRow.set(it.rowId, [entry])
            }
            const result = new Map<string, { placed: PlacedItem[]; lanes: number }>()
            for (const [rowId, list] of byRow) result.set(rowId, packRow(list))
            return result
        }, [items, rangeStart, rangeEnd, totalMs])

        const fmtDate = (v: string | Date) => {
            const d = toDate(v)
            return `${d.getMonth() + 1}/${d.getDate()}`
        }

        return (
            <div
                ref={ref}
                role="group"
                aria-label={typeof label === "string" ? label : "ガントチャート"}
                className={cn("w-full max-w-full overflow-x-auto p-0 [contain:paint]", className)}
                data-slot="gantt"
                {...props}
            >
                <div style={{ minWidth: rowLabelWidth + trackWidth }}>
                    {/* header */}
                    <div className="flex border-b border-border">
                        <div
                            className="sticky left-0 z-10 shrink-0 border-r border-border bg-muted"
                            style={{ width: rowLabelWidth }}
                        />
                        <div className="flex" style={{ width: trackWidth }}>
                            {days.map((day) => (
                                <div
                                    key={day.key}
                                    className={cn(
                                        "shrink-0 border-r border-border/60 px-1 py-1 text-center text-[10px] tabular-nums text-muted-foreground last:border-r-0",
                                        day.weekend && "bg-muted/40"
                                    )}
                                    style={{ width: dayWidth }}
                                >
                                    {day.d === 1 || day.d % 5 === 0 ? `${day.m}/${day.d}` : day.d}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* rows */}
                    {rows.map((row) => {
                        const { placed, lanes } = placedByRow.get(row.id) ?? { placed: [], lanes: 1 }
                        const rowHeight = lanes * laneHeight + 8
                        return (
                            <div key={row.id} className="flex border-b border-border last:border-b-0">
                                <div
                                    className="sticky left-0 z-10 flex shrink-0 flex-col justify-center border-r border-border bg-card px-2"
                                    style={{ width: rowLabelWidth, minHeight: rowHeight }}
                                >
                                    <span className="truncate text-sm font-medium text-foreground">{row.label}</span>
                                    {row.sublabel != null ? (
                                        <span className="truncate text-[11px] text-muted-foreground">{row.sublabel}</span>
                                    ) : null}
                                </div>
                                <div className="relative" style={{ width: trackWidth, height: rowHeight }}>
                                    {/* day gridlines */}
                                    <div className="absolute inset-0 flex">
                                        {days.map((day) => (
                                            <div
                                                key={day.key}
                                                className={cn(
                                                    "shrink-0 border-r border-border/40 last:border-r-0",
                                                    day.weekend && "bg-muted/30"
                                                )}
                                                style={{ width: dayWidth }}
                                            />
                                        ))}
                                    </div>
                                    {/* today line */}
                                    {todayPct !== null ? (
                                        <div
                                            aria-hidden="true"
                                            className="absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-primary/70"
                                            style={{ left: `${todayPct}%` }}
                                        />
                                    ) : null}
                                    {/* bars */}
                                    {placed.map((p) => {
                                        const name = `${typeof row.label === "string" ? row.label : ""} ${fmtDate(p.item.start)}〜${fmtDate(p.item.end)} ${
                                            p.item.ariaLabel ?? (typeof p.item.label === "string" ? p.item.label : "")
                                        }`
                                        return (
                                            <button
                                                key={p.item.id}
                                                type="button"
                                                onClick={() => onSelectItem?.(p.item)}
                                                aria-label={name}
                                                className={cn(
                                                    "absolute z-20 overflow-hidden rounded border px-1.5 text-left text-[11px] leading-[20px] shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                                                    BAR_TONE[p.item.tone ?? "default"]
                                                )}
                                                style={{
                                                    top: p.lane * laneHeight + 4,
                                                    height: laneHeight - 4,
                                                    left: `${p.leftPct}%`,
                                                    width: `calc(${p.widthPct}% - 2px)`,
                                                }}
                                            >
                                                <span className="block truncate">{p.item.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
)
Gantt.displayName = "Gantt"

export { Gantt }
