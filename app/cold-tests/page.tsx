import type { Metadata } from "next";
import gallery from "@/data/cold-test-gallery.json";
import { ColdTestsClient } from "./ColdTestsClient";

const TITLE = "コールドテストカタログ — 文脈ゼロ AI が組んだ 170 画面 | GunjoUI";
const DESCRIPTION =
    "文脈ゼロの AI に gunjo/ui を実装させ続けて生まれた 170 画面の build-log。20 業種、運輸 5 モードを toB/toC 両面で完走し、3-confirm を通った新部品が結晶化した過程を全公開。";
const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gunjo.jp"
).replace(/\/$/, "");
const URL = `${SITE_URL}/cold-tests`;

interface GalleryShape {
    count: number;
}

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
// Total count is sourced from the snapshot so Google sees the same number
// users see on the page.
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: URL,
    inLanguage: "ja",
    mainEntity: {
        "@type": "ItemList",
        numberOfItems: (gallery as GalleryShape).count,
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
