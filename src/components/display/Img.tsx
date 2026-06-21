"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { IconPhoto as ImageIcon } from "@tabler/icons-react"
import type { ImgVariantKey } from "./generated/variant-keys"
import { imgDefaultVariantKey } from "./generated/default-variant-keys"

const imgOpacityClasses: Record<ImgVariantKey, string> = {
    error: "opacity-100",
    loaded: "opacity-100",
    loading: "opacity-0",
}

const imgVariantClasses: Record<ImgVariantKey, string> = {
    error: "w-full gap-2 rounded-lg text-xs font-normal",
    loaded: "h-fit w-full rounded-lg",
    loading: "h-fit w-full rounded-lg",
}

export interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallback?: React.ReactNode
    errorLabel?: string
    aspectRatio?: "square" | "video" | "auto" | "portrait" | "wide"
    objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
    showSkeleton?: boolean
}

const Img = React.forwardRef<HTMLImageElement, ImgProps>(
    ({ className, src, alt, fallback, errorLabel = "Image not found", aspectRatio = "auto", objectFit = "cover", showSkeleton = true, onLoad, onError, ...props }, ref) => {
        const [status, setStatus] = React.useState<ImgVariantKey>(() => (src ? imgDefaultVariantKey : "error"))
        const imageRef = React.useRef<HTMLImageElement | null>(null)

        const syncImageStatus = React.useCallback((node: HTMLImageElement | null) => {
            if (!src) {
                setStatus("error")
                return
            }
            if (!node?.complete) return
            setStatus(node.naturalWidth > 0 ? "loaded" : "error")
        }, [src])

        const setImageRef = React.useCallback((node: HTMLImageElement | null) => {
            imageRef.current = node
            if (typeof ref === "function") {
                ref(node)
            } else if (ref) {
                ref.current = node
            }
            syncImageStatus(node)
        }, [ref, syncImageStatus])

        const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
            setStatus("loaded")
            onLoad?.(e)
        }

        const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
            setStatus("error")
            onError?.(e)
        }

        React.useEffect(() => {
            if (!src) {
                setStatus("error")
                return
            }

            const node = imageRef.current
            if (node?.complete) {
                setStatus(node.naturalWidth > 0 ? "loaded" : "error")
                return
            }

            setStatus(imgDefaultVariantKey)
        }, [src])

        const aspectRatioClass = {
            "square": "aspect-square",
            "video": "aspect-video",
            "portrait": "aspect-[3/4]",
            "wide": "aspect-[21/9]",
            "auto": "aspect-auto"
        }[aspectRatio]

        const objectFitClass = {
            "cover": "object-cover",
            "contain": "object-contain",
            "fill": "object-fill",
            "none": "object-none",
            "scale-down": "object-scale-down"
        }[objectFit]
        const imageSizeClass = aspectRatio === "auto" ? "h-auto w-full" : "h-full w-full"
        const fallbackHeightClass = aspectRatio === "auto" && status !== "loaded" ? "min-h-40" : undefined

        return (
            <div className={cn("relative w-full overflow-hidden bg-secondary", imgVariantClasses[status], aspectRatioClass, fallbackHeightClass, className)}>
                {showSkeleton && status === "loading" && (
                    <div className="absolute inset-0 z-0 flex animate-pulse items-center justify-center bg-secondary">
                        {/* Optional spinner or just pulse */}
                        {/* <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" /> */}
                    </div>
                )}

                {status === "error" ? (
                    <div className="absolute inset-0 inline-flex flex-col items-center justify-center bg-secondary p-4 text-center text-muted-foreground">
                        {fallback || (
                            <>
                                <ImageIcon className="mb-2 h-8 w-8 opacity-80" />
                                <span className="text-xs">{errorLabel}</span>
                            </>
                        )}
                    </div>
                ) : (
                    <img
                        ref={setImageRef}
                        src={src}
                        alt={alt}
                        onLoad={handleLoad}
                        onError={handleError}
                        className={cn(
                            "transition-opacity duration-300",
                            imageSizeClass,
                            objectFitClass,
                            imgOpacityClasses[status]
                        )}
                        {...props}
                    />
                )}
            </div>
        )
    }
)
Img.displayName = "Img"

export { Img }
