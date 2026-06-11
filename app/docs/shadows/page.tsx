"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

const SHADOWS_BASE = [
    { name: "shadow-none", cssVar: "--shadow-none", className: "shadow-none" },
    { name: "shadow-sm", cssVar: "--shadow-sm", className: "shadow-sm" },
    { name: "shadow", cssVar: "--shadow", className: "shadow" },
    { name: "shadow-md", cssVar: "--shadow-md", className: "shadow-md" },
    { name: "shadow-lg", cssVar: "--shadow-lg", className: "shadow-lg" },
    { name: "shadow-xl", cssVar: "--shadow-xl", className: "shadow-xl" },
    { name: "shadow-2xl", cssVar: "--shadow-2xl", className: "shadow-2xl" },
    { name: "shadow-inner", cssVar: "--shadow-inner", className: "shadow-inner" },
];

const SHADOW_DESCRIPTIONS = {
    en: [
        "No shadow. Flat surfaces.",
        "Subtle lift — small Cards, Badges with elevation.",
        "Default Card / Popover elevation.",
        "Hover state for default-elevation surfaces.",
        "Floating panels, dropdowns, tooltips.",
        "Modals, dialogs, command palette.",
        "Deeply elevated surfaces — hero spotlights.",
        "Inset — pressed states, sunken wells.",
    ],
    ja: [
        "影なし。フラットな面。",
        "わずかに浮かせる ── 小さい Card や、立体感のある Badge。",
        "Card / Popover のデフォルトの浮き具合。",
        "デフォルト浮きのホバー状態。",
        "フローティングパネル、ドロップダウン、ツールチップ。",
        "Modal、Dialog、Command Palette。",
        "強く浮かせる ── ヒーローのスポットライト等。",
        "内側へ ── 押下状態や、凹ませたウェル。",
    ],
} as const;

const COPY = {
    en: {
        eyebrow: "Tokens · Shadows",
        heading: "Shadows",
        subtitle: "Eight elevation tokens that flip with theme — alpha values in dark mode are stronger so the same shadow remains visible against the dark background.",
        sections: { scale: "Elevation scale", behavior: "Theme behavior" },
        behaviorBody: (
            <>
                In light mode shadows use 10% alpha; in dark mode they bump to 20% so depth remains readable on dark surfaces. The token name (
                <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">shadow-md</code>{" "}etc.) stays the same — the alpha is what flips. Never use arbitrary{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">shadow-[...]</code>{" "}classes; the design verifier will block them.
            </>
        ),
    },
    ja: {
        eyebrow: "Tokens · Shadows",
        heading: "Shadows",
        subtitle: "テーマに合わせて切り替わる 8 段階のエレベーショントークン ── ダークモードではアルファ値が濃くなり、同じ shadow が暗い背景でも視認できるようになります。",
        sections: { scale: "エレベーションスケール", behavior: "テーマでの挙動" },
        behaviorBody: (
            <>
                ライトモードでは shadow のアルファが 10%、ダークモードでは 20% に上がるので、暗い面の上でも深さが読み取れます。トークン名（
                <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">shadow-md</code>{" "}など）は変わらず、変わるのはアルファ値だけです。任意値の{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">shadow-[...]</code>{" "}クラスは使わないでください ── design verifier がブロックします。
            </>
        ),
    },
} as const;

export default function ShadowsPage() {
    const { locale } = useLocale();
    const c = COPY[locale];
    const shadows = SHADOWS_BASE.map((s, i) => ({
        ...s,
        description: SHADOW_DESCRIPTIONS[locale][i],
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
                <div className="grid gap-6 bg-muted/20 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {shadows.map((s) => (
                        <div key={s.name} className="space-y-3">
                            <div
                                className={`flex h-28 w-full items-center justify-center rounded-lg bg-card text-xs text-muted-foreground ${s.className}`}
                            >
                                {s.name}
                            </div>
                            <div className="space-y-1">
                                <code className="block font-mono text-[10px] text-muted-foreground">
                                    {s.cssVar}
                                </code>
                                <p className="text-xs text-muted-foreground">
                                    {s.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="border-b border-border/40 pb-2 text-2xl font-semibold tracking-tight">
                    {c.sections.behavior}
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                    {c.behaviorBody}
                </p>
            </section>
        </div>
    );
}
