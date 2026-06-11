"use client"

import * as React from "react"
import { IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight, IconHeart as Heart, IconInfoCircle as Info, IconMaximize as Maximize2, IconPencil as Pencil, IconRotate as RotateCcw, IconRotateClockwise as RotateCw, IconShare2 as Share2, IconX as X, IconZoomIn as ZoomIn, IconZoomOut as ZoomOut } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import type { AssetCardAsset } from "../display/AssetCard"
import { Button } from "../inputs/Button"
import { Slider } from "../inputs/Slider"
import { TooltipButton } from "../inputs/TooltipButton"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "./Dialog"
import { Popover, PopoverContent, PopoverTrigger } from "./Popover"
import { mediaLightboxDefaultVariantKey } from "./generated/default-variant-keys"
import type { MediaLightboxVariantKey } from "./generated/variant-keys"

export interface MediaLightboxLabels {
    close?: string
    previous?: string
    next?: string
    fitWidth?: string
    zoomIn?: string
    zoomOut?: string
    reset?: string
    rotate?: string
    save?: string
    share?: string
    favorite?: string
    edit?: string
    details?: string
    metadata?: string
    dimensions?: string
    type?: string
    size?: string
    created?: string
    rating?: string
}

export interface MediaLightboxProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    asset?: AssetCardAsset | null
    portalContainer?: HTMLElement | null
    variant?: MediaLightboxVariantKey
    labels?: MediaLightboxLabels
    hasPrevious?: boolean
    hasNext?: boolean
    onPrevious?: () => void
    onNext?: () => void
    onShare?: (asset: AssetCardAsset) => void
    onFavorite?: (asset: AssetCardAsset) => void
    onDetails?: (asset: AssetCardAsset) => void
}

const variantClasses: Record<MediaLightboxVariantKey, { chrome: string }> = {
    default: {
        chrome: "p-2 sm:p-4",
    },
    compact: {
        chrome: "p-2 sm:p-3",
    },
}

function metadataRows(asset: AssetCardAsset, labels?: MediaLightboxLabels) {
    return [
        asset.width && asset.height
            ? { label: labels?.dimensions ?? "Dimensions", value: `${asset.width} x ${asset.height}` }
            : null,
        asset.type ? { label: labels?.type ?? "Type", value: asset.type } : null,
        asset.size ? { label: labels?.size ?? "Size", value: asset.size } : null,
        asset.createdAt ? { label: labels?.created ?? "Created", value: asset.createdAt } : null,
        asset.rating !== undefined ? { label: labels?.rating ?? "Rating", value: `${asset.rating.toFixed(1)}/5` } : null,
    ].filter(Boolean) as Array<{ label: string; value: React.ReactNode }>
}

