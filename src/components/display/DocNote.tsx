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
// 淡色の面は枠を持たない（DECISIONS.md 2026-09-22・Badge と同じ扱い）。
// 区切りは面の濃淡で、カードの上で 1.14〜1.33 / 地の上で 1.10〜1.50
// （light・dark 両方の実測・2026-09-23）。⚠️ ハイコントラストで戻す枠に
// tone ごとの *-border を使わないこと（濃くした面と同化する）。基底クラスの
// contrast-more:border-border に集約してある。
    note: "border border-transparent contrast-more:border-border forced-colors:border-[CanvasText] bg-info-subtle text-info-subtle-foreground",
    warning: "border border-transparent contrast-more:border-border forced-colors:border-[CanvasText] bg-warning-subtle text-warning-subtle-foreground",
    tip: "border border-transparent contrast-more:border-border forced-colors:border-[CanvasText] bg-success-subtle text-success-subtle-foreground",
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
