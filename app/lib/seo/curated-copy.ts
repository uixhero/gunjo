/**
 * ページごとの題と説明文を、いまある元データ（SSOT）から組み立てる層。
 *
 * ⛔ ここで文言を手書きしないこと。題も説明文も、次のどれかから引いてきます:
 *   - `design/<category>-metadata.json`（部品の英語名と英語の説明）
 *   - `app/lib/docs-content/component-content-ja.ts`（部品の日本語の説明）
 *   - `app/lib/docs-content/ja.ts`（散文ページの題と説明）
 *   - `app/lib/navigation.ts`（ページの題）＋ `app/lib/translations.ts` の `nav`（日本語名）
 *   - `app/lib/patterns.ts` ＋ `translations.ja.pages.patterns`（パターンの題と説明）
 *
 * 元データから取れないページ（散文ページの多くは説明文が無い）は、
 * `scripts/build-seo-page-copy.mjs` が本番ビルドを巡回して、ページ自身の
 * 見出しと導入文から `page-copy.generated.json` を作ります。
 *
 * gunjo.jp の `/docs/**`・`/patterns/**`・`/showcase` はサーバー側では日本語で
 * 描画されます（`LocaleProvider` の既定が "ja"）。だから題と説明文も日本語です。
 * 英語で描画される面は `/en/**` だけで、そちらは各ページが自前で metadata を
 * 出しています。
 */
import inputsMetadata from "@design/inputs-metadata.json";
import displayMetadata from "@design/display-metadata.json";
import feedbackMetadata from "@design/feedback-metadata.json";
import navigationMetadata from "@design/navigation-metadata.json";
import overlayMetadata from "@design/overlay-metadata.json";
import layoutMetadata from "@design/layout-metadata.json";
import patternsMetadata from "@design/patterns-metadata.json";
import { navigation } from "@/lib/navigation";
import { translations } from "@/lib/translations";
import { componentContentJa } from "@/lib/docs-content/component-content-ja";
import { contentJa } from "@/lib/docs-content/ja";
import { PATTERNS } from "@/lib/patterns";
import { COMPONENT_COUNT } from "@/lib/component-count";
import type { PatternKey } from "@/lib/translations";

/** 題の末尾。コールドテストの回（`— GunjoUI cold tests`）と同じ形。 */
export const TITLE_SUFFIX = {
    docs: "— GunjoUI",
    patterns: "— GunjoUI patterns",
} as const;

/** 説明文の上限。日本語の検索結果はおおよそこの辺りで切られる。 */
export const DESCRIPTION_LIMIT = 130;

export interface CuratedCopy {
    title: string | null;
    description: string | null;
    /** どの元データから来たか（検査とレビュー用）。 */
    source: string;
}

type MetadataEntry = { title: string; description: string };

const DESIGN_METADATA: Record<string, MetadataEntry> = Object.assign(
    {},
    inputsMetadata as Record<string, MetadataEntry>,
    displayMetadata as Record<string, MetadataEntry>,
    feedbackMetadata as Record<string, MetadataEntry>,
    navigationMetadata as Record<string, MetadataEntry>,
    overlayMetadata as Record<string, MetadataEntry>,
    layoutMetadata as Record<string, MetadataEntry>,
    patternsMetadata as Record<string, MetadataEntry>
);

const NAV_TITLE_BY_HREF = new Map<string, string>();
for (const group of navigation) {
    for (const item of group.items) NAV_TITLE_BY_HREF.set(item.href, item.title);
}

const JA_NAV = translations.ja.nav;

/**
 * 説明文を上限まで詰める。句点で切れるならそこで切り、無理なら「…」を付ける。
 * ⛔ 文言を足さない＝元の文の先頭だけを残す。
 */
export function clampDescription(text: string, limit = DESCRIPTION_LIMIT): string {
    const normalized = text.replace(/\s+/g, " ").trim();
    if (normalized.length <= limit) return normalized;
    const head = normalized.slice(0, limit);
    // 文の切れ目は日本語の「。」か、英語の「. 」（小数点や `.pen` で切らない）。
    const lastEnglishStop = head.lastIndexOf(". ");
    const lastStop = Math.max(head.lastIndexOf("。"), lastEnglishStop >= 0 ? lastEnglishStop : -1);
    if (lastStop >= Math.floor(limit * 0.5)) return head.slice(0, lastStop + 1).trimEnd();
    return `${head.trimEnd()}…`;
}

/** `date-picker` → `datePicker`（design metadata のキーの形）。 */
function toMetadataKey(slug: string): string {
    return slug
        .split("-")
        .map((part, index) => (index === 0 ? part : part[0].toUpperCase() + part.slice(1)))
        .join("");
}

function lookupDesignMetadata(slug: string): MetadataEntry | undefined {
    const key = toMetadataKey(slug);
    const upper = key[0]?.toUpperCase() + key.slice(1);
    return (
        DESIGN_METADATA[key] ??
        DESIGN_METADATA[upper] ??
        DESIGN_METADATA[`${key}Template`] ??
        DESIGN_METADATA[`${upper}Template`]
    );
}

