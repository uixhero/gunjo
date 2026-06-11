import * as React from "react"
import { IconCheck as Check } from "@tabler/icons-react";

import { cn } from "../../lib/utils"

export interface PricingPlan {
    id: string
    name: React.ReactNode
    price: React.ReactNode
    period?: React.ReactNode
    description?: React.ReactNode
    features: React.ReactNode[]
    cta: React.ReactNode
    /** Highlight this plan as featured. */
    featured?: boolean
}

export interface PricingTemplateProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title?: React.ReactNode
    subtitle?: React.ReactNode
    plans: PricingPlan[]
}

const PricingTemplate = React.forwardRef<HTMLDivElement, PricingTemplateProps>(
    (
        {
            className,
            title = "Pricing",
            subtitle = "Choose a plan that fits your team",
            plans,
            ...props
        },
        ref
    ) => (
        <section
            ref={ref}
            className={cn("flex w-full flex-col items-center gap-8 p-8", className)}
            {...props}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {subtitle ? (
                    <p className="text-muted-foreground">{subtitle}</p>
                ) : null}
            </div>
            <div className="grid w-full max-w-4xl gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={cn(
                            "flex flex-col gap-3 rounded-lg border p-6",
                            plan.featured
                                ? "border-foreground bg-foreground text-background shadow-lg"
                                : "border-border bg-card text-card-foreground"
                        )}
                    >
                        <p className="text-sm font-semibold uppercase tracking-wide">
                            {plan.name}
                        </p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold tracking-tight">
                                {plan.price}
                            </span>
                            {plan.period ? (
                                <span
                                    className={cn(
                                        "text-sm",
                                        plan.featured ? "text-background/70" : "text-muted-foreground"
                                    )}
                                >
                                    {plan.period}
                                </span>
                            ) : null}
                        </div>
                        {plan.description ? (
                            <p
                                className={cn(
                                    "text-sm",
                                    plan.featured ? "text-background/70" : "text-muted-foreground"
                                )}
                            >
                                {plan.description}
                            </p>
                        ) : null}
                        <ul className="flex flex-col gap-2 pt-2">
                            {plan.features.map((f, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm"
                                >
                                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-auto pt-4">{plan.cta}</div>
                    </div>
                ))}
            </div>
        </section>
    )
)
PricingTemplate.displayName = "PricingTemplate"

export { PricingTemplate }
