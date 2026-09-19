"use client"

import * as React from "react"
import { IconCheck, IconMinus } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../overlay/Popover"
import { MapControlButton, type MapControlButtonProps } from "./MapControlButton"

export interface LayerMenuItem {
    /** Stable id — what `value` holds. */
    id: string
    label: React.ReactNode
    /** A few words on the right: where it shows ("appears when zoomed in"). */
    note?: React.ReactNode
    /**
     * Set when the layer cannot be switched right now, with the reason in a
     * few words ("zoom in to see"). The row stays visible with its state, the
     * reason takes the note's place, and nothing — not the row, not "All" —
     * changes it until the reason goes away.
     */
    disabledReason?: React.ReactNode
}

export interface LayerMenuGroup {
    id: string
    /** The group heading ("Weather", "Position", "Map"). */
    label: React.ReactNode
    items: LayerMenuItem[]
}

export type LayerMenuAllState = "on" | "off" | "mixed"

export interface LayerMenuProps {
    /** Layers in groups, in the order they are drawn. */
    groups: LayerMenuGroup[]
    /** Ids of the layers that are on. */
    value: string[]
    onValueChange: (value: string[]) => void
    /** The glyph on the button that opens the menu. */
    icon: React.ReactNode
    /**
     * The button's accessible name and tooltip. Say what a long press does as
     * well — it is otherwise invisible ("Choose layers (hold to hide all)").
     */
    label: string
    /** The first row, which switches every layer at once. Default `"All"`. */
    allLabel?: React.ReactNode
    /**
     * How long a press has to be to count as "hide all / bring back", in ms.
     * Default 450. `0` turns the long press off.
     */
    longPressMs?: number
    /** Fires after a long press has switched the layers (for a haptic tick). */
    onLongPress?: () => void
    /** Size of the trigger, as `MapControlButton`. */
    size?: MapControlButtonProps["size"]
    /** Popover placement. Default `"top"`. */
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
    /** Render the menu inside this element (a map container in fullscreen). */
    portalContainer?: HTMLElement | null
    className?: string
    /**
     * Render the list itself, with no button and no popover — for a side pane
     * on a wide screen, where the menu is always open. Long press does not
     * apply (there is no button).
     */
    inline?: boolean
    /** Controlled open state. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

/** Whether the "All" row is on, off, or partly on — over switchable layers only. */
export function layerMenuAllState(groups: LayerMenuGroup[], value: string[]): LayerMenuAllState {
    const on = new Set(value)
    const switchable = groups.flatMap((g) => g.items).filter((item) => !item.disabledReason)
    const count = switchable.filter((item) => on.has(item.id)).length
    if (count === 0) return "off"
    return count === switchable.length ? "on" : "mixed"
}

function Mark({ state }: { state: "on" | "off" | "mixed" }) {
    return (
        <span
            aria-hidden
            className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border",
                state === "on"
                    ? "border-primary-strong bg-primary-strong text-primary-strong-foreground"
                    : "border-input bg-background text-foreground"
            )}
        >
            {state === "on" ? <IconCheck className="h-3 w-3" stroke={3} /> : null}
            {state === "mixed" ? <IconMinus className="h-3 w-3" stroke={3} /> : null}
        </span>
    )
}

const rowClass =
    "flex min-h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-sm text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:hover:bg-transparent"

/**
 * LayerMenu — choose what is drawn on top of a map: clouds, rain, borders,
 * tracked objects. Layers come in groups, and the first row switches them all.
 *
 * ⭐ **A tap opens the menu; a long press hides everything (and a second one
 * brings it back).** The action that changes the whole picture goes on the
 * gesture you cannot do by accident — a tap is how people find out what a
 * button does, so a tap must not repaint the map. The "All" row does the same
 * thing for readers who never discover the long press (keyboard included).
 *
 * ⭐ **"All" has three states**: every layer on, every layer off, and some
 * (a dash). It looks like the other rows on purpose — a row without a mark
 * would read as a different kind of thing.
 *
 * A layer that cannot be switched right now keeps its row and its state and
 * says why in a few words. Rows stay open after a press so the reader sees the
 * marks change; the menu closes on outside press or Escape.
 *
 * The same shape works for a chart's series.
 */
