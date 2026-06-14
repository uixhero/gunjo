"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    MARQUEE_VIEWPORT_SIZES,
    MarqueeFrame,
    type MarqueeViewport,
} from "@gunjo/ui";

export { MARQUEE_VIEWPORT_SIZES };
export type { MarqueeViewport };

function deriveDisplayPath(
    pathname: string | null,
    slug: string,
    defaultPath: string
): string {
    if (!pathname) return defaultPath;
    if (pathname === `/embed/patterns/${slug}`) return defaultPath;
    const trimmed = pathname.replace(new RegExp(`^/patterns/${slug}`), "") || defaultPath;
    return trimmed === "/" ? defaultPath : trimmed;
}

interface MarqueeChromeProps {
    slug: string;
    host?: string;
    routeBase: string;
    defaultPath: string;
    tabTitle?: string;
    navigablePaths: string[];
    children: (viewport: MarqueeViewport) => React.ReactNode;
}

/**
 * Browser-window chrome wrapper for /patterns marquee pages. Content is
 * rendered at fixed viewport presets and scaled to fit the documentation page.
 */
export function MarqueeChrome({
    slug,
    host = "gunjo.example",
    routeBase,
    defaultPath,
    tabTitle = "GunjoUI",
    navigablePaths,
    children,
}: MarqueeChromeProps) {
    const pathname = usePathname();
    const router = useRouter();
    const path = deriveDisplayPath(pathname, slug, defaultPath);
    const storageKey = `gunjo:patterns:${slug}:viewport`;

    return (
        <MarqueeFrame
            host={host}
            path={path}
            defaultPath={defaultPath}
            tabTitle={tabTitle}
            navigablePaths={navigablePaths}
            storageKey={storageKey}
            defaultToDeviceViewport
            onPathChange={(nextPath) => router.push(`${routeBase}${nextPath}`)}
        >
            {children}
        </MarqueeFrame>
    );
}
