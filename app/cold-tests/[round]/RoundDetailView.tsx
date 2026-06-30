"use client";

import * as React from "react";
import Link from "next/link";
import {
    IconArrowUpRight as ArrowUpRight,
    IconAlertCircle as AlertCircle,
} from "@tabler/icons-react";
import {
    Alert,
    AlertDescription,
    Badge,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Card,
    CardContent,
    CodeBlock,
    DocumentPager,
    MarkdownRenderer,
    cn,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export interface RoundCodeFile {
    file: string;
    language: string;
    source: string;
}

export interface RoundDetail {
    round: number;
    route: string;
    slug: string;
    score: string;
    category: string;
    title: string;
    readmeTitle: string;
    summary: string;
    article: {
        file: string;
        slug: string;
        markdown: string;
    } | null;
    code: RoundCodeFile[];
    components: string[];
    shots: {
        desktop: boolean;
        mobile: boolean;
        "en.desktop": boolean;
        "en.mobile": boolean;
    };
    overwrittenBy: number | null;
}

export interface PagerNeighbour {
    round: number;
    href: string;
    title: string;
    category: string;
    thumbnailSrc?: string;
}

// Names of components we publicly document at /docs/components/<slug>.
function docSlugFor(componentName: string): string {
    return componentName
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
        .toLowerCase();
}

export function RoundDetailView({
    detail,
    previous,
    next,
}: {
    detail: RoundDetail;
    previous: PagerNeighbour | null;
    next: PagerNeighbour | null;
}) {
    const { pages } = useLocale();
    const t = pages.coldTests;
    const td = t.detail;

    const desktopSrc = detail.shots.desktop
        ? `/cold-test-shots/${detail.slug}.desktop.png`
        : null;
    const mobileSrc = detail.shots.mobile
        ? `/cold-test-shots/${detail.slug}.mobile.png`
        : null;

    return (
        <article className="space-y-10">
            {/* Breadcrumb — replaces the previous plain "← back" link.
                See memory feedback-no-plain-text-back-link. */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/cold-tests">{t.label}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/cold-tests">
                                {t.categories[detail.category] ?? detail.category}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            {t.roundLabel(detail.round)} {detail.title}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge
                        variant="outline"
                        className="border-border/60 text-xs uppercase tracking-wider text-muted-foreground"
                    >
                        {t.roundLabel(detail.round)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                        {t.scoreLabel(detail.score)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        {t.categories[detail.category] ?? detail.category}
                    </Badge>
                </div>
                <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                    {detail.title}
                </h1>
                <div className="text-sm text-muted-foreground">
                    {td.routeLabel}: <code className="font-mono text-foreground">{detail.route}</code>
                </div>
            </header>

            {/* Previews */}
            {(desktopSrc || mobileSrc) && (
                <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                    {desktopSrc && (
                        <figure className="space-y-2">
                            <figcaption className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                {td.desktopPreview}
                            </figcaption>
                            <div className="overflow-hidden rounded-md border border-border/60 bg-muted/40">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={desktopSrc}
                                    alt={`${detail.title} desktop preview`}
                                    className="block h-auto w-full"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </figure>
                    )}
                    {mobileSrc && (
                        <figure className="space-y-2">
                            <figcaption className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                {td.mobilePreview}
                            </figcaption>
                            {/* Cold-test mobile shots are full-page (often 4000-8000px tall).
                                Constrain the visual frame so the detail layout doesn't
                                stretch; overflow-y-auto lets readers scroll the long
                                page inside the phone-shaped surface. */}
                            <div className="max-h-[640px] overflow-y-auto overflow-x-hidden rounded-md border border-border/60 bg-muted/40">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={mobileSrc}
                                    alt={`${detail.title} mobile preview`}
                                    className="block h-auto w-full"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">{td.mobilePreviewHint}</p>
                        </figure>
                    )}
                </section>
            )}

            {/* Article */}
            {detail.article?.markdown ? (
                <section className="space-y-3">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {td.article}
                    </h2>
                    <Card className="border-border/80">
                        <CardContent className="px-6 py-5">
                            <MarkdownRenderer content={detail.article.markdown} />
                        </CardContent>
                    </Card>
                </section>
            ) : null}

            {/* Components used */}
            {detail.components.length > 0 && (
                <section className="space-y-3">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {td.componentsUsed}
                    </h2>
                    <p className="text-sm text-muted-foreground">{td.componentsUsedHint}</p>
                    <div className="flex flex-wrap gap-2">
                        {detail.components.map((name) => {
                            const href = `/docs/components/${docSlugFor(name)}`;
                            return (
                                <Link
                                    key={name}
                                    href={href}
                                    aria-label={td.componentDocsLabel(name)}
                                    className={cn(
                                        "group inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 text-xs font-medium text-foreground transition-colors",
                                        "hover:border-primary-border hover:bg-muted/60 hover:text-primary"
                                    )}
                                >
                                    {name}
                                    <ArrowUpRight className="h-3 w-3 opacity-40 transition-opacity group-hover:opacity-100" />
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Source code (or disclosure when overwritten) */}
            <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {td.sourceCode}
                </h2>
                {detail.overwrittenBy ? (
                    <Alert variant="warning">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{td.sourceCodeMissing(detail.overwrittenBy)}</AlertDescription>
                    </Alert>
                ) : detail.code.length === 0 ? (
                    <Alert variant="warning">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{td.sourceCodeMissing(0)}</AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-4">
                        {detail.code.map((file) => (
                            <CodeBlock
                                key={file.file}
                                code={file.source}
                                filename={file.file}
                                language={file.language}
                                showLineNumbers
                                highlight
                                copyable
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Prev / next pager */}
            {(previous || next) && (
                <DocumentPager
                    previous={
                        previous
                            ? {
                                  href: previous.href,
                                  directionLabel: t.pager.previousLabel(previous.round),
                                  title: previous.title,
                                  categoryLabel:
                                      t.categories[previous.category] ?? previous.category,
                                  thumbnailSrc: previous.thumbnailSrc,
                                  thumbnailAlt: `#${previous.round} ${previous.title}`,
                              }
                            : null
                    }
                    next={
                        next
                            ? {
                                  href: next.href,
                                  directionLabel: t.pager.nextLabel(next.round),
                                  title: next.title,
                                  categoryLabel: t.categories[next.category] ?? next.category,
                                  thumbnailSrc: next.thumbnailSrc,
                                  thumbnailAlt: `#${next.round} ${next.title}`,
                              }
                            : null
                    }
                />
            )}
        </article>
    );
}
