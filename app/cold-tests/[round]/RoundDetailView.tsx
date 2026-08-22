"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    IconArrowUpRight as ArrowUpRight,
    IconAlertCircle as AlertCircle,
} from "@tabler/icons-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
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
    MediaLightbox,
    TextLink,
    cn,
} from "@gunjo/ui";
import type { AssetCardAsset } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { PackCta } from "@/components/pack/PackCta";
import { LocalNav } from "@/components/layout/TableOfContents";
import {
    EN_COLD_TEST_BASE,
    JA_COLD_TEST_BASE,
    coldTestBaseFor,
} from "@/lib/cold-test-paths";
import {
    UNRESOLVED_ARTICLE_HREF,
    coldTestRoundHref,
    roundRefFromLinkText,
} from "@/lib/cold-test-article-links";
import type { Finding } from "@/lib/cold-test-findings";
import { FindingList, type FindingCardModel } from "../FindingList";
import categoriesData from "@/data/cold-test-categories.json";

const CATEGORY_SLUG_MAP = (categoriesData as { slugMap: Record<string, string> })
    .slugMap;

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

// Rewrite the article markdown's image references at render time so we
// don't have to re-snapshot 170 round JSON files every time.
//   - `assets/gunjo-*.png` lived in promotion/assets/ (gitignored), so the
//     bare path 404s in production. The matching desktop preview is already
//     committed under /cold-test-shots/<slug>.desktop.webp; reuse it.
//   - `placeholder: ...` is a literal placeholder from early drafts (#01)
//     that was never replaced with a real image. Return null to drop it
//     entirely rather than render a broken image.
function rewriteArticleImageSrc(src: string | undefined, slug: string): string | null {
    if (!src) return null;
    if (src.startsWith("placeholder:")) return null;
    if (/^assets\/gunjo-/.test(src)) {
        return `/cold-test-shots/${slug}.desktop.webp`;
    }
    return src;
}

// The visible label of a markdown link, flattened. `[**#12** データテーブル](#)`
// arrives as a mix of strings and elements, and the round number can sit
// inside the emphasis.
function linkLabelText(node: React.ReactNode): string {
    if (node === null || node === undefined || typeof node === "boolean") return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(linkLabelText).join("");
    if (React.isValidElement(node)) {
        return linkLabelText((node.props as { children?: React.ReactNode }).children);
    }
    return "";
}

// Names of components we publicly document at /docs/components/<slug>.
function docSlugFor(componentName: string): string {
    return componentName
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
        .toLowerCase();
}

// The findings JSON is Japanese for now, so only the Japanese page passes any.
// See app/data/cold-test-findings/README.md.
function toFindingCard(finding: Finding): FindingCardModel {
    return {
        id: finding.id,
        kind: finding.kind,
        status: finding.status,
        phenomenon: finding.phenomenon,
        screen: finding.where.screen,
        spot: finding.where.spot,
        cause: finding.cause,
        selfCheck: finding.selfCheck,
        links: finding.links,
        // Only the *other* rounds that hit the same thing — a round page
        // linking to itself is noise.
        rounds: finding.where.alsoRounds ?? [],
    };
}

