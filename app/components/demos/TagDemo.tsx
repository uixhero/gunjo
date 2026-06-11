"use client";

import * as React from "react";
import { Tag } from "@gunjo/ui";

export function TagDemo() {
    const [tags, setTags] = React.useState<string[]>([
        "react",
        "typescript",
        "alpha",
        "design-system",
    ]);

    return (
        <div className="flex flex-col gap-4 w-full max-w-md">
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Tag
                        key={tag}
                        onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}
                    >
                        {tag}
                    </Tag>
                ))}
                {tags.length === 0 ? (
                    <p className="text-xs text-muted-foreground">All tags removed.</p>
                ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
                <Tag variant="default">default</Tag>
                <Tag variant="secondary">secondary</Tag>
                <Tag variant="outline">outline</Tag>
                <Tag variant="destructive">destructive</Tag>
            </div>
        </div>
    );
}
