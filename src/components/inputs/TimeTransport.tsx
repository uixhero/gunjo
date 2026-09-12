"use client"

import * as React from "react"
import {
    IconChevronLeft,
    IconChevronRight,
    IconHistory,
    IconPlayerPause,
    IconPlayerPlay,
} from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { LiveBadge } from "../display/LiveBadge"
import { Button } from "./Button"
import { SegmentedControl } from "./SegmentedControl"

/**
 * One named playback speed. The **caller** names the steps, because a design
 * system cannot know what `1` means in the consumer's units — a second of log
 * time, an hour of simulated time, a day of orbital time.
 */
export interface TimeTransportSpeed {
    /** Value handed back by `onSpeedChange`. Distinct within `speeds`. */
    value: number
    /** Visible label (`1×`, `10分/秒`, `Realtime`). */
    label: React.ReactNode
}

/**
 * A fixed-size jump. `offset` is **signed** and added to `value`, so the sign
 * is what makes a button go back or forward — the label never has to say it.
 * Negative offsets render to the left of the transport, positive to the right,
 * each with a direction icon (the kit does not write direction as text arrows).
 */
export interface TimeTransportJump {
    /** Signed amount added to `value`. Negative goes back. */
    offset: number
    /** Visible label — the MAGNITUDE only (`1時間`, `1d`). */
    label: React.ReactNode
}

export interface TimeTransportLabels {
    /** Accessible name for the whole control. Default `"Time transport"`. */
    group?: string
    /** Play button. Default `"Play"`. */
    play?: string
    /** Pause button. Default `"Pause"`. */
    pause?: string
    /** Accessible name for the speed picker. Default `"Playback speed"`. */
    speed?: string
    /** Return-to-now button. Default `"Now"`. */
    returnToNow?: string
    /** State chip while the value sits at `now`. Default `"Live"`. */
    live?: React.ReactNode
    /** State chip while the value is away from `now`. Default `"Not live"`. */
    detached?: React.ReactNode
    /** Accessible name of a back jump, given its label. Default ``` `Back ${label}` ```. */
    jumpBack?: (label: string) => string
    /** Accessible name of a forward jump, given its label. Default ``` `Forward ${label}` ```. */
    jumpForward?: (label: string) => string
}

const DEFAULT_LABELS: Required<TimeTransportLabels> = {
    group: "Time transport",
    play: "Play",
    pause: "Pause",
    speed: "Playback speed",
    returnToNow: "Now",
    live: "Live",
    detached: "Not live",
    jumpBack: (label) => `Back ${label}`,
    jumpForward: (label) => `Forward ${label}`,
}

export interface TimeTransportProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
    /**
     * Where the transport currently sits. Any continuous number — epoch
     * milliseconds is the common case, but a frame index or a simulation tick
     * works the same.
     */
    value: number
    /** Fires with the next position when a jump or the scrubber moves it. */
    onValueChange?: (next: number) => void
    /**
     * The live edge — "now" in the caller's own units. Pass it to get the
     * live/detached state and the return-to-now button; leave it off and
     * neither renders (the component will not guess).
     *
     * ⚠️ Read your clock in an effect, not during render. This component holds
     * no clock precisely so that the server and the first client frame agree.
     */
    now?: number
    /**
     * Force the live/detached state instead of deriving it from `now`. Use it
     * when "live" means something the distance between two numbers cannot say
     * (a stream that is live but buffered, a paused feed sitting at the edge).
     */
    live?: boolean
    /** How close to `now` still counts as live. Default `1000` (1s at epoch ms). */
    liveTolerance?: number
    /**
     * Called by the return-to-now button. Defaults to `onValueChange(now)` when
     * both are available, so the common case needs no extra handler.
     */
    onReturnToNow?: () => void
    /** Whether playback is running. Controlled — the caller owns the ticking. */
    playing?: boolean
    /** Fires with the requested play state. Omit to hide the play/pause button. */
    onPlayingChange?: (playing: boolean) => void
    /** Named speed steps. Omit to hide the speed picker. */
    speeds?: TimeTransportSpeed[]
    /** The selected speed — matched against `speeds[].value`. */
    speed?: number
    /** Fires with the chosen speed. */
    onSpeedChange?: (speed: number) => void
    /** Fixed jumps, in the order given. Omit to hide the jump buttons. */
    jumps?: TimeTransportJump[]
    /** The big readout. Default is `String(value)` — pass a formatter for dates. */
    formatValue?: (value: number) => React.ReactNode
    /** Second line under the readout (a date, a timezone, an elapsed count). */
    secondary?: React.ReactNode
    /**
     * The scrub surface — a `DayBand` or any band that reports a position.
     * Rendered full width between the readout and the transport row.
     */
    scrubber?: React.ReactNode
    /** Overrides for every built-in string. */
    labels?: TimeTransportLabels
    /** Disable the whole transport. */
    disabled?: boolean
}

/**
 * TimeTransport — the playback / scrub transport for a continuous value: a
 * large readout of where you are, play-pause, named speed steps, signed jump
 * buttons, a live-vs-detached state and a one-press return to now.
 *
 * The generalisation is **"move a continuous value in graded steps, and get
 * back to live"** — log replay, rewinding a monitoring board, stepping a
 * simulation clock, scrubbing a recording, and the globe time controls it was
 * extracted from.
 *
 * ⭐ **It holds no clock.** `value` comes in and `onValueChange` goes out, so
 * the caller owns the ticking, the server and the first client frame agree, and
 * a test can hold time still. (Same rule as `Stringline`.)
 *
 * Use `Slider` / `RangeSlider` to pick a value with no playback, `TimePicker` /
 * `DatePicker` / `Calendar` to pick an absolute instant, and `Timeline` /
 * `Stringline` / `Gantt` to display time without taking input.
 */
