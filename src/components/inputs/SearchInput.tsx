"use client"

import * as React from "react"
import { IconSearch as Search, IconX as X } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"

export interface SearchInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
    value?: string
    onValueChange?: (value: string) => void
    /** Show a clear (×) button when value is non-empty. Default true. */
    clearable?: boolean
    clearLabel?: string
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    (
        {
            className,
            value,
            onValueChange,
            clearable = true,
            clearLabel = "Clear search",
            disabled,
            placeholder = "Search...",
            ...props
        },
        ref
    ) => {
        const showClear = clearable && !!value && !disabled

        return (
            <div
                className={cn(
                    "relative inline-flex items-center w-full",
                    disabled && "opacity-50 pointer-events-none",
                    className
                )}
                data-slot="search-input"
            >
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    ref={ref}
                    type="search"
                    value={value ?? ""}
                    onChange={(e) => onValueChange?.(e.target.value)}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-9 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden"
                    {...props}
                />
                {showClear ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={() => onValueChange?.("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                aria-label={clearLabel}
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>{clearLabel}</TooltipContent>
                    </Tooltip>
                ) : null}
            </div>
        )
    }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }
