"use client";

import { Container } from "@gunjo/ui";

export function ContainerDemo() {
    return (
        <div className="w-full space-y-3">
            {(["sm", "md", "lg", "xl", "2xl", "full", "prose"] as const).map((size) => (
                <Container
                    key={size}
                    size={size}
                    className="rounded-md border border-dashed bg-muted/50 py-3 text-center text-sm text-muted-foreground"
                >
                    size=&quot;{size}&quot;
                </Container>
            ))}
        </div>
    );
}
