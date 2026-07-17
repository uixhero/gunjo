"use client";

import * as React from "react";
import {
    Badge,
    ExpiryBadge,
    Meter,
    DistributionBar,
    Statistic,
    StatusBoard,
    SEMANTIC_TONES,
    toBadgeVariant,
    toChartTone,
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
            ja: "Meter は SemanticTone を直接受理し、default を muted に正規化する。既存の境界コード向けに変換器も維持。",
            en: "Meter accepts SemanticTone directly and normalizes `default` to `muted`; the helper remains for existing boundaries.",
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
        target: { ja: "Stringline / 旧 StatusBoard 境界", en: "Stringline / legacy StatusBoard boundaries" },
        note: {
            ja: "Stringline はエラー tone を danger と綴る。StatusBoard は SemanticTone を直接受理し、danger も互換 alias として維持。",
            en: "Stringline spells the error tone `danger`. StatusBoard accepts SemanticTone directly and keeps `danger` as a compatibility alias.",
        },
    },
];

export default function SemanticTonesPage() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [tone, setTone] = React.useState<SemanticTone>("warning");

    const usageCode = `import {
  type SemanticTone,
  toChartTone, toBadgeVariant,
  Badge, Meter, Statistic, StatusBoard,
  DistributionBar, ScheduleGrid,
} from "@gunjo/ui"

// One status drives every surface — no per-screen mapping table.
const status: SemanticTone = over ? "destructive" : near ? "warning" : "success"

<ScheduleGrid cells={[{ tone: status /* shared union — direct */ }]} />
<Badge variant={toBadgeVariant(status)}>${isJa ? "在庫" : "Stock"}</Badge>
<Statistic label="SLA" value="99.8%" change="+0.2%" trend="up" tone={status} />
<StatusBoard items={[{ id: 1, label: "API", status: "Healthy", tone: status }]} />
<Meter tone={status} value={68} max={100} />
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
                            同じステータスを <code>ScheduleGrid</code> セル・<code>Statistic</code>・<code>StatusBoard</code>・
                            <code>Meter</code> に跨って出すときは <code>SemanticTone</code> をそのまま渡せる。
                            <code>Badge</code> やチャートのように表示方式を含む語彙だけ変換器を通す。
                        </>
                    ) : (
                        <>
                            A status can flow directly across a <code>ScheduleGrid</code> cell, <code>Statistic</code>,
                            <code>StatusBoard</code>, and <code>Meter</code>. Use converters only for presentation
                            vocabularies such as <code>Badge</code> variants or chart colours.
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
                        ? "SemanticTone = 次の 7 つ。Statistic / StatGroup / StatusBoard / Meter を含む tone 対応部品へ値をそのまま渡せる。"
                        : "SemanticTone is these 7. Tone-driven components including Statistic, StatGroup, StatusBoard, and Meter accept these values directly."}
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
                        ? "トーンを選ぶと、下の各コンポーネントが同じ SemanticTone から描画される。変換が必要な境界だけ結果も表示する。"
                        : "Pick a tone — every component below renders from the same SemanticTone, with converted results shown only at divergent boundaries."}
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
                            Meter · direct
                        </p>
                        <Meter tone={tone} value={68} max={100} label={isJa ? "使用率" : "Usage"} />
                        <code className="text-xs text-muted-foreground">
                            {tone === "default" ? 'default → "muted" visual' : `tone="${tone}"`}
                        </code>
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
                            Statistic · direct
                        </p>
                        <Statistic
                            label={isJa ? "処理成功率" : "Success rate"}
                            value="99.8%"
                            change="+0.2%"
                            trend="up"
                            tone={tone}
                        />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            StatusBoard · direct
                        </p>
                        <StatusBoard
                            minTileWidth={180}
                            items={[
                                {
                                    id: "api",
                                    label: isJa ? "受付 API" : "Intake API",
                                    status: tone,
                                    tone,
                                    note: isJa ? "同じ SemanticTone を直接利用" : "Uses the same SemanticTone directly",
                                },
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* Migration */}
            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="migration">
                    {isJa ? "0.1.x 互換と移行" : "0.1.x compatibility and migration"}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {isJa
                        ? "旧値は 0.1.x の間も同じ見た目で動作する。新規コードは canonical 値を使い、削除は利用調査と codemod を用意した次 major 以降に再判断する。"
                        : "Legacy values keep the same visuals throughout 0.1.x. New code should use canonical values; removal will be reconsidered no earlier than the next major, after a usage audit and codemod."}
                </p>
                <PropsTable
                    data={[
                        {
                            name: "Statistic / StatGroup",
                            type: "positive → success · negative → destructive · neutral → muted",
                            description: isJa
                                ? "trend と goodWhen は方向・評価ロジックとして維持し、tone には統合しない。"
                                : "trend and goodWhen remain directional/evaluation logic; they are not collapsed into tone.",
                        },
                        {
                            name: "StatusBoard",
                            type: "danger → destructive",
                            description: isJa
                                ? "表示、重大度ソート、problemTones 判定の前に正規化する。"
                                : "Normalized before styling, severity sorting, and problemTones matching.",
                        },
                        {
                            name: "Meter",
                            type: "default → muted visual",
                            description: isJa
                                ? "SemanticTone 全体を直接受理。toMeterTone も既存境界向けに維持。"
                                : "Accepts all SemanticTone values directly; toMeterTone remains for existing boundaries.",
                        },
                        {
                            name: "ExpiryBadge",
                            type: "valid → success · expiring → warning · expired → destructive · missing → muted",
                            description: isJa
                                ? "公開 API はドメイン状態のまま。tone prop は追加しない。"
                                : "The public API remains domain states; no tone prop is added.",
                        },
                    ]}
                />
                <div className="rounded-lg border p-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        ExpiryBadge · domain state
                    </p>
                    <ExpiryBadge value="2026-08-01" today="2026-07-18" />
                </div>
            </section>

            {/* Converters */}
            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="converters">
                    {isJa ? "変換器" : "Converters"}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {isJa
                        ? "Badge・チャート・Stringline のように表示方式や旧語彙との境界が残る箇所には、キャスト無しで渡せる変換器を用意している。"
                        : "Converters remain for presentation or legacy boundaries such as Badge, charts, and Stringline — no casts required."}
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
