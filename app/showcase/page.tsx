"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
    IconArrowUpRight as ArrowUpRight,
    IconLayoutGrid as LayoutGrid,
} from "@tabler/icons-react";
import {
    Badge,
    SearchInput,
    Card,
    CardContent,
    Tabs,
    TabsList,
    TabsTrigger,
    Skeleton,
    cn,
} from "@gunjo/ui";
import { navigation } from "@/lib/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";

function PreviewThumb({
    slug,
    title,
    unavailableLabel,
}: {
    slug: string;
    title: string;
    unavailableLabel: string;
}) {
    const imgRef = React.useRef<HTMLImageElement | null>(null);
    const [loaded, setLoaded] = React.useState(false);
    const [errored, setErrored] = React.useState(false);
    // next-themes returns undefined until the provider mounts on the
    // client, so guard with a mounted flag and default to dark before
    // hydration (matches the docs site's pre-hydration look).
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    const { resolvedTheme } = useTheme();
    const mode: "light" | "dark" =
        mounted && resolvedTheme === "light" ? "light" : "dark";
    const src = `/showcase-thumbs/${slug}.${mode}.png`;

    // If the image was already in the browser cache by the time the component
    // mounts, the native onLoad event has already fired and React would never
    // flip `loaded` to true. Sync from img.complete on mount to cover that case.
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
        <div className="relative block h-44 overflow-hidden border-b border-border/60 bg-muted/40 p-3">
            {!loaded && !errored && (
                <Skeleton className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] rounded-md" />
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
                    onError={() => setErrored(true)}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                        "h-full w-full rounded-md object-cover object-top shadow-sm transition-opacity duration-200",
                        loaded ? "opacity-100" : "opacity-0"
                    )}
                />
            )}
        </div>
    );
}

type Category =
    | "Inputs"
    | "Display"
    | "Charts"
    | "Feedback"
    | "Navigation"
    | "Overlay"
    | "Layout";

const CATEGORY_ORDER: Category[] = [
    "Inputs",
    "Display",
    "Charts",
    "Feedback",
    "Navigation",
    "Overlay",
    "Layout",
];

const VALID_CATEGORIES = new Set<string>(CATEGORY_ORDER);

interface ShowcaseEntry {
    category: Category;
    slug: string;
    title: string;
    docsHref: string;
}

function buildEntries(): ShowcaseEntry[] {
    const entries: ShowcaseEntry[] = [];
    for (const section of navigation) {
        if (!VALID_CATEGORIES.has(section.title)) continue;
        const category = section.title as Category;
        for (const item of section.items) {
            // Component pages live under /docs/components/<slug>; skip any
            // external pattern-app links (which navigation also includes).
            if (!item.href.startsWith("/docs/components/")) continue;
            // Category overview pages (e.g. "Inputs Overview") are sidebar
            // landing pages, not individual components — keep them out of the
            // component grid (they also have no single demo to preview).
            if (item.title.endsWith("Overview")) continue;
            const parts = item.href.split("/").filter(Boolean);
            const slug = parts[parts.length - 1];
            entries.push({
                category,
                slug,
                title: item.title,
                docsHref: item.href,
            });
        }
    }
    entries.sort((a, b) => a.title.localeCompare(b.title));
    return entries;
}

