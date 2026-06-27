"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

export interface FilterChip {
  /** The value this chip selects. */
  value: string
  /** Chip label. */
  label: React.ReactNode
  /** Optional leading icon. */
  icon?: React.ReactNode
  /** Optional trailing count. */
  count?: number
  disabled?: boolean
}

export interface FilterChipsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** The chips. */
  items: FilterChip[]
  /** Selected value (single-select). */
  value: string
  /** Selection handler. */
  onValueChange: (value: string) => void
  /** Accessible name for the chip group. */
  "aria-label"?: string
}

/**
 * FilterChips — the horizontally-scrollable, single-select category chip bar: the navigation
 * every consumer place / list finder opens with (空港・駅の施設, 食べlog, retail, transit,
 * food delivery). A scroll-snapping row of pill chips (icon + label + optional count) that
 * does NOT center-wrap on a phone, with a fully-filled active chip, roving tabindex + arrow
 * keys, and a hidden scrollbar. For 2–3 equal-width segments use ToggleGroup; for a faceted
 * popover filter use FilterButton; this is the many-category scannable rail.
 */
export const FilterChips = React.forwardRef<HTMLDivElement, FilterChipsProps>(
  ({ items, value, onValueChange, className, "aria-label": ariaLabel = "絞り込み", ...props }, forwardedRef) => {
    const innerRef = React.useRef<HTMLDivElement>(null)
    React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLDivElement)

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return
      const chips = Array.from(innerRef.current?.querySelectorAll<HTMLButtonElement>("button[data-chip]") ?? []).filter(
        (c) => !c.disabled
      )
      if (chips.length === 0) return
      e.preventDefault()
      const cur = chips.indexOf(document.activeElement as HTMLButtonElement)
      let next: number
      if (e.key === "Home") next = 0
      else if (e.key === "End") next = chips.length - 1
      else {
        const dir = e.key === "ArrowRight" ? 1 : -1
        next = ((cur === -1 ? 0 : cur) + dir + chips.length) % chips.length
      }
      chips[next].focus()
      chips[next].click()
    }

    return (
      <div
        ref={innerRef}
        role="group"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className
        )}
        {...props}
      >
        {items.map((chip) => {
          const active = chip.value === value
          return (
            <button
              key={chip.value}
              type="button"
              data-chip
              aria-pressed={active}
              tabIndex={active ? 0 : -1}
              disabled={chip.disabled}
              onClick={() => onValueChange(chip.value)}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-accent"
              )}
            >
              {chip.icon != null && (
                <span className="shrink-0" aria-hidden="true">
                  {chip.icon}
                </span>
              )}
              {chip.label}
              {chip.count != null && (
                <span className={cn("ml-0.5 tabular-nums", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {chip.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }
)
FilterChips.displayName = "FilterChips"
