"use client"

import * as React from "react"
import { IconCheck, IconX } from "@tabler/icons-react"

import { cn } from "../../lib/utils"

/** Seat availability. `selected` is derived from `selectedIds`, not set here. */
export type SeatState = "available" | "occupied" | "held" | "blocked"

export interface Seat {
  /** Stable id (e.g. "12A"). */
  id: string
  /** Row label (e.g. 12). */
  row: number | string
  /** Column id — must match one of `columns`. */
  col: string
  /** Availability. Default `available`. */
  state?: SeatState
  /** Type label folded into the accessible name + an optional dot (非常口 / 足元ゆったり / プレミアム). */
  type?: string
  /** Position, folded into the accessible name (窓側 / 通路側). */
  position?: "window" | "aisle" | "middle"
  /** Per-seat fee, folded into the accessible name. */
  fee?: number
}

export interface SeatMapProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect" | "onToggle"> {
  /** Column ids in order; `null` marks an aisle gap (e.g. `["A","B","C",null,"D","E","F"]`). */
  columns: (string | null)[]
  /** The seats. */
  seats: Seat[]
  /** Controlled selection (seat ids). */
  selectedIds?: string[]
  /** Max selectable seats; once reached, unselected seats are no longer interactive. */
  maxSelectable?: number
  /** Toggle a seat (only fired for an available seat that isn't capped out). */
  onToggle?: (seatId: string) => void
  /** Format a fee for the accessible name. Default `¥1,500`. */
  formatFee?: (fee: number) => string
  /** Show the column-id header row + numeric row labels. Default `true`. */
  showHeaders?: boolean
  /** Hide the built-in state legend. */
  hideLegend?: boolean
  /** Accessible name for the grid. */
  label?: string
}

const STATE_CELL: Record<SeatState, string> = {
  available: "border-border bg-background text-foreground hover:border-primary hover:bg-primary/10",
  occupied: "border-border bg-muted text-muted-foreground/60",
  held: "border-warning-border bg-warning-subtle text-warning-subtle-foreground",
  blocked: "border-transparent bg-transparent text-transparent",
}

const STATE_LABEL: Record<SeatState | "selected", string> = {
  available: "空席",
  occupied: "予約済",
  held: "確保中",
  blocked: "選択不可",
  selected: "選択中",
}

const defaultFee = (n: number) => `¥${n.toLocaleString("ja-JP")}`

/**
 * SeatMap — the 2-D selectable seat grid: rows × columns with aisle gaps, per-seat state
 * (空席 / 予約済 / 確保中 / 選択中) and type (非常口 / 足元ゆったり / プレミアム / 窓側), controlled
 * multi-select with a capacity cap, and grid a11y (role="grid", arrow-key roving focus,
 * aria-selected / aria-disabled, composed seat names). The seat/spot picker every booking
 * flow needs — airline / 新幹線 seats, cinema, stadium, event hall, restaurant tables.
 *
 * State never rides on colour alone (selected shows a check, occupied an ×, plus an sr-only
 * label). Owns its horizontal scroll so a 3-3 / 2-4-2 cabin doesn't push the page on a phone.
 * Controlled — pass `selectedIds` + `onToggle`; `maxSelectable` disables further picks.
 */
