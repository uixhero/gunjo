"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { DocNote, Statistic } from "@gunjo/ui";

const codeByLocale = {
    ja: `import { Statistic } from "@gunjo/ui";

export function Example() {
  return (
    <Statistic
      label="月間売上"
      value="¥4,523,189"
      change="+20.1%"
      trend="up"
      hint="前月比"
    />
  );
}`,
    en: `import { Statistic } from "@gunjo/ui";

export function Example() {
  return (
    <Statistic
      label="Monthly revenue"
      value="$45,231.89"
      change="+20.1%"
      trend="up"
      hint="vs last month"
    />
  );
}`,
} as const;

const noComparisonCodeByLocale = {
    ja: `import { Statistic } from "@gunjo/ui";

export function CurrentValue() {
  return <Statistic label="今月の利用量" value="82%" hint="2026年5月26日 10:00 時点" />;
}`,
    en: `import { Statistic } from "@gunjo/ui";

export function CurrentValue() {
  return <Statistic label="Current usage" value="82%" hint="As of May 26, 2026 10:00" />;
}`,
} as const;

const positiveDownCodeByLocale = {
    ja: `import { Statistic } from "@gunjo/ui";

export function PositiveDecrease() {
  return <Statistic label="エラー率" value="1.8%" change="-0.4pt" trend="down" tone="positive" hint="前週比" />;
}`,
    en: `import { Statistic } from "@gunjo/ui";

export function PositiveDecrease() {
  return <Statistic label="Error rate" value="1.8%" change="-0.4pt" trend="down" tone="positive" hint="vs last week" />;
}`,
} as const;

const negativeUpCodeByLocale = {
    ja: `import { Statistic } from "@gunjo/ui";

export function NegativeIncrease() {
  return <Statistic label="アラート" value="18件" change="+6件" trend="up" tone="negative" hint="前日比" />;
}`,
    en: `import { Statistic } from "@gunjo/ui";

export function NegativeIncrease() {
  return <Statistic label="Alerts" value="18" change="+6" trend="up" tone="negative" hint="vs yesterday" />;
}`,
} as const;

const flatCodeByLocale = {
    ja: `import { Statistic } from "@gunjo/ui";

export function FlatTrend() {
  return <Statistic label="処理待ち" value="24件" change="変化なし" trend="flat" />;
}`,
    en: `import { Statistic } from "@gunjo/ui";

export function FlatTrend() {
  return <Statistic label="Pending" value="24" change="No change" trend="flat" />;
}`,
} as const;

