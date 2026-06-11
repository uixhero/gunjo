"use client"

import * as React from "react"
import { IconPlus as Plus } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import { TagInput } from "../inputs/TagInput"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import { tagEditorDefaultVariantKey } from "./generated/default-variant-keys"
import type { TagEditorVariantKey } from "./generated/variant-keys"

export interface TagEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    value: string[]
    onValueChange?: (value: string[]) => void
    suggestions?: string[]
    label?: React.ReactNode
    placeholder?: string
    removeLabel?: string
    maxTagsReachedLabel?: string
    disabledLabel?: string
    maxTags?: number
    variant?: TagEditorVariantKey
    disabled?: boolean
}

const variantClasses: Record<TagEditorVariantKey, { root: string; input: string }> = {
    default: {
        root: "space-y-3",
        input: "min-h-10",
    },
    compact: {
        root: "space-y-2",
        input: "min-h-9 text-xs",
    },
}

function addTag(value: string[], next: string, maxTags?: number) {
    const trimmed = next.trim()
    if (!trimmed) return value
    if (maxTags !== undefined && value.length >= maxTags) return value
    if (value.some((tag) => tag.toLowerCase() === trimmed.toLowerCase())) return value
    return [...value, trimmed]
}

const TagEditor = React.forwardRef<HTMLDivElement, TagEditorProps>(
    (
        {
            value,
            onValueChange,
            suggestions = [],
            label = "Tags",
            placeholder = "Add tag...",
            removeLabel = "Remove tag",
            maxTagsReachedLabel = "Maximum number of tags reached",
            disabledLabel = "Tag editing is disabled",
            maxTags,
            variant = tagEditorDefaultVariantKey,
            disabled,
            className,
            ...props
        },
        ref
    ) => {
        const classes = variantClasses[variant]
        const isAtMax = maxTags !== undefined && value.length >= maxTags
        const availableSuggestions = suggestions.filter(
            (suggestion) => !value.some((tag) => tag.toLowerCase() === suggestion.toLowerCase())
        )

        return (
            <div ref={ref} className={cn("w-full p-0", classes.root, className)} {...props}>
                {label ? (
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {label}
                        </span>
                        {maxTags ? (
                            <span className="text-xs text-muted-foreground">
                                {value.length}/{maxTags}
                            </span>
                        ) : null}
                    </div>
                ) : null}
                <TagInput
                    value={value}
                    onValueChange={onValueChange}
                    placeholder={placeholder}
                    removeLabel={removeLabel}
                    maxTags={maxTags}
                    disabled={disabled}
                    className={classes.input}
                />
                {availableSuggestions.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                        {availableSuggestions.slice(0, 6).map((suggestion) => {
                            const suggestionDisabled = disabled || isAtMax
                            const button = (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={suggestionDisabled}
                                    className="h-7 gap-1 px-2 text-xs"
                                    onClick={() => onValueChange?.(addTag(value, suggestion, maxTags))}
                                >
                                    <Plus className="h-3 w-3" aria-hidden="true" />
                                    {suggestion}
                                </Button>
                            )

                            if (!suggestionDisabled) {
                                return (
                                    <React.Fragment key={suggestion}>
                                        {button}
                                    </React.Fragment>
                                )
                            }

                            const disabledReason = isAtMax ? maxTagsReachedLabel : disabledLabel

                            return (
                                <Tooltip key={suggestion}>
                                    <TooltipTrigger asChild>
                                        <span className="inline-flex cursor-not-allowed" tabIndex={0}>
                                            {button}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>{disabledReason}</TooltipContent>
                                </Tooltip>
                            )
                        })}
                    </div>
                ) : null}
            </div>
        )
    }
)
TagEditor.displayName = "TagEditor"

export { TagEditor }
