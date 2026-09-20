#!/usr/bin/env node
// `/docs/**`・`/patterns/**`・`/showcase` の題・説明文・canonical の取りこぼしを見る。
//
// 見るのは5つ:
//   1. 全ページに題と説明文があるか（元データ＋生成済みの写し）
//   2. 題がサイト既定（トップと同じ文言）のままのページが無いか
//   3. 題が重複していないか
//   4. ルートごとの layout.tsx が揃っていて、metadata を出しているか
//   5. 生成済みの写しが、元データで引ける分まで抱え込んでいないか（＝写しが古い）
//
//   node scripts/design-verify-seo-metadata.mjs
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, listMetadataRoutes, loadTsModule } from "./seo-routes.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

/** app/layout.tsx が出すサイト既定の題。ページ側がこれのままなら未設定と同じ。 */
const SITE_DEFAULT_TITLE = "GunjoUI — Becoming blue.";

export function verifySeoMetadata({ root = ROOT } = {}) {
    const { curatedCopy } = loadTsModule("app/lib/seo/curated-copy.ts", root);
    const generated = JSON.parse(
        readFileSync(join(root, "app/lib/seo/page-copy.generated.json"), "utf8")
    ).pages;

    const routes = listMetadataRoutes(root);
    const errors = [];
    const titles = new Map();

    for (const route of routes) {
        const curated = curatedCopy(route.path);
        const fallback = generated[route.path] ?? {};
        const title = curated.title ?? fallback.title ?? null;
        const description = curated.description ?? fallback.description ?? null;

        if (!title) errors.push(`${route.path}: no title resolved`);
        if (!description) errors.push(`${route.path}: no description resolved`);
        if (title === SITE_DEFAULT_TITLE) errors.push(`${route.path}: title is still the site default`);
        if (title) {
            if (!titles.has(title)) titles.set(title, []);
            titles.get(title).push(route.path);
        }

        if (curated.title && fallback.title) {
            errors.push(`${route.path}: title now exists in SSOT — drop it from page-copy.generated.json`);
        }
        if (curated.description && fallback.description) {
            errors.push(
                `${route.path}: description now exists in SSOT — drop it from page-copy.generated.json`
            );
        }

        const layout = join(route.dir, "layout.tsx");
        if (!existsSync(layout)) {
            errors.push(`${route.path}: missing layout.tsx`);
        } else {
            const source = readFileSync(layout, "utf8");
            if (!/\b(metadata|generateMetadata)\b/.test(source)) {
                errors.push(`${route.path}: layout.tsx exports no metadata`);
            }
            // 生成した layout は自分のパスを文字列で持つ。ディレクトリを
            // 動かしたのに中身が古いままだと canonical が別ページを指す。
            if (source.includes("pageMetadata(") && !source.includes(`pageMetadata(${JSON.stringify(route.path)})`)) {
                errors.push(`${route.path}: layout.tsx passes a different path to pageMetadata()`);
            }
        }
    }

    for (const [title, paths] of titles) {
        if (paths.length > 1) errors.push(`duplicate title ${JSON.stringify(title)}: ${paths.join(", ")}`);
    }

    const known = new Set(routes.map((route) => route.path));
    for (const path of Object.keys(generated)) {
        if (!known.has(path)) errors.push(`page-copy.generated.json has a stale route: ${path}`);
    }

    if (errors.length === 0) return;
    throwLinesError([
        "design:verify: per-page SEO metadata is incomplete.",
        ...errors.map((line) => `- ${line}`),
        "Run `npm run design:sync:seo-layouts`, and `npm run design:sync:seo-copy` against a production build.",
    ]);
}

runVerificationCli({
    scriptName: "design-verify-seo-metadata.mjs",
    verify: verifySeoMetadata,
    successMessage: "design:verify: per-page SEO metadata check passed",
});
