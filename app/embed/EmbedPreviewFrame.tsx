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

/**
 * An overlay kept inside a clipping box of the demo (e.g. a Drawer portalled
 * into an `overflow-hidden` container) can never show outside that box, so
 * growing the frame for it only makes the frame jump while it animates in.
 */
function isClippedByDemo(element: Element, root: Element | null) {
    for (let node = element.parentElement; node && node !== root; node = node.parentElement) {
        const { overflowX, overflowY } = window.getComputedStyle(node);
        if (/hidden|clip/.test(overflowX) || /hidden|clip/.test(overflowY)) return true;
    }
    return false;
}

/**
 * Bottom edge of an overlay at its natural height. Radix caps popper content
 * to the space left in the iframe, so the painted box alone would never ask
 * the frame to grow; the capped element's scrollHeight still has the full height.
 * Only popper content is capped this way: a dialog that scrolls its own body
 * is meant to scroll, so its painted box is its height.
 */
function naturalOverlayBottom(element: Element) {
    if (!element.matches("[data-radix-popper-content-wrapper]")) return element.getBoundingClientRect().bottom;
    const naturalBottom = [element, ...Array.from(element.children)].reduce((bottom, node) => {
        const rect = node.getBoundingClientRect();
        return Math.max(bottom, rect.bottom, rect.top + node.scrollHeight);
    }, 0);
    return naturalBottom + POPPER_GAP;
}

// Space kept between an open popover and the bottom edge of the frame.
const POPPER_GAP = 16;

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
                document.querySelectorAll("[data-radix-popper-content-wrapper], [data-radix-popover-content], [role='dialog'], [data-slot='mention-suggestions']")
            ).filter((element) => !isTooltipOverlay(element) && !isClippedByDemo(element, root));
            setHasFloatingOverlay(floatingOverlays.length > 0);
            const overlayRects = floatingOverlays
                .map((element) => ({ rect: element.getBoundingClientRect(), naturalBottom: naturalOverlayBottom(element) }))
                .filter(({ rect }) => rect.width > 0 && rect.height > 0);
            const overlayTop = overlayRects.reduce((top, { rect }) => Math.min(top, rect.top), rootRect?.top ?? 0);
            const overlayBottom = overlayRects.reduce((bottom, { naturalBottom }) => Math.max(bottom, naturalBottom), 0);
            // Grow the top inset while an overlay is open and only release it once
            // every overlay has closed: shrinking it while the overlay is still
            // open lets the overlay flip back above the frame and the two loop.
            // Read the inset that is actually painted, so a measurement taken before
            // the last update rendered does not add the same shortfall twice.
            const paintedInsetTop = root ? Number.parseFloat(window.getComputedStyle(root).paddingTop) || 0 : 0;
            const missingTop = Math.max(0, Math.ceil(-(Math.min(rootRect?.top ?? 0, overlayTop))));
            const nextInsetTop = overlayRects.length > 0 ? Math.round(paintedInsetTop) + missingTop : 0;
            setFloatingOverlayInsetTop((current) => current === nextInsetTop ? current : nextInsetTop);

            // Open overlays are portalled outside the wrap, so their bottom edge is
            // added here: the frame grows while one is open and shrinks after it
            // closes, instead of reserving room for it (docs-page rule ①).
            return Math.ceil(Math.max(root?.scrollHeight ?? 0, rootRect?.bottom ?? 0, overlayBottom));
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
                        "flex min-h-[120px] justify-center [&>*]:min-h-[120px] [&>*]:w-full [&>*]:justify-center",
                        hasFloatingOverlay
                            ? "items-start [&>*]:items-start"
                            : "items-center [&>*]:items-center"
                    )
                    : "min-h-screen max-sm:[&>*]:min-h-0 max-sm:[&>*]:items-start max-sm:[&>*]:justify-center",
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
