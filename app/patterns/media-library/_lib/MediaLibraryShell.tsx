"use client";

import { MediaLibraryTemplateDemo } from "@/components/demos/MediaLibraryTemplateDemo";
import {
    MARQUEE_VIEWPORT_SIZES,
    MarqueeChrome,
    type MarqueeViewport,
} from "../../_lib/MarqueeChrome";

const MEDIA_LIBRARY_PATHS = ["/"];

export function MediaLibraryShell() {
    return (
        <MarqueeChrome
            slug="media-library"
            host="assets.gunjo.example"
            routeBase="/patterns/media-library"
            defaultPath="/"
            tabTitle="GunjoUI"
            navigablePaths={MEDIA_LIBRARY_PATHS}
        >
            {(viewport) => <MediaLibraryApp viewport={viewport} />}
        </MarqueeChrome>
    );
}

function MediaLibraryApp({ viewport }: { viewport: MarqueeViewport }) {
    const { width, height } = MARQUEE_VIEWPORT_SIZES[viewport];

    return (
        <div className="relative overflow-hidden bg-background" style={{ width, height }}>
            <MediaLibraryTemplateDemo viewport={viewport} className="h-full rounded-none border-0" />
        </div>
    );
}
