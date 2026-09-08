import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import gallery from "@/data/cold-test-gallery.json";
import { ColdTestShell } from "@/cold-tests/[round]/ColdTestShell";
import { RoundDetailView } from "@/cold-tests/[round]/RoundDetailView";
import type { SidebarRound } from "@/cold-tests/[round]/RoundsSidebar";
import { listEnRounds, readEnRound, readMergedEnRound } from "@/lib/cold-test-en";
import { EN_COLD_TEST_BASE, JA_COLD_TEST_BASE } from "@/lib/cold-test-paths";
import { citedRounds } from "@/lib/cold-test-article-links";
import { readCitedIssues } from "@/lib/github-issues";
import type { RoundRefCardData } from "@/components/cold-test/HashRefCard";

const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gunjo.jp"
).replace(/\/$/, "");

interface GalleryShape {
    entries: {
        round: number;
        slug: string;
        score: string;
        category: string;
        /** Japanese, and the fallback when a cited round has no translation. */
        title: string;
        shots: { desktop: boolean };
    }[];
    categories: string[];
}

const galleryData = gallery as GalleryShape;

// Only translated rounds get an English page. A round with no translation is
// simply absent from /en rather than rendered as English chrome wrapped around
// a Japanese write-up.
export function generateStaticParams() {
    return listEnRounds().map((round) => ({ round: String(round) }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ round: string }>;
}): Promise<Metadata> {
    const { round: roundStr } = await params;
    const round = parseInt(roundStr, 10);
    const detail = Number.isFinite(round) ? readMergedEnRound(round) : null;
    if (!detail) return { title: "Round not found — GunjoUI cold tests" };
    const title = `#${detail.round} ${detail.title} — GunjoUI cold tests`;
    const description = detail.summary || detail.title;
    const url = `${SITE_URL}${EN_COLD_TEST_BASE}/${detail.round}`;
    const jaUrl = `${SITE_URL}${JA_COLD_TEST_BASE}/${detail.round}`;
    const ogImage = detail.shots.desktop
        ? `${SITE_URL}/cold-test-shots/${detail.slug}.desktop.lg.webp`
        : undefined;
    return {
        title,
        description,
        alternates: {
            canonical: url,
            // The Japanese round is the original, so it stays x-default.
            languages: { en: url, ja: jaUrl, "x-default": jaUrl },
        },
        openGraph: {
            title,
            description,
            url,
            type: "article",
            siteName: "GunjoUI",
            locale: "en",
            images: ogImage ? [ogImage] : undefined,
        },
        twitter: {
            card: ogImage ? "summary_large_image" : "summary",
            title,
            description,
            images: ogImage ? [ogImage] : undefined,
        },
    };
}

export default async function EnColdTestRoundPage({
    params,
}: {
    params: Promise<{ round: string }>;
}) {
    const { round: roundStr } = await params;
    const round = parseInt(roundStr, 10);
    if (!Number.isFinite(round)) notFound();
    const detail = readMergedEnRound(round);
    if (!detail) notFound();

    // The sidebar and the pager stay inside the translated set, so every link
    // out of an English page lands on another English page.
    const enRounds = listEnRounds();
    const enTitles = new Map(
        enRounds.map((n) => [n, readEnRound(n)?.title ?? String(n)])
    );
    const galleryByRound = new Map(galleryData.entries.map((e) => [e.round, e]));

    const sidebarRounds: SidebarRound[] = enRounds.flatMap((n) => {
        const entry = galleryByRound.get(n);
        if (!entry) return [];
        return [
            {
                round: n,
                title: enTitles.get(n) ?? "",
                score: entry.score,
                category: entry.category,
            },
        ];
    });
    const sidebarCategories = galleryData.categories.filter((c) =>
        sidebarRounds.some((r) => r.category === c)
    );

    // Preview data for the `#NNN` citations in the article body. English
    // articles cite the same round numbers as the Japanese originals, so a
    // cited round is previewed with its English title when it has one and its
    // Japanese title otherwise — the same fallback the citation's href takes.
    const articleMarkdown = detail.article?.markdown ?? "";
    const roundCards: Record<number, RoundRefCardData> = {};
    for (const cited of citedRounds(articleMarkdown, {
        currentRound: round,
        rounds: new Set(galleryData.entries.map((e) => e.round)),
    })) {
        const entry = galleryByRound.get(cited);
        if (!entry) continue;
        roundCards[cited] = {
            round: cited,
            // `enTitles` fills untranslated rounds with the bare number, so the
            // translation is read directly rather than through that map.
            title: readEnRound(cited)?.title ?? entry.title,
            score: entry.score,
            category: entry.category,
            thumbnailSrc: entry.shots.desktop
                ? `/cold-test-shots/${entry.slug}.desktop.webp`
                : undefined,
        };
    }

    const idx = enRounds.indexOf(round);
    const prev = idx > 0 ? enRounds[idx - 1] : null;
    const next = idx >= 0 && idx < enRounds.length - 1 ? enRounds[idx + 1] : null;

    const toPagerItem = (n: number | null) => {
        if (n === null) return null;
        const entry = galleryByRound.get(n);
        if (!entry) return null;
        return {
            round: n,
            href: `${EN_COLD_TEST_BASE}/${n}`,
            title: enTitles.get(n) ?? "",
            category: entry.category,
            thumbnailSrc: entry.shots.desktop
                ? `/cold-test-shots/${entry.slug}.desktop.webp`
                : undefined,
        };
    };

    return (
        <ColdTestShell
            rounds={sidebarRounds}
            categories={sidebarCategories}
            current={round}
        >
            <RoundDetailView
                detail={detail}
                previous={toPagerItem(prev)}
                next={toPagerItem(next)}
                translationHref={`${JA_COLD_TEST_BASE}/${round}`}
                // English rounds cite the same round numbers as the Japanese
                // originals. A cited round that has no translation yet still
                // has a Japanese page, so both sets are passed and the
                // resolver falls back rather than dropping the citation.
                roundIndex={{
                    ja: galleryData.entries.map((e) => e.round),
                    en: enRounds,
                }}
                roundCards={roundCards}
                issueCards={readCitedIssues(articleMarkdown)}
            />
        </ColdTestShell>
    );
}
