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

export interface UixheroLawLink {
    label: string;
    href: string;
}

export interface UixheroLinks {
    /** UIコンポーネント図鑑の対応記事（対応がなければ null） */
    zukanHref: string | null;
    /** この部品を実装例として参照している法則・原則記事 */
    laws: UixheroLawLink[];
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
