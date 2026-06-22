"use client"

import * as React from "react"
import { IconCheck as Check, IconSelector as ChevronsUpDown, IconX as X } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../navigation/Command"
import { Popover, PopoverContent, PopoverTrigger } from "../overlay/Popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"

export interface ComboboxOption {
    value: string
    label: string
    disabled?: boolean
    disabledReason?: string
    /** Optional group heading. When any option sets it, options render under grouped headings. */
    group?: string
    /** Extra search terms (besides the label) matched by the search box. */
    keywords?: string[]
}

export interface ComboboxProps {
    id?: string
    options: ComboboxOption[]
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    searchClearLabel?: string
    emptyMessage?: string
    className?: string
    triggerClassName?: string
    disabled?: boolean
    clearable?: boolean
    clearLabel?: string
    /** ARIA attributes forwarded to the trigger so a Combobox can participate in form validation. */
    "aria-invalid"?: boolean | "true" | "false"
    "aria-describedby"?: string
    "aria-labelledby"?: string
    "aria-label"?: string
    "aria-required"?: boolean
    required?: boolean
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
    (
        {
            id,
            options,
            value,
            onValueChange,
            placeholder = "Select option...",
            searchPlaceholder = "Search...",
            searchClearLabel = "Clear search",
            emptyMessage = "No option found.",
            className,
            triggerClassName,
            disabled,
            clearable = true,
            clearLabel = "Clear selection",
            "aria-invalid": ariaInvalid,
            "aria-describedby": ariaDescribedby,
            "aria-labelledby": ariaLabelledby,
            "aria-label": ariaLabel,
            "aria-required": ariaRequired,
            required,
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)
        const selected = options.find((option) => option.value === value)
        const canClear = clearable && Boolean(selected) && !disabled

        const renderOption = (option: ComboboxOption) => {
            const item = (
                <CommandItem
                    key={option.value}
                    value={option.value}
                    // Make the label (and any extra terms) searchable even though
                    // `value` is the selection key — cmdk filters on value + keywords. (#202)
                    keywords={[option.label, ...(option.keywords ?? [])]}
                    disabled={option.disabled}
                    aria-disabled={option.disabled}
                    className={cn(
                        option.disabled &&
                        "cursor-not-allowed opacity-50 aria-selected:bg-transparent aria-selected:text-foreground"
                    )}
                    onSelect={() => {
                        if (option.disabled) return
                        onValueChange?.(option.value === value ? "" : option.value)
                        setOpen(false)
                    }}
                >
                    <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                </CommandItem>
            )

            if (!option.disabled || !option.disabledReason) return item

            return (
                <Tooltip key={option.value}>
                    <TooltipTrigger asChild>
                        <span className="block" aria-label={option.disabledReason}>
                            {item}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>{option.disabledReason}</TooltipContent>
                </Tooltip>
            )
        }

        // Preserve order of first appearance for grouped rendering.
        const hasGroups = options.some((option) => option.group)
        const groupOrder: string[] = []
        for (const option of options) {
            const key = option.group ?? ""
            if (!groupOrder.includes(key)) groupOrder.push(key)
        }

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <div className="relative">
                    <PopoverTrigger asChild>
                        <Button
                            id={id}
                            ref={ref}
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            aria-invalid={ariaInvalid}
                            aria-describedby={ariaDescribedby}
                            aria-labelledby={ariaLabelledby}
                            aria-label={ariaLabel}
                            aria-required={ariaRequired ?? required}
                            disabled={disabled}
                            data-slot="combobox"
                            className={cn(
                                "w-full justify-between",
                                canClear ? "pr-16" : "pr-10",
                                "aria-invalid:border-destructive-border aria-invalid:ring-1 aria-invalid:ring-destructive-border",
                                !selected && "text-muted-foreground",
                                triggerClassName
                            )}
                        >
                            <span className="min-w-0 flex-1 truncate text-left">
                                {selected ? selected.label : placeholder}
                            </span>
                            <ChevronsUpDown className="absolute right-3 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    {canClear ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    className="absolute right-9 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    aria-label={clearLabel}
                                    onClick={(event) => {
                                        event.preventDefault()
                                        event.stopPropagation()
                                        onValueChange?.("")
                                        setOpen(false)
                                    }}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>{clearLabel}</TooltipContent>
                        </Tooltip>
                    ) : null}
                </div>
                <PopoverContent className={cn("w-[var(--radix-popover-trigger-width)] p-0", className)}>
                    <Command>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            clearable
                            clearLabel={searchClearLabel}
                        />
                        <CommandList>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            {hasGroups ? (
                                groupOrder.map((groupKey) => (
                                    <CommandGroup key={groupKey || "__ungrouped"} heading={groupKey || undefined}>
                                        {options
                                            .filter((option) => (option.group ?? "") === groupKey)
                                            .map(renderOption)}
                                    </CommandGroup>
                                ))
                            ) : (
                                <CommandGroup>{options.map(renderOption)}</CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        )
    }
)
Combobox.displayName = "Combobox"

export { Combobox }
