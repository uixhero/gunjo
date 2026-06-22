import * as React from "react"
import {
    IconInfoCircle,
    IconAlertTriangle,
    IconBulb,
} from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { docNoteDefaultVariantKey } from "./generated/default-variant-keys"
import type { DocNoteVariantKey } from "./generated/variant-keys"

const docNoteVariantClasses: Record<DocNoteVariantKey, string> = {
    default: "bg-muted/45 text-muted-foreground",
    reference: "bg-secondary/55 text-muted-foreground",
    note: "border border-info-border bg-info-subtle text-info-subtle-foreground",
    warning: "border border-warning-border bg-warning-subtle text-warning-subtle-foreground",
    tip: "border border-success-border bg-success-subtle text-success-subtle-foreground",
}

// Callout variants get a leading icon + role="note" so the admonition type is
// conveyed by more than color (#109). default/reference stay generic.
const docNoteIcons: Partial<Record<DocNoteVariantKey, React.ComponentType<React.SVGProps<SVGSVGElement>>>> = {
    note: IconInfoCircle,
    warning: IconAlertTriangle,
    tip: IconBulb,
}

export interface DocNoteProps extends React.HTMLAttributes<HTMLElement> {
    heading?: React.ReactNode
    variant?: DocNoteVariantKey
}

const DocNote = React.forwardRef<HTMLElement, DocNoteProps>(
    ({ heading, children, className, variant = docNoteDefaultVariantKey, ...props }, ref) => {
        const VariantIcon = docNoteIcons[variant]
        return (
            <aside
                ref={ref}
                role={VariantIcon ? "note" : undefined}
                className={cn(
                    "inline-flex w-full flex-col items-center gap-1 rounded-md border-0 px-4 py-3 text-left text-sm leading-6 shadow-none [align-items:flex-start]",
                    "[&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary",
                    docNoteVariantClasses[variant],
                    className
                )}
                {...props}
            >
                {heading || VariantIcon ? (
                    <div className="flex w-full items-center gap-2 font-medium text-foreground">
                        {VariantIcon ? <VariantIcon className="h-4 w-4 shrink-0" aria-hidden /> : null}
                        {heading ? <span>{heading}</span> : null}
                    </div>
                ) : null}
                <div className="w-full">{children}</div>
            </aside>
        )
    }
)
DocNote.displayName = "DocNote"

export { DocNote }
