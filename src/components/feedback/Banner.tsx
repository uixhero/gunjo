"use client"

import * as React from "react"
import { IconX as X } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"

export const bannerVariants = cva(
    "flex h-10 w-full items-center justify-between gap-3 px-4 py-0 text-sm",
    {
        variants: {
            variant: {
                default: "bg-foreground text-background",
                info: "border border-info-border bg-info-subtle text-info-subtle-foreground [&>div:first-child>span:first-child]:text-info",
                success: "border border-success-border bg-success-subtle text-success-subtle-foreground [&>div:first-child>span:first-child]:text-success",
                warning: "border border-warning-border bg-warning-subtle text-warning-subtle-foreground [&>div:first-child>span:first-child]:text-warning",
                destructive: "border border-destructive-border bg-destructive-subtle text-destructive-subtle-foreground [&>div:first-child>span:first-child]:text-destructive",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BannerProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof bannerVariants> {
    icon?: React.ReactNode
    /** Optional CTA element rendered before the close button. */
    action?: React.ReactNode
    /** When provided, an × button shows. Click triggers this callback. */
    onDismiss?: () => void
    dismissLabel?: string
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
    (
        {
            className,
            variant,
            icon,
            action,
            onDismiss,
            dismissLabel = "Dismiss",
            children,
            ...props
        },
        ref
    ) => (
        <div
            ref={ref}
            role="status"
            className={cn(bannerVariants({ variant }), className)}
            {...props}
        >
            <div className="flex min-w-0 items-center gap-2">
                {icon ? (
                    <span className="flex shrink-0 items-center" aria-hidden>
                        {icon}
                    </span>
                ) : null}
                <span className="min-w-0 truncate">{children}</span>
            </div>
            <div className="flex items-center gap-2">
                {action}
                {onDismiss ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={onDismiss}
                                aria-label={dismissLabel}
                                className="inline-flex h-6 w-6 items-center justify-center rounded opacity-80 transition-colors hover:bg-foreground/10 hover:opacity-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>{dismissLabel}</TooltipContent>
                    </Tooltip>
                ) : null}
            </div>
        </div>
    )
)
Banner.displayName = "Banner"

export { Banner }
