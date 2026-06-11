"use client"

import * as React from "react"
import { IconMaximize as Maximize, IconPhoto as Photo } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import { Icon } from "./Icon"
import { Img, type ImgProps } from "./Img"
import { imagePreviewDefaultVariantKey } from "./generated/default-variant-keys"
import type { ImagePreviewVariantKey } from "./generated/variant-keys"

export interface ImagePreviewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    src?: string
    alt?: string
    variant?: ImagePreviewVariantKey
    aspectRatio?: ImgProps["aspectRatio"]
    objectFit?: ImgProps["objectFit"]
    loading?: ImgProps["loading"]
    fallback?: React.ReactNode
    noImageLabel?: string
    showSkeleton?: boolean
    previewLabel?: string
    portalContainer?: HTMLElement | null
    onPreview?: () => void
    children?: React.ReactNode
    imgProps?: Omit<ImgProps, "src" | "alt" | "aspectRatio" | "objectFit" | "fallback" | "showSkeleton" | "className">
}

const imagePreviewVariantClasses: Record<ImagePreviewVariantKey, string> = {
    default: "bg-muted/40",
    contain: "bg-muted/30",
    empty: "bg-muted/30",
}

const imagePreviewAspectRatioClasses: Record<NonNullable<ImgProps["aspectRatio"]>, string> = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    wide: "aspect-[21/9]",
    auto: "min-h-40",
}

function DefaultNoImagePreview({ alt, label }: { alt?: string; label: string }) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted/60 p-4 text-center text-muted-foreground">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-muted-foreground/35 bg-background/70">
                <Icon icon={Photo} size="lg" />
            </div>
            <div className="min-w-0 space-y-1">
                <div className="text-xs font-medium text-foreground/70">{label}</div>
                {alt ? (
                    <div className="max-w-[12rem] truncate text-[11px] leading-none text-muted-foreground">{alt}</div>
                ) : null}
            </div>
        </div>
    )
}

const ImagePreview = React.forwardRef<HTMLDivElement, ImagePreviewProps>(
    (
        {
            src,
            alt,
            variant = imagePreviewDefaultVariantKey,
            aspectRatio = "square",
            objectFit,
            loading = "lazy",
            fallback,
            noImageLabel = "Image not found",
            showSkeleton = true,
            previewLabel = "Open preview",
            portalContainer,
            onPreview,
            children,
            imgProps,
            className,
            ...props
        },
        ref
    ) => {
        const effectiveVariant = src ? variant : "empty"
        const effectiveObjectFit = objectFit ?? (effectiveVariant === "contain" ? "contain" : "cover")
        const noImageFallback = fallback ?? <DefaultNoImagePreview alt={alt} label={noImageLabel} />

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex items-center justify-center overflow-hidden border border-border p-0 shadow-sm transition-colors",
                    imagePreviewVariantClasses[effectiveVariant],
                    imagePreviewAspectRatioClasses[aspectRatio],
                    className
                )}
                {...props}
            >
                {src ? (
                    <Img
                        src={src}
                        alt={alt}
                        aspectRatio={aspectRatio}
                        objectFit={effectiveObjectFit}
                        fallback={noImageFallback}
                        showSkeleton={showSkeleton}
                        className="h-full w-full rounded-none bg-transparent"
                        {...imgProps}
                        loading={loading}
                    />
                ) : (
                    noImageFallback
                )}

                {children}

                {onPreview ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                className="absolute bottom-2 right-2 z-20 inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background/95 text-muted-foreground opacity-0 shadow-sm transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100"
                                aria-label={previewLabel}
                                onClick={(event) => {
                                    event.stopPropagation()
                                    onPreview()
                                }}
                            >
                                <Icon icon={Maximize} size="sm" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent portalContainer={portalContainer}>{previewLabel}</TooltipContent>
                    </Tooltip>
                ) : null}
            </div>
        )
    }
)

ImagePreview.displayName = "ImagePreview"

export { ImagePreview }
