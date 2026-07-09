"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

export type StatusBoardTone =
  | "default"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "muted"

export interface StatusBoardItem {
  id: string | number
  /** Primary label — the entity name (号車 / 改札機名 / GSE番号). */
  label: React.ReactNode
  /** Status label (空車 / 故障 / 稼働中). Shown as a colour-safe pill (icon + text). */
  status: React.ReactNode
  /** Tone for the status pill + tile accent. Default `default`. */
  tone?: StatusBoardTone
  /** Optional status icon (paired with the label — meaning never rides on colour alone). */
  statusIcon?: React.ReactNode
  /** Where the entity is (エリア / ○○口 / スポット). */
  location?: React.ReactNode
  /** Secondary line (最終更新 / 乗務員 / メモ). */
  note?: React.ReactNode
  /** Leading icon for the entity. */
  icon?: React.ReactNode
  /** Right-aligned trailing (a meter, a count, a badge). */
  trailing?: React.ReactNode
  /**
   * Explicit sort weight (lower sorts first). When omitted, items sort by tone severity
   * (danger → warning → … → muted) so problems/availability rise — the fault-first read.
   */
  rank?: number
  /** Make the tile selectable (opens detail). */
  onSelect?: () => void
}

export interface StatusBoardGroup {
  /** Group heading (エリア渋谷 / 制限エリア内 / 待機). */
  label: React.ReactNode
  /** Optional secondary on the heading. */
  sublabel?: React.ReactNode
  items: StatusBoardItem[]
}

export interface StatusBoardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Grouped tiles (each group = a heading + a tile grid, with a per-group problem count). */
  groups?: StatusBoardGroup[]
  /** Flat tiles (no grouping). Ignored if `groups` is set. */
  items?: StatusBoardItem[]
  /** Highlight one tile (others dim slightly). */
  selectedId?: string | number
  /** Min tile width (px) for the responsive auto-fill grid. Default 150. */
  minTileWidth?: number
  /** Tones counted as "problems" for the per-group count + sort priority. Default danger + warning. */
  problemTones?: StatusBoardTone[]
  /** Sort each group's tiles fault-first (by rank, then tone severity). Default `true`. */
  sort?: boolean
  /** Format the per-group problem count. Default `"N件 要対応"`. */
  formatProblemCount?: (count: number) => React.ReactNode
  /** Format the per-group total count when no problems exist. Default `"N台"`. */
  formatItemCount?: (count: number) => React.ReactNode
}

const TONE_TILE: Record<StatusBoardTone, string> = {
  default: "border-l-border",
  primary: "border-l-primary",
  info: "border-l-info",
  success: "border-l-success",
  warning: "border-l-warning",
  danger: "border-l-destructive",
  muted: "border-l-border",
}

const TONE_PILL: Record<StatusBoardTone, string> = {
  default: "bg-secondary text-secondary-foreground",
  primary: "bg-primary/15 text-foreground",
  info: "bg-info-subtle text-info",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  danger: "bg-destructive-subtle text-destructive",
  muted: "bg-muted text-muted-foreground",
}

// Higher = sorts earlier (fault-first): danger first, muted last.
const TONE_SEVERITY: Record<StatusBoardTone, number> = {
  danger: 6,
  warning: 5,
  success: 4,
  primary: 3,
  info: 2,
  default: 1,
  muted: 0,
}

const DEFAULT_PROBLEM_TONES: StatusBoardTone[] = ["danger", "warning"]

function sortItems(items: StatusBoardItem[]): StatusBoardItem[] {
  return [...items]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const ar = a.item.rank
      const br = b.item.rank
      if (ar != null || br != null) {
        if (ar == null) return 1
        if (br == null) return -1
        if (ar !== br) return ar - br
      }
      const sev = TONE_SEVERITY[b.item.tone ?? "default"] - TONE_SEVERITY[a.item.tone ?? "default"]
      if (sev !== 0) return sev
      return a.index - b.index
    })
    .map((x) => x.item)
}

