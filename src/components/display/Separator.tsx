"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import type { SeparatorVariantKey } from "./generated/variant-keys"
import { separatorDefaultVariantKey } from "./generated/default-variant-keys"

const separatorOrientationClasses: Record<SeparatorVariantKey, string> = {
    horizontal: "w-[200px] h-[1px]",
    vertical: "w-[1px] h-6",
}

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: SeparatorVariantKey
    className?: string
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
    ({ className, orientation = separatorDefaultVariantKey, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "shrink-0 bg-border",
                separatorOrientationClasses[orientation],
                className
            )}
            {...props}
        />
    )
)
Separator.displayName = "Separator"

export { Separator }
