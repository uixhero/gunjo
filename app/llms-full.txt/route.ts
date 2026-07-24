import {
    buildAllSpecs,
    type Category,
    type ComponentSpec,
} from "@/lib/component-spec-builder";
import coldTestGallery from "@/data/cold-test-gallery.json";

// Served at /llms-full.txt. The exhaustive companion to /llms.txt: every
// component's name + one-line description + docs URL, plus every cold-test
// article (title + URL). Generated from the same SSOT the docs render from
// (buildAllSpecs) and the cold-test gallery data, so it can't drift from the
// catalog. For full machine-readable specs (variants, class signatures) an
// agent should follow the docs URL or read /api/specs/manifest. (#553)

const BASE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gunjo.jp"
).replace(/\/$/, "");

export const dynamic = "force-static";

// Display order + human label for each functional tier.
const CATEGORY_ORDER: { key: Category; label: string }[] = [
    { key: "inputs", label: "Inputs" },
    { key: "display", label: "Display" },
    { key: "feedback", label: "Feedback" },
    { key: "navigation", label: "Navigation" },
    { key: "overlay", label: "Overlay" },
    { key: "layout", label: "Layout" },
    { key: "patterns", label: "Patterns" },
];

/** Collapse any internal whitespace/newlines so each spec is one clean line. */
function oneLine(text: string): string {
    return text.replace(/\s+/g, " ").trim();
}

interface ColdTestEntry {
    round: number;
    title: string;
}

export function GET() {
    const specs = buildAllSpecs(BASE_URL);
    const byCategory = new Map<Category, ComponentSpec[]>();
    for (const spec of specs) {
        const list = byCategory.get(spec.category) ?? [];
        list.push(spec);
        byCategory.set(spec.category, list);
    }

    const sections: string[] = [];
    for (const { key, label } of CATEGORY_ORDER) {
        const list = (byCategory.get(key) ?? []).sort((a, b) =>
            a.title.localeCompare(b.title)
        );
        if (list.length === 0) continue;
        const lines = list.map((spec) => {
            const desc = spec.description ? ` — ${oneLine(spec.description)}` : "";
            return `- ${spec.title}${desc} — ${spec.docsUrl}`;
        });
        sections.push(`## ${label}（${list.length}）\n${lines.join("\n")}`);
    }

    const gallery = coldTestGallery as {
        count: number;
        entries: ColdTestEntry[];
    };
    const coldTestLines = [...gallery.entries]
        .sort((a, b) => a.round - b.round)
        .map(
            (entry) =>
                `- #${entry.round} ${oneLine(entry.title)} — ${BASE_URL}/cold-tests/${entry.round}`
        );

    const body = `# GunjoUI — 全コンポーネント & コールドテスト索引 (llms-full.txt)

> 各コンポーネントの名前・一行説明・docs URL の完全な一覧です。
> variant キーや Tailwind クラス署名を含む機械可読な完全仕様は ${BASE_URL}/api/specs/manifest (JSON)。
> 概要と主要な入口は ${BASE_URL}/llms.txt。
>
> パッケージ: @gunjo/ui（現在 beta・0.1.0-beta 系。API は変わりえます）。
> コンポーネント計 ${specs.length} 件 / コールドテスト計 ${gallery.count} 件。
> npm が使えない環境（単一 HTML 等）では ${BASE_URL}/tokens.css（純 CSS トークン）・
> ${BASE_URL}/patterns.css（gj- パターンクラス）・${BASE_URL}/starter.html（見本）と
> ${BASE_URL}/docs/no-npm を参照。

# コンポーネント

${sections.join("\n\n")}

# コールドテスト（実証記録・${gallery.count} 件）

予備知識ゼロの AI に @gunjo/ui で実際に画面を作らせた記録。方針: ${BASE_URL}/cold-tests/why

${coldTestLines.join("\n")}
`;

    return new Response(body, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