/** `Button` ＋ `ボタン` → `Button（ボタン）`。日本語名が無ければ英語名だけ。 */
function bilingualLabel(en: string, ja: string | undefined | null): string {
    if (!ja || ja === en) return en;
    return `${en}（${ja}）`;
}

function docsTitle(label: string): string {
    return `${label} ${TITLE_SUFFIX.docs}`;
}

function patternsTitle(label: string): string {
    return `${label} ${TITLE_SUFFIX.patterns}`;
}

function componentCopy(rest: string, path: string): CuratedCopy {
    const slug = rest.split("/").pop() ?? rest;
    const jaEntry = componentContentJa[`components/${rest}`];
    const designEntry = lookupDesignMetadata(slug);
    const navTitle = NAV_TITLE_BY_HREF.get(path);
    // 英語の部品名（検索で打たれる語）を先に決める。component-content-ja の
    // title は日本語名が入っている行があるので、英語名の元としては最後に見る。
    const en = designEntry?.title ?? navTitle ?? jaEntry?.title ?? null;
    // 日本語名は nav の対訳。無いときだけ component-content-ja の title を使う
    // （英語名と同じ行は対訳ではないので落とす）。
    const ja = en
        ? JA_NAV[en] ?? (jaEntry?.title && jaEntry.title !== en ? jaEntry.title : undefined)
        : undefined;
    const description = jaEntry?.description ?? designEntry?.description ?? null;
    const sources: string[] = [];
    if (designEntry?.title) sources.push("design-metadata.title");
    else if (navTitle) sources.push("navigation.title");
    else if (jaEntry?.title) sources.push("component-content-ja.title");
    if (jaEntry?.description) sources.push("component-content-ja.description");
    else if (designEntry?.description) sources.push("design-metadata.description");
    return {
        title: en ? docsTitle(bilingualLabel(en, ja)) : null,
        description: description ? clampDescription(description) : null,
        source: sources.join("+") || "none",
    };
}

function proseDocsCopy(path: string): CuratedCopy {
    const pageId = path.slice("/docs/".length);
    const navTitle = NAV_TITLE_BY_HREF.get(path);
    const direct = contentJa[pageId];
    const jaLabel = (navTitle ? JA_NAV[navTitle] : undefined) ?? direct?.title;
    const sources: string[] = [];
    let title: string | null = null;
    if (navTitle) {
        title = docsTitle(bilingualLabel(navTitle, jaLabel));
        sources.push(jaLabel ? "navigation.title+translations.nav" : "navigation.title");
    } else if (direct?.title) {
        title = docsTitle(direct.title);
        sources.push("docs-content-ja.title");
    }
    if (direct?.description) sources.push("docs-content-ja.description");
    return {
        title,
        description: direct?.description ? clampDescription(direct.description) : null,
        source: sources.join("+") || "none",
    };
}

function patternCopy(path: string): CuratedCopy {
    const patternsPage = translations.ja.pages.patterns;
    if (path === "/patterns") {
        const label = bilingualLabel("Patterns", JA_NAV["Patterns"]);
        return {
            title: docsTitle(label),
            description: clampDescription(patternsPage.subtitle),
            source: "translations.pages.patterns.subtitle",
        };
    }
    const slug = path.split("/")[2];
    const entry = PATTERNS.find((pattern) => pattern.slug === slug);
    if (!entry) return { title: null, description: null, source: "none" };
    const copy = patternsPage.patterns[entry.slug as PatternKey];
    if (!copy) return { title: null, description: null, source: "none" };
    if (path === `/patterns/${slug}`) {
        return {
            title: patternsTitle(bilingualLabel(copy.title, JA_NAV[copy.title])),
            description: clampDescription(copy.description),
            source: "translations.pages.patterns.patterns",
        };
    }
    const route = entry.routes.find((item) => item.href === path);
    if (!route) return { title: null, description: null, source: "none" };
    // 括弧は「英語名（日本語名）」に使っているので、画面名は `/` で分ける。
    return {
        title: patternsTitle(`${copy.title} / ${route.labelJa}`),
        description: clampDescription(
            `${copy.description}この画面は「${route.labelJa}」です。`
        ),
        source: "translations.pages.patterns.patterns+patterns.routes.labelJa",
    };
}

function showcaseCopy(): CuratedCopy {
    const showcase = translations.ja.pages.showcase;
    return {
        title: docsTitle(bilingualLabel("Showcase", showcase.label)),
        description: clampDescription(showcase.subtitle(COMPONENT_COUNT)),
        source: "translations.pages.showcase",
    };
}

/**
 * 元データから引ける分だけを返す。引けなかった側は null で、
 * `page-copy.generated.json`（ページ自身の見出しと導入文）が埋める。
 */
export function curatedCopy(path: string): CuratedCopy {
    if (path === "/showcase") return showcaseCopy();
    if (path === "/patterns" || path.startsWith("/patterns/")) return patternCopy(path);
    if (path.startsWith("/docs/components/")) {
        return componentCopy(path.slice("/docs/components/".length), path);
    }
    if (path.startsWith("/docs/")) return proseDocsCopy(path);
    return { title: null, description: null, source: "none" };
}
