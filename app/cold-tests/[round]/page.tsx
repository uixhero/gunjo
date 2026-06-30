import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import gallery from "@/data/cold-test-gallery.json";
import { ColdTestShell } from "./ColdTestShell";
import { RoundDetailView, type RoundDetail } from "./RoundDetailView";
import type { SidebarRound } from "./RoundsSidebar";

const ROUND_DIR = path.join(process.cwd(), "app", "data", "cold-test-rounds");

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

function readRound(round: number): RoundDetail | null {
    const file = path.join(ROUND_DIR, `${round}.json`);
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8")) as RoundDetail;
}

export default async function ColdTestRoundPage({
    params,
}: {
    params: Promise<{ round: string }>;
}) {
    const { round: roundStr } = await params;
    const round = parseInt(roundStr, 10);
    if (!Number.isFinite(round)) notFound();
    const detail = readRound(round);
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
            />
        </ColdTestShell>
    );
}
