import * as React from "react"
import { cn } from "../../lib/utils"
import type { BadgeVariantKey } from "./generated/variant-keys"
import { badgeDefaultVariantKey } from "./generated/default-variant-keys"

const badgeVariantClasses: Record<BadgeVariantKey, string> = {
    default: "bg-foreground text-background",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive-strong text-destructive-strong-foreground",
    outline: "border-border bg-transparent text-foreground",
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: BadgeVariantKey
}

function Badge({ className, variant = badgeDefaultVariantKey, ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center w-fit h-5 rounded-full border border-transparent px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                badgeVariantClasses[variant],
                className
            )}
            {...props}
        />
    )
}

export { Badge }
