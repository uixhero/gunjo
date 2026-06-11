"use client";

import * as React from "react";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationFirst,
    PaginationItem,
    PaginationLast,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    Select,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@gunjo/ui";

const TOTAL = 50;

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function getPageItems(currentPage: number, pageCount: number): PageItem[] {
    if (pageCount <= 7) {
        return Array.from({ length: pageCount }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, "ellipsis-end", pageCount];
    }

    if (currentPage >= pageCount - 3) {
        return [1, "ellipsis-start", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
    }

    return [1, "ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end", pageCount];
}

function PaginationControlTooltip({
    label,
    disabledLabel,
    disabled,
    children,
}: {
    label: string;
    disabledLabel: string;
    disabled: boolean;
    children: React.ReactNode;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="inline-flex">{children}</span>
            </TooltipTrigger>
            <TooltipContent>{disabled ? disabledLabel : label}</TooltipContent>
        </Tooltip>
    );
}

function CompactPaginationControls({
    page,
    totalPages,
    onPageChange,
    showBoundary = false,
    ariaLabel,
}: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showBoundary?: boolean;
    ariaLabel: string;
}) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const canPrevious = page > 1;
    const canNext = page < totalPages;
    const selectLabel = isJa ? "ページを選択" : "Select page";

    return (
        <Pagination className="sm:hidden" aria-label={ariaLabel}>
            <div className="grid w-full max-w-xs grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
                <div className="flex items-center gap-1">
                    {showBoundary ? (
                        <PaginationControlTooltip label={isJa ? "最初のページへ" : "First page"} disabledLabel={isJa ? "すでに最初のページです" : "Already on the first page"} disabled={!canPrevious}>
                            <PaginationFirst href="#" label={<span className="sr-only">{isJa ? "最初のページへ" : "First page"}</span>} aria-label={isJa ? "最初のページへ" : "Go to first page"} aria-disabled={!canPrevious} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); onPageChange(1); }} />
                        </PaginationControlTooltip>
                    ) : null}
                    <PaginationControlTooltip label={isJa ? "前へ" : "Previous"} disabledLabel={isJa ? "前のページはありません" : "No previous page"} disabled={!canPrevious}>
                        <PaginationPrevious href="#" label={<span className="sr-only">{isJa ? "前へ" : "Previous"}</span>} aria-label={isJa ? "前のページへ" : "Go to previous page"} aria-disabled={!canPrevious} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); onPageChange(Math.max(1, page - 1)); }} />
                    </PaginationControlTooltip>
                </div>
                <label className="flex min-w-0 items-center justify-center gap-1 text-sm text-muted-foreground">
                    <span className="sr-only">{selectLabel}</span>
                    <Select aria-label={selectLabel} value={String(page)} onChange={(event) => onPageChange(Number(event.target.value))} className="h-9 w-16 rounded-md py-1 text-center text-sm">
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                            <option key={pageNumber} value={pageNumber}>
                                {pageNumber}
                            </option>
                        ))}
                    </Select>
                    <span aria-hidden="true">/</span>
                    <span aria-hidden="true">{totalPages}</span>
                </label>
                <div className="flex items-center justify-end gap-1">
                    <PaginationControlTooltip label={isJa ? "次へ" : "Next"} disabledLabel={isJa ? "次のページはありません" : "No next page"} disabled={!canNext}>
                        <PaginationNext href="#" label={<span className="sr-only">{isJa ? "次へ" : "Next"}</span>} aria-label={isJa ? "次のページへ" : "Go to next page"} aria-disabled={!canNext} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); onPageChange(Math.min(totalPages, page + 1)); }} />
                    </PaginationControlTooltip>
                    {showBoundary ? (
                        <PaginationControlTooltip label={isJa ? "最後のページへ" : "Last page"} disabledLabel={isJa ? "すでに最後のページです" : "Already on the last page"} disabled={!canNext}>
                            <PaginationLast href="#" label={<span className="sr-only">{isJa ? "最後のページへ" : "Last page"}</span>} aria-label={isJa ? "最後のページへ" : "Go to last page"} aria-disabled={!canNext} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); onPageChange(totalPages); }} />
                        </PaginationControlTooltip>
                    ) : null}
                </div>
            </div>
        </Pagination>
    );
}

function PaginationExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [page, setPage] = React.useState(2);
    const totalPages = 10;
    const pages = React.useMemo(() => getPageItems(page, totalPages), [page, totalPages]);
    const previousLabel = isJa ? "前へ" : "Previous";
    const nextLabel = isJa ? "次へ" : "Next";

    return (
        <>
            <CompactPaginationControls page={page} totalPages={totalPages} onPageChange={setPage} ariaLabel={isJa ? "ページ送り" : "Pagination"} />
            <Pagination className="hidden sm:flex" aria-label={isJa ? "ページ送り" : "Pagination"}>
                <PaginationContent>
                    <PaginationItem><PaginationPrevious href="#" label={previousLabel} aria-label={isJa ? "前のページへ" : "Go to previous page"} onClick={(event) => { event.preventDefault(); setPage((current) => Math.max(1, current - 1)); }} /></PaginationItem>
                    {pages.map((entry) => entry === "ellipsis-start" || entry === "ellipsis-end" ? (
                        <PaginationItem key={entry}><PaginationEllipsis /></PaginationItem>
                    ) : (
                        <PaginationItem key={entry}>
                            <PaginationLink href="#" isActive={entry === page} aria-label={isJa ? `${entry}ページへ移動` : `Go to page ${entry}`} onClick={(event) => { event.preventDefault(); setPage(entry); }}>
                                {entry}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem><PaginationNext href="#" label={nextLabel} aria-label={isJa ? "次のページへ" : "Go to next page"} onClick={(event) => { event.preventDefault(); setPage((current) => Math.min(totalPages, current + 1)); }} /></PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    );
}

function ControlledPagination() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [page, setPage] = React.useState(7);
    const visible = React.useMemo(() => getPageItems(page, TOTAL), [page]);
    const previousLabel = isJa ? "前へ" : "Previous";
    const nextLabel = isJa ? "次へ" : "Next";

    return (
        <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">
                {isJa ? "現在のページ" : "Current page"} <span className="font-mono">{page}</span> / {TOTAL}
            </p>
            <CompactPaginationControls page={page} totalPages={TOTAL} onPageChange={setPage} ariaLabel={isJa ? "ページ番号で移動" : "Numbered pagination"} />
            <Pagination className="hidden sm:flex" aria-label={isJa ? "ページ番号で移動" : "Numbered pagination"}>
                <PaginationContent className="flex-wrap justify-center">
                    <PaginationItem>
                        <PaginationPrevious href="#" label={previousLabel} aria-label={isJa ? "前のページへ" : "Go to previous page"} onClick={(event) => { event.preventDefault(); setPage((current) => Math.max(1, current - 1)); }} />
                    </PaginationItem>
                    {visible.map((entry, index) => entry === "ellipsis-start" || entry === "ellipsis-end" ? (
                        <PaginationItem key={`ellipsis-${index}`}><PaginationEllipsis /></PaginationItem>
                    ) : (
                        <PaginationItem key={entry}>
                            <PaginationLink href="#" isActive={entry === page} aria-label={isJa ? `${entry}ページへ移動` : `Go to page ${entry}`} onClick={(event) => { event.preventDefault(); setPage(entry); }}>
                                {entry}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext href="#" label={nextLabel} aria-label={isJa ? "次のページへ" : "Go to next page"} onClick={(event) => { event.preventDefault(); setPage((current) => Math.min(TOTAL, current + 1)); }} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

function BoundaryPagination() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [page, setPage] = React.useState(6);
    const totalPages = 24;
    const pageItems = React.useMemo(() => getPageItems(page, totalPages), [page, totalPages]);
    const canPrevious = page > 1;
    const canNext = page < totalPages;

    return (
        <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">
                {isJa ? "現在のページ" : "Current page"} <span className="font-mono">{page}</span> / {totalPages}
            </p>
            <CompactPaginationControls page={page} totalPages={totalPages} onPageChange={setPage} showBoundary ariaLabel={isJa ? "先頭と末尾を含むページ送り" : "Pagination with first and last controls"} />
            <Pagination className="hidden sm:flex" aria-label={isJa ? "先頭と末尾を含むページ送り" : "Pagination with first and last controls"}>
                <PaginationContent className="flex-wrap justify-center">
                    <PaginationItem>
                        <PaginationControlTooltip label={isJa ? "最初のページへ" : "First page"} disabledLabel={isJa ? "すでに最初のページです" : "Already on the first page"} disabled={!canPrevious}>
                            <PaginationFirst href="#" label={isJa ? "最初" : "First"} aria-label={isJa ? "最初のページへ" : "Go to first page"} aria-disabled={!canPrevious} onClick={(event) => { event.preventDefault(); setPage(1); }} />
                        </PaginationControlTooltip>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationControlTooltip label={isJa ? "前へ" : "Previous"} disabledLabel={isJa ? "前のページはありません" : "No previous page"} disabled={!canPrevious}>
                            <PaginationPrevious href="#" label={isJa ? "前へ" : "Previous"} aria-label={isJa ? "前のページへ" : "Go to previous page"} aria-disabled={!canPrevious} onClick={(event) => { event.preventDefault(); setPage((current) => Math.max(1, current - 1)); }} />
                        </PaginationControlTooltip>
                    </PaginationItem>
                    {pageItems.map((item) => (
                        item === "ellipsis-start" || item === "ellipsis-end" ? (
                            <PaginationItem key={item}><PaginationEllipsis /></PaginationItem>
                        ) : (
                            <PaginationItem key={item}>
                                <PaginationLink href="#" isActive={item === page} aria-label={isJa ? `${item}ページへ移動` : `Go to page ${item}`} onClick={(event) => { event.preventDefault(); setPage(item); }}>
                                    {item}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    ))}
                    <PaginationItem>
                        <PaginationControlTooltip label={isJa ? "次へ" : "Next"} disabledLabel={isJa ? "次のページはありません" : "No next page"} disabled={!canNext}>
                            <PaginationNext href="#" label={isJa ? "次へ" : "Next"} aria-label={isJa ? "次のページへ" : "Go to next page"} aria-disabled={!canNext} onClick={(event) => { event.preventDefault(); setPage((current) => Math.min(totalPages, current + 1)); }} />
                        </PaginationControlTooltip>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationControlTooltip label={isJa ? "最後のページへ" : "Last page"} disabledLabel={isJa ? "すでに最後のページです" : "Already on the last page"} disabled={!canNext}>
                            <PaginationLast href="#" label={isJa ? "最後" : "Last"} aria-label={isJa ? "最後のページへ" : "Go to last page"} aria-disabled={!canNext} onClick={(event) => { event.preventDefault(); setPage(totalPages); }} />
                        </PaginationControlTooltip>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

function IconOnlyPagination() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [page, setPage] = React.useState(3);
    const totalPages = 12;
    const pageItems = React.useMemo(() => getPageItems(page, totalPages), [page, totalPages]);
    const canPrevious = page > 1;
    const canNext = page < totalPages;

    return (
        <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">
                {isJa ? "現在のページ" : "Current page"} <span className="font-mono">{page}</span> / {totalPages}
            </p>
            <CompactPaginationControls page={page} totalPages={totalPages} onPageChange={setPage} showBoundary ariaLabel={isJa ? "ラベルなしのページ送り" : "Icon-only pagination"} />
            <Pagination className="hidden sm:flex" aria-label={isJa ? "ラベルなしのページ送り" : "Icon-only pagination"}>
                <PaginationContent className="flex-wrap justify-center">
                    <PaginationItem>
                        <PaginationControlTooltip label={isJa ? "最初のページへ" : "First page"} disabledLabel={isJa ? "すでに最初のページです" : "Already on the first page"} disabled={!canPrevious}>
                            <PaginationFirst href="#" label={<span className="sr-only">{isJa ? "最初のページへ" : "First page"}</span>} aria-label={isJa ? "最初のページへ" : "Go to first page"} aria-disabled={!canPrevious} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); setPage(1); }} />
                        </PaginationControlTooltip>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationControlTooltip label={isJa ? "前へ" : "Previous"} disabledLabel={isJa ? "前のページはありません" : "No previous page"} disabled={!canPrevious}>
                            <PaginationPrevious href="#" label={<span className="sr-only">{isJa ? "前へ" : "Previous"}</span>} aria-label={isJa ? "前のページへ" : "Go to previous page"} aria-disabled={!canPrevious} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); setPage((current) => Math.max(1, current - 1)); }} />
                        </PaginationControlTooltip>
                    </PaginationItem>
                    {pageItems.map((item) => (
                        item === "ellipsis-start" || item === "ellipsis-end" ? (
                            <PaginationItem key={item}><PaginationEllipsis /></PaginationItem>
                        ) : (
                            <PaginationItem key={item}>
                                <PaginationLink href="#" isActive={item === page} aria-label={isJa ? `${item}ページへ移動` : `Go to page ${item}`} onClick={(event) => { event.preventDefault(); setPage(item); }}>
                                    {item}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    ))}
                    <PaginationItem>
                        <PaginationControlTooltip label={isJa ? "次へ" : "Next"} disabledLabel={isJa ? "次のページはありません" : "No next page"} disabled={!canNext}>
                            <PaginationNext href="#" label={<span className="sr-only">{isJa ? "次へ" : "Next"}</span>} aria-label={isJa ? "次のページへ" : "Go to next page"} aria-disabled={!canNext} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); setPage((current) => Math.min(totalPages, current + 1)); }} />
                        </PaginationControlTooltip>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationControlTooltip label={isJa ? "最後のページへ" : "Last page"} disabledLabel={isJa ? "すでに最後のページです" : "Already on the last page"} disabled={!canNext}>
                            <PaginationLast href="#" label={<span className="sr-only">{isJa ? "最後のページへ" : "Last page"}</span>} aria-label={isJa ? "最後のページへ" : "Go to last page"} aria-disabled={!canNext} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); setPage(totalPages); }} />
                        </PaginationControlTooltip>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

