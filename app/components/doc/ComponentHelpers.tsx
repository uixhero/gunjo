"use client";

import React, { useState } from "react";
import { Button, Tabs, TabsList, TabsTrigger, TabsContent, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { cn } from "@gunjo/ui";
import { usePathname } from "next/navigation";
import type { SectionLabels } from "@/lib/docs-content";
import { getDocContent } from "@/lib/docs-content";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    buildComponentSpec,
    findSourceCategory,
    findStability,
    specToMarkdown,
} from "@/lib/component-spec-builder";
import { CopySpecButton } from "@/components/doc/CopySpecButton";
import { copyTextToClipboard } from "@/components/doc/clipboard";
import { StabilityBadge } from "@/components/doc/StabilityBadge";
import { LocalNav } from "@/components/layout/TableOfContents";
import { getUixheroLinks } from "@/lib/uixhero-links";

import {
    IconCheck as Check,
    IconCopy as Copy,
    IconDeviceDesktop as Monitor,
    IconDeviceMobile as Smartphone,
    IconDeviceTablet as Tablet,
    IconExternalLink as ExternalLink,
    IconMaximize as Maximize2,
    IconX as X,
} from "@tabler/icons-react";
import Link from "next/link";

function kebabToCamel(slug: string): string {
    return slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

// /docs/components/<slug> — flat URL. Source tier is recovered by
// looking up the slug in the runtime manifest; the docs taxonomy is
// purely functional and lives in the sidebar.
function deriveFlatSlug(pathname: string | null): string | null {
    if (!pathname) return null;
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length < 3 || parts[0] !== "docs" || parts[1] !== "components") {
        return null;
    }
    return parts[2];
}

function deriveSpecMarkdown(pathname: string | null): string | null {
    const slug = deriveFlatSlug(pathname);
    if (!slug) return null;
    const name = kebabToCamel(slug);
    const category = findSourceCategory(name);
    if (!category) return null;
    const spec = buildComponentSpec(category, name);
    if (!spec) return null;
    return specToMarkdown(spec);
}

function deriveStability(pathname: string | null) {
    const slug = deriveFlatSlug(pathname);
    if (!slug) return null;
    return findStability(kebabToCamel(slug));
}

function derivePageId(pathname: string | null): string | null {
    const slug = deriveFlatSlug(pathname);
    if (!slug) return null;
    return `components/${slug}`;
}

export interface UsedComponent {
    name: string;
    href: string;
}

export type ComponentReference = UsedComponent;

interface ComponentLayoutProps {
    title: string;
    description: string;
    children: React.ReactNode;
    usedComponents?: UsedComponent[];
    relatedComponents?: ComponentReference[];
    sectionLabels?: SectionLabels;
}

