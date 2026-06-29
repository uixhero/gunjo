"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

export interface ScheduleAxisItem {
    id: string
    label: React.ReactNode
    /** Optional secondary line (period time, room capacity, …). */
    sublabel?: React.ReactNode
    /** Plain-text label used in a cell's composed accessible name when `label` is a node. */
    ariaLabel?: string
}

export type ScheduleCellTone =
    | "default"
    | "muted"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "destructive"

export interface ScheduleCell {
    rowId: string
    colId: string
    /** Cell body (subject + teacher + room, shift, booking, …). */
    content?: React.ReactNode
    /** Surface tone. `destructive` also gets a conflict ring. */
    tone?: ScheduleCellTone
    /** Full override of the composed accessible name. */
    ariaLabel?: string
    /** Extra detail appended after the auto "<column> <row>" prefix (e.g. "数学、佐藤、競合あり"). */
    description?: string
    /** Makes the cell an activatable button (click / Enter / Space). */
    onSelect?: () => void
    /** Mark the slot unavailable (e.g. no 6th period that day) — dashed, non-interactive. */
    unavailable?: boolean
}

export interface ScheduleGridProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    /** Row axis (e.g. periods) — rendered as `rowheader`s down the left. */
    rows: ScheduleAxisItem[]
    /** Column axis (e.g. days) — rendered as `columnheader`s across the top. */
    columns: ScheduleAxisItem[]
    /** Cells addressed by `rowId` + `colId`. Slots with no cell render `renderEmpty`. */
    cells: ScheduleCell[]
    /** Accessible name for the whole grid. */
    label: React.ReactNode
    /** Top-left corner header. */
    cornerLabel?: React.ReactNode
    /** Min width (px) per column before horizontal scroll kicks in. Default `112`. */
    minColumnWidth?: number
    /** Width (px) of the sticky row-header column. Default `72`. */
    rowHeaderWidth?: number
    /** Render a slot that has no cell (available/empty). Default a muted dash. */
    renderEmpty?: (row: ScheduleAxisItem, column: ScheduleAxisItem) => React.ReactNode
    /** Announced for an `unavailable` slot. Default `"Unavailable"`. */
    unavailableLabel?: string
    /** Announced for a slot with no cell. Default `"Open"`. */
    emptyLabel?: string
}

// Literal tone classes so Tailwind v4 keeps them (dynamic class names get tree-shaken).
const CELL_TONE: Record<ScheduleCellTone, string> = {
    default: "bg-card border-border",
    muted: "bg-muted/40 border-border text-muted-foreground",
    primary: "bg-primary/10 border-primary/40",
    info: "bg-info-subtle border-info-border",
    success: "bg-success-subtle border-success-border",
    warning: "bg-warning-subtle border-warning-border",
    destructive: "bg-destructive-subtle border-destructive-border ring-1 ring-destructive",
}

function axisText(item: ScheduleAxisItem): string {
    if (item.ariaLabel) return item.ariaLabel
    return typeof item.label === "string" ? item.label : item.id
}

/**
 * A 2-D matrix grid: a row axis × a column axis of rich content cells, with a
 * frozen first column + sticky header row, `role="grid"` semantics (rowheaders /
 * columnheaders / gridcells with composed accessible names), roving-tabindex
 * arrow-key navigation, per-cell tone (a `destructive` flag ring), an
 * `unavailable` slot treatment, and a contained horizontal scroll that does not
 * push the page on mobile.
 *
 * Use it for any rows×columns matrix of rich, navigable/editable cells —
 * **timetables** (periods×days), **gradebooks** (students×subjects, a failing-
 * grade tone per cell), **shift rosters** (staff×days), **comparison / cohort
 * matrices**, **availability** and **room/resource booking** grids. (Not for
 * sortable list data — that is `DataTable`; not for value-by-color heatmaps —
 * that is `HeatmapChart`.) (#142)
 */
