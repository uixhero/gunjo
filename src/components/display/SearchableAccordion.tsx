"use client"

import * as React from "react"
import { IconSearch as Search } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import { SearchInput } from "../inputs/SearchInput"
import { Tabs, TabsList, TabsTrigger } from "../navigation/Tabs"
import { AccordionContent, AccordionItem, AccordionTrigger } from "./Accordion"
import { AccordionGroup } from "./AccordionGroup"
import { Badge } from "./Badge"
import { EmptyState } from "./EmptyState"
import { Icon } from "./Icon"
import { searchableAccordionDefaultVariantKey } from "./generated/default-variant-keys"
import type { SearchableAccordionVariantKey } from "./generated/variant-keys"
import { useLocale } from "../utility/LocaleProvider"

export type SearchableAccordionItem = {
    id: string
    title: React.ReactNode
    body: React.ReactNode
    category?: string
    keywords?: string[]
    searchText?: string
}

export type SearchableAccordionCategory = {
    id: string
    label: React.ReactNode
}

export type SearchableAccordionLabels = {
    searchPlaceholder?: string
    clearSearchLabel?: string
    allCategoryLabel?: React.ReactNode
    resultCountLabel?: (visibleCount: number, totalCount: number) => React.ReactNode
    clearFiltersLabel?: React.ReactNode
    emptyTitle?: React.ReactNode
    emptyDescription?: React.ReactNode
    expandLabel?: string
    collapseLabel?: string
    controlsLabel?: string
}

export interface SearchableAccordionProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    items: SearchableAccordionItem[]
    variant?: SearchableAccordionVariantKey
    searchValue?: string
    defaultSearchValue?: string
    onSearchValueChange?: (value: string) => void
    categoryValue?: string
    defaultCategoryValue?: string
    onCategoryValueChange?: (value: string) => void
    openValue?: string[]
    defaultOpenValue?: string[]
    onOpenValueChange?: (value: string[]) => void
    categories?: SearchableAccordionCategory[]
    showCategoryTabs?: boolean
    label?: React.ReactNode
    description?: React.ReactNode
    labels?: SearchableAccordionLabels
    emptyState?: React.ReactNode
}

const searchableAccordionVariantClasses: Record<SearchableAccordionVariantKey, string> = {
    default: "space-y-4 p-0",
    withCategories: "space-y-4 p-0",
    empty: "space-y-4 p-0",
}

function normalizeNode(value: React.ReactNode) {
    return typeof value === "string" || typeof value === "number" ? String(value) : ""
}

