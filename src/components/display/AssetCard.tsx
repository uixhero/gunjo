"use client"

import * as React from "react"
import { IconCheck as Check, IconHeart as Heart, IconStarFilled as Star } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Badge } from "./Badge"
import { Icon } from "./Icon"
import { ImagePreview } from "./ImagePreview"
import { assetCardDefaultVariantKey } from "./generated/default-variant-keys"
import type { AssetCardVariantKey } from "./generated/variant-keys"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"

export interface AssetCardAsset {
    id: string
    title: string
    src?: string
    alt?: string
    type?: string
    size?: string
    width?: number
    height?: number
    createdAt?: string
    isFavorite?: boolean
    rating?: number
    score?: string | number
    meta?: React.ReactNode
}

export interface AssetCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
    asset: AssetCardAsset
    selected?: boolean
    variant?: AssetCardVariantKey
    selectionMode?: "single" | "multiple" | "none"
    imageFit?: "contain" | "cover"
    previewLabel?: string
    favoriteLabel?: string
    unfavoriteLabel?: string
    ratingLabel?: string
    noImageLabel?: string
    portalContainer?: HTMLElement | null
    onSelect?: (asset: AssetCardAsset) => void
    onPreview?: (asset: AssetCardAsset) => void
    onFavorite?: (asset: AssetCardAsset) => void
    renderMeta?: (asset: AssetCardAsset) => React.ReactNode
}

const densityClasses: Record<AssetCardVariantKey, { root: string; image: string; title: string; meta: string }> = {
    default: {
        root: "gap-2",
        image: "rounded-lg",
        title: "text-base",
        meta: "text-sm",
    },
    compact: {
        root: "gap-1.5",
        image: "rounded-md",
        title: "text-sm",
        meta: "text-xs",
    },
}

function defaultMeta(asset: AssetCardAsset) {
    const dimensions = asset.width && asset.height ? `${asset.width} x ${asset.height}` : null
    const typeSize = [asset.type, asset.size].filter(Boolean).join(" ")
    return [dimensions, typeSize, asset.createdAt].filter(Boolean).join(" / ")
}

