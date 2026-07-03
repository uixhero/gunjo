"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconChevronRight as ChevronRight } from "@tabler/icons-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge, Card, CardContent, Select, cn } from "@gunjo/ui";
import { VISIBLE_PATTERNS, type PatternEntry, type PatternRouteEntry } from "@/lib/patterns";
import { PATTERN_COLD_TESTS, coldTestHref } from "@/lib/pattern-cold-tests";
import type { PatternKey } from "@/lib/translations";

const PATTERN_COMPONENTS: Record<string, { name: string; href: string }[]> = {
    auth: [
        { name: "MarqueeFrame", href: "/docs/components/marquee-frame" },
        { name: "DeviceFrame", href: "/docs/components/device-frame" },
    ],
    dashboard: [
        { name: "MarqueeFrame", href: "/docs/components/marquee-frame" },
        { name: "DeviceFrame", href: "/docs/components/device-frame" },
        { name: "AnalyticsCard", href: "/docs/components/analytics-card" },
    ],
    editor: [
        { name: "MarqueeFrame", href: "/docs/components/marquee-frame" },
        { name: "DeviceFrame", href: "/docs/components/device-frame" },
        { name: "EditorTemplate", href: "/docs/components/editor" },
    ],
    kanban: [
        { name: "MarqueeFrame", href: "/docs/components/marquee-frame" },
        { name: "DeviceFrame", href: "/docs/components/device-frame" },
        { name: "KanbanTemplate", href: "/docs/components/kanban" },
    ],
    chat: [
        { name: "MarqueeFrame", href: "/docs/components/marquee-frame" },
        { name: "DeviceFrame", href: "/docs/components/device-frame" },
        { name: "ChatTemplate", href: "/docs/components/chat" },
    ],
    landing: [
        { name: "MarqueeFrame", href: "/docs/components/marquee-frame" },
        { name: "DeviceFrame", href: "/docs/components/device-frame" },
        { name: "LandingTemplate", href: "/docs/components/landing" },
    ],
    bannalyze: [
        { name: "MarqueeFrame", href: "/docs/components/marquee-frame" },
        { name: "DeviceFrame", href: "/docs/components/device-frame" },
        { name: "BannalyzeTemplate", href: "/docs/components/bannalyze" },
    ],
    "media-library": [
        { name: "MarqueeFrame", href: "/docs/components/marquee-frame" },
        { name: "DeviceFrame", href: "/docs/components/device-frame" },
        { name: "MediaLibraryTemplate", href: "/docs/components/media-library" },
        { name: "AssetGrid", href: "/docs/components/asset-grid" },
        { name: "AssetInspectorPanel", href: "/docs/components/asset-inspector-panel" },
    ],
    "not-found": [
        { name: "StatusScreen", href: "/docs/components/status-screen" },
        { name: "Button", href: "/docs/components/button" },
    ],
};

