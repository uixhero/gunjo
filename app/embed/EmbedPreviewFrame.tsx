"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@gunjo/ui";

type PreviewWrap = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

const WRAP_WIDTH_CLASSES: Record<PreviewWrap, string> = {
    sm: "max-w-sm",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    "2xl": "max-w-6xl",
    full: "max-w-none",
};

function resolvePreviewWrap(value: string | null): PreviewWrap {
    if (
        value === "sm" ||
        value === "md" ||
        value === "lg" ||
        value === "xl" ||
        value === "2xl" ||
        value === "full"
    ) {
        return value;
    }
    return "full";
}

function resolveFitHeightMode(value: string | null) {
    return value === "content";
}

function isTooltipOverlay(element: Element) {
    return element.matches("[role='tooltip']") || element.querySelector("[role='tooltip']") !== null;
}

export function EmbedPreviewFrame({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();
    const previewWrap = resolvePreviewWrap(searchParams.get("previewWrap"));
    const fitHeightContent = resolveFitHeightMode(searchParams.get("fitHeight"));
    const [hasFloatingOverlay, setHasFloatingOverlay] = React.useState(false);
    const [floatingOverlayInsetTop, setFloatingOverlayInsetTop] = React.useState(0);

    React.useEffect(() => {
        if (!fitHeightContent) return;

        const measureHeight = () => {
            const root = document.querySelector("[data-embed-preview-wrap]");
            const rootRect = root?.getBoundingClientRect();
            const floatingOverlays = Array.from(
                document.querySelectorAll("[data-radix-popper-content-wrapper], [role='dialog'], [data-slot='mention-suggestions']")
            ).filter((element) => !isTooltipOverlay(element));
            setHasFloatingOverlay(floatingOverlays.length > 0);
            const overlayTop = floatingOverlays.reduce((top, element) => {
                const rect = element.getBoundingClientRect();
                return Math.min(top, rect.top);
            }, rootRect?.top ?? 0);
            const overlayBottom = floatingOverlays.reduce((bottom, element) => {
                const rect = element.getBoundingClientRect();
                return Math.max(bottom, rect.bottom);
            }, 0);
            const nextInsetTop = Math.max(0, Math.ceil(-(Math.min(rootRect?.top ?? 0, overlayTop))));
            setFloatingOverlayInsetTop((current) => current === nextInsetTop ? current : nextInsetTop);

            return Math.ceil(
                Math.max(root?.scrollHeight ?? 0, rootRect?.bottom ?? 0, overlayBottom + nextInsetTop)
            );
        };

        let frame: number | null = null;
        const scheduleFrame = (callback: () => void) => {
            if (typeof window.requestAnimationFrame === "function") {
                return window.requestAnimationFrame(callback);
            }
            return window.setTimeout(callback, 16);
        };
        const cancelFrame = (handle: number | null) => {
            if (handle === null) return;
            if (typeof window.cancelAnimationFrame === "function") {
                window.cancelAnimationFrame(handle);
            } else {
                window.clearTimeout(handle);
            }
        };
        const postHeight = () => {
            cancelFrame(frame);
            frame = scheduleFrame(() => {
                window.parent.postMessage(
                    {
                        source: "gunjo-embed-preview",
                        type: "resize",
                        height: measureHeight(),
                    },
                    "*"
                );
            });
        };
        const postHeightAfterInteraction = () => {
            postHeight();
            window.setTimeout(postHeight, 50);
            window.setTimeout(postHeight, 180);
        };

        postHeight();
        const initialTimers = [
            window.setTimeout(postHeight, 100),
            window.setTimeout(postHeight, 300),
        ];
        const dynamicOverlayTimer = window.setInterval(postHeight, 250);
        window.addEventListener("resize", postHeight);
        window.addEventListener("click", postHeightAfterInteraction, true);
        window.addEventListener("focusin", postHeightAfterInteraction, true);
        window.addEventListener("keydown", postHeightAfterInteraction, true);

        const resizeObserver =
            typeof ResizeObserver === "undefined" ? null : new ResizeObserver(postHeight);
        resizeObserver?.observe(document.documentElement);
        resizeObserver?.observe(document.body);

        const mutationObserver =
            typeof MutationObserver === "undefined" ? null : new MutationObserver(postHeight);
        mutationObserver?.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true,
        });

        return () => {
            cancelFrame(frame);
            initialTimers.forEach((timer) => window.clearTimeout(timer));
            window.clearInterval(dynamicOverlayTimer);
            window.removeEventListener("resize", postHeight);
            window.removeEventListener("click", postHeightAfterInteraction, true);
            window.removeEventListener("focusin", postHeightAfterInteraction, true);
            window.removeEventListener("keydown", postHeightAfterInteraction, true);
            resizeObserver?.disconnect();
            mutationObserver?.disconnect();
        };
    }, [fitHeightContent]);

    return (
        <div
            className={cn(
                "mx-auto w-full",
                fitHeightContent
                    ? cn(
                        "flex min-h-[120px] justify-center [&>div]:min-h-[120px] [&>div]:w-full [&>div]:justify-center",
                        hasFloatingOverlay
                            ? "items-start [&>div]:items-start"
                            : "items-center [&>div]:items-center"
                    )
                    : "min-h-screen max-sm:[&>div]:min-h-0 max-sm:[&>div]:items-start max-sm:[&>div]:justify-center",
                WRAP_WIDTH_CLASSES[previewWrap]
            )}
            data-embed-preview-wrap={previewWrap}
            data-embed-fit-height-content={fitHeightContent ? "true" : undefined}
            data-embed-floating-overlay-inset-top={floatingOverlayInsetTop || undefined}
            style={fitHeightContent && floatingOverlayInsetTop > 0 ? { paddingTop: floatingOverlayInsetTop } : undefined}
        >
            {children}
        </div>
    );
}
