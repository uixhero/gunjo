"use client";

import * as React from "react";
import {
    Badge,
    Meter,
    DistributionBar,
    SEMANTIC_TONES,
    toBadgeVariant,
    toChartTone,
    toMeterTone,
    toDangerTone,
    type SemanticTone,
    DocNote,
} from "@gunjo/ui";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";

type Locale = "en" | "ja";

const TONE_SWATCH: Record<SemanticTone, string> = {
    default: "hsl(var(--foreground))",
    muted: "hsl(var(--muted-foreground))",
    primary: "hsl(var(--primary))",
    info: "hsl(var(--info))",
    success: "hsl(var(--success))",
    warning: "hsl(var(--warning))",
    destructive: "hsl(var(--destructive))",
};

const TONE_MEANING: Record<SemanticTone, Record<Locale, string>> = {
    default: { ja: "中立・通常の状態。強調しない既定。", en: "Neutral / normal state. The unemphasized default." },
    muted: { ja: "控えめ・非アクティブ・補助的。", en: "Quiet, inactive, or secondary." },
    primary: { ja: "主要・選択中・ブランド強調。", en: "Primary, selected, or brand emphasis." },
    info: { ja: "情報・進行中のお知らせ。", en: "Informational / in-progress notice." },
    success: { ja: "成功・正常・完了。", en: "Success, healthy, or complete." },
    warning: { ja: "注意・境界値に接近。", en: "Caution, approaching a threshold." },
    destructive: { ja: "エラー・障害・超過。", en: "Error, failure, or over-limit." },
};

const CONVERTERS: {
    fn: string;
    target: Record<Locale, string>;
    note: Record<Locale, string>;
}[] = [
    {
        fn: "toChartTone",
        target: { ja: "チャート (ChartTone)", en: "Charts (ChartTone)" },
        note: {
            ja: "チャートに default は無いため muted に対応。チャート専用の accent は canonical から到達不可。",
            en: "Charts have no `default` → maps to `muted`. The chart-only `accent` isn't reachable from the canonical scale.",
        },
    },
    {
        fn: "toMeterTone",
        target: { ja: "Meter (MeterTone)", en: "Meter (MeterTone)" },
        note: {
            ja: "Meter に default は無いため muted に対応。",
            en: "Meter has no `default` → maps to `muted`.",
        },
    },
    {
        fn: "toBadgeVariant",
        target: { ja: "Badge (variant)", en: "Badge (variant)" },
        note: {
            ja: "Badge に primary / muted は無い。primary→default、muted→secondary。",
            en: "Badge has no `primary`/`muted`: `primary`→`default`, `muted`→`secondary`.",
        },
    },
    {
        fn: "toDangerTone",
        target: { ja: "StatusBoard / Stringline", en: "StatusBoard / Stringline" },
        note: {
            ja: "エラー tone を danger と綴る語彙。destructive→danger、他は同一。",
            en: "Vocabularies that spell the error tone `danger`: `destructive`→`danger`, rest identical.",
        },
    },
];

