"use client";

import { MarkdownRenderer } from "@gunjo/ui";

const SAMPLE = `# GunjoUI

A **SSOT-driven** design system for React + Tailwind.

## Features

- 70+ accessible components
- Pen / source / docs three-axis verification
- *AI-editor* friendly with TypeScript types

### Code

\`\`\`ts
import { Button } from "@gunjo/ui";
\`\`\`

> "The single source of truth approach is what makes this maintainable."

| Tier | Count |
|---|---|
| Atoms | 30+ |
| Molecules | 35+ |
`;

export function MarkdownRendererDemo() {
    return (
        <div className="w-full max-w-md rounded-md border border-border bg-card p-4">
            <MarkdownRenderer content={SAMPLE} />
        </div>
    );
}
