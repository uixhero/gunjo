import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import gallery from "@/data/cold-test-gallery.json";
import { RoundDetailView, type RoundDetail } from "./RoundDetailView";

const ROUND_DIR = path.join(process.cwd(), "app", "data", "cold-test-rounds");

interface GalleryShape {
    entries: { round: number }[];
}

export function generateStaticParams() {
    return (gallery as GalleryShape).entries.map((e) => ({
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
    return <RoundDetailView detail={detail} />;
}