const ScheduleGrid = React.forwardRef<HTMLDivElement, ScheduleGridProps>(
    (
        {
            className,
            rows,
            columns,
            cells,
            label,
            cornerLabel,
            minColumnWidth = 112,
            rowHeaderWidth = 72,
            renderEmpty,
            unavailableLabel = "Unavailable",
            emptyLabel = "Open",
            ...props
        },
        ref
    ) => {
        const cellMap = React.useMemo(() => {
            const map = new Map<string, ScheduleCell>()
            for (const cell of cells) map.set(`${cell.rowId}::${cell.colId}`, cell)
            return map
        }, [cells])

        const [active, setActive] = React.useState({ r: 0, c: 0 })
        const cellRefs = React.useRef(new Map<string, HTMLDivElement | null>())

        const focusCell = (r: number, c: number) => {
            setActive({ r, c })
            cellRefs.current.get(`${r}-${c}`)?.focus()
        }

        const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
            const { r, c } = active
            let nr = r
            let nc = c
            switch (event.key) {
                case "ArrowRight":
                    nc = Math.min(columns.length - 1, c + 1)
                    break
                case "ArrowLeft":
                    nc = Math.max(0, c - 1)
                    break
                case "ArrowDown":
                    nr = Math.min(rows.length - 1, r + 1)
                    break
                case "ArrowUp":
                    nr = Math.max(0, r - 1)
                    break
                case "Home":
                    nc = 0
                    break
                case "End":
                    nc = columns.length - 1
                    break
                case "Enter":
                case " ": {
                    const cell = cellMap.get(`${rows[r]?.id}::${columns[c]?.id}`)
                    if (cell?.onSelect && !cell.unavailable) {
                        event.preventDefault()
                        cell.onSelect()
                    }
                    return
                }
                default:
                    return
            }
            if (nr !== r || nc !== c) {
                event.preventDefault()
                focusCell(nr, nc)
            }
        }

        return (
            <div
                ref={ref}
                className={cn("w-full max-w-full overflow-x-auto p-0 [contain:paint]", className)}
                data-slot="schedule-grid"
                {...props}
            >
                <div
                    role="grid"
                    aria-label={typeof label === "string" ? label : undefined}
                    aria-rowcount={rows.length + 1}
                    aria-colcount={columns.length + 1}
                    className="grid min-w-min gap-1.5"
                    style={{
                        gridTemplateColumns: `${rowHeaderWidth}px repeat(${columns.length}, minmax(${minColumnWidth}px, 1fr))`,
                    }}
                    onKeyDown={handleKeyDown}
                >
                    {/* header row */}
                    <div role="row" className="contents">
                        <div
                            role="columnheader"
                            aria-rowindex={1}
                            aria-colindex={1}
                            className="sticky left-0 top-0 z-30 flex flex-col items-center justify-center rounded-md bg-muted px-2 py-2 text-xs font-medium text-muted-foreground"
                        >
                            {cornerLabel}
                        </div>
                        {columns.map((col, ci) => (
                            <div
                                key={col.id}
                                role="columnheader"
                                aria-rowindex={1}
                                aria-colindex={ci + 2}
                                className="sticky top-0 z-20 flex flex-col items-center justify-center gap-0.5 rounded-md bg-muted px-2 py-2 text-center text-sm font-semibold"
                            >
                                <span>{col.label}</span>
                                {col.sublabel != null ? (
                                    <span className="text-[10px] font-normal leading-tight text-muted-foreground">
                                        {col.sublabel}
                                    </span>
                                ) : null}
                            </div>
                        ))}
                    </div>

                    {/* body rows */}
                    {rows.map((row, ri) => (
                        <div role="row" className="contents" key={row.id}>
                            <div
                                role="rowheader"
                                aria-rowindex={ri + 2}
                                aria-colindex={1}
                                className="sticky left-0 z-10 flex flex-col items-center justify-center rounded-md bg-muted px-1 py-2 text-center"
                            >
                                <span className="text-sm font-semibold">{row.label}</span>
                                {row.sublabel != null ? (
                                    <span className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                                        {row.sublabel}
                                    </span>
                                ) : null}
                            </div>

                            {columns.map((col, ci) => {
                                const cell = cellMap.get(`${row.id}::${col.id}`)
                                const isActive = active.r === ri && active.c === ci
                                const prefix = `${axisText(col)} ${axisText(row)}`
                                const interactive = Boolean(cell?.onSelect) && !cell?.unavailable

                                const accessibleName =
                                    cell?.ariaLabel ??
                                    (cell?.unavailable
                                        ? `${prefix} ${unavailableLabel}`
                                        : cell?.description
                                          ? `${prefix} ${cell.description}`
                                          : cell?.content == null
                                            ? `${prefix} ${emptyLabel}`
                                            : prefix)

                                if (cell?.unavailable) {
                                    return (
                                        <div
                                            key={col.id}
                                            ref={(node) => {
                                                cellRefs.current.set(`${ri}-${ci}`, node)
                                            }}
                                            role="gridcell"
                                            aria-rowindex={ri + 2}
                                            aria-colindex={ci + 2}
                                            aria-label={accessibleName}
                                            tabIndex={isActive ? 0 : -1}
                                            className="flex items-center justify-center rounded-md border border-dashed border-border bg-muted/30 px-2 py-3 text-[11px] text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                        >
                                            {unavailableLabel}
                                        </div>
                                    )
                                }

                                return (
                                    <div
                                        key={col.id}
                                        ref={(node) => {
                                            cellRefs.current.set(`${ri}-${ci}`, node)
                                        }}
                                        role="gridcell"
                                        aria-rowindex={ri + 2}
                                        aria-colindex={ci + 2}
                                        aria-label={accessibleName}
                                        tabIndex={isActive ? 0 : -1}
                                        onClick={
                                            interactive
                                                ? () => {
                                                      setActive({ r: ri, c: ci })
                                                      cell?.onSelect?.()
                                                  }
                                                : undefined
                                        }
                                        onFocus={() => setActive({ r: ri, c: ci })}
                                        className={cn(
                                            "rounded-md border p-2 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                            CELL_TONE[cell?.tone ?? "default"],
                                            interactive && "cursor-pointer hover:border-ring/60"
                                        )}
                                    >
                                        {cell?.content ??
                                            (renderEmpty ? (
                                                renderEmpty(row, col)
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            ))}
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
ScheduleGrid.displayName = "ScheduleGrid"

export { ScheduleGrid }
