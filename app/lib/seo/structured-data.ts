/**
 * ページごとの構造化データ（JSON-LD）。
 *
 * ⛔ ここで文言を手書きしないこと。名前も説明文も、1段目（題・説明文・canonical）
 * と同じ入口 `resolvePageCopy()` から引きます＝JSON-LD と <title> がずれません。
 * URL も同じ `absoluteUrl()` なので canonical と一致します。
 *
 * ⛔ 実在しない評価・著者・日付を作らないこと。ここで出す値の出どころ:
 *   - 名前・説明文 … `app/lib/seo/curated-copy.ts` ＋ `page-copy.generated.json`
 *   - 部品の数    … `app/lib/component-count.ts`（navigation から導出）
 *   - パターンの画面数 … `app/lib/patterns.ts`
 *   - リポジトリ・ライセンス … `package.json`
 *   - 発行元・著者 … `app/lib/uixhero-links.ts` の UIXHERO（姉妹サイト＝
 *     コールドテストの連載を出している名義。Zenn の掲載名義も uixhero）
 *   - 日付       … ⛔ 出しません。回の JSON にも git の履歴にも「その記事を
 *     公開した日」は無いからです（git は promotion/ からの一括取り込みで、185回が
 *     5日に固まり、更新日は全部が同じ日）。作るくらいなら出さない。
 *
 * 型は schema-dts（schema.org の語彙を TypeScript の型にしたもの）で見ます＝
 * schema.org に無い項目や型違いは `npm run type-check` で落ちます。
 */
import type {
    Article,
    BreadcrumbList,
    CollectionPage,
    Organization,
    SoftwareSourceCode,
    TechArticle,
    WebPage,
    WebSite,
    WithContext,
} from "schema-dts";
import { COMPONENT_COUNT } from "@/lib/component-count";
import { PATTERNS, isPublicPatternSlug } from "@/lib/patterns";
import { translations } from "@/lib/translations";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";
import { absoluteUrl, resolvePageCopy, SITE_URL } from "./page-metadata";

/** サイトの名前。`app/layout.tsx` の題の頭と同じ語。 */
export const SITE_NAME = "GunjoUI";
/** 日本語名。サイト全体で使っている表記。 */
export const SITE_ALTERNATE_NAME = "群青";

/**
 * 発行元。コールドテストの一覧ページが2026-07から出している値と同じで、
 * URL は `app/lib/uixhero-links.ts` の SSOT から引きます。
 */
export const PUBLISHER: Organization = {
    "@type": "Organization",
    name: "UIXHERO",
    url: UIXHERO_BASE_URL,
};

/** ソースの置き場とライセンス。`package.json` の値をそのまま。 */
export const CODE_REPOSITORY = "https://github.com/uixhero/gunjo";
export const CODE_LICENSE = "https://opensource.org/licenses/MIT";

/** どのページも `isPartOf` でここを指す。 */
const WEBSITE_REF = { "@type": "WebSite", name: SITE_NAME, url: SITE_URL } as const;

/** `/docs/**`・`/patterns/**`・`/showcase` はサーバー側では日本語で描画される。 */
const IN_LANGUAGE = "ja";

export type JsonLdNode =
    | WithContext<WebSite>
    | WithContext<CollectionPage>
    | WithContext<WebPage>
    | WithContext<TechArticle>
    | WithContext<SoftwareSourceCode>
    | WithContext<Article>
    | WithContext<BreadcrumbList>;

const CONTEXT = "https://schema.org" as const;

/**
 * JSON-LD を `<script>` に入れる形の文字列にする。`<` を escape して、
 * 本文に `</script>` が混ざっても閉じないようにする。
 */
export function serializeJsonLd(node: JsonLdNode): string {
    return JSON.stringify(node).replace(/</g, "\\u003c");
}

/**
 * 題から末尾（`— GunjoUI`・`| GunjoUI`）を落とした、パンくずと name に出す語。
 * ⛔ 語を足さない＝落とすだけ。
 */
export function shortName(title: string): string {
    return title.replace(/\s*[—|]\s*GunjoUI.*$/, "").trim();
}

export interface Crumb {
    name: string;
    url: string;
}