function TablePaginationPattern() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [page, setPage] = React.useState(3);
    const [pageSize, setPageSize] = React.useState(25);
    const totalRows = 238;
    const pageCount = Math.ceil(totalRows / pageSize);
    const canPrevious = page > 1;
    const canNext = page < pageCount;
    const pageItems = React.useMemo(() => getPageItems(page, pageCount), [page, pageCount]);
    const rowFrom = (page - 1) * pageSize + 1;
    const rowTo = Math.min(page * pageSize, totalRows);
    const formatter = new Intl.NumberFormat(isJa ? "ja-JP" : "en-US");

    React.useEffect(() => {
        setPage((current) => Math.min(current, pageCount));
    }, [pageCount]);

    return (
        <div className="w-full max-w-3xl space-y-4 rounded-md border bg-muted/20 p-3">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <p className="min-w-0 text-sm text-muted-foreground">
                    {isJa
                        ? `${formatter.format(rowFrom)} - ${formatter.format(rowTo)} / 全${formatter.format(totalRows)}件`
                        : `${formatter.format(rowFrom)} - ${formatter.format(rowTo)} / ${formatter.format(totalRows)} rows`}
                </p>
                <label className="flex items-center gap-2 text-sm text-muted-foreground sm:justify-end">
                    <span>{isJa ? "表示件数" : "Rows"}</span>
                    <Select
                        aria-label={isJa ? "表示件数" : "Rows per page"}
                        value={String(pageSize)}
                        onChange={(event) => {
                            setPageSize(Number(event.target.value));
                            setPage(1);
                        }}
                        className="h-8 w-24 rounded-md py-1 text-sm"
                    >
                        {[10, 25, 50].map((option) => (
                            <option key={option} value={option}>
                                {isJa ? `${option}件` : `${option} rows`}
                            </option>
                        ))}
                    </Select>
                </label>
            </div>

            <div className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:hidden">
                <div className="flex items-center gap-1">
                    <PaginationControlTooltip label={isJa ? "最初のページへ" : "First page"} disabledLabel={isJa ? "すでに最初のページです" : "Already on the first page"} disabled={!canPrevious}>
                        <PaginationFirst href="#" label={<span className="sr-only">{isJa ? "最初のページへ" : "First page"}</span>} aria-label={isJa ? "最初のページへ" : "Go to first page"} aria-disabled={!canPrevious} className="h-8 w-8 px-0" onClick={(event) => { event.preventDefault(); setPage(1); }} />
                    </PaginationControlTooltip>
                    <PaginationControlTooltip label={isJa ? "前へ" : "Previous"} disabledLabel={isJa ? "前のページはありません" : "No previous page"} disabled={!canPrevious}>
                        <PaginationPrevious href="#" label={<span className="sr-only">{isJa ? "前へ" : "Previous"}</span>} aria-label={isJa ? "前のページへ" : "Go to previous page"} aria-disabled={!canPrevious} className="h-8 w-8 px-0" onClick={(event) => { event.preventDefault(); setPage((current) => Math.max(1, current - 1)); }} />
                    </PaginationControlTooltip>
                </div>
                <div className="flex min-w-0 items-center justify-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Select aria-label={isJa ? "ページを選択" : "Select page"} value={String(page)} onChange={(event) => setPage(Number(event.target.value))} className="h-8 w-14 rounded-md py-1 text-center text-sm">
                            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                                <option key={pageNumber} value={pageNumber}>
                                    {formatter.format(pageNumber)}
                                </option>
                            ))}
                        </Select>
                        <span aria-hidden="true">/</span>
                        <span aria-hidden="true">{formatter.format(pageCount)}</span>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-1">
                    <PaginationControlTooltip label={isJa ? "次へ" : "Next"} disabledLabel={isJa ? "次のページはありません" : "No next page"} disabled={!canNext}>
                        <PaginationNext href="#" label={<span className="sr-only">{isJa ? "次へ" : "Next"}</span>} aria-label={isJa ? "次のページへ" : "Go to next page"} aria-disabled={!canNext} className="h-8 w-8 px-0" onClick={(event) => { event.preventDefault(); setPage((current) => Math.min(pageCount, current + 1)); }} />
                    </PaginationControlTooltip>
                    <PaginationControlTooltip label={isJa ? "最後のページへ" : "Last page"} disabledLabel={isJa ? "すでに最後のページです" : "Already on the last page"} disabled={!canNext}>
                        <PaginationLast href="#" label={<span className="sr-only">{isJa ? "最後のページへ" : "Last page"}</span>} aria-label={isJa ? "最後のページへ" : "Go to last page"} aria-disabled={!canNext} className="h-8 w-8 px-0" onClick={(event) => { event.preventDefault(); setPage(pageCount); }} />
                    </PaginationControlTooltip>
                </div>
            </div>

            <Pagination className="hidden sm:flex" aria-label={isJa ? "テーブルのページ送り" : "Table pagination"}>
                <PaginationContent className="flex-wrap justify-center">
                    <PaginationItem>
                        <PaginationControlTooltip label={isJa ? "最初のページへ" : "First page"} disabledLabel={isJa ? "すでに最初のページです" : "Already on the first page"} disabled={!canPrevious}>
                            <PaginationFirst href="#" label={isJa ? "最初" : "First"} aria-label={isJa ? "最初のページへ" : "Go to first page"} aria-disabled={!canPrevious} onClick={(event) => { event.preventDefault(); setPage(1); }} />
                        </PaginationControlTooltip>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationControlTooltip label={isJa ? "前へ" : "Previous"} disabledLabel={isJa ? "前のページはありません" : "No previous page"} disabled={!canPrevious}>
                            <PaginationPrevious href="#" label={isJa ? "前へ" : "Previous"} aria-label={isJa ? "前のページへ" : "Go to previous page"} aria-disabled={!canPrevious} onClick={(event) => { event.preventDefault(); setPage((current) => Math.max(1, current - 1)); }} />
                        </PaginationControlTooltip>
                    </PaginationItem>
                    {pageItems.map((item) => (
                        item === "ellipsis-start" || item === "ellipsis-end" ? (
                            <PaginationItem key={item}><PaginationEllipsis /></PaginationItem>
                        ) : (
                            <PaginationItem key={item}>
                                <PaginationLink href="#" isActive={item === page} aria-label={isJa ? `${item}ページへ移動` : `Go to page ${item}`} onClick={(event) => { event.preventDefault(); setPage(item); }}>
                                    {formatter.format(item)}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    ))}
                    <PaginationItem>
                        <PaginationControlTooltip label={isJa ? "次へ" : "Next"} disabledLabel={isJa ? "次のページはありません" : "No next page"} disabled={!canNext}>
                            <PaginationNext href="#" label={isJa ? "次へ" : "Next"} aria-label={isJa ? "次のページへ" : "Go to next page"} aria-disabled={!canNext} onClick={(event) => { event.preventDefault(); setPage((current) => Math.min(pageCount, current + 1)); }} />
                        </PaginationControlTooltip>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationControlTooltip label={isJa ? "最後のページへ" : "Last page"} disabledLabel={isJa ? "すでに最後のページです" : "Already on the last page"} disabled={!canNext}>
                            <PaginationLast href="#" label={isJa ? "最後" : "Last"} aria-label={isJa ? "最後のページへ" : "Go to last page"} aria-disabled={!canNext} onClick={(event) => { event.preventDefault(); setPage(pageCount); }} />
                        </PaginationControlTooltip>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

export default function PaginationDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const compactControlsCode = `function PaginationControlTooltip({ label, disabledLabel, disabled, children }: { label: string; disabledLabel: string; disabled: boolean; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">{children}</span>
      </TooltipTrigger>
      <TooltipContent>{disabled ? disabledLabel : label}</TooltipContent>
    </Tooltip>
  )
}

function CompactPaginationControls({
  page,
  totalPages,
  onPageChange,
  showBoundary = false,
  ariaLabel,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  showBoundary?: boolean
  ariaLabel: string
}) {
  const canPrevious = page > 1
  const canNext = page < totalPages

  return (
    <Pagination className="sm:hidden" aria-label={ariaLabel}>
      <div className="grid w-full max-w-xs grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
        <div className="flex items-center gap-1">
          {showBoundary ? (
            <PaginationControlTooltip label="${isJa ? "最初のページへ" : "First page"}" disabledLabel="${isJa ? "すでに最初のページです" : "Already on the first page"}" disabled={!canPrevious}>
              <PaginationFirst href="#" label={<span className="sr-only">${isJa ? "最初のページへ" : "First page"}</span>} aria-label="${isJa ? "最初のページへ" : "Go to first page"}" aria-disabled={!canPrevious} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); onPageChange(1) }} />
            </PaginationControlTooltip>
          ) : null}
          <PaginationControlTooltip label="${isJa ? "前へ" : "Previous"}" disabledLabel="${isJa ? "前のページはありません" : "No previous page"}" disabled={!canPrevious}>
            <PaginationPrevious href="#" label={<span className="sr-only">${isJa ? "前へ" : "Previous"}</span>} aria-label="${isJa ? "前のページへ" : "Go to previous page"}" aria-disabled={!canPrevious} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); onPageChange(Math.max(1, page - 1)) }} />
          </PaginationControlTooltip>
        </div>
        <label className="flex min-w-0 items-center justify-center gap-1 text-sm text-muted-foreground">
          <span className="sr-only">${isJa ? "ページを選択" : "Select page"}</span>
          <Select aria-label="${isJa ? "ページを選択" : "Select page"}" value={String(page)} onChange={(event) => onPageChange(Number(event.target.value))} className="h-9 w-16 rounded-md py-1 text-center text-sm">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <option key={pageNumber} value={pageNumber}>{pageNumber}</option>
            ))}
          </Select>
          <span aria-hidden="true">/</span>
          <span aria-hidden="true">{totalPages}</span>
        </label>
        <div className="flex items-center justify-end gap-1">
          <PaginationControlTooltip label="${isJa ? "次へ" : "Next"}" disabledLabel="${isJa ? "次のページはありません" : "No next page"}" disabled={!canNext}>
            <PaginationNext href="#" label={<span className="sr-only">${isJa ? "次へ" : "Next"}</span>} aria-label="${isJa ? "次のページへ" : "Go to next page"}" aria-disabled={!canNext} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); onPageChange(Math.min(totalPages, page + 1)) }} />
          </PaginationControlTooltip>
          {showBoundary ? (
            <PaginationControlTooltip label="${isJa ? "最後のページへ" : "Last page"}" disabledLabel="${isJa ? "すでに最後のページです" : "Already on the last page"}" disabled={!canNext}>
              <PaginationLast href="#" label={<span className="sr-only">${isJa ? "最後のページへ" : "Last page"}</span>} aria-label="${isJa ? "最後のページへ" : "Go to last page"}" aria-disabled={!canNext} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); onPageChange(totalPages) }} />
            </PaginationControlTooltip>
          ) : null}
        </div>
      </div>
    </Pagination>
  )
}`;
    const code = `import * as React from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious, Select, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui"

function getPageItems(currentPage: number, pageCount: number): Array<number | "ellipsis-start" | "ellipsis-end"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1)
  if (currentPage <= 4) return [1, 2, 3, 4, 5, "ellipsis-end", pageCount]
  if (currentPage >= pageCount - 3) return [1, "ellipsis-start", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
  return [1, "ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end", pageCount]
}

${compactControlsCode}

export function PaginationExample() {
  const [page, setPage] = React.useState(2)
  const totalPages = 10
  const pages = React.useMemo(() => getPageItems(page, totalPages), [page, totalPages])

  return (
    <>
      <CompactPaginationControls page={page} totalPages={totalPages} onPageChange={setPage} ariaLabel="${isJa ? "ページ送り" : "Pagination"}" />
      <Pagination className="hidden sm:flex" aria-label="${isJa ? "ページ送り" : "Pagination"}">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" label="${isJa ? "前へ" : "Previous"}" aria-label="${isJa ? "前のページへ" : "Go to previous page"}" onClick={(event) => { event.preventDefault(); setPage((current) => Math.max(1, current - 1)) }} />
          </PaginationItem>
          {pages.map((entry) => entry === "ellipsis-start" || entry === "ellipsis-end" ? (
            <PaginationItem key={entry}><PaginationEllipsis /></PaginationItem>
          ) : (
            <PaginationItem key={entry}>
              <PaginationLink href="#" isActive={entry === page} aria-label={\`${isJa ? "${entry}ページへ移動" : "Go to page ${entry}"}\`} onClick={(event) => { event.preventDefault(); setPage(entry) }}>
                {entry}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" label="${isJa ? "次へ" : "Next"}" aria-label="${isJa ? "次のページへ" : "Go to next page"}" onClick={(event) => { event.preventDefault(); setPage((current) => Math.min(totalPages, current + 1)) }} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}`;
    const controlledCode = `import * as React from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious, Select, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui"

const TOTAL = 50

function getPageItems(currentPage: number, pageCount: number): Array<number | "ellipsis-start" | "ellipsis-end"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1)
  if (currentPage <= 4) return [1, 2, 3, 4, 5, "ellipsis-end", pageCount]
  if (currentPage >= pageCount - 3) return [1, "ellipsis-start", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
  return [1, "ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end", pageCount]
}

${compactControlsCode}

export function ControlledPagination() {
  const [page, setPage] = React.useState(7)
  const visible = React.useMemo(() => getPageItems(page, TOTAL), [page])

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-muted-foreground">${isJa ? "現在のページ" : "Current page"} <span className="font-mono">{page}</span> / {TOTAL}</p>
      <CompactPaginationControls page={page} totalPages={TOTAL} onPageChange={setPage} ariaLabel="${isJa ? "ページ番号で移動" : "Numbered pagination"}" />
      <Pagination className="hidden sm:flex" aria-label="${isJa ? "ページ番号で移動" : "Numbered pagination"}">
        <PaginationContent className="flex-wrap justify-center">
          <PaginationItem><PaginationPrevious href="#" label="${isJa ? "前へ" : "Previous"}" aria-label="${isJa ? "前のページへ" : "Go to previous page"}" onClick={(event) => { event.preventDefault(); setPage((current) => Math.max(1, current - 1)) }} /></PaginationItem>
          {visible.map((entry, index) => entry === "ellipsis-start" || entry === "ellipsis-end" ? (
            <PaginationItem key={\`ellipsis-\${index}\`}><PaginationEllipsis /></PaginationItem>
          ) : (
            <PaginationItem key={entry}>
              <PaginationLink href="#" isActive={entry === page} aria-label={\`${isJa ? "${entry}ページへ移動" : "Go to page ${entry}"}\`} onClick={(event) => { event.preventDefault(); setPage(entry) }}>
                {entry}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem><PaginationNext href="#" label="${isJa ? "次へ" : "Next"}" aria-label="${isJa ? "次のページへ" : "Go to next page"}" onClick={(event) => { event.preventDefault(); setPage((current) => Math.min(TOTAL, current + 1)) }} /></PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}`;
    const boundaryCode = `import * as React from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious, Select, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui"

function getPageItems(currentPage: number, pageCount: number): Array<number | "ellipsis-start" | "ellipsis-end"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1)
  if (currentPage <= 4) return [1, 2, 3, 4, 5, "ellipsis-end", pageCount]
  if (currentPage >= pageCount - 3) return [1, "ellipsis-start", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
  return [1, "ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end", pageCount]
}

${compactControlsCode}

export function BoundaryPagination() {
  const [page, setPage] = React.useState(6)
  const totalPages = 24
  const pageItems = React.useMemo(() => getPageItems(page, totalPages), [page, totalPages])
  const canPrevious = page > 1
  const canNext = page < totalPages

  return (
    <>
      <CompactPaginationControls page={page} totalPages={totalPages} onPageChange={setPage} showBoundary ariaLabel="${isJa ? "先頭と末尾を含むページ送り" : "Pagination with first and last controls"}" />
      <Pagination className="hidden sm:flex" aria-label="${isJa ? "先頭と末尾を含むページ送り" : "Pagination with first and last controls"}">
        <PaginationContent className="flex-wrap justify-center">
          <PaginationItem>
            <PaginationControlTooltip label="${isJa ? "最初のページへ" : "First page"}" disabledLabel="${isJa ? "すでに最初のページです" : "Already on the first page"}" disabled={!canPrevious}>
              <PaginationFirst href="#" label="${isJa ? "最初" : "First"}" aria-label="${isJa ? "最初のページへ" : "Go to first page"}" aria-disabled={!canPrevious} onClick={(event) => { event.preventDefault(); setPage(1) }} />
            </PaginationControlTooltip>
          </PaginationItem>
          <PaginationItem>
            <PaginationControlTooltip label="${isJa ? "前へ" : "Previous"}" disabledLabel="${isJa ? "前のページはありません" : "No previous page"}" disabled={!canPrevious}>
              <PaginationPrevious href="#" label="${isJa ? "前へ" : "Previous"}" aria-label="${isJa ? "前のページへ" : "Go to previous page"}" aria-disabled={!canPrevious} onClick={(event) => { event.preventDefault(); setPage((current) => Math.max(1, current - 1)) }} />
            </PaginationControlTooltip>
          </PaginationItem>
          {pageItems.map((item) => item === "ellipsis-start" || item === "ellipsis-end" ? (
            <PaginationItem key={item}><PaginationEllipsis /></PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink href="#" isActive={item === page} onClick={(event) => { event.preventDefault(); setPage(item) }}>{item}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationControlTooltip label="${isJa ? "次へ" : "Next"}" disabledLabel="${isJa ? "次のページはありません" : "No next page"}" disabled={!canNext}>
              <PaginationNext href="#" label="${isJa ? "次へ" : "Next"}" aria-label="${isJa ? "次のページへ" : "Go to next page"}" aria-disabled={!canNext} onClick={(event) => { event.preventDefault(); setPage((current) => Math.min(totalPages, current + 1)) }} />
            </PaginationControlTooltip>
          </PaginationItem>
          <PaginationItem>
            <PaginationControlTooltip label="${isJa ? "最後のページへ" : "Last page"}" disabledLabel="${isJa ? "すでに最後のページです" : "Already on the last page"}" disabled={!canNext}>
              <PaginationLast href="#" label="${isJa ? "最後" : "Last"}" aria-label="${isJa ? "最後のページへ" : "Go to last page"}" aria-disabled={!canNext} onClick={(event) => { event.preventDefault(); setPage(totalPages) }} />
            </PaginationControlTooltip>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}`;
    const iconOnlyCode = `import * as React from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious, Select, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui"

function getPageItems(currentPage: number, pageCount: number): Array<number | "ellipsis-start" | "ellipsis-end"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1)
  if (currentPage <= 4) return [1, 2, 3, 4, 5, "ellipsis-end", pageCount]
  if (currentPage >= pageCount - 3) return [1, "ellipsis-start", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
  return [1, "ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end", pageCount]
}

${compactControlsCode}

export function IconOnlyPagination() {
  const [page, setPage] = React.useState(3)
  const totalPages = 12
  const pageItems = React.useMemo(() => getPageItems(page, totalPages), [page, totalPages])
  const canPrevious = page > 1
  const canNext = page < totalPages

  return (
    <>
      <CompactPaginationControls page={page} totalPages={totalPages} onPageChange={setPage} showBoundary ariaLabel="${isJa ? "ラベルなしのページ送り" : "Icon-only pagination"}" />
      <Pagination className="hidden sm:flex" aria-label="${isJa ? "ラベルなしのページ送り" : "Icon-only pagination"}">
        <PaginationContent className="flex-wrap justify-center">
          <PaginationItem>
            <PaginationControlTooltip label="${isJa ? "最初のページへ" : "First page"}" disabledLabel="${isJa ? "すでに最初のページです" : "Already on the first page"}" disabled={!canPrevious}>
              <PaginationFirst href="#" label={<span className="sr-only">${isJa ? "最初のページへ" : "First page"}</span>} aria-label="${isJa ? "最初のページへ" : "Go to first page"}" aria-disabled={!canPrevious} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); setPage(1) }} />
            </PaginationControlTooltip>
          </PaginationItem>
          <PaginationItem>
            <PaginationControlTooltip label="${isJa ? "前へ" : "Previous"}" disabledLabel="${isJa ? "前のページはありません" : "No previous page"}" disabled={!canPrevious}>
              <PaginationPrevious href="#" label={<span className="sr-only">${isJa ? "前へ" : "Previous"}</span>} aria-label="${isJa ? "前のページへ" : "Go to previous page"}" aria-disabled={!canPrevious} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); setPage((current) => Math.max(1, current - 1)) }} />
            </PaginationControlTooltip>
          </PaginationItem>
          {pageItems.map((item) => item === "ellipsis-start" || item === "ellipsis-end" ? (
            <PaginationItem key={item}><PaginationEllipsis /></PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink href="#" isActive={item === page} onClick={(event) => { event.preventDefault(); setPage(item) }}>{item}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationControlTooltip label="${isJa ? "次へ" : "Next"}" disabledLabel="${isJa ? "次のページはありません" : "No next page"}" disabled={!canNext}>
              <PaginationNext href="#" label={<span className="sr-only">${isJa ? "次へ" : "Next"}</span>} aria-label="${isJa ? "次のページへ" : "Go to next page"}" aria-disabled={!canNext} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); setPage((current) => Math.min(totalPages, current + 1)) }} />
            </PaginationControlTooltip>
          </PaginationItem>
          <PaginationItem>
            <PaginationControlTooltip label="${isJa ? "最後のページへ" : "Last page"}" disabledLabel="${isJa ? "すでに最後のページです" : "Already on the last page"}" disabled={!canNext}>
              <PaginationLast href="#" label={<span className="sr-only">${isJa ? "最後のページへ" : "Last page"}</span>} aria-label="${isJa ? "最後のページへ" : "Go to last page"}" aria-disabled={!canNext} className="h-9 w-9 gap-0 px-0" onClick={(event) => { event.preventDefault(); setPage(totalPages) }} />
            </PaginationControlTooltip>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}`;
    const tableCode = `import * as React from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious, Select, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui"

function getPageItems(currentPage: number, pageCount: number): Array<number | "ellipsis-start" | "ellipsis-end"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1)
  if (currentPage <= 4) return [1, 2, 3, 4, 5, "ellipsis-end", pageCount]
  if (currentPage >= pageCount - 3) return [1, "ellipsis-start", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
  return [1, "ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end", pageCount]
}

function PaginationControlTooltip({ label, disabledLabel, disabled, children }: { label: string; disabledLabel: string; disabled: boolean; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">{children}</span>
      </TooltipTrigger>
      <TooltipContent>{disabled ? disabledLabel : label}</TooltipContent>
    </Tooltip>
  )
}

export function TablePagination() {
  const [page, setPage] = React.useState(3)
  const [pageSize, setPageSize] = React.useState(25)
  const totalRows = 238
  const pageCount = Math.ceil(totalRows / pageSize)
  const canPrevious = page > 1
  const canNext = page < pageCount
  const pageItems = React.useMemo(() => getPageItems(page, pageCount), [page, pageCount])
  const rowFrom = (page - 1) * pageSize + 1
  const rowTo = Math.min(page * pageSize, totalRows)

  React.useEffect(() => {
    setPage((current) => Math.min(current, pageCount))
  }, [pageCount])

  return (
    <div className="space-y-4 rounded-md border bg-muted/20 p-3">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="text-sm text-muted-foreground">{\`${isJa ? "${rowFrom} - ${rowTo} / 全${totalRows}件" : "${rowFrom} - ${rowTo} / ${totalRows} rows"}\`}</p>
        <label className="flex items-center gap-2 text-sm text-muted-foreground sm:justify-end">
          <span>${isJa ? "表示件数" : "Rows"}</span>
          <Select value={String(pageSize)} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1) }} className="h-8 w-24 rounded-md py-1 text-sm">
            {[10, 25, 50].map((option) => <option key={option} value={option}>{option}${isJa ? "件" : " rows"}</option>)}
          </Select>
        </label>
      </div>

      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:hidden">
        <div className="flex items-center gap-1">
          <PaginationControlTooltip label="${isJa ? "最初のページへ" : "First page"}" disabledLabel="${isJa ? "すでに最初のページです" : "Already on the first page"}" disabled={!canPrevious}>
            <PaginationFirst href="#" label={<span className="sr-only">${isJa ? "最初のページへ" : "First page"}</span>} aria-label="${isJa ? "最初のページへ" : "Go to first page"}" aria-disabled={!canPrevious} className="h-8 w-8 px-0" onClick={(event) => { event.preventDefault(); setPage(1) }} />
          </PaginationControlTooltip>
          <PaginationControlTooltip label="${isJa ? "前へ" : "Previous"}" disabledLabel="${isJa ? "前のページはありません" : "No previous page"}" disabled={!canPrevious}>
            <PaginationPrevious href="#" label={<span className="sr-only">${isJa ? "前へ" : "Previous"}</span>} aria-label="${isJa ? "前のページへ" : "Go to previous page"}" aria-disabled={!canPrevious} className="h-8 w-8 px-0" onClick={(event) => { event.preventDefault(); setPage((current) => Math.max(1, current - 1)) }} />
          </PaginationControlTooltip>
        </div>
        <div className="flex min-w-0 items-center justify-center">
          <Select value={String(page)} onChange={(event) => setPage(Number(event.target.value))} aria-label="${isJa ? "ページを選択" : "Select page"}" className="h-8 w-14 rounded-md py-1 text-center text-sm">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <option key={pageNumber} value={pageNumber}>{pageNumber}</option>
            ))}
          </Select>
          <span className="ml-1 text-sm text-muted-foreground">/ {pageCount}</span>
        </div>
        <div className="flex items-center justify-end gap-1">
          <PaginationControlTooltip label="${isJa ? "次へ" : "Next"}" disabledLabel="${isJa ? "次のページはありません" : "No next page"}" disabled={!canNext}>
            <PaginationNext href="#" label={<span className="sr-only">${isJa ? "次へ" : "Next"}</span>} aria-label="${isJa ? "次のページへ" : "Go to next page"}" aria-disabled={!canNext} className="h-8 w-8 px-0" onClick={(event) => { event.preventDefault(); setPage((current) => Math.min(pageCount, current + 1)) }} />
          </PaginationControlTooltip>
          <PaginationControlTooltip label="${isJa ? "最後のページへ" : "Last page"}" disabledLabel="${isJa ? "すでに最後のページです" : "Already on the last page"}" disabled={!canNext}>
            <PaginationLast href="#" label={<span className="sr-only">${isJa ? "最後のページへ" : "Last page"}</span>} aria-label="${isJa ? "最後のページへ" : "Go to last page"}" aria-disabled={!canNext} className="h-8 w-8 px-0" onClick={(event) => { event.preventDefault(); setPage(pageCount) }} />
          </PaginationControlTooltip>
        </div>
      </div>

      <Pagination className="hidden sm:flex" aria-label="${isJa ? "テーブルのページ送り" : "Table pagination"}">
        <PaginationContent className="flex-wrap justify-center">
          <PaginationItem>
            <PaginationControlTooltip label="${isJa ? "最初のページへ" : "First page"}" disabledLabel="${isJa ? "すでに最初のページです" : "Already on the first page"}" disabled={!canPrevious}>
              <PaginationFirst href="#" label="${isJa ? "最初" : "First"}" aria-label="${isJa ? "最初のページへ" : "Go to first page"}" aria-disabled={!canPrevious} onClick={(event) => { event.preventDefault(); setPage(1) }} />
            </PaginationControlTooltip>
          </PaginationItem>
          <PaginationItem>
            <PaginationControlTooltip label="${isJa ? "前へ" : "Previous"}" disabledLabel="${isJa ? "前のページはありません" : "No previous page"}" disabled={!canPrevious}>
              <PaginationPrevious href="#" label="${isJa ? "前へ" : "Previous"}" aria-label="${isJa ? "前のページへ" : "Go to previous page"}" aria-disabled={!canPrevious} onClick={(event) => { event.preventDefault(); setPage((current) => Math.max(1, current - 1)) }} />
            </PaginationControlTooltip>
          </PaginationItem>
          {pageItems.map((item) => item === "ellipsis-start" || item === "ellipsis-end" ? (
            <PaginationItem key={item}><PaginationEllipsis /></PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink href="#" isActive={item === page} onClick={(event) => { event.preventDefault(); setPage(item) }}>{item}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationControlTooltip label="${isJa ? "次へ" : "Next"}" disabledLabel="${isJa ? "次のページはありません" : "No next page"}" disabled={!canNext}>
              <PaginationNext href="#" label="${isJa ? "次へ" : "Next"}" aria-label="${isJa ? "次のページへ" : "Go to next page"}" aria-disabled={!canNext} onClick={(event) => { event.preventDefault(); setPage((current) => Math.min(pageCount, current + 1)) }} />
            </PaginationControlTooltip>
          </PaginationItem>
          <PaginationItem>
            <PaginationControlTooltip label="${isJa ? "最後のページへ" : "Last page"}" disabledLabel="${isJa ? "すでに最後のページです" : "Already on the last page"}" disabled={!canNext}>
              <PaginationLast href="#" label="${isJa ? "最後" : "Last"}" aria-label="${isJa ? "最後のページへ" : "Go to last page"}" aria-disabled={!canNext} onClick={(event) => { event.preventDefault(); setPage(pageCount) }} />
            </PaginationControlTooltip>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}`;

    return (
        <ComponentLayout
            title={navigationMetadata.pagination.title}
            description={navigationMetadata.pagination.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Pagination", href: "/docs/components/pagination" },
                { name: "Select", href: "/docs/components/select" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "DataTable", href: "/docs/components/data-table" },
                { name: "Table", href: "/docs/components/table" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="lg" previewHeight="auto">
                <PaginationExample />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {isJa ? "状態とバリエーション" : "States and variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "controlled",
                            title: isJa ? "状態管理あり" : "Controlled",
                            description: isJa ? "現在ページをアプリ側の state で管理し、必要なページ番号だけを表示します。" : "Drive the current page from app state and render only the useful page numbers.",
                            preview: <ControlledPagination />,
                            previewBodyWidth: "lg",
                            previewHeight: "auto",
                            code: controlledCode,
                        },
                        {
                            key: "first-last",
                            title: isJa ? "先頭と末尾へ移動" : "First and last controls",
                            description: isJa ? "ページ数が多い一覧では、前後移動に加えて先頭と末尾へ直接移動する操作を追加できます。" : "For long lists, add direct first and last controls alongside previous and next.",
                            preview: <BoundaryPagination />,
                            previewBodyWidth: "xl",
                            previewHeight: "auto",
                            code: boundaryCode,
                        },
                        {
                            key: "icon-only",
                            title: isJa ? "ラベルなし操作" : "Icon-only controls",
                            description: isJa ? "スペースが限られる場所では、最初・前へ・次へ・最後のラベルを視覚的に隠し、ツールチップと aria-label で意味を補います。" : "When space is limited, hide the first, previous, next, and last labels visually while preserving tooltips and aria-labels.",
                            preview: <IconOnlyPagination />,
                            previewBodyWidth: "lg",
                            previewHeight: "auto",
                            code: iconOnlyCode,
                        },
                        {
                            key: "table-pagination",
                            title: isJa ? "テーブル向け" : "Table pagination",
                            description: isJa ? "DataTable と同じ考え方で、件数サマリー、表示件数、先頭/末尾、スマホ用ページ選択を組み合わせます。" : "Combines a row summary, page size, first/last controls, and a compact mobile selector like DataTable.",
                            preview: <TablePaginationPattern />,
                            previewBodyWidth: "xl",
                            previewHeight: "auto",
                            code: tableCode,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <PropsTable
                    data={[
                        { name: "Pagination", type: "nav", description: isJa ? "ページ送り全体のランドマーク。" : "Navigation landmark for pagination." },
                        { name: "PaginationLink.isActive", type: "boolean", description: isJa ? "現在ページを示します。" : "Marks the current page." },
                        { name: "PaginationFirst / PaginationLast", type: "a", description: isJa ? "必要な場合に先頭ページ、末尾ページへ移動するリンク。長い一覧やテーブルではオプションとして組み合わせます。" : "Optional links for moving to the first or last page, useful for long lists and tables." },
                        { name: "PaginationPrevious / PaginationNext", type: "a", description: isJa ? "前後ページへ移動するリンク。label で表示文言を差し替えられます。" : "Links for previous and next page navigation. Use label to override the visible text." },
                        { name: "PaginationEllipsis", type: "span", description: isJa ? "省略されたページ範囲を示します。" : "Indicates a skipped page range." },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">{sectionLabels.usage}</h2>
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </div>
        </ComponentLayout>
    );
}
