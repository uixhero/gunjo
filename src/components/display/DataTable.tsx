"use client"

import * as React from "react"
import {
    type Column,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    IconArrowsSort as ArrowUpDown,
    IconChevronLeft as ChevronLeft,
    IconChevronLeftPipe as ChevronLeftPipe,
    IconChevronRight as ChevronRight,
    IconChevronRightPipe as ChevronRightPipe,
    IconDots as Dots,
    IconSortAscending,
    IconSortDescending,
} from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import { Input } from "../inputs/Input"
import { Select } from "../inputs/Select"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import { Icon, type IconGlyph } from "./Icon"

export interface DataTableLabels {
    filterPlaceholder?: string
    noResults?: string
    page?: string
    of?: string
    previous?: string
    next?: string
    firstPage?: string
    lastPage?: string
    firstPageUnavailable?: string
    previousPageUnavailable?: string
    nextPageUnavailable?: string
    lastPageUnavailable?: string
    rowsPerPage?: string
    pageSizeOption?: (pageSize: number) => string
    paginationSummary?: (from: number, to: number, total: number) => string
    pageSummary?: (currentPage: number, totalPages: number) => string
    pageSelect?: string
    pageOption?: (page: number, totalPages: number) => string
    goToPage?: (page: number) => string
    sortAscending?: string
    sortDescending?: string
    clearSort?: string
    sortUnsorted?: string
    sortCurrentAscending?: string
    sortCurrentDescending?: string
}

export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    /** Optional: column id to filter by + placeholder for the filter input. Pass null to disable. */
    filter?: { columnId: string; placeholder?: string } | null
    /** Page size for pagination. Default 10. */
    pageSize?: number
    /** Selectable page sizes. Default [10, 25, 50, 100, 200]. */
    pageSizeOptions?: number[]
    labels?: DataTableLabels
    /** Optional actions rendered directly under the summary row in the table header area. */
    headerActions?: React.ReactNode
    /** Optional row state used for styling composed tables. */
    getRowState?: (row: TData, index: number) => string | undefined
    /**
     * Optional row-click handler. When set, each body row becomes focusable and
     * activatable (click or Enter) to open a detail/edit view. Clicks that land
     * on an interactive control inside the row (button, link, input, checkbox,
     * select) are ignored so per-row actions and selection still work.
     */
    onRowClick?: (row: TData) => void
    /**
     * When set, mobile (`< md`) renders the same sorted/paginated rows as a
     * stacked card list instead of a horizontally-scrolling table; the `<table>`
     * is shown from `md` up. Without it, the table is shown at every width
     * (and scrolls horizontally on small screens). (#195)
     */
    renderCard?: (row: TData) => React.ReactNode
    className?: string
}

type PageItem = number | "ellipsis-start" | "ellipsis-end"

function getColumnWidth<TData, TValue>(column: Column<TData, TValue>) {
    const size = column.getSize()
    return Number.isFinite(size) && size !== 150 ? `${size}px` : undefined
}

function isInteractiveTarget(target: EventTarget | null, boundary?: Element | null) {
    if (!(target instanceof Element)) return false
    const match = target.closest(
        'button, a, input, select, textarea, label, [role="button"], [role="checkbox"], [role="menuitem"], [tabindex]:not([tabindex="-1"])'
    )
    // The clickable row/card itself is focusable (tabIndex=0 / role="button") and
    // therefore matches the selector — only suppress the row click when the match
    // is an interactive element *inside* the row, not the row boundary itself.
    // Otherwise `closest()` resolves to the row on every body click and onRowClick
    // never fires for mouse users. (boundary = the row/card = event.currentTarget)
    return match !== null && match !== boundary
}

function getActionColumnInteractionClass(columnId: string) {
    if (columnId !== "__action_row_actions") return null

    return cn(
        "group-hover:sticky group-hover:right-0 group-hover:z-10 group-hover:border-l group-hover:bg-background",
        "group-data-[state=selected]:sticky group-data-[state=selected]:right-0 group-data-[state=selected]:z-10 group-data-[state=selected]:border-l group-data-[state=selected]:bg-muted"
    )
}

