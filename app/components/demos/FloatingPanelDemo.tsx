"use client";

import { FloatingPanel } from "@gunjo/ui";
import { useState } from "react";

export function FloatingPanelDemo() {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    return (
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg border border-border bg-muted/50">
            <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] opacity-20 pointer-events-none">
                {/* Simple grid to show movement */}
                {Array.from({ length: 400 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-border/60" />
                ))}
            </div>

            <p className="absolute left-4 top-4 text-sm text-muted-foreground">
                Try dragging the panel below!
            </p>

            <FloatingPanel
                className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="p-4 w-64">
                    <h4 className="font-semibold mb-2">Floating Panel</h4>
                    <p className="text-sm text-muted-foreground">
                        I am a spatial UI element. I have a glassmorphism effect and cast a shadow.
                    </p>
                </div>
            </FloatingPanel>
        </div>
    );
}
