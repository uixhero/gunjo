"use client";

import * as React from "react";

const PREVIEW_SURFACE_SELECTOR = "[data-doc-component-preview-surface]";

/**
 * Docs-only glue: resolves the ComponentPreview surface that wraps a demo so
 * popovers open inside the preview frame instead of on document.body
 * (docs-page rule ①: overlays stay inside the preview). Attach `ref` to an
 * element inside the demo and pass `container` to `portalContainer`.
 */
export function usePreviewPortalContainer<T extends HTMLElement = HTMLDivElement>() {
    const ref = React.useRef<T | null>(null);
    const [container, setContainer] = React.useState<HTMLElement | null>(null);

    React.useEffect(() => {
        // Outside a docs preview (e.g. /embed pages) keep the default body portal.
        setContainer(ref.current?.closest<HTMLElement>(PREVIEW_SURFACE_SELECTOR) ?? null);
    }, []);

    return { ref, container };
}

/**
 * Wraps a component that accepts a portal-container prop so every instance on
 * a docs page portals into its own preview surface. The published code
 * samples keep using the plain component; only the live preview is wrapped.
 * `prop` names the component's container prop (default `portalContainer`).
 */
export function withPreviewPortal<P extends object, K extends keyof P & string = "portalContainer" & keyof P>(
    Component: React.ComponentType<P>,
    prop: K = "portalContainer" as K,
) {
    function InPreview(props: P) {
        const { ref, container } = usePreviewPortalContainer<HTMLDivElement>();
        const override = { [prop]: (props[prop] as HTMLElement | null | undefined) ?? container } as Partial<P>;
        return (
            <div ref={ref} className="contents">
                <Component {...props} {...override} />
            </div>
        );
    }
    InPreview.displayName = `InPreview(${Component.displayName ?? Component.name ?? "Component"})`;
    return InPreview;
}

/**
 * Same as `withPreviewPortal`, for components that forward the container to a
 * nested props object (e.g. ChatComposer's `inputProps.portalContainer`).
 */
export function withPreviewPortalIn<P extends object, K extends keyof P & string>(
    Component: React.ComponentType<P>,
    nestedProp: K,
) {
    function InPreview(props: P) {
        const { ref, container } = usePreviewPortalContainer<HTMLDivElement>();
        const nested = props[nestedProp] as { portalContainer?: HTMLElement | null } | undefined;
        const override = { [nestedProp]: { ...nested, portalContainer: nested?.portalContainer ?? container } } as Partial<P>;
        return (
            <div ref={ref} className="contents">
                <Component {...props} {...override} />
            </div>
        );
    }
    InPreview.displayName = `InPreview(${Component.displayName ?? Component.name ?? "Component"})`;
    return InPreview;
}
