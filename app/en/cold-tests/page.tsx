import * as React from "react";
import type { Metadata } from "next";
import gallery from "@/data/cold-test-gallery.json";
import { ColdTestsClient, type ColdTestEntry } from "@/cold-tests/ColdTestsClient";
import { listEnRounds, readEnRound } from "@/lib/cold-test-en";
import { translations } from "@/lib/translations";
import { EN_COLD_TEST_BASE, JA_COLD_TEST_BASE } from "@/lib/cold-test-paths";

const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gunjo.jp"
).replace(/\/$/, "");

interface GalleryShape {
    count: number;
    categories: string[];
    entries: ColdTestEntry[];
}

const galleryData = gallery as GalleryShape;
const t = translations.en.pages.coldTests;

const TITLE = "Cold tests in English — GunjoUI";
const DESCRIPTION =
    "Rounds from the GunjoUI cold-test series, translated into English. An AI that had never seen the design system was given only the public npm package and the docs, and asked to build a real screen for a real industry.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: {
        canonical: `${SITE_URL}${EN_COLD_TEST_BASE}`,
        languages: {
            en: `${SITE_URL}${EN_COLD_TEST_BASE}`,
            ja: `${SITE_URL}${JA_COLD_TEST_BASE}`,
            "x-default": `${SITE_URL}${JA_COLD_TEST_BASE}`,
        },
    },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}${EN_COLD_TEST_BASE}`,
        type: "website",
        siteName: "GunjoUI",
        locale: "en",
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/**
 * The English index lists only the rounds that have a publishable translation,
 * so it grows as translation batches land instead of showing English chrome
 * over Japanese cards. The Japanese gallery stays the complete record.
 */
export default function EnColdTestsPage() {
    const enRounds = new Set(listEnRounds());
    const entries: ColdTestEntry[] = galleryData.entries
        .filter((entry) => enRounds.has(entry.round))
        .map((entry) => {
            const en = readEnRound(entry.round);
            return en ? { ...entry, title: en.title, summary: en.summary } : entry;
        });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}${EN_COLD_TEST_BASE}`,
        inLanguage: "en",
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ColdTestsClient
                entries={entries}
                basePath={EN_COLD_TEST_BASE}
                heading={t.enIndex.heading}
                subtitle={t.enIndex.subtitle(entries.length, galleryData.count)}
                showWhyLink={false}
                secondaryLink={{
                    href: JA_COLD_TEST_BASE,
                    label: t.enIndex.jaGalleryLink,
                }}
            />
        </>
    );
}
