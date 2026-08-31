import mapping from "./data/uixhero-mapping.json";

/**
 * UIXHERO（姉妹サイト・https://www.uixhero.com）への逆リンクを
 * uixhero-mapping.json（SSOT・KeEem 裁定 2026-07-02）から導出する。
 * リンクをハードコードで散布しないこと。対応表の更新は JSON 側で行う。
 * 整合性は scripts/verify-uixhero-mapping.mjs が design:verify で検査する。
 */
export const UIXHERO_BASE_URL = "https://www.uixhero.com";

interface MappingEntry {
    uixhero: string | null;
    gunjo: string[];
    relation: string;
    note?: string;
}

interface MappingLaw {
    kind: "section" | "page";
    uixhero: string;
    gunjo: string[];
    title?: string;
    note?: string;
}

interface UixheroMapping {
    entries: MappingEntry[];
    laws: MappingLaw[];
}

const data = mapping as unknown as UixheroMapping;

// uixhero.com 側のシリーズ → URL パス。ux-reference のみトップレベル。
const SERIES_PATHS: Record<string, string> = {
    "ui-components": "/resources/ui-components",
    "ui-design": "/resources/ui-design",
    "ux-reference": "/ux-reference",
    accessibility: "/resources/accessibility",
};

export interface UixheroLink {
    label: string;
    href: string;
    /**
     * 省略時は "exact"。"nearest" はこの部品そのものの記事が UIXHERO に無く、
     * いちばん近い種類の記事を指していることを表す。表示側（節）が言語に合わせた
     * 但し書きを添えるので、ラベルの文字列に「近い記事」と書かないこと。
     */
    relation?: "exact" | "nearest";
}

/** 旧称。法則記事だけでなくページ自前のリンクも同じ形なので UixheroLink に統一した。 */
export type UixheroLawLink = UixheroLink;

export interface UixheroLinks {
    /** UIコンポーネント解説の対応記事（対応がなければ null） */
    zukanHref: string | null;
    /** この部品を実装例として参照している法則・原則記事 */
    laws: UixheroLink[];
}

function lawHref(uixhero: string): string | null {
    const slash = uixhero.indexOf("/");
    if (slash === -1) return null;
    const series = uixhero.slice(0, slash);
    const slug = uixhero.slice(slash + 1);
    const basePath = SERIES_PATHS[series];
    if (!basePath) return null;
    return `${UIXHERO_BASE_URL}${basePath}/${slug}`;
}

export function getUixheroLinks(componentSlug: string | null): UixheroLinks {
    if (!componentSlug) return { zukanHref: null, laws: [] };

    const entry = data.entries.find(
        (candidate) => candidate.uixhero && candidate.gunjo.includes(componentSlug)
    );
    const zukanHref = entry?.uixhero
        ? `${UIXHERO_BASE_URL}${SERIES_PATHS["ui-components"]}/${entry.uixhero}`
        : null;

    const componentHref = `/docs/components/${componentSlug}`;
    const laws = data.laws
        .filter((law) => law.kind === "page" && law.gunjo.includes(componentHref))
        .flatMap((law) => {
            const href = lawHref(law.uixhero);
            if (!href || !law.title) return [];
            return [{ label: law.title, href }];
        });

    return { zukanHref, laws };
}

/**
 * 地図（uixhero-mapping.json）から導いた自動のリンクと、ページが自分で持つ
 * リンクを1本の並びに合流させる。
 *
 * 合流の規則:
 * - 並び順は 自動（図鑑 → 法則）が先、ページ自前が後。
 * - href が同じものは、先に現れたほう（＝自動側）を残して後を落とす。
 *   ページが地図と同じ記事を指していても二重に出ない。
 * - ページ自前どうしの重複も、先に書いたほうを残す。
 * - 比較は href の文字列そのもの。末尾スラッシュや大文字小文字は正規化しない。
 */
export function mergeUixheroLinks(
    auto: UixheroLinks,
    zukanLabel: string,
    pageLinks: UixheroLink[] = []
): UixheroLink[] {
    const ordered: UixheroLink[] = [
        ...(auto.zukanHref ? [{ label: zukanLabel, href: auto.zukanHref }] : []),
        ...auto.laws,
        ...pageLinks,
    ];

    const seen = new Set<string>();
    return ordered.filter((link) => {
        if (seen.has(link.href)) return false;
        seen.add(link.href);
        return true;
    });
}
