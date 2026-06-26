"use client"

import * as React from "react"

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
 * Presentational by default (renders a `<div>`); when the row itself is interactive
 * (e.g. `DataTable` `onRowClick`, a wrapping link/button) let that own activation —
 * don't nest another button here.
 */
export const PersonCell = React.forwardRef<HTMLDivElement, PersonCellProps>(
  (
    { name, secondary, tertiary, avatar, presence, presenceLabel, size = "md", trailing, avatarClassName, className, ...props },
    ref
  ) => {
    const fallback = avatar?.fallback ?? deriveInitial(name)
    return (
      <div ref={ref} className={cn("flex w-full min-w-0 items-center gap-3", className)} {...props}>
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
        {trailing != null ? <div className="shrink-0">{trailing}</div> : null}
      </div>
    )
  }
)
PersonCell.displayName = "PersonCell"
