"use client";

import * as React from "react";
import { Skeleton, cn } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PreviewThumbProps {
    slug: string;
    desktopAvailable: boolean;
    enDesktopAvailable: boolean;
    title: string;
    unavailableLabel: string;
}

// Card-sized desktop screenshot used by both the cold-test grid and the
// industry door pages. Prefers the localized shot when the viewer is on EN
// and `<slug>.en.desktop.webp` exists; otherwise falls back to the JA shot
// (the series is JA-first and most rounds only have JA screenshots).
export function PreviewThumb({
    slug,
    desktopAvailable,
    enDesktopAvailable,
    title,
    unavailableLabel,
}: PreviewThumbProps) {
    const { locale } = useLocale();
    const imgRef = React.useRef<HTMLImageElement | null>(null);
    const [loaded, setLoaded] = React.useState(false);
    const [errored, setErrored] = React.useState(false);

    const useEn = locale === "en" && enDesktopAvailable;
    const available = useEn || desktopAvailable;
    const src = useEn
        ? `/cold-test-shots/${slug}.en.desktop.webp`
        : `/cold-test-shots/${slug}.desktop.webp`;

    React.useEffect(() => {
        setLoaded(false);
        setErrored(false);
        const node = imgRef.current;
        if (!node) return;
        if (node.complete) {
            if (node.naturalWidth > 0) setLoaded(true);
            else setErrored(true);
        }
    }, [src]);

    if (!available) {
        return (
            <div className="grid h-44 place-items-center border-b border-border/60 bg-muted/40 text-xs text-muted-foreground">
                {unavailableLabel}
            </div>
        );
    }

    return (
        <div className="relative block h-44 overflow-hidden border-b border-border/60 bg-muted/40">
            {!loaded && !errored && (
                <Skeleton className="absolute inset-0 h-full w-full" />
            )}
            {errored ? (
                <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
                    {unavailableLabel}
                </div>
            ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                    ref={imgRef}
                    src={src}
                    alt={`${title} preview`}
                    onLoad={() => setLoaded(true)}
                    onError={() => setErrored(true)}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                        "h-full w-full object-cover object-top transition-opacity duration-200",
                        loaded ? "opacity-100" : "opacity-0"
                    )}
                />
            )}
        </div>
    );
}
