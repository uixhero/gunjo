import * as React from "react"

import { cn } from "../../lib/utils"

export interface OnboardingTemplateProps
    extends React.HTMLAttributes<HTMLDivElement> {
    /** Hero side panel content (welcome / branding / illustration). */
    hero: React.ReactNode
}

const OnboardingTemplate = React.forwardRef<HTMLDivElement, OnboardingTemplateProps>(
    ({ className, hero, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "grid min-h-screen w-full grid-cols-1 bg-background text-foreground md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]",
                className
            )}
            {...props}
        >
            <aside className="flex flex-col justify-center gap-6 bg-foreground p-12 text-background md:min-h-screen">
                {hero}
            </aside>
            <main className="flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-lg">{children}</div>
            </main>
        </div>
    )
)
OnboardingTemplate.displayName = "OnboardingTemplate"

export { OnboardingTemplate }
