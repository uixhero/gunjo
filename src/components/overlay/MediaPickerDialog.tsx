"use client"

import * as React from "react"
import { IconSearch as Search } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import { AssetGrid } from "../display/AssetGrid"
import { AssetCard } from "../display/AssetCard"
import type { AssetCardAsset } from "../display/AssetCard"
import { Button } from "../inputs/Button"
import { Input } from "../inputs/Input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./Dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip"
import { mediaPickerDialogDefaultVariantKey } from "./generated/default-variant-keys"
import type { MediaPickerDialogVariantKey } from "./generated/variant-keys"
import { useLocale } from "../utility/LocaleProvider"

export interface MediaPickerDialogLabels {
    title?: React.ReactNode
    description?: React.ReactNode
    searchPlaceholder?: string
    cancel?: React.ReactNode
    confirm?: React.ReactNode | ((selectedCount: number) => React.ReactNode)
    confirmDisabledReason?: React.ReactNode
    emptyTitle?: React.ReactNode
    emptyDescription?: React.ReactNode
    close?: string
}

export interface MediaPickerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    items: AssetCardAsset[]
    portalContainer?: HTMLElement | null
    variant?: MediaPickerDialogVariantKey
    selectedIds?: string[]
    multiSelect?: boolean
    labels?: MediaPickerDialogLabels
    onConfirm: (items: AssetCardAsset[]) => void
}

const variantClasses: Record<MediaPickerDialogVariantKey, { content: string; grid: string }> = {
    default: {
        content: "max-w-5xl",
        grid: "",
    },
    compact: {
        content: "max-w-3xl",
        grid: "",
    },
}

const MediaPickerDialog = React.forwardRef<HTMLDivElement, MediaPickerDialogProps>(
    (
        {
            open,
            onOpenChange,
            items,
            portalContainer,
            variant = mediaPickerDialogDefaultVariantKey,
            selectedIds,
            multiSelect,
            labels,
            onConfirm,
        },
        ref
    ) => {
        const { strings } = useLocale()
        const [query, setQuery] = React.useState("")
        const [internalSelectedIds, setInternalSelectedIds] = React.useState<string[]>(selectedIds ?? [])
        const classes = variantClasses[variant]

        React.useEffect(() => {
            if (open) setInternalSelectedIds(selectedIds ?? [])
        }, [open, selectedIds])

        const selectedSet = React.useMemo(() => new Set(internalSelectedIds), [internalSelectedIds])
        const filteredItems = React.useMemo(() => {
            const normalized = query.trim().toLowerCase()
            if (!normalized) return items
            return items.filter((item) => item.title.toLowerCase().includes(normalized) || item.type?.toLowerCase().includes(normalized))
        }, [items, query])

        const handleSelect = (asset: AssetCardAsset) => {
            if (!multiSelect) {
                setInternalSelectedIds([asset.id])
                onConfirm([asset])
                onOpenChange(false)
                return
            }
            setInternalSelectedIds((current) =>
                current.includes(asset.id)
                    ? current.filter((id) => id !== asset.id)
                    : [...current, asset.id]
            )
        }

        const handleConfirm = () => {
            onConfirm(items.filter((item) => selectedSet.has(item.id)))
            onOpenChange(false)
        }
        const confirmLabel =
            typeof labels?.confirm === "function"
                ? labels.confirm(internalSelectedIds.length)
                : labels?.confirm ?? `${internalSelectedIds.length} selected`
        const confirmDisabledReason = labels?.confirmDisabledReason ?? "Select at least one asset before confirming."

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    ref={ref}
                    portalContainer={portalContainer}
                    closeLabel={labels?.close}
                    className={cn(
                        "grid h-[calc(100%-2rem)] max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0",
                        classes.content
                    )}
                >
                    <DialogHeader className="border-b p-6 pb-4">
                        <DialogTitle>{labels?.title ?? "Choose media"}</DialogTitle>
                        <DialogDescription>
                            {labels?.description ?? "Select assets from the library."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className={cn("grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden p-6", !multiSelect && "pb-8")}>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                            <Input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder={labels?.searchPlaceholder ?? strings.searchAssetsPlaceholder}
                                className="w-full pl-9"
                            />
                        </div>
                        <div className="min-h-0 overflow-y-auto pb-4 pr-1">
                            <AssetGrid
                                items={filteredItems}
                                selectedIds={internalSelectedIds}
                                selectionMode={multiSelect ? "multiple" : "single"}
                                onSelect={handleSelect}
                                emptyTitle={labels?.emptyTitle ?? "No assets"}
                                emptyDescription={labels?.emptyDescription ?? "Try a different search query."}
                                minColumnWidth={150}
                                className={classes.grid}
                                renderItem={(asset, state) => (
                                    <AssetCard
                                        asset={asset}
                                        selected={state.selected}
                                        variant={variant === "compact" ? "compact" : "default"}
                                        selectionMode={multiSelect ? "multiple" : "single"}
                                        imageFit="contain"
                                        portalContainer={portalContainer}
                                        onSelect={handleSelect}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {multiSelect ? (
                        <DialogFooter className="border-t p-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                {labels?.cancel ?? "Cancel"}
                            </Button>
                            {internalSelectedIds.length === 0 ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="inline-flex">
                                            <Button type="button" disabled>
                                                {confirmLabel}
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent portalContainer={portalContainer}>
                                        {confirmDisabledReason}
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <Button type="button" onClick={handleConfirm}>
                                    {confirmLabel}
                                </Button>
                            )}
                        </DialogFooter>
                    ) : null}
                </DialogContent>
            </Dialog>
        )
    }
)
MediaPickerDialog.displayName = "MediaPickerDialog"

export { MediaPickerDialog }
