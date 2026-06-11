import * as React from "react"
import { IconCheck as Check } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const stepperVariants = cva("inline-flex items-start", {
    variants: {
        orientation: {
            horizontal: "flex-row gap-0",
            vertical: "flex-col gap-0",
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
    ({ className, orientation, steps, role = "list", ...props }, ref) => {
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
                                    isHorizontal ? "w-16 shrink-0 flex-col text-center sm:w-20" : "flex-row"
                                )}
                            >
                                <StepCircle state={step.state} index={idx} />
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
                            </div>
                            {!isLast ? (
                                <div
                                    className={cn(
                                        "bg-border",
                                        isHorizontal
                                            ? "mx-2 mt-4 h-0.5 w-[60px] self-start"
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
