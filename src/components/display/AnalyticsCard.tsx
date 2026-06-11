"use client"

import * as React from "react"
import { IconArrowDown as ArrowDown, IconArrowUp as ArrowUp, IconMinus as Minus } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./Card"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import type { AnalyticsCardVariantKey } from "./generated/variant-keys"
import { analyticsCardDefaultVariantKey } from "./generated/default-variant-keys"

export type AnalyticsCardTrend = "up" | "down" | "flat"

export interface AnalyticsCardProps
    extends Omit<React.ComponentPropsWithoutRef<typeof Card>, "title"> {
    title: React.ReactNode
    description?: React.ReactNode
    value?: React.ReactNode
    delta?: React.ReactNode
    deltaDescription?: React.ReactNode
    trend?: AnalyticsCardTrend
    variant?: AnalyticsCardVariantKey
    action?: React.ReactNode
    footer?: React.ReactNode
}

type AnalyticsCardClassNames = {
    card: string
    header: string
    content: string
    footer: string
}

const variantClasses: Record<AnalyticsCardVariantKey, AnalyticsCardClassNames> = {
    default: {
        card: "",
        header: "",
        content: "",
        footer: "",
    },
    positive: {
        card: "border-success-border bg-success-subtle",
        header: "",
        content: "",
        footer: "",
    },
    riskIncrease: {
        card: "border-destructive-border bg-destructive-subtle",
        header: "",
        content: "",
        footer: "",
    },
    flatWithFooter: {
        card: "bg-muted/20",
        header: "",
        content: "",
        footer: "border-t pt-4 text-xs text-muted-foreground",
    },
}

const trendClasses: Record<AnalyticsCardTrend, string> = {
    up: "text-success-strong",
    down: "text-destructive",
    flat: "text-muted-foreground",
}

const trendIcons: Record<
    AnalyticsCardTrend,
    React.ComponentType<{ className?: string }>
> = {
    up: ArrowUp,
    down: ArrowDown,
    flat: Minus,
}

const AnalyticsCard = React.forwardRef<HTMLDivElement, AnalyticsCardProps>(
    (
        {
            className,
            title,
            description,
            value,
            delta,
            deltaDescription,
            trend = "flat",
            variant = analyticsCardDefaultVariantKey,
            action,
            footer,
            children,
            ...props
        },
        ref
    ) => {
        const TrendIcon = trendIcons[trend]
        const styles = variantClasses[variant]

        return (
            <Card ref={ref} className={cn("w-full min-w-0 p-0", styles.card, className)} {...props}>
                <CardHeader className={cn("flex-row items-start justify-between gap-4 space-y-0", styles.header)}>
                    <div className="min-w-0 space-y-1">
                        <CardTitle className="text-sm font-medium leading-snug">
                            {title}
                        </CardTitle>
                        {description ? (
                            <CardDescription>{description}</CardDescription>
                        ) : null}
                    </div>
                    {action ? <div className="flex-shrink-0">{action}</div> : null}
                </CardHeader>
                <CardContent className={cn("space-y-4", styles.content)}>
                    {value !== undefined || delta !== undefined ? (
                        <div className="flex min-w-0 flex-wrap items-start justify-between gap-x-3 gap-y-1">
                            {value !== undefined ? (
                                <div className="min-w-0 text-2xl font-bold leading-tight tracking-tight [overflow-wrap:anywhere]">
                                    {value}
                                </div>
                            ) : null}
                            {delta !== undefined ? (
                                deltaDescription !== undefined ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                type="button"
                                                className={cn(
                                                    "mt-1 inline-flex shrink-0 items-center gap-1 rounded-sm text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                    trendClasses[trend]
                                                )}
                                            >
                                                <TrendIcon className="h-3 w-3" />
                                                <span>{delta}</span>
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-56 text-left text-xs">
                                            {deltaDescription}
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <div
                                        className={cn(
                                            "mt-1 inline-flex shrink-0 items-center gap-1 text-xs font-medium",
                                            trendClasses[trend]
                                        )}
                                    >
                                        <TrendIcon className="h-3 w-3" />
                                        <span>{delta}</span>
                                    </div>
                                )
                            ) : null}
                        </div>
                    ) : null}
                    {children}
                </CardContent>
                {footer ? <CardFooter className={styles.footer}>{footer}</CardFooter> : null}
            </Card>
        )
    }
)
AnalyticsCard.displayName = "AnalyticsCard"

export { AnalyticsCard }