export function ComponentLayout({ title, description, children, usedComponents, relatedComponents, sectionLabels }: ComponentLayoutProps) {
    const pathname = usePathname();
    const { locale, bilingual } = useLocale();
    const usedLabel = sectionLabels?.usedComponents ?? (locale === "ja" ? "使用コンポーネント:" : "Used Components:");
    const relatedLabel = sectionLabels?.relatedComponents ?? (locale === "ja" ? "関連コンポーネント:" : "Related Components:");
    const titleLabel = React.useMemo(() => {
        const pageId = derivePageId(pathname);
        const enTitle = pageId ? getDocContent(pageId, "en")?.title : undefined;
        const candidates = [enTitle, title, enTitle?.replace(/\s+/g, ""), title.replace(/\s+/g, "")]
            .filter((candidate): candidate is string => Boolean(candidate));

        for (const candidate of candidates) {
            const resolved = bilingual(candidate);
            if (resolved.ja !== candidate) return resolved;
        }

        return bilingual(enTitle ?? title);
    }, [bilingual, pathname, title]);
    const specMarkdown = React.useMemo(
        () => deriveSpecMarkdown(pathname),
        [pathname]
    );
    const stability = React.useMemo(
        () => deriveStability(pathname),
        [pathname]
    );
    // Derive locale-aware description from docs content first. The page passes
    // the .pen metadata description as an English fallback while category
    // sweeps fill any missing JA entries.
    const localizedDescription = React.useMemo(() => {
        const pageId = derivePageId(pathname);
        if (!pageId) return description;
        const localized = getDocContent(pageId, locale);
        return localized?.description ?? description;
    }, [pathname, locale, description]);

    return (
        <div
            className="space-y-10"
            data-doc-component-layout="true"
            data-doc-component-title={title}
        >
            <div className="space-y-4">
                <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="min-w-0 space-y-2">
                        <h1 className="flex scroll-m-20 flex-wrap items-baseline gap-x-3 gap-y-1 text-4xl font-extrabold tracking-tight lg:text-5xl">
                            <span>{titleLabel.primary}</span>
                            {titleLabel.secondary !== titleLabel.primary && (
                                <span className="text-sm font-normal tracking-normal text-muted-foreground lg:text-base">
                                    {titleLabel.secondary}
                                </span>
                            )}
                            {stability ? <StabilityBadge level={stability} /> : null}
                        </h1>
                        <p className="text-lg text-muted-foreground">{localizedDescription}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 lg:justify-self-end">
                        {specMarkdown && (
                            <CopySpecButton
                                markdown={specMarkdown}
                                label={sectionLabels?.copySpecForAi ?? (locale === "ja" ? "AI用仕様をコピー" : "Copy spec for AI")}
                                copiedLabel={sectionLabels?.copied ?? (locale === "ja" ? "コピー済み" : "Copied")}
                                copyFailedLabel={sectionLabels?.copyFailed ?? (locale === "ja" ? "コピーに失敗しました" : "Copy failed")}
                            />
                        )}
                    </div>
                </div>
                <LocalNav />
            </div>
            <div className="space-y-10">
                {/* Visually hidden anchor so LocalNav has a "Preview" entry
                    that scrolls to the top of the demo. The pages that
                    follow contribute their own h2s (Props / Usage). */}
                <h2 id="preview" className="sr-only">
                    {sectionLabels?.preview ?? (locale === "ja" ? "プレビュー" : "Preview")}
                </h2>
                {children}
                {(usedComponents?.length || relatedComponents?.length) ? (
                    <div className="space-y-6">
                        {usedComponents && usedComponents.length > 0 && (
                            <ComponentReferenceSection
                                id="used-components"
                                label={usedLabel}
                                components={usedComponents}
                            />
                        )}
                        {relatedComponents && relatedComponents.length > 0 && (
                            <ComponentReferenceSection
                                id="related-components"
                                label={relatedLabel}
                                components={relatedComponents}
                            />
                        )}
                    </div>
                ) : null}
                <UixheroRationaleSection
                    componentSlug={deriveFlatSlug(pathname)}
                    componentTitle={title}
                    locale={locale}
                />
            </div>
        </div>
    );
}

// 姉妹サイト UIXHERO への逆リンク（設計の判断・根拠）。対応の有無は
// uixhero-mapping.json（SSOT）から導出され、対応がない部品では何も出ない。
function UixheroRationaleSection({
    componentSlug,
    componentTitle,
    locale,
}: {
    componentSlug: string | null;
    componentTitle: string;
    locale: "en" | "ja";
}) {
    const links = React.useMemo(() => getUixheroLinks(componentSlug), [componentSlug]);
    if (!links.zukanHref && links.laws.length === 0) return null;

    const heading = locale === "ja" ? "設計の判断（UIXHERO）" : "Design rationale (UIXHERO)";
    const description =
        locale === "ja"
            ? "「いつ・なぜ使うか」の判断は、姉妹サイト UIXHERO の記事で解説しています。"
            : "The when-and-why guidance for this component lives on our sister site UIXHERO (articles in Japanese).";
    const zukanLabel =
        locale === "ja"
            ? `UIコンポーネント: ${componentTitle}`
            : `UI component: ${componentTitle}`;

    const items = [
        ...(links.zukanHref ? [{ label: zukanLabel, href: links.zukanHref }] : []),
        ...links.laws,
    ];

    return (
        <section className="space-y-3" data-uixhero-rationale="true">
            <h2 id="uixhero-rationale" className="scroll-m-20 text-xl font-semibold tracking-tight">
                {heading}
            </h2>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        {item.label}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                ))}
            </div>
        </section>
    );
}

function ComponentReferenceSection({
    id,
    label,
    components,
}: {
    id: string;
    label: string;
    components: ComponentReference[];
}) {
    const heading = label.replace(/[:：]\s*$/, "");

    return (
        <section className="space-y-3">
            <h2 id={id} className="scroll-m-20 text-xl font-semibold tracking-tight">
                {heading}
            </h2>
            <div className="flex flex-wrap gap-2">
                {components.map((component) => (
                    <Link
                        key={`${id}-${component.name}`}
                        href={component.href}
                        className="inline-flex items-center rounded-md border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        {component.name}
                    </Link>
                ))}
            </div>
        </section>
    );
}

