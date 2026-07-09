"use client"

import * as React from "react"
import { IconCheck } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"

interface RadioCardContextValue {
  value?: string
  onValueChange?: (value: string) => void
  name?: string
}
const RadioCardContext = React.createContext<RadioCardContextValue | undefined>(undefined)

export interface RadioCardGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Form name (emitted on a hidden input by each RadioCard when set). */
  name?: string
}

/**
 * RadioCardGroup — the radiogroup wrapper for `RadioCard`s. Single-select with proper
 * `role="radiogroup"` semantics, roving tabindex and arrow-key navigation (WAI-ARIA radio
 * pattern). Controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`).
 */
export const RadioCardGroup = React.forwardRef<HTMLDivElement, RadioCardGroupProps>(
  ({ className, value, defaultValue, onValueChange, name, children, ...props }, forwardedRef) => {
    const [internal, setInternal] = React.useState(defaultValue)
    const activeValue = value !== undefined ? value : internal
    const innerRef = React.useRef<HTMLDivElement>(null)
    React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLDivElement)

    const handleValueChange = (v: string) => {
      if (value === undefined) setInternal(v)
      onValueChange?.(v)
    }

    // Roving tabindex: when nothing is checked, keep the first enabled card the single tab stop.
    React.useEffect(() => {
      const el = innerRef.current
      if (!el) return
      const radios = Array.from(el.querySelectorAll<HTMLButtonElement>('[role="radio"]'))
      if (radios.some((r) => r.getAttribute("aria-checked") === "true")) return
      const firstEnabled = radios.find((r) => !r.disabled)
      radios.forEach((r) => {
        r.tabIndex = r === firstEnabled ? 0 : -1
      })
    })

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

    return (
      <RadioCardContext.Provider value={{ value: activeValue, onValueChange: handleValueChange, name }}>
        <div ref={innerRef} role="radiogroup" onKeyDown={handleKeyDown} className={cn("grid gap-2", className)} {...props}>
          {children}
        </div>
      </RadioCardContext.Provider>
    )
  }
)
RadioCardGroup.displayName = "RadioCardGroup"

export interface RadioCardProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "title"> {
  /** The value this card selects. */
  value: string
  /** Primary line (商品名 / プラン名). */
  title: React.ReactNode
  /** Secondary line(s) — area・period・conditions. */
  description?: React.ReactNode
  /** A wrapping row of chips above the title (人気 / 期間限定 / おすすめ). */
  tags?: React.ReactNode
  /** The dominant price slot (right-aligned, emphasized). */
  price?: React.ReactNode
  /** A hook line under the body (○○円分おトク / ○回でモト). */
  highlight?: React.ReactNode
  /** Leading accessory (icon / thumbnail). */
  leading?: React.ReactNode
  /** Reason shown in a tooltip when the card is disabled. */
  disabledReason?: React.ReactNode
  /** Accessible label for the disabled reason wrapper. Defaults to the reason when it is a string. */
  disabledReasonLabel?: string
}

/**
 * RadioCard — the priced selectable choice card: RadioGroup's single-select `role="radio"` +
 * keyboard semantics wearing a card body (tags, title, secondary, a dominant price slot, an
 * おトク/highlight hook, leading accessory) with a built-in selected check + ring. The B2C
 * purchase / plan-picker / shipping-option / payment-method atom. Pick-one-of-many — use this
 * (not ListCard, whose `onSelect` is an aria-pressed toggle, not radio single-select). ≥44px
 * tap target; status never colour-only (a check marks the selection). Use inside RadioCardGroup.
 */
export const RadioCard = React.forwardRef<HTMLButtonElement, RadioCardProps>(
  ({ className, value, title, description, tags, price, highlight, leading, disabled, disabledReason, disabledReasonLabel, ...props }, ref) => {
    const ctx = React.useContext(RadioCardContext)
    const checked = ctx?.value === value
    const button = (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={checked}
        tabIndex={checked ? 0 : -1}
        disabled={disabled}
        onClick={() => ctx?.onValueChange?.(value)}
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
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
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
          <input type="radio" name={ctx.name} value={value} checked={checked} readOnly className="sr-only" tabIndex={-1} aria-hidden="true" />
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
RadioCard.displayName = "RadioCard"
