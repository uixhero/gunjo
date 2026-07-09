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
import { useLocale } from "../utility/LocaleProvider"

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
        // Pan offset (only meaningful when scale > 1, otherwise reset to 0
        // since the image already fits the frame and panning would expose
        // empty space). Tracked together with a dragging flag so we can
        // toggle cursor-grabbing and disable the CSS transition mid-drag.
        const [translate, setTranslate] = React.useState({ x: 0, y: 0 })
        const [dragging, setDragging] = React.useState(false)
        const dragRef = React.useRef<{
            pointerId: number
            startX: number
            startY: number
            originX: number
            originY: number
        } | null>(null)
        // Drag handlers go on the img element via a regular ref. Wheel zoom is
        // attached on the surrounding overflow-hidden container — not the img —
        // so scrolling anywhere over the lightbox's image area zooms, not just
        // over the (often smaller) image itself. React's own onWheel is passive
        // by default and silently drops preventDefault(), so the wheel listener
        // is wired natively via a callback ref so we re-attach whenever Radix
        // remounts the container (a useEffect alone wouldn't fire on those
        // remounts).
        const imageRef = React.useRef<HTMLImageElement | null>(null)
        const classes = variantClasses[variant]

        React.useEffect(() => {
            setScale(1)
            setFitWidth(false)
            setRotation(0)
            setEditing(false)
            setTranslate({ x: 0, y: 0 })
            setDragging(false)
            dragRef.current = null
        }, [asset?.id, open])

        const changeScale = (next: number) => {
            setFitWidth(false)
            const clamped = Math.min(3.5, Math.max(0.5, next))
            setScale(clamped)
            // Once the image fits its frame again, panning has no effect —
            // snap back to 0 so the next zoom-in starts centred.
            if (clamped <= 1) setTranslate({ x: 0, y: 0 })
        }
        // Double-click toggles between "100%" (image fits the frame, scale 1)
        // and "fit width" (image fills the frame's width and may overflow
        // vertically — same surface as the Fit width button). From any zoomed
        // or panned state, the first dblclick comes home to 100%; the next
        // one switches to fit-width; the next, back. Rotation is preserved
        // throughout so a dialled-in rotation isn't lost on a stray double-
        // click.
        const toggleZoom = () => {
            setTranslate({ x: 0, y: 0 })
            if (scale === 1 && !fitWidth) {
                setFitWidth(true)
            } else {
                setScale(1)
                setFitWidth(false)
            }
        }
        // Wheel zoom — keep the latest scale/fitWidth in refs so the
        // non-passive listener attached below can read fresh values without
        // re-binding on every state change.
        const scaleRef = React.useRef(scale)
        const fitWidthRef = React.useRef(fitWidth)
        React.useEffect(() => {
            scaleRef.current = scale
        }, [scale])
        React.useEffect(() => {
            fitWidthRef.current = fitWidth
        }, [fitWidth])
        // Callback-ref pattern: React invokes this with the new DOM node every
        // time React mounts/remounts the element (and with null when it
        // unmounts). useEffect with deps wouldn't catch a re-mount of the same
        // logical element by Radix, so the listener could end up stuck on a
        // detached DOM node. The callback ref re-attaches on every mount.
        const { strings } = useLocale()
        const attachedRef = React.useRef<{
            node: HTMLDivElement
            handler: (e: WheelEvent) => void
        } | null>(null)
        const imageFrameRefCb = React.useCallback((node: HTMLDivElement | null) => {
            const prev = attachedRef.current
            if (prev && prev.node !== node) {
                prev.node.removeEventListener("wheel", prev.handler)
                attachedRef.current = null
            }
            if (!node || attachedRef.current?.node === node) return
            const handler = (event: WheelEvent) => {
                // Always stop the page from scrolling — even at scale 1 a
                // wheel turn over the lightbox should zoom, not scroll the
                // page behind the modal.
                event.preventDefault()
                const direction = event.deltaY < 0 ? 1 : -1
                // Wheel notches are coarse; 0.15 per notch is a natural
                // feel — three notches roughly doubles the scale.
                const step = direction * 0.15
                const current = scaleRef.current
                const next = Math.min(3.5, Math.max(0.5, current + step))
                if (next === current) return
                setFitWidth(false)
                fitWidthRef.current = false
                setScale(next)
                scaleRef.current = next
                if (next <= 1) setTranslate({ x: 0, y: 0 })
            }
            node.addEventListener("wheel", handler, { passive: false })
            attachedRef.current = { node, handler }
        }, [])
        const resetView = () => {
            setScale(1)
            setFitWidth(false)
            setRotation(0)
            setEditing(false)
            setTranslate({ x: 0, y: 0 })
        }
        // Rotating or switching to fit-width changes what "centred" means;
        // safer to reset the pan than to leave a stale offset.
        const setFitWidthWithReset = (next: boolean) => {
            setFitWidth(next)
            setTranslate({ x: 0, y: 0 })
        }
        const rotate = () => {
            setRotation((value) => value + 90)
            setTranslate({ x: 0, y: 0 })
        }
        // Pan is meaningful whenever the image overflows the frame:
        // - scale > 1 (zoomed in either direction)
        // - fit-width (image fills the frame's width; tall captures often
        //   overflow vertically — mobile shots commonly run 750×8000+).
        // At plain 100% with fit-width off the image already fits, so panning
        // would just expose empty bands.
        const canPan = scale > 1 || fitWidth
        const handlePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
            if (!canPan) return
            if (event.button !== 0 && event.pointerType === "mouse") return
            event.currentTarget.setPointerCapture(event.pointerId)
            dragRef.current = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                originX: translate.x,
                originY: translate.y,
            }
            setDragging(true)
        }
        const handlePointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
            const drag = dragRef.current
            if (!drag || drag.pointerId !== event.pointerId) return
            setTranslate({
                x: drag.originX + (event.clientX - drag.startX),
                y: drag.originY + (event.clientY - drag.startY),
            })
        }
        const endDrag = (event: React.PointerEvent<HTMLImageElement>) => {
            const drag = dragRef.current
            if (!drag || drag.pointerId !== event.pointerId) return
            try {
                event.currentTarget.releasePointerCapture(event.pointerId)
            } catch {
                // pointer may already be released (e.g. element unmounted)
            }
            dragRef.current = null
            setDragging(false)
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
                                // Always-dark bar (bg-foreground/85, not bg-background/10) so
                                // icons stay readable when the image behind has a light
                                // background. The original low-opacity surface let near-white
                                // image pixels wash out the white-on-light controls.
                                <div className="pointer-events-auto absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 rounded-full border border-background/15 bg-foreground/85 p-2 shadow-lg backdrop-blur">
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
                                        onClick={rotate}
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
                                    className="pointer-events-auto h-10 w-10 rounded-full bg-foreground/85 text-background hover:bg-foreground/95 hover:text-background"
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
                                        "pointer-events-auto h-10 w-10 rounded-full bg-foreground/85 text-background hover:bg-foreground/95 hover:text-background",
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
                                className={cn("pointer-events-auto h-10 w-10 rounded-full bg-foreground/85 text-background hover:bg-foreground/95 hover:text-background", editing && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground")}
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
                                            className="pointer-events-auto h-10 w-10 rounded-full bg-foreground/85 text-background hover:bg-foreground/95 hover:text-background"
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
                                className="pointer-events-auto h-10 w-10 rounded-full bg-foreground/85 text-background hover:bg-foreground/95 hover:text-background"
                                aria-label={labels?.close ?? strings.close}
                                tooltip={labels?.close ?? strings.close}
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
                                    className="absolute left-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-foreground/85 text-background hover:bg-foreground/95 hover:text-background"
                                    aria-label={labels?.previous ?? strings.previous}
                                    tooltip={labels?.previous ?? strings.previous}
                                    tooltipSide="right"
                                    tooltipPortalContainer={portalContainer}
                                    tooltipCloseOnPress
                                    onClick={onPrevious}
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </TooltipButton>
                            ) : null}
                            {asset?.src ? (
                                <div
                                    ref={imageFrameRefCb}
                                    className="flex h-full w-full items-center justify-center overflow-hidden px-20 pb-32 pt-24 sm:px-24"
                                >
                                    <img
                                        ref={imageRef}
                                        src={asset.src}
                                        alt={asset.alt ?? asset.title}
                                        className={cn(
                                            "select-none object-contain",
                                            // No CSS transition while dragging — the transform
                                            // updates 60+ times per second and the ease lag
                                            // would make the image feel "swimmy".
                                            dragging ? "" : "transition-transform",
                                            fitWidth ? "w-full max-w-none" : "max-h-full max-w-full",
                                            canPan && (dragging ? "cursor-grabbing" : "cursor-grab")
                                        )}
                                        style={{
                                            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale}) rotate(${rotation}deg)`,
                                            // Disable native touch scroll/gesture handling only
                                            // while panning is meaningful — at scale 1 the
                                            // lightbox should still let users swipe past it.
                                            touchAction: canPan ? "none" : undefined,
                                        }}
                                        draggable={false}
                                        onPointerDown={handlePointerDown}
                                        onPointerMove={handlePointerMove}
                                        onPointerUp={endDrag}
                                        onPointerCancel={endDrag}
                                        onDoubleClick={toggleZoom}
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
                                    className="absolute right-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-foreground/85 text-background hover:bg-foreground/95 hover:text-background"
                                    aria-label={labels?.next ?? strings.next}
                                    tooltip={labels?.next ?? strings.next}
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
                                <div className={cn("pointer-events-auto grid w-[calc(100%-1rem)] max-w-lg grid-cols-[auto_auto_auto_minmax(0,1fr)_auto_auto] items-center gap-2 rounded-2xl border border-background/15 bg-foreground/85 shadow-lg backdrop-blur sm:rounded-full", classes.chrome)}>
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
                                        onClick={() => { setFitWidthWithReset(true); setScale(1); }}
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