export const SeatMap = React.forwardRef<HTMLDivElement, SeatMapProps>(
  (
    {
      columns,
      seats,
      selectedIds = [],
      maxSelectable,
      onToggle,
      formatFee = defaultFee,
      showHeaders = true,
      hideLegend,
      label = "座席表",
      className,
      ...props
    },
    ref
  ) => {
    const selected = React.useMemo(() => new Set(selectedIds), [selectedIds])
    const capped = maxSelectable != null && selected.size >= maxSelectable

    // Unique row labels in given order.
    const rows = React.useMemo(() => {
      const seen = new Set<string>()
      const out: (number | string)[] = []
      for (const s of seats) {
        const k = String(s.row)
        if (!seen.has(k)) {
          seen.add(k)
          out.push(s.row)
        }
      }
      return out
    }, [seats])

    const byCell = React.useMemo(() => {
      const m = new Map<string, Seat>()
      for (const s of seats) m.set(`${s.row}|${s.col}`, s)
      return m
    }, [seats])

    // Flattened focusable order (row-major, skipping aisles/empties/blocked) for roving focus.
    const order = React.useMemo(() => {
      const ids: string[] = []
      for (const r of rows)
        for (const c of columns) {
          if (c == null) continue
          const s = byCell.get(`${r}|${c}`)
          if (s && s.state !== "blocked") ids.push(s.id)
        }
      return ids
    }, [rows, columns, byCell])

    const [focusId, setFocusId] = React.useState<string | null>(null)
    const activeId = focusId && order.includes(focusId) ? focusId : order[0] ?? null
    const refs = React.useRef(new Map<string, HTMLButtonElement>())

    const focusSeat = (id: string | undefined) => {
      if (!id) return
      setFocusId(id)
      refs.current.get(id)?.focus()
    }

    const onKeyDown = (e: React.KeyboardEvent, seat: Seat) => {
      const i = order.indexOf(seat.id)
      if (i === -1) return
      if (e.key === "ArrowRight") {
        e.preventDefault()
        focusSeat(order[i + 1])
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        focusSeat(order[i - 1])
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault()
        const rowIdx = rows.findIndex((r) => String(r) === String(seat.row))
        const nextRow = rows[rowIdx + (e.key === "ArrowDown" ? 1 : -1)]
        if (nextRow != null) {
          const target = byCell.get(`${nextRow}|${seat.col}`)
          if (target && target.state !== "blocked") focusSeat(target.id)
        }
      }
    }

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div className="w-full overflow-x-auto [contain:paint]">
          <div role="grid" aria-label={label} className="inline-block min-w-min">
            {showHeaders && (
              <div role="row" className="flex items-center gap-1 pb-1 pl-7">
                {columns.map((c, ci) =>
                  c == null ? (
                    <div key={`h-gap-${ci}`} className="w-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <div
                      key={`h-${c}`}
                      role="columnheader"
                      className="w-8 shrink-0 text-center text-[11px] font-medium text-muted-foreground"
                    >
                      {c}
                    </div>
                  )
                )}
              </div>
            )}
            {rows.map((r) => (
              <div role="row" key={String(r)} className="flex items-center gap-1 py-0.5">
                {showHeaders && (
                  <div className="w-6 shrink-0 pr-1 text-right text-[11px] tabular-nums text-muted-foreground" aria-hidden="true">
                    {r}
                  </div>
                )}
                {columns.map((c, ci) => {
                  if (c == null) return <div key={`gap-${r}-${ci}`} className="w-4 shrink-0" aria-hidden="true" />
                  const seat = byCell.get(`${r}|${c}`)
                  if (!seat || seat.state === "blocked")
                    return <div key={`empty-${r}-${c}`} className="size-8 shrink-0" aria-hidden="true" />
                  const isSelected = selected.has(seat.id)
                  const state = seat.state ?? "available"
                  const interactive = state === "available" && (isSelected || !capped)
                  const parts = [
                    `${seat.row}番${seat.col}席`,
                    seat.position === "window" ? "窓側" : seat.position === "aisle" ? "通路側" : "",
                    seat.type ?? "",
                    isSelected ? STATE_LABEL.selected : STATE_LABEL[state],
                    seat.fee != null && state === "available" ? formatFee(seat.fee) : "",
                  ].filter(Boolean)
                  return (
                    <button
                      key={seat.id}
                      ref={(el) => {
                        if (el) refs.current.set(seat.id, el)
                        else refs.current.delete(seat.id)
                      }}
                      type="button"
                      role="gridcell"
                      aria-selected={isSelected}
                      aria-disabled={!interactive || undefined}
                      aria-label={parts.join("、")}
                      tabIndex={seat.id === activeId ? 0 : -1}
                      onFocus={() => setFocusId(seat.id)}
                      onKeyDown={(e) => onKeyDown(e, seat)}
                      onClick={() => interactive && onToggle?.(seat.id)}
                      className={cn(
                        "relative flex size-8 shrink-0 items-center justify-center rounded-md border text-[10px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : STATE_CELL[state],
                        seat.type && state === "available" && !isSelected && "border-info-border bg-info-subtle",
                        !interactive && "cursor-default"
                      )}
                    >
                      {isSelected ? (
                        <IconCheck className="size-4" aria-hidden="true" />
                      ) : state === "occupied" ? (
                        <IconX className="size-3.5" aria-hidden="true" />
                      ) : (
                        <span aria-hidden="true">{seat.col}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {!hideLegend && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
            <LegendDot className="border-border bg-background" label={STATE_LABEL.available} />
            <LegendDot className="border-info-border bg-info-subtle" label="特別席（非常口/足元ゆったり 等）" />
            <LegendDot className="border-primary bg-primary" label={STATE_LABEL.selected} icon="check" />
            <LegendDot className="border-border bg-muted" label={STATE_LABEL.occupied} icon="x" />
          </div>
        )}
      </div>
    )
  }
)
SeatMap.displayName = "SeatMap"

function LegendDot({ className, label, icon }: { className: string; label: string; icon?: "check" | "x" }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("inline-flex size-4 items-center justify-center rounded border", className)}>
        {icon === "check" ? (
          <IconCheck className="size-3 text-primary-foreground" aria-hidden="true" />
        ) : icon === "x" ? (
          <IconX className="size-2.5 text-muted-foreground/60" aria-hidden="true" />
        ) : null}
      </span>
      {label}
    </span>
  )
}
