import * as React from "react"

import { cn } from "../../lib/utils"
import type { SemanticTone } from "../../lib/semantic-tone"

/**
 * One step on an **ordered** scale. `levels` is always written from the low end
 * of the scale to the high end (空いています → 混雑, 低 → 緊急, 平常運転 → 運休),
 * so index 0 is 1段目 and the last entry is N段目.
 */
export interface StatusLevelStep<V extends string = string> {
    /** Stable key for this step — what `value` is matched against. */
    value: V
    /** Visible label (空いています / やや混雑 / 混雑). */
    label: React.ReactNode
    /**
     * Optional leading glyph. Decorative (`aria-hidden`) — the label and the step
     * bar carry the meaning, so an icon is never required to stay colour-safe.
     */
    icon?: React.ReactNode
    /**
     * Optional semantic weight of this step (success / warning / destructive …).
     * **Tone does not carry the order** — the step bar does. Leave it off and the
     * step renders neutral; the reading of "何段目か" is unchanged either way.
     */
    tone?: SemanticTone
}

const TONE_CHIP: Record<SemanticTone, string> = {
    default: "border-border bg-secondary text-secondary-foreground",
    muted: "border-transparent bg-muted text-muted-foreground",
    primary: "border-primary-border bg-primary-subtle text-primary-subtle-foreground",
    info: "border-info-border bg-info-subtle text-info-subtle-foreground",
    success: "border-success-border bg-success-subtle text-success-subtle-foreground",
    warning: "border-warning-border bg-warning-subtle text-warning-subtle-foreground",
    destructive: "border-destructive-border bg-destructive-subtle text-destructive-subtle-foreground",
}

const CHIP_SIZE = {
    sm: "h-4 gap-1 px-2 text-[11px]",
    default: "h-5 gap-1 px-2.5 text-xs",
    lg: "h-6 gap-1.5 px-3 text-sm",
} as const

const BAR_SIZE = {
    sm: { track: "gap-0.5", segment: "h-1 w-1.5" },
    default: { track: "gap-0.5", segment: "h-1.5 w-2" },
    lg: { track: "gap-1", segment: "h-2 w-2.5" },
} as const

export type StatusLevelSize = keyof typeof CHIP_SIZE

/** Position of `value` on the scale — `0` when the value is not one of `levels`. */
export function statusLevelIndex<V extends string>(
    levels: readonly StatusLevelStep<V>[],
    value: string | null | undefined
): number {
    return levels.findIndex((step) => step.value === value)
}

/** The step object for `value`, or `undefined` when it is not on the scale. */
export function statusLevelStep<V extends string>(
    levels: readonly StatusLevelStep<V>[],
    value: string | null | undefined
): StatusLevelStep<V> | undefined {
    const i = statusLevelIndex(levels, value)
    return i < 0 ? undefined : levels[i]
}

/**
 * Comparator over level values, **ascending** (1段目 first). Sort the worst to the
 * top with `sort((a, b) => compareStatusLevel(LEVELS, b.level, a.level))`.
 * Values that are not on the scale sort below every known step.
 */
export function compareStatusLevel<V extends string>(
    levels: readonly StatusLevelStep<V>[],
    a: string | null | undefined,
    b: string | null | undefined
): number {
    return statusLevelIndex(levels, a) - statusLevelIndex(levels, b)
}

/**
 * The highest step present in `values` — the roll-up "全体の運行状況" derivation.
 * Returns `undefined` when nothing on the scale is present.
 */
export function highestStatusLevel<V extends string>(
    levels: readonly StatusLevelStep<V>[],
    values: Iterable<string | null | undefined>
): V | undefined {
    let best = -1
    for (const v of values) {
        const i = statusLevelIndex(levels, v)
        if (i > best) best = i
    }
    return best < 0 ? undefined : levels[best].value
}

function defaultFormatPosition(position: number, total: number): string {
    return `${total}段階中 ${position}段目`
}