/** `/a/b/c` → `["/a", "/a/b", "/a/b/c"]`。 */
function ancestorPaths(path: string): string[] {
    const parts = path.split("/").filter(Boolean);
    return parts.map((_, index) => `/${parts.slice(0, index + 1).join("/")}`);
}

/**
 * ホームから現在のページまでの段。題を引けない段（`/docs` のような転送だけの
 * ページ、`/docs/apps` のようにページが無い中間の段）は飛ばします＝存在しない
 * URL をパンくずに出さないため。
 */
export function breadcrumbTrail(path: string): Crumb[] {
    const trail: Crumb[] = [{ name: SITE_NAME, url: absoluteUrl("/") }];
    if (path === "/") return trail;
    for (const ancestor of ancestorPaths(path)) {
        const copy = resolvePageCopy(ancestor);
        if (!copy) continue;
        trail.push({ name: shortName(copy.title), url: absoluteUrl(ancestor) });
    }
    return trail;
}

/** 段からパンくずの JSON-LD を組む。段が1つ（ホームだけ）なら出さない。 */
export function breadcrumbList(trail: Crumb[]): WithContext<BreadcrumbList> | null {
    if (trail.length < 2) return null;
    return {
        "@context": CONTEXT,
        "@type": "BreadcrumbList",
        itemListElement: trail.map((crumb, index) => ({
            "@type": "ListItem" as const,
            position: index + 1,
            name: crumb.name,
            item: crumb.url,
        })),
    };
}

/** サイト全体を表す node。トップ（`/`）だけが出す。 */
export function websiteNode(description: string): WithContext<WebSite> {
    return {
        "@context": CONTEXT,
        "@type": "WebSite",
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAME,
        url: SITE_URL,
        description,
        inLanguage: IN_LANGUAGE,
        publisher: PUBLISHER,
    };
}

interface MainEntityInput {
    path: string;
    name: string;
    description: string;
}

function collectionPage(
    input: MainEntityInput,
    numberOfItems: number
): WithContext<CollectionPage> {
    return {
        "@context": CONTEXT,
        "@type": "CollectionPage",
        name: input.name,
        description: input.description,
        url: absoluteUrl(input.path),
        inLanguage: IN_LANGUAGE,
        isPartOf: WEBSITE_REF,
        publisher: PUBLISHER,
        mainEntity: { "@type": "ItemList", numberOfItems },
    };
}

function webPage(input: MainEntityInput): WithContext<WebPage> {
    return {
        "@context": CONTEXT,
        "@type": "WebPage",
        name: input.name,
        description: input.description,
        url: absoluteUrl(input.path),
        inLanguage: IN_LANGUAGE,
        isPartOf: WEBSITE_REF,
        publisher: PUBLISHER,
    };
}

function techArticle(input: MainEntityInput): WithContext<TechArticle> {
    return {
        "@context": CONTEXT,
        "@type": "TechArticle",
        headline: input.name,
        description: input.description,
        url: absoluteUrl(input.path),
        inLanguage: IN_LANGUAGE,
        isPartOf: WEBSITE_REF,
        publisher: PUBLISHER,
        author: PUBLISHER,
    };
}

function softwareSourceCode(
    input: MainEntityInput
): WithContext<SoftwareSourceCode> {
    return {
        "@context": CONTEXT,
        "@type": "SoftwareSourceCode",
        name: input.name,
        description: input.description,
        url: absoluteUrl(input.path),
        inLanguage: IN_LANGUAGE,
        isPartOf: WEBSITE_REF,
        publisher: PUBLISHER,
        author: PUBLISHER,
        codeRepository: CODE_REPOSITORY,
        license: CODE_LICENSE,
        programmingLanguage: { "@type": "ComputerLanguage", name: "TypeScript" },
        runtimePlatform: "React",
    };
}

/** そのパターンが持つ画面の数。 */
function patternScreenCount(slug: string): number {
    return PATTERNS.find((pattern) => pattern.slug === slug)?.routes.length ?? 0;
}

/** 一覧に出るパターンの数（本番に出る slug だけ）。 */
function publicPatternCount(): number {
    return PATTERNS.filter((pattern) => isPublicPatternSlug(pattern.slug)).length;
}

