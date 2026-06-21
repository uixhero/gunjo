"use client"

import * as React from "react"
import { IconSortDescendingLetters as ArrowDownAZ, IconSortAscendingLetters as ArrowUpAZ, IconArrowsSort as ArrowUpDown } from "@tabler/icons-react";
import type { Icon as LucideIcon } from "@tabler/icons-react";
import { Button, ButtonProps } from "../inputs/Button"
import { cn } from "../../lib/utils"
import { sortButtonDefaultVariantKey } from "./generated/default-variant-keys"
import { sortButtonVariantKeys, type SortButtonVariantKey } from "./generated/variant-keys"

export type { SortButtonVariantKey }

export interface SortButtonProps extends Omit<ButtonProps, "onChange"> {
    value?: SortButtonVariantKey
    onSortChange?: (value: SortButtonVariantKey) => void
    label?: string
}

const sortIconByValue: Record<SortButtonVariantKey, LucideIcon> = {
    asc: ArrowUpAZ,
    desc: ArrowDownAZ,
    none: ArrowUpDown,
}

const sortButtonStateClasses: Record<SortButtonVariantKey, string> = {
    none: "inline-flex flex-row items-center h-9 py-2 px-3 gap-2 rounded-md",
    asc: "inline-flex flex-row items-center h-9 py-2 px-3 gap-2 rounded-md",
    desc: "inline-flex flex-row items-center h-9 py-2 px-3 gap-2 rounded-md",
}

const SortButton = React.forwardRef<HTMLButtonElement, SortButtonProps>(
    ({ className, value = sortButtonDefaultVariantKey, onSortChange, label = "Sort", variant = "ghost", size = "sm", ...props }, ref) => {

        const handleClick = () => {
            const currentIndex = sortButtonVariantKeys.indexOf(value)
            const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % sortButtonVariantKeys.length
            onSortChange?.(sortButtonVariantKeys[nextIndex])
        }

        const Icon = sortIconByValue[value]

        return (
            <Button
                ref={ref}
                variant={variant}
                size={size}
                className={cn(sortButtonStateClasses[value], className)}
                onClick={handleClick}
                {...props}
            >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </Button>
        )
    }
)
SortButton.displayName = "SortButton"

export { SortButton }
