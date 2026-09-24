import * as React from "react"

import { cn } from "../../lib/utils"

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
    /** Alternates body row background color to improve readability in dense tables. */
    striped?: boolean
}

const Table = React.forwardRef<
    HTMLTableElement,
    TableProps
>(({ className, striped = false, ...props }, ref) => (
    // `[contain:paint]` keeps a wide table's horizontal scroll inside this box
    // instead of leaking page-level h-scroll on mobile (e.g. 375px). (#289)
    // 地の上では表の器が bg-card の面になる。Card など bg-card の面の中では
    // 塗りをやめる＝同じ色を重ねても境目にならない（1.000:1・#1029）ので、
    // 包む面をそのまま表の地にする。ハイコントラストでは枠が戻る。
    <div className="relative flex w-full flex-col overflow-auto rounded-md rounded-lg border border-transparent contrast-more:border-border forced-colors:border-[CanvasText] bg-card [.bg-card_&]:bg-transparent [contain:paint]">
        <table
            ref={ref}
            className={cn(
                "w-full caption-bottom text-sm",
                striped && "[&_tbody_tr:nth-child(even)]:bg-muted/25",
                className
            )}
            {...props}
        />
    </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
    />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            "border-t bg-accent/55 font-medium [&>tr]:last:border-b-0",
            className
        )}
        {...props}
    />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            // 選択中の行は bg-muted。dark は --secondary = --muted なので、行の中の
            // secondary の Badge が行と同値（1.000:1）になる。選択中だけ地の色に
            // 沈める（light 1.190 / dark 1.369・#1029）。
            "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted data-[state=selected]:[&_.bg-secondary]:bg-background",
            className
        )}
        {...props}
    />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "h-10 min-w-0 break-words bg-accent/55 px-3 py-3 text-left align-middle text-xs font-semibold text-muted-foreground [overflow-wrap:anywhere] [&:has([role=checkbox])]:pr-0",
            className
        )}
        {...props}
    />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn(
            "min-w-0 break-words px-3 py-3 align-middle [overflow-wrap:anywhere] [&:has([role=checkbox])]:pr-0",
            className
        )}
        {...props}
    />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn(
            "border-t bg-accent/55 px-3 py-2 text-left text-xs leading-5 text-muted-foreground",
            className
        )}
        {...props}
    />
))
TableCaption.displayName = "TableCaption"

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
}
