"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
    IconBan as Ban,
    IconCheck as Check,
    IconDots as Dots,
    IconPencil as Pencil,
    IconTrash as Trash,
} from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Button, type ButtonProps } from "../inputs/Button"
import { Checkbox } from "../inputs/Checkbox"
import { Select } from "../inputs/Select"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import { Badge } from "./Badge"
import { DataTable, type DataTableLabels, type DataTableProps } from "./DataTable"
import { actionDataTableDefaultVariantKey } from "./generated/default-variant-keys"
import type { ActionDataTableVariantKey } from "./generated/variant-keys"
import { Icon, type IconGlyph } from "./Icon"

type ResolveValue<TData, TValue> = TValue | ((row: TData) => TValue)
type ResolveRowsValue<TData, TValue> = TValue | ((rows: TData[]) => TValue)

export interface ActionDataTableLabels extends DataTableLabels {
    selectedRows?: (count: number) => string
    selectedRowsLabel?: string
    selectAllRows?: string
    selectRow?: (label: string) => string
    selectAllRowsSelected?: string
    selectRowSelected?: (label: string) => string
    clearSelection?: string
    actions?: string
    bulkActions?: string
    bulkActionPlaceholder?: string
    disabledAction?: string
}

export interface ActionDataTableRowAction<TData> {
    id: string
    label: string
    icon?: IconGlyph
    variant?: ButtonProps["variant"]
    disabled?: ResolveValue<TData, boolean>
    disabledReason?: ResolveValue<TData, string>
    onSelect?: (row: TData) => void
}

export interface ActionDataTableBulkAction<TData> {
    id: string
    label: string
    icon?: IconGlyph
    variant?: ButtonProps["variant"]
    disabled?: ResolveRowsValue<TData, boolean>
    disabledReason?: ResolveRowsValue<TData, string>
    onSelect?: (rows: TData[]) => void
}

export interface ActionDataTableProps<TData, TValue>
    extends Omit<DataTableProps<TData, TValue>, "columns" | "labels"> {
    columns: ColumnDef<TData, TValue>[]
    labels?: ActionDataTableLabels
    getRowId?: (row: TData, index: number) => string
    getRowLabel?: (row: TData, index: number) => string
    variant?: ActionDataTableVariantKey
    enableSelection?: boolean
    rowActions?: ActionDataTableRowAction<TData>[]
    bulkActions?: ActionDataTableBulkAction<TData>[]
}

function resolveValue<TData, TValue>(value: ResolveValue<TData, TValue> | undefined, row: TData) {
    return typeof value === "function" ? (value as (row: TData) => TValue)(row) : value
}

function resolveRowsValue<TData, TValue>(value: ResolveRowsValue<TData, TValue> | undefined, rows: TData[]) {
    return typeof value === "function" ? (value as (rows: TData[]) => TValue)(rows) : value
}

function ActionButton({
    label,
    disabled,
    disabledReason,
    icon,
    variant = "ghost",
    onClick,
}: {
    label: string
    disabled?: boolean
    disabledReason?: string
    icon?: IconGlyph
    variant?: ButtonProps["variant"]
    onClick?: () => void
}) {
    const tooltip = disabled ? disabledReason ?? label : label

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="inline-flex">
                    <Button
                        type="button"
                        variant={variant}
                        size={icon ? "icon" : "sm"}
                        className={cn(icon && "h-8 w-8")}
                        disabled={disabled}
                        aria-label={label}
                        onClick={onClick}
                    >
                        {icon ? <Icon icon={icon} size="sm" /> : label}
                    </Button>
                </span>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
    )
}

function BulkActionButton<TData>({
    action,
    rows,
    onComplete,
}: {
    action: ActionDataTableBulkAction<TData>
    rows: TData[]
    onComplete?: () => void
}) {
    const disabled = rows.length === 0 || Boolean(resolveRowsValue(action.disabled, rows))
    const disabledReason = resolveRowsValue(action.disabledReason, rows)

    return (
        <ActionButton
            label={action.label}
            icon={action.icon}
            variant={action.variant ?? "outline"}
            disabled={disabled}
            disabledReason={disabledReason}
            onClick={() => {
                action.onSelect?.(rows)
                onComplete?.()
            }}
        />
    )
}

