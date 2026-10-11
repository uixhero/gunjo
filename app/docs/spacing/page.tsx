"use client";

import { Badge, DocNote, List, ListItem } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
// The scale itself is generated from scripts/design-sync/token-scales.mjs, the
// same source public/tokens.css ships as --space-*. This page used to carry the
// 28 steps as a hand-typed array, which made the docs a copy nothing checked. (#969)
import { SPACING_SCALE } from "@/lib/data/token-scales.generated";

const COMMON_USES_BASE = [
    { token: "h-9", value: "36px" },
    { token: "gap-2", value: "8px" },
    { token: "p-4 / p-5 / p-6", value: "16 / 20 / 24px" },
    { token: "space-y-4 / space-y-6 / space-y-8", value: "16 / 24 / 32px" },
    { token: "max-w-2xl / 3xl / 6xl", value: "672 / 768 / 1152px" },
];

const COMMON_USES_PURPOSE = {
    en: [
        "Button / Input / Select height — the system's control rhythm",
        "Inline icon + label spacing inside buttons",
        "Card padding (compact / default / spacious)",
        "Vertical rhythm between section blocks",
        "Reading widths for prose / docs / landing",
    ],
    ja: [
        "Button / Input / Select の高さ ── システム共通のコントロールの拍子",
        "ボタン内のアイコンとラベルの間隔",
        "Card の padding（コンパクト / デフォルト / ゆとりあり）",
        "セクションブロック間の縦リズム",
        "プロース / ドキュメント / ランディングの読みやすい幅",
    ],
} as const;

const COPY = {
    en: {
        eyebrow: "Tokens · Spacing",
        heading: "Spacing",
        subtitle: "Tailwind's scale, held to a 4px grid. Spacing and sizes use the whole steps; the fractional steps are for hairlines, dots and centring only.",
        sections: { grid: "The 4px grid", scale: "Scale", common: "Common uses" },
        tableHeaders: { token: "Token", value: "Value", purpose: "Purpose" },
        detailOnly: "Detail only",
        grid: {
            lead: "These three are multiples of 4px:",
            items: [
                "The gap between items (gap, space-x, space-y).",
                "The padding and margin an element is pushed in by.",
                "The size of controls, chips and icons. An icon is 12, 16, 20 or 24px, never 14.",
            ],
            sizeFirst: {
                before: "For a one-line row or chip, set the height first and keep the padding on the grid. A menu item is ",
                code: "min-h-8 py-1",
                after: " (32px tall, 4px padding), not 6px padding.",
            },
            detailHeading: "Details may sit off the grid",
            detail:
                "A line, dot or tick under 12px, and a centring nudge under 4px, are exempt. The fractional steps (0.5, 1.5, 2.5, 3.5) and px exist for these alone.",
            check: "Checked by: ",
        },
    },
    ja: {
        eyebrow: "Tokens · Spacing",
        heading: "Spacing",
        subtitle: "Tailwind のスケールを 4px グリッドに固定しています。余白と大きさには整数の段を使い、小数の段は線・点・中心合わせだけに使います。",
        sections: { grid: "4px グリッド", scale: "Scale", common: "よく使う組み合わせ" },
        tableHeaders: { token: "Token", value: "値", purpose: "用途" },
        detailOnly: "細部専用",
        grid: {
            lead: "次の3つは 4 の倍数にそろえます。",
            items: [
                "並んだ物どうしの間（gap、space-x、space-y）。",
                "要素を内側へ寄せる余白（padding、margin）。",
                "操作部品・札・アイコンの大きさ。アイコンは 12・16・20・24px で、14px は使いません。",
            ],
            sizeFirst: {
                before: "1行の行や札は、先に高さを決めてから余白を整数の段にします。メニューの項目は、上下 6px の余白ではなく ",
                code: "min-h-8 py-1",
                after: "（高さ 32px・余白 4px）です。",
            },
            detailHeading: "細部は 4 の倍数でなくてよい",
            detail:
                "12px 未満の線・点・目盛りと、4px 未満の位置ずらし（中心合わせ）は例外です。小数の段（0.5、1.5、2.5、3.5）と px は、この細部のためだけにあります。",
            check: "機械検査：",
        },
    },
} as const;

export default function SpacingPage() {
    const { locale } = useLocale();
    const c = COPY[locale];
    const commonUses = COMMON_USES_BASE.map((row, i) => ({
        ...row,
        purpose: COMMON_USES_PURPOSE[locale][i],
    }));

    return (
        <div className="space-y-12">
            <header className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {c.eyebrow}
                </p>
                <h1 className="text-4xl font-bold tracking-tight">{c.heading}</h1>
                <p className="text-lg text-muted-foreground">{c.subtitle}</p>
            </header>

            <section className="space-y-4">
                <h2 className="pb-2 text-2xl font-semibold tracking-tight" id="grid">
                    {c.sections.grid}
                </h2>
                <p className="text-muted-foreground">{c.grid.lead}</p>
                <List>
                    {c.grid.items.map((item) => (
                        <ListItem key={item}>{item}</ListItem>
                    ))}
                </List>
                <p className="text-muted-foreground">
                    {c.grid.sizeFirst.before}
                    <code className="rounded bg-muted px-1 font-mono text-sm">{c.grid.sizeFirst.code}</code>
                    {c.grid.sizeFirst.after}
                </p>
                <DocNote variant="note" heading={c.grid.detailHeading}>
                    {c.grid.detail}
                </DocNote>
                <p className="text-sm text-muted-foreground">
                    {c.grid.check}
                    <code className="rounded bg-muted px-1 font-mono text-xs">npm run design:verify:grid4</code>
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="pb-2 text-2xl font-semibold tracking-tight">
                    {c.sections.scale}
                </h2>
                <div className="space-y-2 rounded-lg border border-transparent contrast-more:border-border forced-colors:border-[CanvasText] bg-muted p-5">
                    {SPACING_SCALE.map((step) => (
                        <div
                            key={step.step}
                            className="flex min-h-7 items-center gap-4 border-b border-border/20 py-1 last:border-b-0"
                        >
                            <code className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
                                {step.step}
                            </code>
                            <code className="w-16 shrink-0 font-mono text-[10px] text-muted-foreground">
                                {step.px}
                            </code>
                            <div
                                className={`h-3 ${step.widthClass} rounded-sm ${step.detailOnly ? "bg-muted-foreground/40" : "bg-primary"}`}
                                aria-hidden
                            />
                            {step.detailOnly ? (
                                <Badge variant="outline" size="sm">
                                    {c.detailOnly}
                                </Badge>
                            ) : null}
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="pb-2 text-2xl font-semibold tracking-tight">
                    {c.sections.common}
                </h2>
                <div className="overflow-hidden rounded-lg border bg-card border-transparent contrast-more:border-border forced-colors:border-[CanvasText]">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                                <th className="px-4 py-2 font-semibold">{c.tableHeaders.token}</th>
                                <th className="px-4 py-2 font-semibold">{c.tableHeaders.value}</th>
                                <th className="px-4 py-2 font-semibold">{c.tableHeaders.purpose}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commonUses.map((row) => (
                                <tr
                                    key={row.token}
                                    className="border-t border-border/20"
                                >
                                    <td className="px-4 py-3">
                                        <code className="rounded bg-muted px-2 font-mono text-xs leading-5">
                                            {row.token}
                                        </code>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                        {row.value}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {row.purpose}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
