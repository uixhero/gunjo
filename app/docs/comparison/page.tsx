"use client";

import * as React from "react";
import Link from "next/link";
import {
    IconArrowRight as ArrowRight,
    IconCheck as Check,
    IconMinus as Minus,
} from "@tabler/icons-react";
import { Badge, Button } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

type Cell = string | "yes" | "no";

interface MatrixRow {
    label: { en: string; ja: string };
    gunjo: Cell;
    shadcn: Cell;
    radix: Cell;
    mantine: Cell;
}

const MATRIX: MatrixRow[] = [
    {
        label: { en: "Component count", ja: "コンポーネント数" },
        gunjo: "112",
        shadcn: "~50",
        radix: "~60",
        mantine: "~120",
    },
    {
        label: { en: "Source of truth", ja: "デザイン SSOT" },
        gunjo: ".pen (Pencil)",
        shadcn: "—",
        radix: "Figma",
        mantine: "Code",
    },
    {
        label: { en: "AI integration", ja: "AI 連携" },
        gunjo: "Spec API + MCP roadmap",
        shadcn: "no",
        radix: "no",
        mantine: "no",
    },
    {
        label: { en: "Theming", ja: "テーマ" },
        gunjo: "CSS vars + runtime UI",
        shadcn: "CSS vars (Tailwind)",
        radix: "Token scales",
        mantine: "JS runtime",
    },
    {
        label: { en: "Distribution", ja: "配布形態" },
        gunjo: "npm package",
        shadcn: "Copy-paste",
        radix: "npm package",
        mantine: "npm package",
    },
    {
        label: { en: "Style system", ja: "スタイル基盤" },
        gunjo: "Tailwind",
        shadcn: "Tailwind",
        radix: "Radix tokens",
        mantine: "CSS modules",
    },
    {
        label: { en: "Maturity", ja: "成熟度" },
        gunjo: "Alpha",
        shadcn: "Stable",
        radix: "Stable",
        mantine: "Stable",
    },
    {
        label: { en: "License", ja: "ライセンス" },
        gunjo: "MIT",
        shadcn: "MIT",
        radix: "MIT",
        mantine: "MIT",
    },
];

function renderCell(cell: Cell) {
    if (cell === "yes") return <Check className="h-4 w-4 text-primary" aria-hidden="true" />;
    if (cell === "no") return <Minus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />;
    return <span>{cell}</span>;
}

const STRENGTHS_EN = [
    {
        title: "Data-dense applications",
        body: "DataTable, Combobox, FilterButton, Calendar, FileUploader, and command palettes all ship in the box. Built for admin / analytics / internal tools — not landing pages.",
    },
    {
        title: "AI-assisted product development",
        body: "Every component has a public spec endpoint (/api/specs/<category>/<name>) and the SSOT files (.pen + JSON) are downloadable. Paste into Cursor / v0 / Claude and they understand the variant grammar.",
    },
    {
        title: "Single canvas inspection",
        body: "Open a single .pen file and see every component for a category at once — no Figma library hunting. Designers and engineers look at the same artifact.",
    },
];

const STRENGTHS_JA = [
    {
        title: "データ密度の高いアプリケーション",
        body: "DataTable、Combobox、FilterButton、Calendar、FileUploader、Command palette を最初から提供。管理画面 / 分析 / 社内ツール向けに最適化されていて、ランディングページ用ではありません。",
    },
    {
        title: "AI 連携を前提とした開発",
        body: "全コンポーネントに公開 spec エンドポイント（/api/specs/<category>/<name>）、SSOT ファイル（.pen + JSON）も DL 可能。Cursor / v0 / Claude にそのまま貼ると variant の文法が伝わります。",
    },
    {
        title: "1 つのキャンバスで全体を確認",
        body: ".pen ファイルを開けば、そのカテゴリの全コンポーネントが 1 枚に並びます。Figma library を漁る必要なし。デザイナーとエンジニアが同じものを見ます。",
    },
];

const NOT_FOR_EN = [
    "You need stability guarantees today — wait for the 1.0 stable release.",
    "You don't want a Tailwind dependency.",
    "You'd rather copy source into your repo than depend on an npm package — pick shadcn/ui instead.",
    "You need a Figma library available right now (issue #109 is roadmapped, not shipped).",
];

const NOT_FOR_JA = [
    "本番環境での安定性を今すぐ保証したい場合 — 1.0 stable リリースまで待ったほうが安全です。",
    "Tailwind を依存関係に入れたくない場合。",
    "npm パッケージではなくソースをコピペしたい場合 — shadcn/ui のほうが向いています。",
    "今すぐ Figma library が必要な場合（issue #109 にロードマップあり、未着手）。",
];

