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
    const hasTrailing = trailing != null
    const connectorAnchorSize = from.size ?? size ?? "md"
    const connectorInlineStart =
      connectorAnchorSize === "sm" ? 44 : connectorAnchorSize === "lg" ? 60 : 52
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const [isStacked, setIsStacked] = React.useState(false)

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref]
    )

    React.useEffect(() => {
      const node = rootRef.current
      if (!node) return

      const update = () => {
        setIsStacked(node.getBoundingClientRect().width < 420)
      }

      update()

      if (typeof ResizeObserver === "undefined") {
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
      }

      const observer = new ResizeObserver(update)
      observer.observe(node)

      return () => observer.disconnect()
    }, [])

    return (
      <div
        ref={setRefs}
        className={cn(
          "grid w-full min-w-0 gap-x-3 gap-y-2 lg:items-center",
          isStacked
            ? hasTrailing
              ? "grid-cols-[minmax(0,1fr)_6rem]"
              : "grid-cols-1"
            : hasTrailing
              ? "grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)_6rem] items-center"
              : "grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] items-center",
          className
        )}
        data-slot="relationship-row"
        {...props}
      >
        <PersonCell
          {...from}
          size={from.size ?? size}
          className={cn(
            "col-start-1 row-start-1 min-w-0",
            !isStacked && "col-start-1 row-start-1",
            from.className
          )}
        />
        <div
          className={cn(
            "flex shrink-0 text-muted-foreground",
            isStacked
              ? "col-start-1 row-start-2 w-auto flex-row items-center justify-self-start gap-2"
              : "col-start-2 row-start-1 w-16 flex-col items-center justify-self-center gap-0.5"
          )}
          style={isStacked ? { marginInlineStart: connectorInlineStart } : undefined}
        >
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center transition-transform",
              isStacked && "rotate-90"
            )}
            aria-hidden="true"
          >
            {connector ?? <DefaultConnector />}
          </span>
          {relationshipLabel != null ? (
            <span className="whitespace-nowrap text-[10px] font-medium leading-none">{relationshipLabel}</span>
          ) : null}
        </div>
        <PersonCell
          {...to}
          size={to.size ?? size}
          className={cn(
            "min-w-0",
            isStacked ? "col-start-1 row-start-3" : "col-start-3 row-start-1",
            to.className
          )}
        />
        {hasTrailing ? (
          <div
            className={cn(
              "flex w-24 shrink-0 justify-end self-center whitespace-nowrap",
              isStacked ? "col-start-2 row-span-3 row-start-1" : "col-start-4 row-span-1 row-start-1"
            )}
          >
            {trailing}
          </div>
        ) : null}
      </div>
    )
  }
)
RelationshipRow.displayName = "RelationshipRow"