export default function ShowcasePage() {
    const allEntries = React.useMemo(buildEntries, []);
    const [activeCategory, setActiveCategory] = React.useState<Category | "all">(
        "all"
    );
    const [query, setQuery] = React.useState("");
    const { pages, bilingual } = useLocale();
    const t = pages.showcase;

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        return allEntries.filter((entry) => {
            if (activeCategory !== "all" && entry.category !== activeCategory)
                return false;
            if (!q) return true;
            const title = bilingual(entry.title);
            const category = bilingual(entry.category);
            return (
                entry.title.toLowerCase().includes(q) ||
                title.primary.toLowerCase().includes(q) ||
                title.secondary.toLowerCase().includes(q) ||
                category.primary.toLowerCase().includes(q) ||
                category.secondary.toLowerCase().includes(q) ||
                entry.slug.includes(q)
            );
        });
    }, [allEntries, activeCategory, bilingual, query]);

    const counts = React.useMemo(() => {
        const acc: Record<string, number> = { all: allEntries.length };
        for (const c of CATEGORY_ORDER) {
            acc[c] = allEntries.filter((e) => e.category === c).length;
        }
        return acc;
    }, [allEntries]);

    return (
        <div className="space-y-10">
            {/* Heading */}
            <header className="space-y-4">
                <div className="flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {t.label}
                    </span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                    {t.heading}
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                    {t.subtitle(allEntries.length)}
                </p>
            </header>

            {/* Filters */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Horizontally scrollable tab strip — gracefully handles
                   narrow viewports without clipping or wrapping awkwardly. */}
                <Tabs
                    value={activeCategory}
                    onValueChange={(v) => setActiveCategory(v as Category | "all")}
                    className="w-auto min-w-0 max-w-full rounded-none border-0"
                >
                    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <TabsList className="h-9 w-max justify-start">
                            <TabsTrigger
                                value="all"
                                className="data-[state=active]:border data-[state=active]:border-primary-border data-[state=active]:text-primary data-[state=active]:shadow-md"
                            >
                                {t.allTab}
                                <span className="ml-1.5 text-xs text-muted-foreground data-[state=active]:text-primary-strong">
                                    {counts.all}
                                </span>
                            </TabsTrigger>
                            {CATEGORY_ORDER.map((c) => (
                                <TabsTrigger
                                    key={c}
                                    value={c}
                                    className="data-[state=active]:border data-[state=active]:border-primary-border data-[state=active]:text-primary data-[state=active]:shadow-md"
                                >
                                    {bilingual(c).primary}
                                    <span className="ml-1.5 text-xs text-muted-foreground">
                                        {counts[c]}
                                    </span>
                                </TabsTrigger>
                            ))}
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

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/60 py-20 text-center text-muted-foreground">
                    {t.emptyState}
                </div>
            ) : (
                // auto-fill + minmax(280px, 1fr) reflows smoothly as the
                // viewport shrinks: cards grow with available space within a
                // column count, then drop a column only when the next one no
                // longer fits at 280px. Avoids the 160-200px width jump that
                // fixed breakpoint columns cause at thresholds.
                <div className="grid gap-5 sm:gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
                    {filtered.map((entry) => {
                        const title = bilingual(entry.title);
                        const category = bilingual(entry.category);
                        const showSecondary =
                            title.secondary && title.secondary !== title.primary;

                        return (
                            <Link
                                key={`${entry.category}/${entry.slug}`}
                                href={entry.docsHref}
                                className="group block focus-visible:outline-none"
                                aria-label={t.openDocsLabel(title.primary)}
                            >
                                <Card className="flex h-full w-full flex-col overflow-hidden border-border/80 shadow-sm transition-all hover:border-primary-border hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
                                    <PreviewThumb
                                        slug={entry.slug}
                                        title={title.primary}
                                        unavailableLabel={t.previewUnavailable}
                                    />
                                    <CardContent className="flex flex-1 flex-col gap-2 p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="inline-flex min-w-0 items-center gap-1 font-semibold tracking-tight transition-colors group-hover:text-primary">
                                                <span className="min-w-0">
                                                    <span className="block truncate">
                                                        {title.primary}
                                                    </span>
                                                    {showSecondary ? (
                                                        <span className="mt-0.5 block truncate text-xs font-medium text-muted-foreground">
                                                            {title.secondary}
                                                        </span>
                                                    ) : null}
                                                </span>
                                                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="shrink-0 border-border/60 text-[10px] uppercase tracking-wider text-muted-foreground"
                                            >
                                                {category.primary}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
