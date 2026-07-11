"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { IconVariantKey } from "./generated/variant-keys"
import { iconDefaultVariantKey } from "./generated/default-variant-keys"

export type IconGlyph = React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref" | "stroke"> & {
        size?: string | number
        stroke?: string | number
    } & React.RefAttributes<SVGSVGElement>
>

export interface IconProps
    extends Omit<React.SVGProps<SVGSVGElement>, "children" | "size" | "strokeWidth"> {
    /**
     * The glyph **component** you imported — e.g. `icon={IconChevronRight}` from
     * `@tabler/icons-react`. NOT a name string: there is no `name="…"` registry
     * (that would bundle thousands of icons). Any Tabler / Lucide / svg-component
     * works. (#337)
     */
    icon: IconGlyph
    /** Size as a **variant key** (`xs|sm|md|lg|xl`) — not a className or pixel value. Default `md`. */
    size?: IconVariantKey
    label?: string
    decorative?: boolean
    strokeWidth?: number
}

const iconSizeClasses: Record<IconVariantKey, string> = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
    (
        {
            icon: Glyph,
            size = iconDefaultVariantKey,
            label,
            decorative = true,
            strokeWidth = 2,
            className,
            role,
            "aria-hidden": ariaHidden,
            ...props
        },
        ref
    ) => {
        // The #1 newcomer trap: `<Icon name="ChevronRight" />` (most kits' style).
        // gunjo takes a glyph component. tsc catches this, but warn in dev too for
        // JS consumers / bypassed types, then render nothing rather than a broken
        // `<chevronright>` DOM tag. (#337)
        if (process.env.NODE_ENV !== "production" && typeof Glyph === "string") {
            console.warn(
                `[gunjo] <Icon icon={…}> takes an imported glyph COMPONENT (e.g. icon={IconChevronRight}), not a name string ("${Glyph}"). There is no string-name registry.`
            )
            return null
        }

        const isDecorative = decorative && !label

        return (
            <Glyph
                ref={ref}
                aria-hidden={isDecorative ? true : ariaHidden}
                aria-label={isDecorative ? undefined : label}
                role={isDecorative ? role : role ?? "img"}
                focusable="false"
                stroke={strokeWidth}
                className={cn("shrink-0 p-0 text-current", iconSizeClasses[size], className)}
                {...props}
            />
        )
    }
)
Icon.displayName = "Icon"

export { Icon }
