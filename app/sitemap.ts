import type { MetadataRoute } from "next";
import { navigation } from "@/lib/navigation";
import { PATTERNS, isPublicPatternSlug } from "@/lib/patterns";

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
    const paths = new Set<string>(["/", "/showcase", "/patterns"]);
    collectPaths(navigation, paths);

    // Public pattern routes only (mirrors production visibility); skip the 404 demo.
    for (const pattern of PATTERNS) {
        if (!isPublicPatternSlug(pattern.slug) || pattern.slug === "not-found") continue;
        for (const route of pattern.routes) {
            if (route.href.startsWith("/")) paths.add(route.href);
        }
    }

    const lastModified = new Date();
    return [...paths].map((path) => ({
        url: path === "/" ? BASE_URL : `${BASE_URL}${path}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: path === "/" ? 1 : 0.7,
    }));
}
