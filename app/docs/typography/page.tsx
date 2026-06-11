"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

const FONTS_BASE = [
    {
        name: "Sans",
        cssVar: "Inter (next/font/google)",
        sample: "The quick brown fox — 群青 becoming blue.",
        className: "font-sans",
    },
    {
        name: "Mincho",
        cssVar: "var(--font-mincho) — Shippori Mincho",
        sample: "群青 — Becoming blue.",
        className: "[font-family:var(--font-mincho),serif]",
    },
    {
        name: "Mono",
        cssVar: "ui-monospace, SFMono-Regular, Menlo, Consolas",
        sample: 'import { Button } from "@gunjo/ui";',
        className: "font-mono",
    },
];

const FONT_USAGES = {
    en: ["Body, headings, UI", "Brand headlines, kanji", "Code, data, identifiers"],
    ja: ["本文・見出し・UI", "ブランドの見出し・漢字", "コード・データ・識別子"],
} as const;

const SCALE = [
    { name: "text-xs", className: "text-xs", size: "12px" },
    { name: "text-sm", className: "text-sm", size: "14px" },
    { name: "text-base", className: "text-base", size: "16px" },
    { name: "text-lg", className: "text-lg", size: "18px" },
    { name: "text-xl", className: "text-xl", size: "20px" },
    { name: "text-2xl", className: "text-2xl", size: "24px" },
    { name: "text-3xl", className: "text-3xl", size: "30px" },
    { name: "text-4xl", className: "text-4xl", size: "36px" },
    { name: "text-5xl", className: "text-5xl", size: "48px" },
    { name: "text-6xl", className: "text-6xl", size: "60px" },
    { name: "text-7xl", className: "text-7xl", size: "72px" },
];

const WEIGHTS = [
    { name: "font-normal", value: "400" },
    { name: "font-medium", value: "500" },
    { name: "font-semibold", value: "600" },
    { name: "font-bold", value: "700" },
    { name: "font-extrabold", value: "800" },
];

const COPY = {
    en: {
        eyebrow: "Tokens · Typography",
        heading: "Typography",
        subtitle: "Three font families and an 11-step scale. Mincho is reserved for brand moments — the kanji on the homepage hero, the color story headings.",
        sections: {
            fonts: "Font families",
            scale: "Scale",
            weights: "Weights",
            density: "Density rules",
        },
        scaleSample: "Becoming blue",
        density: [
            { lead: "Default body:", body: "text-sm (14px) on UI controls, text-base (16px) in long-form prose." },
            { lead: "Control height:", body: "36px (h-9) for buttons, inputs, and selects. Compact-but-tappable for dashboards." },
            { lead: "Heading hierarchy:", body: "H1 text-4xl/lg:text-5xl, H2 text-2xl, H3 text-xl, H4 text-lg." },
        ],
    },
    ja: {
        eyebrow: "Tokens · Typography",
        heading: "Typography",
        subtitle: "3 つのフォントファミリーと 11 段階のスケール。Mincho はブランド演出専用 ── ホーム画面の漢字や、色のストーリーの見出しに限定して使います。",
        sections: {
            fonts: "Font families",
            scale: "Scale",
            weights: "Weights",
            density: "密度のルール",
        },
        scaleSample: "Becoming blue",
        density: [
            { lead: "本文のデフォルト：", body: "UI コントロールは text-sm (14px)、長文プロースは text-base (16px)。" },
            { lead: "コントロールの高さ：", body: "ボタン・入力・セレクトはすべて 36px (h-9)。ダッシュボード向けにコンパクトでありながらタップしやすいバランス。" },
            { lead: "見出しの階層：", body: "H1 は text-4xl/lg:text-5xl、H2 は text-2xl、H3 は text-xl、H4 は text-lg。" },
        ],
    },
} as const;

export default function TypographyPage() {
    const { locale } = useLocale();
    const c = COPY[locale];
    const fonts = FONTS_BASE.map((f, i) => ({ ...f, usage: FONT_USAGES[locale][i] }));

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
                    {c.sections.fonts}
                </h2>
                <div className="grid gap-4 lg:grid-cols-3">
                    {fonts.map((font) => (
                        <div
                            key={font.name}
                            className="space-y-3 rounded-lg border border-border/40 bg-muted/20 p-5"
                        >
                            <div className="flex items-baseline justify-between">
                                <span className="text-sm font-semibold">{font.name}</span>
                                <code className="font-mono text-[10px] text-muted-foreground">
                                    {font.usage}
                                </code>
                            </div>
                            <div className={`text-2xl leading-snug ${font.className}`}>
                                {font.sample}
                            </div>
                            <code className="block break-all rounded bg-background px-2 py-1 font-mono text-[10px] text-muted-foreground">
                                {font.cssVar}
                            </code>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="border-b border-border/40 pb-2 text-2xl font-semibold tracking-tight">
                    {c.sections.scale}
                </h2>
                <div className="space-y-3 rounded-lg border border-border/40 bg-muted/20 p-5">
                    {SCALE.map((step) => (
                        <div
                            key={step.name}
                            className="flex items-baseline gap-6 border-b border-border/20 pb-3 last:border-b-0 last:pb-0"
                        >
                            <code className="w-24 shrink-0 font-mono text-xs text-muted-foreground">
                                {step.name}
                            </code>
                            <code className="w-14 shrink-0 font-mono text-[10px] text-muted-foreground">
                                {step.size}
                            </code>
                            <div className={`${step.className} truncate font-medium leading-tight`}>
                                {c.scaleSample}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="border-b border-border/40 pb-2 text-2xl font-semibold tracking-tight">
                    {c.sections.weights}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {WEIGHTS.map((w) => (
                        <div
                            key={w.name}
                            className="space-y-2 rounded-lg border border-border/40 bg-muted/20 p-4"
                        >
                            <div className={`text-xl ${w.name}`}>群青 Aa</div>
                            <code className="block font-mono text-[10px] text-muted-foreground">
                                {w.name}
                            </code>
                            <code className="block font-mono text-[10px] text-muted-foreground">
                                {w.value}
                            </code>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="border-b border-border/40 pb-2 text-2xl font-semibold tracking-tight">
                    {c.sections.density}
                </h2>
                <ul className="space-y-2 text-sm leading-7">
                    {c.density.map((d) => (
                        <li key={d.lead}>
                            <strong>{d.lead}</strong> {d.body}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
