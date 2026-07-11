"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Badge } from "./Badge"

export type KanbanColumnTone =
    | "default"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "destructive"
    | "muted"

export interface KanbanColumn {
    id: string
    title: React.ReactNode
    /** Optional accent dot in the column header. */
    tone?: KanbanColumnTone
}

export interface KanbanBoardProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    /** Ordered columns (lanes). */
    columns: KanbanColumn[]
    /** All cards, in any order — grouped into columns via `getColumnId`. */
    items: T[]
    /** Stable React key per card. */
    getItemId: (item: T) => string
    /** Which column a card belongs to (matches a `columns[].id`). */
    getColumnId: (item: T) => string
    /**
     * Render a card's body (compose Badge / text / etc.).
     *
     * **Function prop — pass only from a Client Component**; from a Server Component it breaks `next build`. Render props return JSX, so there is no serializable alternative — wrap in a thin `"use client"` component to pass it from an RSC. (#338)
     */
    renderCard: (item: T) => React.ReactNode
    /** When set, each card is an activatable button (click / Enter / Space). */
    onCardSelect?: (item: T) => void
    /** Show a per-column count badge. Default `true`. */
    showCount?: boolean
    /** Placeholder for an empty column. Default `"なし"`. */
    emptyLabel?: React.ReactNode
    /** Column width in px. Default `260`. */
    columnWidth?: number
}

const TONE_DOT: Record<KanbanColumnTone, string> = {
    default: "bg-foreground/40",
    primary: "bg-primary",
    info: "bg-info",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
    muted: "bg-muted-foreground",
}

/**
 * A kanban / status board: ordered columns (lanes) of cards, grouped from a flat
 * `items` list by `getColumnId`, with per-column count badges, a card render-prop,
 * optional activatable cards, empty-column placeholders, header accent dots, and a
 * contained horizontal scroll that doesn't push the page on mobile. Each column is
 * a labelled region and cards are real buttons when selectable (keyboard-operable).
 * Drag-and-drop is bring-your-own. For editorial boards, CRM pipelines, support
 * queues, task boards and any column-of-cards workflow. (#313)
 */
function KanbanBoard<T>({
    className,
    columns,
    items,
    getItemId,
    getColumnId,
    renderCard,
    onCardSelect,
    showCount = true,
    emptyLabel = "なし",
    columnWidth = 260,
    ...props
}: KanbanBoardProps<T>) {
    const byColumn = React.useMemo(() => {
        const map = new Map<string, T[]>()
        for (const col of columns) map.set(col.id, [])
        for (const item of items) {
            const list = map.get(getColumnId(item))
            if (list) list.push(item)
        }
        return map
    }, [columns, items, getColumnId])

    return (
        <div
            className={cn("flex w-full max-w-full gap-3 overflow-x-auto p-0 [contain:paint]", className)}
            data-slot="kanban-board"
            {...props}
        >
            {columns.map((col) => {
                const cards = byColumn.get(col.id) ?? []
                const headingId = `kanban-col-${col.id}`
                return (
                    <section
                        key={col.id}
                        aria-labelledby={headingId}
                        className="flex shrink-0 flex-col rounded-lg border border-border bg-muted/30"
                        style={{ width: columnWidth }}
                    >
                        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
                            <div id={headingId} className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-foreground">
                                {col.tone ? (
                                    <span className={cn("h-2 w-2 shrink-0 rounded-full", TONE_DOT[col.tone])} aria-hidden="true" />
                                ) : null}
                                <span className="truncate">{col.title}</span>
                            </div>
                            {showCount ? (
                                <Badge variant="secondary" className="shrink-0 tabular-nums">
                                    {cards.length}
                                </Badge>
                            ) : null}
                        </div>
                        <div className="flex min-h-[60px] flex-col gap-2 p-2">
                            {cards.length ? (
                                cards.map((item) =>
                                    onCardSelect ? (
                                        <button
                                            key={getItemId(item)}
                                            type="button"
                                            onClick={() => onCardSelect(item)}
                                            className="w-full cursor-pointer rounded-md border border-border bg-card p-2 text-left shadow-sm outline-none transition-colors hover:border-ring/60 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                        >
                                            {renderCard(item)}
                                        </button>
                                    ) : (
                                        <div
                                            key={getItemId(item)}
                                            className="rounded-md border border-border bg-card p-2 shadow-sm"
                                        >
                                            {renderCard(item)}
                                        </div>
                                    )
                                )
                            ) : (
                                <p className="px-1 py-3 text-center text-xs text-muted-foreground">{emptyLabel}</p>
                            )}
                        </div>
                    </section>
                )
            })}
        </div>
    )
}
KanbanBoard.displayName = "KanbanBoard"

export { KanbanBoard }
