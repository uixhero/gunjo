"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { PersonCell, type PersonCellProps } from "./PersonCell"

function DefaultConnector() {
  // a quiet double-headed horizontal arrow (利用者 ⟷ 担当)
  return (
    <svg viewBox="0 0 24 8" className="h-2 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 4h18M3 4l2.5-2.5M3 4l2.5 2.5M21 4l-2.5-2.5M21 4l-2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export interface RelationshipRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Left person. */
  from: PersonCellProps
  /** Right person. */
  to: PersonCellProps
  /** Glyph/element between the two people. Defaults to a ⟷ arrow. */
  connector?: React.ReactNode
  /** Small label under the connector — the nature of the relationship (e.g. 担当 / 上司 / 訪問). */
  relationshipLabel?: React.ReactNode
  /** Trailing slot — status badge, chevron, actions. */
  trailing?: React.ReactNode
  /** Size forwarded to both people (each `from`/`to` may still override via its own `size`). */
  size?: PersonCellProps["size"]
}

/**
 * RelationshipRow — two PersonCells side by side with a connector and an optional
 * relationship label: the "person ⟷ person" unit. Models the pairings that define
 * people-heavy domains — manager↔report (1on1), helper↔client (訪問介護),
 * 利用者↔担当ケアマネ (ケアプラン), approver chains, mentor↔mentee.
 *
 * Presentational like PersonCell — when the row is interactive (a wrapping link /
 * onRowClick), let that own activation; don't nest a button here.
 */
export const RelationshipRow = React.forwardRef<HTMLDivElement, RelationshipRowProps>(
  ({ from, to, connector, relationshipLabel, trailing, size, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex w-full min-w-0 items-center gap-2 sm:gap-3", className)} {...props}>
        <PersonCell {...from} size={from.size ?? size} className={cn("flex-1", from.className)} />
        <div className="flex shrink-0 flex-col items-center gap-0.5 text-muted-foreground">
          {connector ?? <DefaultConnector />}
          {relationshipLabel != null ? (
            <span className="whitespace-nowrap text-[10px] font-medium leading-none">{relationshipLabel}</span>
          ) : null}
        </div>
        <PersonCell {...to} size={to.size ?? size} className={cn("flex-1", to.className)} />
        {trailing != null ? <div className="shrink-0">{trailing}</div> : null}
      </div>
    )
  }
)
RelationshipRow.displayName = "RelationshipRow"
