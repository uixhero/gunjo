"use client"

import * as React from "react"
import { IconPlus, IconTrash } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import type { EditableDataTableVariantKey } from "./generated/variant-keys"
import { editableDataTableDefaultVariantKey } from "./generated/default-variant-keys"

const editableDataTableVariantClasses: Record<EditableDataTableVariantKey, string> = {
    default: "text-sm",
    compact: "text-xs",
}

const cellPaddingClasses: Record<EditableDataTableVariantKey, string> = {
    default: "px-2 py-1.5",
    compact: "px-1.5 py-1",
}

const alignClasses = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
} as const

export interface EditableCellContext {
    rowIndex: number
    rowId: string
    columnId: string
    /** Ready-made accessible label (e.g. `Row 2 単価`) — spread onto your editor's `aria-label`. */
    ariaLabel: string
    /** Stable id for the cell's control, if you need explicit label wiring. */
    cellId: string
}

export interface EditableColumn<TRow> {
    id: string
    header: React.ReactNode
    /**
     * Render the cell's editor. Compose `Input`/`NumberInput`/`Select`/`Combobox`,
     * or return read-only derived text. `ctx.ariaLabel` is a ready-made
     * `${rowLabel} ${header}` label to put on your control.
     */
    cell: (row: TRow, ctx: EditableCellContext) => React.ReactNode
    /** Plain-text column name for the auto aria-label (used when `header` isn't a string). */
    headerLabel?: string
    align?: "left" | "right" | "center"
    /** CSS width for the column (e.g. `"8rem"`, `"20%"`). */
    width?: string
    /** CSS min-width so an editor column isn't crushed by content-heavy neighbours. (#206) */
    minWidth?: string
    headerClassName?: string
    cellClassName?: string
}

export interface EditableDataTableProps<TRow> {
    columns: EditableColumn<TRow>[]
    rows: TRow[]
    getRowId: (row: TRow, index: number) => string
    variant?: EditableDataTableVariantKey
    /** Show an "add row" button below the grid that calls this. */
    onAddRow?: () => void
    /** Show a per-row remove button that calls this. Hidden while `rows.length <= minRows`. */
    onRemoveRow?: (index: number) => void
    /** Minimum rows kept (remove buttons hide at/below this). Default `0`. */
    minRows?: number
    /** Mark a row invalid for error styling; the returned text is exposed to screen readers. */
    getRowError?: (row: TRow, index: number) => string | undefined
    /** Footer content (e.g. totals / 貸借バランス), rendered full-width under the body on desktop and mobile. */
    footer?: React.ReactNode
    /**
     * Per-column footer cell (e.g. a total under the 金額 column). Renders a
     * column-aligned `<tfoot>` row on desktop and a label/value stack on mobile.
     * Return `null`/`undefined` for columns with no footer. (#210)
     */
    renderFooterCell?: (column: EditableColumn<TRow>) => React.ReactNode
    /** Mobile card body per row; defaults to stacking each column as a label + editor. */
    renderRowCard?: (row: TRow, ctx: { rowIndex: number; rowId: string }) => React.ReactNode
    /** Per-row label used in cell aria-labels. Default `Row {n}`. */
    rowLabel?: (rowIndex: number) => string
    labels?: { addRow?: string; removeRow?: (rowIndex: number) => string; empty?: React.ReactNode }
    caption?: React.ReactNode
    className?: string
}

/**
 * Editable line-item grid. The consumer owns the row array (controlled) and
 * renders each cell's editor via `columns[].cell`; this component supplies the
 * structure: a desktop `<table>` that stacks into mobile cards, add/remove-row
 * affordances, an optional totals/footer row, and ready-made per-cell aria
 * labels — the ~glue every invoice/journal/estimate screen re-invents. (#199)
 */
