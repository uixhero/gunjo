"use client"

import * as React from "react"
import { IconArchive as Archive, IconDownload as Download, IconWorld as Globe2, IconHeart as Heart, IconPhoto as ImageIcon, IconSparkles as Sparkles, IconStar as Star, IconTrash as Trash2, IconX as X } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import { EditableField } from "../inputs/EditableField"
import { Slider } from "../inputs/Slider"
import { TooltipButton } from "../inputs/TooltipButton"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import { MetadataList, type MetadataListItem } from "../display/MetadataList"
import { TagEditor } from "../display/TagEditor"
import type { AssetCardAsset } from "../display/AssetCard"
import {
    InspectorField,
    InspectorPanel,
    InspectorSection,
    type InspectorPanelProps,
} from "./InspectorPanel"
import { assetInspectorPanelDefaultVariantKey } from "./generated/default-variant-keys"
import type { AssetInspectorPanelVariantKey } from "./generated/variant-keys"

export interface AssetInspectorPanelLabels {
    emptyTitle?: React.ReactNode
    title?: React.ReactNode
    note?: React.ReactNode
    tags?: React.ReactNode
    metadata?: React.ReactNode
    rating?: React.ReactNode
    actions?: React.ReactNode
    analyze?: React.ReactNode
    compress?: React.ReactNode
    favorite?: string
    preview?: string
    share?: string
    download?: string
    delete?: string
    close?: string
    edit?: string
    save?: string
    cancel?: string
}

export interface AssetInspectorPanelProps
    extends Omit<InspectorPanelProps, "title" | "children"> {
    asset?: AssetCardAsset | null
    title?: string
    note?: string
    tags?: string[]
    tagSuggestions?: string[]
    metadata?: MetadataListItem[]
    labels?: AssetInspectorPanelLabels
    variant?: AssetInspectorPanelVariantKey
    onTitleChange?: (title: string) => void
    onNoteChange?: (note: string) => void
    onTagsChange?: (tags: string[]) => void
    onPreview?: (asset: AssetCardAsset) => void
    onFavorite?: (asset: AssetCardAsset) => void
    onShare?: (asset: AssetCardAsset) => void
    onDownload?: (asset: AssetCardAsset) => void
    onDelete?: (asset: AssetCardAsset) => void
    onClose?: () => void
    onRatingChange?: (rating: number, asset: AssetCardAsset) => void
    onAnalyze?: (asset: AssetCardAsset) => void
    onCompress?: (asset: AssetCardAsset) => void
    tooltipPortalContainer?: HTMLElement | null
}

const variantClasses: Record<AssetInspectorPanelVariantKey, { body: string; preview: string }> = {
    default: {
        body: "",
        preview: "rounded-lg",
    },
    compact: {
        body: "text-sm",
        preview: "rounded-md",
    },
}

function halfStep(value: number) {
    return Math.min(5, Math.max(0, Math.round(value * 2) / 2))
}

function RatingStar({
    index,
    value,
    onChange,
    label,
    tooltipPortalContainer,
}: {
    index: number
    value: number
    onChange: (value: number) => void
    label: string
    tooltipPortalContainer?: HTMLElement | null
}) {
    const fillAmount = Math.min(1, Math.max(0, value - (index - 1)))
    const isFilled = fillAmount > 0
    const iconSize = 24

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    className="relative h-8 w-8 text-muted-foreground hover:text-primary"
                    aria-label={label}
                    aria-pressed={isFilled}
                    onClick={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect()
                        const iconLeft = (rect.width - iconSize) / 2
                        const pointerX = Math.min(iconSize, Math.max(0, event.clientX - rect.left - iconLeft))
                        const next = index - (pointerX < iconSize / 2 ? 0.5 : 0)
                        onChange(value === next ? 0 : next)
                    }}
                >
                    <Star className="absolute inset-1 h-6 w-6" aria-hidden="true" />
                    {isFilled ? (
                        <span
                            className="absolute left-1 top-1 h-6 overflow-hidden text-primary"
                            style={{ width: `${fillAmount * iconSize}px` }}
                        >
                            <Star className="h-6 w-6 fill-primary" aria-hidden="true" />
                        </span>
                    ) : null}
                </button>
            </TooltipTrigger>
            <TooltipContent portalContainer={tooltipPortalContainer}>
                {label}
            </TooltipContent>
        </Tooltip>
    )
}