function Tile({ item, selected }: { item: StatusBoardItem; selected: boolean }) {
  const tone = item.tone ?? "default"
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          {item.icon != null && <span className="shrink-0 text-muted-foreground">{item.icon}</span>}
          <span className="truncate text-sm font-semibold text-foreground">{item.label}</span>
        </div>
        {item.trailing != null && <div className="shrink-0">{item.trailing}</div>}
      </div>
      <span
        className={cn(
          "mt-1.5 inline-flex w-fit items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
          TONE_PILL[tone]
        )}
      >
        {item.statusIcon != null && <span aria-hidden="true">{item.statusIcon}</span>}
        {item.status}
      </span>
      {item.location != null && <div className="mt-1 truncate text-xs text-muted-foreground">{item.location}</div>}
      {item.note != null && <div className="mt-0.5 truncate text-xs text-muted-foreground">{item.note}</div>}
    </>
  )
  const className = cn(
    "flex flex-col rounded-md border border-l-4 bg-card p-2.5 text-left transition-colors",
    TONE_TILE[tone],
    selected && "ring-2 ring-ring",
    item.onSelect && "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  )
  if (item.onSelect) {
    return (
      <button type="button" onClick={item.onSelect} aria-pressed={selected} className={className}>
        {body}
      </button>
    )
  }
  return (
    <div className={className} role="listitem">
      {body}
    </div>
  )
}

/**
 * StatusBoard — the live entity status board at the center of every dispatch / monitoring floor:
 * many labeled entities (vehicles / machines / spots), each carrying a status (空車 / 故障 /
 * 稼働中), a location, and a note, laid out as a responsive tile grid. Problems and availability
 * stand out via a tone-accent rail + a colour-safe status pill (icon + text, never colour alone),
 * tiles sort fault-first by default, and tiles can be grouped by zone/area with a per-group
 * problem count. The board a Gantt/DataTable/HeatmapChart can't be — taxi 配車盤, 駅務の機器状態盤,
 * ramp GSE board, factory line OEE. RSC-safe except the opt-in onSelect.
 */
export const StatusBoard = React.forwardRef<HTMLDivElement, StatusBoardProps>(
  (
    {
      className,
      groups,
      items,
      selectedId,
      minTileWidth = 150,
      problemTones = DEFAULT_PROBLEM_TONES,
      sort = true,
      formatProblemCount = (count) => `${count}件 要対応`,
      formatItemCount = (count) => `${count}台`,
      ...props
    },
    ref
  ) => {
    const gridStyle: React.CSSProperties = {
      gridTemplateColumns: `repeat(auto-fill, minmax(${minTileWidth}px, 1fr))`,
    }
    const renderGrid = (list: StatusBoardItem[]) => {
      const ordered = sort ? sortItems(list) : list
      return (
        <div role="list" className="grid gap-2" style={gridStyle}>
          {ordered.map((item) => (
            <Tile key={item.id} item={item} selected={selectedId === item.id} />
          ))}
        </div>
      )
    }
    const problemCount = (list: StatusBoardItem[]) =>
      list.filter((i) => problemTones.includes(i.tone ?? "default")).length

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {groups != null ? (
          <div className="flex flex-col gap-5">
            {groups.map((group, gi) => {
              const count = problemCount(group.items)
              return (
                <section key={gi}>
                  <div className="mb-2 flex items-baseline gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{group.label}</h3>
                    {group.sublabel != null && <span className="text-xs text-muted-foreground">{group.sublabel}</span>}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {count > 0 ? (
                        <span className="font-medium text-destructive">{formatProblemCount(count)}</span>
                      ) : (
                        formatItemCount(group.items.length)
                      )}
                    </span>
                  </div>
                  {renderGrid(group.items)}
                </section>
              )
            })}
          </div>
        ) : (
          renderGrid(items ?? [])
        )}
      </div>
    )
  }
)
StatusBoard.displayName = "StatusBoard"
