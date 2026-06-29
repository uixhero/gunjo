"use client"

import * as React from "react"
import { IconCheck } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { ScanInput, type ScanResult } from "./ScanInput"

export type ScanGateAdvance = "next" | "stay" | "reset" | "done"

/** What a stage's `onScan` returns. Extends `ScanResult` (ok + message) with flow control. */
export interface ScanGateResult extends ScanResult {
    /**
     * Where to go after this scan. `"next"` advances (and wraps to the first stage,
     * clearing context, when called from the last stage = one cycle done — for
     * cyclic flows like packing); `"stay"` remains; `"reset"` returns to the first
     * stage and clears context; `"done"` **completes a terminating flow** —
     * holds the current stage, keeps the verified context, and fires `onComplete`
     * (use it on the last stage of a verify-then-act gate so success doesn't
     * silently wrap+clear); a stage id jumps there (keeping context).
     * Default: `ok ? "next" : "stay"`.
     */
    advance?: ScanGateAdvance | (string & {})
    /** Remember this value for the stage — later stages read it via `ctx.values[stageId]`. */
    value?: unknown
}

export interface ScanGateContext {
    /** Confirmed values from prior scans, keyed by stage id. */
    values: Record<string, unknown>
    /** Active stage id. */
    stageId: string
    /** Active stage index. */
    index: number
}

export interface ScanGateStage {
    /** Stable id; the context key for this stage's confirmed value. */
    id: string
    /** `ScanInput` label for this stage. */
    label?: React.ReactNode
    /** Short title shown in the step indicator (defaults to `label`). */
    title?: React.ReactNode
    description?: React.ReactNode
    placeholder?: string
    inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"]
    /**
     * Resolve a scanned code for this stage. Return a `ScanGateResult` to drive the
     * announcement, advancement and context; return nothing to stay silent.
     */
    onScan: (code: string, ctx: ScanGateContext) => ScanGateResult | void
}

/** Imperative handle — e.g. a "close carton" / "next location" button → `reset()`. */
export interface ScanGateHandle {
    /** Return to the first stage and clear all confirmed context. */
    reset: () => void
    /** Jump to a stage by id (keeps context). */
    goTo: (stageId: string) => void
    /** Read the confirmed context values. */
    getValues: () => Record<string, unknown>
}

export interface ScanGateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    /** Ordered scan stages. The first is active initially. */
    stages: ScanGateStage[]
    /** Notified when the active stage changes. */
    onStageChange?: (stageId: string, ctx: ScanGateContext) => void
    /** Fired when a stage returns `advance:"done"` — the terminating flow is complete; `ctx` holds the verified values. */
    onComplete?: (ctx: ScanGateContext) => void
    /** Show the numbered step indicator. Default `true`. */
    showSteps?: boolean
    /** Focus the active stage's field on mount and on each advance (scan-gun loop). Default `true`. */
    autoFocus?: boolean
    /** Announce results assertively (for safety-critical verify gates). Forwarded to `ScanInput`. Default `false`. (#237) */
    assertive?: boolean
    /** Show the active `ScanInput`'s feed. Default `false`. */
    showFeed?: boolean
    feedLimit?: number
    lockMs?: number
    /** Accessible label for the step indicator. Default `"Scan steps"`. */
    stepsLabel?: string
}

/**
 * Staged barcode scan flow. Ordered `ScanInput` stages (e.g. location→item,
 * carton→item) where each stage resolves a confirmed context the next stage
 * reads, auto-advancing and re-focusing between steps. For WMS picking,
 * put-away and packing where you scan-to-confirm before scan-to-count. Built on
 * `ScanInput`. (#227)
 */
const ScanGate = React.forwardRef<ScanGateHandle, ScanGateProps>(
    (
        {
            className,
            stages,
            onStageChange,
            onComplete,
            showSteps = true,
            autoFocus = true,
            assertive = false,
            showFeed = false,
            feedLimit,
            lockMs,
            stepsLabel = "Scan steps",
            ...props
        },
        ref
    ) => {
        const safeStages = stages.length > 0 ? stages : []
        const [index, setIndex] = React.useState(0)
        const valuesRef = React.useRef<Record<string, unknown>>({})

        const activeIndex = Math.min(index, Math.max(0, safeStages.length - 1))
        const active = safeStages[activeIndex]

        const setStage = (nextIndex: number, clear: boolean) => {
            if (clear) valuesRef.current = {}
            setIndex(nextIndex)
            const stage = safeStages[nextIndex]
            if (stage) {
                onStageChange?.(stage.id, { values: valuesRef.current, stageId: stage.id, index: nextIndex })
            }
        }

        React.useImperativeHandle(
            ref,
            () => ({
                reset: () => setStage(0, true),
                goTo: (stageId: string) => {
                    const i = safeStages.findIndex((s) => s.id === stageId)
                    if (i >= 0) setStage(i, false)
                },
                getValues: () => valuesRef.current,
            }),
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [safeStages]
        )

        const handleScan = (code: string): ScanResult | void => {
            if (!active) return
            const res =
                active.onScan(code, { values: valuesRef.current, stageId: active.id, index: activeIndex }) || undefined
            if (!res) return

            if (res.value !== undefined) {
                valuesRef.current = { ...valuesRef.current, [active.id]: res.value }
            }

            const advance = res.advance ?? (res.ok ? "next" : "stay")
            if (advance === "stay") {
                // remain on the current stage
            } else if (advance === "done") {
                // terminating flow complete: hold the stage, keep the verified
                // context, and notify — do NOT wrap/clear.
                onComplete?.({ values: valuesRef.current, stageId: active.id, index: activeIndex })
            } else if (advance === "reset") {
                setStage(0, true)
            } else if (advance === "next") {
                const ni = activeIndex + 1
                if (ni >= safeStages.length) setStage(0, true)
                else setStage(ni, false)
            } else {
                const i = safeStages.findIndex((s) => s.id === advance)
                if (i >= 0) setStage(i, false)
            }

            return { ok: res.ok, message: res.message }
        }

        if (!active) return null

        return (
            <div className={cn("flex w-full flex-col gap-3", className)} data-slot="scan-gate" {...props}>
                {showSteps && safeStages.length > 1 ? (
                    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm" aria-label={stepsLabel}>
                        {safeStages.map((stage, i) => {
                            const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "todo"
                            return (
                                <React.Fragment key={stage.id}>
                                    {i > 0 ? (
                                        <span className="text-muted-foreground" aria-hidden="true">
                                            →
                                        </span>
                                    ) : null}
                                    <li
                                        aria-current={state === "active" ? "step" : undefined}
                                        className={cn(
                                            "inline-flex items-center gap-1.5",
                                            state === "active" ? "font-medium text-foreground" : "text-muted-foreground"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs tabular-nums",
                                                state === "todo"
                                                    ? "bg-muted text-muted-foreground"
                                                    : "bg-primary text-primary-foreground",
                                                state === "active" && "ring-2 ring-ring ring-offset-1 ring-offset-background"
                                            )}
                                        >
                                            {state === "done" ? (
                                                <IconCheck className="h-3 w-3" aria-hidden="true" />
                                            ) : (
                                                i + 1
                                            )}
                                        </span>
                                        {stage.title ?? stage.label}
                                    </li>
                                </React.Fragment>
                            )
                        })}
                    </ol>
                ) : null}

                <ScanInput
                    key={active.id}
                    autoFocus={autoFocus}
                    label={active.label}
                    description={active.description}
                    placeholder={active.placeholder}
                    inputMode={active.inputMode}
                    onScan={handleScan}
                    assertive={assertive}
                    showFeed={showFeed}
                    feedLimit={feedLimit}
                    lockMs={lockMs}
                />
            </div>
        )
    }
)
ScanGate.displayName = "ScanGate"

export { ScanGate }
