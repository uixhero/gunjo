"use client"

import * as React from "react"
import {
    IconArrowsMaximize as ArrowsMaximize,
    IconArrowsMinimize as ArrowsMinimize,
} from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { TooltipButton } from "../inputs/TooltipButton"
import { Accordion } from "./Accordion"
import { accordionGroupDefaultVariantKey } from "./generated/default-variant-keys"
import type { AccordionGroupVariantKey } from "./generated/variant-keys"
import { Icon } from "./Icon"

export interface AccordionGroupProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    /** Item values that should be included when the group expands all sections. */
    values: string[]
    /** Controlled open accordion item values. */
    value?: string[]
    /** Visual variant used by docs/design sync. */
    variant?: AccordionGroupVariantKey
    /** Initial open accordion item values for uncontrolled usage. */
    defaultValue?: string[]
    /** Called whenever open values change. */
    onValueChange?: (value: string[]) => void
    /** Group heading shown above the accordion. */
    label?: React.ReactNode
    /** Optional supporting text shown under the group heading. */
    description?: React.ReactNode
    /** Label and tooltip for the expand-all control. */
    expandLabel?: string
    /** Label and tooltip for the collapse-all control. */
    collapseLabel?: string
    /** Accessible label for the controls group. */
    controlsLabel?: string
    /** Whether to show the expand/collapse toggle control. */
    showControls?: boolean
    /** Class name forwarded to the inner Accordion root. */
    accordionClassName?: string
    children: React.ReactNode
}

const accordionGroupVariantClasses: Record<AccordionGroupVariantKey, string> = {
    default: "space-y-3 p-0",
    withDescription: "space-y-3 p-0",
    withoutControls: "space-y-3 p-0",
}

const AccordionGroup = React.forwardRef<HTMLDivElement, AccordionGroupProps>(
    (
        {
            values,
            value,
            variant = accordionGroupDefaultVariantKey,
            defaultValue = [],
            onValueChange,
            label,
            description,
            expandLabel = "Open all",
            collapseLabel = "Close all",
            controlsLabel = "Accordion controls",
            showControls = true,
            accordionClassName,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const knownValues = React.useMemo(() => Array.from(new Set(values)), [values])
        const isControlled = value !== undefined
        const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue)
        const openValues = value ?? internalValue
        const allExpanded = knownValues.length > 0 && knownValues.every((item) => openValues.includes(item))
        const controlLabel = allExpanded ? collapseLabel : expandLabel
        const ControlIcon = allExpanded ? ArrowsMinimize : ArrowsMaximize

        const setOpenValues = React.useCallback(
            (nextValue: string[]) => {
                const nextKnownValues = nextValue.filter((item) => knownValues.includes(item))

                if (!isControlled) {
                    setInternalValue(nextKnownValues)
                }

                onValueChange?.(nextKnownValues)
            },
            [isControlled, knownValues, onValueChange]
        )

        const hasHeader = Boolean(label || description || showControls)

        return (
            <div ref={ref} className={cn(accordionGroupVariantClasses[variant], className)} {...props}>
                {hasHeader ? (
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                            {label ? (
                                <div className="text-sm font-medium leading-none text-foreground">
                                    {label}
                                </div>
                            ) : null}
                            {description ? (
                                <div className="text-sm leading-relaxed text-muted-foreground">
                                    {description}
                                </div>
                            ) : null}
                        </div>
                        {showControls ? (
                            <div
                                className="flex shrink-0 items-center gap-2"
                                role="group"
                                aria-label={controlsLabel}
                            >
                                <TooltipButton
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    tooltip={controlLabel}
                                    onClick={() => setOpenValues(allExpanded ? [] : knownValues)}
                                >
                                    <Icon icon={ControlIcon} size="sm" decorative />
                                    <span className="grid">
                                        <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
                                            {expandLabel}
                                        </span>
                                        <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
                                            {collapseLabel}
                                        </span>
                                        <span className="col-start-1 row-start-1 whitespace-nowrap">
                                            {controlLabel}
                                        </span>
                                    </span>
                                </TooltipButton>
                            </div>
                        ) : null}
                    </div>
                ) : null}
                <Accordion
                    type="multiple"
                    value={openValues}
                    onValueChange={setOpenValues}
                    className={cn("w-full", accordionClassName)}
                >
                    {children}
                </Accordion>
            </div>
        )
    }
)
AccordionGroup.displayName = "AccordionGroup"

export { AccordionGroup }
