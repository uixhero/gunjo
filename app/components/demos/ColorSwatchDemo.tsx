"use client";

import { ColorSwatch } from "@gunjo/ui";

const TOKENS = [
    { color: "hsl(var(--background))", label: "background" },
    { color: "hsl(var(--foreground))", label: "foreground" },
    { color: "hsl(var(--primary))", label: "primary" },
    { color: "hsl(var(--muted))", label: "muted" },
    { color: "hsl(var(--destructive))", label: "destructive" },
    { color: "hsl(var(--success))", label: "success" },
];

export function ColorSwatchDemo() {
    return (
        <div className="grid grid-cols-2 gap-2 w-full max-w-md">
            {TOKENS.map((t) => (
                <ColorSwatch key={t.label} color={t.color} label={t.label} />
            ))}
        </div>
    );
}
