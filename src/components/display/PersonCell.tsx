"use client"

import * as React from "react"
import { IconChevronRight as ChevronRight } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "./Avatar"

type AvatarPresence = NonNullable<React.ComponentProps<typeof Avatar>["presence"]>

/** Derive a single fallback glyph. Japanese names: first char of the family-name
 *  token (whitespace-separated). Latin names: first letter. */
function deriveInitial(name: React.ReactNode): string {
  if (typeof name !== "string") return ""
  const first = name.trim().split(/\s+/)[0] ?? name
  return first.slice(0, 1)
}

export interface PersonCellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Primary line — the person's name. */
  name: React.ReactNode
  /** Secondary line — role / department / email. */
  secondary?: React.ReactNode
  /** Optional third line — e.g. employment type, location. */
  tertiary?: React.ReactNode
  /** Avatar image + fallback. When omitted, a fallback initial is derived from `name` (if a string). */
  avatar?: { src?: string; alt?: string; fallback?: React.ReactNode }
  /** Presence dot, forwarded to `Avatar`. */
  presence?: AvatarPresence
  presenceLabel?: React.ReactNode
  /** Visual scale. */
  size?: "sm" | "md" | "lg"
  /** Trailing slot — status badge, chevron, count, actions. */
  trailing?: React.ReactNode
  /** Extra classes on the avatar (e.g. a deterministic background colour). */
  avatarClassName?: string
  /**
   * Make the whole cell an activation target. With `href` the root renders as an
   * `<a>`; otherwise `onActivate` renders a `<button>`. A trailing chevron is
   * shown as the affordance unless a custom `trailing` is provided. Because the
   * root itself becomes interactive (not a nested button), `trailing` must stay
   * non-interactive — no nested buttons/links. For a row that needs both
   * activation *and* separate action controls, keep PersonCell presentational
   * and own activation at the row level (e.g. `DataTable` `onRowClick`). (#341)
   */
  href?: string
  /** Activate handler; renders the cell as a `<button>` when `href` is not set. (#341) */
  onActivate?: () => void
}

const AVATAR_SIZE: Record<NonNullable<PersonCellProps["size"]>, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
}
const NAME_SIZE: Record<NonNullable<PersonCellProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
}

/**
 * PersonCell — the atomic identity cell: avatar + name + secondary/tertiary lines,
 * with an optional presence dot and a trailing slot. The "who is this person" unit
 * repeated across directories, table rows, assignee pickers, comment attributions,
 * approver/reviewer rows and detail panels.
 *
 * Presentational by default (renders a `<div>`). Two ways to make it activatable:
 * - Pass `href` / `onActivate` to make the **cell itself** the target — the root
 *   renders as an `<a>` / `<button>` (no nested button). `trailing` must then stay
 *   non-interactive. (#341)
 * - Or, when the *row* owns activation (e.g. `DataTable` `onRowClick`, a wrapping
 *   link/button), keep PersonCell presentational and let the row handle it — don't
 *   also set `href`/`onActivate` here.
 */
export const PersonCell = React.forwardRef<HTMLDivElement, PersonCellProps>(
  (
    { name, secondary, tertiary, avatar, presence, presenceLabel, size = "md", trailing, avatarClassName, href, onActivate, className, ...props },
    ref
  ) => {
    const fallback = avatar?.fallback ?? deriveInitial(name)
    const interactive = href != null || onActivate != null
    const resolvedTrailing =
      trailing != null
        ? trailing
        : interactive
          ? <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
          : null

    const rootClassName = cn(
      "flex w-full min-w-0 items-center gap-3",
      interactive &&
        "cursor-pointer rounded-md bg-transparent text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
      className
    )

    const inner = (
      <>
        <Avatar className={cn("shrink-0", AVATAR_SIZE[size])} presence={presence} presenceLabel={presenceLabel}>
          {avatar?.src ? <AvatarImage src={avatar.src} alt={avatar.alt ?? (typeof name === "string" ? name : undefined)} /> : null}
          <AvatarFallback className={cn("font-semibold", size === "sm" ? "text-xs" : "text-sm", avatarClassName)}>
            {fallback}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className={cn("truncate font-medium text-foreground", NAME_SIZE[size])}>{name}</div>
          {secondary != null ? <div className="truncate text-xs text-muted-foreground">{secondary}</div> : null}
          {tertiary != null ? <div className="truncate text-xs text-muted-foreground">{tertiary}</div> : null}
        </div>
        {resolvedTrailing != null ? <div className="shrink-0">{resolvedTrailing}</div> : null}
      </>
    )

    // Polymorphic root: interactive variants render <a>/<button> so the whole cell
    // is the activation target (no nested button). Non-interactive keeps the same
    // <div> output as before. The div-typed props/ref forward as-is.
    if (href != null) {
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={rootClassName} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {inner}
        </a>
      )
    }
    if (onActivate != null) {
      return (
        <button ref={ref as React.Ref<HTMLButtonElement>} type="button" onClick={onActivate} className={rootClassName} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
          {inner}
        </button>
      )
    }
    return (
      <div ref={ref} className={rootClassName} {...props}>
        {inner}
      </div>
    )
  }
)
PersonCell.displayName = "PersonCell"
