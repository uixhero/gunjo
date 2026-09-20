// `/docs/**`・`/patterns/**`・`/showcase` のルート一覧を app/ から数え上げる。
// ページごとの題・説明文・canonical を出す層（app/lib/seo）と、その検査
// （design-verify-seo-metadata.mjs）が同じ一覧を見るための共有部品。
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("..", import.meta.url));

/** 走査する面。ここに無い面（/cold-tests・/en など）は各ページが自前で metadata を出す。 */
export const SEO_SECTIONS = ["docs", "patterns", "showcase"];

/** 中身が `redirect()` だけのページ。転送されるので題も canonical も要らない。 */
export function isRedirectOnlyPage(source) {
    return /\bredirect\(\s*["'`]/.test(source) && !source.includes("<");
}

/** 動的セグメント（`[slug]` など）は一覧に出さない＝ページ側で generateMetadata を書く。 */
function isDynamicSegment(name) {
    return name.startsWith("[");
}

/** ルートグループ（`(index)` など）。URL には出ないので、段を増やさずに中を見る。 */
export function isRouteGroup(name) {
    return name.startsWith("(") && name.endsWith(")");
}

function walk(dir, url, acc) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
        if (isDynamicSegment(entry.name)) continue;
        const childDir = join(dir, entry.name);
        const childUrl = isRouteGroup(entry.name) ? url : `${url}/${entry.name}`;
        const pagePath = join(childDir, "page.tsx");
        if (existsSync(pagePath)) {
            acc.push({
                path: childUrl,
                dir: childDir,
                redirectOnly: isRedirectOnlyPage(readFileSync(pagePath, "utf8")),
            });
        }
        walk(childDir, childUrl, acc);
    }
}

/** 対象の全ページ。`redirectOnly` は転送だけのページ。 */
export function listSeoRoutes(root = ROOT) {
    const acc = [];
    for (const section of SEO_SECTIONS) {
        const dir = join(root, "app", section);
        if (!existsSync(dir)) continue;
        const pagePath = join(dir, "page.tsx");
        if (existsSync(pagePath)) {
            acc.push({
                path: `/${section}`,
                dir,
                redirectOnly: isRedirectOnlyPage(readFileSync(pagePath, "utf8")),
            });
        }
        walk(dir, `/${section}`, acc);
    }
    acc.sort((a, b) => a.path.localeCompare(b.path));
    return acc;
}

/** 題と説明文を出すべきページ（転送だけのページを除いたもの）。 */
export function listMetadataRoutes(root = ROOT) {
    return listSeoRoutes(root).filter((route) => !route.redirectOnly);
}

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
