import * as React from "react"
import { cn } from "../../lib/utils"
import { Container } from "../layout/Container"

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
    // Sections compose the Container component (mx-auto + responsive padding +
    // max-width) rather than the bare Tailwind `.container` utility, which has
    // no centering or gutters and left-pins content at a breakpoint width.
    return (
        <div className={cn("flex min-h-screen w-full flex-col", className)} {...props}>
            {/* Sticky Header */}
            {header && (
                <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <Container size="2xl" className="flex h-14 items-center">
                        {header}
                    </Container>
                </div>
            )}

            <main className="flex-1">
                {hero}
                {features && (
                    <Container as="section" size="2xl" className="py-12 md:py-24 lg:py-32">
                        {features}
                    </Container>
                )}
                {testimonials && (
                    <section className="bg-muted/50 py-12 md:py-24 lg:py-32">
                        <Container size="2xl">{testimonials}</Container>
                    </section>
                )}
                {pricing && (
                    <Container as="section" size="2xl" className="py-12 md:py-24 lg:py-32">
                        {pricing}
                    </Container>
                )}
                {cta}
            </main>

            {footer && (
                <footer className="border-t py-6 md:py-0">
                    <Container size="2xl" className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                        {footer}
                    </Container>
                </footer>
            )}
        </div>
    )
}
