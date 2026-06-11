"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

export interface MentionOption {
    id: string
    label: string
    /** Hint shown next to label (e.g. real name, role). */
    hint?: string
}

export interface MentionProps
    extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> {
    value?: string
    onValueChange?: (value: string) => void
    /** Trigger character. Default "@". */
    trigger?: string
    /** Available people / items to suggest. */
    options: MentionOption[]
    /** Limit shown suggestions. Default 6. */
    maxSuggestions?: number
}

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function getClippingRect(root: HTMLElement) {
    let element = root.parentElement

    while (element && element !== document.documentElement) {
        const style = window.getComputedStyle(element)
        const overflow = `${style.overflow} ${style.overflowX} ${style.overflowY}`

        if (/(auto|scroll|hidden|clip)/.test(overflow)) {
            return element.getBoundingClientRect()
        }

        element = element.parentElement
    }

    return { top: 0, bottom: window.innerHeight }
}

const Mention = React.forwardRef<HTMLTextAreaElement, MentionProps>(
    (
        {
            className,
            value: controlledValue,
            onValueChange,
            trigger = "@",
            options,
            maxSuggestions = 6,
            disabled,
            placeholder,
            rows = 3,
            ...props
        },
        ref
    ) => {
        const [internalValue, setInternalValue] = React.useState("")
        const isControlled = controlledValue !== undefined
        const value = isControlled ? controlledValue : internalValue

        const setValue = (next: string) => {
            if (!isControlled) setInternalValue(next)
            onValueChange?.(next)
        }

        const [activeIndex, setActiveIndex] = React.useState(0)
        const [suggestionsDismissed, setSuggestionsDismissed] = React.useState(false)
        const [suggestionSide, setSuggestionSide] = React.useState<"top" | "bottom">("bottom")
        const [suggestionMaxHeight, setSuggestionMaxHeight] = React.useState<number | undefined>(undefined)
        const rootRef = React.useRef<HTMLDivElement | null>(null)
        const internalRef = React.useRef<HTMLTextAreaElement | null>(null)
        const setRef = (node: HTMLTextAreaElement | null) => {
            internalRef.current = node
            if (typeof ref === "function") ref(node)
            else if (ref) ref.current = node
        }

        const triggerInfo = React.useMemo(() => {
            const el = internalRef.current
            const cursor = el?.selectionStart ?? value.length
            const before = value.slice(0, cursor)
            const triggerIdx = before.lastIndexOf(trigger)
            if (triggerIdx === -1) return null
            // Reject if there's whitespace between trigger and cursor (means we left the mention scope)
            const segment = before.slice(triggerIdx + trigger.length)
            if (/\s/.test(segment)) return null
            return { triggerIdx, query: segment }
        }, [value, trigger])

        const filtered = React.useMemo(() => {
            if (!triggerInfo) return []
            const q = triggerInfo.query.toLowerCase()
            return options
                .filter((o) => o.label.toLowerCase().includes(q))
                .slice(0, maxSuggestions)
        }, [triggerInfo, options, maxSuggestions])

        React.useEffect(() => {
            setActiveIndex(0)
        }, [triggerInfo?.query])

        const showSuggestions = !suggestionsDismissed && !!triggerInfo && filtered.length > 0
        const mentionPattern = React.useMemo(() => {
            const labels = options
                .map((option) => option.label)
                .filter(Boolean)
                .sort((a, b) => b.length - a.length)
                .map(escapeRegExp)
            if (labels.length === 0) return null
            return new RegExp(`${escapeRegExp(trigger)}(${labels.join("|")})(?=\\s|$)`, "g")
        }, [options, trigger])

        const highlightedValue = React.useMemo(() => {
            if (!mentionPattern || value.length === 0) return value

            const parts: React.ReactNode[] = []
            let lastIndex = 0
            for (const match of value.matchAll(mentionPattern)) {
                const index = match.index ?? 0
                if (index > lastIndex) {
                    parts.push(value.slice(lastIndex, index))
                }
                parts.push(
                    <span key={`${index}-${match[0]}`} className="font-medium text-primary">
                        {match[0]}
                    </span>
                )
                lastIndex = index + match[0].length
            }
            if (lastIndex < value.length) {
                parts.push(value.slice(lastIndex))
            }
            return parts
        }, [mentionPattern, value])

        React.useLayoutEffect(() => {
            if (!showSuggestions) return
            const root = rootRef.current
            if (!root) return
            const rootRect = root.getBoundingClientRect()
            const contentFitEmbed =
                !!root.closest("[data-embed-fit-height-content='true']") ||
                (typeof window !== "undefined" &&
                    new URLSearchParams(window.location.search).get("fitHeight") === "content")
            const estimatedHeight = Math.min(filtered.length, maxSuggestions) * 36 + 8
            if (contentFitEmbed) {
                setSuggestionSide("bottom")
                setSuggestionMaxHeight(Math.min(estimatedHeight, 4 * 36 + 8))
                return
            }
            const clippingRect = getClippingRect(root)
            const bottomSpace = clippingRect.bottom - rootRect.bottom
            const topSpace = rootRect.top - clippingRect.top
            const nextSide = bottomSpace < estimatedHeight && topSpace > bottomSpace ? "top" : "bottom"
            const availableSpace = Math.max(0, nextSide === "top" ? topSpace : bottomSpace)
            setSuggestionSide(nextSide)
            setSuggestionMaxHeight(Math.floor(Math.max(0, availableSpace - 8)))
        }, [showSuggestions, filtered.length])

        const insertMention = (option: MentionOption) => {
            if (!triggerInfo) return
            const cursor = internalRef.current?.selectionStart ?? value.length
            const before = value.slice(0, triggerInfo.triggerIdx)
            const after = value.slice(cursor)
            const newValue = `${before}${trigger}${option.label} ${after}`
            setSuggestionsDismissed(true)
            setValue(newValue)
            // Move cursor after inserted mention
            window.setTimeout(() => {
                const target = internalRef.current
                if (!target) return
                const pos = before.length + trigger.length + option.label.length + 1
                target.setSelectionRange(pos, pos)
                target.focus()
            }, 0)
        }

        const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const nativeEvent = event.nativeEvent as InputEvent
            const inputData = typeof nativeEvent.data === "string" ? nativeEvent.data : null
            if (inputData === trigger || !suggestionsDismissed) {
                setSuggestionsDismissed(false)
            } else {
                setSuggestionsDismissed(true)
            }
            setValue(event.target.value)
        }

        const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (!showSuggestions) return
            if (event.key === "ArrowDown") {
                event.preventDefault()
                setActiveIndex((i) => (i + 1) % filtered.length)
            } else if (event.key === "ArrowUp") {
                event.preventDefault()
                setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length)
            } else if (event.key === "Enter" || event.key === "Tab") {
                event.preventDefault()
                insertMention(filtered[activeIndex])
            } else if (event.key === "Escape") {
                event.preventDefault()
                setSuggestionsDismissed(true)
            }
        }

        return (
            <div ref={rootRef} className={cn("relative w-full", className)} data-slot="mention">
                {value ? (
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 whitespace-pre-wrap break-words rounded-md border border-transparent px-3 py-2 text-sm text-foreground"
                    >
                        {highlightedValue}
                    </div>
                ) : null}
                <textarea
                    ref={setRef}
                    rows={rows}
                    value={value}
                    onKeyDown={handleKeyDown}
                    onClick={() => setSuggestionsDismissed(true)}
                    disabled={disabled}
                    placeholder={placeholder}
                    onChange={handleChange}
                    className={cn(
                        "relative flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm caret-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                        value && "text-transparent selection:bg-primary-subtle"
                    )}
                    {...props}
                />
                {showSuggestions ? (
                    <div
                        data-slot="mention-suggestions"
                        className={cn(
                            "absolute left-0 z-50 w-full max-w-xs rounded-md border bg-popover p-1 shadow-md",
                            suggestionSide === "top" ? "bottom-full mb-1" : "top-full mt-1"
                        )}
                        style={{ maxHeight: suggestionMaxHeight }}
                    >
                        <ul role="listbox" className="max-h-[inherit] overflow-y-auto">
                            {filtered.map((option, idx) => (
                                <li key={option.id}>
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={idx === activeIndex}
                                        onMouseEnter={() => setActiveIndex(idx)}
                                        onMouseDown={(event) => event.preventDefault()}
                                        onClick={() => insertMention(option)}
                                        className={cn(
                                            "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm",
                                            idx === activeIndex && "bg-muted"
                                        )}
                                    >
                                        <span className="font-medium">{option.label}</span>
                                        {option.hint ? (
                                            <span className="text-xs text-muted-foreground">
                                                {option.hint}
                                            </span>
                                        ) : null}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>
        )
    }
)
Mention.displayName = "Mention"

export { Mention }
