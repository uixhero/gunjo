"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { DeviceFrame, type DeviceFrameLabels, type MarqueeViewport } from "./DeviceFrame"
import { marqueeFrameDefaultVariantKey } from "./generated/default-variant-keys"
import type { MarqueeFrameVariantKey } from "./generated/variant-keys"

export type { MarqueeViewport } from "./DeviceFrame"

export const MARQUEE_VIEWPORT_SIZES: Record<
    MarqueeViewport,
    { width: number; height: number }
> = {
    desktop: { width: 1280, height: 720 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 },
}

export interface MarqueeFrameProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    host?: string
    path: string
    defaultPath?: string
    tabTitle?: string
    navigablePaths?: string[]
    onPathChange?: (path: string) => void
    storageKey?: string
    initialViewport?: MarqueeViewport
    /**
     * When true and there is no stored choice yet, open in the preview that
     * matches the viewer's own device (phone → mobile, tablet → tablet) instead
     * of always starting on the desktop frame. Lets phone visitors land on a
     * readable frame without hunting for the tiny, scaled-down toggle.
     */
    defaultToDeviceViewport?: boolean
    variant?: MarqueeFrameVariantKey
    viewportSizes?: Record<MarqueeViewport, { width: number; height: number }>
    maxCanvasHeight?: number
    labels?: DeviceFrameLabels
    children: (viewport: MarqueeViewport) => React.ReactNode
}

const VIEWPORTS: MarqueeViewport[] = ["desktop", "tablet", "mobile"]

const variantClasses: Record<MarqueeFrameVariantKey, { root: string }> = {
    default: { root: "" },
    desktop: { root: "" },
    tablet: { root: "" },
    mobile: { root: "" },
}

const MarqueeFrame = React.forwardRef<HTMLDivElement, MarqueeFrameProps>(
    (
        {
            host = "gunjo.example",
            path,
            defaultPath = "/",
            tabTitle = "GunjoUI",
            navigablePaths,
            onPathChange,
            storageKey,
            initialViewport = "desktop",
            defaultToDeviceViewport = false,
            variant = marqueeFrameDefaultVariantKey,
            viewportSizes = MARQUEE_VIEWPORT_SIZES,
            maxCanvasHeight = 720,
            labels,
            children,
            className,
            ...props
        },
        ref
    ) => {
        const classes = variantClasses[variant]
        const containerRef = React.useRef<HTMLDivElement | null>(null)
        const [viewport, setViewport] = React.useState<MarqueeViewport>(initialViewport)
        const [scale, setScale] = React.useState(1)

        React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

        React.useEffect(() => {
            if (storageKey) {
                const stored = window.sessionStorage.getItem(storageKey)
                if (VIEWPORTS.includes(stored as MarqueeViewport)) {
                    setViewport(stored as MarqueeViewport)
                    return
                }
            }
            // No saved choice yet: optionally match the viewer's own device so
            // phone/tablet visitors don't start on the tiny scaled-down desktop
            // frame they can't easily toggle away from.
            if (
                defaultToDeviceViewport &&
                typeof window !== "undefined" &&
                typeof window.matchMedia === "function"
            ) {
                if (window.matchMedia("(max-width: 639px)").matches) {
                    setViewport("mobile")
                } else if (window.matchMedia("(max-width: 1023px)").matches) {
                    setViewport("tablet")
                }
            }
        }, [storageKey, defaultToDeviceViewport])

        const { width: viewportWidth, height: viewportHeight } = viewportSizes[viewport]

        React.useLayoutEffect(() => {
            const node = containerRef.current
            if (!node) return
            const updateScale = (available: number) => {
                const widthRatio = Math.max(0, available - 8) / viewportWidth
                const heightRatio = maxCanvasHeight / viewportHeight
                const next = Math.min(1, widthRatio, heightRatio)
                const stableNext = Math.round((next > 0 ? next : 1) * 1000) / 1000
                setScale((current) => (Math.abs(current - stableNext) < 0.001 ? current : stableNext))
            }
            updateScale(node.clientWidth)
            const resizeObserver = new ResizeObserver((entries) => {
                const entry = entries[0]
                updateScale(entry?.contentRect.width ?? node.clientWidth)
            })
            resizeObserver.observe(node)
            return () => resizeObserver.disconnect()
        }, [maxCanvasHeight, viewportHeight, viewportWidth])

        const handleViewportChange = (next: MarqueeViewport) => {
            setViewport(next)
            if (storageKey) window.sessionStorage.setItem(storageKey, next)
        }

        return (
            <div
                className={cn("w-full bg-muted/40 p-0 px-4 py-8 sm:px-8 lg:py-12", classes.root, className)}
                data-slot="marquee-frame"
                {...props}
            >
                <div ref={containerRef} className="mx-auto w-full" data-slot="marquee-frame-scale-container">
                    <div
                        className="mx-auto"
                        data-slot="marquee-frame-scaled-box"
                        style={{
                            height: viewportHeight * scale + 56,
                            width: viewportWidth * scale,
                        }}
                    >
                        <div
                            data-slot="marquee-frame-transform"
                            style={{
                                transform: `scale(${scale})`,
                                transformOrigin: "top left",
                                width: viewportWidth,
                            }}
                        >
                            <DeviceFrame
                                host={host}
                                path={path}
                                defaultPath={defaultPath}
                                tabTitle={tabTitle}
                                viewport={viewport}
                                onViewportChange={handleViewportChange}
                                navigablePaths={navigablePaths}
                                onPathChange={onPathChange}
                                labels={labels}
                            >
                                <div
                                    className="overflow-hidden bg-background"
                                    style={{ width: viewportWidth, height: viewportHeight }}
                                >
                                    {children(viewport)}
                                </div>
                            </DeviceFrame>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
)
MarqueeFrame.displayName = "MarqueeFrame"

export { MarqueeFrame }
