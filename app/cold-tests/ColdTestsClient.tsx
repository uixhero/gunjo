"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IconFlask as Flask, IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";
import {
    Badge,
    Card,
    CardContent,
    SearchInput,
    Tabs,
    TabsList,
    TabsTrigger,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import gallery from "@/data/cold-test-gallery.json";
import { PreviewThumb } from "./PreviewThumb";

interface ColdTestEntry {
    round: number;
    route: string;
    slug: string;
    score: string;
    category: string;
    title: string;
    readmeTitle: string;
    summary: string;
    article: { file: string; slug: string } | null;
    shots: {
        desktop: boolean;
        mobile: boolean;
        "en.desktop": boolean;
        "en.mobile": boolean;
    };
}

interface ColdTestGallery {
    count: number;
    categories: string[];
    entries: ColdTestEntry[];
}

const data = gallery as ColdTestGallery;

// Next.js requires useSearchParams() consumers to sit inside a Suspense
// boundary so the static prerender can bail out of the dynamic branch — wrap
// the grid component instead of marking the whole page dynamic.
export function ColdTestsClient() {
    return (
        <React.Suspense fallback={null}>
            <ColdTestsGrid />
        </React.Suspense>
    );
}

function ColdTestsGrid() {
    const { pages } = useLocale();
    const t = pages.coldTests;

    const entries = React.useMemo(() => data.entries, []);
    const categories = React.useMemo(() => data.categories, []);

    // `/cold-tests?cat=<category>` lands pre-filtered to that industry — the
    // detail page's breadcrumb routes here when you click the category crumb.
    // Treat unknown / missing values as "all" so a stale link from elsewhere
    // degrades to the full grid instead of an empty state.
    const searchParams = useSearchParams();
    const catParam = searchParams.get("cat");
    const initialCategory =
        catParam && categories.includes(catParam) ? catParam : "all";

    const [activeCategory, setActiveCategory] = React.useState<string>(initialCategory);
    const [query, setQuery] = React.useState("");

    // Keep state aligned if the URL changes after mount (Back/Forward,
    // in-app navigation from another category link).
    React.useEffect(() => {
        setActiveCategory(initialCategory);
    }, [initialCategory]);

    const counts = React.useMemo(() => {
        const acc: Record<string, number> = { all: entries.length };
        for (const c of categories) {
            acc[c] = entries.filter((e) => e.category === c).length;
        }
        return acc;
    }, [entries, categories]);

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        return entries.filter((e) => {
            if (activeCategory !== "all" && e.category !== activeCategory) return false;
            if (!q) return true;
            return (
                String(e.round).includes(q) ||
                e.route.toLowerCase().includes(q) ||
                e.slug.toLowerCase().includes(q) ||
                e.title.toLowerCase().includes(q) ||
                e.readmeTitle.toLowerCase().includes(q) ||
                e.category.toLowerCase().includes(q) ||
                (t.categories[e.category]?.toLowerCase().includes(q) ?? false)
            );
        });
    }, [entries, activeCategory, query, t.categories]);

    return (
        <div className="container space-y-10 py-10 md:py-12">
            <header className="space-y-4">
                <div className="flex items-center gap-2">
                    <Flask className="h-5 w-5 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {t.label}
                    </span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                    {t.heading}
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                    {t.subtitle(entries.length)}
                </p>
                <div>
                    <Link
                        href="/cold-tests/why"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        {t.whyLink}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </header>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <Tabs
                    value={activeCategory}
                    onValueChange={setActiveCategory}
                    className="w-auto min-w-0 max-w-full rounded-none border-0"
                >
                    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {/* sm:justify-start overrides TabsList's default sm:justify-center —
                            with 20 category tabs the strip overflows, and centering pushes
                            the first tab (often the active "All") off-screen to the left. */}
                        <TabsList className="h-9 w-max justify-start sm:justify-start">
                            <TabsTrigger
                                value="all"
                                className="data-[state=active]:border data-[state=active]:border-primary-border data-[state=active]:text-primary data-[state=active]:shadow-md"
                            >
                                {t.allTab}
                                <span className="ml-1.5 text-xs text-muted-foreground data-[state=active]:text-primary-strong">
                                    {counts.all}
                                </span>
                            </TabsTrigger>
                            {categories.map((c) => {
                                if (!counts[c]) return null;
                                return (
                                    <TabsTrigger
                                        key={c}
                                        value={c}
                                        className="data-[state=active]:border data-[state=active]:border-primary-border data-[state=active]:text-primary data-[state=active]:shadow-md"
                                    >
                                        {t.categories[c] ?? c}
                                        <span className="ml-1.5 text-xs text-muted-foreground">
                                            {counts[c]}
                                        </span>
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                    </div>
                </Tabs>
                <div className="w-full lg:w-72">
                    <SearchInput
                        placeholder={t.searchPlaceholder}
                        value={query}
                        onValueChange={setQuery}
                    />
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/60 py-20 text-center text-muted-foreground">
                    {t.emptyState}
                </div>
            ) : (
                <div className="grid gap-5 sm:gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
                    {filtered.map((entry) => (
                        <Link
                            key={entry.round}
                            href={`/cold-tests/${entry.round}`}
                            aria-label={t.openDetailLabel(entry.round)}
                            className="group block focus-visible:outline-none"
                        >
                            <Card
                                className="flex h-full w-full flex-col overflow-hidden border-border/80 shadow-sm transition-all hover:border-primary-border hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2"
                            >
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
                                            <span className="line-clamp-2 font-semibold tracking-tight transition-colors group-hover:text-primary">
                                                {entry.title}
                                            </span>
                                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            <code className="font-mono">{entry.route}</code>
                                            {" · "}
                                            {t.categories[entry.category] ?? entry.category}
                                        </div>
                                    </div>
                                    {entry.summary ? (
                                        <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                                            {entry.summary}
                                        </p>
                                    ) : null}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
