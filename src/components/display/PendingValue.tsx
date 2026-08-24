import * as React from "react"
import { IconCircleCheck, IconCircleDashed, IconCircleDot } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import type { SemanticTone } from "../../lib/semantic-tone"
import type { PendingValueVariantKey } from "./generated/variant-keys"
import { pendingValueDefaultVariantKey } from "./generated/default-variant-keys"

/**
 * How settled the thing on screen is.
 *
 * This is **not** a severity. `SemanticTone` answers "どれくらいまずいか"; this
 * answers "確定しているか" — an orthogonal axis. A blank field cannot tell the
 * two apart, and a blank field says nothing, so nobody notices the distinction
 * was lost.
 *
 * - `pending` … 中身がまだ無い。まだ聞いていない / まだ照合していない / 根拠がそろっていない
 * - `provisional` … 中身はあるが確定していない。案・暫定・協議中・概算
 * - `settled` … 確定した。聞き取った / 照合が済んだ / 割合が決まった
 */
export type PendingValueState = PendingValueVariantKey

/**
 * Least settled first — which also makes {@link pendingValueDefaultVariantKey}
 * `"pending"`. Forgetting to pass `state` therefore reads as 「まだ確定していない」,
 * never as a confirmed value, and it says so on screen rather than silently.
 */
export const PENDING_VALUE_STATES = [
    "pending",
    "provisional",
    "settled",
] as const satisfies readonly PendingValueState[]

const STATE_LABEL: Record<PendingValueVariantKey, string> = {
    pending: "未確定",
    provisional: "暫定",
    settled: "確定",
}

const STATE_ICON: Record<PendingValueVariantKey, React.ComponentType<{ className?: string }>> = {
    pending: IconCircleDashed,
    provisional: IconCircleDot,
    settled: IconCircleCheck,
}

/**
 * Default tone per state. `pending` and `provisional` are **neutral on purpose**:
 * not-yet-settled is not a problem, it is unfinished work, and painting it
 * `warning` turns a hearing form into a nag. Pass `tone` when a specific screen
 * really does need to escalate (#244's 協議中 does; #241's 未照合 does not).
 */
const STATE_TONE: Record<PendingValueVariantKey, SemanticTone> = {
    pending: "muted",
    provisional: "muted",
    settled: "success",
}

const TONE_CHIP: Record<SemanticTone, string> = {
    default: "border-border bg-secondary text-secondary-foreground",
    muted: "border-border bg-muted text-muted-foreground",
    primary: "border-primary-border bg-primary-subtle text-primary-subtle-foreground",
    info: "border-info-border bg-info-subtle text-info-subtle-foreground",
    success: "border-success-border bg-success-subtle text-success-subtle-foreground",
    warning: "border-warning-border bg-warning-subtle text-warning-subtle-foreground",
    destructive:
        "border-destructive-border bg-destructive-subtle text-destructive-subtle-foreground",
}

const CHIP_SIZE = {
    sm: "h-4 gap-1 px-2 text-[11px] [&_svg]:h-2.5 [&_svg]:w-2.5",
    default: "h-5 gap-1 px-2.5 text-xs [&_svg]:h-3 [&_svg]:w-3",
} as const

export type PendingValueSize = keyof typeof CHIP_SIZE

/** The default wording for a state — 未確定 / 暫定 / 確定. */
export function pendingValueLabel(state: PendingValueState): string {
    return STATE_LABEL[state]
}

/** `true` only for `"settled"`. The predicate behind 「済んだN件 / まだN件」 splits. */
export function isPendingValueSettled(state: PendingValueState): boolean {
    return state === "settled"
}

export interface PendingValueBadgeProps
    extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
    /** Defaults to `"pending"` — the conservative reading when a caller forgets. */
    state?: PendingValueState
    /**
     * The wording. Say **why** it is not settled — 「まだ聞いていません」
     * 「まだ照合できていません」「協議中」. Defaults to 未確定 / 暫定 / 確定.
     */
    label?: React.ReactNode
    /** Leading glyph. Decorative — the text carries the meaning. Defaults per state. */
    icon?: React.ReactNode
    /** Override the default tone. Leave it off unless the screen really must escalate. */
    tone?: SemanticTone
    size?: PendingValueSize
}

/**
 * The pill on its own, for a table cell or a list row where a frame would be
 * wrong. Icon **and** text always, so the state survives greyscale.
 */
export const PendingValueBadge = React.forwardRef<HTMLSpanElement, PendingValueBadgeProps>(
    (
        {
            className,
            state = pendingValueDefaultVariantKey,
            label,
            icon,
            tone,
            size = "default",
            ...props
        },
        ref
    ) => {
        const Glyph = STATE_ICON[state]
        return (
            <span
                ref={ref}
                data-pending-state={state}
                className={cn(
                    "inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full border font-medium",
                    CHIP_SIZE[size],
                    TONE_CHIP[tone ?? STATE_TONE[state]],
                    className
                )}
                {...props}
            >
                <span className="flex shrink-0 items-center" aria-hidden="true">
                    {icon ?? <Glyph />}
                </span>
                {label ?? STATE_LABEL[state]}
            </span>
        )
    }
)
PendingValueBadge.displayName = "PendingValueBadge"