export default function SemanticTonesPage() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [tone, setTone] = React.useState<SemanticTone>("warning");

    const usageCode = `import {
  type SemanticTone,
  toChartTone, toMeterTone, toBadgeVariant,
  Badge, Meter, DistributionBar, ScheduleGrid,
} from "@gunjo/ui"

// One status drives every surface — no per-screen mapping table.
const status: SemanticTone = over ? "destructive" : near ? "warning" : "success"

<ScheduleGrid cells={[{ tone: status /* shared union — direct */ }]} />
<Badge variant={toBadgeVariant(status)}>${isJa ? "在庫" : "Stock"}</Badge>
<Meter tone={toMeterTone(status)} value={68} max={100} />
<DistributionBar segments={[{ label: "${isJa ? "使用中" : "Used"}", value: 68, color: toChartTone(status) }]} />`;

    return (
        <div className="space-y-10">
            <header className="space-y-3">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {isJa ? "セマンティックトーン" : "Semantic Tones"}
                </h1>
                <p className="text-lg text-muted-foreground">
                    {isJa
                        ? "ステータスを表す 1 つの正準スケール。tone を扱うコンポーネント間で共有し、必要な所は変換器で橋渡しする。"
                        : "One canonical scale for status. Shared across tone-driven components, bridged by converters where a component's vocabulary differs."}
                </p>
            </header>

            <DocNote variant="note" heading={isJa ? "画面ごとの変換表を無くす" : "Kills per-screen mapping tables"}>
                <p className="text-sm leading-relaxed">
                    {isJa ? (
                        <>
                            同じステータスを <code>ScheduleGrid</code> セル・<code>Badge</code>・チャートセグメント・
                            <code>Meter</code> に跨って出すとき、以前はコンポーネントごとに <code>Record</code> の変換表を手書きしていた。
                            <code>SemanticTone</code> を単一の型にして、語彙が違う所だけ変換器を通せば良い。
                        </>
                    ) : (
                        <>
                            Rendering the same status across a <code>ScheduleGrid</code> cell, a <code>Badge</code>, a chart
                            segment, and a <code>Meter</code> used to mean a hand-written <code>Record</code> map per
                            component. Type the status once as <code>SemanticTone</code> and pass divergent vocabularies
                            through a converter.
                        </>
                    )}
                </p>
            </DocNote>

            {/* Canonical scale */}
            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="scale">
                    {isJa ? "正準スケール" : "The canonical scale"}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {isJa
                        ? "SemanticTone = 次の 7 つ。ScheduleGrid / Leaderboard / KanbanBoard / Gantt はこの語彙そのものなので、値をそのまま tone に渡せる。"
                        : "SemanticTone is these 7. ScheduleGrid / Leaderboard / KanbanBoard / Gantt use exactly this vocabulary, so a value flows straight into their `tone` prop."}
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                    {SEMANTIC_TONES.map((t) => (
                        <li key={t} className="flex items-center gap-3 rounded-md border p-3">
                            <span
                                aria-hidden
                                className="h-5 w-5 shrink-0 rounded-full border"
                                style={{ backgroundColor: TONE_SWATCH[t] }}
                            />
                            <div className="min-w-0">
                                <code className="text-sm font-semibold">{t}</code>
                                <p className="text-sm text-muted-foreground">{TONE_MEANING[t][locale as Locale]}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* One status, many surfaces */}
            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="one-status">
                    {isJa ? "1 つのステータスを複数サーフェスへ" : "One status, many surfaces"}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {isJa
                        ? "トーンを選ぶと、下の各コンポーネントが同じ SemanticTone から描画される（変換器経由）。"
                        : "Pick a tone — every component below renders from the same SemanticTone (via converters)."}
                </p>

                <div className="flex flex-wrap gap-2" role="group" aria-label={isJa ? "トーンを選択" : "Select tone"}>
                    {SEMANTIC_TONES.map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTone(t)}
                            aria-pressed={tone === t}
                            className={
                                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors " +
                                (tone === t ? "border-primary bg-primary/10 font-medium" : "hover:bg-muted")
                            }
                        >
                            <span
                                aria-hidden
                                className="h-3 w-3 rounded-full border"
                                style={{ backgroundColor: TONE_SWATCH[t] }}
                            />
                            {t}
                        </button>
                    ))}
                </div>

                <div className="grid gap-4 rounded-lg border p-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Badge · toBadgeVariant
                        </p>
                        <div className="flex items-center gap-2">
                            <Badge variant={toBadgeVariant(tone)}>{tone}</Badge>
                            <code className="text-xs text-muted-foreground">→ &quot;{toBadgeVariant(tone)}&quot;</code>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Meter · toMeterTone
                        </p>
                        <Meter tone={toMeterTone(tone)} value={68} max={100} label={isJa ? "使用率" : "Usage"} />
                        <code className="text-xs text-muted-foreground">→ &quot;{toMeterTone(tone)}&quot;</code>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            DistributionBar · toChartTone
                        </p>
                        <DistributionBar
                            segments={[
                                { label: isJa ? "対象" : "This", value: 68, color: toChartTone(tone) },
                                { label: isJa ? "残り" : "Rest", value: 32, color: "muted" },
                            ]}
                        />
                        <code className="text-xs text-muted-foreground">→ &quot;{toChartTone(tone)}&quot;</code>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            StatusBoard / Stringline · toDangerTone
                        </p>
                        <div className="flex items-center gap-2">
                            <span
                                aria-hidden
                                className="h-4 w-4 rounded border"
                                style={{ backgroundColor: TONE_SWATCH[tone] }}
                            />
                            <code className="text-xs text-muted-foreground">tone → &quot;{toDangerTone(tone)}&quot;</code>
                        </div>
                    </div>
                </div>
            </section>

            {/* Converters */}
            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="converters">
                    {isJa ? "変換器" : "Converters"}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {isJa
                        ? "語彙が canonical と異なるコンポーネントには、キャスト無しで渡せる変換器を用意している。"
                        : "For components whose vocabulary differs from the canonical scale, a converter hands you the right value — no casts."}
                </p>
                <PropsTable
                    data={CONVERTERS.map((c) => ({
                        name: c.fn,
                        type: `(tone: SemanticTone) => …`,
                        description: `${c.target[locale as Locale]} — ${c.note[locale as Locale]}`,
                    }))}
                />
                <DocNote variant="tip" heading={isJa ? "RSC セーフ" : "RSC-safe"}>
                    <p className="text-sm leading-relaxed">
                        {isJa
                            ? "変換器は型のみを import しているため、Server Component から呼んでもクライアントランタイムを引き込まない。"
                            : "The converters import types only, so calling them from a Server Component pulls in no client runtime."}
                    </p>
                </DocNote>
            </section>

            {/* Usage */}
            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="usage">
                    {isJa ? "使い方" : "Usage"}
                </h2>
                <CodeBlock code={usageCode} />
            </section>
        </div>
    );
}
