"use client"

import * as React from "react"
import {
    IconCheck as Check,
    IconCircle as Circle,
    IconX as X,
} from "@tabler/icons-react"

import { cn } from "../../lib/utils"

export interface PasswordRequirement {
    id: string
    label: React.ReactNode
    met?: boolean
    description?: React.ReactNode
}

export interface PasswordRequirementListProps
    extends React.HTMLAttributes<HTMLUListElement> {
    requirements: PasswordRequirement[]
    metLabel?: string
    unmetLabel?: string
    pendingLabel?: string
}

const PasswordRequirementList = React.forwardRef<
    HTMLUListElement,
    PasswordRequirementListProps
>(
    (
        {
            className,
            requirements,
            metLabel = "Requirement met",
            unmetLabel = "Requirement not met",
            pendingLabel = "Requirement pending",
            ...props
        },
        ref
    ) => {
        return (
            <ul
                ref={ref}
                className={cn("grid gap-1.5 text-sm", className)}
                data-slot="password-requirement-list"
                {...props}
            >
                {requirements.map((requirement) => {
                    const state =
                        requirement.met === undefined
                            ? "pending"
                            : requirement.met
                              ? "met"
                              : "unmet"
                    const label =
                        state === "met"
                            ? metLabel
                            : state === "unmet"
                              ? unmetLabel
                              : pendingLabel
                    const Icon =
                        state === "met" ? Check : state === "unmet" ? X : Circle

                    return (
                        <li
                            key={requirement.id}
                            className={cn(
                                "grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2",
                                state === "met" && "text-success-strong",
                                state === "unmet" && "text-destructive-strong",
                                state === "pending" && "text-muted-foreground"
                            )}
                        >
                            <Icon
                                className="mt-0.5 h-4 w-4 shrink-0"
                                aria-label={label}
                            />
                            <span className="min-w-0">
                                <span>{requirement.label}</span>
                                {requirement.description ? (
                                    <span className="block text-xs text-muted-foreground">
                                        {requirement.description}
                                    </span>
                                ) : null}
                            </span>
                        </li>
                    )
                })}
            </ul>
        )
    }
)
PasswordRequirementList.displayName = "PasswordRequirementList"

export { PasswordRequirementList }
