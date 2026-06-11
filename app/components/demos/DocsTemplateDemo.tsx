"use client";

import { DocsTemplate } from "@gunjo/ui";

export function DocsTemplateDemo() {
    return (
        <div className="overflow-hidden rounded-md border">
            <div className="h-[420px] overflow-hidden">
                <DocsTemplate
                    sidebar={
                        <nav className="flex flex-col gap-1 text-sm">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Getting started
                            </p>
                            <a className="rounded px-2 py-1 font-medium text-foreground bg-muted">
                                Installation
                            </a>
                            <a className="rounded px-2 py-1 text-muted-foreground hover:text-foreground">
                                Quick start
                            </a>
                            <a className="rounded px-2 py-1 text-muted-foreground hover:text-foreground">
                                Theming
                            </a>
                            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Components
                            </p>
                            <a className="rounded px-2 py-1 text-muted-foreground hover:text-foreground">
                                Button
                            </a>
                            <a className="rounded px-2 py-1 text-muted-foreground hover:text-foreground">
                                Card
                            </a>
                        </nav>
                    }
                    toc={
                        <ul className="flex flex-col gap-1 text-xs">
                            <li className="font-semibold text-muted-foreground">On this page</li>
                            <li className="text-muted-foreground hover:text-foreground">
                                Prerequisites
                            </li>
                            <li className="text-foreground">Install</li>
                            <li className="text-muted-foreground hover:text-foreground">
                                Configure
                            </li>
                        </ul>
                    }
                >
                    <article className="prose prose-sm max-w-none">
                        <h1>Installation</h1>
                        <p>Get started in 5 minutes.</p>
                        <h2>Prerequisites</h2>
                        <p>Node 20+, React 19, Tailwind v4 (or v3).</p>
                    </article>
                </DocsTemplate>
            </div>
        </div>
    );
}
