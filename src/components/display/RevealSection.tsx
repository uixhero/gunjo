import * as React from "react"
import { cn } from "../../lib/utils"

export interface RevealSectionProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Whether the section is shown. When `false`, nothing renders. */
    open: boolean
    /** Accessible label for the revealed region (or pass `aria-labelledby`). */
    label?: string
    /**
     * Announce the section politely to screen readers when it appears. Default
     * `true`. Set `false` for purely visual reveals.
     */
    announce?: boolean
}

/**
 * State-driven conditional section. Reveals its children on `open` as a
 * properly-labelled, screen-reader-announced region — the a11y wiring
 * (`role="region"` + name + `aria-live`) that declaration forms otherwise
 * re-hand-roll for every section that appears based on a prior answer. (#213)
 */
export const RevealSection = React.forwardRef<HTMLDivElement, RevealSectionProps>(
    ({ open, label, announce = true, className, children, ...props }, ref) => {
        if (!open) return null

        // A region needs an accessible name; only apply role="region" when named.
        const hasName = Boolean(label || props["aria-labelledby"])

        return (
            <div
                ref={ref}
                role={hasName ? "region" : undefined}
                aria-label={label}
                aria-live={announce ? "polite" : undefined}
                data-state="open"
                data-slot="reveal-section"
                className={cn(
                    "w-full animate-in fade-in-0 slide-in-from-top-1 duration-200",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)

RevealSection.displayName = "RevealSection"
