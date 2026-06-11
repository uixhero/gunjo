"use client"

import * as React from "react"
import useEmblaCarousel, {
    type UseEmblaCarouselType,
} from "embla-carousel-react"
import {
    IconChevronLeft as ChevronLeft,
    IconChevronRight as ChevronRight,
    IconPlayerPause as PlayerPause,
    IconPlayerPlay as PlayerPlay,
} from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import { TooltipButton } from "../inputs/TooltipButton"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import { Icon } from "./Icon"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselControlOptions = {
    navigation?: boolean
    dots?: boolean
    autoplayToggle?: boolean
    hideNavigationWhenDisabled?: boolean
    className?: string
    previousClassName?: string
    nextClassName?: string
    dotsClassName?: string
    autoplayToggleClassName?: string
    labels?: {
        previous?: string
        next?: string
        dots?: string
        play?: string
        pause?: string
        getDotLabel?: (index: number) => string
    }
}

type CarouselProps = {
    opts?: CarouselOptions
    plugins?: CarouselPlugin
    orientation?: "horizontal" | "vertical"
    setApi?: (api: CarouselApi) => void
    autoPlay?: boolean
    autoPlayInterval?: number
    pauseOnHover?: boolean
    controls?: boolean | CarouselControlOptions
}

type CarouselContextProps = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0]
    api: CarouselApi
    scrollPrev: () => void
    scrollNext: () => void
    scrollTo: (index: number) => void
    canScrollPrev: boolean
    canScrollNext: boolean
    selectedIndex: number
    scrollSnapCount: number
    isAutoPlaying: boolean
    setIsAutoPlaying: React.Dispatch<React.SetStateAction<boolean>>
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
    const context = React.useContext(CarouselContext)

    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />")
    }

    return context
}

const Carousel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
    (
        {
            orientation = "horizontal",
            opts,
            setApi,
            plugins,
            autoPlay = false,
            autoPlayInterval = 4000,
            pauseOnHover = true,
            controls,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const [carouselRef, api] = useEmblaCarousel(
            {
                ...opts,
                axis: orientation === "horizontal" ? "x" : "y",
            },
            plugins
        )
        const [canScrollPrev, setCanScrollPrev] = React.useState(false)
        const [canScrollNext, setCanScrollNext] = React.useState(false)
        const [selectedIndex, setSelectedIndex] = React.useState(0)
        const [scrollSnapCount, setScrollSnapCount] = React.useState(0)
        const [isAutoPlaying, setIsAutoPlaying] = React.useState(autoPlay)
        const pauseTimeoutRef = React.useRef<number | null>(null)

        const onSelect = React.useCallback((api: CarouselApi) => {
            if (!api) {
                return
            }

            setCanScrollPrev(api.canScrollPrev())
            setCanScrollNext(api.canScrollNext())
            setSelectedIndex(api.selectedScrollSnap())
            setScrollSnapCount(api.scrollSnapList().length)
        }, [])

        const scrollPrev = React.useCallback(() => {
            api?.scrollPrev()
        }, [api])

        const scrollNext = React.useCallback(() => {
            api?.scrollNext()
        }, [api])

        const scrollTo = React.useCallback((index: number) => {
            api?.scrollTo(index)
        }, [api])

        const handleKeyDown = React.useCallback(
            (event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === "ArrowLeft") {
                    event.preventDefault()
                    scrollPrev()
                } else if (event.key === "ArrowRight") {
                    event.preventDefault()
                    scrollNext()
                }
            },
            [scrollPrev, scrollNext]
        )

        React.useEffect(() => {
            setIsAutoPlaying(autoPlay)
        }, [autoPlay])

        React.useEffect(() => {
            if (!api || !setApi) {
                return
            }

            setApi(api)
        }, [api, setApi])

        React.useEffect(() => {
            if (!api) {
                return
            }

            onSelect(api)
            api.on("reInit", onSelect)
            api.on("select", onSelect)

            return () => {
                api?.off("reInit", onSelect)
                api?.off("select", onSelect)
            }
        }, [api, onSelect])

        React.useEffect(() => {
            if (!api || !isAutoPlaying || autoPlayInterval <= 0) {
                return
            }

            const timer = window.setInterval(() => {
                if (api.canScrollNext()) {
                    api.scrollNext()
                } else {
                    api.scrollTo(0)
                }
            }, autoPlayInterval)

            return () => window.clearInterval(timer)
        }, [api, autoPlayInterval, isAutoPlaying])

        const pauseAutoPlayTemporarily = React.useCallback(() => {
            if (!pauseOnHover || !autoPlay) {
                return
            }

            setIsAutoPlaying(false)
            if (pauseTimeoutRef.current) {
                window.clearTimeout(pauseTimeoutRef.current)
            }
            pauseTimeoutRef.current = window.setTimeout(() => {
                setIsAutoPlaying(true)
            }, autoPlayInterval)
        }, [autoPlay, autoPlayInterval, pauseOnHover])

        React.useEffect(() => {
            return () => {
                if (pauseTimeoutRef.current) {
                    window.clearTimeout(pauseTimeoutRef.current)
                }
            }
        }, [])

        return (
            <CarouselContext.Provider
                value={{
                    carouselRef,
                    api: api,
                    opts,
                    orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
                    scrollPrev,
                    scrollNext,
                    scrollTo,
                    canScrollPrev,
                    canScrollNext,
                    selectedIndex,
                    scrollSnapCount,
                    isAutoPlaying,
                    setIsAutoPlaying,
                    autoPlay,
                    autoPlayInterval,
                    pauseOnHover,
                    controls,
                }}
            >
                <div
                    ref={ref}
                    onKeyDown={handleKeyDown}
                    onMouseEnter={pauseAutoPlayTemporarily}
                    onFocusCapture={pauseAutoPlayTemporarily}
                    className={cn("relative w-[640px]", className)}
                    role="region"
                    aria-roledescription="carousel"
                    {...props}
                >
                    {children}
                    {controls ? <CarouselDefaultControls controls={controls} /> : null}
                </div>
            </CarouselContext.Provider>
        )
    }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        viewportClassName?: string
    }
