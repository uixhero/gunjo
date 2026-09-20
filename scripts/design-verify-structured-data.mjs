#!/usr/bin/env node
// 構造化データ（JSON-LD）の取りこぼしを見る。
//
// 見るのは7つ:
//   1. 対象の全ページに JSON-LD があり、ページの性質どおりの型になっているか
//   2. 型ごとの必須項目（Google のリッチリザルト テストが required とするもの）が
//      欠けていないか。空文字・null・undefined も欠けと見る
//   3. `url` が1段目の canonical と1文字違わないか
//   4. `name`／`headline` と `description` が1段目の題・説明文から導けるか
//      （＝<title> と JSON-LD がずれない）
//   5. パンくずが ホーム→…→自分 の順で、position が 1 から連番か
//   6. ルートごとの layout.tsx が `<StructuredData>` を、自分のパスで呼んでいるか。
//      子ページを持つルートは `(index)` のルートグループに入っているか
//      （入っていないと、その layout が子も囲む＝子のページに索引の node が付く）
//   7. コールドテストの回に、日付や評価（実在しない値）が紛れ込んでいないか
//
//   node scripts/design-verify-structured-data.mjs
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import {
    ROOT,
    hasChildRoutes,
    isRouteGroup,
    listMetadataRoutes,
    loadTsModule,
} from "./seo-routes.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

/**
 * 型ごとの必須項目。Google のリッチリザルト テスト／Schema Markup Validator が
 * 「これが無いと項目として成立しない」とするものを、この面で出す型のぶんだけ。
 */
const REQUIRED_BY_TYPE = {
    WebSite: ["name", "url"],
    CollectionPage: ["name", "description", "url"],
    WebPage: ["name", "description", "url"],
    TechArticle: ["headline", "description", "url", "author", "publisher"],
    Article: ["headline", "description", "url", "author", "publisher"],
    SoftwareSourceCode: ["name", "description", "url"],
    BreadcrumbList: ["itemListElement"],
};

/** ページの性質と型の対応。ここに書いた形以外が出たら落とす。 */
function expectedType(path) {
    if (path === "/showcase") return "CollectionPage";
    if (path === "/patterns") return "CollectionPage";
    if (path.startsWith("/patterns/")) {
        return path.split("/").filter(Boolean).length === 2 ? "CollectionPage" : "WebPage";
    }
    if (path === "/docs/components") return "CollectionPage";
    if (path.startsWith("/docs/components/")) return "SoftwareSourceCode";
    if (path.startsWith("/docs/")) return "TechArticle";
    return null;
}

/** 値が「ある」か。空文字・空配列・null・undefined は無いものとする。 */
function present(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
}

function checkRequired(errors, label, node) {
    const type = node["@type"];
    if (node["@context"] !== "https://schema.org") {
        errors.push(`${label}: @context が https://schema.org ではない`);
    }
    if (!type) {
        errors.push(`${label}: @type が無い`);
        return;
    }
    const required = REQUIRED_BY_TYPE[type];
    if (!required) {
        errors.push(`${label}: 想定していない @type (${type})`);
        return;
    }
    for (const key of required) {
        if (!present(node[key])) errors.push(`${label}: ${type}.${key} が空`);
    }
}

/** JSON にしたとき undefined が混ざっていないか（混ざると項目ごと消える）。 */
function checkSerializable(errors, label, node, serialize) {
    let text;
    try {
        text = serialize(node);
    } catch (error) {
        errors.push(`${label}: JSON にできない (${error.message})`);
        return;
    }
    if (text.includes("<")) errors.push(`${label}: < が escape されていない`);
    const walk = (value, keyPath) => {
        if (value === undefined) errors.push(`${label}: ${keyPath} が undefined`);
        else if (Array.isArray(value)) value.forEach((item, i) => walk(item, `${keyPath}[${i}]`));
        else if (value && typeof value === "object") {
            for (const [key, child] of Object.entries(value)) walk(child, `${keyPath}.${key}`);
        }
    };
    walk(node, "$");
}

function checkBreadcrumb(errors, label, node, pageUrl) {
    const items = node.itemListElement ?? [];
    if (items.length < 2) {
        errors.push(`${label}: パンくずの段が ${items.length} しかない`);
        return;
    }
    items.forEach((item, index) => {
        if (item["@type"] !== "ListItem") errors.push(`${label}: 段 ${index + 1} が ListItem ではない`);
        if (item.position !== index + 1) errors.push(`${label}: position が連番でない (${item.position})`);
        if (!present(item.name)) errors.push(`${label}: 段 ${index + 1} に name が無い`);
        if (typeof item.item !== "string" || !item.item.startsWith("http")) {
            errors.push(`${label}: 段 ${index + 1} の item が絶対 URL でない`);
        }
    });
    const last = items[items.length - 1];
    if (last?.item !== pageUrl) {
        errors.push(`${label}: パンくずの最後が自分の URL でない (${last?.item} != ${pageUrl})`);
    }
}