function getPageItems(currentPage: number, pageCount: number): PageItem[] {
    if (pageCount <= 7) {
        return Array.from({ length: pageCount }, (_, index) => index + 1)
    }

    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, "ellipsis-end", pageCount]
    }

    if (currentPage >= pageCount - 3) {
        return [1, "ellipsis-start", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
    }

    return [1, "ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end", pageCount]
}

function PaginationIconButton({
    label,
    disabledLabel,
    disabled,
    icon,
    onClick,
}: {
    label: string
    disabledLabel: string
    disabled: boolean
    icon: IconGlyph
    onClick: () => void
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="inline-flex">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={onClick}
                        disabled={disabled}
                        aria-label={label}
                    >
                        <Icon icon={icon} size="sm" />
                    </Button>
                </span>
            </TooltipTrigger>
            <TooltipContent>{disabled ? disabledLabel : label}</TooltipContent>
        </Tooltip>
    )
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filter,
    pageSize = 10,
    pageSizeOptions = [10, 25, 50, 100, 200],
    labels,
    headerActions,
    getRowState,
    onRowClick,
    renderCard,
    className,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const normalizedPageSizeOptions = React.useMemo(
        () => Array.from(new Set([...pageSizeOptions, pageSize])).filter((value) => value > 0).sort((a, b) => a - b),
        [pageSize, pageSizeOptions]
    )

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        initialState: { pagination: { pageSize } },
        state: { sorting, columnFilters },
    })

    // Only resolve a filter column when a non-empty columnId is given. Treating
    // the default (filter === undefined) as "off" avoids getColumn("") logging
    // a "[Table] Column with id '' does not exist" warning (#124).
    const filterColumn = filter?.columnId ? table.getColumn(filter.columnId) : null
    const pageIndex = table.getState().pagination.pageIndex
    const currentPage = pageIndex + 1
    const pageCount = table.getPageCount() || 1
    const totalRows = table.getFilteredRowModel().rows.length
    const visibleRows = table.getRowModel().rows.length
    const rowFrom = totalRows === 0 ? 0 : pageIndex * table.getState().pagination.pageSize + 1
    const rowTo = totalRows === 0 ? 0 : rowFrom + visibleRows - 1
    const pageItems = React.useMemo(() => getPageItems(currentPage, pageCount), [currentPage, pageCount])
    const visibleColumns = table.getVisibleLeafColumns()

    React.useEffect(() => {
        table.setPageSize(pageSize)
    }, [pageSize, table])

    React.useEffect(() => {
        if (pageCount > 0 && pageIndex >= pageCount) {
            table.setPageIndex(pageCount - 1)
        }
    }, [pageCount, pageIndex, table])

    return (
        <div className={cn("w-full space-y-4", className)}>
            {filterColumn ? (
                <div className="flex items-center">
                    <Input
                        placeholder={filter?.placeholder ?? labels?.filterPlaceholder ?? "Filter..."}
                        value={(filterColumn.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            filterColumn.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
            ) : null}

            <div className="rounded-md border bg-muted/20 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="text-sm text-muted-foreground">
                        {labels?.paginationSummary
                            ? labels.paginationSummary(rowFrom, rowTo, totalRows)
                            : `${rowFrom} - ${rowTo} / ${totalRows}`}
                    </div>
                    <div className="flex shrink-0 items-center gap-x-3 gap-y-2">
                        <div className="hidden items-center gap-1 sm:flex">
                            <PaginationIconButton
                                label={labels?.firstPage ?? "First page"}
                                disabledLabel={labels?.firstPageUnavailable ?? "Already on the first page"}
                                disabled={!table.getCanPreviousPage()}
                                icon={ChevronLeftPipe}
                                onClick={() => table.setPageIndex(0)}
                            />
                            <PaginationIconButton
                                label={labels?.previous ?? "Previous"}
                                disabledLabel={labels?.previousPageUnavailable ?? "No previous page"}
                                disabled={!table.getCanPreviousPage()}
                                icon={ChevronLeft}
                                onClick={() => table.previousPage()}
                            />
                            <span className="min-w-20 px-2 text-center text-sm text-muted-foreground">
                                {labels?.pageSummary
                                    ? labels.pageSummary(currentPage, pageCount)
                                    : `${currentPage} / ${pageCount}`}
                            </span>
                            <PaginationIconButton
                                label={labels?.next ?? "Next"}
                                disabledLabel={labels?.nextPageUnavailable ?? "No next page"}
                                disabled={!table.getCanNextPage()}
                                icon={ChevronRight}
                                onClick={() => table.nextPage()}
                            />
                            <PaginationIconButton
                                label={labels?.lastPage ?? "Last page"}
                                disabledLabel={labels?.lastPageUnavailable ?? "Already on the last page"}
                                disabled={!table.getCanNextPage()}
                                icon={ChevronRightPipe}
                                onClick={() => table.setPageIndex(pageCount - 1)}
                            />
                        </div>
                        <label className="flex items-center text-sm text-muted-foreground">
                            <span className="sr-only">{labels?.rowsPerPage ?? "Rows per page"}</span>
                            <Select
                                aria-label={labels?.rowsPerPage ?? "Rows per page"}
                                value={String(table.getState().pagination.pageSize)}
                                onChange={(event) => {
                                    table.setPageSize(Number(event.target.value))
                                    table.setPageIndex(0)
                                }}
                                className="h-8 w-[88px] rounded-md py-1 text-sm"
                            >
                            {normalizedPageSizeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {labels?.pageSizeOption ? labels.pageSizeOption(option) : option}
                                </option>
                            ))}
                        </Select>
                        </label>
                    </div>
                </div>
                {headerActions ? (
                    <div className="mt-3 border-t pt-3">
                        {headerActions}
                    </div>
                ) : null}
            </div>

            <div className={cn("overflow-x-auto rounded-md border", renderCard && "hidden md:block")}>
                <table className="w-full min-w-[720px] table-fixed caption-bottom text-sm">
                    <colgroup>
                        {visibleColumns.map((column) => {
                            const width = getColumnWidth(column)
                            return <col key={column.id} style={width ? { width } : undefined} />
                        })}
                    </colgroup>
                    <thead className="border-b bg-muted/50 [&_tr]:border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b">
                                {headerGroup.headers.map((header) => {
                                    const canSort = header.column.getCanSort()
                                    const sorted = header.column.getIsSorted()
                                    const currentSortLabel =
                                        sorted === "asc"
                                            ? labels?.sortCurrentAscending ?? "Current: ascending"
                                            : sorted === "desc"
                                                ? labels?.sortCurrentDescending ?? "Current: descending"
                                                : labels?.sortUnsorted ?? "Current: unsorted"
                                    const nextSortLabel =
                                        sorted === "asc"
                                            ? labels?.sortDescending ?? "Click to sort descending"
                                            : sorted === "desc"
                                                ? labels?.clearSort ?? "Click to clear sorting"
                                                : labels?.sortAscending ?? "Click to sort ascending"
                                    const sortLabel = `${currentSortLabel}. ${nextSortLabel}`
                                    const SortIcon =
                                        sorted === "asc"
                                            ? IconSortAscending
                                            : sorted === "desc"
                                                ? IconSortDescending
                                                : ArrowUpDown
                                    return (
                                        <th
                                            key={header.id}
                                            scope="col"
                                            aria-sort={
                                                canSort
                                                    ? sorted === "asc"
                                                        ? "ascending"
                                                        : sorted === "desc"
                                                            ? "descending"
                                                            : "none"
                                                    : undefined
                                            }
                                            className="h-10 whitespace-nowrap px-3 text-left align-middle font-medium text-muted-foreground"
                                        >
                                            {header.isPlaceholder ? null : canSort ? (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            type="button"
                                                            aria-label={sortLabel}
                                                            onClick={header.column.getToggleSortingHandler()}
                                                            className={cn(
                                                                "-ml-1 flex min-h-8 w-full min-w-0 items-center justify-between gap-1 rounded-md px-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                                sorted && "bg-muted text-foreground"
                                                            )}
                                                        >
                                                            <span className="min-w-0 truncate">
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                            </span>
                                                            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
                                                                <Icon icon={SortIcon} size="xs" className={cn("opacity-50", sorted && "opacity-100")} />
                                                            </span>
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{sortLabel}</TooltipContent>
                                                </Tooltip>
                                            ) : (
                                                flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )
                                            )}
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                (() => {
                                    const rowState = getRowState?.(row.original, row.index) ?? (row.getIsSelected() ? "selected" : undefined)
                                    return (
                                        <tr
                                            key={row.id}
                                            className={cn(
                                                "group border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                                                onRowClick &&
                                                    "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                                            )}
                                            data-state={rowState}
                                            tabIndex={onRowClick ? 0 : undefined}
                                            onClick={
                                                onRowClick
                                                    ? (event) => {
                                                          if (isInteractiveTarget(event.target, event.currentTarget)) return
                                                          onRowClick(row.original)
                                                      }
                                                    : undefined
                                            }
                                            onKeyDown={
                                                onRowClick
                                                    ? (event) => {
                                                          if (event.target !== event.currentTarget) return
                                                          if (event.key === "Enter") {
                                                              event.preventDefault()
                                                              onRowClick(row.original)
                                                          }
                                                      }
                                                    : undefined
                                            }
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td
                                                    key={cell.id}
                                                    className={cn(
                                                        "max-w-0 p-3 align-middle",
                                                        getActionColumnInteractionClass(cell.column.id)
                                                    )}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    )
                                })()
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="h-24 px-3 text-left text-muted-foreground sm:text-center"
                                >
                                    {labels?.noResults ?? "No results."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {renderCard ? (
                <div className="flex flex-col gap-2 md:hidden">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => {
                            const rowState = getRowState?.(row.original, row.index) ?? (row.getIsSelected() ? "selected" : undefined)
                            return (
                                <div
                                    key={row.id}
                                    data-state={rowState}
                                    role={onRowClick ? "button" : undefined}
                                    tabIndex={onRowClick ? 0 : undefined}
                                    onClick={
                                        onRowClick
                                            ? (event) => {
                                                  if (isInteractiveTarget(event.target, event.currentTarget)) return
                                                  onRowClick(row.original)
                                              }
                                            : undefined
                                    }
                                    onKeyDown={
                                        onRowClick
                                            ? (event) => {
                                                  if (event.target !== event.currentTarget) return
                                                  if (event.key === "Enter" || event.key === " ") {
                                                      event.preventDefault()
                                                      onRowClick(row.original)
                                                  }
                                              }
                                            : undefined
                                    }
                                    className={cn(
                                        "rounded-md border p-3 text-sm transition-colors data-[state=selected]:border-ring data-[state=selected]:bg-muted",
                                        onRowClick &&
                                            "cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    )}
                                >
                                    {renderCard(row.original)}
                                </div>
                            )
                        })
                    ) : (
                        <div className="rounded-md border px-3 py-6 text-left text-muted-foreground sm:text-center">
                            {labels?.noResults ?? "No results."}
                        </div>
                    )}
                </div>
            ) : null}

            <div className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:hidden">
                <div className="flex items-center gap-1">
                    <PaginationIconButton
                        label={labels?.firstPage ?? "First page"}
                        disabledLabel={labels?.firstPageUnavailable ?? "Already on the first page"}
                        disabled={!table.getCanPreviousPage()}
                        icon={ChevronLeftPipe}
                        onClick={() => table.setPageIndex(0)}
                    />
                    <PaginationIconButton
                        label={labels?.previous ?? "Previous"}
                        disabledLabel={labels?.previousPageUnavailable ?? "No previous page"}
                        disabled={!table.getCanPreviousPage()}
                        icon={ChevronLeft}
                        onClick={() => table.previousPage()}
                    />
                </div>
                <div className="flex min-w-0 items-center justify-center sm:hidden">
                    {pageCount > 1 ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Select
                                aria-label={labels?.pageSelect ?? "Go to page"}
                                value={String(currentPage)}
                                onChange={(event) => table.setPageIndex(Number(event.target.value) - 1)}
                                className="h-8 w-14 rounded-md py-1 text-center text-sm"
                            >
                                {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                                    <option key={page} value={page}>
                                        {labels?.pageOption
                                            ? labels.pageOption(page, pageCount)
                                            : page.toLocaleString()}
                                    </option>
                                ))}
                            </Select>
                            <span aria-hidden="true">/</span>
                            <span aria-hidden="true">{pageCount.toLocaleString()}</span>
                        </div>
                    ) : (
                        <span className="min-w-16 text-center text-sm text-muted-foreground">
                            {labels?.pageSummary
                                ? labels.pageSummary(currentPage, pageCount)
                                : `${currentPage} / ${pageCount}`}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-end gap-1">
                    <PaginationIconButton
                        label={labels?.next ?? "Next"}
                        disabledLabel={labels?.nextPageUnavailable ?? "No next page"}
                        disabled={!table.getCanNextPage()}
                        icon={ChevronRight}
                        onClick={() => table.nextPage()}
                    />
                    <PaginationIconButton
                        label={labels?.lastPage ?? "Last page"}
                        disabledLabel={labels?.lastPageUnavailable ?? "Already on the last page"}
                        disabled={!table.getCanNextPage()}
                        icon={ChevronRightPipe}
                        onClick={() => table.setPageIndex(pageCount - 1)}
                    />
                </div>
            </div>
            <div className="hidden w-full items-center justify-center gap-1 sm:flex">
                <PaginationIconButton
                    label={labels?.firstPage ?? "First page"}
                    disabledLabel={labels?.firstPageUnavailable ?? "Already on the first page"}
                    disabled={!table.getCanPreviousPage()}
                    icon={ChevronLeftPipe}
                    onClick={() => table.setPageIndex(0)}
                />
                <PaginationIconButton
                    label={labels?.previous ?? "Previous"}
                    disabledLabel={labels?.previousPageUnavailable ?? "No previous page"}
                    disabled={!table.getCanPreviousPage()}
                    icon={ChevronLeft}
                    onClick={() => table.previousPage()}
                />
                <div className="flex min-w-0 flex-wrap items-center justify-center gap-1 px-1">
                    {pageItems.map((item) => (
                        item === "ellipsis-start" || item === "ellipsis-end" ? (
                            <span key={item} className="flex h-8 w-8 items-center justify-center text-muted-foreground">
                                <Icon icon={Dots} size="sm" />
                            </span>
                        ) : (
                            <Button
                                key={item}
                                type="button"
                                variant={item === currentPage ? "default" : "ghost"}
                                size="icon"
                                className="h-8 w-8"
                                aria-label={labels?.goToPage?.(item) ?? `Go to page ${item}`}
                                aria-current={item === currentPage ? "page" : undefined}
                                onClick={() => table.setPageIndex(item - 1)}
                            >
                                {item}
                            </Button>
                        )
                    ))}
                </div>
                <PaginationIconButton
                    label={labels?.next ?? "Next"}
                    disabledLabel={labels?.nextPageUnavailable ?? "No next page"}
                    disabled={!table.getCanNextPage()}
                    icon={ChevronRight}
                    onClick={() => table.nextPage()}
                />
                <PaginationIconButton
                    label={labels?.lastPage ?? "Last page"}
                    disabledLabel={labels?.lastPageUnavailable ?? "Already on the last page"}
                    disabled={!table.getCanNextPage()}
                    icon={ChevronRightPipe}
                    onClick={() => table.setPageIndex(pageCount - 1)}
                />
            </div>
        </div>
    )
}

DataTable.displayName = "DataTable"
