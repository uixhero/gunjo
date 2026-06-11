import * as React from "react"

import { cn } from "../../lib/utils"
import { docNoteDefaultVariantKey } from "./generated/default-variant-keys"
import type { DocNoteVariantKey } from "./generated/variant-keys"

const docNoteVariantClasses: Record<DocNoteVariantKey, string> = {
    default: "bg-muted/45 text-muted-foreground",
    reference: "bg-secondary/55 text-muted-foreground",
}

export interface DocNoteProps extends React.HTMLAttributes<HTMLElement> {
    heading?: React.ReactNode
    variant?: DocNoteVariantKey
}

const DocNote = React.forwardRef<HTMLElement, DocNoteProps>(
    ({ heading, children, className, variant = docNoteDefaultVariantKey, ...props }, ref) => (
        <aside
            ref={ref}
            className={cn(
                "inline-flex w-full flex-col items-center gap-1 rounded-md border-0 px-4 py-3 text-left text-sm leading-6 shadow-none [align-items:flex-start]",
                "[&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary",
                docNoteVariantClasses[variant],
                className
            )}
            {...props}
        >
            {heading ? <div className="w-full font-medium text-foreground">{heading}</div> : null}
            <div className="w-full">{children}</div>
        </aside>
    )
)
DocNote.displayName = "DocNote"

export { DocNote }
