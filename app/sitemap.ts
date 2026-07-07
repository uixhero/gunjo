import type { MetadataRoute } from "next";
import { navigation } from "@/lib/navigation";
import { PATTERNS, isPublicPatternSlug } from "@/lib/patterns";
import coldTestGallery from "@/data/cold-test-gallery.json";
import coldTestCategories from "@/data/cold-test-categories.json";

interface ColdTestGalleryShape {
    entries: { round: number }[];
}

interface ColdTestCategoriesShape {
    published: { slug: string }[];
}

const BASE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gunjo.jp"
).replace(/\/$/, "");

/** Recursively collect internal page paths (href starting with "/") from a nav tree. */
function collectPaths(node: unknown, acc: Set<string>): void {
    if (Array.isArray(node)) {
        for (const item of node) collectPaths(item, acc);
        return;
    }
    if (node && typeof node === "object") {
        const record = node as Record<string, unknown>;
        const href = record.href;
        if (typeof href === "string" && href.startsWith("/") && !href.includes("#")) {
            acc.add(href);
        }
        for (const value of Object.values(record)) collectPaths(value, acc);
    }
}

export default function sitemap(): MetadataRoute.Sitemap {
    const paths = new Set<string>([
        "/",
        "/showcase",
        "/patterns",
        "/cold-tests",
        "/cold-tests/why",
        "/pack",
        "/privacy",
    ]);
    collectPaths(navigation, paths);

    // Public pattern routes only (mirrors production visibility); skip the 404 demo.
    for (const pattern of PATTERNS) {
        if (!isPublicPatternSlug(pattern.slug) || pattern.slug === "not-found") continue;
        for (const route of pattern.routes) {
            if (route.href.startsWith("/")) paths.add(route.href);
        }
    }

    // Per-round cold-test detail pages — each is a distinct article with its
    // own metadata. Without these, Google would only know about the grid.
    for (const entry of (coldTestGallery as ColdTestGalleryShape).entries) {
        paths.add(`/cold-tests/${entry.round}`);
    }

    // Industry door pages — only the categories that have hand-written copy
    // (cold-test-categories.json `published[]`) are listed. Slugs with only a
    // slugMap entry but no published copy 404 by design, so they don't surface
    // as thin content in Search Console.
    for (const cat of (coldTestCategories as ColdTestCategoriesShape).published) {
        paths.add(`/cold-tests/categories/${cat.slug}`);
    }

    const lastModified = new Date();
    return [...paths].map((path) => ({
        url: path === "/" ? BASE_URL : `${BASE_URL}${path}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: path === "/" ? 1 : 0.7,
    }));
}