export function verifyStructuredData({ root = ROOT } = {}) {
    const seo = loadTsModule("app/lib/seo/structured-data.ts", root);
    const { resolvePageCopy, absoluteUrl } = loadTsModule("app/lib/seo/page-metadata.ts", root);
    const { pageStructuredData, serializeJsonLd, shortName, coldTestArticle } = seo;

    const errors = [];
    const routes = listMetadataRoutes(root);
    const typeCounts = {};

    for (const route of routes) {
        const nodes = pageStructuredData(route.path);
        if (nodes.length === 0) {
            errors.push(`${route.path}: JSON-LD が出ない`);
            continue;
        }
        const [main, ...rest] = nodes;
        const pageUrl = absoluteUrl(route.path);
        const want = expectedType(route.path);
        if (want && main["@type"] !== want) {
            errors.push(`${route.path}: @type が ${main["@type"]}（${want} のはず）`);
        }
        typeCounts[main["@type"]] = (typeCounts[main["@type"]] ?? 0) + 1;

        checkRequired(errors, route.path, main);
        checkSerializable(errors, route.path, main, serializeJsonLd);
        if (main.url !== pageUrl) {
            errors.push(`${route.path}: url が canonical と違う (${main.url})`);
        }

        // 1段目の題・説明文と一致しているか＝<title> と JSON-LD がずれない。
        const copy = resolvePageCopy(route.path);
        if (!copy) {
            errors.push(`${route.path}: 1段目の題・説明文が引けない`);
        } else {
            const name = main.name ?? main.headline;
            if (name !== shortName(copy.title)) {
                errors.push(`${route.path}: name/headline が題と合わない (${name})`);
            }
            if (main.description !== copy.description) {
                errors.push(`${route.path}: description が1段目と合わない`);
            }
        }

        const crumbs = rest.find((node) => node["@type"] === "BreadcrumbList");
        if (!crumbs) {
            errors.push(`${route.path}: BreadcrumbList が無い`);
        } else {
            checkRequired(errors, `${route.path} (breadcrumb)`, crumbs);
            checkSerializable(errors, `${route.path} (breadcrumb)`, crumbs, serializeJsonLd);
            checkBreadcrumb(errors, `${route.path} (breadcrumb)`, crumbs, pageUrl);
            typeCounts.BreadcrumbList = (typeCounts.BreadcrumbList ?? 0) + 1;
        }

        // 子ページを持つルートは `(index)` に入っていないと、索引の JSON-LD が
        // 子のページにも付く（PR 前に実際にそうなった）。
        if (!isRouteGroup(basename(route.dir)) && hasChildRoutes(route, routes)) {
            errors.push(
                `${route.path}: 子ページを持つのに (index) のルートグループに入っていない`
            );
        }

        // layout の取りこぼし。1段目の `pageMetadata(...)` と同じ作法で、
        // 自分のパスを文字列で持っているかを見る。
        const layout = join(route.dir, "layout.tsx");
        if (!existsSync(layout)) {
            errors.push(`${route.path}: layout.tsx が無い`);
        } else {
            const source = readFileSync(layout, "utf8");
            const call = `<StructuredData path=${JSON.stringify(route.path)} />`;
            if (!source.includes(call)) {
                errors.push(`${route.path}: layout.tsx が ${call} を呼んでいない`);
            }
        }
    }

    // コールドテストの回。⛔ 日付も評価も出さないので、混ざっていたら落とす。
    const roundDir = join(root, "app/data/cold-test-rounds");
    const forbidden = ["datePublished", "dateModified", "aggregateRating", "reviewRating"];
    let roundCount = 0;
    for (const name of readdirSync(roundDir)) {
        if (!/^\d+\.json$/.test(name)) continue;
        const detail = JSON.parse(readFileSync(join(roundDir, name), "utf8"));
        const path = `/cold-tests/${detail.round}`;
        const node = coldTestArticle({
            path,
            headline: `#${detail.round} ${detail.title}`,
            description: detail.summary,
            section: detail.category,
            imageUrl: detail.shots?.desktop
                ? `${absoluteUrl("/")}/cold-test-shots/${detail.slug}.desktop.lg.webp`
                : undefined,
        });
        checkRequired(errors, path, node);
        checkSerializable(errors, path, node, serializeJsonLd);
        if (node.url !== absoluteUrl(path)) errors.push(`${path}: url が canonical と違う`);
        for (const key of forbidden) {
            if (key in node) errors.push(`${path}: ${key} は出さない決まり（実在しない値）`);
        }
        roundCount += 1;
    }

    if (errors.length === 0) {
        const summary = Object.entries(typeCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => `${type} ${count}`)
            .join(" / ");
        console.log(
            `[structured-data] ページ ${routes.length} 件 ＋ コールドテストの回 ${roundCount} 件 — ${summary}`
        );
        return;
    }
    throwLinesError([
        "design:verify: structured data (JSON-LD) is incomplete.",
        ...errors.slice(0, 50).map((line) => `- ${line}`),
        ...(errors.length > 50 ? [`- ...ほか ${errors.length - 50} 件`] : []),
        "Run `npm run design:sync:seo-layouts` and check app/lib/seo/structured-data.ts.",
    ]);
}

runVerificationCli({
    scriptName: "design-verify-structured-data.mjs",
    verify: verifyStructuredData,
    successMessage: "design:verify: structured data check passed",
});
