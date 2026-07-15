import * as React from "react"
import { IconCheck as Check } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const stepperVariants = cva("items-start", {
    variants: {
        orientation: {
            // Full-width + fluid connectors so all steps fit a 375px phone (the
            // 5-step mobile-checkout clip in cold-test #109) instead of overflowing.
            horizontal: "flex w-full max-w-full flex-row gap-0 overflow-x-auto",
            vertical: "inline-flex flex-col gap-0",
        },
    },
    defaultVariants: { orientation: "horizontal" },
})

export type StepperState = "completed" | "current" | "upcoming"

export interface StepperStep {
    label: string
    state: StepperState
}

export interface StepperProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof stepperVariants> {
    steps: StepperStep[]
    /**
     * Make the stepper double as navigation. When set, each step becomes a button
     * calling this with its index (e.g. a Review step's "Edit → jump to step N").
     * `upcoming` steps render `disabled` (not-yet-reachable); `completed` and
     * `current` are clickable. Omit to keep the default non-interactive display. (#157)
     */
    onStepClick?: (index: number) => void
}

function StepCircle({ state, index }: { state: StepperState; index: number }) {
    const baseClasses =
        "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
    if (state === "completed") {
        return (
            <div className={cn(baseClasses, "bg-foreground text-background")}>
                <Check className="h-4 w-4" />
            </div>
        )
    }
    if (state === "current") {
        return (
            <div
                className={cn(
                    baseClasses,
                    "border-2 border-foreground bg-background text-foreground"
                )}
            >
                {index + 1}
            </div>
        )
    }
    return (
        <div className={cn(baseClasses, "bg-muted text-muted-foreground")}>
            {index + 1}
        </div>
    )
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
    ({ className, orientation, steps, onStepClick, role = "list", ...props }, ref) => {
        const isHorizontal = orientation !== "vertical"
        return (
            <div
                ref={ref}
                role={role}
                className={cn(stepperVariants({ orientation }), "p-4", className)}
                {...props}
            >
                {steps.map((step, idx) => {
                    const isLast = idx === steps.length - 1
                    return (
                        <React.Fragment key={`${step.label}-${idx}`}>
                            <div
                                role="listitem"
                                aria-current={step.state === "current" ? "step" : undefined}
                                data-stepper-item
                                className={cn(
                                    "flex min-w-0 items-center gap-2",
                                    isHorizontal ? "w-14 shrink-0 flex-col text-center sm:w-20" : "flex-row"
                                )}
                            >
                                {(() => {
                                    const circle = <StepCircle state={step.state} index={idx} />
                                    const label = (
                                        <span
                                            data-stepper-label
                                            className={cn(
                                                "max-w-full text-xs font-medium leading-tight",
                                                step.state === "upcoming"
                                                    ? "text-muted-foreground"
                                                    : "text-foreground"
                                            )}
                                        >
                                            {step.label}
                                        </span>
                                    )
                                    if (!onStepClick) {
                                        return (
                                            <>
                                                {circle}
                                                {label}
                                            </>
                                        )
                                    }
                                    return (
                                        <button
                                            type="button"
                                            onClick={() => onStepClick(idx)}
                                            disabled={step.state === "upcoming"}
                                            className={cn(
                                                "flex min-w-0 items-center gap-2 rounded-md outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                isHorizontal ? "w-full flex-col text-center" : "flex-row",
                                                "hover:opacity-80 disabled:pointer-events-none disabled:hover:opacity-100"
                                            )}
                                        >
                                            {circle}
                                            {label}
                                        </button>
                                    )
                                })()}
                            </div>
                            {!isLast ? (
                                <div
                                    className={cn(
                                        "bg-border",
                                        isHorizontal
                                            ? "mx-1 mt-4 h-0.5 min-w-1 flex-1 self-start sm:mx-2"
                                            : "my-2 ml-4 h-[24px] w-0.5 self-start"
                                    )}
                                />
                            ) : null}
                        </React.Fragment>
                    )
                })}
            </div>
        )
    }
)
Stepper.displayName = "Stepper"

export { Stepper, stepperVariants }
