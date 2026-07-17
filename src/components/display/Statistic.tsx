import * as React from "react"
import { IconArrowDown as ArrowDown, IconArrowUp as ArrowUp, IconMinus as Minus } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import type { SemanticTone } from "../../lib/semantic-tone"

export type StatisticTrend = "up" | "down" | "flat"

/**
 * @deprecated Use the canonical {@link SemanticTone} values instead:
 * `positive` → `success`, `negative` → `destructive`, `neutral` → `muted`.
 * Legacy values remain supported throughout 0.1.x. (#673)
 */
export type LegacyStatisticTone = "positive" | "negative" | "neutral"

/** Canonical semantic tones plus the 0.1.x legacy aliases. */
export type StatisticTone = SemanticTone | LegacyStatisticTone

export interface StatisticProps extends React.HTMLAttributes<HTMLDivElement> {
    label: React.ReactNode
    value: React.ReactNode
    /** Optional change indicator (e.g. "+20.1%", "-3.4%"). */
    change?: React.ReactNode
    /** Trend direction for the change indicator. Default "flat" (muted). */
    trend?: StatisticTrend
    /** Canonical visual meaning for the change indicator. Defaults from trend (up = success). */
    tone?: StatisticTone
    /**
     * Good-direction for an INVERTED metric — so the change colour encodes good/bad, not raw
     * direction. `"higher"` (定時率 / 乗車率 / 売上) = up is good (green). `"lower"` (遅延件数 /
     * 不良率 / 原価率 / 離脱率 / 混雑率) = up is **bad** (red) and a drop is good. The arrow still
     * follows `trend`; only the colour flips. Ignored when `tone` is set explicitly.
     */
    goodWhen?: "higher" | "lower"
    /** Optional helper text below the value or after the change. */
    hint?: React.ReactNode
}

const TONE_CLASS: Record<SemanticTone, string> = {
    default: "text-foreground",
    muted: "text-muted-foreground",
    primary: "text-primary",
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
}

function normalizeStatisticTone(tone: StatisticTone): SemanticTone {
    switch (tone) {
        case "positive":
            return "success"
        case "negative":
            return "destructive"
        case "neutral":
            return "muted"
        default:
            return tone
    }
}

const TREND_ICON: Record<StatisticTrend, React.ComponentType<{ className?: string }>> = {
    up: ArrowUp,
    down: ArrowDown,
    flat: Minus,
}

const Statistic = React.forwardRef<HTMLDivElement, StatisticProps>(
    (
        { className, label, value, change, trend = "flat", tone, goodWhen, hint, ...props },
        ref
    ) => {
        const TrendIcon = TREND_ICON[trend]
        const autoTone: SemanticTone =
            trend === "flat"
                ? "muted"
                : goodWhen === "lower"
                  ? trend === "up" ? "destructive" : "success"
                  : trend === "up" ? "success" : "destructive"
        const resolvedTone = tone === undefined ? autoTone : normalizeStatisticTone(tone)

        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-col gap-1 rounded-lg border border-border bg-card p-4 text-card-foreground",
                    className
                )}
                {...props}
            >
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                {/* `break-words` (not `anywhere`) keeps a figure's min-content width
                    so a 2-col grid can't crush it mid-digit (−¥1,055,9 / 60);
                    `tabular-nums` aligns the digits. Text values still wrap. (#188) */}
                <p className="text-2xl font-bold tracking-tight tabular-nums break-words">{value}</p>
                {change !== undefined ? (
                    <div className={cn("flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs", TONE_CLASS[resolvedTone])}>
                        <TrendIcon className="h-3 w-3" />
                        <span className="font-medium">{change}</span>
                        {hint ? (
                            <span className="text-muted-foreground">{hint}</span>
                        ) : null}
                    </div>
                ) : hint ? (
                    <p className="text-xs text-muted-foreground">{hint}</p>
                ) : null}
            </div>
        )
    }
)
Statistic.displayName = "Statistic"

export { Statistic }
