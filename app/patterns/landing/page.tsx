"use client"

import { notFound } from "next/navigation";
import {
    LandingTemplate,
    Button,
    Card,
    CardContent
} from "@gunjo/ui";
import { IconCheck as Check } from "@tabler/icons-react";
import {
    MARQUEE_VIEWPORT_SIZES,
    MarqueeChrome,
    type MarqueeViewport,
} from "../_lib/MarqueeChrome";

export default function LandingExample() {
    if (process.env.NODE_ENV === "production") notFound();

    return (
        <MarqueeChrome
            slug="landing"
            routeBase="/patterns/landing"
            defaultPath="/"
            navigablePaths={["/"]}
            tabTitle="Gunjo Landing"
        >
            {(viewport) => <LandingPattern viewport={viewport} />}
        </MarqueeChrome>
    )
}

function LandingPattern({ viewport }: { viewport: MarqueeViewport }) {
    const { width, height } = MARQUEE_VIEWPORT_SIZES[viewport];

    return (
        <div className="overflow-y-auto bg-background" style={{ width, height }}>
        <LandingTemplate
            className="min-h-full w-full"
            style={{ width, minHeight: height }}
            header={
                <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xl">Acme Inc.</span>
                    <nav className="hidden md:flex gap-6 text-sm font-medium">
                        <a href="#" className="hover:underline">Features</a>
                        <a href="#" className="hover:underline">Pricing</a>
                        <a href="#" className="hover:underline">About</a>
                    </nav>
                    <div className="flex gap-4">
                        <Button variant="ghost">Log in</Button>
                        <Button>Get Standard</Button>
                    </div>
                </div>
            }
            hero={
                <section className="container flex flex-col items-center gap-4 pb-8 pt-6 md:py-10 lg:py-32 text-center">
                    <span className="px-3 py-1 text-sm rounded-full bg-muted font-medium">V2.0 Now Available</span>
                    <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-7xl">
                        Build better websites <br className="hidden sm:inline" />
                        in a faction of the time.
                    </h1>
                    <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
                        The ultimate design system for building premium web applications.
                        Accessible, responsive, and beautiful by default.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <Button size="lg" className="h-12 px-8 text-lg">Start Building</Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-lg">View Documentation</Button>
                    </div>
                </section>
            }
            features={
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <h3 className="font-bold text-xl">Standardized</h3>
                        <p className="text-muted-foreground">Built on a consistent set of design tokens.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-xl">Accessible</h3>
                        <p className="text-muted-foreground">Follows WAI-ARIA patterns for maximum inclusivity.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-xl">Modern</h3>
                        <p className="text-muted-foreground">Uses the latest React and CSS features.</p>
                    </div>
                </div>
            }
            pricing={
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <Card className="w-full">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-bold text-xl">Hobby</h3>
                            <div className="text-3xl font-bold">$0</div>
                            <p className="text-muted-foreground text-sm">For personal projects</p>
                            <ul className="space-y-2 text-sm mt-4">
                                <li className="flex items-center gap-2"><Check size={16} /> 1 Project</li>
                                <li className="flex items-center gap-2"><Check size={16} /> Community Support</li>
                            </ul>
                            <Button className="w-full mt-4" variant="outline">Get Started</Button>
                        </CardContent>
                    </Card>
                    <Card className="border-primary shadow-lg scale-105 relative w-full">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-0.5 rounded-full text-xs font-bold">POPULAR</div>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-bold text-xl">Pro</h3>
                            <div className="text-3xl font-bold">$29</div>
                            <p className="text-muted-foreground text-sm">For professional developers</p>
                            <ul className="space-y-2 text-sm mt-4">
                                <li className="flex items-center gap-2"><Check size={16} /> Unlimited Projects</li>
                                <li className="flex items-center gap-2"><Check size={16} /> Priority Support</li>
                                <li className="flex items-center gap-2"><Check size={16} /> Advanced Analytics</li>
                            </ul>
                            <Button className="w-full mt-4">Subscribe</Button>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-bold text-xl">Enterprise</h3>
                            <div className="text-3xl font-bold">Custom</div>
                            <p className="text-muted-foreground text-sm">For large teams</p>
                            <ul className="space-y-2 text-sm mt-4">
                                <li className="flex items-center gap-2"><Check size={16} /> SSO</li>
                                <li className="flex items-center gap-2"><Check size={16} /> SLA</li>
                            </ul>
                            <Button className="w-full mt-4" variant="outline">Contact Sales</Button>
                        </CardContent>
                    </Card>
                </div>
            }
            footer={
                <>
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by Team Gunjo. The source code is available on <a href="https://github.com/uixhero/gunjo" className="font-medium underline underline-offset-4">GitHub</a>.
                    </p>
                </>
            }
        />
        </div>
    )
}
