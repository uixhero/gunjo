"use client";

import { SpatialCanvas, FloatingPanel } from "@gunjo/ui";

export function SpatialCanvasDemo() {
    return (
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg border border-border">
            <SpatialCanvas>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="font-medium text-muted-foreground">I am the Spatial Canvas Background</span>
                </div>

                <FloatingPanel className="top-[30%] left-[20%] w-48 p-4">
                    Panel A
                </FloatingPanel>

                <FloatingPanel className="top-[50%] left-[60%] w-48 p-4">
                    Panel B
                </FloatingPanel>
            </SpatialCanvas>
        </div>
    );
}
