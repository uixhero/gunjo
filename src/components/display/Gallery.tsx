"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Img, type ImgProps } from "./Img"
import type { GalleryVariantKey } from "./generated/variant-keys"
import { galleryDefaultVariantKey } from "./generated/default-variant-keys"

// Thumbnail strip position → layout direction. (#173)
const galleryLayoutClasses: Record<GalleryVariantKey, string> = {
    bottom: "flex-col",
    start: "flex-col-reverse sm:flex-row",
}

const thumbnailStripClasses: Record<GalleryVariantKey, string> = {
    bottom: "flex-row",
    start: "flex-row sm:flex-col",
}

export interface GalleryImage {
    src: string
    alt: string
}

export interface GalleryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    images: GalleryImage[]
    /** Controlled active index. Omit for internal state. */
    value?: number
    onValueChange?: (index: number) => void
    /** Initial active index when uncontrolled. Default `0`. */
    defaultIndex?: number
    /** Thumbnail strip position. Default `"bottom"`. */
    thumbnailPosition?: GalleryVariantKey
    /** Aspect ratio of the main image. Default `"square"`. */
    aspectRatio?: ImgProps["aspectRatio"]
}

/**
 * Main image + selectable thumbnail strip with click/keyboard swap. Thumbnails
 * are a `radiogroup` with roving tabindex + arrow keys; the main image is
 * rendered with `Img` (aspect ratio, skeleton, error fallback). (#173)
 */
export const Gallery = React.forwardRef<HTMLDivElement, GalleryProps>(
    (
        {
            className,
            images,
            value,
            onValueChange,
            defaultIndex = 0,
            thumbnailPosition = galleryDefaultVariantKey,
            aspectRatio = "square",
            ...props
        },
        ref
    ) => {
        const [internal, setInternal] = React.useState(defaultIndex)
        const active = value ?? internal

        const select = (index: number) => {
            if (value === undefined) setInternal(index)
            onValueChange?.(index)
        }

        const moveFocus = (current: number, dir: 1 | -1) => {
            const next = (current + dir + images.length) % images.length
            document.getElementById(`gallery-thumb-${next}`)?.focus()
            select(next)
        }

        const main = images[active]

        return (
            <div
                ref={ref}
                className={cn("flex w-full gap-3", galleryLayoutClasses[thumbnailPosition], className)}
                {...props}
            >
                <div className="min-w-0 flex-1">
                    {main ? <Img src={main.src} alt={main.alt} aspectRatio={aspectRatio} className="rounded-lg" /> : null}
                </div>
                <div
                    role="radiogroup"
                    aria-label="Gallery thumbnails"
                    className={cn("flex gap-2", thumbnailStripClasses[thumbnailPosition])}
                >
                    {images.map((image, index) => {
                        const selected = index === active
                        return (
                            <button
                                key={index}
                                id={`gallery-thumb-${index}`}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                aria-label={image.alt}
                                tabIndex={selected ? 0 : -1}
                                onClick={() => select(index)}
                                onKeyDown={(e) => {
                                    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                                        e.preventDefault()
                                        moveFocus(index, 1)
                                    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                                        e.preventDefault()
                                        moveFocus(index, -1)
                                    }
                                }}
                                className={cn(
                                    "h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 ring-offset-background transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                    selected ? "border-ring" : "border-transparent hover:border-border"
                                )}
                            >
                                <Img src={image.src} alt="" aspectRatio="square" showSkeleton={false} />
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }
)

Gallery.displayName = "Gallery"