const actionDataTableVariantClasses: Record<ActionDataTableVariantKey, string> = {
    default: "p-0",
    rowActions: "p-0",
    selection: "p-0",
}

export function ActionDataTable<TData, TValue>({
    columns,
    data,
    labels,
    getRowId,
    getRowLabel,
    variant = actionDataTableDefaultVariantKey,
    enableSelection = true,
    rowActions,
    bulkActions,
    className,
    ...props
}: ActionDataTableProps<TData, TValue>) {
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => new Set())
    const rowActionColumnSize = Math.max(120, (rowActions?.length ?? 0) * 40 + 24)
    const getId = React.useCallback(
        (row: TData, index: number) => getRowId?.(row, index) ?? String(index),
        [getRowId]
    )
    const rowMeta = React.useMemo(
        () =>
            data.map((row, index) => ({
                row,
                id: getId(row, index),
                label: getRowLabel?.(row, index) ?? String(index + 1),
            })),
        [data, getId, getRowLabel]
    )
    const selectedRows = React.useMemo(
        () => rowMeta.filter((meta) => selectedIds.has(meta.id)).map((meta) => meta.row),
        [rowMeta, selectedIds]
    )
    const allSelected = rowMeta.length > 0 && rowMeta.every((meta) => selectedIds.has(meta.id))
    const partiallySelected = !allSelected && rowMeta.some((meta) => selectedIds.has(meta.id))
    const bulkActionPlaceholder = labels?.bulkActionPlaceholder ?? labels?.bulkActions ?? "Bulk actions"
    const selectAllLabel = allSelected
        ? labels?.selectAllRowsSelected ?? labels?.clearSelection ?? "Deselect all rows"
        : labels?.selectAllRows ?? "Select all rows"

    React.useEffect(() => {
        setSelectedIds((current) => {
            const validIds = new Set(rowMeta.map((meta) => meta.id))
            const next = new Set<string>()
            let changed = false
            for (const id of current) {
                if (validIds.has(id)) {
                    next.add(id)
                } else {
                    changed = true
                }
            }
            return changed || next.size !== current.size ? next : current
        })
    }, [rowMeta])

    const actionColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
        const nextColumns: ColumnDef<TData, TValue>[] = []

        if (enableSelection) {
            nextColumns.push({
                id: "__action_select",
                enableSorting: false,
                size: 48,
                minSize: 48,
                maxSize: 48,
                header: () => (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="inline-flex">
                                <Checkbox
                                    checked={allSelected}
                                    aria-checked={partiallySelected ? "mixed" : allSelected}
                                    aria-label={selectAllLabel}
                                    className={cn(partiallySelected && "bg-foreground/60")}
                                    onCheckedChange={(checked) => {
                                        setSelectedIds(checked ? new Set(rowMeta.map((meta) => meta.id)) : new Set())
                                    }}
                                />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>{selectAllLabel}</TooltipContent>
                    </Tooltip>
                ),
                cell: ({ row }) => {
                    const meta = rowMeta[row.index]
                    if (!meta) return null
                    const rowSelected = selectedIds.has(meta.id)
                    const rowSelectionLabel = rowSelected
                        ? labels?.selectRowSelected?.(meta.label) ?? `Deselect ${meta.label}`
                        : labels?.selectRow?.(meta.label) ?? `Select ${meta.label}`
                    return (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="inline-flex">
                                    <Checkbox
                                        checked={rowSelected}
                                        aria-label={rowSelectionLabel}
                                        onCheckedChange={(checked) => {
                                            setSelectedIds((current) => {
                                                const next = new Set(current)
                                                if (checked) {
                                                    next.add(meta.id)
                                                } else {
                                                    next.delete(meta.id)
                                                }
                                                return next
                                            })
                                        }}
                                    />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>{rowSelectionLabel}</TooltipContent>
                        </Tooltip>
                    )
                },
            })
        }

        nextColumns.push(...columns)

        if (rowActions?.length) {
            nextColumns.push({
                id: "__action_row_actions",
                enableSorting: false,
                size: rowActionColumnSize,
                minSize: rowActionColumnSize,
                header: () => <span className="sr-only">{labels?.actions ?? "Actions"}</span>,
                cell: ({ row }) => {
                    const meta = rowMeta[row.index]
                    if (!meta) return null
                    return (
                        <div className="flex items-center justify-end gap-1">
                            {rowActions.map((action) => {
                                const disabled = Boolean(resolveValue(action.disabled, meta.row))
                                return (
                                    <ActionButton
                                        key={action.id}
                                        label={action.label}
                                        icon={action.icon}
                                        variant={action.variant}
                                        disabled={disabled}
                                        disabledReason={resolveValue(action.disabledReason, meta.row)}
                                        onClick={() => action.onSelect?.(meta.row)}
                                    />
                                )
                            })}
                        </div>
                    )
                },
            })
        }

        return nextColumns
    }, [
        allSelected,
        columns,
        enableSelection,
        labels,
        partiallySelected,
        rowActionColumnSize,
        rowActions,
        rowMeta,
        selectAllLabel,
        selectedIds,
        selectedRows,
    ])

    const bulkToolbar = bulkActions?.length ? (
        <div className="flex items-center gap-2">
            <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                <Badge variant={selectedRows.length > 0 ? "default" : "outline"}>
                    {selectedRows.length}
                </Badge>
                <span className="whitespace-nowrap">
                    {labels?.selectedRowsLabel ?? "selected"}
                </span>
            </div>
            <div className="ml-auto flex shrink-0 items-center justify-end sm:ml-0">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="inline-flex">
                            <Select
                                value=""
                                aria-label={bulkActionPlaceholder}
                                disabled={selectedRows.length === 0}
                                className="h-9 w-40 rounded-md py-1 text-sm"
                                onChange={(event) => {
                                    const action = bulkActions.find((item) => item.id === event.target.value)
                                    if (!action) return
                                    const disabled = Boolean(resolveRowsValue(action.disabled, selectedRows))
                                    if (disabled) return
                                    action.onSelect?.(selectedRows)
                                    setSelectedIds(new Set())
                                }}
                            >
                                <option value="">{bulkActionPlaceholder}</option>
                                {bulkActions.map((action) => (
                                    <option
                                        key={action.id}
                                        value={action.id}
                                        disabled={Boolean(resolveRowsValue(action.disabled, selectedRows))}
                                    >
                                        {action.label}
                                    </option>
                                ))}
                            </Select>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        {selectedRows.length === 0
                            ? labels?.disabledAction ?? "Select rows first"
                            : bulkActionPlaceholder}
                    </TooltipContent>
                </Tooltip>
            </div>
            <div
                className="ml-auto hidden shrink-0 items-center justify-end gap-1 sm:flex"
                style={{ width: rowActionColumnSize }}
            >
                {bulkActions.map((action) => (
                    <BulkActionButton
                        key={action.id}
                        action={action}
                        rows={selectedRows}
                        onComplete={() => setSelectedIds(new Set())}
                    />
                ))}
            </div>
        </div>
    ) : null

    return (
        <div className={cn("w-full space-y-3", actionDataTableVariantClasses[variant], className)}>
            <DataTable
                {...props}
                columns={actionColumns}
                data={data}
                labels={labels}
                headerActions={bulkToolbar}
                getRowState={(_, index) => {
                    const meta = rowMeta[index]
                    return meta && selectedIds.has(meta.id) ? "selected" : undefined
                }}
            />
        </div>
    )
}

ActionDataTable.displayName = "ActionDataTable"

export const actionDataTableDefaultRowActions = {
    edit: Pencil,
    delete: Trash,
    more: Dots,
} as const

export const actionDataTableDefaultBulkActions = {
    approve: Check,
    reject: Ban,
    delete: Trash,
} as const