export function EditableDataTable<TRow>({
    columns,
    rows,
    getRowId,
    variant = editableDataTableDefaultVariantKey,
    onAddRow,
    onRemoveRow,
    minRows = 0,
    getRowError,
    footer,
    renderFooterCell,
    renderRowCard,
    rowLabel,
    labels,
    caption,
    className,
}: EditableDataTableProps<TRow>) {
    const baseId = React.useId()
    const cellPad = cellPaddingClasses[variant]
    const canRemove = Boolean(onRemoveRow) && rows.length > minRows
    const resolveRowLabel = (i: number) => rowLabel?.(i) ?? `Row ${i + 1}`
    const columnLabel = (column: EditableColumn<TRow>) =>
        column.headerLabel ?? (typeof column.header === "string" ? column.header : column.id)

    const cellContext = (column: EditableColumn<TRow>, row: TRow, rowIndex: number): EditableCellContext => {
        const rowId = getRowId(row, rowIndex)
        return {
            rowIndex,
            rowId,
            columnId: column.id,
            ariaLabel: `${resolveRowLabel(rowIndex)} ${columnLabel(column)}`,
            cellId: `${baseId}-${rowId}-${column.id}`,
        }
    }

    const emptyContent = labels?.empty ?? "No rows."

    const columnStyle = (column: EditableColumn<TRow>): React.CSSProperties | undefined =>
        column.width || column.minWidth
            ? { width: column.width, minWidth: column.minWidth }
            : undefined

    return (
        <div className={cn("flex flex-col gap-3", editableDataTableVariantClasses[variant], className)} data-slot="editable-data-table">
            {/* Desktop: a real table from md up. */}
            <div className="hidden overflow-x-auto rounded-md border md:block">
                <table className="w-full caption-bottom">
                    {caption ? <caption className="px-3 py-2 text-left text-muted-foreground">{caption}</caption> : null}
                    <thead className="border-b bg-muted/50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.id}
                                    scope="col"
                                    style={columnStyle(column)}
                                    className={cn(
                                        "h-9 whitespace-nowrap font-medium text-muted-foreground",
                                        cellPad,
                                        alignClasses[column.align ?? "left"],
                                        column.headerClassName
                                    )}
                                >
                                    {column.header}
                                </th>
                            ))}
                            {onRemoveRow ? <th scope="col" className={cn("w-10", cellPad)}><span className="sr-only">Actions</span></th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length ? (
                            rows.map((row, rowIndex) => {
                                const error = getRowError?.(row, rowIndex)
                                return (
                                    <tr
                                        key={getRowId(row, rowIndex)}
                                        data-state={error ? "error" : undefined}
                                        className="border-b last:border-b-0 data-[state=error]:bg-destructive-subtle/40"
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={column.id}
                                                style={columnStyle(column)}
                                                className={cn("align-middle", cellPad, alignClasses[column.align ?? "left"], column.cellClassName)}
                                            >
                                                {column.cell(row, cellContext(column, row, rowIndex))}
                                            </td>
                                        ))}
                                        {onRemoveRow ? (
                                            <td className={cn("align-middle", cellPad)}>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    disabled={!canRemove}
                                                    aria-label={labels?.removeRow?.(rowIndex) ?? `Remove ${resolveRowLabel(rowIndex)}`}
                                                    onClick={() => onRemoveRow(rowIndex)}
                                                >
                                                    <IconTrash className="h-4 w-4" />
                                                </Button>
                                                {error ? <span className="sr-only" role="alert">{error}</span> : null}
                                            </td>
                                        ) : null}
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (onRemoveRow ? 1 : 0)} className={cn("text-muted-foreground", cellPad)}>
                                    {emptyContent}
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {renderFooterCell || footer ? (
                        <tfoot className="border-t bg-muted/30">
                            {renderFooterCell ? (
                                <tr>
                                    {columns.map((column) => (
                                        <td
                                            key={column.id}
                                            className={cn("font-medium", cellPad, alignClasses[column.align ?? "left"], column.cellClassName)}
                                        >
                                            {renderFooterCell(column)}
                                        </td>
                                    ))}
                                    {onRemoveRow ? <td className={cellPad} /> : null}
                                </tr>
                            ) : null}
                            {footer ? (
                                <tr>
                                    <td colSpan={columns.length + (onRemoveRow ? 1 : 0)} className={cn(cellPad)}>
                                        {footer}
                                    </td>
                                </tr>
                            ) : null}
                        </tfoot>
                    ) : null}
                </table>
            </div>

            {/* Mobile: one card per row. */}
            <div className="flex flex-col gap-3 md:hidden">
                {rows.length ? (
                    rows.map((row, rowIndex) => {
                        const error = getRowError?.(row, rowIndex)
                        return (
                            <div
                                key={getRowId(row, rowIndex)}
                                data-state={error ? "error" : undefined}
                                className="rounded-md border p-3 data-[state=error]:border-destructive-border"
                            >
                                <div className="mb-2 flex items-center justify-between gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">{resolveRowLabel(rowIndex)}</span>
                                    {onRemoveRow ? (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            disabled={!canRemove}
                                            aria-label={labels?.removeRow?.(rowIndex) ?? `Remove ${resolveRowLabel(rowIndex)}`}
                                            onClick={() => onRemoveRow(rowIndex)}
                                        >
                                            <IconTrash className="h-4 w-4" />
                                        </Button>
                                    ) : null}
                                </div>
                                {renderRowCard ? (
                                    renderRowCard(row, { rowIndex, rowId: getRowId(row, rowIndex) })
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {columns.map((column) => (
                                            <div key={column.id} className="flex flex-col gap-1">
                                                <span className="text-xs text-muted-foreground">{column.header}</span>
                                                {column.cell(row, cellContext(column, row, rowIndex))}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {error ? <p role="alert" className="mt-2 text-xs font-medium text-destructive">{error}</p> : null}
                            </div>
                        )
                    })
                ) : (
                    <div className="rounded-md border p-3 text-muted-foreground">{emptyContent}</div>
                )}
                {renderFooterCell || footer ? (
                    <div className="rounded-md border bg-muted/30 p-3">
                        {renderFooterCell ? (
                            <dl className="flex flex-col gap-1">
                                {columns.map((column) => {
                                    const content = renderFooterCell(column)
                                    if (content === null || content === undefined || content === false) return null
                                    return (
                                        <div key={column.id} className="flex items-center justify-between gap-2">
                                            <dt className="text-xs text-muted-foreground">{column.header}</dt>
                                            <dd className="font-medium tabular-nums">{content}</dd>
                                        </div>
                                    )
                                })}
                            </dl>
                        ) : null}
                        {footer}
                    </div>
                ) : null}
            </div>

            {onAddRow ? (
                <div>
                    <Button type="button" variant="outline" size="sm" onClick={onAddRow}>
                        <IconPlus className="h-4 w-4" />
                        {labels?.addRow ?? "Add row"}
                    </Button>
                </div>
            ) : null}
        </div>
    )
}

EditableDataTable.displayName = "EditableDataTable"