/** Ids handed to a function child so a wrapped control can point at them. */
export interface PendingValueRenderContext {
    /** Id of the state pill, or `undefined` when no `id` was given. */
    statusId?: string
    /** Id of the note, or `undefined` when there is no note. */
    noteId?: string
    /** `statusId` and `noteId` joined — pass straight to `aria-describedby`. */
    describedBy?: string
}

export interface PendingValueProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
    /** Defaults to `"pending"` — the conservative reading when a caller forgets. */
    state?: PendingValueState
    /** The item's name, shown to the left of the pill. Pass a `<label>` for a form control. */
    label?: React.ReactNode
    /** Pill wording — say **why**. Defaults to 未確定 / 暫定 / 確定. */
    statusLabel?: React.ReactNode
    /** Pill glyph. Decorative. Defaults per state. */
    icon?: React.ReactNode
    /** Override the default tone. Neutral unless you pass one. */
    tone?: SemanticTone
    /**
     * What being unsettled blocks, or — once settled — when and by whom.
     * Rendered under the content, and wired to `aria-describedby` when `id` is set.
     */
    note?: React.ReactNode
    /** Buttons under the note (「無いと確認」「分からない」「まだに戻す」). */
    actions?: React.ReactNode
    /**
     * When to draw the frame. Default `"always"` — dashed while unsettled, solid
     * once settled, so a column of fields keeps one outline. `"unsettled"` draws
     * nothing once settled, for decorating a chart or a number in place.
     */
    frame?: "always" | "unsettled" | "none"
    /** Hide the pill — for when you place a {@link PendingValueBadge} yourself. */
    hideBadge?: boolean
    size?: PendingValueSize
    /** Content, or a function receiving the ids to wire onto a control. */
    children?: React.ReactNode | ((context: PendingValueRenderContext) => React.ReactNode)
}

const FRAME: Record<PendingValueVariantKey, string> = {
    pending: "border-dashed bg-muted/40",
    provisional: "border-dashed bg-muted/40",
    settled: "border-border bg-card",
}

/**
 * PendingValue — marks what is on screen as **not yet settled, and says why**.
 *
 * The kit already has the "X vs Y" family — `ExpiryBadge` (日付 vs 期限),
 * `ReferenceValue` (値 vs 範囲), `LimitMonitor` (値 vs 基準), `Meter` (値 vs 容量).
 * This is 値 vs 確定: the axis that says a value is missing or provisional, and
 * which of the several possible reasons applies.
 *
 * Three cold-test screens hand-rolled it independently — a hearing form where
 * 「まだ聞いていない」 and 「無いと答えられた」 must not look alike, an intake desk
 * splitting 照合済み from 未照合, and a loss survey showing a fault ratio that is
 * still only a proposal. Two of the three arrived at the same dashed frame.
 *
 * The state is carried by **border style plus an icon-and-text pill**, never by
 * colour, so it survives greyscale. `pending` and `provisional` are neutral by
 * default: unfinished is not the same as wrong.
 *
 * RSC-safe (no client deps). Ids come from `id`, not `useId`.
 */
export const PendingValue = React.forwardRef<HTMLDivElement, PendingValueProps>(
    (
        {
            className,
            state = pendingValueDefaultVariantKey,
            label,
            statusLabel,
            icon,
            tone,
            note,
            actions,
            frame = "always",
            hideBadge = false,
            size = "default",
            id,
            children,
            ...props
        },
        ref
    ) => {
        const settled = state === "settled"
        const framed = frame === "always" || (frame === "unsettled" && !settled)

        const statusId = id && !hideBadge ? `${id}-status` : undefined
        const labelId = id && label != null ? `${id}-label` : undefined
        const noteId = id && note != null ? `${id}-note` : undefined
        const describedBy = [statusId, noteId].filter(Boolean).join(" ") || undefined
        // The group is named by the item, not by its state: the state reaches a
        // wrapped control through `describedBy`, and announcing it twice is noise.
        const labelledBy = labelId

        const body =
            typeof children === "function"
                ? children({ statusId, noteId, describedBy })
                : children

        const header =
            label != null || !hideBadge ? (
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    {label != null ? (
                        <span id={labelId} className="text-sm font-medium text-foreground">
                            {label}
                        </span>
                    ) : (
                        <span />
                    )}
                    {!hideBadge ? (
                        <PendingValueBadge
                            id={statusId}
                            state={state}
                            label={statusLabel}
                            icon={icon}
                            tone={tone}
                            size={size}
                        />
                    ) : null}
                </div>
            ) : null

        return (
            <div
                ref={ref}
                id={id}
                data-pending-state={state}
                role={labelledBy ? "group" : undefined}
                aria-labelledby={labelledBy}
                className={cn(
                    framed && "rounded-lg border",
                    framed && FRAME[state],
                    framed && (size === "sm" ? "px-2.5 py-2" : "px-3 py-3"),
                    className
                )}
                {...props}
            >
                {header}
                {body != null ? <div className={header ? "mt-2" : undefined}>{body}</div> : null}
                {note != null ? (
                    <p
                        id={noteId}
                        className={cn(
                            "text-xs text-muted-foreground",
                            (header || body != null) && "mt-2"
                        )}
                    >
                        {note}
                    </p>
                ) : null}
                {actions != null ? (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">{actions}</div>
                ) : null}
            </div>
        )
    }
)
PendingValue.displayName = "PendingValue"