const MediaLightbox = React.forwardRef<HTMLDivElement, MediaLightboxProps>(
    (
        {
            open,
            onOpenChange,
            asset,
            portalContainer,
            variant = mediaLightboxDefaultVariantKey,
            labels,
            hasPrevious,
            hasNext,
            onPrevious,
            onNext,
            onShare,
            onFavorite,
            onDetails,
        },
        ref
    ) => {
        const [scale, setScale] = React.useState(1)
        const [fitWidth, setFitWidth] = React.useState(false)
        const [rotation, setRotation] = React.useState(0)
        const [editing, setEditing] = React.useState(false)
        const classes = variantClasses[variant]

        React.useEffect(() => {
            setScale(1)
            setFitWidth(false)
            setRotation(0)
            setEditing(false)
        }, [asset?.id, open])

        const changeScale = (next: number) => {
            setFitWidth(false)
            setScale(Math.min(3.5, Math.max(0.5, next)))
        }
        const resetView = () => {
            setScale(1)
            setFitWidth(false)
            setRotation(0)
            setEditing(false)
        }
        const zoomPercent = Math.round(scale * 100)
        const rows = asset ? metadataRows(asset, labels) : []

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    ref={ref}
                    portalContainer={portalContainer}
                    overlayClassName={portalContainer ? "!absolute" : undefined}
                    showCloseButton={false}
                    className={cn(
                        "h-[92vh] w-[96vw] max-w-none overflow-hidden border-border bg-foreground p-0 text-background sm:rounded-lg",
                        portalContainer && "!absolute !inset-0 !left-0 !top-0 !h-full !w-full !translate-x-0 !translate-y-0 !transform-none !rounded-none !border-0 data-[state=open]:!animate-none data-[state=closed]:!animate-none sm:!rounded-none"
                    )}
                >
                    <DialogTitle className="sr-only">{asset?.title ?? "Media preview"}</DialogTitle>
                    <DialogDescription className="sr-only">
                        {asset ? `${asset.title} preview` : "Media preview"}
                    </DialogDescription>
                    <div className="relative flex h-full w-full flex-col overflow-hidden bg-foreground p-0">
                        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-end gap-2 p-4">
                            {editing ? (
                                <div className="pointer-events-auto absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 rounded-full border border-background/10 bg-background/10 p-2 shadow-lg backdrop-blur">
                                    <TooltipButton
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-full text-background hover:bg-background/15 hover:text-background"
                                        aria-label={labels?.rotate ?? "Rotate"}
                                        tooltip={labels?.rotate ?? "Rotate"}
                                        tooltipSide="bottom"
                                        tooltipPortalContainer={portalContainer}
                                        tooltipCloseOnPress
                                        onClick={() => setRotation((value) => value + 90)}
                                    >
                                        <RotateCw className="h-4 w-4" />
                                    </TooltipButton>
                                    <span className="h-6 w-px bg-background/20" aria-hidden="true" />
                                    <Button type="button" className="h-9 rounded-full px-5" onClick={() => setEditing(false)}>
                                        {labels?.save ?? "Save"}
                                    </Button>
                                </div>
                            ) : null}
                            {asset && onShare ? (
                                <TooltipButton
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="pointer-events-auto h-10 w-10 rounded-full bg-background/10 text-background hover:bg-background/20 hover:text-background"
                                    aria-label={labels?.share ?? "Share"}
                                    tooltip={labels?.share ?? "Share"}
                                    tooltipSide="bottom"
                                    tooltipPortalContainer={portalContainer}
                                    tooltipCloseOnPress
                                    onClick={() => onShare(asset)}
                                >
                                    <Share2 className="h-5 w-5" />
                                </TooltipButton>
                            ) : null}
                            {asset && onFavorite ? (
                                <TooltipButton
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "pointer-events-auto h-10 w-10 rounded-full bg-background/10 text-background hover:bg-background/20 hover:text-background",
                                        asset.isFavorite && "text-primary hover:text-primary"
                                    )}
                                    aria-label={labels?.favorite ?? "Favorite"}
                                    tooltip={labels?.favorite ?? "Favorite"}
                                    tooltipSide="bottom"
                                    tooltipPortalContainer={portalContainer}
                                    tooltipCloseOnPress
                                    aria-pressed={asset.isFavorite}
                                    onClick={() => onFavorite(asset)}
                                >
                                    <Heart className={cn("h-5 w-5", asset.isFavorite && "fill-current")} />
                                </TooltipButton>
                            ) : null}
                            <TooltipButton
                                type="button"
                                variant="ghost"
                                size="icon"
                                className={cn("pointer-events-auto h-10 w-10 rounded-full bg-background/10 text-background hover:bg-background/20 hover:text-background", editing && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground")}
                                aria-label={labels?.edit ?? "Edit"}
                                tooltip={labels?.edit ?? "Edit"}
                                tooltipSide="bottom"
                                tooltipPortalContainer={portalContainer}
                                tooltipCloseOnPress
                                aria-pressed={editing}
                                onClick={() => setEditing((value) => !value)}
                            >
                                <Pencil className="h-5 w-5" />
                            </TooltipButton>
                            {asset ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <TooltipButton
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="pointer-events-auto h-10 w-10 rounded-full bg-background/10 text-background hover:bg-background/20 hover:text-background"
                                            aria-label={labels?.details ?? "Info"}
                                            tooltip={labels?.details ?? "Info"}
                                            tooltipSide="bottom"
                                            tooltipPortalContainer={portalContainer}
                                            tooltipCloseOnPress
                                        >
                                            <Info className="h-5 w-5" />
                                        </TooltipButton>
                                    </PopoverTrigger>
                                    <PopoverContent portalContainer={portalContainer} align="end" side="bottom" className="w-72 border-background/10 bg-background text-foreground">
                                        <div className="space-y-4">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold">{asset.title}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">{labels?.metadata ?? "Metadata"}</p>
                                            </div>
                                            <dl className="space-y-2">
                                                {rows.map((row) => (
                                                    <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
                                                        <dt className="text-muted-foreground">{row.label}</dt>
                                                        <dd className="truncate text-right font-medium">{row.value}</dd>
                                                    </div>
                                                ))}
                                            </dl>
                                            {onDetails ? (
                                                <Button type="button" variant="secondary" className="w-full" onClick={() => onDetails(asset)}>
                                                    {labels?.details ?? "Details"}
                                                </Button>
                                            ) : null}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ) : null}
                            <TooltipButton
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="pointer-events-auto h-10 w-10 rounded-full bg-background/10 text-background hover:bg-background/20 hover:text-background"
                                aria-label={labels?.close ?? "Close"}
                                tooltip={labels?.close ?? "Close"}
                                tooltipSide="bottom"
                                tooltipPortalContainer={portalContainer}
                                tooltipCloseOnPress
                                onClick={() => onOpenChange(false)}
                            >
                                <X className="h-5 w-5" />
                            </TooltipButton>
                        </div>

                        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-foreground p-0">
                            {hasPrevious ? (
                                <TooltipButton
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-background/10 text-background hover:bg-background/20 hover:text-background"
                                    aria-label={labels?.previous ?? "Previous"}
                                    tooltip={labels?.previous ?? "Previous"}
                                    tooltipSide="right"
                                    tooltipPortalContainer={portalContainer}
                                    tooltipCloseOnPress
                                    onClick={onPrevious}
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </TooltipButton>
                            ) : null}
                            {asset?.src ? (
                                <div className="flex h-full w-full items-center justify-center overflow-hidden px-20 pb-32 pt-24 sm:px-24">
                                    <img
                                        src={asset.src}
                                        alt={asset.alt ?? asset.title}
                                        className={cn(
                                            "select-none object-contain transition-transform",
                                            fitWidth ? "w-full max-w-none" : "max-h-full max-w-full"
                                        )}
                                        style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
                                        draggable={false}
                                    />
                                </div>
                            ) : (
                                <div className="text-sm text-background/70">No preview</div>
                            )}
                            {hasNext ? (
                                <TooltipButton
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-background/10 text-background hover:bg-background/20 hover:text-background"
                                    aria-label={labels?.next ?? "Next"}
                                    tooltip={labels?.next ?? "Next"}
                                    tooltipSide="left"
                                    tooltipPortalContainer={portalContainer}
                                    tooltipCloseOnPress
                                    onClick={onNext}
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </TooltipButton>
                            ) : null}
                        </div>

                        {asset ? (
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-2 sm:p-4">
                                <div className={cn("pointer-events-auto grid w-[calc(100%-1rem)] max-w-lg grid-cols-[auto_auto_auto_minmax(0,1fr)_auto_auto] items-center gap-2 rounded-2xl border border-background/10 bg-background/10 shadow-lg backdrop-blur sm:rounded-full", classes.chrome)}>
                                    <TooltipButton
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 rounded-full text-background hover:bg-background/15 hover:text-background sm:h-9 sm:w-9"
                                        aria-label={labels?.fitWidth ?? "Fit width"}
                                        tooltip={labels?.fitWidth ?? "Fit width"}
                                        tooltipSide="top"
                                        tooltipPortalContainer={portalContainer}
                                        tooltipCloseOnPress
                                        onClick={() => { setFitWidth(true); setScale(1); }}
                                    >
                                        <Maximize2 className="h-4 w-4" />
                                    </TooltipButton>
                                    <TooltipButton
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 rounded-full text-background hover:bg-background/15 hover:text-background sm:h-9 sm:w-9"
                                        aria-label={labels?.reset ?? "Reset"}
                                        tooltip={labels?.reset ?? "Reset"}
                                        tooltipSide="top"
                                        tooltipPortalContainer={portalContainer}
                                        tooltipCloseOnPress
                                        onClick={resetView}
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </TooltipButton>
                                    <TooltipButton
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 rounded-full text-background hover:bg-background/15 hover:text-background sm:h-9 sm:w-9"
                                        aria-label={labels?.zoomOut ?? "Zoom out"}
                                        tooltip={labels?.zoomOut ?? "Zoom out"}
                                        tooltipSide="top"
                                        tooltipPortalContainer={portalContainer}
                                        tooltipCloseOnPress
                                        onClick={() => changeScale(scale - 0.1)}
                                    >
                                        <ZoomOut className="h-4 w-4" />
                                    </TooltipButton>
                                    <Slider
                                        value={String(scale)}
                                        min={0.5}
                                        max={3.5}
                                        step={0.1}
                                        onChange={(event) => changeScale(Number(event.currentTarget.value))}
                                        className="!w-full min-w-0"
                                        aria-label="Zoom"
                                    />
                                    <TooltipButton
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 rounded-full text-background hover:bg-background/15 hover:text-background sm:h-9 sm:w-9"
                                        aria-label={labels?.zoomIn ?? "Zoom in"}
                                        tooltip={labels?.zoomIn ?? "Zoom in"}
                                        tooltipSide="top"
                                        tooltipPortalContainer={portalContainer}
                                        tooltipCloseOnPress
                                        onClick={() => changeScale(scale + 0.1)}
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                    </TooltipButton>
                                    <span className="w-11 shrink-0 text-right text-xs tabular-nums text-background/70 sm:w-12">{zoomPercent}%</span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
)
MediaLightbox.displayName = "MediaLightbox"

export { MediaLightbox }
