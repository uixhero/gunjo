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

// Card-sized desktop screenshot used by the cold-test grid, the industry door
// pages and the English grid. Prefers the localized shot when the viewer is on
// EN and `<slug>.en.desktop.webp` exists, and falls back to the JA shot both
// when no English capture is recorded and when the recorded one fails to load.
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

    const jaSrc = `/cold-test-shots/${slug}.desktop.webp`;
    const [fellBackToJa, setFellBackToJa] = React.useState(false);
    const useEn = locale === "en" && enDesktopAvailable && !fellBackToJa;
    const available = useEn || desktopAvailable;
    const src = useEn ? `/cold-test-shots/${slug}.en.desktop.webp` : jaSrc;

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

    // The `en.desktop` flags are snapshotted from the local promotion/ folder,
    // which holds PNGs that were never converted into public/cold-test-shots.
    // 29 rounds therefore claim an English capture that 404s. Fall back to the
    // Japanese shot instead of showing "preview unavailable" over a screenshot
    // that exists.
    const handleError = () => {
        if (useEn) {
            setFellBackToJa(true);
            return;
        }
        setErrored(true);
    };

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
                    onError={handleError}
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
