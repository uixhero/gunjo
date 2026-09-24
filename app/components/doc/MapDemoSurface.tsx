import * as React from "react";

import { cn } from "@gunjo/ui";

/**
 * Docs-only stand-in for a map, so the canvas-overlay components
 * (MapControlButton / ScaleBar / LayerMenu / PlacePanel) are shown on what
 * they are designed to sit on instead of on a blank page.
 *
 * Page-specific glue, not a GunjoUI component: it draws no data and has no
 * API worth shipping. The picture is built from the brand ramps (gunjo / dawn
 * / kobicha) so it needs no image asset and stays on tokens. It is imagery,
 * so it does not follow the colour theme — a satellite photo does not either.
 * Height comes from an aspect ratio, never a fixed pixel height.
 */
export function MapDemoSurface({
    className,
    children,
    ratio = "wide",
}: {
    className?: string;
    children?: React.ReactNode;
    ratio?: "wide" | "square" | "tall";
}) {
    return (
        <div
            className={cn(
                "relative w-full overflow-hidden rounded-lg border border-transparent contrast-more:border-border forced-colors:border-[CanvasText]",
                ratio === "wide" ? "aspect-[16/10]" : ratio === "square" ? "aspect-square" : "aspect-[3/4]",
                "bg-gunjo-deepest",
                "bg-[radial-gradient(ellipse_60%_45%_at_28%_38%,hsl(var(--kobicha-mid)/0.55),transparent_70%),radial-gradient(ellipse_45%_35%_at_72%_62%,hsl(var(--kobicha-warm)/0.5),transparent_70%),radial-gradient(ellipse_70%_40%_at_60%_88%,hsl(var(--gunjo-dark)),transparent_70%),radial-gradient(ellipse_30%_22%_at_46%_30%,hsl(var(--palette-white)/0.35),transparent_70%)]",
                className
            )}
        >
            <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(hsl(var(--palette-white)/0.06)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--palette-white)/0.06)_1px,transparent_1px)] bg-[size:48px_48px]"
            />
            {children}
        </div>
    );
}
