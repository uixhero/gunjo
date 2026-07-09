import type { Metadata } from "next";
import gallery from "@/data/cold-test-gallery.json";
import { ColdTestsClient } from "./ColdTestsClient";

const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gunjo.jp"
).replace(/\/$/, "");
const URL = `${SITE_URL}/cold-tests`;

interface GalleryShape {
    count: number;
    categories: string[];
}

const galleryData = gallery as GalleryShape;
// Counts come from the snapshot so the copy never goes stale as the series
// grows — the cold-test run keeps adding rounds. Never hard-code these.
const ROUND_COUNT = galleryData.count;
const CATEGORY_COUNT = galleryData.categories.length;

const TITLE = `コールドテストカタログ — 文脈ゼロ AI が組んだ ${ROUND_COUNT} 画面 | GunjoUI`;
const DESCRIPTION = `文脈ゼロの AI に gunjo/ui を実装させ続けて生まれた ${ROUND_COUNT} 画面の build-log。${CATEGORY_COUNT} の業種カテゴリ（運輸は toB/toC 両面で完走）を通り、3-confirm を経た新部品が結晶化していく過程を全公開。`;

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: URL },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: URL,
        type: "website",
        siteName: "GunjoUI",
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
    },
};

// CollectionPage schema describes the grid as an indexable catalog of items.
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: URL,
    inLanguage: "ja",
    mainEntity: {
        "@type": "ItemList",
        numberOfItems: ROUND_COUNT,
    },
    publisher: {
        "@type": "Organization",
        name: "UIXHERO",
        url: "https://www.uixhero.com",
    },
};

export default function ColdTestsPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ColdTestsClient />
        </>
    );
}
