"use client";

import { BlogTemplate } from "@gunjo/ui";

export function BlogTemplateDemo() {
    return (
        <div className="overflow-hidden rounded-md border bg-background">
            <BlogTemplate
                category="Engineering"
                title="Building a SSOT-driven design system"
                meta="By Alice Chen · 5 min read · May 5, 2026"
                hero={
                    <div className="flex h-48 items-center justify-center bg-muted text-muted-foreground">
                        hero image placeholder
                    </div>
                }
            >
                <p>
                    Design systems often drift. Components ship, designs evolve, and the
                    docs lag. We built GunjoUI around a Single Source of Truth (SSOT)
                    approach that keeps the three axes — Pencil designs, React
                    implementations, and Markdown docs — locked together via CI.
                </p>
                <h2>The three axes</h2>
                <p>
                    Each component lives as a Pencil reusable, a TypeScript file, and a
                    docs page. A single change in any axis must propagate or the build
                    fails.
                </p>
            </BlogTemplate>
        </div>
    );
}
