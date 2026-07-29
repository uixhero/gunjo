import type { Metadata } from "next";
import gallery from "@/data/cold-test-gallery.json";
import { ColdTestsClient } from "./ColdTestsClient";
import { EN_COLD_TEST_BASE } from "@/lib/cold-test-paths";
import { listEnRounds } from "@/lib/cold-test-en";

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

const TITLE = `コールドテストカタログ：予備知識ゼロの AI が組んだ ${ROUND_COUNT} 画面 | GunjoUI`;
const DESCRIPTION = `予備知識ゼロの AI に gunjo/ui だけを渡して組ませた ${ROUND_COUNT} 画面の記録。${CATEGORY_COUNT} の業種カテゴリ（運輸は事業者向けの画面と利用者向けの画面の両方で完走）を通り、3回確認を経た新しいコンポーネントが群青に加わるまでを全公開。`;

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: {
        canonical: URL,
        // The Japanese gallery is the complete record, so it stays x-default
        // even though only part of it exists in English. The English grid is
        // only advertised once something has actually been translated into it.
        languages:
            listEnRounds().length > 0
                ? { ja: URL, en: `${SITE_URL}${EN_COLD_TEST_BASE}`, "x-default": URL }
                : undefined,
    },
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