interface ComponentPreviewProps {
    codeBlock: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    sectionLabels?: SectionLabels;
    /**
     * Constrains demos inside the preview viewport. Use `full` for templates
     * and page-sized compositions; the default keeps w-full primitives from
     * stretching across a 1280px preview.
     */
    previewBodyWidth?: PreviewBodyWidth;
    /**
     * Optional embed URL. When provided, all preview modes render the embed
     * page in an iframe so viewport-based media queries (md:/lg:) resolve
     * against the iframe's actual width instead of the parent window.
     * Desktop = 1280px (with horizontal scroll if the surface is narrower),
     * tablet = 768px, mobile = 375px.
     */
    embedSrc?: string;
    /** Raw source for the demo. When set, a copy action appears next to the Code tab. */
    code?: string;
    /**
     * Bumps the iframe min-height so full-page templates (auth, dashboard,
     * etc) render without an internal scroll bar. Has no effect when
     * embedSrc is unset.
     */
    fullPagePreview?: boolean;
    /**
     * Optional iframe preview height for compact demos such as chart cards.
     * Has no effect when embedSrc is unset.
     */
    previewHeight?: number | "auto";
    /**
     * Whether embedded previews should resize to their content. Keep this off
     * for contained overlays such as drawers and dropdown menus, where opening the overlay should
     * not push the docs page layout.
     */
    fitEmbedHeightContent?: boolean;
    /**
     * Optional viewport to use only in FIT mode. Useful for mobile-specific
     * demos such as drawers where desktop-width scaling makes the preview too
     * short to inspect.
     */
    fitViewport?: ViewportSize;
}

export type ViewportSize = "desktop" | "tablet" | "mobile";
type PreviewMode = "auto" | ViewportSize;
type PreviewBodyWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

const VIEW_WIDTHS: Record<ViewportSize, number> = {
    desktop: 1280,
    tablet: 768,
    mobile: 375,
};

const PREVIEW_BODY_WIDTH_CLASSES: Record<PreviewBodyWidth, string> = {
    sm: "max-w-sm",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    "2xl": "max-w-6xl",
    full: "max-w-none",
};

const PREVIEW_BODY_WIDTH_PX: Record<PreviewBodyWidth, number | null> = {
    sm: 384,
    md: 576,
    lg: 768,
    xl: 1024,
    "2xl": 1152,
    full: null,
};

function pickInitialViewportSize(): ViewportSize {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    if (w < 640) return "mobile";
    if (w < 1024) return "tablet";
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        return "desktop";
    }
    return "desktop";
}

function appendEmbedPreviewParams(
    src: string,
    previewBodyWidth: PreviewBodyWidth,
    options?: { fitHeightContent?: boolean; locale?: string }
): string {
    const separator = src.includes("?") ? "&" : "?";
    const params = new URLSearchParams();
    params.set("previewWrap", previewBodyWidth);
    if (options?.fitHeightContent) {
        params.set("fitHeight", "content");
    }
    if (options?.locale) {
        params.set("locale", options.locale);
    }
    return `${src}${separator}${params.toString()}`;
}

function getFitScale(surfaceWidth: number, visibleWidth: number, mode: PreviewMode): number {
    if (mode !== "auto" || surfaceWidth <= 0) return 1;
    return Math.min(1, surfaceWidth / visibleWidth);
}

function isTooltipOverlay(element: Element) {
    return element.matches("[role='tooltip']") || element.querySelector("[role='tooltip']") !== null;
}

