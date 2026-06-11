"use client"

import * as React from "react"
import { IconFilter as FilterIcon, IconCheck as Check } from "@tabler/icons-react";
import { Button, ButtonProps } from "../inputs/Button"
import { Popover, PopoverTrigger, PopoverContent } from "../overlay/Popover"
import { Command, CommandGroup, CommandItem, CommandList } from "../navigation/Command"
import { cn } from "../../lib/utils"
import { Badge } from "../display/Badge"
import type { FilterButtonVariantKey } from "./generated/variant-keys"
import { filterButtonDefaultVariantKey } from "./generated/default-variant-keys"

export interface FilterOption {
    label: string
    value: string
}

export interface FilterButtonProps extends ButtonProps {
    title?: string
    icon?: React.ReactNode
    options?: FilterOption[]
    selectedValues?: Set<string>
    onFilterChange?: (values: Set<string>) => void
    clearLabel?: string
    selectedLabel?: (count: number) => string
    contentClassName?: string
    contentAlign?: React.ComponentPropsWithoutRef<typeof PopoverContent>["align"]
    portalContainer?: HTMLElement | null
    children?: React.ReactNode
}

const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
    (
        {
            className,
            title = "Filter",
            icon,
            options = [],
            selectedValues = new Set(),
            onFilterChange,
            clearLabel = "Clear filters",
            selectedLabel = (count) => `${count} selected`,
            contentClassName,
            contentAlign = "start",
            portalContainer,
            children,
            variant = "outline",
            size = "sm",
            ...props
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = React.useState(false)

        const triggerStyles: Record<FilterButtonVariantKey, string> = {
            default: "inline-flex h-9 max-w-full flex-row items-center gap-2 rounded-md border border-dashed px-3 py-2",
            popover: "inline-flex h-9 max-w-full flex-row items-center gap-2 rounded-md border border-primary-border bg-primary-subtle px-3 py-2 text-primary-subtle-foreground",
            selected: "inline-flex h-9 max-w-full flex-row items-center gap-2 rounded-md border border-primary bg-primary-subtle px-3 py-2 text-primary-subtle-foreground",
        }

        const triggerVariant: FilterButtonVariantKey =
            selectedValues.size > 0 ? "selected" : isOpen ? "popover" : filterButtonDefaultVariantKey

        const handleSelect = (value: string) => {
            const newSet = new Set(selectedValues)
            if (newSet.has(value)) {
                newSet.delete(value)
            } else {
                newSet.add(value)
            }
            onFilterChange?.(newSet)
        }
        const popoverContent = children ?? (
            <Command>
                <CommandList>
                    <CommandGroup>
                        {options.map((option) => {
                            const isSelected = selectedValues.has(option.value)
                            return (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => handleSelect(option.value)}
                                >
                                    <div
                                        className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            isSelected
                                                ? "bg-primary text-primary-foreground"
                                                : "opacity-50 [&_svg]:invisible"
                                        )}
                                    >
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <span>{option.label}</span>
                                </CommandItem>
                            )
                        })}
                    </CommandGroup>
                    {selectedValues.size > 0 && (
                        <>
                            <div className="h-px bg-border mx-1 my-1" />
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => onFilterChange?.(new Set())}
                                    className="justify-center text-center"
                                >
                                    {clearLabel}
                                </CommandItem>
                            </CommandGroup>
                        </>
                    )}
                </CommandList>
            </Command>
        )

        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        variant={variant}
                        size={size}
                        className={cn(triggerStyles[triggerVariant], className)}
                        {...props}
                    >
                        {icon ?? <FilterIcon className="h-4 w-4" aria-hidden="true" />}
                        <span className="min-w-0 truncate">{title}</span>
                        <Badge variant="secondary"
                            className={cn(
                                "ml-0.5 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-xs leading-none",
                                selectedValues.size === 0 && "invisible"
                            )}
                            aria-hidden={selectedValues.size === 0 ? "true" : undefined}
                            aria-label={selectedValues.size > 0 ? selectedLabel(selectedValues.size) : undefined}
                        >
                            {selectedValues.size || 0}
                        </Badge>
                    </Button>
                </PopoverTrigger>
                {contentClassName ? (
                    <PopoverContent
                        className={contentClassName}
                        align={contentAlign}
                        portalContainer={portalContainer}
                    >
                        {popoverContent}
                    </PopoverContent>
                ) : (
                    <PopoverContent
                        className="w-[200px] p-0"
                        align={contentAlign}
                        portalContainer={portalContainer}
                    >
                        {popoverContent}
                    </PopoverContent>
                )}
            </Popover>
        )
    }
)
FilterButton.displayName = "FilterButton"

export { FilterButton }
