"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ChartColor, ChartTone } from "../display/chart-utils"

/**
 * One stretch of the day, drawn as a surface. The caller decides what the
 * stretches mean — night / twilight / day, off-shift / handover / on-shift,
 * closed / open — because the band has no idea what a day contains.
 *
 * ⚠️ A stretch that crosses midnight is **two** phases (22:00–24:00 and
 * 00:00–06:00), not one with `start > end`. A single band is a single day.
 */
export interface DayBandPhase {
    /** Where the stretch starts, in the same unit as `min` / `max`. */
    start: number
    /** Where it ends. Must be greater than `start`. */
    end: number
    /**
     * What the stretch is. Reaches a screen reader through `aria-valuetext`
     * ("05:12 · Twilight") and a pointer through the native tooltip, so the
     * meaning of a colour is never colour-only.
     */
    label?: React.ReactNode
    /**
     * A tone (`"success"`, `"info"`, …) or any CSS colour. Tones resolve to the
     * **subtle surface** token, not the strong one — a phase is a background,
     * and the marks and the thumb have to stay readable on top of it. Pass a
     * raw CSS colour when the ramp is artwork (a sky gradient, a brand band).
     */
    color?: ChartColor
}

/** A moment worth naming: sunrise, a shift change, the start of a window. */
export interface DayBandMark {
    /** Where it sits, in the same unit as `min` / `max`. */
    at: number
    /** Visible text above the band. Omit for a bare line. */
    label?: React.ReactNode
    /** Tone or CSS colour of the line. The label itself is never recoloured. */
    color?: ChartColor
}

export interface DayBandLabels {
    /** Accessible name of the band. Default `"Time of day"`. */
    band?: string
    /** Name of the `now` marker. Default `"Now"`. */
    now?: React.ReactNode
}

const DEFAULT_LABELS: Required<DayBandLabels> = {
    band: "Time of day",
    now: "Now",
}

/**
 * Tones resolve to the **subtle surface** tokens. A phase sits underneath the
 * marks, the hour ticks and the thumb, so the strong tone would win a fight it
 * is not supposed to be in.
 */
const PHASE_SURFACES: Record<ChartTone, string> = {
    primary: "hsl(var(--primary-subtle))",
    info: "hsl(var(--info-subtle))",
    success: "hsl(var(--success-subtle))",
    warning: "hsl(var(--warning-subtle))",
    destructive: "hsl(var(--destructive-subtle))",
    accent: "hsl(var(--accent))",
    muted: "hsl(var(--muted))",
}

/** Mark lines are drawn ON the phases, so these are the full-strength tones. */
const MARK_INKS: Record<ChartTone, string> = {
    primary: "hsl(var(--primary))",
    info: "hsl(var(--info))",
    success: "hsl(var(--success))",
    warning: "hsl(var(--warning))",
    destructive: "hsl(var(--destructive))",
    accent: "hsl(var(--accent-foreground))",
    muted: "hsl(var(--muted-foreground))",
}

const warnedPhases = new Set<string>()

function warnOnce(key: string, message: string) {
    if (process.env.NODE_ENV === "production") return
    if (warnedPhases.has(key)) return
    warnedPhases.add(key)
    console.warn(`[gunjo] DayBand: ${message}`)
}

