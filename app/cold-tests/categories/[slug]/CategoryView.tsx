"use client";

import * as React from "react";
import Link from "next/link";
import { IconFlask as Flask, IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";
import {
    Badge,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Button,
    Card,
    CardContent,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { AggregatedFinding } from "@/lib/cold-test-findings";
import categories from "@/data/cold-test-categories.json";
import gallery from "@/data/cold-test-gallery.json";
import { FindingList, type FindingCardModel } from "../../FindingList";
import { PreviewThumb } from "../../PreviewThumb";

interface CategoryCopy {
    title: string;
    description: string;
    challengeHeading: string;
    challengeBody: string;
    discoveredHeading: string;
    discoveredIntro: string;
    discoveredFooter: string;
    leftHeading: string;
    leftBody: string;
}

interface DiscoveredComponent {
    name: string;
    slug: string;
    round: number;
    blurbJa: string;
    blurbEn: string;
}

// 「動く見本」（架空アプリのデモ）を持つ業界だけが demo を宣言する。
// 節の並びは KeEem 決定（2026-08-23）: 見本が表・発見リストは裏付け。
// 見本の節は発見リスト（要るもの・落とし穴）より上に置く。
interface CategoryDemoScreen {
    slug: string;
    ja: string;
    en: string;
}

interface CategoryDemoCopy {
    heading: string;
    intro: string;
    company: string;
    companyBadge: string;
    body: string;
    cta: string;
    disclaimer: string;
}

interface CategoryDemo {
    href: string;
    screens: CategoryDemoScreen[];
    copy: { ja: CategoryDemoCopy; en: CategoryDemoCopy };
}

interface PublishedCategory {
    slug: string;
    jaCategory: string;
    copy: { ja: CategoryCopy; en: CategoryCopy };
    demo?: CategoryDemo;
    discoveredComponents: DiscoveredComponent[];
}

interface CategoriesShape {
    published: PublishedCategory[];
}

interface ColdTestEntry {
    round: number;
    route: string;
    slug: string;
    score: string;
    category: string;
    title: string;
    summary: string;
    shots: {
        desktop: boolean;
        mobile: boolean;
        "en.desktop": boolean;
        "en.mobile": boolean;
    };
}

interface GalleryShape {
    count: number;
    entries: ColdTestEntry[];
}

const catData = categories as CategoriesShape;
const galleryData = gallery as GalleryShape;

// PascalCase → kebab-case, matching docSlugFor used elsewhere. We only fall
// back to this when the JSON entry omits a slug — the data file is canonical.
function docSlugForName(name: string): string {
    return name
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
        .toLowerCase();
}

// A grouped finding keeps the earliest round's wording; the whole group's
// rounds become the evidence links.
function toFindingCard(entry: AggregatedFinding): FindingCardModel {
    const { representative } = entry;
    return {
        id: entry.key,
        kind: entry.kind,
        status: entry.status,
        phenomenon: representative.phenomenon,
        screen: representative.where.screen,
        spot: representative.where.spot,
        cause: representative.cause,
        selfCheck: representative.selfCheck,
        links: entry.links,
        rounds: entry.rounds,
    };
}

export function CategoryView({
    slug,
    findings = [],
}: {
    slug: string;
    /**
     * Every round in this industry, aggregated. Japanese only for now — the
     * door pages have no English tree yet.
     */
    findings?: AggregatedFinding[];
}) {
    const { locale, pages } = useLocale();
    const t = pages.coldTests;
    const tc = t.categoryPage;
    const tf = t.findings;
    const isJa = locale === "ja";

    const requirementCards = React.useMemo(
        () => findings.filter((f) => f.kind === "requirement").map(toFindingCard),
        [findings]
    );
    const pitfallCards = React.useMemo(
        () => findings.filter((f) => f.kind === "pitfall").map(toFindingCard),
        [findings]
    );

    const category = React.useMemo(
        () => catData.published.find((c) => c.slug === slug),
        [slug]
    );

    const entries = React.useMemo(() => {
        if (!category) return [] as ColdTestEntry[];
        return galleryData.entries
            .filter((e) => e.category === category.jaCategory)
            .sort((a, b) => a.round - b.round);
    }, [category]);

    if (!category) return null;

    const copy = isJa ? category.copy.ja : category.copy.en;
    const categoryLabel = t.categories[category.jaCategory] ?? category.jaCategory;
    const demo = category.demo;
    const demoCopy = demo ? (isJa ? demo.copy.ja : demo.copy.en) : null;

    return (
        <div className="container py-10 md:py-12">
            <article className="mx-auto w-full max-w-3xl space-y-10">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/cold-tests">{t.label}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{categoryLabel}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <header className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Flask className="h-5 w-5 text-primary" />
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            {t.label}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        {copy.title}
                    </h1>
                    <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
                        {copy.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {tc.roundsSummary(entries.length, categoryLabel)}
                    </p>
                </header>

                <section className="space-y-3">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {copy.challengeHeading}
                    </h2>
                    <p className="leading-7 text-foreground">{copy.challengeBody}</p>
                </section>

                {/* 動く見本（架空アプリのデモ）。発見リストより上に置く＝
                    見本が表・リストは裏付け（KeEem 2026-08-23）。 */}
                {demo && demoCopy ? (
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            {demoCopy.heading}
                        </h2>
                        <p className="text-sm text-muted-foreground">{demoCopy.intro}</p>
                        <Card className="border-border/80">
                            <CardContent className="space-y-4 p-5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-lg font-bold tracking-tight">
                                        {demoCopy.company}
                                    </span>
                                    <Badge variant="outline">{demoCopy.companyBadge}</Badge>
                                </div>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    {demoCopy.body}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {demo.screens.map((screen) => (
                                        <Link
                                            key={screen.slug}
                                            href={`${demo.href}/${screen.slug}`}
                                            className="rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            {isJa ? screen.ja : screen.en}
                                        </Link>
                                    ))}
                                </div>
                                <Button asChild>
                                    <Link href={demo.href}>
                                        {demoCopy.cta}
                                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                                    </Link>
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                    {demoCopy.disclaimer}
                                </p>
                            </CardContent>
                        </Card>
                    </section>
                ) : null}

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {copy.discoveredHeading}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {copy.discoveredIntro}
                    </p>
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {category.discoveredComponents.map((c) => {
                            const docSlug = c.slug || docSlugForName(c.name);
                            const blurb = isJa ? c.blurbJa : c.blurbEn;
                            return (
                                <li key={c.name}>
                                    <Link
                                        href={`/docs/components/${docSlug}`}
                                        className="group flex h-full flex-col gap-1.5 rounded-md border border-border/60 p-3 transition-colors hover:border-primary-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-mono text-sm font-semibold tracking-tight transition-colors group-hover:text-primary">
                                                {c.name}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="border-border/60 text-[10px] uppercase tracking-wider text-muted-foreground"
                                            >
                                                {t.roundLabel(c.round)}
                                            </Badge>
                                        </div>
                                        <p className="text-sm leading-6 text-muted-foreground">
                                            {blurb}
                                        </p>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    {copy.discoveredFooter ? (
                        <p className="text-sm text-muted-foreground">
                            {copy.discoveredFooter}
                        </p>
                    ) : null}
                </section>

                {/* The findings data layer, aggregated across the industry's
                    rounds. Separate sections from the hand-written copy above
                    so both can be edited without disturbing the other. */}
                {(requirementCards.length > 0 || pitfallCards.length > 0) && (
                    <>
                        {requirementCards.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold tracking-tight">
                                    {tf.categoryRequirementHeading}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {tf.categoryIntro}
                                </p>
                                <FindingList items={requirementCards} />
                            </section>
                        )}
                        {pitfallCards.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold tracking-tight">
                                    {tf.categoryPitfallHeading}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {tf.categoryPitfallIntro}
                                </p>
                                <FindingList items={pitfallCards} />
                            </section>
                        )}
                    </>
                )}

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {tc.allRoundsHeading(categoryLabel)}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {tc.allRoundsIntro(entries.length, categoryLabel)}
                    </p>
                    <div className="grid gap-5 sm:gap-6 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                        {entries.map((entry) => (
                            <Link
                                key={entry.round}
                                href={`/cold-tests/${entry.round}`}
                                aria-label={t.openDetailLabel(entry.round)}
                                className="group block focus-visible:outline-none"
                            >
                                <Card className="flex h-full w-full flex-col overflow-hidden border-border/80 shadow-sm transition-all hover:border-primary-border hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
                                    <PreviewThumb
                                        slug={entry.slug}
                                        desktopAvailable={entry.shots.desktop}
                                        enDesktopAvailable={entry.shots["en.desktop"]}
                                        title={entry.title}
                                        unavailableLabel={t.previewUnavailable}
                                    />
                                    <CardContent className="flex flex-1 flex-col gap-2 p-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <Badge
                                                variant="outline"
                                                className="border-border/60 text-[10px] uppercase tracking-wider text-muted-foreground"
                                            >
                                                {t.roundLabel(entry.round)}
                                            </Badge>
                                            <Badge
                                                variant="secondary"
                                                className="text-[10px]"
                                            >
                                                {t.scoreLabel(entry.score)}
                                            </Badge>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="inline-flex w-full items-start justify-between gap-2">
                                                <span className="line-clamp-2 text-sm font-semibold tracking-tight transition-colors group-hover:text-primary">
                                                    {entry.title}
                                                </span>
                                                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                                            </div>
                                            <div className="mt-1 text-xs text-muted-foreground">
                                                <code className="font-mono">{entry.route}</code>
                                            </div>
                                        </div>
                                        {entry.summary ? (
                                            <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
                                                {entry.summary}
                                            </p>
                                        ) : null}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="space-y-3">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {copy.leftHeading}
                    </h2>
                    <p className="leading-7 text-foreground">{copy.leftBody}</p>
                </section>

                <div className="border-t border-border/60 pt-6 text-sm">
                    <Link
                        href="/cold-tests"
                        className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        {tc.backToGallery}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </article>
        </div>
    );
}
