"use client";

import { Code } from "@gunjo/ui";

export function CodeDemo() {
    return (
        <div className="flex flex-col gap-3 items-start">
            <p className="text-sm">
                Run <Code>npm install @gunjo/ui</Code> to add the package.
            </p>
            <p className="text-sm">
                Use the <Code variant="muted">--access public</Code> flag when publishing.
            </p>
            <div className="flex items-baseline gap-2">
                <Code size="sm">size=&quot;sm&quot;</Code>
                <Code>size=&quot;default&quot;</Code>
                <Code size="lg">size=&quot;lg&quot;</Code>
            </div>
        </div>
    );
}