/**
 * ページの性質で型を分ける。
 *
 *   `/showcase`                  … CollectionPage（部品の一覧）
 *   `/patterns`                  … CollectionPage（パターンの一覧）
 *   `/patterns/<slug>`           … CollectionPage（そのパターンの画面の一覧）
 *   `/patterns/<slug>/<screen>`  … WebPage（1画面）
 *   `/docs/components`           … CollectionPage（部品の索引）
 *   `/docs/components/<slug>`    … SoftwareSourceCode（部品＝ソース）
 *   `/docs/**`（その他）          … TechArticle（技術の解説）
 */
export function mainEntity(path: string): JsonLdNode | null {
    const copy = resolvePageCopy(path);
    if (!copy) return null;
    const input: MainEntityInput = {
        path,
        name: shortName(copy.title),
        description: copy.description,
    };

    if (path === "/showcase") return collectionPage(input, COMPONENT_COUNT);
    if (path === "/patterns") return collectionPage(input, publicPatternCount());
    if (path.startsWith("/patterns/")) {
        const segments = path.split("/").filter(Boolean);
        if (segments.length === 2) {
            return collectionPage(input, patternScreenCount(segments[1]));
        }
        return webPage(input);
    }
    if (path === "/docs/components") return collectionPage(input, COMPONENT_COUNT);
    if (path.startsWith("/docs/components/")) return softwareSourceCode(input);
    if (path.startsWith("/docs/")) return techArticle(input);
    return null;
}

/**
 * `/docs/**`・`/patterns/**`・`/showcase` の1ページぶん。
 * 本体の node と、パンくずの node を返します。
 */
export function pageStructuredData(path: string): JsonLdNode[] {
    const main = mainEntity(path);
    if (!main) return [];
    const crumbs = breadcrumbList(breadcrumbTrail(path));
    return crumbs ? [main, crumbs] : [main];
}

/* ------------------------------------------------------------------ *
 * コールドテストの面（`/cold-tests/**`）
 *
 * ここはページ本体がサーバー部品なので、各ページが直接この関数を呼びます
 * （`/docs/**` のように layout を挟む必要がない）。
 * ------------------------------------------------------------------ */

/** `/cold-tests` の名前。`translations.ja.pages.coldTests.label` の SSOT。 */
export const COLD_TESTS_LABEL = translations.ja.pages.coldTests.label;

/** ホーム → コールドテスト → （あれば）その先、という段。 */
export function coldTestTrail(leaf?: { name: string; path: string }): Crumb[] {
    const trail: Crumb[] = [
        { name: SITE_NAME, url: absoluteUrl("/") },
        { name: COLD_TESTS_LABEL, url: absoluteUrl("/cold-tests") },
    ];
    if (leaf) trail.push({ name: leaf.name, url: absoluteUrl(leaf.path) });
    return trail;
}

export interface ColdTestArticleInput {
    /** `/cold-tests/<round>` */
    path: string;
    /** 回の題（`app/data/cold-test-rounds/<n>.json` の title）。 */
    headline: string;
    /** 回の要約（同 summary）。空なら題を使う＝ページの説明文と同じ扱い。 */
    description: string;
    /** デスクトップのスクリーンショット（OGP と同じ実ファイル）。 */
    imageUrl?: string;
    /** 業種カテゴリ（同 category）。 */
    section?: string;
}

/**
 * コールドテストの1回。
 *
 * ⛔ `datePublished` も `dateModified` も出しません。回の JSON に日付が無く、
 * git の履歴は promotion/ からの一括取り込みなので「その記事を公開した日」
 * ではないからです。⛔ 評価（`aggregateRating`）も出しません＝`score` は
 * この連載の自己採点で、第三者のレビューではないため。
 */
export function coldTestArticle(input: ColdTestArticleInput): WithContext<Article> {
    return {
        "@context": CONTEXT,
        "@type": "Article",
        headline: input.headline,
        description: input.description || input.headline,
        url: absoluteUrl(input.path),
        inLanguage: IN_LANGUAGE,
        isPartOf: WEBSITE_REF,
        publisher: PUBLISHER,
        author: PUBLISHER,
        ...(input.section ? { articleSection: input.section } : {}),
        ...(input.imageUrl ? { image: input.imageUrl } : {}),
    };
}