>(({ className, viewportClassName, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel()

    return (
        <div ref={carouselRef} className={cn("overflow-hidden", viewportClassName)}>
            <div
                ref={ref}
                className={cn(
                    "flex",
                    orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
                    className
                )}
                {...props}
            />
        </div>
    )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { orientation } = useCarousel()

    return (
        <div
            ref={ref}
            role="group"
            aria-roledescription="slide"
            className={cn(
                "min-w-0 shrink-0 grow-0 basis-full",
                orientation === "horizontal" ? "pl-4" : "pt-4",
                className
            )}
            {...props}
        />
    )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button> & { label?: string; hideWhenDisabled?: boolean }
>(({ className, variant = "outline", size = "icon", label = "Previous slide", hideWhenDisabled = false, ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()

    if (hideWhenDisabled && !canScrollPrev) {
        return null
    }

    return (
        <TooltipButton
            ref={ref}
            variant={variant}
            size={size}
            tooltip={label}
            className={cn(
                "absolute h-8 w-8 rounded-full",
                orientation === "horizontal"
                    ? "-left-12 top-1/2 -translate-y-1/2"
                    : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
                className
            )}
            disabled={!canScrollPrev}
            aria-label={label}
            onClick={scrollPrev}
            {...props}
        >
            <Icon icon={ChevronLeft} size="sm" />
            <span className="sr-only">{label}</span>
        </TooltipButton>
    )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button> & { label?: string; hideWhenDisabled?: boolean }
>(({ className, variant = "outline", size = "icon", label = "Next slide", hideWhenDisabled = false, ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel()

    if (hideWhenDisabled && !canScrollNext) {
        return null
    }

    return (
        <TooltipButton
            ref={ref}
            variant={variant}
            size={size}
            tooltip={label}
            className={cn(
                "absolute h-8 w-8 rounded-full",
                orientation === "horizontal"
                    ? "-right-12 top-1/2 -translate-y-1/2"
                    : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
                className
            )}
            disabled={!canScrollNext}
            aria-label={label}
            onClick={scrollNext}
            {...props}
        >
            <Icon icon={ChevronRight} size="sm" />
            <span className="sr-only">{label}</span>
        </TooltipButton>
    )
})
CarouselNext.displayName = "CarouselNext"

const CarouselDots = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        label?: string
        getDotLabel?: (index: number) => string
    }
>(({ className, label = "Slide controls", getDotLabel, ...props }, ref) => {
    const { scrollSnapCount, selectedIndex, scrollTo } = useCarousel()

    if (scrollSnapCount <= 1) {
        return null
    }

    return (
        <div
            ref={ref}
            role="tablist"
            aria-label={label}
            className={cn("flex items-center justify-center gap-2", className)}
            {...props}
        >
            {Array.from({ length: scrollSnapCount }).map((_, index) => {
                const active = selectedIndex === index
                const dotLabel = getDotLabel?.(index) ?? `${label} ${index + 1}`

                return (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={active}
                                aria-label={dotLabel}
                                className={cn(
                                    "h-2.5 rounded-full border border-transparent transition-all duration-200",
                                    active
                                        ? "w-7 bg-primary"
                                        : "w-2.5 bg-muted-foreground/35 hover:bg-muted-foreground/60"
                                )}
                                onClick={() => scrollTo(index)}
                            />
                        </TooltipTrigger>
                        <TooltipContent>{dotLabel}</TooltipContent>
                    </Tooltip>
                )
            })}
        </div>
    )
})
CarouselDots.displayName = "CarouselDots"

const CarouselThumbnails = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { label?: string }
>(({ className, label = "Slide thumbnails", ...props }, ref) => {
    const { scrollSnapCount } = useCarousel()

    if (scrollSnapCount <= 1) {
        return null
    }

    return (
        <div
            ref={ref}
            role="tablist"
            aria-label={label}
            className={cn("flex items-center justify-center gap-2 overflow-x-auto py-1", className)}
            {...props}
        />
    )
})
CarouselThumbnails.displayName = "CarouselThumbnails"

const CarouselThumbnail = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        index: number
        label: string
    }
>(({ className, index, label, children, onClick, ...props }, ref) => {
    const { selectedIndex, scrollTo } = useCarousel()
    const active = selectedIndex === index

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    ref={ref}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={label}
                    className={cn(
                        "relative h-14 w-20 shrink-0 overflow-hidden rounded-md border bg-background transition-all",
                        active
                            ? "border-primary-border shadow-sm ring-2 ring-primary-border"
                            : "border-border opacity-70 hover:border-muted-foreground hover:opacity-100",
                        className
                    )}
                    onClick={(event) => {
                        scrollTo(index)
                        onClick?.(event)
                    }}
                    {...props}
                >
                    {children}
                </button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    )
})
CarouselThumbnail.displayName = "CarouselThumbnail"

const CarouselAutoplayToggle = React.forwardRef<
    HTMLButtonElement,
    Omit<React.ComponentProps<typeof TooltipButton>, "tooltip"> & {
        tooltip?: React.ReactNode
        playLabel?: string
        pauseLabel?: string
    }
>(
    (
        {
            playLabel = "Play carousel",
            pauseLabel = "Pause carousel",
            tooltip,
            variant = "secondary",
            size = "icon",
            className,
            ...props
        },
        ref
    ) => {
        const { isAutoPlaying, setIsAutoPlaying } = useCarousel()
        const label = isAutoPlaying ? pauseLabel : playLabel

        return (
            <TooltipButton
                ref={ref}
                type="button"
                variant={variant}
                size={size}
                tooltip={tooltip ?? label}
                aria-label={label}
                aria-pressed={isAutoPlaying}
                className={cn("h-9 w-9 rounded-full", className)}
                onClick={() => setIsAutoPlaying((value) => !value)}
                {...props}
            >
                <Icon icon={isAutoPlaying ? PlayerPause : PlayerPlay} size="sm" />
                <span className="sr-only">{label}</span>
            </TooltipButton>
        )
    }
)
CarouselAutoplayToggle.displayName = "CarouselAutoplayToggle"

function CarouselDefaultControls({ controls }: { controls: true | CarouselControlOptions }) {
    const { autoPlay } = useCarousel()
    const config = controls === true ? {} : controls
    const showNavigation = controls === true ? true : config.navigation === true
    const showDots = controls === true ? true : config.dots === true
    const showAutoplayToggle = controls === true ? Boolean(autoPlay) : config.autoplayToggle === true

    if (!showNavigation && !showDots && !showAutoplayToggle) {
        return null
    }

    return (
        <>
            {showNavigation ? (
                <>
                    <CarouselPrevious
                        label={config.labels?.previous}
                        hideWhenDisabled={config.hideNavigationWhenDisabled}
                        className={config.previousClassName}
                    />
                    <CarouselNext
                        label={config.labels?.next}
                        hideWhenDisabled={config.hideNavigationWhenDisabled}
                        className={config.nextClassName}
                    />
                </>
            ) : null}
            {showDots || showAutoplayToggle ? (
                <div className={cn("mt-4 flex items-center justify-center gap-3", config.className)}>
                    {showDots ? (
                        <CarouselDots
                            label={config.labels?.dots}
                            getDotLabel={config.labels?.getDotLabel}
                            className={config.dotsClassName}
                        />
                    ) : null}
                    {showAutoplayToggle ? (
                        <CarouselAutoplayToggle
                            playLabel={config.labels?.play}
                            pauseLabel={config.labels?.pause}
                            className={config.autoplayToggleClassName}
                        />
                    ) : null}
                </div>
            ) : null}
        </>
    )
}

export {
    type CarouselApi,
    type CarouselControlOptions,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    CarouselDots,
    CarouselThumbnails,
    CarouselThumbnail,
    CarouselAutoplayToggle,
}