function PatternInfoCard({ pattern }: { pattern: PatternEntry }) {
    const { locale, pages } = useLocale();
    const t = pages.patterns;
    const copy = t.patterns[pattern.slug as PatternKey];
    const components = PATTERN_COMPONENTS[pattern.slug] ?? [
        { name: "MarqueeFrame", href: "/docs/components/marquee-frame" },
        { name: "DeviceFrame", href: "/docs/components/device-frame" },
    ];
    const coldTests = PATTERN_COLD_TESTS[pattern.slug] ?? [];
    const routeLabel = t.meta.routeCount(pattern.routes.length);
    const getRouteLabel = (route: PatternRouteEntry) =>
        locale === "ja" ? route.labelJa : route.label;

    return (
        <section className="container pb-10 md:pb-12">
            <Card>
                <CardContent className="grid gap-6 p-5 md:grid-cols-[1.4fr_1fr] md:p-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary">{t.surfaces[pattern.surface]}</Badge>
                                <Badge variant="outline">{t.industries[pattern.industry]}</Badge>
                                <Badge variant="outline">{routeLabel}</Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    {t.meta.patternDetails}
                                </p>
                                <h2 className="text-xl font-semibold tracking-tight">{copy.title}</h2>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {copy.description}
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg border bg-muted/20 p-3">
                                <div className="text-xs font-medium text-muted-foreground">
                                    {t.meta.surface}
                                </div>
                                <div className="mt-1 text-sm font-medium">{t.surfaces[pattern.surface]}</div>
                            </div>
                            <div className="rounded-lg border bg-muted/20 p-3">
                                <div className="text-xs font-medium text-muted-foreground">
                                    {t.meta.complexity}
                                </div>
                                <div className="mt-1 text-sm font-medium">{t.complexity[pattern.complexity]}</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold">{t.meta.includes}</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {pattern.routes.map((route) => {
                                    const label = getRouteLabel(route);
                                    return (
                                        <Link
                                            key={route.href}
                                            href={route.href}
                                            aria-label={t.meta.openRoute(label)}
                                            className="rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            {label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold">{t.meta.usedComponents}</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {components.map((component) => (
                                    <Link
                                        key={component.name}
                                        href={component.href}
                                        aria-label={t.meta.openComponent(component.name)}
                                        className="rounded-md border bg-background px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        {component.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {coldTests.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold">{t.meta.fieldTested}</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {coldTests.map((ref) => (
                                        <Link
                                            key={ref.round}
                                            href={coldTestHref(ref.round)}
                                            className="rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            #{ref.round} {locale === "ja" ? ref.ja : ref.en}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}

export default function PatternsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { locale, pages } = useLocale();
    const t = pages.patterns;
    const slug = pathname.split("/").filter(Boolean)[1];
    const pattern = slug ? VISIBLE_PATTERNS.find((entry) => entry.slug === slug) : undefined;
    const patternCopy = pattern ? t.patterns[pattern.slug as PatternKey] : null;
    const label = patternCopy?.title ?? (slug ? slug : null);
    const sectionLabel = locale === "ja" ? "画面" : "Pages";
    const routeGroup = pattern?.routes;
    const selectedHref =
        routeGroup?.find((route) => route.href === pathname)?.href ??
        routeGroup?.[0]?.href;
    const hasManyRoutes = (routeGroup?.length ?? 0) > 3;
    const selectClassName = hasManyRoutes ? "lg:hidden" : "sm:hidden";
    const linksClassName = hasManyRoutes ? "hidden lg:flex" : "hidden sm:flex";
    const getRouteLabel = (route: PatternRouteEntry) =>
        locale === "ja" ? route.labelJa : route.label;

    // /patterns is the index hub — no breadcrumb needed there. Show only
    // when on a sub-page (/patterns/dashboard etc.).
    const isIndex = pathname === "/patterns";

    // When this page is rendered inside an iframe (from /patterns index or
    // /showcase grid), suppress the Next.js dev-tools floating widget so
    // it doesn't pollute every preview thumbnail.
    const [isInIframe, setIsInIframe] = React.useState(false);
    React.useEffect(() => {
        try {
            setIsInIframe(window.self !== window.top);
        } catch {
            setIsInIframe(true);
        }
    }, []);

    return (
        <>
            {!isIndex && !isInIframe && (
                <div className="sticky top-14 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-10 items-center justify-between gap-3 text-sm">
                        <div className="flex shrink-0 items-center gap-2">
                            <Link
                                href="/patterns"
                                className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                            >
                                Patterns
                            </Link>
                            {label ? (
                                <>
                                    <ChevronRight
                                        className="h-3.5 w-3.5 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                    <span className="font-medium text-foreground">{label}</span>
                                </>
                            ) : null}
                        </div>
                        {routeGroup && selectedHref ? (
                            <nav
                                aria-label={`${label ?? slug} ${sectionLabel}`}
                                className="flex min-w-0 shrink-0 items-center gap-1"
                            >
                                <span
                                    className={cn(
                                        "hidden shrink-0 text-xs text-muted-foreground",
                                        hasManyRoutes ? "lg:inline" : "sm:inline"
                                    )}
                                >
                                    {sectionLabel}
                                </span>
                                <div className={selectClassName}>
                                    <label htmlFor={`${slug}-pattern-page`} className="sr-only">
                                        {sectionLabel}
                                    </label>
                                    <Select
                                        id={`${slug}-pattern-page`}
                                        value={selectedHref}
                                        onChange={(event) => {
                                            router.push(event.currentTarget.value);
                                        }}
                                        className="h-8 w-[8.75rem] rounded-md py-1 pl-2 pr-7 text-xs [&+svg]:right-2 [&+svg]:top-2 [&+svg]:h-3.5 [&+svg]:w-3.5"
                                    >
                                        {routeGroup.map((route) => (
                                            <option key={route.href} value={route.href}>
                                                {getRouteLabel(route)}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div
                                    className={cn(
                                        "min-w-0 items-center gap-1 overflow-x-auto",
                                        linksClassName
                                    )}
                                >
                                    {routeGroup.map((route) => {
                                        const isActive = pathname === route.href;
                                        return (
                                            <Link
                                                key={route.href}
                                                href={route.href}
                                                aria-current={isActive ? "page" : undefined}
                                                className={
                                                    isActive
                                                        ? "shrink-0 rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background"
                                                        : "shrink-0 rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary-border hover:text-foreground"
                                                }
                                            >
                                                {getRouteLabel(route)}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </nav>
                        ) : null}
                    </div>
                </div>
            )}
            {children}
            {!isIndex && !isInIframe && pattern ? <PatternInfoCard pattern={pattern} /> : null}
            {isInIframe && (
                <style>{`nextjs-portal { display: none !important; }`}</style>
            )}
        </>
    );
}
