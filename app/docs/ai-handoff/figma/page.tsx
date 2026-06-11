"use client";

import Link from "next/link";
import {
    IconArrowLeft as ArrowLeft,
    IconArrowRight as ArrowRight,
    IconPalette as Palette,
    IconSparkles as Sparkles,
    IconTool as Wrench,
} from "@tabler/icons-react";
import {
    Badge,
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
    Button,
    DocNote,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

const FEATURES = [
    {
        title: {
            ja: "トークンを Figma 変数へ写す",
            en: "Mirror tokens into Figma variables",
        },
        description: {
            ja: "GunjoUI の token 名と値を Figma 側の変数・スタイルへ反映します。SSOT は .pen / generated token 側に置き、Figma はデザイナーが使う配布面として扱います。",
            en: "Mirror GunjoUI token names and values into Figma variables and styles. The SSOT stays in .pen and generated tokens; Figma is the designer-facing distribution surface.",
        },
        Icon: Palette,
    },
    {
        title: {
            ja: "同じ分類でコンポーネントを並べる",
            en: "Use the same component taxonomy",
        },
        description: {
            ja: "Inputs / Display / Feedback など、docs と .pen に合わせた機能カテゴリで Figma ライブラリを構成します。variant 名も公開 API と揃えます。",
            en: "Structure the Figma library by the same functional categories used by docs and .pen, such as Inputs, Display, and Feedback. Variant names should match the public API.",
        },
        Icon: Wrench,
    },
    {
        title: {
            ja: "差分検知は後続フェーズ",
            en: "Drift detection is a later phase",
        },
        description: {
            ja: "将来的には Figma ファイルと live spec を比較し、古い variant やハードコード色を検知します。アルファ時点では計画として扱います。",
            en: "A later phase can compare Figma files against the live spec and flag stale variants or hardcoded colors. For alpha, this remains a plan.",
        },
        Icon: Sparkles,
    },
];

export default function FigmaPluginPage() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <div className="container py-12">
            <div className="mx-auto max-w-3xl space-y-12">
                <Link
                    href="/docs/ai-handoff"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    {isJa ? "AI 連携に戻る" : "Back to AI Handoff"}
                </Link>

                <header className="space-y-4">
                    <Badge variant="outline" className="gap-1.5">
                        <Palette className="h-3 w-3" />
                        {isJa ? "Phase 7 · 計画中" : "Phase 7 · planned"}
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight">
                        {isJa ? "GunjoUI と Figma" : "GunjoUI and Figma"}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {isJa
                            ? "GunjoUI は .pen と design metadata を SSOT とし、Figma はデザイナーが利用する配布面として計画しています。アルファ時点で「全画面が .pen から自動生成される」「Figma が SSOT になる」という意味ではありません。"
                            : "GunjoUI treats .pen and design metadata as the SSOT. Figma is planned as the designer-facing distribution surface. In alpha, this does not mean every page is generated from .pen or that Figma becomes the source of truth."}
                    </p>
                    <DocNote heading={isJa ? "現在の位置づけ" : "Current status"}>
                        {isJa
                            ? "Figma ライブラリ / プラグインはロードマップ上の計画です。初期公開では、.pen・core JSON・metadata JSON・docs・export の同期と検証を正とし、Figma 側は同じ分類とトークン名を反映する配布先として扱います。"
                            : "The Figma library / plugin is on the roadmap. For alpha, .pen, core JSON, metadata JSON, docs, and exports are the verified source chain; Figma is the planned distribution target that should mirror the same taxonomy and token names."}
                    </DocNote>
                </header>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {isJa ? "目指すこと" : "What this should do"}
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
                        {FEATURES.map((f) => (
                            <Card key={f.title.en} className="w-full">
                                <CardHeader>
                                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-subtle text-primary-subtle-foreground">
                                        <f.Icon className="h-4 w-4" />
                                    </div>
                                    <CardTitle className="text-base">
                                        {isJa ? f.title.ja : f.title.en}
                                    </CardTitle>
                                    <CardDescription>
                                        {isJa ? f.description.ja : f.description.en}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {isJa ? "同期の向き" : "Direction of sync"}
                    </h2>
                    <p className="text-base leading-7 text-muted-foreground">
                        {isJa ? (
                            <>
                                初期方針は{" "}
                                <strong className="text-foreground">
                                    一方向（GunjoUI → Figma）
                                </strong>{" "}
                                です。SSOT は GunjoUI 側に置き、Figma はそれを参照するライブラリとして作ります。Figma から .pen へ戻す双方向同期は別フェーズです。
                            </>
                        ) : (
                            <>
                                Phase 1 should be{" "}
                                <strong className="text-foreground">
                                    one-way (GunjoUI → Figma)
                                </strong>{" "}
                                so the design system remains the source of truth. Bi-directional sync back into .pen is a separate phase.
                            </>
                        )}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {isJa ? "AI 連携との関係" : "How it pairs with AI"}
                    </h2>
                    <p className="text-base leading-7 text-muted-foreground">
                        {isJa ? (
                            <>
                                Figma 側でも token 名と variant 名を揃えておくと、Figma Make、v0、Cursor などへ渡す時に「近い色」「似た variant」を推測させずに済みます。ただし、正とする仕様は .pen / JSON spec / docs の同期チェーンです。
                            </>
                        ) : (
                            <>
                                Matching token and variant names in Figma helps Figma Make, v0, Cursor, and similar tools avoid guessing near-miss colors or variants. The authoritative spec still comes from the .pen / JSON spec / docs sync chain.
                            </>
                        )}
                    </p>
                </section>

                <section className="space-y-3 rounded-xl border border-primary-border bg-primary-subtle p-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <h2 className="text-xl font-semibold tracking-tight">
                            {isJa ? "Figma ライブラリが整うまで" : "Until the Figma library ships"}
                        </h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {isJa ? (
                            <>
                                <code>/docs/tokens</code> と <code>/docs/colors</code> で、色・タイプ・余白などの値を確認できます。Figma 側へ手作業で写す場合も、ここにある token 名を使ってください。
                            </>
                        ) : (
                            <>
                                <code>/docs/tokens</code> and <code>/docs/colors</code> expose color, type, and spacing values. If you mirror them manually into Figma, keep the same token names.
                            </>
                        )}
                    </p>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/docs/tokens">
                            {isJa ? "トークンを見る" : "Open Token Explorer"}
                            <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </Button>
                </section>
            </div>
        </div>
    );
}