const groupCodeByLocale = {
    ja: `import { Statistic } from "@gunjo/ui";

export function StatisticGroup() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Statistic label="売上" value="¥4,523,189" change="+20.1%" trend="up" hint="前月比" />
      <Statistic label="エラー率" value="1.8%" change="-0.4pt" trend="down" tone="positive" hint="前週比" />
      <Statistic label="処理待ち" value="24件" change="変化なし" trend="flat" />
    </div>
  );
}`,
    en: `import { Statistic } from "@gunjo/ui";

export function StatisticGroup() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Statistic label="Revenue" value="$45,231.89" change="+20.1%" trend="up" hint="vs last month" />
      <Statistic label="Error rate" value="1.8%" change="-0.4pt" trend="down" tone="positive" hint="vs last week" />
      <Statistic label="Pending" value="24" change="No change" trend="flat" />
    </div>
  );
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "label", type: "ReactNode", required: true, description: "指標名です。" },
        { name: "value", type: "ReactNode", required: true, description: "大きく表示する主値です。" },
        { name: "change", type: "ReactNode", description: "増減や比較値です。" },
        { name: "trend", type: "\"up\" | \"down\" | \"flat\"", default: "\"flat\"", description: "増減アイコンの向きです。" },
        { name: "tone", type: "\"positive\" | \"negative\" | \"neutral\"", description: "増減表示の意味色です。未指定時は変化の向きから推定します。" },
        { name: "hint", type: "ReactNode", description: "比較対象や計測時点などの補足です。" },
        { name: "className", type: "string", description: "外側に追加するクラスです。" },
    ],
    en: [
        { name: "label", type: "ReactNode", required: true, description: "Metric label." },
        { name: "value", type: "ReactNode", required: true, description: "Primary metric value." },
        { name: "change", type: "ReactNode", description: "Optional change indicator." },
        { name: "trend", type: "\"up\" | \"down\" | \"flat\"", default: "\"flat\"", description: "Direction for the indicator icon." },
        { name: "tone", type: "\"positive\" | \"negative\" | \"neutral\"", description: "Semantic color for the change indicator. Defaults from trend." },
        { name: "hint", type: "ReactNode", description: "Supporting comparison or timestamp text." },
        { name: "className", type: "string", description: "Optional class added to the root element." },
    ],
} as const;

export default function StatisticPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/statistic", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const code = codeByLocale[locale];

    return (
        <ComponentLayout
            title={content?.title ?? meta.statistic.title}
            description={content?.description ?? meta.statistic.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Statistic", href: "/docs/components/statistic" },
                { name: "DocNote", href: "/docs/components/doc-note" },
            ]}
            relatedComponents={[
                { name: "AnalyticsCard", href: "/docs/components/analytics-card" },
                { name: "ChartLegend", href: "/docs/components/chart-legend" },
                { name: "Card", href: "/docs/components/card" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="sm" previewHeight="auto">
                <Statistic
                    label={locale === "ja" ? "月間売上" : "Monthly revenue"}
                    value={locale === "ja" ? "¥4,523,189" : "$45,231.89"}
                    change="+20.1%"
                    trend="up"
                    hint={locale === "ja" ? "前月比" : "vs last month"}
                    className="w-full max-w-xs"
                />
            </ComponentPreview>

            <DocNote heading={locale === "ja" ? "変化の向きと意味色" : "Trend and tone"}>
                {locale === "ja"
                    ? "変化の向きは矢印の向き、意味色はその変化が良い・悪い・中立のどれかを表します。売上の増加は上向きの良い変化、エラー率の減少は下向きでも良い変化として扱います。"
                    : "trend controls the arrow direction, while tone communicates whether the change is positive, negative, or neutral. Revenue growth can stay trend=\"up\" with a positive tone; a lower error rate should use trend=\"down\" with tone=\"positive\"."}
            </DocNote>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "no-comparison",
                            title: locale === "ja" ? "比較なし" : "No comparison",
                            description: locale === "ja"
                                ? "現在値や計測時点だけを示す場合は増減値を省略し、補足に時点を入れます。"
                                : "Omit change and use hint for timestamps when the card only needs a current value.",
                            preview: (
                                <Statistic
                                    label={locale === "ja" ? "今月の利用量" : "Current usage"}
                                    value="82%"
                                    hint={locale === "ja" ? "2026年5月26日 10:00 時点" : "As of May 26, 2026 10:00"}
                                    className="w-full max-w-xs"
                                />
                            ),
                            code: noComparisonCodeByLocale[locale],
                        },
                        {
                            key: "positive-down",
                            title: locale === "ja" ? "改善としての減少" : "Positive decrease",
                            description: locale === "ja"
                                ? "エラー率やコストなど、下がることが良い指標は矢印の向きと意味色を分けます。"
                                : "For metrics where lower is better, separate the direction from the semantic tone.",
                            preview: (
                                <Statistic
                                    label={locale === "ja" ? "エラー率" : "Error rate"}
                                    value="1.8%"
                                    change="-0.4pt"
                                    trend="down"
                                    tone="positive"
                                    hint={locale === "ja" ? "前週比" : "vs last week"}
                                    className="w-full max-w-xs"
                                />
                            ),
                            code: positiveDownCodeByLocale[locale],
                        },
                        {
                            key: "negative-up",
                            title: locale === "ja" ? "悪化としての増加" : "Negative increase",
                            description: locale === "ja"
                                ? "アラートや失敗数など、増えることが悪い指標は上向き矢印でも悪い変化として表示します。"
                                : "For alerts or failures, an upward change can still be negative.",
                            preview: (
                                <Statistic
                                    label={locale === "ja" ? "アラート" : "Alerts"}
                                    value={locale === "ja" ? "18件" : "18"}
                                    change={locale === "ja" ? "+6件" : "+6"}
                                    trend="up"
                                    tone="negative"
                                    hint={locale === "ja" ? "前日比" : "vs yesterday"}
                                    className="w-full max-w-xs"
                                />
                            ),
                            code: negativeUpCodeByLocale[locale],
                        },
                        {
                            key: "flat",
                            title: locale === "ja" ? "横ばい" : "Flat",
                            description: locale === "ja"
                                ? "変化がない場合は中立の表示にして、強すぎない見え方にします。"
                                : "Use flat when the comparison should read as neutral.",
                            preview: (
                                <Statistic
                                    label={locale === "ja" ? "処理待ち" : "Pending"}
                                    value={locale === "ja" ? "24件" : "24"}
                                    change={locale === "ja" ? "変化なし" : "No change"}
                                    trend="flat"
                                    className="w-full max-w-xs"
                                />
                            ),
                            code: flatCodeByLocale[locale],
                        },
                        {
                            key: "group",
                            title: locale === "ja" ? "複数指標" : "Metric group",
                            description: locale === "ja"
                                ? "ダッシュボードでは同じ幅のグリッドに並べ、矢印の向きと意味色を指標ごとに合わせます。"
                                : "In dashboards, align cards in an equal-width grid and set trend and tone per metric.",
                            preview: (
                                <div className="grid w-full gap-3 sm:grid-cols-3">
                                    <Statistic
                                        label={locale === "ja" ? "売上" : "Revenue"}
                                        value={locale === "ja" ? "¥4,523,189" : "$45,231.89"}
                                        change="+20.1%"
                                        trend="up"
                                        hint={locale === "ja" ? "前月比" : "vs last month"}
                                    />
                                    <Statistic
                                        label={locale === "ja" ? "エラー率" : "Error rate"}
                                        value="1.8%"
                                        change="-0.4pt"
                                        trend="down"
                                        tone="positive"
                                        hint={locale === "ja" ? "前週比" : "vs last week"}
                                    />
                                    <Statistic
                                        label={locale === "ja" ? "処理待ち" : "Pending"}
                                        value={locale === "ja" ? "24件" : "24"}
                                        change={locale === "ja" ? "変化なし" : "No change"}
                                        trend="flat"
                                    />
                                </div>
                            ),
                            code: groupCodeByLocale[locale],
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </div>
        </ComponentLayout>
    );
}
