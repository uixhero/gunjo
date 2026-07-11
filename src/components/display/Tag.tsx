"use client"

import * as React from "react"
import { IconX as X } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"

export const tagVariants = cva(
    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "bg-secondary text-secondary-foreground",
                secondary: "bg-foreground text-background",
                outline: "border border-border bg-transparent text-foreground",
                destructive: "bg-destructive-strong text-destructive-strong-foreground",
            },
            size: {
                sm: "h-5 px-1.5 text-[11px]",
                default: "h-6 px-2 text-xs",
                lg: "h-7 px-2.5 text-sm",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface TagProps
    extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onRemove">,
        VariantProps<typeof tagVariants> {
    /**
     * Optional leading glyph (a Tabler icon or any svg node), sized and spaced
     * for you — decorative (`aria-hidden`); the text carries the meaning. Mirrors
     * Badge's `icon` so a status pill with icon + small size is expressible in
     * one component. (#300)
     */
    icon?: React.ReactNode
    /** When provided, an × button appears at the end. */
    onRemove?: () => void
    removeLabel?: string
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
    (
        {
            className,
            variant,
            size,
            icon,
            onRemove,
            removeLabel = "Remove",
            children,
            ...props
        },
        ref
    ) => (
        <span
            ref={ref}
            className={cn(tagVariants({ variant, size }), className)}
            {...props}
        >
            {icon ? (
                <span className="flex shrink-0 items-center [&_svg]:h-3 [&_svg]:w-3" aria-hidden="true">
                    {icon}
                </span>
            ) : null}
            {children}
            {onRemove ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={onRemove}
                            className="ml-0.5 -mr-1 inline-flex items-center justify-center rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring"
                            aria-label={removeLabel}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">{removeLabel}</TooltipContent>
                </Tooltip>
            ) : null}
        </span>
    )
)
Tag.displayName = "Tag"

export { Tag }
