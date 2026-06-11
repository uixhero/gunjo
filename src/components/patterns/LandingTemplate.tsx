import * as React from "react"
import { cn } from "../../lib/utils"

interface LandingTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
    header?: React.ReactNode
    hero: React.ReactNode
    features?: React.ReactNode
    testimonials?: React.ReactNode
    pricing?: React.ReactNode
    cta?: React.ReactNode
    footer?: React.ReactNode
}

export function LandingTemplate({
    header,
    hero,
    features,
    testimonials,
    pricing,
    cta,
    footer,
    className,
    ...props
}: LandingTemplateProps) {
    return (
        <div className={cn("flex flex-col w-[1280px] h-[720px] min-h-screen w-full", className)} {...props}>
            {/* Sticky Header */}
            {header && (
                <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-14 items-center">
                        {header}
                    </div>
                </div>
            )}

            <main className="flex-1">
                {hero}
                {features && <section className="container py-12 md:py-24 lg:py-32">{features}</section>}
                {testimonials && <section className="bg-muted/50 py-12 md:py-24 lg:py-32">{testimonials}</section>}
                {pricing && <section className="container py-12 md:py-24 lg:py-32">{pricing}</section>}
                {cta}
            </main>

            {footer && (
                <footer className="border-t py-6 md:py-0">
                    <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                        {footer}
                    </div>
                </footer>
            )}
        </div>
    )
}
