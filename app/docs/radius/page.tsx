"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

const RADII_BASE = [
    { name: "rounded-none", value: "0px", className: "rounded-none" },
    { name: "rounded-sm", value: "calc(var(--radius) - 4px) ≈ 4px", className: "rounded-sm" },
    { name: "rounded", value: "4px", className: "rounded" },
    { name: "rounded-md", value: "calc(var(--radius) - 2px) ≈ 6px", className: "rounded-md" },
    { name: "rounded-lg", value: "var(--radius) — 8px", className: "rounded-lg" },
    { name: "rounded-xl", value: "12px", className: "rounded-xl" },
    { name: "rounded-2xl", value: "16px", className: "rounded-2xl" },
    { name: "rounded-full", value: "9999px", className: "rounded-full" },
];

const RADII_DESCRIPTIONS = {
    en: [
        "Sharp corners — used rarely.",
        "Small chips, dense list items.",
        "Code badges, inline pills.",
        "Default for buttons, inputs, badges.",
        "Cards, dialog containers, popovers.",
        "Marketing surfaces, hero CTAs.",
        "Color story swatches, pricing cards.",
        "Avatars, status dots, tags.",
    ],
    ja: [
        "シャープな角 ── ほとんど使わない。",
        "小さい chip、密度の高いリスト項目。",
        "コードバッジ、インラインの pill。",
        "Button / Input / Badge のデフォルト。",
        "Card、ダイアログ、Popover。",
        "マーケティング面、ヒーロー CTA。",
        "色のストーリーのスウォッチ、価格カード。",
        "Avatar、ステータスドット、Tag。",
    ],
} as const;

const COPY = {
    en: {
        eyebrow: "Tokens · Radius",
        heading: "Radius",
        subtitle: (
            <>
                Radius scale anchored to{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">--radius (0.5rem)</code>.
                Most controls sit at{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">rounded-md</code> /{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">rounded-lg</code>;
                use the larger steps for marketing surfaces only.
            </>
        ),
        sections: { scale: "Scale", base: "The base radius variable" },
        baseBody: (
            <>
                Several Tailwind aliases derive from this:
                <code className="mx-1 rounded bg-background px-1.5 py-0.5 text-xs font-mono">rounded-md</code> ={" "}
                <code className="mx-1 rounded bg-background px-1.5 py-0.5 text-xs font-mono">calc(var(--radius) - 2px)</code>,{" "}
                <code className="mx-1 rounded bg-background px-1.5 py-0.5 text-xs font-mono">rounded-sm</code> ={" "}
                <code className="mx-1 rounded bg-background px-1.5 py-0.5 text-xs font-mono">calc(var(--radius) - 4px)</code>.
                Tweak{" "}
                <code className="mx-1 rounded bg-background px-1.5 py-0.5 text-xs font-mono">--radius</code>{" "}
                and the entire system rounds together.
            </>
        ),
    },
    ja: {
        eyebrow: "Tokens · Radius",
        heading: "Radius",
        subtitle: (
            <>
                {" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">--radius (0.5rem)</code>{" "}
                を基点とする radius スケール。コントロールの多くは{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">rounded-md</code> /{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">rounded-lg</code>{" "}
                を使い、より大きなステップはマーケティング面に限定します。
            </>
        ),
        sections: { scale: "Scale", base: "ベース radius 変数" },
        baseBody: (
            <>
                Tailwind のいくつかのエイリアスがこの値から派生します：
                <code className="mx-1 rounded bg-background px-1.5 py-0.5 text-xs font-mono">rounded-md</code> ={" "}
                <code className="mx-1 rounded bg-background px-1.5 py-0.5 text-xs font-mono">calc(var(--radius) - 2px)</code>、{" "}
                <code className="mx-1 rounded bg-background px-1.5 py-0.5 text-xs font-mono">rounded-sm</code> ={" "}
                <code className="mx-1 rounded bg-background px-1.5 py-0.5 text-xs font-mono">calc(var(--radius) - 4px)</code>。{" "}
                <code className="mx-1 rounded bg-background px-1.5 py-0.5 text-xs font-mono">--radius</code>{" "}
                を変更すれば、システム全体の角丸が一斉に追従します。
            </>
        ),
    },
} as const;

export default function RadiusPage() {
    const { locale } = useLocale();
    const c = COPY[locale];
    const radii = RADII_BASE.map((r, i) => ({
        ...r,
        description: RADII_DESCRIPTIONS[locale][i],
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
                <div className="grid gap-5 bg-muted/20 p-6 sm:grid-cols-2 lg:grid-cols-4">
                    {radii.map((r) => (
                        <div key={r.name} className="space-y-3">
                            <div
                                className={`flex h-24 w-full items-center justify-center border-2 border-primary-border bg-primary-subtle text-xs text-primary-subtle-foreground ${r.className}`}
                            >
                                {r.name}
                            </div>
                            <div className="space-y-1">
                                <code className="block font-mono text-[10px] text-muted-foreground">
                                    {r.value}
                                </code>
                                <p className="text-xs text-muted-foreground">
                                    {r.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="border-b border-border/40 pb-2 text-2xl font-semibold tracking-tight">
                    {c.sections.base}
                </h2>
                <div className="rounded-lg border border-border/40 bg-muted/20 p-5">
                    <code className="block font-mono text-sm">
                        --radius: 0.5rem; /* 8px */
                    </code>
                    <p className="mt-3 text-sm text-muted-foreground">{c.baseBody}</p>
                </div>
            </section>
        </div>
    );
}
