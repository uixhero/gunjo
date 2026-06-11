"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import {
    IconChevronDown as ChevronDown,
    IconPlus as Plus,
} from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import { Icon } from "./Icon"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import type { AccordionVariantKey } from "./generated/variant-keys"
import { accordionDefaultVariantKey } from "./generated/default-variant-keys"

function buildVariantStateMap(
    defaultVariantKey: AccordionVariantKey,
    defaultStateClass: string,
    alternateStateClass: string
): Record<AccordionVariantKey, string> {
    return defaultVariantKey === "collapsed"
        ? { collapsed: defaultStateClass, expanded: alternateStateClass }
        : { collapsed: alternateStateClass, expanded: defaultStateClass }
}

const expandedAccordionVariantKey: AccordionVariantKey =
    accordionDefaultVariantKey === "collapsed" ? "expanded" : "collapsed"

const contentStateClasses = buildVariantStateMap(
    accordionDefaultVariantKey,
    "data-[state=closed]:animate-accordion-up",
    "data-[state=open]:animate-accordion-down"
)

const Accordion = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Root
        ref={ref}
        className={cn("flex flex-col w-[400px] border", className)}
        {...props}
    />
))
Accordion.displayName = AccordionPrimitive.Root.displayName

const AccordionItem = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn("border-b", className)}
        {...props}
    />
))
AccordionItem.displayName = "AccordionItem"

type AccordionTriggerIndicator = "chevron" | "plus" | "none"

interface AccordionTriggerProps
    extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
    /**
     * Visual indicator shown at the trailing edge of the trigger.
     * `chevron` is the default navigation-style affordance. `plus` is useful
     * for FAQ and disclosure lists where open/close reads as add/remove.
     */
    indicator?: AccordionTriggerIndicator
    /** Tooltip label shown when the item is closed. */
    openLabel?: string
    /** Tooltip label shown when the item is open. */
    closeLabel?: string
}

function AccordionTriggerIndicator({
    indicator,
    openLabel,
    closeLabel,
}: {
    indicator: AccordionTriggerIndicator
    openLabel: string
    closeLabel: string
}) {
    const indicatorRef = React.useRef<HTMLSpanElement | null>(null)
    const [tooltipLabel, setTooltipLabel] = React.useState(openLabel)

    const updateTooltipLabel = React.useCallback(() => {
        const trigger = indicatorRef.current?.closest("button[data-state]")
        const isOpen = trigger?.getAttribute("data-state") === "open"
        setTooltipLabel(isOpen ? closeLabel : openLabel)
    }, [closeLabel, openLabel])

    React.useEffect(() => {
        const trigger = indicatorRef.current?.closest("button[data-state]")
        if (!trigger) return

        updateTooltipLabel()

        const observer = new MutationObserver(updateTooltipLabel)
        observer.observe(trigger, {
            attributes: true,
            attributeFilter: ["data-state"],
        })

        return () => observer.disconnect()
    }, [updateTooltipLabel])

    if (indicator === "none") return null

    const indicatorNode = indicator === "plus"
        ? (
            <Icon
                icon={Plus}
                size="sm"
                className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-45"
            />
        )
        : (
            <Icon
                icon={ChevronDown}
                size="sm"
                className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
        )

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span
                    ref={indicatorRef}
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm"
                    onFocus={updateTooltipLabel}
                    onMouseEnter={updateTooltipLabel}
                >
                    {indicatorNode}
                </span>
            </TooltipTrigger>
            <TooltipContent>{tooltipLabel}</TooltipContent>
        </Tooltip>
    )
}

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    AccordionTriggerProps
>(({ className, children, indicator = "chevron", openLabel = "Open", closeLabel = "Close", ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                "group flex flex-1 items-center justify-between px-4 py-4 text-sm font-medium transition-all hover:underline disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:no-underline [&[data-state=open]>svg]:rotate-180",
                className
            )}
            {...props}
        >
            {children}
            <AccordionTriggerIndicator
                indicator={indicator}
                openLabel={openLabel}
                closeLabel={closeLabel}
            />
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(
            "overflow-hidden text-sm text-muted-foreground transition-all",
            contentStateClasses[accordionDefaultVariantKey],
            contentStateClasses[expandedAccordionVariantKey]
        )}
        {...props}
    >
        <div className={cn("px-4 pb-4 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
