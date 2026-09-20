/**
 * `app/` にある「静的なページ」の一覧を、ディレクトリを歩いて数え上げる層。
 *
 * ⭐ ここが URL 一覧の SSOT です。サイトマップ（`app/sitemap.ts`）も、
 * 題・説明文・canonical の検査（`scripts/seo-routes.mjs` 経由）も、ここを見ます。
 * ⛔ URL の一覧を別の場所で書き直さないこと。
 *
 * なぜ手で書いた一覧や左メニュー（`navigation.ts`）ではないか: サイトマップは
 * docs の URL を左メニューからだけ集めていたので、メニューに載らないページ
 * （`/docs/components` の索引・テンプレート系の部品ページなど25件）が
 * ずっと抜けていました（issue #1016・2026-09-20 実測）。ページが増えた日に
 * 誰も気づけない集め方を、ディレクトリそのものに置き換えます。
 *
 * ⚠️ ここは「ビルド時にだけ」動きます（`app/sitemap.ts` は静的に前もって
 * 描かれる）。`app/lib/cold-test-en.ts` などと同じで、`process.cwd()` の下の
 * ソースを読みます。実行時には `app/` が無い環境があるので、リクエストごとに
 * 動く面からは呼ばないこと。
 *
 * 数えないもの:
 *   - 動的セグメント（`[slug]`）… URL は元データ側が持つ
 *   - ルートグループ（`(index)`）… URL には出ないので段を増やさず中を見る
 *   - `_` `.` で始まるディレクトリ、`api`
 *   - `redirect()` だけのページ … 転送先が本体（`redirectOnly: true` で返す）
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export interface AppRoute {
    /** `/docs/components/button` のような URL パス。 */
    path: string;
    /** そのページの `page.tsx` があるディレクトリ（絶対パス）。 */
    dir: string;
    /** 中身が `redirect()` だけ＝転送されるので、題も canonical もサイトマップも要らない。 */
    redirectOnly: boolean;
}

/** 中身が `redirect()` だけのページか。 */
export function isRedirectOnlyPage(source: string): boolean {
    return /\bredirect\(\s*["'`]/.test(source) && !source.includes("<");
}

/** 動的セグメント（`[slug]` など）。 */
export function isDynamicSegment(name: string): boolean {
    return name.startsWith("[");
}

/** ルートグループ（`(index)` など）。URL には出ない。 */
export function isRouteGroup(name: string): boolean {
    return name.startsWith("(") && name.endsWith(")");
}

const SKIP_DIRS = new Set(["api"]);

function walk(dir: string, url: string, acc: AppRoute[]): void {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
        if (SKIP_DIRS.has(entry.name)) continue;
        if (isDynamicSegment(entry.name)) continue;
        const childDir = join(dir, entry.name);
        const childUrl = isRouteGroup(entry.name) ? url : `${url}/${entry.name}`;
        const pagePath = join(childDir, "page.tsx");
        if (existsSync(pagePath)) {
            acc.push({
                path: childUrl || "/",
                dir: childDir,
                redirectOnly: isRedirectOnlyPage(readFileSync(pagePath, "utf8")),
            });
        }
        walk(childDir, childUrl, acc);
    }
}

/**
 * `app/` 以下の静的なページを全部。`root` はリポジトリの根（既定は
 * `process.cwd()`＝ビルドを回しているところ）。
 */
export function listAppRoutes(root: string = process.cwd()): AppRoute[] {
    const appDir = join(root, "app");
    const acc: AppRoute[] = [];
    // ルートグループ（`app/(home)`）の下にあるトップページも拾う。
    const rootPage = join(appDir, "page.tsx");
    if (existsSync(rootPage)) {
        acc.push({
            path: "/",
            dir: appDir,
            redirectOnly: isRedirectOnlyPage(readFileSync(rootPage, "utf8")),
        });
    }
    walk(appDir, "", acc);
    acc.sort((a, b) => a.path.localeCompare(b.path));
    return acc;
}

/** 転送だけのページを除いた、実体のあるページ。 */
export function listServedAppRoutes(root: string = process.cwd()): AppRoute[] {
    return listAppRoutes(root).filter((route) => !route.redirectOnly);
}
