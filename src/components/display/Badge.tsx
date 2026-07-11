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

const badgeSizeClasses = {
    sm: "h-4 px-2 py-0 text-[11px]",
    default: "h-5 px-2.5 py-1 text-xs",
    lg: "h-6 px-3 py-1 text-sm",
} as const

export type BadgeSize = keyof typeof badgeSizeClasses

export interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
    variant?: BadgeVariantKey
    /**
     * Pill size. `default` is unchanged (`h-5`); `sm` fits dense status grids
     * (still pairs with `icon`), `lg` for emphasis. Mirrors Tag's size scale so
     * a status pill with icon + small size is expressible in one component. (#300)
     */
    size?: BadgeSize
    /**
     * The element to render. Defaults to `"span"` so a Badge is valid inside
     * flow content (e.g. a `<p>` or other phrasing context) — a status pill is
     * phrasing content. Pass `as="div"` only if you specifically need a block
     * element. (A `<div>` inside a `<p>` throws a hydration error.)
     */
    as?: "div" | "span"
    /**
     * Optional leading glyph (a Tabler icon or any svg node), sized and spaced
     * for you. Pair it with text children for a **status pill that doesn't rely
     * on color alone** (the recurring need across status grids / legends). The
     * icon is decorative (`aria-hidden`) — the text label carries the meaning;
     * for an icon-only badge pass an `aria-label`. (#276)
     */
    icon?: React.ReactNode
    /** When provided, renders a dismiss (×) button — use for removable filter chips. */
    onRemove?: () => void
    /** Accessible label for the dismiss button. Default "Remove". */
    removeLabel?: string
}

function Badge({
    className,
    variant = badgeDefaultVariantKey,
    size = "default",
    as: Comp = "span",
    icon,
    onRemove,
    removeLabel = "Remove",
    children,
    ...props
}: BadgeProps) {
    return (
        <Comp
            className={cn(
                "inline-flex items-center w-fit rounded-full border border-transparent font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                badgeSizeClasses[size],
                (icon || onRemove) && "gap-1",
                onRemove && "pr-1",
                badgeVariantClasses[variant],
                className
            )}
            {...props}
        >
            {icon ? (
                <span className="flex shrink-0 items-center [&_svg]:h-3 [&_svg]:w-3" aria-hidden="true">
                    {icon}
                </span>
            ) : null}
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
