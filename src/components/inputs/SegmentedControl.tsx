"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

export type SegmentedControlSize = "sm" | "default" | "lg"

export interface SegmentedControlOption {
  /** The value committed via onValueChange when this segment is chosen. */
  value: string
  /** Segment label. */
  label: React.ReactNode
  /** Optional leading icon (paired with the label — meaning never on colour alone). */
  icon?: React.ReactNode
  /** Disable this one segment. */
  disabled?: boolean
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** The segments (2–4 is the sweet spot). Each `{ value, label, icon?, disabled? }`. */
  options: SegmentedControlOption[]
  /** Controlled selected value. */
  value?: string
  /** Uncontrolled initial value. */
  defaultValue?: string
  /** Fires with the chosen value — always a single string (never an array). */
  onValueChange?: (value: string) => void
  /** Segment height. Default `"default"` (h-9). `"lg"` is h-11 (≥44px touch). */
  size?: SegmentedControlSize
  /** Equal-width segments filling the row. Default `true` (the segmented look). */
  fullWidth?: boolean
  /** Disable the whole control. */
  disabled?: boolean
  /** Accessible name for the group. */
  "aria-label"?: string
}

const TRACK_PAD: Record<SegmentedControlSize, string> = {
  sm: "p-0.5",
  default: "p-1",
  lg: "p-1",
}

const SEG_SIZE: Record<SegmentedControlSize, string> = {
  sm: "h-7 px-2.5 text-xs",
  default: "h-9 px-3 text-sm",
  lg: "h-11 px-4 text-sm",
}

/**
 * SegmentedControl — the small inline single-select toggle: 2–4 equal-width segments on a
 * recessed track, the active one raised (the iOS/Android segmented look). For the compact
 * either/or choices a B2C form is full of — 旅客区分 (大人/小児), 支払い (現金/IC/QR),
 * 片道/往復, 出発/到着, 個人/法人, 日/週/月. A real `role="radiogroup"` with `role="radio"`
 * segments, roving tabindex + arrow-key nav (WAI-ARIA), and a colour-safe selected state
 * (raised surface, not colour alone). `onValueChange` is always a single string.
 *
 * Distinct from `ToggleGroup` (the general, content-fit, single-OR-multi toggle for desktop
 * filters / formatting) and `RadioCard` (the large, priced choice CARD): this is the small
 * equal-width mode/segment switch. Controlled (`value`) or uncontrolled (`defaultValue`).
 */
const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      className,
      options,
      value,
      defaultValue,
      onValueChange,
      size = "default",
      fullWidth = true,
      disabled = false,
      ...props
    },
    forwardedRef
  ) => {
    const [internal, setInternal] = React.useState(defaultValue)
    const activeValue = value !== undefined ? value : internal
    const innerRef = React.useRef<HTMLDivElement>(null)
    React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLDivElement)

    const commit = (v: string) => {
      if (value === undefined) setInternal(v)
      onValueChange?.(v)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)) return
      const el = innerRef.current
      if (!el) return
      const radios = Array.from(el.querySelectorAll<HTMLButtonElement>('[role="radio"]')).filter((r) => !r.disabled)
      if (radios.length === 0) return
      event.preventDefault()
      const current = radios.indexOf(document.activeElement as HTMLButtonElement)
      let next: number
      if (event.key === "Home") next = 0
      else if (event.key === "End") next = radios.length - 1
      else {
        const dir = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1
        next = ((current === -1 ? 0 : current) + dir + radios.length) % radios.length
      }
      radios[next].focus()
      radios[next].click()
    }

    const hasSelection = options.some((o) => o.value === activeValue && !o.disabled)
    const firstEnabled = options.find((o) => !o.disabled)?.value

    return (
      <div
        ref={innerRef}
        role="radiogroup"
        aria-disabled={disabled || undefined}
        onKeyDown={disabled ? undefined : handleKeyDown}
        className={cn(
          "inline-flex items-center gap-0.5 rounded-lg bg-muted text-muted-foreground",
          TRACK_PAD[size],
          fullWidth && "flex w-full",
          disabled && "opacity-50",
          className
        )}
        data-slot="segmented-control"
        {...props}
      >
        {options.map((opt) => {
          const checked = opt.value === activeValue
          const segDisabled = disabled || opt.disabled
          // Roving tabindex: the checked segment (or, with no selection, the first enabled) is the tab stop.
          const tabStop = checked || (!hasSelection && opt.value === firstEnabled)
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={typeof opt.label === "string" ? opt.label : undefined}
              disabled={segDisabled}
              tabIndex={tabStop ? 0 : -1}
              onClick={() => commit(opt.value)}
              className={cn(
                "inline-flex min-w-0 items-center justify-center gap-1.5 rounded-md font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                SEG_SIZE[size],
                fullWidth && "flex-1",
                checked ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                segDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              )}
            >
              {opt.icon != null ? <span className="shrink-0">{opt.icon}</span> : null}
              <span className="truncate">{opt.label}</span>
            </button>
          )
        })}
      </div>
    )
  }
)
SegmentedControl.displayName = "SegmentedControl"

export { SegmentedControl }
