"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

const SPACING_SCALE = [
    { name: "0", value: "0px", widthClass: "w-0" },
    { name: "px", value: "1px", widthClass: "w-px" },
    { name: "0.5", value: "2px", widthClass: "w-0.5" },
    { name: "1", value: "4px", widthClass: "w-1" },
    { name: "1.5", value: "6px", widthClass: "w-1.5" },
    { name: "2", value: "8px", widthClass: "w-2" },
    { name: "2.5", value: "10px", widthClass: "w-2.5" },
    { name: "3", value: "12px", widthClass: "w-3" },
    { name: "3.5", value: "14px", widthClass: "w-3.5" },
    { name: "4", value: "16px", widthClass: "w-4" },
    { name: "5", value: "20px", widthClass: "w-5" },
    { name: "6", value: "24px", widthClass: "w-6" },
    { name: "7", value: "28px", widthClass: "w-7" },
    { name: "8", value: "32px", widthClass: "w-8" },
    { name: "9", value: "36px", widthClass: "w-9" },
    { name: "10", value: "40px", widthClass: "w-10" },
    { name: "12", value: "48px", widthClass: "w-12" },
    { name: "14", value: "56px", widthClass: "w-14" },
    { name: "16", value: "64px", widthClass: "w-16" },
    { name: "20", value: "80px", widthClass: "w-20" },
    { name: "24", value: "96px", widthClass: "w-24" },
    { name: "28", value: "112px", widthClass: "w-28" },
    { name: "32", value: "128px", widthClass: "w-32" },
    { name: "36", value: "144px", widthClass: "w-36" },
    { name: "40", value: "160px", widthClass: "w-40" },
    { name: "48", value: "192px", widthClass: "w-48" },
    { name: "56", value: "224px", widthClass: "w-56" },
    { name: "64", value: "256px", widthClass: "w-64" },
];

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
        subtitle: "The Tailwind 4-based scale, anchored to a 4px grid. Every padding, gap, and margin in the system traces to one of these steps.",
        sections: { scale: "Scale", common: "Common uses" },
        tableHeaders: { token: "Token", value: "Value", purpose: "Purpose" },
    },
    ja: {
        eyebrow: "Tokens · Spacing",
        heading: "Spacing",
        subtitle: "Tailwind 4 ベースのスケールを 4px グリッドに固定。システム内のすべての padding / gap / margin は、このいずれかのステップから派生します。",
        sections: { scale: "Scale", common: "よく使う組み合わせ" },
        tableHeaders: { token: "Token", value: "値", purpose: "用途" },
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
                <p className="max-w-2xl text-lg text-muted-foreground">{c.subtitle}</p>
            </header>

            <section className="space-y-4">
                <h2 className="border-b border-border/40 pb-2 text-2xl font-semibold tracking-tight">
                    {c.sections.scale}
                </h2>
                <div className="space-y-1.5 rounded-lg border border-border/40 bg-muted/20 p-5">
                    {SPACING_SCALE.map((step) => (
                        <div
                            key={step.name}
                            className="flex items-center gap-4 border-b border-border/20 py-1.5 last:border-b-0"
                        >
                            <code className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
                                {step.name}
                            </code>
                            <code className="w-16 shrink-0 font-mono text-[10px] text-muted-foreground">
                                {step.value}
                            </code>
                            <div
                                className={`h-3 ${step.widthClass} rounded-sm bg-primary`}
                                aria-hidden
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="border-b border-border/40 pb-2 text-2xl font-semibold tracking-tight">
                    {c.sections.common}
                </h2>
                <div className="overflow-hidden rounded-lg border border-border/40">
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
                                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
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
