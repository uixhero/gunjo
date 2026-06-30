import type { Metadata } from "next";
import { WhyView } from "./WhyView";

// Hard-coded JA copy in metadata — Google reads OG/twitter for share previews,
// and JA is the primary audience for this section. An EN swap can come later.
const TITLE =
    "なぜコールドテストするか — 文脈ゼロの AI に gunjo/ui を実装させ続けて見えたこと";
const DESCRIPTION =
    "公開 npm パッケージと gunjo.jp の docs だけを渡された AI が、170 ラウンドの実業種画面を組んでみせた記録。3-confirm で結晶化した 26 部品、業界の壁の薄さ、AI を正直者の検査装置として使う方法論。";
const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gunjo.jp"
).replace(/\/$/, "");
const URL = `${SITE_URL}/cold-tests/why`;

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: URL },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: URL,
        type: "article",
        siteName: "GunjoUI",
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
    },
};

// Article schema so search engines can read this as a methodology essay
// rather than just another page. headline/description match the metadata
// above; author/publisher are kept minimal — the site is the author here.
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    url: URL,
    inLanguage: "ja",
    publisher: {
        "@type": "Organization",
        name: "UIXHERO",
        url: "https://www.uixhero.com",
    },
    isPartOf: {
        "@type": "WebSite",
        name: "GunjoUI",
        url: SITE_URL,
    },
};

export default function ColdTestsWhyPage() {
    return (
        <>
            <script
                type="application/ld+json"
                // Serialise once on the server; safe content (no user input).
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <WhyView />
        </>
    );
}
