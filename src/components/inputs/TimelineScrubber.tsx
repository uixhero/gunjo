"use client"

import * as React from "react"
import { IconPlayerPauseFilled, IconPlayerPlayFilled } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Badge } from "../display/Badge"
import { Button } from "./Button"

/** One frame on the scale: a radar image, a forecast hour, a log snapshot. */
export interface TimelineScrubberStep {
    /** Short time text: shown under a major tick, in the header and read aloud. */
    label: string
    /** A longer tick with its label above it (on the hour, every 30 minutes). */
    major?: boolean
    /** Not loaded yet: the tick is drawn faint. The step can still be selected. */
    pending?: boolean
}

export interface TimelineScrubberLabels {
    /** Accessible name of the scale. Default `"Time"`. */
    scrubber?: string
    /** Word for a step at or before `lastObservedIndex`. Default `"Observed"`. */
    observed?: string
    /** Word for a step after it. Default `"Forecast"`. */
    forecast?: string
    /** Default `"Play"`. */
    play?: string
    /** Default `"Pause"`. */
    pause?: string
}

export interface TimelineScrubberProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
    /** The frames, oldest first. */
    steps: TimelineScrubberStep[]
    /** Index of the step being shown. */
    value: number
    onValueChange: (index: number) => void
    /**
     * Index of the last step that was measured. Later steps are a forecast:
     * their ticks change colour, a dashed line marks the boundary and the
     * header says which side you are on. Default: the last step (no forecast).
     */
    lastObservedIndex?: number
    /** Controlled playback. Leave it out to let the scrubber keep its own. */
    playing?: boolean
    onPlayingChange?: (playing: boolean) => void
    /** Milliseconds between steps while playing. Default 300. */
    stepInterval?: number
    /** Show the play / pause button. Default true. */
    playable?: boolean
    /** Distance between two ticks, in px. Default 28. */
    stepWidth?: number
    /** Steps moved by PageUp / PageDown. Default 6. */
    pageStep?: number
    /** Show the row above the scale (observed / forecast, the time, play). Default true. */
    showHeader?: boolean
    labels?: TimelineScrubberLabels
}

const DEFAULT_LABELS: Required<TimelineScrubberLabels> = {
    scrubber: "Time",
    observed: "Observed",
    forecast: "Forecast",
    play: "Play",
    pause: "Pause",
}

/** Labels closer than this (px) to the previous one are left out. */
const MIN_LABEL_GAP = 44
/** A pointer that moves less than this (px) between down and up is a tap. */
const TAP_SLOP = 4

const EDGE_FADE =
    "linear-gradient(90deg, transparent, black 11%, black 89%, transparent)"

function clampIndex(index: number, count: number) {
    return Math.min(Math.max(index, 0), Math.max(count - 1, 0))
}

/**
 * TimelineScrubber — one scale that runs from the past into the future, with
 * the selected moment fixed in the middle and the scale sliding under it.
 *
 * ⭐ **The centre never moves.** Dragging slides the ticks, so the moment you
 * are looking at stays where your eye already is, and the ends fade out to
 * say "there is more this way". Tap a tick to jump to it.
 *
 * ⭐ **Measured and forecast are told apart three ways**, never by colour
 * alone: the header names the side ("Observed" / "Forecast"), the boundary is
 * a dashed line, and the ticks and the centre marker change colour.
 *
 * Playback steps forward every `stepInterval` ms and stops at the last step.
 * It owns that timer only; it never reads the clock, so what "now" is stays
 * the caller's decision (the TimeTransport rule). Dragging pauses it.
 */
