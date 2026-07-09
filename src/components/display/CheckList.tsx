"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Checkbox } from "../inputs/Checkbox"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"

export interface CheckListItem {
    id: string
    label: React.ReactNode
    /** Secondary line under the label. */
    description?: React.ReactNode
    /**
     * Trailing content aligned to the right of the row — a status `Badge`, an
     * action `Button`, an amount, etc. (rendered outside the toggle so clicking
     * it doesn't flip the checkbox).
     */
    trailing?: React.ReactNode
    /**
     * Controlled checked state. **Omit** to render a non-checkable display row
     * (label/description + trailing, no checkbox) — useful for mixing
     * informational rows into the same list.
     */
    checked?: boolean
    disabled?: boolean
    /** Reason shown on hover/focus when the row is disabled. */
    disabledReason?: React.ReactNode
}

export interface CheckListProps extends Omit<React.HTMLAttributes<HTMLUListElement>, "onChange"> {
    items: CheckListItem[]
    /** Called when a row's checkbox toggles. */
    onCheckedChange?: (id: string, checked: boolean) => void
}

/**
 * A checklist / confirmable list: rows of a leading checkbox + label +
 * description with a trailing slot (status badge, action, amount), bordered and
 * divider-separated, each checkbox carrying the row label as its accessible name
 * (via `Checkbox`'s `label`/`description` wiring — never an unlabelled control).
 * Rows with no `checked` render as plain display rows. For document checklists,
 * required-step / associated-procedure lists, recall/return scope confirmation,
 * batch-approval pick lists and any "tick these, see their status" surface.
 *
 * (For single/multi **selection** with roving keyboard nav — inbox / file list /
 * master-detail — that's a separate ListBox primitive; see #135.) (#135)
 */
const CheckList = React.forwardRef<HTMLUListElement, CheckListProps>(
    ({ className, items, onCheckedChange, ...props }, ref) => {
        return (
            <ul
                ref={ref}
                role="list"
                className={cn("w-full divide-y divide-border overflow-hidden rounded-md border border-border", className)}
                data-slot="check-list"
                {...props}
            >
                {items.map((item) => {
                    const row = (
                        <li
                            key={item.id}
                            className={cn(
                                "flex items-center justify-between gap-3 px-3 py-2.5",
                                item.disabled && "opacity-60"
                            )}
                        >
                            {item.checked !== undefined ? (
                                <Checkbox
                                    checked={item.checked}
                                    onCheckedChange={(checked) => onCheckedChange?.(item.id, checked)}
                                    disabled={item.disabled}
                                    label={item.label}
                                    description={item.description}
                                    className="min-w-0 flex-1"
                                />
                            ) : (
                                <div className="flex min-w-0 flex-1 flex-col">
                                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                                    {item.description != null ? (
                                        <span className="text-xs text-muted-foreground">{item.description}</span>
                                    ) : null}
                                </div>
                            )}
                            {item.trailing != null ? <div className="shrink-0">{item.trailing}</div> : null}
                        </li>
                    )

                    if (!item.disabled || item.disabledReason == null) return row

                    return (
                        <Tooltip key={item.id}>
                            <TooltipTrigger asChild>{row}</TooltipTrigger>
                            <TooltipContent className="max-w-64 text-left">{item.disabledReason}</TooltipContent>
                        </Tooltip>
                    )
                })}
            </ul>
        )
    }
)
CheckList.displayName = "CheckList"

export { CheckList }
