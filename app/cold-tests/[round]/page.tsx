import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import gallery from "@/data/cold-test-gallery.json";
import { ColdTestShell } from "./ColdTestShell";
import { RoundDetailView } from "./RoundDetailView";
import type { SidebarRound } from "./RoundsSidebar";
import { hasEnRound, readJaRound } from "@/lib/cold-test-en";
import { EN_COLD_TEST_BASE, JA_COLD_TEST_BASE } from "@/lib/cold-test-paths";

const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gunjo.jp"
).replace(/\/$/, "");

interface GalleryShape {
    entries: {
        round: number;
        title: string;
        score: string;
        category: string;
        slug: string;
        shots: { desktop: boolean };
    }[];
    categories: string[];
}

const galleryData = gallery as GalleryShape;

export function generateStaticParams() {
    return galleryData.entries.map((e) => ({
        round: String(e.round),
    }));
}

// Per-round metadata so Google can index each detail page individually
// instead of treating all 170 routes as the same title/description.
export async function generateMetadata({
    params,
}: {
    params: Promise<{ round: string }>;
}): Promise<Metadata> {
    const { round: roundStr } = await params;
    const round = parseInt(roundStr, 10);
    const detail = Number.isFinite(round) ? readJaRound(round) : null;
    if (!detail) return { title: "Round not found — GunjoUI cold tests" };
    const title = `#${detail.round} ${detail.title} — GunjoUI cold tests`;
    const description = detail.summary || detail.title;
    const url = `${SITE_URL}${JA_COLD_TEST_BASE}/${detail.round}`;
    const enUrl = hasEnRound(detail.round)
        ? `${SITE_URL}${EN_COLD_TEST_BASE}/${detail.round}`
        : null;
    const ogImage = detail.shots.desktop
        ? `${SITE_URL}/cold-test-shots/${detail.slug}.desktop.lg.webp`
        : undefined;
    return {
        title,
        description,
        alternates: {
            canonical: url,
            // Only advertise the English page once a translation is actually
            // publishable, so hreflang never points at a 404.
            languages: enUrl
                ? { ja: url, en: enUrl, "x-default": url }
                : undefined,
        },
        openGraph: {
            title,
            description,
            url,
            type: "article",
            siteName: "GunjoUI",
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

export default async function ColdTestRoundPage({
    params,
}: {
    params: Promise<{ round: string }>;
}) {
    const { round: roundStr } = await params;
    const round = parseInt(roundStr, 10);
    if (!Number.isFinite(round)) notFound();
    const detail = readJaRound(round);
    if (!detail) notFound();

    // Sidebar data: derive once from the full gallery (170 rounds).
    const sidebarRounds: SidebarRound[] = galleryData.entries.map((e) => ({
        round: e.round,
        title: e.title,
        score: e.score,
        category: e.category,
    }));
    const sidebarCategories = galleryData.categories.filter((c) =>
        galleryData.entries.some((e) => e.category === c)
    );

    // Prev / next neighbours, ordered by round number.
    const ordered = [...galleryData.entries].sort((a, b) => a.round - b.round);
    const idx = ordered.findIndex((e) => e.round === round);
    const prev = idx > 0 ? ordered[idx - 1] : null;
    const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;

    const toPagerItem = (
        entry: (typeof ordered)[number] | null
    ) =>
        entry
            ? {
                  round: entry.round,
                  href: `/cold-tests/${entry.round}`,
                  title: entry.title,
                  category: entry.category,
                  thumbnailSrc: entry.shots.desktop
                      ? `/cold-test-shots/${entry.slug}.desktop.webp`
                      : undefined,
              }
            : null;

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
                translationHref={
                    hasEnRound(round) ? `${EN_COLD_TEST_BASE}/${round}` : undefined
                }
            />
        </ColdTestShell>
    );
}