export function RoundDetailView({
    detail,
    previous,
    next,
    translationHref,
    roundIndex,
    findings = [],
}: {
    detail: RoundDetail;
    previous: PagerNeighbour | null;
    next: PagerNeighbour | null;
    /**
     * The same round in the other language. Present on a Japanese round once a
     * reviewed English translation exists, and always present on an English
     * round (the Japanese original is the source and never goes away).
     */
    translationHref?: string;
    /**
     * Which rounds actually have a page, per language. Used to resolve the
     * `[#12](#)` citations in the article body — a reference to a round that
     * was never published stays plain text instead of becoming a 404.
     */
    roundIndex: { ja: number[]; en: number[] };
    /**
     * What this round found, from `app/data/cold-test-findings/<round>.json`.
     * Empty (and the block is skipped) for a round with no findings file, and
     * on the English tree, which has no translated findings yet.
     */
    findings?: Finding[];
}) {
    const { pages } = useLocale();
    const t = pages.coldTests;
    const td = t.detail;
    const tf = t.findings;

    const requirementCards = React.useMemo(
        () => findings.filter((f) => f.kind === "requirement").map(toFindingCard),
        [findings]
    );
    const pitfallCards = React.useMemo(
        () => findings.filter((f) => f.kind === "pitfall").map(toFindingCard),
        [findings]
    );
    const pathname = usePathname();
    const base = coldTestBaseFor(pathname);
    const isEnglish = base === EN_COLD_TEST_BASE;

    const roundLookup = React.useMemo(
        () => ({ ja: new Set(roundIndex.ja), en: new Set(roundIndex.en) }),
        [roundIndex.ja, roundIndex.en]
    );

    // Article links whose href is a bare `#` are unresolved round citations
    // left in the source markdown (issue #726). Resolve them against the
    // rounds that exist; anything else keeps the renderer's default anchor.
    const articleComponents = React.useMemo(
        () => ({
            // Only the attributes a markdown link can carry are forwarded.
            // react-markdown also hands every component the mdast `node`
            // (passNode), which is not a DOM attribute — spreading the rest
            // would put it on the anchor.
            a: ({ href, title, children }: React.ComponentPropsWithoutRef<"a">) => {
                if (href !== UNRESOLVED_ARTICLE_HREF) {
                    return (
                        <TextLink href={href} title={title}>
                            {children}
                        </TextLink>
                    );
                }
                const round = roundRefFromLinkText(linkLabelText(children));
                const resolved =
                    round === null ? null : coldTestRoundHref(round, base, roundLookup);
                if (!resolved) {
                    // No page to point at — a round that was never published
                    // (94 / 99 / 100), or a label that is not a round
                    // reference at all (the "まとめ記事" placeholders from the
                    // first 27 rounds, whose destination is still undecided).
                    // Render the label as text rather than a dead anchor.
                    return <>{children}</>;
                }
                const crossesToJapanese =
                    isEnglish && resolved.startsWith(`${JA_COLD_TEST_BASE}/`);
                return (
                    <TextLink
                        href={resolved}
                        title={title}
                        hrefLang={crossesToJapanese ? "ja" : undefined}
                    >
                        {children}
                    </TextLink>
                );
            },
            img: ({ src, alt, title }: React.ComponentPropsWithoutRef<"img">) => {
                const fixed = rewriteArticleImageSrc(
                    typeof src === "string" ? src : undefined,
                    detail.slug
                );
                if (!fixed) return null;
                return (
                    /* eslint-disable-next-line @next/next/no-img-element -- article images come from arbitrary cold-test material, not the optimized pipeline */
                    <img
                        src={fixed}
                        alt={alt ?? ""}
                        title={title}
                        loading="lazy"
                        decoding="async"
                    />
                );
            },
        }),
        [base, roundLookup, isEnglish, detail.slug]
    );

    // Inline preview uses the .lg tier (retina-sharp at the detail page's
    // display width); the lightbox opens .full (cwebp of the original
    // 2880px/750px capture) so readers can pixel-peep.
    const desktopInlineSrc = detail.shots.desktop
        ? `/cold-test-shots/${detail.slug}.desktop.lg.webp`
        : null;
    const mobileInlineSrc = detail.shots.mobile
        ? `/cold-test-shots/${detail.slug}.mobile.lg.webp`
        : null;

    // Lightbox assets — desktop first, mobile second. Indices line up with
    // the order of the inline previews so prev/next inside the lightbox
    // toggles between viewports of the same round.
    const lightboxAssets: AssetCardAsset[] = React.useMemo(() => {
        const list: AssetCardAsset[] = [];
        if (detail.shots.desktop) {
            list.push({
                id: `${detail.round}-desktop`,
                title: `${detail.title} — ${td.desktopPreview}`,
                src: `/cold-test-shots/${detail.slug}.desktop.full.webp`,
                alt: `${detail.title} desktop full preview`,
                type: "Desktop",
            });
        }
        if (detail.shots.mobile) {
            list.push({
                id: `${detail.round}-mobile`,
                title: `${detail.title} — ${td.mobilePreview}`,
                src: `/cold-test-shots/${detail.slug}.mobile.lg.webp`,
                alt: `${detail.title} mobile full preview`,
                type: "Mobile",
            });
        }
        return list;
    }, [
        detail.round,
        detail.slug,
        detail.title,
        detail.shots.desktop,
        detail.shots.mobile,
        td.desktopPreview,
        td.mobilePreview,
    ]);

    const [lightboxOpen, setLightboxOpen] = React.useState(false);
    const [lightboxIndex, setLightboxIndex] = React.useState(0);
    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };
    const currentAsset = lightboxAssets[lightboxIndex] ?? null;
    const hasPrevious = lightboxIndex > 0;
    const hasNext = lightboxIndex < lightboxAssets.length - 1;
    const desktopAssetIndex = lightboxAssets.findIndex((a) => a.id.endsWith("-desktop"));
    const mobileAssetIndex = lightboxAssets.findIndex((a) => a.id.endsWith("-mobile"));

    return (
        <article className="space-y-10">
            {/* Breadcrumb — replaces the previous plain "← back" link.
                See memory feedback-no-plain-text-back-link. */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={base}>{t.label}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            {/* Category crumb routes to the industry door page
                                once a slug is registered. The slugMap covers
                                all 20 categories; legacy ?cat= grid filter is
                                kept only as a fallback for an unknown name.
                                The door pages have no English version yet, so
                                the English tree always uses the filtered grid
                                rather than crossing back into Japanese. */}
                            <Link
                                href={
                                    !isEnglish && CATEGORY_SLUG_MAP[detail.category]
                                        ? `${base}/categories/${CATEGORY_SLUG_MAP[detail.category]}`
                                        : `${base}?cat=${encodeURIComponent(detail.category)}`
                                }
                            >
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
                {/* Cross-language link. Each label is written in the language it
                    leads to, so a reader who cannot read the current page can
                    still recognise the way out. */}
                {translationHref && (
                    <div>
                        <Link
                            href={translationHref}
                            hrefLang={isEnglish ? "ja" : "en"}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            {isEnglish ? "日本語で読む" : "Read this round in English"}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                )}
                {/* In-page section nav. Auto-discovers h2/h3 in the main column
                    (previews / 解説記事 / 使用部品 / cold AI が組み上げた実コード
                    + every h2/h3 inside the article markdown) and renders the
                    same "ページ内" surface the docs pages use. */}
                <LocalNav />
            </header>

            {/* Previews — each is a button that opens the MediaLightbox with
                the corresponding full-resolution variant. */}
            {(desktopInlineSrc || mobileInlineSrc) && (
                <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                    {desktopInlineSrc && (
                        <figure className="space-y-2">
                            <figcaption className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                {td.desktopPreview}
                            </figcaption>
                            <button
                                type="button"
                                onClick={() => openLightbox(desktopAssetIndex)}
                                aria-label={td.openLightboxLabel(td.desktopPreview)}
                                className="group block w-full overflow-hidden rounded-md border border-border/60 bg-muted/40 transition-colors hover:border-primary-border focus-visible:border-primary-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={desktopInlineSrc}
                                    alt={`${detail.title} desktop preview`}
                                    /* Hero on the page — eager so the browser
                                       paints it without waiting for an
                                       intersection event; with h-auto and no
                                       intrinsic dimensions, lazy never fires
                                       (image has 0px height until loaded). */
                                    loading="eager"
                                    decoding="async"
                                    className="block h-auto w-full transition-transform group-hover:scale-[1.005]"
                                />
                            </button>
                        </figure>
                    )}
                    {mobileInlineSrc && (
                        <figure className="space-y-2">
                            <figcaption className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                {td.mobilePreview}
                            </figcaption>
                            {/* Cold-test mobile shots are full-page (often 4000-8000px tall).
                                Constrain the visual frame so the detail layout doesn't
                                stretch; overflow-y-auto lets readers scroll the long
                                page inside the phone-shaped surface. The lightbox opens
                                the same source unconstrained for pixel-peeping. */}
                            <button
                                type="button"
                                onClick={() => openLightbox(mobileAssetIndex)}
                                aria-label={td.openLightboxLabel(td.mobilePreview)}
                                className="group block max-h-[640px] w-full overflow-y-auto overflow-x-hidden rounded-md border border-border/60 bg-muted/40 transition-colors hover:border-primary-border focus-visible:border-primary-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={mobileInlineSrc}
                                    alt={`${detail.title} mobile preview`}
                                    loading="eager"
                                    decoding="async"
                                    className="block h-auto w-full"
                                />
                            </button>
                            <p className="text-xs text-muted-foreground">{td.mobilePreviewHint}</p>
                        </figure>
                    )}
                </section>
            )}

            {/* The screenshots stay in Japanese on the English pages too. Each
                round is a real screen for a real Japanese industry, and a
                translated capture would be a rebuilt screen rather than the one
                the agent actually produced. */}
            {isEnglish && (desktopInlineSrc || mobileInlineSrc) && (
                <p className="-mt-6 text-xs leading-5 text-muted-foreground">
                    {td.screenshotLanguageNote}
                </p>
            )}

            <MediaLightbox
                open={lightboxOpen}
                onOpenChange={setLightboxOpen}
                asset={currentAsset}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
                onPrevious={() => hasPrevious && setLightboxIndex((i) => i - 1)}
                onNext={() => hasNext && setLightboxIndex((i) => i + 1)}
            />

            {/* What this round found. A summary of the article below, pulled
                out as data so the industry door page can aggregate the same
                items. Only rendered for rounds that have a findings file. */}
            {findings.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {tf.roundHeading}
                    </h2>
                    <p className="text-sm text-muted-foreground">{tf.roundIntro}</p>
                    {requirementCards.length > 0 && (
                        <div className="space-y-3" data-toc-skip>
                            <h3 className="text-sm font-semibold tracking-tight">
                                {tf.roundRequirementHeading}
                            </h3>
                            <FindingList items={requirementCards} />
                        </div>
                    )}
                    {pitfallCards.length > 0 && (
                        <div className="space-y-3" data-toc-skip>
                            <h3 className="text-sm font-semibold tracking-tight">
                                {tf.roundPitfallHeading}
                            </h3>
                            <FindingList items={pitfallCards} />
                        </div>
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
                            <MarkdownRenderer
                                content={detail.article.markdown}
                                components={articleComponents}
                            />
                        </CardContent>
                    </Card>
                    {/* WRITING-RULES §2: the gallery is the publication venue
                        for the series, so the AI-collaboration disclosure is
                        rendered once here instead of being pasted into all
                        170 article markdown files. */}
                    <p className="text-xs leading-5 text-muted-foreground">
                        {td.aiDisclosure}
                    </p>
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
                    <div className="space-y-3" data-toc-skip>
                        <p className="text-xs text-muted-foreground">{td.sourceCodeHint}</p>
                        {/* Accordion is the closed-by-default surface for source files.
                            `type="multiple"` lets the reader open more than one at a
                            time (useful when comparing page.tsx against a helper);
                            no defaultValue keeps every file folded on first paint, so
                            the long pages don't dominate the layout.

                            data-toc-skip on the wrapper tells the LocalNav above to
                            ignore the Accordion item headers (Radix renders each as
                            h3 — without this opt-out, the TOC would gain one entry
                            per file and drown out the real section list. */}
                        <Accordion
                            type="multiple"
                            className="overflow-hidden rounded-md border border-border/60"
                        >
                            {detail.code.map((file) => {
                                const lines = file.source.split("\n").length;
                                return (
                                    <AccordionItem
                                        key={file.file}
                                        value={file.file}
                                        className="border-b border-border/60 last:border-b-0"
                                    >
                                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                                            <span className="flex flex-wrap items-center gap-2 text-left">
                                                <code className="font-mono text-sm font-semibold">
                                                    {file.file}
                                                </code>
                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                    {file.language}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {td.sourceCodeFileLines(lines)}
                                                </span>
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-3 pb-3 pt-0">
                                            <CodeBlock
                                                code={file.source}
                                                language={file.language}
                                                showLineNumbers
                                                highlight
                                                copyable
                                            />
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
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

            <PackCta placement="coldtests_article" className="mt-4" />
        </article>
    );
}
