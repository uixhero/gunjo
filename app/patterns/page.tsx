"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { IconArrowUpRight as ArrowUpRight, IconPackages as Boxes } from "@tabler/icons-react";
import { Badge, Card, CardContent, Skeleton, cn } from "@gunjo/ui";
import {
    PATTERN_FAMILY_ORDER,
    PLANNED_INDUSTRY_PATTERNS,
    VISIBLE_PATTERNS,
    type PatternEntry,
} from "@/lib/patterns";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { PatternKey } from "@/lib/translations";

function PreviewThumb({ slug, title }: { slug: string; title: string }) {
    const imgRef = React.useRef<HTMLImageElement | null>(null);
    const [loaded, setLoaded] = React.useState(false);
    const [errored, setErrored] = React.useState(false);
    // next-themes returns undefined until the provider mounts on the
    // client, so guard with a mounted flag and treat the first render as
    // dark-default (matches the docs site's pre-hydration look).
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    const { resolvedTheme } = useTheme();
    const mode: "light" | "dark" =
        mounted && resolvedTheme === "light" ? "light" : "dark";
    const src = `/patterns-thumbs/${slug}.${mode}.png`;

    // Mirror the showcase PreviewThumb cache-hit fix: if the image was
    // already in the browser cache, native onLoad has already fired and
    // React would never flip `loaded` to true. Sync from img.complete on
    // mount. Re-run when src changes (theme switch).
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

    return (
        <div className="relative h-56 overflow-hidden bg-muted/30">
            {!loaded && !errored && (
                <Skeleton className="absolute inset-0 h-full w-full" />
            )}
            {errored ? (
                <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
                    preview unavailable
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

function PatternCard({ pattern }: { pattern: PatternEntry }) {
    const { locale, pages } = useLocale();
    const t = pages.patterns;
    const copy = t.patterns[pattern.slug as PatternKey];
    const routeLabel = t.meta.routeCount(pattern.routes.length);

    return (
        <Card className="flex h-full w-full flex-col overflow-hidden transition-colors hover:border-primary-border">
            <Link
                href={`/patterns/${pattern.slug}`}
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={t.meta.openPattern(copy.title)}
            >
                <PreviewThumb slug={pattern.slug} title={copy.title} />
            </Link>
            <CardContent className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{t.surfaces[pattern.surface]}</Badge>
                    <Badge variant="outline">{t.industries[pattern.industry]}</Badge>
                    <Badge variant="outline">{routeLabel}</Badge>
                </div>
                <Link
                    href={`/patterns/${pattern.slug}`}
                    className="group/title inline-flex items-center justify-between gap-2 font-semibold tracking-tight transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={t.meta.openPattern(copy.title)}
                >
                    <span>{copy.title}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-all group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 group-hover/title:opacity-100" />
                </Link>
                <p className="text-sm text-muted-foreground">{copy.description}</p>
                <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">
                        {t.meta.includes}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {pattern.routes.map((route) => {
                            const label = locale === "ja" ? route.labelJa : route.label;

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
                <div className="mt-auto pt-1 text-xs text-muted-foreground">
                    {t.meta.complexity}: {t.complexity[pattern.complexity]}
                </div>
            </CardContent>
        </Card>
    );
}

export default function PatternsIndexPage() {
    const { pages } = useLocale();
    const t = pages.patterns;
    const groupedPatterns = PATTERN_FAMILY_ORDER.map((family) => ({
        family,
        patterns: VISIBLE_PATTERNS.filter((pattern) => pattern.family === family),
    })).filter((group) => group.patterns.length > 0);

    return (
        <div className="container py-10 md:py-12">
            <div className="space-y-10">
                <header className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Boxes className="h-5 w-5 text-primary" />
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            {t.label}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        {t.heading}
                    </h1>
                    <p className="max-w-2xl text-lg text-muted-foreground">
                        {t.subtitle}
                    </p>
                </header>

                <div className="space-y-12">
                    {groupedPatterns.map(({ family, patterns }) => (
                        <section key={family} className="space-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        {t.families[family].title}
                                    </h2>
                                    <p className="max-w-2xl text-sm text-muted-foreground">
                                        {t.families[family].description}
                                    </p>
                                </div>
                                <Badge variant="outline">
                                    {t.meta.availableCount(patterns.length)}
                                </Badge>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {patterns.map((pattern) => (
                                    <PatternCard key={pattern.slug} pattern={pattern} />
                                ))}
                            </div>
                        </section>
                    ))}

                    <section className="space-y-4 border-t border-border/60 pt-8">
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-2xl font-semibold tracking-tight">
                                    {t.planned.title}
                                </h2>
                                <Badge variant="secondary">{t.meta.planned}</Badge>
                            </div>
                            <p className="max-w-2xl text-sm text-muted-foreground">
                                {t.planned.description}
                            </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            {PLANNED_INDUSTRY_PATTERNS.map((pattern) => {
                                const copy = t.planned.patterns[pattern.key];
                                return (
                                    <Card key={pattern.key} className="border-dashed">
                                        <CardContent className="space-y-3 p-4">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge variant="outline">
                                                    {t.surfaces[pattern.surface]}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {t.industries[pattern.industry]}
                                                </Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-semibold">
                                                    {copy.title}
                                                </h3>
                                                <p className="text-xs leading-relaxed text-muted-foreground">
                                                    {copy.description}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
