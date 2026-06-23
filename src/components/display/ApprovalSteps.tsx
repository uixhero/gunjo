import * as React from "react"
import {
    IconCheck,
    IconClock,
    IconMinus,
    IconX,
} from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import {
    Timeline,
    TimelineDescription,
    TimelineItem,
    TimelineTime,
    TimelineTitle,
} from "./Timeline"
import type { ApprovalStepsVariantKey } from "./generated/variant-keys"
import { approvalStepsDefaultVariantKey } from "./generated/default-variant-keys"

const approvalStepsVariantClasses: Record<ApprovalStepsVariantKey, string> = {
    default: "w-full text-sm",
    compact: "w-full text-xs",
}

export type ApprovalStepState = "pending" | "current" | "approved" | "rejected" | "skipped"

type StepConfig = {
    variant: React.ComponentProps<typeof TimelineItem>["variant"]
    icon: React.ComponentType<{ className?: string }> | null
    defaultLabel: string
    toneClass: string
}

// state → Timeline marker tone + icon + a default text label. Conveyed by icon
// + text (not colour alone). Tones reuse the Timeline semantic variants (#205).
const STATE_CONFIG: Record<ApprovalStepState, StepConfig> = {
    pending: { variant: "muted", icon: IconClock, defaultLabel: "Pending", toneClass: "text-muted-foreground" },
    current: { variant: "active", icon: null, defaultLabel: "In progress", toneClass: "text-primary" },
    approved: { variant: "success", icon: IconCheck, defaultLabel: "Approved", toneClass: "text-success-strong" },
    rejected: { variant: "destructive", icon: IconX, defaultLabel: "Rejected", toneClass: "text-destructive" },
    skipped: { variant: "muted", icon: IconMinus, defaultLabel: "Skipped", toneClass: "text-muted-foreground" },
}

const MARKER_BG: Partial<Record<ApprovalStepState, string>> = {
    approved: "bg-success-strong text-success-strong-foreground",
    rejected: "bg-destructive-strong text-destructive-strong-foreground",
    pending: "bg-muted text-muted-foreground",
    skipped: "bg-muted text-muted-foreground",
}

export interface ApprovalStep {
    /** Step label, e.g. `一次承認（上長）`. */
    label: React.ReactNode
    state: ApprovalStepState
    /** Who acted on / owns the step. */
    actor?: React.ReactNode
    /** When the step was acted on. */
    timestamp?: React.ReactNode
    /** Approver comment (especially for `rejected` / 差戻し). */
    comment?: React.ReactNode
}

export interface ApprovalStepsProps {
    steps: ApprovalStep[]
    variant?: ApprovalStepsVariantKey
    /** Localizable state labels — shown as text and used in each step's aria-label. */
    stateLabels?: Partial<Record<ApprovalStepState, string>>
    className?: string
}

/**
 * Approval-route timeline. Each step's `state` maps to a marker tone, an icon,
 * and a text label (so state is never colour-only), plus the actor, timestamp,
 * and comment. Built on `Timeline`; for expense, ringi, and review workflows. (#207)
 */
export const ApprovalSteps = React.forwardRef<HTMLDivElement, ApprovalStepsProps>(
    ({ steps, variant = approvalStepsDefaultVariantKey, stateLabels, className }, ref) => {
        return (
            <div ref={ref} className={cn(approvalStepsVariantClasses[variant], className)} data-slot="approval-steps">
                <Timeline>
                    {steps.map((step, index) => {
                        const config = STATE_CONFIG[step.state]
                        const stateLabel = stateLabels?.[step.state] ?? config.defaultLabel
                        const Icon = config.icon
                        const markerBg = MARKER_BG[step.state]
                        const marker = Icon ? (
                            <span
                                className={cn(
                                    "flex h-4 w-4 items-center justify-center rounded-full",
                                    markerBg ?? "bg-foreground text-background"
                                )}
                            >
                                <Icon className="h-2.5 w-2.5" />
                            </span>
                        ) : undefined

                        return (
                            <TimelineItem
                                key={index}
                                variant={config.variant}
                                marker={marker}
                                connector={index < steps.length - 1}
                                aria-current={step.state === "current" ? "step" : undefined}
                                aria-label={`${typeof step.label === "string" ? step.label : `Step ${index + 1}`}: ${stateLabel}`}
                            >
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                    <TimelineTitle>{step.label}</TimelineTitle>
                                    <span className={cn("text-xs font-medium", config.toneClass)}>{stateLabel}</span>
                                </div>
                                {step.actor || step.timestamp ? (
                                    <TimelineTime>
                                        {step.actor}
                                        {step.actor && step.timestamp ? " · " : null}
                                        {step.timestamp}
                                    </TimelineTime>
                                ) : null}
                                {step.comment ? (
                                    <TimelineDescription>
                                        <span className="mt-1 block rounded-md border bg-muted/40 px-2 py-1 text-foreground">
                                            {step.comment}
                                        </span>
                                    </TimelineDescription>
                                ) : null}
                            </TimelineItem>
                        )
                    })}
                </Timeline>
            </div>
        )
    }
)

ApprovalSteps.displayName = "ApprovalSteps"