export function ComponentPreview({ codeBlock, children, className, sectionLabels, embedSrc, code, fullPagePreview, previewHeight, previewBodyWidth, fitViewport, fitEmbedHeightContent }: ComponentPreviewProps) {
    const [viewMode, setViewMode] = useState<PreviewMode>("auto");
    const [autoViewport, setAutoViewport] = useState<ViewportSize>("desktop");
    const [surfaceWidth, setSurfaceWidth] = useState(0);
    const [fitContentHeight, setFitContentHeight] = useState<number | null>(null);
    const [embedLoading, setEmbedLoading] = useState(false);
    const previewSurfaceRef = React.useRef<HTMLDivElement | null>(null);
    const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
    const previousEmbedPreviewSrcRef = React.useRef<string | undefined>(undefined);

    React.useEffect(() => {
        const updateAutoViewport = () => setAutoViewport(pickInitialViewportSize());
        updateAutoViewport();
        window.addEventListener("resize", updateAutoViewport);
        return () => window.removeEventListener("resize", updateAutoViewport);
    }, []);

    React.useEffect(() => {
        const element = previewSurfaceRef.current;
        if (!element) return;

        const updateSurfaceWidth = () => {
            const styles = window.getComputedStyle(element);
            const horizontalPadding =
                Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight);
            setSurfaceWidth(Math.max(0, element.clientWidth - horizontalPadding));
        };
        updateSurfaceWidth();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", updateSurfaceWidth);
            return () => window.removeEventListener("resize", updateSurfaceWidth);
        }

        const observer = new ResizeObserver(updateSurfaceWidth);
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    const { tooltip, locale } = useLocale();
    const previewLabel = sectionLabels?.preview ?? (locale === "ja" ? "プレビュー" : "Preview");
    const codeLabel = sectionLabels?.code ?? (locale === "ja" ? "コード" : "Code");
    const useIframe = embedSrc !== undefined;
    const effectiveViewport = viewMode === "auto" ? fitViewport ?? autoViewport : viewMode;
    const viewportWidth = VIEW_WIDTHS[effectiveViewport];
    const autoHeightPreview = previewHeight === "auto" && !useIframe;
    const explicitPreviewHeight = typeof previewHeight === "number" ? previewHeight : undefined;
    const shouldFitEmbedHeight = useIframe && !fullPagePreview && (fitEmbedHeightContent ?? true);
    const previewFrameHeight = useIframe
        ? fullPagePreview
            ? 900
            : viewMode === "auto"
              ? Math.max(explicitPreviewHeight ?? 120, fitContentHeight ?? 0)
              : Math.max(explicitPreviewHeight ?? 700, fitContentHeight ?? 0)
        : viewMode === "auto"
        ? explicitPreviewHeight ?? 120
        : explicitPreviewHeight ?? 350;
    const resolvedPreviewBodyWidth = previewBodyWidth ?? (fullPagePreview ? "full" : "lg");
    const previewBodyPixelWidth = PREVIEW_BODY_WIDTH_PX[resolvedPreviewBodyWidth];
    // Non-embedded previews can shrink-wrap compact controls in FIT mode.
    // Embedded docs previews keep the selected viewport width and scale it.
    const fitVisibleWidth =
        viewMode === "auto" && previewBodyPixelWidth !== null
            ? useIframe
                ? viewportWidth
                : Math.min(viewportWidth, previewBodyPixelWidth)
            : viewportWidth;
    const previewCropOffset =
        viewMode === "auto" ? Math.max(0, (viewportWidth - fitVisibleWidth) / 2) : 0;
    const embedPreviewSrc = embedSrc
        ? appendEmbedPreviewParams(embedSrc, resolvedPreviewBodyWidth, {
            fitHeightContent: shouldFitEmbedHeight,
            locale,
        })
        : undefined;
    const fitScale = getFitScale(surfaceWidth, fitVisibleWidth, viewMode);
    const scaledWidth = fitVisibleWidth * fitScale;
    const scaledHeight = previewFrameHeight * fitScale;
    const nonIframePreviewWidth = viewMode === "auto" ? fitVisibleWidth : viewportWidth;
    const nonIframeCropOffset = viewMode === "auto" ? 0 : previewCropOffset;
    const bodyWidthClass = PREVIEW_BODY_WIDTH_CLASSES[resolvedPreviewBodyWidth];
    const openLabel = locale === "ja" ? "新しいタブで開く" : "Open in new tab";
    const previewLoadingLabel = locale === "ja" ? "プレビューを更新中" : "Updating preview";

    const syncIframeContentHeight = React.useCallback(() => {
        if (!shouldFitEmbedHeight) return;
        const iframe = iframeRef.current;
        const doc = iframe?.contentDocument;
        if (!doc) return;

        const root = doc.querySelector("[data-embed-preview-wrap]");
        const rootRect = root?.getBoundingClientRect();
        const nextHeight = Math.ceil(Math.max(root?.scrollHeight ?? 0, rootRect?.bottom ?? 0));
        if (Number.isFinite(nextHeight)) {
            setFitContentHeight(Math.max(120, nextHeight));
        }
    }, [shouldFitEmbedHeight]);

    const markIframeLoaded = React.useCallback(() => {
        syncIframeContentHeight();
        setEmbedLoading(false);
    }, [syncIframeContentHeight]);

    React.useEffect(() => {
        setFitContentHeight(null);
    }, [viewMode, viewportWidth, embedPreviewSrc]);

    React.useEffect(() => {
        if (!useIframe) return;
        if (previousEmbedPreviewSrcRef.current === embedPreviewSrc) return;
        if (previousEmbedPreviewSrcRef.current === undefined) {
            previousEmbedPreviewSrcRef.current = embedPreviewSrc;
            setEmbedLoading(false);
            return;
        }
        previousEmbedPreviewSrcRef.current = embedPreviewSrc;
        setEmbedLoading(true);
    }, [embedPreviewSrc, useIframe]);

    React.useEffect(() => {
        if (!useIframe || !embedLoading) return;

        const timeout = window.setTimeout(() => {
            if (iframeRef.current?.contentDocument?.readyState === "complete") {
                markIframeLoaded();
            }
        }, 80);

        return () => window.clearTimeout(timeout);
    }, [embedLoading, markIframeLoaded, useIframe]);

    React.useEffect(() => {
        if (!useIframe || !shouldFitEmbedHeight) return;

        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (event.source !== iframeRef.current?.contentWindow) return;
            if (
                !event.data ||
                event.data.source !== "gunjo-embed-preview" ||
                event.data.type !== "resize"
            ) {
                return;
            }

            const nextHeight = Number(event.data.height);
            if (!Number.isFinite(nextHeight)) return;
            setFitContentHeight(Math.max(120, Math.ceil(nextHeight)));
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [shouldFitEmbedHeight, useIframe]);

    return (
        <div className="space-y-4" data-doc-component-preview="true">
            <Tabs defaultValue="preview" className="relative mr-auto w-full border-0">
                <div className="grid gap-2 pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div className="flex min-w-0 items-center gap-2 overflow-hidden">
                        <TabsList className="min-w-0 shrink justify-start rounded-none bg-transparent p-0">
                            <TabsTrigger
                                value="preview"
                                className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                            >
                                {previewLabel}
                            </TabsTrigger>
                            <TabsTrigger
                                value="code"
                                className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                            >
                                {codeLabel}
                            </TabsTrigger>
                        </TabsList>
                        {code ? <CodeCopyButton code={code} /> : null}
                    </div>
                    <div className="flex min-w-0 items-center justify-end gap-2 overflow-x-auto pb-1 sm:overflow-visible sm:pb-0">
                        {useIframe ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={embedPreviewSrc!}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 rounded-md cursor-pointer hover:bg-muted transition-colors text-muted-foreground"
                                        aria-label={openLabel}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>{openLabel}</TooltipContent>
                            </Tooltip>
                        ) : null}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => setViewMode("auto")}
                                    className={cn(
                                        "p-2 rounded-md cursor-pointer hover:bg-muted transition-colors",
                                        viewMode === "auto" ? "text-foreground bg-muted" : "text-muted-foreground"
                                    )}
                                    aria-label={tooltip("viewAuto")}
                                >
                                    <Maximize2 className="h-4 w-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>{tooltip("viewAuto")}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => setViewMode("desktop")}
                                    className={cn(
                                        "p-2 rounded-md cursor-pointer hover:bg-muted transition-colors",
                                        viewMode === "desktop" ? "text-foreground bg-muted" : "text-muted-foreground"
                                    )}
                                    aria-label={tooltip("viewDesktop")}
                                >
                                    <Monitor className="h-4 w-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>{tooltip("viewDesktop")}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => setViewMode("tablet")}
                                    className={cn(
                                        "p-2 rounded-md cursor-pointer hover:bg-muted transition-colors",
                                        viewMode === "tablet" ? "text-foreground bg-muted" : "text-muted-foreground"
                                    )}
                                    aria-label={tooltip("viewTablet")}
                                >
                                    <Tablet className="h-4 w-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>{tooltip("viewTablet")}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => setViewMode("mobile")}
                                    className={cn(
                                        "p-2 rounded-md cursor-pointer hover:bg-muted transition-colors",
                                        viewMode === "mobile" ? "text-foreground bg-muted" : "text-muted-foreground"
                                    )}
                                    aria-label={tooltip("viewMobile")}
                                >
                                    <Smartphone className="h-4 w-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>{tooltip("viewMobile")}</TooltipContent>
                        </Tooltip>
                    </div>
                </div>
                <TabsContent
                    value="preview"
                    ref={previewSurfaceRef}
                    className={cn(
                        "relative mt-0 rounded-md p-4 bg-muted/20 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        autoHeightPreview ? "min-h-0" : viewMode === "auto" ? "min-h-0" : "min-h-[350px]",
                        autoHeightPreview
                            ? "overflow-visible"
                            : viewMode === "auto"
                            ? "overflow-hidden"
                            : "overflow-x-auto overflow-y-hidden"
                    )}
                    data-doc-component-preview-surface="true"
                >
                    {useIframe ? (
                        <div
                            className="mx-auto"
                            style={{
                                width: `${scaledWidth}px`,
                                height: `${scaledHeight}px`,
                                overflow: "hidden",
                            }}
                        >
                            <div
                                className="relative"
                                style={{
                                    width: `${fitVisibleWidth}px`,
                                    height: `${previewFrameHeight}px`,
                                    transform: `scale(${fitScale})`,
                                    transformOrigin: "top left",
                                    overflow: "hidden",
                                }}
                            >
                                <iframe
                                    ref={iframeRef}
                                    src={embedPreviewSrc}
                                    title="Component preview"
                                    onLoad={markIframeLoaded}
                                    style={{
                                        width: `${viewportWidth}px`,
                                        minHeight: `${previewFrameHeight}px`,
                                        height: `${previewFrameHeight}px`,
                                        transform: `translateX(-${previewCropOffset}px)`,
                                        transformOrigin: "top left",
                                    }}
                                    className={cn(
                                        "preview block bg-background transition-transform duration-300 ease-in-out",
                                        embedLoading && "opacity-0",
                                        className
                                    )}
                                />
                                {embedLoading ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-background text-sm text-muted-foreground">
                                        <span className="animate-pulse">{previewLoadingLabel}</span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ) : (
                        <div
                            className="mx-auto"
                            style={{
                                width: `${scaledWidth}px`,
                                height: autoHeightPreview ? undefined : `${scaledHeight}px`,
                                overflow: autoHeightPreview ? "visible" : "hidden",
                            }}
                        >
                            <div
                                style={{
                                    width: `${nonIframePreviewWidth}px`,
                                    transform: `scale(${fitScale})`,
                                    transformOrigin: "top left",
                                    overflow: autoHeightPreview ? "visible" : "hidden",
                                }}
                            >
                                <div
                                    className={cn(
                                        "preview flex items-center justify-center bg-background p-8 transition-transform duration-300 ease-in-out",
                                        className
                                    )}
                                    style={{
                                        width: `${nonIframePreviewWidth}px`,
                                        minHeight: autoHeightPreview ? undefined : `${previewFrameHeight}px`,
                                        transform: `translateX(-${nonIframeCropOffset}px)`,
                                        transformOrigin: "top left",
                                    }}
                                >
                                    <div className={cn("mx-auto flex w-full justify-center", bodyWidthClass)}>
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="code">
                    <div className="relative rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                        {codeBlock}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export function CodeCopyButton({ code }: { code: string }) {
    const [copyStatus, setCopyStatus] = React.useState<"idle" | "copied" | "failed">("idle");
    const { locale } = useLocale();
    const timeoutRef = React.useRef<number | null>(null);
    const copyLabel = locale === "ja" ? "コードをコピー" : "Copy code";
    const copiedLabel = locale === "ja" ? "コピーしました" : "Copied";
    const copyFailedLabel = locale === "ja" ? "コピーに失敗しました" : "Copy failed";
    const feedbackLabel = copyStatus === "copied" ? copiedLabel : copyStatus === "failed" ? copyFailedLabel : copyLabel;

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleCopy = React.useCallback(async () => {
        try {
            await copyTextToClipboard(code);
            setCopyStatus("copied");
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = window.setTimeout(() => setCopyStatus("idle"), 1500);
        } catch {
            setCopyStatus("failed");
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = window.setTimeout(() => setCopyStatus("idle"), 1500);
        }
    }, [code]);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 shrink-0 gap-1.5 px-2 text-muted-foreground"
                    aria-label={feedbackLabel}
                >
                    {copyStatus === "copied" ? (
                        <Check className="h-3.5 w-3.5 text-primary" />
                    ) : copyStatus === "failed" ? (
                        <X className="h-3.5 w-3.5 text-destructive" />
                    ) : (
                        <Copy className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden sm:inline">{feedbackLabel}</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent>{feedbackLabel}</TooltipContent>
        </Tooltip>
    );
}
