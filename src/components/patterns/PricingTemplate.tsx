"use client"

import * as React from "react"
import { IconCheck as Check, IconX as X } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Badge } from "../display/Badge"
import { ToggleGroup, ToggleGroupItem } from "../inputs/ToggleGroup"

export interface PricingBillingPeriod {
    id: string
    label: React.ReactNode
    /** Optional note shown under the toggle for this period (e.g. "Save 2 months"). */
    note?: React.ReactNode
}

/** A feature row: a bare node (always shown as included) or a structured entry that can be ✓ or ✗. */
export type PricingFeature =
    | React.ReactNode
    | { included: boolean; label: React.ReactNode }

export interface PricingPlan {
    id: string
    name: React.ReactNode
    /**
     * Price — either a single node, or a map keyed by billing-period id
     * (e.g. `{ monthly: "$19", yearly: "$190" }`) resolved by the active period.
     */
    price: React.ReactNode | Record<string, React.ReactNode>
    period?: React.ReactNode
    description?: React.ReactNode
    features: PricingFeature[]
    cta: React.ReactNode
    /** Highlight this plan as recommended (badge + primary border/ring). */
    featured?: boolean
    /** Label for the featured badge. Default "Most popular" (also exposed to screen readers). */
    featuredLabel?: React.ReactNode
}

export interface PricingTemplateProps
    extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
    title?: React.ReactNode
    subtitle?: React.ReactNode
    /** Heading level for the title. Default 2 — so it never collides with the page heading. */
    headingLevel?: 1 | 2 | 3
    plans: PricingPlan[]
    /** Billing periods. When two or more are given, a toggle is rendered and prices react to it. */
    billingPeriods?: PricingBillingPeriod[]
    /** Controlled active billing-period id (with `onBillingPeriodChange`). */
    billingPeriod?: string
    /** Uncontrolled initial billing-period id. */
    defaultBillingPeriod?: string
    onBillingPeriodChange?: (id: string) => void
    /** Accessible label for the billing-period toggle. Default "Billing period". */
    billingPeriodLabel?: string
}

function isPriceMap(
    price: PricingPlan["price"]
): price is Record<string, React.ReactNode> {
    return typeof price === "object" && price !== null && !React.isValidElement(price)
}

function isStructuredFeature(
    feature: PricingFeature
): feature is { included: boolean; label: React.ReactNode } {
    return (
        typeof feature === "object" &&
        feature !== null &&
        !React.isValidElement(feature) &&
        "included" in feature
    )
}

function PricingTemplate({
    className,
    title = "Pricing",
    subtitle = "Choose a plan that fits your team",
    headingLevel = 2,
    plans,
    billingPeriods,
    billingPeriod,
    defaultBillingPeriod,
    onBillingPeriodChange,
    billingPeriodLabel = "Billing period",
    ...props
}: PricingTemplateProps) {
    const hasToggle = Boolean(billingPeriods && billingPeriods.length > 1)
    const firstPeriodId = billingPeriods?.[0]?.id
    const isControlled = billingPeriod !== undefined
    const [uncontrolled, setUncontrolled] = React.useState(defaultBillingPeriod ?? firstPeriodId)
    const activePeriod = isControlled ? billingPeriod : uncontrolled

    const setPeriod = (id: string) => {
        if (!isControlled) setUncontrolled(id)
        onBillingPeriodChange?.(id)
    }

    const TitleTag = `h${headingLevel}` as React.ElementType
    const activeNote = billingPeriods?.find((p) => p.id === activePeriod)?.note

    // Responsive columns: 1 on mobile, 2 on small, then up to N on large — so a
    // 4-plan lineup no longer wraps/breaks against a fixed three-column grid.
    const columnClass =
        plans.length >= 4
            ? "sm:grid-cols-2 lg:grid-cols-4"
            : plans.length === 3
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : plans.length === 2
                    ? "sm:grid-cols-2"
                    : ""

    return (
        <section
            className={cn("flex w-full flex-col items-center gap-8 p-8", className)}
            {...props}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <TitleTag className="text-3xl font-bold tracking-tight">{title}</TitleTag>
                {subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
            </div>

            {hasToggle ? (
                <div className="flex flex-col items-center gap-2">
                    <ToggleGroup
                        type="single"
                        variant="outline"
                        value={activePeriod}
                        onValueChange={(value) => {
                            if (value) setPeriod(value)
                        }}
                        aria-label={billingPeriodLabel}
                    >
                        {billingPeriods!.map((period) => (
                            <ToggleGroupItem key={period.id} value={period.id}>
                                {period.label}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                    {activeNote ? (
                        <p aria-live="polite" className="text-sm text-muted-foreground">
                            {activeNote}
                        </p>
                    ) : null}
                </div>
            ) : null}

            <div className={cn("grid w-full max-w-5xl grid-cols-1 gap-4", columnClass)}>
                {plans.map((plan) => {
                    const price = isPriceMap(plan.price)
                        ? (activePeriod ? plan.price[activePeriod] : undefined) ??
                          Object.values(plan.price)[0]
                        : plan.price
                    return (
                        <div
                            key={plan.id}
                            className={cn(
                                "relative flex flex-col gap-3 rounded-lg border bg-card p-6 text-card-foreground",
                                plan.featured
                                    ? "border-primary shadow-lg ring-2 ring-primary"
                                    : "border-border"
                            )}
                        >
                            {plan.featured ? (
                                <Badge
                                    as="span"
                                    className="absolute -top-2.5 left-6 bg-primary text-primary-foreground"
                                >
                                    {plan.featuredLabel ?? "Most popular"}
                                </Badge>
                            ) : null}
                            <p className="text-sm font-semibold uppercase tracking-wide">
                                {plan.name}
                            </p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold tracking-tight">{price}</span>
                                {plan.period ? (
                                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                                ) : null}
                            </div>
                            {plan.description ? (
                                <p className="text-sm text-muted-foreground">{plan.description}</p>
                            ) : null}
                            <ul className="flex flex-col gap-2 pt-2">
                                {plan.features.map((feature, i) => {
                                    const included = isStructuredFeature(feature)
                                        ? feature.included
                                        : true
                                    const label = isStructuredFeature(feature)
                                        ? feature.label
                                        : feature
                                    return (
                                        <li
                                            key={i}
                                            className={cn(
                                                "flex items-start gap-2 text-sm",
                                                !included && "text-muted-foreground"
                                            )}
                                        >
                                            {included ? (
                                                <Check
                                                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                                                    aria-hidden
                                                />
                                            ) : (
                                                <X
                                                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                                                    aria-hidden
                                                />
                                            )}
                                            <span>
                                                <span className="sr-only">
                                                    {included ? "Included: " : "Not included: "}
                                                </span>
                                                {label}
                                            </span>
                                        </li>
                                    )
                                })}
                            </ul>
                            <div className="mt-auto pt-4">{plan.cta}</div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

PricingTemplate.displayName = "PricingTemplate"

export { PricingTemplate }