function includesQuery(item: SearchableAccordionItem, query: string) {
    if (!query) return true
    const haystack = [
        normalizeNode(item.title),
        normalizeNode(item.body),
        item.category,
        item.searchText,
        ...(item.keywords ?? []),
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

    return haystack.includes(query.toLowerCase())
}

function deriveCategories(items: SearchableAccordionItem[]) {
    const ids = Array.from(new Set(items.map((item) => item.category).filter(Boolean))) as string[]
    return ids.map((id) => ({ id, label: id }))
}

const SearchableAccordion = React.forwardRef<HTMLDivElement, SearchableAccordionProps>(
    (
        {
            className,
            items,
            variant = searchableAccordionDefaultVariantKey,
            searchValue,
            defaultSearchValue = "",
            onSearchValueChange,
            categoryValue,
            defaultCategoryValue = "all",
            onCategoryValueChange,
            openValue,
            defaultOpenValue = [],
            onOpenValueChange,
            categories: categoriesProp,
            showCategoryTabs = true,
            label,
            description,
            labels,
            emptyState,
            ...props
        },
        ref
    ) => {
        const [internalSearchValue, setInternalSearchValue] = React.useState(defaultSearchValue)
        const [internalCategoryValue, setInternalCategoryValue] = React.useState(defaultCategoryValue)
        const resolvedSearchValue = searchValue ?? internalSearchValue
        const resolvedCategoryValue = categoryValue ?? internalCategoryValue
        const allCategoryId = "all"
        const categories = React.useMemo(
            () => categoriesProp ?? deriveCategories(items),
            [categoriesProp, items]
        )

        const setSearchValue = React.useCallback(
            (nextValue: string) => {
                if (searchValue === undefined) {
                    setInternalSearchValue(nextValue)
                }
                onSearchValueChange?.(nextValue)
            },
            [onSearchValueChange, searchValue]
        )

        const setCategoryValue = React.useCallback(
            (nextValue: string) => {
                if (categoryValue === undefined) {
                    setInternalCategoryValue(nextValue)
                }
                onCategoryValueChange?.(nextValue)
            },
            [categoryValue, onCategoryValueChange]
        )

        const filteredItems = React.useMemo(
            () =>
                items.filter((item) => {
                    const categoryMatches =
                        resolvedCategoryValue === allCategoryId ||
                        item.category === resolvedCategoryValue
                    return categoryMatches && includesQuery(item, resolvedSearchValue.trim())
                }),
            [items, resolvedCategoryValue, resolvedSearchValue]
        )

        const { strings } = useLocale()
        const visibleIds = React.useMemo(
            () => filteredItems.map((item) => item.id),
            [filteredItems]
        )

        const showTabs = showCategoryTabs && categories.length > 0
        const hasActiveFilter =
            resolvedSearchValue.trim().length > 0 || resolvedCategoryValue !== allCategoryId

        const clearFilters = React.useCallback(() => {
            setSearchValue("")
            setCategoryValue(allCategoryId)
        }, [setCategoryValue, setSearchValue])

        return (
            <div
                ref={ref}
                className={cn(searchableAccordionVariantClasses[variant], className)}
                data-slot="searchable-accordion"
                {...props}
            >
                {label || description ? (
                    <div className="space-y-1">
                        {label ? <div className="text-sm font-medium text-foreground">{label}</div> : null}
                        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
                    </div>
                ) : null}

                <div className="space-y-3">
                    <SearchInput
                        value={resolvedSearchValue}
                        onValueChange={setSearchValue}
                        placeholder={labels?.searchPlaceholder ?? strings.searchItemsPlaceholder}
                        clearLabel={labels?.clearSearchLabel ?? "Clear search"}
                    />
                    {showTabs ? (
                        <Tabs
                            value={resolvedCategoryValue}
                            onValueChange={setCategoryValue}
                            className="w-full border-0"
                        >
                            <TabsList className="min-h-0 w-full justify-start overflow-x-auto overflow-y-hidden p-1">
                                <TabsTrigger value={allCategoryId} className="h-8 px-3">
                                    {labels?.allCategoryLabel ?? "All"}
                                </TabsTrigger>
                                {categories.map((category) => (
                                    <TabsTrigger key={category.id} value={category.id} className="h-8 px-3">
                                        {category.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    ) : null}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                    <span>
                        {labels?.resultCountLabel
                            ? labels.resultCountLabel(filteredItems.length, items.length)
                            : `${filteredItems.length} / ${items.length}`}
                    </span>
                    <Badge variant={filteredItems.length > 0 ? "secondary" : "outline"}>
                        {resolvedCategoryValue === allCategoryId
                            ? labels?.allCategoryLabel ?? "All"
                            : categories.find((category) => category.id === resolvedCategoryValue)?.label ?? resolvedCategoryValue}
                    </Badge>
                </div>

                {filteredItems.length > 0 ? (
                    <AccordionGroup
                        values={visibleIds}
                        value={openValue}
                        defaultValue={defaultOpenValue}
                        onValueChange={onOpenValueChange}
                        expandLabel={labels?.expandLabel ?? "Open visible items"}
                        collapseLabel={labels?.collapseLabel ?? "Close visible items"}
                        controlsLabel={labels?.controlsLabel ?? "Searchable accordion controls"}
                    >
                        {filteredItems.map((item) => (
                            <AccordionItem key={item.id} value={item.id}>
                                <AccordionTrigger>{item.title}</AccordionTrigger>
                                <AccordionContent>{item.body}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </AccordionGroup>
                ) : (
                    emptyState ?? (
                        <EmptyState
                            icon={<Icon icon={Search} size="md" decorative />}
                            title={labels?.emptyTitle ?? "No matching items"}
                            description={labels?.emptyDescription ?? "Change the search term or category."}
                            action={
                                hasActiveFilter ? (
                                    <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
                                        {labels?.clearFiltersLabel ?? "Clear filters"}
                                    </Button>
                                ) : null
                            }
                        />
                    )
                )}
            </div>
        )
    }
)
SearchableAccordion.displayName = "SearchableAccordion"

export { SearchableAccordion }