function resolveColor(
    color: ChartColor | undefined,
    table: Record<ChartTone, string>,
    fallback: string
) {
    if (!color) return fallback
    return table[color as ChartTone] ?? color
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

const pad2 = (n: number) => String(n).padStart(2, "0")

/**
 * The default readout. The band is one day wide **by definition**, so the
 * position within it is a clock time whatever the unit happens to be — minutes
 * from midnight, epoch milliseconds, or ticks of a simulation.
 */
function formatDayClock(ratio: number) {
    const minutes = Math.round(clamp01(ratio) * 1440)
    return `${pad2(Math.floor(minutes / 60))}:${pad2(minutes % 60)}`
}

export interface DayBandProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
    /**
     * Where the day starts, in the caller's own unit. Minutes from midnight
     * (the default `0`) and epoch milliseconds of local midnight are both
     * common.
     */
    min?: number
    /** Where the day ends. Default `1440` — minutes from midnight. */
    max?: number
    /** The position the thumb marks. Omit for a band that only displays. */
    value?: number
    /**
     * Fires with the next position while the band is scrubbed. Omit it and the
     * band is display-only: no thumb interaction, no slider role, no focus.
     */
    onValueChange?: (next: number) => void
    /** The stretches of the day, drawn as surfaces underneath everything else. */
    phases?: DayBandPhase[]
    /** Named moments drawn as lines over the phases. */
    marks?: DayBandMark[]
    /**
     * The live edge, in the same unit. Drawn as its own marker so the position
     * you scrubbed away from stays findable.
     *
     * ⚠️ Read your clock in an effect, not during render — this component holds
     * no clock precisely so that the server and the first client frame agree
     * (the same rule as `TimeTransport` and `Stringline`).
     */
    now?: number
    /** Arrow-key step. Default: 1/96 of the day (15 minutes). */
    step?: number
    /** Shift-arrow and page step. Default: 1/24 of the day (1 hour). */
    coarseStep?: number
    /**
     * How a pointer moves the band.
     *
     * - `"absolute"` (default) — the position you press is the position you get.
     *   One tap reaches any hour.
     * - `"relative"` — press anywhere and drag; the value moves by how far you
     *   dragged. Your finger never covers the position you are reading, and a
     *   stray tap changes nothing. This is what the globe controls this came
     *   from settled on for a band only 38px tall — and it is the mode that can
     *   roll past midnight, so it emits values outside `min`…`max` and expects
     *   the caller to re-base the day.
     */
    scrub?: "absolute" | "relative"
    /** Hours between the tick lines inside the band. `0` hides them. Default `3`. */
    tickEvery?: number
    /** Which hours get a number under the band. `[]` hides the row. Default `[0, 6, 12, 18, 24]`. */
    hourLabels?: number[]
    /** Formats an hour number. Default `String(hour)` — no unit, so it travels. */
    formatHour?: (hour: number) => React.ReactNode
    /** Formats the position for `aria-valuetext`. Default is `HH:MM` within the day. */
    formatValue?: (value: number) => string
    /** Band height. `default` is the 44px touch size; `sm` (24px) is for display-only bands. */
    size?: "sm" | "default"
    /** Text above the band, on the left (a place, a date, a person). */
    label?: React.ReactNode
    /** Text above the band, on the right (the current time, a note, a total). */
    hint?: React.ReactNode
    /** Overrides for the built-in strings. */
    labels?: DayBandLabels
    /** Greys the band out and takes it out of the tab order. */
    disabled?: boolean
}

/**
 * DayBand — one day as a single horizontal surface: coloured stretches (night,
 * twilight, day; off-shift, handover, on-shift; closed, open), named marks at
 * the moments that matter, the live edge, and a thumb you can scrub.
 *
 * The generalisation is **"show where you are inside a day, as a surface"** —
 * duty rosters, operating windows, opening hours, and the day/night band it was
 * extracted from.
 *
 * ⭐ **It computes nothing about the day.** Sunrise and sunset are times the
 * caller passes in as `marks`, phases are stretches the caller passes in, and
 * `now` is a number the caller reads from its own clock. No astronomy, no
 * timers, no locale assumptions inside the component.
 *
 * Drop it into `TimeTransport`'s `scrubber` slot to get a transport with a day
 * to scrub across. Use `Slider` for a plain value, `SegmentTimelineCard` for an
 * arbitrary window rather than one day, and `WeekView` / `ScheduleGrid` when
 * there is more than one day to show.
 */