function defaultMetadata(asset: AssetCardAsset): MetadataListItem[] {
    return [
        { label: "File name", value: asset.title },
        asset.width && asset.height
            ? { label: "Dimensions", value: `${asset.width} x ${asset.height}` }
            : null,
        asset.type ? { label: "Type", value: asset.type } : null,
        asset.size ? { label: "Size", value: asset.size } : null,
        asset.createdAt ? { label: "Created", value: asset.createdAt } : null,
    ].filter(Boolean) as MetadataListItem[]
}

function splitTitleExtension(value: string) {
    const dotIndex = value.lastIndexOf(".")
    if (dotIndex <= 0 || dotIndex === value.length - 1) {
        return { name: value, extension: "" }
    }
    return { name: value.slice(0, dotIndex), extension: value.slice(dotIndex) }
}

const AssetInspectorPanel = React.forwardRef<HTMLDivElement, AssetInspectorPanelProps>(
    (
        {
            asset,
            title,
            note = "",
            tags,
            tagSuggestions,
            metadata,
            labels,
            variant = assetInspectorPanelDefaultVariantKey,
            onTitleChange,
            onNoteChange,
            onTagsChange,
            onPreview,
            onFavorite,
            onShare,
            onDownload,
            onDelete,
            onClose,
            onRatingChange,
            onAnalyze,
            onCompress,
            tooltipPortalContainer,
            className,
            ...props
        },
        ref
    ) => {
        const classes = variantClasses[variant]
        const resolvedTitle = title ?? "Details"

        if (!asset) {
            return (
                <InspectorPanel ref={ref} title={resolvedTitle} className={cn("w-full p-0", className)} {...props}>
                    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                        <ImageIcon className="h-10 w-10 opacity-50" aria-hidden="true" />
                        <p className="text-sm">{labels?.emptyTitle ?? "Select an asset to view details."}</p>
                    </div>
                </InspectorPanel>
            )
        }

        const currentTags = tags ?? []
        const metadataItems = metadata ?? defaultMetadata(asset)
        const { name: editableTitleName, extension: titleExtension } = splitTitleExtension(asset.title)
        const previewLabel = String(labels?.preview ?? "Preview")
        const header = (
            <div className="flex h-12 items-center justify-between gap-2 border-b border-border bg-background px-3">
                <TooltipButton
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={labels?.favorite ?? "Favorite"}
                    tooltip={labels?.favorite ?? "Favorite"}
                    tooltipSide="bottom"
                    tooltipCloseOnPress
                    tooltipPortalContainer={tooltipPortalContainer}
                    className={cn("h-9 w-9 text-muted-foreground", asset.isFavorite && "text-primary")}
                    onClick={() => onFavorite?.(asset)}
                >
                    <Heart className={cn("h-5 w-5", asset.isFavorite && "fill-current")} aria-hidden="true" />
                </TooltipButton>
                <div className="flex items-center gap-1">
                    {onShare ? (
                        <TooltipButton
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground"
                            aria-label={labels?.share ?? "Share"}
                            tooltip={labels?.share ?? "Share"}
                            tooltipSide="bottom"
                            tooltipCloseOnPress
                            tooltipPortalContainer={tooltipPortalContainer}
                            onClick={() => onShare(asset)}
                        >
                            <Globe2 className="h-5 w-5" aria-hidden="true" />
                        </TooltipButton>
                    ) : null}
                    {onDownload ? (
                        <TooltipButton
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground"
                            aria-label={labels?.download ?? "Download"}
                            tooltip={labels?.download ?? "Download"}
                            tooltipSide="bottom"
                            tooltipCloseOnPress
                            tooltipPortalContainer={tooltipPortalContainer}
                            onClick={() => onDownload(asset)}
                        >
                            <Download className="h-5 w-5" aria-hidden="true" />
                        </TooltipButton>
                    ) : null}
                    {(onDelete || onClose) ? <span className="mx-1 h-6 w-px bg-border" aria-hidden="true" /> : null}
                    {onDelete ? (
                        <TooltipButton
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={labels?.delete ?? "Delete"}
                            tooltip={labels?.delete ?? "Delete"}
                            tooltipSide="bottom"
                            tooltipCloseOnPress
                            tooltipPortalContainer={tooltipPortalContainer}
                            className="h-9 w-9 text-muted-foreground hover:text-destructive"
                            onClick={() => onDelete(asset)}
                        >
                            <Trash2 className="h-5 w-5" aria-hidden="true" />
                        </TooltipButton>
                    ) : null}
                    {onClose ? (
                        <TooltipButton
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={labels?.close ?? "Close"}
                            tooltip={labels?.close ?? "Close"}
                            tooltipSide="bottom"
                            tooltipCloseOnPress
                            tooltipPortalContainer={tooltipPortalContainer}
                            className="h-9 w-9 text-muted-foreground"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" aria-hidden="true" />
                        </TooltipButton>
                    ) : null}
                </div>
            </div>
        )

        return (
            <InspectorPanel ref={ref} header={header} className={cn("w-full p-0", className)} {...props}>
                <div className={cn("space-y-6", classes.body)}>
                    {onPreview ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        "relative flex aspect-square w-full cursor-zoom-in items-center justify-center overflow-hidden border bg-muted/40 p-0",
                                        classes.preview
                                    )}
                                    aria-label={previewLabel}
                                    onClick={() => onPreview(asset)}
                                >
                                    {asset.src ? (
                                        <img src={asset.src} alt={asset.alt ?? asset.title} className="h-full w-full object-contain" />
                                    ) : (
                                        <ImageIcon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
                                    )}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent portalContainer={tooltipPortalContainer}>
                                {previewLabel}
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <div
                            className={cn(
                                "relative flex aspect-square w-full items-center justify-center overflow-hidden border bg-muted/40 p-0",
                                classes.preview
                            )}
                        >
                            {asset.src ? (
                                <img src={asset.src} alt={asset.alt ?? asset.title} className="h-full w-full object-contain" />
                            ) : (
                                <ImageIcon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
                            )}
                        </div>
                    )}

                    <div className="space-y-3">
                        <EditableField
                            label={String(labels?.title ?? "Title")}
                            value={editableTitleName}
                            labels={labels}
                            onSave={onTitleChange ? (value) => {
                                const nextTitle = splitTitleExtension(value || editableTitleName).name
                                onTitleChange(`${nextTitle}${titleExtension}`)
                            } : undefined}
                        />
                        <EditableField
                            label={String(labels?.note ?? "Note")}
                            value={note}
                            labels={labels}
                            onSave={onNoteChange}
                        />
                        {onRatingChange ? (
                            <InspectorField label={String(labels?.rating ?? "Rating")}>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map((index) => (
                                                <RatingStar
                                                    key={index}
                                                    index={index}
                                                    value={asset.rating ?? 0}
                                                    onChange={(value) => onRatingChange(value, asset)}
                                                    label={`${String(labels?.rating ?? "Rating")} ${index}`}
                                                    tooltipPortalContainer={tooltipPortalContainer}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs tabular-nums text-muted-foreground">
                                            {Number(asset.rating ?? 0).toFixed(1)} / 5
                                        </span>
                                    </div>
                                    <Slider
                                        value={String(asset.rating ?? 0)}
                                        min={0}
                                        max={5}
                                        step={0.5}
                                        onChange={(event) => onRatingChange(halfStep(Number(event.currentTarget.value)), asset)}
                                        aria-label={String(labels?.rating ?? "Rating")}
                                    />
                                </div>
                            </InspectorField>
                        ) : null}
                    </div>

                    <InspectorSection title={String(labels?.tags ?? "Tags")}>
                        <TagEditor
                            value={currentTags}
                            onValueChange={onTagsChange}
                            suggestions={tagSuggestions}
                            label={null}
                            variant={variant}
                        />
                    </InspectorSection>

                    <InspectorSection title={String(labels?.metadata ?? "Metadata")}>
                        <MetadataList items={metadataItems} variant="compact" />
                    </InspectorSection>

                    {(onAnalyze || onCompress) ? (
                        <InspectorSection title={String(labels?.actions ?? "Actions")}>
                            {onAnalyze ? (
                                <Button type="button" className="w-full gap-2" onClick={() => onAnalyze(asset)}>
                                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                                    {labels?.analyze ?? "Analyze"}
                                </Button>
                            ) : null}
                            {onCompress ? (
                                <Button type="button" variant="secondary" className="w-full gap-2" onClick={() => onCompress(asset)}>
                                    <Archive className="h-4 w-4" aria-hidden="true" />
                                    {labels?.compress ?? "Compress"}
                                </Button>
                            ) : null}
                        </InspectorSection>
                    ) : null}
                </div>
            </InspectorPanel>
        )
    }
)
AssetInspectorPanel.displayName = "AssetInspectorPanel"

export { AssetInspectorPanel }
