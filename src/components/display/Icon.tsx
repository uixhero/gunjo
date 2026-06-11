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
    icon: IconGlyph
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