const COPY_EN = {
    badge: "Why GunjoUI",
    heading: "Pick the design system that fits your build.",
    subtitle:
        "We're not pretending GunjoUI fits every use case. Here's an honest comparison so you can decide in five minutes instead of five days.",
    matrixHeading: "At a glance",
    columnLabels: {
        feature: "Feature",
        gunjo: "GunjoUI",
        shadcn: "shadcn/ui",
        radix: "Radix Themes",
        mantine: "Mantine",
    },
    strengthsHeading: "Where GunjoUI shines",
    notForHeading: "When NOT to pick GunjoUI",
    ctaHeading: "Ready to look closer?",
    ctas: [
        { label: "Browse the showcase", href: "/showcase" },
        { label: "AI integration guide", href: "/docs/ai-handoff" },
        { label: "Design tokens", href: "/docs/tokens" },
    ],
    footnote:
        "Numbers above reflect public versions of each library at the time of writing. We'll keep this page updated — open an issue if anything looks wrong.",
};

const COPY_JA = {
    badge: "なぜ GunjoUI か",
    heading: "プロジェクトに合うデザインシステムを選ぼう。",
    subtitle:
        "GunjoUI が全てのユースケースに合うとは思っていません。5 分で判断できるよう、正直な比較を書いておきます。",
    matrixHeading: "ひとめで比較",
    columnLabels: {
        feature: "観点",
        gunjo: "GunjoUI",
        shadcn: "shadcn/ui",
        radix: "Radix Themes",
        mantine: "Mantine",
    },
    strengthsHeading: "GunjoUI が向いている場面",
    notForHeading: "GunjoUI を選ばないほうが良い場面",
    ctaHeading: "もう少し詳しく見る",
    ctas: [
        { label: "Showcase を見る", href: "/showcase" },
        { label: "AI 連携ガイド", href: "/docs/ai-handoff" },
        { label: "デザイントークン", href: "/docs/tokens" },
    ],
    footnote:
        "上記の数値は執筆時点の各ライブラリの公開版に基づきます。常に最新を保ちますが、誤りに気づいたら issue を立ててください。",
};

export default function WhyPage() {
    const { locale } = useLocale();
    const copy = locale === "ja" ? COPY_JA : COPY_EN;
    const strengths = locale === "ja" ? STRENGTHS_JA : STRENGTHS_EN;
    const notFor = locale === "ja" ? NOT_FOR_JA : NOT_FOR_EN;

    return (
        <div className="container max-w-5xl py-12 space-y-12">
            <header className="space-y-4">
                <Badge variant="outline">{copy.badge}</Badge>
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                    {copy.heading}
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl">
                    {copy.subtitle}
                </p>
            </header>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                    {copy.matrixHeading}
                </h2>
                <div className="overflow-x-auto rounded-lg border border-border/40">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            <tr>
                                <th className="px-3 py-2 text-left">
                                    {copy.columnLabels.feature}
                                </th>
                                <th className="px-3 py-2 text-left">
                                    {copy.columnLabels.gunjo}
                                </th>
                                <th className="px-3 py-2 text-left">
                                    {copy.columnLabels.shadcn}
                                </th>
                                <th className="px-3 py-2 text-left">
                                    {copy.columnLabels.radix}
                                </th>
                                <th className="px-3 py-2 text-left">
                                    {copy.columnLabels.mantine}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {MATRIX.map((row, i) => (
                                <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/10"}>
                                    <td className="px-3 py-2 font-medium">
                                        {locale === "ja" ? row.label.ja : row.label.en}
                                    </td>
                                    <td className="px-3 py-2 font-mono text-xs">
                                        {renderCell(row.gunjo)}
                                    </td>
                                    <td className="px-3 py-2 font-mono text-xs">
                                        {renderCell(row.shadcn)}
                                    </td>
                                    <td className="px-3 py-2 font-mono text-xs">
                                        {renderCell(row.radix)}
                                    </td>
                                    <td className="px-3 py-2 font-mono text-xs">
                                        {renderCell(row.mantine)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                    {copy.strengthsHeading}
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                    {strengths.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-lg border border-border/40 p-5 space-y-2"
                        >
                            <h3 className="text-base font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                    {copy.notForHeading}
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    {notFor.map((item, i) => (
                        <li key={i} className="flex gap-2">
                            <span aria-hidden="true">—</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="rounded-xl border border-accent-foreground/20 bg-accent/40 p-6 space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                    {copy.ctaHeading}
                </h2>
                <div className="flex flex-wrap gap-2">
                    {copy.ctas.map((cta) => (
                        <Button key={cta.href} asChild variant="outline" size="sm">
                            <Link href={cta.href}>
                                {cta.label}
                                <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        </Button>
                    ))}
                </div>
            </section>

            <p className="text-xs text-muted-foreground">{copy.footnote}</p>
        </div>
    );
}
