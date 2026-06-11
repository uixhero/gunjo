"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Tag } from "../display/Tag"

export interface TagInputProps {
    id?: string
    value?: string[]
    onValueChange?: (value: string[]) => void
    placeholder?: string
    /** Keys that commit the current input value as a tag. Default ["Enter", ","]. */
    commitKeys?: string[]
    /** Reject duplicates (case-insensitive). Default true. */
    dedupe?: boolean
    maxTags?: number
    removeLabel?: string
    className?: string
    disabled?: boolean
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
    (
        {
            value,
            id,
            onValueChange,
            placeholder = "Add tag...",
            commitKeys = ["Enter", ","],
            dedupe = true,
            maxTags,
            removeLabel = "Remove tag",
            className,
            disabled,
        },
        ref
    ) => {
        const [draft, setDraft] = React.useState("")
        const isComposingRef = React.useRef(false)
        const tags = value ?? []

        const commit = React.useCallback(() => {
            const trimmed = draft.trim()
            if (!trimmed) return
            if (maxTags !== undefined && tags.length >= maxTags) return
            if (dedupe && tags.some((t) => t.toLowerCase() === trimmed.toLowerCase()))
                return
            onValueChange?.([...tags, trimmed])
            setDraft("")
        }, [draft, tags, dedupe, maxTags, onValueChange])

        const remove = (target: string) => {
            onValueChange?.(tags.filter((t) => t !== target))
        }

        const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
            const nativeEvent = event.nativeEvent as KeyboardEvent & { keyCode?: number }
            if (nativeEvent.isComposing || isComposingRef.current || nativeEvent.keyCode === 229) {
                return
            }
            if (commitKeys.includes(event.key)) {
                event.preventDefault()
                commit()
            } else if (event.key === "Backspace" && !draft && tags.length > 0) {
                remove(tags[tags.length - 1])
            }
        }

        return (
            <div
                className={cn(
                    "flex flex-wrap items-center gap-1 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
                    disabled && "opacity-50 pointer-events-none",
                    className
                )}
                data-slot="tag-input"
            >
                {tags.map((tag) => (
                    <Tag
                        key={tag}
                        size="sm"
                        onRemove={disabled ? undefined : () => remove(tag)}
                        removeLabel={removeLabel}
                    >
                        {tag}
                    </Tag>
                ))}
                <input
                    id={id}
                    ref={ref}
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onCompositionStart={() => {
                        isComposingRef.current = true
                    }}
                    onCompositionEnd={(event) => {
                        isComposingRef.current = false
                        setDraft(event.currentTarget.value)
                    }}
                    onKeyDown={handleKeyDown}
                    onBlur={commit}
                    placeholder={tags.length === 0 ? placeholder : ""}
                    disabled={disabled}
                    className="min-w-[80px] flex-1 bg-transparent px-1 py-0.5 outline-none placeholder:text-muted-foreground"
                />
            </div>
        )
    }
)
TagInput.displayName = "TagInput"

export { TagInput }
