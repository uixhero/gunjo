"use client"

import * as React from "react"
import { IconCheck as Check, IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip"

export interface OnboardingStep {
    id: string
    title: React.ReactNode
    description?: React.ReactNode
    content: React.ReactNode
    /** When true, the Continue/Finish button is disabled for this step (e.g. until it is valid). */
    nextDisabled?: boolean
}

export interface OnboardingFlowProps {
    steps: OnboardingStep[]
    /** Controlled current step index (0-based). */
    currentIndex?: number
    onCurrentIndexChange?: (index: number) => void
    /** Called when the user clicks Continue on the final step. */
    onComplete?: () => void
    /**
     * Optional gate: return `false` to block advancing from the given step index.
     * Combined (AND) with each step's `nextDisabled`. Use this to require the current
     * step to be valid before Continue/Finish is enabled.
     */
    canAdvance?: (index: number) => boolean
    /** Tooltip shown on the Continue/Finish button while it is disabled. */
    nextDisabledReason?: string
    /** Optional override for the back button label. */
    backLabel?: string
    /** Optional override for the next button label (non-final step). */
    nextLabel?: string
    /** Optional override for the final step button label. */
    completeLabel?: string
    /** Accessible label for the step indicator. */
    progressLabel?: string
    /** Text shown above the active step title. */
    stepLabel?: (current: number, total: number) => React.ReactNode
    /** Disabled reason shown on the back button when the first step is active. */
    backDisabledReason?: string
    /** Minimum height for the step title, description, and content area. Keeps footer actions stable across steps. */
    bodyMinHeight?: React.CSSProperties["minHeight"]
    className?: string
}

const OnboardingFlow = React.forwardRef<HTMLDivElement, OnboardingFlowProps>(
    (
        {
            steps,
            currentIndex: controlledIndex,
            onCurrentIndexChange,
            onComplete,
            canAdvance,
            nextDisabledReason,
            backLabel = "Back",
            nextLabel = "Continue",
            completeLabel = "Finish",
            progressLabel = "Onboarding progress",
            stepLabel = (current, total) => `Step ${current} of ${total}`,
            backDisabledReason = "This is the first step.",
            bodyMinHeight,
            className,
        },
        ref
    ) => {
        const [internalIndex, setInternalIndex] = React.useState(0)
        const isControlled = controlledIndex !== undefined
        const index = isControlled ? controlledIndex : internalIndex

        const setIndex = (next: number) => {
            const clamped = Math.max(0, Math.min(steps.length - 1, next))
            if (!isControlled) setInternalIndex(clamped)
            onCurrentIndexChange?.(clamped)
        }

        const isFirst = index === 0
        const isLast = index === steps.length - 1
        const step = steps[index]

        if (!step) return null

        const nextBlocked = step.nextDisabled === true || canAdvance?.(index) === false

        return (
            <div
                ref={ref}
                className={cn(
                    "flex w-full flex-col gap-6 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm",
                    className
                )}
            >
                {/* Step indicator */}
                <ol className="flex items-center gap-2" aria-label={progressLabel}>
                    {steps.map((s, idx) => {
                        const isComplete = idx < index
                        const isActive = idx === index
                        return (
                            <React.Fragment key={s.id}>
                                <li
                                    aria-current={isActive ? "step" : undefined}
                                    className={cn(
                                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                                        isComplete
                                            ? "bg-foreground text-background"
                                            : isActive
                                              ? "bg-foreground text-background"
                                              : "border border-border bg-background text-muted-foreground"
                                    )}
                                >
                                    {isComplete ? (
                                        <Check className="h-3 w-3" aria-hidden />
                                    ) : (
                                        idx + 1
                                    )}
                                </li>
                                {idx < steps.length - 1 ? (
                                    <span
                                        aria-hidden
                                        className={cn(
                                            "h-0.5 flex-1",
                                            idx < index ? "bg-foreground" : "bg-border"
                                        )}
                                    />
                                ) : null}
                            </React.Fragment>
                        )
                    })}
                </ol>

                {/* Content */}
                <div className="flex flex-col gap-6" style={bodyMinHeight ? { minHeight: bodyMinHeight } : undefined}>
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-medium text-muted-foreground">
                            {stepLabel(index + 1, steps.length)}
                        </p>
                        <h3 className="text-lg font-semibold tracking-tight">
                            {step.title}
                        </h3>
                        {step.description ? (
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                        ) : null}
                    </div>
                    <div>{step.content}</div>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-between">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className={cn("inline-flex", isFirst ? "cursor-not-allowed" : "")}>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIndex(index - 1)}
                                        disabled={isFirst}
                                    >
                                        <ChevronLeft className="mr-1 h-4 w-4" />
                                        {backLabel}
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            {isFirst ? <TooltipContent>{backDisabledReason}</TooltipContent> : null}
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className={cn("inline-flex", nextBlocked ? "cursor-not-allowed" : "")}>
                                    <Button
                                        onClick={() => {
                                            if (nextBlocked) return
                                            if (isLast) onComplete?.()
                                            else setIndex(index + 1)
                                        }}
                                        disabled={nextBlocked}
                                    >
                                        {isLast ? completeLabel : nextLabel}
                                        {!isLast ? <ChevronRight className="ml-1 h-4 w-4" /> : null}
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            {nextBlocked && nextDisabledReason ? (
                                <TooltipContent>{nextDisabledReason}</TooltipContent>
                            ) : null}
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        )
    }
)
OnboardingFlow.displayName = "OnboardingFlow"

export { OnboardingFlow }
