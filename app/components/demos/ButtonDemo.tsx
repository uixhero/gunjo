"use client";

import { Button } from "@gunjo/ui";

export function ButtonDemo() {
    return (
        <div className="flex flex-wrap gap-4 items-center">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
        </div>
    );
}
