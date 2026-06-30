import type { Metadata } from "next";
import { notFound } from "next/navigation";
import categories from "@/data/cold-test-categories.json";
import gallery from "@/data/cold-test-gallery.json";
import { CategoryView } from "./CategoryView";

interface CategoryCopy {
    title: string;
    description: string;
    challengeHeading: string;
    challengeBody: string;
    discoveredHeading: string;
    discoveredIntro: string;
    discoveredFooter: string;
    leftHeading: string;
    leftBody: string;
}

interface DiscoveredComponent {
    name: string;
    slug: string;
    round: number;
    blurbJa: string;
    blurbEn: string;
}

interface PublishedCategory {
    slug: string;
    jaCategory: string;
    copy: { ja: CategoryCopy; en: CategoryCopy };
    discoveredComponents: DiscoveredComponent[];
}

interface CategoriesShape {
    slugMap: Record<string, string>;
    published: PublishedCategory[];
}

interface GalleryShape {
    count: number;
    entries: { round: number; category: string }[];
}

const data = categories as CategoriesShape;
const galleryData = gallery as GalleryShape;
const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gunjo.jp"
).replace(/\/$/, "");

function findPublished(slug: string): PublishedCategory | undefined {
    return data.published.find((c) => c.slug === slug);
}

export function generateStaticParams() {
    return data.published.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const category = findPublished(slug);
    if (!category) return {};
    const url = `${SITE_URL}/cold-tests/categories/${slug}`;
    const { title, description } = category.copy.ja;
    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: "article",
            siteName: "GunjoUI",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const category = findPublished(slug);
    if (!category) notFound();

    const rounds = galleryData.entries
        .filter((e) => e.category === category.jaCategory)
        .map((e) => e.round)
        .sort((a, b) => a - b);

    const url = `${SITE_URL}/cold-tests/categories/${slug}`;
    const { title, description } = category.copy.ja;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: title,
        description,
        url,
        inLanguage: "ja",
        isPartOf: {
            "@type": "WebSite",
            name: "GunjoUI",
            url: SITE_URL,
        },
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: rounds.length,
            itemListElement: rounds.map((round, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                url: `${SITE_URL}/cold-tests/${round}`,
            })),
        },
        publisher: {
            "@type": "Organization",
            name: "UIXHERO",
            url: "https://www.uixhero.com",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryView slug={slug} />
        </>
    );
}
