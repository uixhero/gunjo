"use client";

import { Button, Spacer } from "@gunjo/ui";

export function SpacerDemo() {
    return (
        <div className="flex flex-col gap-6 w-full max-w-md">
            <div>
                <p className="mb-1 text-xs text-muted-foreground">flex-grow Spacer (push to edges)</p>
                <div className="flex w-full items-center rounded-md border bg-muted p-2">
                    <Button size="sm" variant="outline">Left</Button>
                    <Spacer />
                    <Button size="sm" variant="outline">Right</Button>
                </div>
            </div>
            <div>
                <p className="mb-1 text-xs text-muted-foreground">size=8 (32px fixed)</p>
                <div className="flex w-full items-center rounded-md border bg-muted p-2">
                    <Button size="sm" variant="outline">A</Button>
                    <Spacer size={8} />
                    <Button size="sm" variant="outline">B</Button>
                    <Spacer size={8} />
                    <Button size="sm" variant="outline">C</Button>
                </div>
            </div>
        </div>
    );
}
