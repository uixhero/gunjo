import * as React from "react"
import { IconX as X } from "@tabler/icons-react";
import { cn } from "../../lib/utils"
import type { BadgeVariantKey } from "./generated/variant-keys"
import { badgeDefaultVariantKey } from "./generated/default-variant-keys"

const badgeVariantClasses: Record<BadgeVariantKey, string> = {
    default: "bg-foreground text-background",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive-strong text-destructive-strong-foreground",
    outline: "border-border bg-transparent text-foreground",
    info: "border-info-border bg-info-subtle text-info-subtle-foreground",
    success: "border-success-border bg-success-subtle text-success-subtle-foreground",
    warning: "border-warning-border bg-warning-subtle text-warning-subtle-foreground",
}

export interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
    variant?: BadgeVariantKey
    /**
     * The element to render. Defaults to `"div"`. Use `as="span"` to place a
     * Badge inline inside flow content (e.g. a `<p>`), since a block `<div>` is
     * not a valid descendant of `<p>` and throws a hydration error.
     */
    as?: "div" | "span"
    /** When provided, renders a dismiss (×) button — use for removable filter chips. */
    onRemove?: () => void
    /** Accessible label for the dismiss button. Default "Remove". */
    removeLabel?: string
}

function Badge({
    className,
    variant = badgeDefaultVariantKey,
    as: Comp = "div",
    onRemove,
    removeLabel = "Remove",
    children,
    ...props
}: BadgeProps) {
    return (
        <Comp
            className={cn(
                "inline-flex items-center w-fit h-5 rounded-full border border-transparent px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                onRemove && "gap-1 pr-1",
                badgeVariantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
            {onRemove ? (
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label={removeLabel}
                    className="-mr-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full opacity-70 outline-none transition-opacity hover:opacity-100 focus-visible:ring-1 focus-visible:ring-ring"
                >
                    <X className="h-3 w-3" />
                </button>
            ) : null}
        </Comp>
    )
}

export { Badge }
