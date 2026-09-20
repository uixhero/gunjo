import type { MetadataRoute } from "next";
import { PATTERNS, isPublicPatternSlug } from "@/lib/patterns";
import coldTestGallery from "@/data/cold-test-gallery.json";
import coldTestCategories from "@/data/cold-test-categories.json";
import { listEnRounds } from "@/lib/cold-test-en";
import { publishableJaEntries } from "@/lib/cold-test-drafts";
import { EN_COLD_TEST_BASE } from "@/lib/cold-test-paths";
import { listServedAppRoutes } from "@/lib/seo/route-inventory";
import { isExcludedFromSitemap } from "@/lib/seo/sitemap-exclusions";

interface ColdTestGalleryShape {
    entries: { round: number }[];
}

interface ColdTestCategoriesShape {
    published: { slug: string }[];
}

const BASE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gunjo.jp"
).replace(/\/$/, "");

/**
 * 本番では 404 になるパターン（`SHOW_ALL_PATTERNS` が false のときに隠れるもの）。
 * ディレクトリを歩くだけでは「開発中のパターン」と分からないので、公開の可否は
 * `patterns.ts` の SSOT で判断する。
 */
function isHiddenPatternRoute(path: string): boolean {
    if (path !== "/patterns" && !path.startsWith("/patterns/")) return false;
    if (path === "/patterns") return false;
    const slug = path.split("/")[2];
    return PATTERNS.some((pattern) => pattern.slug === slug) && !isPublicPatternSlug(slug);
}

export default function sitemap(): MetadataRoute.Sitemap {
    // ⭐ 静的なページは `app/` を歩いて数え上げる（app/lib/seo/route-inventory.ts）。
    // 以前はここで docs の URL を左メニュー（navigation.ts）からだけ集めていたので、
    // メニューに載らないページ25件が抜けていた（issue #1016・2026-09-20 実測）。
    // ⛔ 手で URL を並べ直さないこと。増えたページは歩けば入る。
    const paths = new Set<string>();
    for (const route of listServedAppRoutes()) {
        if (isExcludedFromSitemap(route.path)) continue;
        if (isHiddenPatternRoute(route.path)) continue;
        paths.add(route.path);
    }

    // 動的セグメントのページは、ディレクトリではなく元データが URL を持つ。

    // コールドテストの回。下書き（cold-test-drafts.ts）は本番で 404 になるので
    // ここにも出さない。
    for (const entry of publishableJaEntries(
        (coldTestGallery as ColdTestGalleryShape).entries
    )) {
        paths.add(`/cold-tests/${entry.round}`);
    }

    // 業種の扉ページ。手で書いた文言がある業種（cold-test-categories.json の
    // `published[]`）だけ。slugMap にしか無い slug は設計どおり 404 になる。
    for (const cat of (coldTestCategories as ColdTestCategoriesShape).published) {
        paths.add(`/cold-tests/categories/${cat.slug}`);
    }

    // 英語のコールドテスト。本番では `status: "reviewed"` の回だけが出るので、
    // 下書きの訳はサイトマップにも出ない。
    const enRounds = listEnRounds();
    if (enRounds.length > 0) {
        paths.add(EN_COLD_TEST_BASE);
        for (const round of enRounds) {
            paths.add(`${EN_COLD_TEST_BASE}/${round}`);
        }
    }

    const lastModified = new Date();
    return [...paths].sort().map((path) => ({
        url: path === "/" ? BASE_URL : `${BASE_URL}${path}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: path === "/" ? 1 : 0.7,
    }));
}
