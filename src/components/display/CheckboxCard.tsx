"use client"

import * as React from "react"
import { IconCheck } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"

interface CheckboxCardContextValue {
  value: string[]
  toggle: (value: string) => void
  name?: string
}
const CheckboxCardContext = React.createContext<CheckboxCardContextValue | undefined>(undefined)

export interface CheckboxCardGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Controlled set of selected values. */
  value?: string[]
  /** Uncontrolled initial selection. */
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Form name (emitted on a hidden checkbox by each CheckboxCard when set). */
  name?: string
}

/**
 * CheckboxCardGroup — the `role="group"` wrapper for `CheckboxCard`s. Multi-select
 * twin of `RadioCardGroup`: each card toggles its value in/out of the selection.
 * Controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`). Unlike
 * the radio group there is no roving tabindex / arrow-key navigation — checkboxes
 * are independent, so each card is its own tab stop (WAI-ARIA checkbox pattern).
 */
export const CheckboxCardGroup = React.forwardRef<HTMLDivElement, CheckboxCardGroupProps>(
  ({ className, value, defaultValue, onValueChange, name, children, ...props }, ref) => {
    const [internal, setInternal] = React.useState<string[]>(defaultValue ?? [])
    const active = value !== undefined ? value : internal

    const toggle = (v: string) => {
      const next = active.includes(v) ? active.filter((x) => x !== v) : [...active, v]
      if (value === undefined) setInternal(next)
      onValueChange?.(next)
    }

    return (
      <CheckboxCardContext.Provider value={{ value: active, toggle, name }}>
        <div ref={ref} role="group" className={cn("grid gap-2", className)} {...props}>
          {children}
        </div>
      </CheckboxCardContext.Provider>
    )
  }
)
CheckboxCardGroup.displayName = "CheckboxCardGroup"

export interface CheckboxCardProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "title"> {
  /** The value this card toggles in the group's selection. */
  value: string
  /** Primary line (商品名 / オプション名). */
  title: React.ReactNode
  /** Secondary line(s) — area・period・conditions. */
  description?: React.ReactNode
  /** A wrapping row of chips above the title (人気 / おすすめ). */
  tags?: React.ReactNode
  /** The dominant price slot (right-aligned, emphasized). */
  price?: React.ReactNode
  /** A hook line under the body (○○円分おトク). */
  highlight?: React.ReactNode
  /** Leading accessory (icon / thumbnail). */
  leading?: React.ReactNode
  /** Reason shown in a tooltip when the card is disabled. */
  disabledReason?: React.ReactNode
  /** Accessible label for the disabled reason wrapper. Defaults to the reason when it is a string. */
  disabledReasonLabel?: string
}

/**
 * CheckboxCard — the multi-select selectable choice card: Checkbox's `role="checkbox"`
 * + keyboard semantics wearing a card body (tags, title, secondary, a dominant price
 * slot, an おトク/highlight hook, leading accessory) with a built-in selected check +
 * ring. The twin of `RadioCard` — use this for pick-many (add-ons, filters, amenities);
 * use RadioCard for pick-one. ≥44px tap target; the selection is marked by a square
 * check (never colour-only). Use inside CheckboxCardGroup.
 */
export const CheckboxCard = React.forwardRef<HTMLButtonElement, CheckboxCardProps>(
  ({ className, value, title, description, tags, price, highlight, leading, disabled, disabledReason, disabledReasonLabel, ...props }, ref) => {
    const ctx = React.useContext(CheckboxCardContext)
    const checked = ctx?.value.includes(value) ?? false
    const button = (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => ctx?.toggle(value)}
        className={cn(
          "flex w-full min-h-11 items-start gap-3 rounded-lg border bg-card p-4 text-left transition-colors",
          "cursor-pointer hover:border-primary/50 hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          checked ? "border-primary ring-1 ring-primary" : "border-border",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[5px] border",
            checked ? "border-primary bg-primary text-primary-foreground" : "border-input"
          )}
        >
          {checked && <IconCheck className="size-3.5" />}
        </span>

        {leading != null && <span className="mt-0.5 flex shrink-0 items-center">{leading}</span>}

        <span className="min-w-0 flex-1">
          {tags != null && <span className="mb-1 flex flex-wrap items-center gap-1.5">{tags}</span>}
          <span className="flex items-start justify-between gap-3">
            <span className="min-w-0 font-medium text-foreground">{title}</span>
            {price != null && <span className="shrink-0 text-base font-bold tabular-nums text-foreground">{price}</span>}
          </span>
          {description != null && <span className="mt-0.5 block text-sm text-muted-foreground">{description}</span>}
          {highlight != null && <span className="mt-1 block text-xs font-medium text-success-strong">{highlight}</span>}
        </span>

        {ctx?.name != null && (
          <input type="checkbox" name={ctx.name} value={value} checked={checked} readOnly className="sr-only" tabIndex={-1} aria-hidden="true" />
        )}
      </button>
    )

    if (disabled && disabledReason != null) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block w-full" tabIndex={0} aria-label={disabledReasonLabel ?? (typeof disabledReason === "string" ? disabledReason : undefined)}>
              {button}
            </span>
          </TooltipTrigger>
          <TooltipContent>{disabledReason}</TooltipContent>
        </Tooltip>
      )
    }

    return button
  }
)
CheckboxCard.displayName = "CheckboxCard"