const DayBand = React.forwardRef<HTMLDivElement, DayBandProps>(
    (
        {
            className,
            min = 0,
            max = 1440,
            value,
            onValueChange,
            phases,
            marks,
            now,
            step,
            coarseStep,
            scrub = "absolute",
            tickEvery = 3,
            hourLabels = [0, 6, 12, 18, 24],
            formatHour,
            formatValue,
            size = "default",
            label,
            hint,
            labels,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const t = { ...DEFAULT_LABELS, ...labels }
        const trackRef = React.useRef<HTMLDivElement>(null)
        const labelRowRef = React.useRef<HTMLDivElement>(null)
        // Which mark labels had to give up their text because a label declared
        // earlier already occupies that space. Measured, because how wide
        // "Sunrise 05:22" renders is a font question CSS cannot answer.
        const [crowdedOut, setCrowdedOut] = React.useState<boolean[]>([])
        // A drag that started as a touch does not commit on press: the gesture
        // may still turn into a page scroll, and a band that seeks while you
        // scroll past it is a band nobody trusts. Mouse and pen commit at once.
        const drag = React.useRef<{ id: number; x: number; base: number; moved: boolean } | null>(
            null
        )

        const span = max - min > 0 ? max - min : 1
        const interactive = Boolean(onValueChange) && !disabled

        const ratioOf = (v: number) => (v - min) / span
        const pctOf = (v: number) => clamp01(ratioOf(v)) * 100

        const fineStep = step ?? span / 96
        const bigStep = coarseStep ?? span / 24

        const readout = (v: number) => formatValue?.(v) ?? formatDayClock(ratioOf(v))

        const phaseAt = (v: number) =>
            (phases ?? []).find((p) => v >= p.start && v < p.end && p.end > p.start)

        const commit = (next: number, clamp: boolean) => {
            if (!onValueChange) return
            onValueChange(clamp ? Math.min(max, Math.max(min, next)) : next)
        }

        const valueAtClientX = (clientX: number) => {
            const el = trackRef.current
            if (!el) return null
            const rect = el.getBoundingClientRect()
            if (rect.width <= 0) return null
            return min + clamp01((clientX - rect.left) / rect.width) * span
        }

        const moveBy = (clientX: number) => {
            const el = trackRef.current
            const state = drag.current
            if (!el || !state) return
            if (scrub === "relative") {
                const rect = el.getBoundingClientRect()
                if (rect.width <= 0) return
                // Unclamped on purpose: dragging past midnight rolls into the
                // next day, and the caller re-bases `min` / `max`. Stopping at
                // the edge reads as broken.
                commit(state.base + ((clientX - state.x) / rect.width) * span, false)
                return
            }
            const next = valueAtClientX(clientX)
            if (next != null) commit(next, true)
        }

        const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
            if (!interactive || event.button !== 0) return
            drag.current = {
                id: event.pointerId,
                x: event.clientX,
                base: value ?? min,
                moved: false,
            }
            try {
                event.currentTarget.setPointerCapture(event.pointerId)
            } catch {
                // Capture is a nicety; the move handler works without it.
            }
            event.currentTarget.focus({ preventScroll: true })
            if (scrub === "absolute" && event.pointerType !== "touch") {
                const next = valueAtClientX(event.clientX)
                if (next != null) commit(next, true)
            }
        }

        const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
            const state = drag.current
            if (!state || state.id !== event.pointerId) return
            state.moved = true
            moveBy(event.clientX)
        }

        const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
            const state = drag.current
            if (!state || state.id !== event.pointerId) return
            drag.current = null
            // A touch that never moved was a deliberate tap, not a scroll.
            if (scrub === "absolute" && !state.moved && event.pointerType === "touch") {
                const next = valueAtClientX(event.clientX)
                if (next != null) commit(next, true)
            }
        }

        const onPointerCancel = () => {
            // The browser took the gesture (a page scroll). Commit nothing.
            drag.current = null
        }

        const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (!interactive) return
            const current = value ?? min
            const delta = event.shiftKey ? bigStep : fineStep
            let next: number | null = null
            switch (event.key) {
                case "ArrowLeft":
                case "ArrowDown":
                    next = current - delta
                    break
                case "ArrowRight":
                case "ArrowUp":
                    next = current + delta
                    break
                case "PageDown":
                    next = current - bigStep
                    break
                case "PageUp":
                    next = current + bigStep
                    break
                case "Home":
                    next = min
                    break
                case "End":
                    next = max
                    break
                default:
                    return
            }
            event.preventDefault()
            commit(next, true)
        }

        // Labels are laid out at their own position and never moved, so the only
        // honest answer to a collision is to drop one. Declaration order is the
        // priority: the caller's own marks keep their text, and the `now` label
        // (appended last) is the first to go. The line always stays.
        const measureLabels = React.useCallback(() => {
            const row = labelRowRef.current
            if (!row) return
            const rects = [...row.children].map((span) => span.getBoundingClientRect())
            const kept: Array<{ left: number; right: number }> = []
            const next = rects.map((rect) => {
                if (rect.width === 0) return false
                const clash = kept.some(
                    (box) => rect.left < box.right + 6 && rect.right + 6 > box.left
                )
                if (!clash) kept.push({ left: rect.left, right: rect.right })
                return clash
            })
            // Returning the current array when nothing changed lets React bail
            // out, so this settles in one extra pass instead of looping.
            setCrowdedOut((current) =>
                current.length === next.length && current.every((v, i) => v === next[i])
                    ? current
                    : next
            )
        }, [])

        React.useLayoutEffect(measureLabels)

        React.useEffect(() => {
            const row = labelRowRef.current
            if (!row || typeof ResizeObserver === "undefined") return
            const observer = new ResizeObserver(() => measureLabels())
            observer.observe(row)
            return () => observer.disconnect()
        }, [measureLabels])

        const ticks: number[] = []
        if (tickEvery > 0) {
            for (let h = tickEvery; h < 24; h += tickEvery) ticks.push(h)
        }

        const activePhase = value == null ? undefined : phaseAt(value)
        const valueText =
            value == null
                ? undefined
                : [readout(value), typeof activePhase?.label === "string" ? activePhase.label : null]
                      .filter(Boolean)
                      .join(" · ")

        const allMarks: DayBandMark[] = [
            ...(marks ?? []),
            ...(now == null ? [] : [{ at: now, label: t.now, color: "success" as ChartColor }]),
        ].filter((m) => m.at >= min && m.at <= max)

        const labelledMarks = allMarks.filter((m) => m.label != null && m.label !== "")

        // The band itself never reads as a text row, so its accessible name has
        // to carry what it is even when nothing is scrubbable.
        const summary = [
            typeof label === "string" ? label : null,
            t.band,
            value == null ? null : valueText,
        ]
            .filter(Boolean)
            .join(" — ")

        return (
            <div
                ref={ref}
                className={cn("w-full", disabled && "opacity-60", className)}
                {...props}
            >
                {label != null || hint != null ? (
                    <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
                        <span className="min-w-0 truncate font-medium text-foreground">{label}</span>
                        <span className="min-w-0 truncate tabular-nums text-muted-foreground">
                            {hint}
                        </span>
                    </div>
                ) : null}

                {labelledMarks.length > 0 ? (
                    // Mark labels live ABOVE the band and hour numbers below it,
                    // so the two rows can never collide — the source app packed
                    // both into one row and had to hide hour numbers that came
                    // within 48px of a mark.
                    <div
                        ref={labelRowRef}
                        className="relative mb-1 h-4 text-xs leading-4 text-foreground"
                    >
                        {labelledMarks.map((mark, index) => {
                            const pct = pctOf(mark.at)
                            return (
                                <span
                                    key={`mark-label-${index}-${mark.at}`}
                                    className="absolute top-0 whitespace-nowrap"
                                    style={{
                                        left: `${pct}%`,
                                        // Pinned inside the band at both ends so
                                        // a 00:0x mark cannot push the document
                                        // sideways on a narrow screen.
                                        transform: `translateX(${-pct}%)`,
                                        // `visibility`, not unmounting: a dropped
                                        // label keeps its box, so the next measure
                                        // reads the same geometry and the row
                                        // cannot oscillate.
                                        visibility: crowdedOut[index] ? "hidden" : undefined,
                                    }}
                                    aria-hidden={crowdedOut[index] || undefined}
                                >
                                    {mark.label}
                                </span>
                            )
                        })}
                    </div>
                ) : null}

                <div
                    ref={trackRef}
                    role={interactive ? "slider" : "img"}
                    tabIndex={interactive ? 0 : undefined}
                    aria-label={interactive ? t.band : summary}
                    aria-orientation={interactive ? "horizontal" : undefined}
                    aria-valuemin={interactive ? min : undefined}
                    aria-valuemax={interactive ? max : undefined}
                    aria-valuenow={
                        interactive && value != null
                            ? Math.min(max, Math.max(min, value))
                            : undefined
                    }
                    aria-valuetext={interactive ? valueText : undefined}
                    aria-disabled={disabled || undefined}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerCancel}
                    onKeyDown={onKeyDown}
                    className={cn(
                        "relative w-full overflow-hidden rounded-[var(--radius)] border border-border bg-muted",
                        size === "sm" ? "h-6" : "h-11",
                        // `pan-y` and not `none`: a vertical swipe that begins on
                        // the band still scrolls the page.
                        interactive &&
                            "cursor-grab touch-pan-y select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:cursor-grabbing",
                        disabled && "cursor-not-allowed"
                    )}
                >
                    {(phases ?? []).map((phase, index) => {
                        if (!(phase.end > phase.start)) {
                            warnOnce(
                                `phase-${phase.start}-${phase.end}`,
                                `a phase needs end > start (got ${phase.start}…${phase.end}). A stretch that crosses midnight is two phases.`
                            )
                            return null
                        }
                        const left = pctOf(phase.start)
                        const width = pctOf(phase.end) - left
                        if (width <= 0) return null
                        return (
                            <div
                                key={`phase-${index}-${phase.start}`}
                                className="absolute inset-y-0"
                                style={{
                                    left: `${left}%`,
                                    width: `${width}%`,
                                    backgroundColor: resolveColor(
                                        phase.color,
                                        PHASE_SURFACES,
                                        "hsl(var(--muted))"
                                    ),
                                }}
                                title={
                                    typeof phase.label === "string" ? phase.label : undefined
                                }
                            />
                        )
                    })}

                    {ticks.map((hour) => (
                        <div
                            key={`tick-${hour}`}
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-0 h-1.5 w-px bg-foreground/25"
                            style={{ left: `${(hour / 24) * 100}%` }}
                        />
                    ))}

                    {allMarks.map((mark, index) => {
                        const pct = pctOf(mark.at)
                        return (
                            <div
                                key={`mark-${index}-${mark.at}`}
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-y-0 w-0.5 rounded-full"
                                style={{
                                    left: `${pct}%`,
                                    // The track clips, so a line at either end
                                    // slides fully inside instead of showing a
                                    // half-width sliver.
                                    transform: `translateX(${-pct}%)`,
                                    backgroundColor: resolveColor(
                                        mark.color,
                                        MARK_INKS,
                                        "hsl(var(--foreground))"
                                    ),
                                }}
                            />
                        )
                    })}

                    {value == null ? null : (
                        // Two tones, not one: the phases underneath can be any
                        // colour in either theme, so the thumb carries its own
                        // contrast with it (a background-coloured bar ringed in
                        // foreground) instead of hoping the surface is light.
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 w-0.5 bg-background ring-1 ring-foreground/70"
                            style={{
                                left: `${pctOf(value)}%`,
                                transform: `translateX(${-pctOf(value)}%)`,
                            }}
                        >
                            <span className="absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-sm bg-background ring-1 ring-foreground/70" />
                        </div>
                    )}
                </div>

                {hourLabels.length > 0 ? (
                    <div className="relative mt-1 h-4 text-xs leading-4 tabular-nums text-muted-foreground">
                        {hourLabels.map((hour) => {
                            const pct = clamp01(hour / 24) * 100
                            return (
                                <span
                                    key={`hour-${hour}`}
                                    className="absolute top-0"
                                    style={{ left: `${pct}%`, transform: `translateX(${-pct}%)` }}
                                >
                                    {formatHour ? formatHour(hour) : String(hour)}
                                </span>
                            )
                        })}
                    </div>
                ) : null}
            </div>
        )
    }
)
DayBand.displayName = "DayBand"

export { DayBand }