const AssetCard = React.forwardRef<HTMLDivElement, AssetCardProps>(
    (
        {
            asset,
            selected,
            variant = assetCardDefaultVariantKey,
            selectionMode = "single",
            imageFit = "cover",
            previewLabel = "Open preview",
            favoriteLabel = "Favorite",
            unfavoriteLabel = "Remove favorite",
            ratingLabel = "Rating",
            noImageLabel = "Preview image not found",
            portalContainer,
            onSelect,
            onPreview,
            onFavorite,
            renderMeta,
            className,
            onKeyDown,
            ...props
        },
        ref
    ) => {
        const interactive = Boolean(onSelect)
        const classes = densityClasses[variant]
        const meta = renderMeta ? renderMeta(asset) : asset.meta ?? defaultMeta(asset)
        const ratingValue = typeof asset.rating === "number" && asset.rating > 0
            ? asset.rating.toFixed(1)
            : asset.score !== undefined
                ? String(asset.score)
                : null
        const favoriteButtonRef = React.useRef<HTMLButtonElement>(null)
        const favoriteBlurTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

        React.useEffect(() => {
            if (asset.isFavorite && favoriteBlurTimerRef.current) {
                clearTimeout(favoriteBlurTimerRef.current)
                favoriteBlurTimerRef.current = null
            }
        }, [asset.isFavorite])

        React.useEffect(() => {
            return () => {
                if (favoriteBlurTimerRef.current) {
                    clearTimeout(favoriteBlurTimerRef.current)
                }
            }
        }, [])

        const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
            onKeyDown?.(event)
            if (event.defaultPrevented || !interactive) return
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onSelect?.(asset)
            }
        }

        return (
            <div
                ref={ref}
                role={interactive ? "button" : undefined}
                tabIndex={interactive ? 0 : undefined}
                aria-pressed={interactive ? selected : undefined}
                data-state={selected ? "selected" : "idle"}
                className={cn(
                    "group flex w-full min-w-0 flex-col p-0 outline-none",
                    interactive && "cursor-pointer",
                    classes.root,
                    className
                )}
                onClick={() => onSelect?.(asset)}
                onKeyDown={handleKeyDown}
                {...props}
            >
                <ImagePreview
                    src={asset.src}
                    alt={asset.src ? asset.alt ?? asset.title : undefined}
                    objectFit={imageFit}
                    className={cn(
                        classes.image,
                        selected
                            ? "border-primary-border bg-primary-subtle ring-2 ring-primary-border"
                            : "border-border group-hover:border-primary-border"
                    )}
                    noImageLabel={noImageLabel}
                    previewLabel={previewLabel}
                    portalContainer={portalContainer}
                    onPreview={onPreview ? () => onPreview(asset) : undefined}
                >
                    {(asset.isFavorite || onFavorite) ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    ref={favoriteButtonRef}
                                    type="button"
                                    className={cn(
                                        "absolute left-2 top-2 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full border bg-background/95 shadow-sm transition-opacity hover:text-primary focus:text-primary focus:opacity-100",
                                        asset.isFavorite
                                            ? "text-primary opacity-100"
                                            : "text-muted-foreground opacity-0 group-hover:opacity-100"
                                    )}
                                    aria-label={asset.isFavorite ? unfavoriteLabel : favoriteLabel}
                                    aria-pressed={asset.isFavorite}
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        const wasFavorite = Boolean(asset.isFavorite)
                                        if (favoriteBlurTimerRef.current) {
                                            clearTimeout(favoriteBlurTimerRef.current)
                                            favoriteBlurTimerRef.current = null
                                        }
                                        onFavorite?.(asset)
                                        if (wasFavorite) {
                                            favoriteBlurTimerRef.current = setTimeout(() => {
                                                favoriteButtonRef.current?.blur()
                                                favoriteBlurTimerRef.current = null
                                            }, 1000)
                                        }
                                    }}
                                >
                                    <Icon icon={Heart} size="xs" className={cn(asset.isFavorite && "fill-current")} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent portalContainer={portalContainer}>{asset.isFavorite ? unfavoriteLabel : favoriteLabel}</TooltipContent>
                        </Tooltip>
                    ) : null}

                    {(ratingValue || selectionMode === "multiple" || (selected && selectionMode !== "none")) ? (
                        <div className="absolute right-2 top-2 z-20 flex max-w-[calc(100%-1rem)] items-center gap-1">
                            {ratingValue ? (
                                <Badge
                                    className="gap-1 bg-background/95 text-foreground shadow-sm"
                                    aria-label={`${ratingLabel}: ${ratingValue}`}
                                >
                                    {typeof asset.rating === "number" && asset.rating > 0 ? (
                                        <Icon icon={Star} size="xs" className="fill-current text-warning" />
                                    ) : null}
                                    {ratingValue}
                                </Badge>
                            ) : null}
                            {(selectionMode === "multiple" || (selected && selectionMode !== "none")) ? (
                                <span
                                    className={cn(
                                        "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border shadow-sm",
                                        selected
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-border bg-background/80 text-muted-foreground"
                                    )}
                                    aria-hidden="true"
                                >
                                    {selected ? <Icon icon={Check} size="xs" strokeWidth={2.5} /> : null}
                                </span>
                            ) : null}
                        </div>
                    ) : null}
                </ImagePreview>
                <div className="min-w-0 px-0.5">
                    <div className={cn("truncate font-medium leading-tight text-foreground", classes.title)}>
                        {asset.title}
                    </div>
                    {meta ? (
                        <div className={cn("mt-1 truncate leading-tight text-muted-foreground", classes.meta)}>
                            {meta}
                        </div>
                    ) : null}
                </div>
            </div>
        )
    }
)
AssetCard.displayName = "AssetCard"

export { AssetCard }