const TimeTransport = React.forwardRef<HTMLDivElement, TimeTransportProps>(
    (
        {
            className,
            value,
            onValueChange,
            now,
            live,
            liveTolerance = 1000,
            onReturnToNow,
            playing = false,
            onPlayingChange,
            speeds,
            speed,
            onSpeedChange,
            jumps,
            formatValue,
            secondary,
            scrubber,
            labels,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const t = { ...DEFAULT_LABELS, ...labels }

        // `null` means "cannot be known" — no `now` and no explicit `live`. The
        // state chip and the return button both stay out rather than guessing.
        const isLive: boolean | null =
            live ?? (now == null ? null : Math.abs(value - now) <= liveTolerance)

        const canReturn = Boolean(onReturnToNow) || (now != null && Boolean(onValueChange))
        const returnToNow = () => {
            if (onReturnToNow) return onReturnToNow()
            if (now != null) onValueChange?.(now)
        }

        const back = (jumps ?? []).filter((j) => j.offset < 0)
        const forward = (jumps ?? []).filter((j) => j.offset > 0)

        const renderJump = (jump: TimeTransportJump, index: number) => {
            const isBack = jump.offset < 0
            const text = typeof jump.label === "string" ? jump.label : String(jump.offset)
            return (
                <Button
                    key={`${isBack ? "b" : "f"}-${index}-${jump.offset}`}
                    type="button"
                    variant="outline"
                    size="touch"
                    disabled={disabled || !onValueChange}
                    aria-label={isBack ? t.jumpBack(text) : t.jumpForward(text)}
                    onClick={() => onValueChange?.(value + jump.offset)}
                    className="gap-1 px-3"
                >
                    {isBack ? (
                        <IconChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : null}
                    {jump.label}
                    {isBack ? null : (
                        <IconChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    )}
                </Button>
            )
        }

        return (
            <div
                ref={ref}
                role="group"
                aria-label={t.group}
                className={cn(
                    "flex w-full flex-col gap-3 rounded-[var(--radius)] border border-border bg-card p-4 text-card-foreground",
                    disabled && "opacity-60",
                    className
                )}
                {...props}
            >
                {/* Readout. Deliberately NOT recoloured when detached: the
                    semantic tones do not reach contrast as text on a card
                    background (#859), and the labelled chip beside it already
                    states the state in words. */}
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <div className="min-w-0">
                        <div className="font-mono text-2xl leading-none tabular-nums text-foreground">
                            {formatValue ? formatValue(value) : String(value)}
                        </div>
                        {secondary ? (
                            <div className="mt-1.5 truncate text-xs text-muted-foreground">
                                {secondary}
                            </div>
                        ) : null}
                    </div>

                    {isLive === null ? null : (
                        // The same pill everything else on a board uses for
                        // "this is the current value" — including the pulsing
                        // dot. Keeping a lookalike here would mean two places
                        // to fix the next time the live state changes shape.
                        <LiveBadge live={isLive} detached={t.detached} className="shrink-0">
                            {t.live}
                        </LiveBadge>
                    )}
                </div>

                {scrubber ? <div className="w-full">{scrubber}</div> : null}

                {/* Transport. Back jumps, play/pause, forward jumps, return to now. */}
                <div className="flex flex-wrap items-center gap-2">
                    {back.map(renderJump)}

                    {onPlayingChange ? (
                        <Button
                            type="button"
                            variant={playing ? "primary" : "outline"}
                            size="icon-touch"
                            disabled={disabled}
                            aria-pressed={playing}
                            aria-label={playing ? t.pause : t.play}
                            onClick={() => onPlayingChange(!playing)}
                        >
                            {playing ? (
                                <IconPlayerPause className="h-5 w-5" aria-hidden="true" />
                            ) : (
                                <IconPlayerPlay className="h-5 w-5" aria-hidden="true" />
                            )}
                        </Button>
                    ) : null}

                    {forward.map(renderJump)}

                    {canReturn ? (
                        // Set apart by fill, not by position. `ml-auto` looked
                        // right until the row wrapped, and then the button was
                        // stranded alone against the right edge — which happens
                        // at any panel width a phone actually has.
                        <Button
                            type="button"
                            variant="secondary"
                            size="touch"
                            className="gap-1.5 px-3"
                            disabled={disabled || isLive === true}
                            onClick={returnToNow}
                        >
                            <IconHistory className="h-4 w-4 shrink-0" aria-hidden="true" />
                            {t.returnToNow}
                        </Button>
                    ) : null}
                </div>

                {speeds && speeds.length > 0 ? (
                    // Scrolls rather than squeezes. `fullWidth` would give every
                    // segment `flex-1` + `truncate`, and six steps of "1時間/秒"
                    // then render as "1時…" — a speed you cannot read is not a
                    // speed you can pick.
                    <div className="-mx-1 overflow-x-auto px-1 pb-1">
                        <SegmentedControl
                            aria-label={t.speed}
                            // `lg` is the ≥44px touch size. The speed steps are
                            // tapped as often as the transport buttons, so they
                            // hold the same line (#837).
                            size="lg"
                            fullWidth={false}
                            disabled={disabled}
                            className="w-max"
                            value={speed == null ? undefined : String(speed)}
                            options={speeds.map((s) => ({
                                value: String(s.value),
                                label: s.label,
                            }))}
                            onValueChange={(next) => onSpeedChange?.(Number(next))}
                        />
                    </div>
                ) : null}
            </div>
        )
    }
)
TimeTransport.displayName = "TimeTransport"

export { TimeTransport }
