// `/docs/**`・`/patterns/**`・`/showcase` のルート一覧を app/ から数え上げる。
// ページごとの題・説明文・canonical を出す層（app/lib/seo）と、その検査
// （design-verify-seo-metadata.mjs・design-verify-structured-data.mjs）が
// 同じ一覧を見るための共有部品。
//
// ⭐ 歩く仕事そのものは `app/lib/seo/route-inventory.ts` が持ちます
// （サイトマップと同じ SSOT）。ここはそれを SEO の対象面に絞るだけ。
import { existsSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("..", import.meta.url));

/** 走査する面。ここに無い面（/cold-tests・/en など）は各ページが自前で metadata を出す。 */
export const SEO_SECTIONS = ["docs", "patterns", "showcase"];

/**
 * curated-copy.ts など TS の元データを Node から読む。tsconfig の `paths`
 * （`@/` `@design/`）を jiti に教えるので、アプリと同じ解決になる。
 */
export function loadTsModule(relativePath, root = ROOT) {
    const require = createRequire(join(root, "scripts/seo-routes.mjs"));
    const jitiModule = require("jiti");
    const createJiti = jitiModule.createJiti ?? jitiModule.default ?? jitiModule;
    const jiti = createJiti(join(root, "scripts/seo-routes.mjs"), {
        alias: {
            "@": join(root, "app"),
            "@design": join(root, "design"),
            "@gunjo/ui": join(root, "src/index.ts"),
        },
        interopDefault: true,
    });
    return jiti(join(root, relativePath));
}

function inventory(root) {
    return loadTsModule("app/lib/seo/route-inventory.ts", root);
}

/** ルートグループ（`(index)` など）。URL には出ないので、段を増やさずに中を見る。 */
export function isRouteGroup(name) {
    return name.startsWith("(") && name.endsWith(")");
}

/** 中身が `redirect()` だけのページ。転送されるので題も canonical も要らない。 */
export function isRedirectOnlyPage(source) {
    return inventory(ROOT).isRedirectOnlyPage(source);
}

/** 対象の全ページ。`redirectOnly` は転送だけのページ。 */
export function listSeoRoutes(root = ROOT) {
    const prefixes = SEO_SECTIONS.map((section) => `/${section}`);
    return inventory(root)
        .listAppRoutes(root)
        .filter((route) =>
            prefixes.some(
                (prefix) => route.path === prefix || route.path.startsWith(`${prefix}/`)
            )
        );
}

/** 題と説明文を出すべきページ（転送だけのページを除いたもの）。 */
export function listMetadataRoutes(root = ROOT) {
    return listSeoRoutes(root).filter((route) => !route.redirectOnly);
}

/**
 * 対象の面の下にある全ディレクトリ。生成物の後片づけ（ルートでなくなった
 * ところに残った layout.tsx を消す）に使う。
 */
export function listSeoDirs(root = ROOT) {
    const acc = [];
    const walkDirs = (dir) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            if (!entry.isDirectory()) continue;
            if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
            const child = join(dir, entry.name);
            acc.push(child);
            walkDirs(child);
        }
    };
    for (const section of SEO_SECTIONS) {
        const dir = join(root, "app", section);
        if (!existsSync(dir)) continue;
        acc.push(dir);
        walkDirs(dir);
    }
    return acc;
}

/**
 * そのルートの下に別のルートがあるか（＝この layout が子ページも囲むか）。
 * 囲むなら、そこから構造化データを出すと子にも付いてしまうので、索引のページは
 * ルートグループ（`(index)`）に入れて、そこから出す。
 */
export function hasChildRoutes(route, routes) {
    return routes.some((other) => other.path !== route.path && other.path.startsWith(`${route.path}/`));
}