export interface StatusLevelProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
    /** The scale, written low end → high end. Defined once, reused for sorting and roll-ups. */
    levels: readonly StatusLevelStep[]
    /** Which step is current. A value outside `levels` renders `unknownLabel`. */
    value: string | null | undefined
    /** Show the step bar. Default `true` — it is what keeps the level readable without colour. */
    showBar?: boolean
    /** Show the text chip. Default `true`. Set `false` for a bar-only cell in a dense table. */
    showLabel?: boolean
    /** Where the step bar sits relative to the chip. Default `"end"`. */
    barPosition?: "start" | "end"
    /** Chip and bar scale. Default `"default"`. */
    size?: StatusLevelSize
    /** Screen-reader wording for the position. Default `4段階中 3段目`. */
    formatPosition?: (position: number, total: number, step: StatusLevelStep) => string
    /** Rendered when `value` is not one of `levels`. Default `"—"`. */
    unknownLabel?: React.ReactNode
    /** Class applied to the chip only — useful for aligning status columns. */
    chipClassName?: string
    /** Class applied to the step bar only. */
    barClassName?: string
}

/**
 * StatusLevel — the **ordered** qualitative level indicator: a scale written once
 * (`levels`, low end → high end) plus the current `value`, rendered as a
 * colour-safe chip and a filled-step bar that reads 「4段階中 3段目」.
 *
 * Use it when the states have a rank: 空いています < やや混雑 < 混雑, 平常運転 <
 * 遅延 < 迂回 < 運休, 低 < 中 < 高 < 緊急, good < watch < bad. The order lives in
 * one array, so the sort key (`compareStatusLevel`), the roll-up
 * (`highestStatusLevel`) and the pill can no longer drift apart — the papercut
 * behind the hand-rolled `LEVEL_META` + `LEVEL_BADGE` + `LEVEL_SEVERITY` + `rank`
 * quartet.
 *
 * **Not** for unordered states (支払済 / 請求中, 下書き / 公開) — that is `Badge`.
 * **Not** for a position in a process (受付 → 審査 → 完了) — that is `Stepper` /
 * `ApprovalSteps` / `RouteStops`, which advance without getting heavier.
 *
 * The bar is drawn in foreground-vs-border shades, not semantic tones, so the
 * step count survives greyscale, and the position is announced to screen readers.
 * RSC-safe (no client deps).
 */
export const StatusLevel = React.forwardRef<HTMLSpanElement, StatusLevelProps>(
    (
        {
            className,
            levels,
            value,
            showBar = true,
            showLabel = true,
            barPosition = "end",
            size = "default",
            formatPosition = defaultFormatPosition,
            unknownLabel = "—",
            chipClassName,
            barClassName,
            ...props
        },
        ref
    ) => {
        const index = statusLevelIndex(levels, value)
        const step = index < 0 ? undefined : levels[index]
        const total = levels.length
        const bar = BAR_SIZE[size]

        const chip = showLabel ? (
            <span
                className={cn(
                    "inline-flex w-fit shrink-0 items-center rounded-full border font-semibold",
                    CHIP_SIZE[size],
                    TONE_CHIP[step?.tone ?? "default"],
                    chipClassName
                )}
            >
                {step?.icon ? (
                    <span className="flex shrink-0 items-center [&_svg]:h-3 [&_svg]:w-3" aria-hidden="true">
                        {step.icon}
                    </span>
                ) : null}
                {step ? step.label : unknownLabel}
                {step ? (
                    <span className="sr-only">（{formatPosition(index + 1, total, step)}）</span>
                ) : null}
            </span>
        ) : null

        const track = showBar ? (
            <span
                className={cn("inline-flex shrink-0 items-center", bar.track, barClassName)}
                aria-hidden="true"
            >
                {levels.map((s, i) => (
                    <span
                        key={s.value}
                        className={cn(
                            "rounded-full",
                            bar.segment,
                            i <= index ? "bg-foreground" : "bg-border"
                        )}
                    />
                ))}
            </span>
        ) : null

        return (
            <span
                ref={ref}
                className={cn("inline-flex w-fit items-center gap-1.5 align-middle", className)}
                {...props}
            >
                {barPosition === "start" ? track : null}
                {chip}
                {!showLabel && step ? (
                    <span className="sr-only">
                        {step.label}（{formatPosition(index + 1, total, step)}）
                    </span>
                ) : null}
                {barPosition === "end" ? track : null}
            </span>
        )
    }
)
StatusLevel.displayName = "StatusLevel"
