/**
 * サイトマップに載せない URL。
 *
 * ⭐ 表の正は `design/policy/sitemap-exclusions.json`。`app/sitemap.ts`（出す側）と
 * `scripts/check-sitemap-coverage.mjs`（門番）が同じ表を見るので、片方だけ直して
 * ずれることがありません。
 *
 * ここに書くのは「ビルドが 200 で出すのに、あえて載せないもの」だけです。
 * 転送（307）や 404 になる URL は、そもそも実体が無いので自動で外れます。
 */
import policy from "@design/policy/sitemap-exclusions.json";

interface ExclusionRule {
    /** この接頭辞で始まる URL を全部外す。 */
    prefix?: string;
    /** この URL だけを外す。 */
    path?: string;
    reason: string;
    addedOn: string;
}

export const SITEMAP_EXCLUSIONS: ExclusionRule[] = (
    policy as { exclusions: ExclusionRule[] }
).exclusions;

/** サイトマップから外す URL か。 */
export function isExcludedFromSitemap(path: string): boolean {
    return SITEMAP_EXCLUSIONS.some(
        (rule) =>
            (rule.path !== undefined && rule.path === path) ||
            (rule.prefix !== undefined && path.startsWith(rule.prefix))
    );
}