const TimelineScrubber = React.forwardRef<HTMLDivElement, TimelineScrubberProps>(
    (
        {
            className,
            steps,
            value,
            onValueChange,
            lastObservedIndex,
            playing: playingProp,
            onPlayingChange,
            stepInterval = 300,
            playable = true,
            stepWidth = 28,
            pageStep = 6,
            showHeader = true,
            labels: labelsProp,
            ...props
        },
        ref
    ) => {
        const labels = { ...DEFAULT_LABELS, ...labelsProp }
        const count = steps.length
        const index = clampIndex(value, count)
        const lastObserved = clampIndex(lastObservedIndex ?? count - 1, count)
        const isForecast = count > 0 && index > lastObserved
        const phase = isForecast ? labels.forecast : labels.observed

        const [playingState, setPlayingState] = React.useState(false)
        const playing = playingProp ?? playingState
        const setPlaying = React.useCallback(
            (next: boolean) => {
                if (playingProp === undefined) setPlayingState(next)
                onPlayingChange?.(next)
            },
            [playingProp, onPlayingChange]
        )

        // While a finger is down the scale follows it between steps.
        const [dragPos, setDragPos] = React.useState<number | null>(null)
        const drag = React.useRef<{ x: number; from: number; moved: boolean } | null>(null)
        const position = dragPos ?? index

        // The playback timer reads the latest index and callback without
        // restarting on every step.
        const indexRef = React.useRef(index)
        const changeRef = React.useRef(onValueChange)
        React.useEffect(() => {
            indexRef.current = index
            changeRef.current = onValueChange
        })

        React.useEffect(() => {
            if (!playing || count === 0) return
            const timer = window.setInterval(() => {
                const next = indexRef.current + 1
                if (next > count - 1) {
                    setPlaying(false)
                    return
                }
                changeRef.current(next)
            }, stepInterval)
            return () => window.clearInterval(timer)
        }, [playing, count, stepInterval, setPlaying])

        const labelled = React.useMemo(() => {
            const shown = new Set<number>()
            let last = -Infinity
            steps.forEach((step, i) => {
                if (!step.major) return
                const x = i * stepWidth
                if (x - last < MIN_LABEL_GAP) return
                shown.add(i)
                last = x
            })
            return shown
        }, [steps, stepWidth])

        const go = (next: number) => {
            const target = clampIndex(next, count)
            if (target !== index) onValueChange(target)
        }

        const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
            const moves: Record<string, number> = {
                ArrowLeft: index - 1,
                ArrowDown: index - 1,
                ArrowRight: index + 1,
                ArrowUp: index + 1,
                PageDown: index - pageStep,
                PageUp: index + pageStep,
                Home: 0,
                End: count - 1,
            }
            if (!(event.key in moves) || count === 0) return
            event.preventDefault()
            if (playing) setPlaying(false)
            go(moves[event.key])
        }

        const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
            if (count === 0 || (event.pointerType === "mouse" && event.button !== 0)) return
            event.currentTarget.setPointerCapture(event.pointerId)
            drag.current = { x: event.clientX, from: index, moved: false }
            if (playing) setPlaying(false)
        }

        const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
            const state = drag.current
            if (!state) return
            const dx = event.clientX - state.x
            if (!state.moved && Math.abs(dx) < TAP_SLOP) return
            state.moved = true
            const pos = Math.min(Math.max(state.from - dx / stepWidth, 0), count - 1)
            setDragPos(pos)
            go(Math.round(pos))
        }

        const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
            const state = drag.current
            drag.current = null
            setDragPos(null)
            if (!state || state.moved) return
            // A tap: jump to the tick under the pointer.
            const rect = event.currentTarget.getBoundingClientRect()
            const offset = event.clientX - (rect.left + rect.width / 2)
            go(index + Math.round(offset / stepWidth))
        }

        const handlePointerCancel = () => {
            drag.current = null
            setDragPos(null)
        }

        const togglePlay = () => {
            if (!playing && index >= count - 1) onValueChange(0)
            setPlaying(!playing)
        }

        const current = steps[index]

        return (
            <div ref={ref} className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...props}>
                {showHeader ? (
                    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
                        <div className="flex min-w-0 justify-start">
                            {count > 0 ? (
                                <Badge variant={isForecast ? "warning" : "success"} size="sm">
                                    {phase}
                                </Badge>
                            ) : null}
                        </div>
                        <div className="font-mono text-2xl tabular-nums leading-none text-foreground" aria-hidden>
                            {current?.label ?? "—"}
                        </div>
                        <div className="flex min-w-0 justify-end">
                            {playable ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon-touch"
                                    className="rounded-full"
                                    onClick={togglePlay}
                                    disabled={count < 2}
                                    aria-label={playing ? labels.pause : labels.play}
                                >
                                    {playing ? (
                                        <IconPlayerPauseFilled className="h-4 w-4" aria-hidden />
                                    ) : (
                                        <IconPlayerPlayFilled className="h-4 w-4" aria-hidden />
                                    )}
                                </Button>
                            ) : null}
                        </div>
                    </div>
                ) : null}

                <div
                    role="slider"
                    tabIndex={count > 0 ? 0 : -1}
                    aria-label={labels.scrubber}
                    aria-valuemin={0}
                    aria-valuemax={Math.max(count - 1, 0)}
                    aria-valuenow={index}
                    aria-valuetext={current ? `${current.label} · ${phase}` : undefined}
                    aria-disabled={count === 0 || undefined}
                    className={cn(
                        "relative h-12 w-full touch-pan-y select-none overflow-hidden rounded-md outline-none",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        count > 0 && (dragPos === null ? "cursor-grab" : "cursor-grabbing")
                    )}
                    style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
                    onKeyDown={handleKeyDown}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                >
                    {/* The track slides; x = 0 is the first step. */}
                    <div
                        aria-hidden
                        className={cn(
                            "absolute inset-y-0 left-1/2",
                            dragPos === null && "transition-transform duration-150 ease-out motion-reduce:transition-none"
                        )}
                        style={{ transform: `translateX(${-position * stepWidth}px)` }}
                    >
                        {steps.map((step, i) => {
                            const forecast = i > lastObserved
                            const showLabel = labelled.has(i)
                            return (
                                <React.Fragment key={i}>
                                    {showLabel ? (
                                        <span
                                            className="absolute top-0.5 -translate-x-1/2 whitespace-nowrap font-mono text-xs tabular-nums text-muted-foreground"
                                            style={{ left: i * stepWidth }}
                                        >
                                            {step.label}
                                        </span>
                                    ) : null}
                                    <span
                                        className={cn(
                                            "absolute bottom-1.5 -translate-x-1/2 rounded-full",
                                            step.major ? "h-4 w-0.5" : "h-3 w-px",
                                            step.pending
                                                ? "bg-muted-foreground/30"
                                                : forecast
                                                  ? "bg-warning/70"
                                                  : "bg-foreground/60"
                                        )}
                                        style={{ left: i * stepWidth }}
                                    />
                                </React.Fragment>
                            )
                        })}
                        {lastObserved < count - 1 ? (
                            <span
                                className="absolute bottom-0.5 top-5 w-px -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,hsl(var(--warning))_0_2px,transparent_2px_5px)] opacity-70"
                                style={{ left: (lastObserved + 0.5) * stepWidth }}
                            />
                        ) : null}
                    </div>

                    {/* The centre: always the step being shown. */}
                    {count > 0 ? (
                        <span aria-hidden className="pointer-events-none absolute bottom-0.5 left-1/2 top-[18px] flex -translate-x-1/2 flex-col items-center">
                            <span
                                className={cn(
                                    "h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent",
                                    isForecast ? "border-t-warning" : "border-t-success"
                                )}
                            />
                            <span className={cn("w-[3px] flex-1 rounded-full", isForecast ? "bg-warning" : "bg-success")} />
                        </span>
                    ) : null}
                </div>
            </div>
        )
    }
)
TimelineScrubber.displayName = "TimelineScrubber"

export { TimelineScrubber }