function LayerMenu({
    groups,
    value,
    onValueChange,
    icon,
    label,
    allLabel = "All",
    longPressMs = 450,
    onLongPress,
    size,
    side = "top",
    align = "center",
    portalContainer,
    className,
    inline = false,
    open: openProp,
    onOpenChange,
}: LayerMenuProps) {
    const [openState, setOpenState] = React.useState(false)
    const open = openProp ?? openState
    const setOpen = React.useCallback(
        (next: boolean) => {
            if (openProp === undefined) setOpenState(next)
            onOpenChange?.(next)
        },
        [openProp, onOpenChange]
    )

    const on = React.useMemo(() => new Set(value), [value])
    const allState = layerMenuAllState(groups, value)
    const locked = React.useMemo(
        () => groups.flatMap((g) => g.items).filter((item) => item.disabledReason),
        [groups]
    )
    const switchable = React.useMemo(
        () => groups.flatMap((g) => g.items).filter((item) => !item.disabledReason),
        [groups]
    )

    // What "All" brings back: the set that was on before everything was hidden.
    const restoreRef = React.useRef<string[] | null>(null)

    const toggleAll = React.useCallback(() => {
        const keepLocked = locked.filter((item) => on.has(item.id)).map((item) => item.id)
        if (allState === "off") {
            const restore = restoreRef.current
            const back =
                restore && restore.length > 0
                    ? switchable.filter((item) => restore.includes(item.id)).map((item) => item.id)
                    : switchable.map((item) => item.id)
            onValueChange([...keepLocked, ...back])
            restoreRef.current = null
        } else {
            restoreRef.current = switchable.filter((item) => on.has(item.id)).map((item) => item.id)
            onValueChange(keepLocked)
        }
    }, [allState, locked, on, onValueChange, switchable])

    const toggle = (id: string) => {
        restoreRef.current = null
        onValueChange(on.has(id) ? value.filter((v) => v !== id) : [...value, id])
    }

    // Long press on the trigger.
    const timerRef = React.useRef<number | null>(null)
    const longFiredRef = React.useRef(false)
    const clearTimer = () => {
        if (timerRef.current !== null) window.clearTimeout(timerRef.current)
        timerRef.current = null
    }
    React.useEffect(() => clearTimer, [])

    const allId = React.useId()

    const list = (
        <>
            <button
                type="button"
                id={allId}
                aria-pressed={allState === "mixed" ? "mixed" : allState === "on"}
                className={cn(rowClass, "font-medium")}
                onClick={toggleAll}
            >
                <Mark state={allState} />
                <span className="min-w-0 flex-1">{allLabel}</span>
            </button>
            {groups.map((group) => {
                const headingId = `${allId}-${group.id}`
                return (
                    <div
                        key={group.id}
                        role="group"
                        aria-labelledby={headingId}
                        className="mt-1 border-t border-border pt-1"
                    >
                        <div
                            id={headingId}
                            className={cn(
                                    "px-2 pb-0.5 pt-1.5 font-medium tracking-wide text-muted-foreground",
                                    // The canvas tier is for text over the map; the inline list sits off it.
                                    inline ? "text-xs" : "text-canvas-sm"
                                )}
                        >
                            {group.label}
                        </div>
                        {group.items.map((item) => {
                            const isOn = on.has(item.id)
                            const disabled = Boolean(item.disabledReason)
                            const noteId = `${headingId}-${item.id}-note`
                            const note = item.disabledReason ?? item.note
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-pressed={isOn}
                                    aria-describedby={note ? noteId : undefined}
                                    disabled={disabled}
                                    className={rowClass}
                                    onClick={() => toggle(item.id)}
                                >
                                    <span className={cn("contents", disabled && "[&>*:first-child]:opacity-50")}>
                                        <Mark state={isOn ? "on" : "off"} />
                                    </span>
                                    <span className={cn("min-w-0 flex-1 truncate", disabled && "text-muted-foreground")}>
                                        {item.label}
                                    </span>
                                    {note ? (
                                        <span
                                            id={noteId}
                                            className={cn("shrink-0 text-muted-foreground", inline ? "text-xs" : "text-canvas-sm")}
                                        >
                                            {note}
                                        </span>
                                    ) : null}
                                </button>
                            )
                        })}
                    </div>
                )
            })}
        </>
    )

    if (inline) {
        return (
            <div
                role="group"
                aria-label={label}
                className={cn(
                    "flex w-60 flex-col rounded-lg border bg-popover p-1.5 text-popover-foreground shadow-md",
                    className
                )}
            >
                {list}
            </div>
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <MapControlButton
                    label={label}
                    size={size}
                    className={cn(
                        "select-none [-webkit-touch-callout:none]",
                        "aria-expanded:border-primary-strong aria-expanded:bg-primary-strong aria-expanded:text-primary-strong-foreground",
                        allState === "off" && "bg-background/60",
                        className
                    )}
                    data-all={allState}
                    onContextMenu={(event) => {
                        if (longPressMs > 0) event.preventDefault()
                    }}
                    onPointerDown={() => {
                        longFiredRef.current = false
                        clearTimer()
                        if (longPressMs <= 0) return
                        timerRef.current = window.setTimeout(() => {
                            longFiredRef.current = true
                            timerRef.current = null
                            toggleAll()
                            onLongPress?.()
                        }, longPressMs)
                    }}
                    onPointerUp={clearTimer}
                    onPointerLeave={clearTimer}
                    onPointerCancel={clearTimer}
                    onClick={(event) => {
                        // The press that just fired the long press must not also
                        // open the menu. preventDefault stops Radix's own handler.
                        if (longFiredRef.current) {
                            longFiredRef.current = false
                            event.preventDefault()
                        }
                    }}
                >
                    {icon}
                </MapControlButton>
            </PopoverTrigger>
            <PopoverContent
                side={side}
                align={align}
                sideOffset={8}
                portalContainer={portalContainer}
                className="w-60 gap-0 overflow-y-auto p-1.5 backdrop-blur-md"
            >
                {list}
            </PopoverContent>
        </Popover>
    )
}

export { LayerMenu }
