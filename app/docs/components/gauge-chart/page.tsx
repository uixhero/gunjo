"use client";

import { CodeCopyButton, ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChartPreviewWithControls } from "@/components/doc/ChartPreviewWithControls";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { GaugeChart } from "@gunjo/ui";

const codeByLocale = {
    en: `import { GaugeChart } from "@gunjo/ui";

export function PerformanceScore() {
    return (
        <GaugeChart
            value={82}
            label="Score"
            valueLabel="82%"
            formatValue={(value) => \`\${value}%\`}
            rangeLabel="Range"
        />
    );
}`,
    ja: `import { GaugeChart } from "@gunjo/ui";

export function PerformanceScore() {
    return (
        <GaugeChart
            value={82}
            label="スコア"
            valueLabel="82%"
            formatValue={(value) => \`\${value}%\`}
            rangeLabel="範囲"
        />
    );
}`,
} as const;

const usageCodeByLocale = {
    en: `import { GaugeChart } from "@gunjo/ui";

<GaugeChart value={82} label="Score" valueLabel="82%" formatValue={(value) => \`\${value}%\`} rangeLabel="Range" />
<GaugeChart value={420} max={500} label="Capacity" />
<GaugeChart value={64} variant="compact" color="success" />
<GaugeChart value={260} max={500} color="warning" formatValue={(value) => \`\${value}GB\`} />`,
    ja: `import { GaugeChart } from "@gunjo/ui";

<GaugeChart value={82} label="スコア" valueLabel="82%" formatValue={(value) => \`\${value}%\`} rangeLabel="範囲" />
<GaugeChart value={420} max={500} label="容量" />
<GaugeChart value={64} variant="compact" color="success" />
<GaugeChart value={260} max={500} color="warning" formatValue={(value) => \`\${value}GB\`} />`,
} as const;

const stateCodeByLocale = {
    en: {
        default: `<GaugeChart
  value={82}
  label="Score"
  valueLabel="82%"
  formatValue={(value) => \`\${value}%\`}
  rangeLabel="Range"
/>`,
        compact: `<GaugeChart
  value={64}
  variant="compact"
  color="success"
  label="Progress"
  valueLabel="64%"
  formatValue={(value) => \`\${value}%\`}
/>`,
        capacity: `<GaugeChart
  value={420}
  max={500}
  label="Capacity"
  valueLabel="420GB"
  formatValue={(value) => \`\${value}GB\`}
  rangeLabel="Capacity"
/>`,
        offsetRange: `<GaugeChart
  value={12}
  min={-50}
  max={50}
  label="Delta"
  valueLabel="+12pt"
  color="info"
  formatValue={(value) => \`\${value}pt\`}
  rangeLabel="Range"
/>`,
        warning: `<GaugeChart
  value={73}
  label="Load"
  valueLabel="73%"
  color="warning"
  formatValue={(value) => \`\${value}%\`}
/>`,
        critical: `<GaugeChart
  value={91}
  label="Risk"
  valueLabel="91%"
  color="destructive"
  formatValue={(value) => \`\${value}%\`}
/>`,
    },
    ja: {
        default: `<GaugeChart
  value={82}
  label="スコア"
  valueLabel="82%"
  formatValue={(value) => \`\${value}%\`}
  rangeLabel="範囲"
/>`,
        compact: `<GaugeChart
  value={64}
  variant="compact"
  color="success"
  label="進捗"
  valueLabel="64%"
  formatValue={(value) => \`\${value}%\`}
/>`,
        capacity: `<GaugeChart
  value={420}
  max={500}
  label="容量"
  valueLabel="420GB"
  formatValue={(value) => \`\${value}GB\`}
  rangeLabel="容量"
/>`,
        offsetRange: `<GaugeChart
  value={12}
  min={-50}
  max={50}
  label="差分"
  valueLabel="+12pt"
  color="info"
  formatValue={(value) => \`\${value}pt\`}
  rangeLabel="範囲"
/>`,
        warning: `<GaugeChart
  value={73}
  label="負荷"
  valueLabel="73%"
  color="warning"
  formatValue={(value) => \`\${value}%\`}
/>`,
        critical: `<GaugeChart
  value={91}
  label="リスク"
  valueLabel="91%"
  color="destructive"
  formatValue={(value) => \`\${value}%\`}
/>`,
    },
} as const;

const propsDataByLocale = {
    en: [
    {
        name: "value",
        type: "number",
        description: "Current value rendered across the semi-circle gauge.",
    },
    {
        name: "min",
        type: "number",
        default: "0",
        description: "Minimum value for normalization.",
    },
    {
        name: "max",
        type: "number",
        default: "100",
        description: "Maximum value for normalization.",
    },
    {
        name: "variant",
        type: "\"compact\" | \"default\"",
        default: "\"default\"",
        description: "Registered SSOT variant for chart size.",
    },
    {
        name: "color",
        type: "ChartColor",
        description: "Token-driven active arc color. Defaults to primary.",
    },
    {
        name: "label",
        type: "ReactNode",
        description: "Muted label rendered below the value.",
    },
    {
        name: "valueLabel",
        type: "ReactNode",
        description: "Custom display value rendered inside the gauge.",
    },
    {
        name: "formatValue",
        type: "(value: number) => ReactNode",
        description: "Formats values shown in the gauge and tooltip range. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Use valueFormat for RSC-safe formatting.",
    },
    {
        name: "valueFormat",
        type: "\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions",
        description: "Serializable numeric format — the RSC-safe alternative to formatValue. Ignored when formatValue is set. Formats with a fixed en-US locale. (#338)",
    },
    {
        name: "rangeLabel",
        type: "ReactNode",
        default: "\"Range\"",
        description: "Label used before the min/max range in tooltips and accessibility text.",
    },
    ],
    ja: [
        { name: "value", type: "number", description: "半円ゲージに表示する現在値です。" },
        { name: "min", type: "number", default: "0", description: "正規化に使う最小値です。" },
        { name: "max", type: "number", default: "100", description: "正規化に使う最大値です。" },
        { name: "variant", type: "\"compact\" | \"default\"", default: "\"default\"", description: "チャートサイズを切り替える SSOT 登録済みバリエーションです。" },
        { name: "color", type: "ChartColor", description: "アクティブな円弧のトークンカラーです。未指定時は primary を使います。" },
        { name: "label", type: "ReactNode", description: "値の下に表示する補足ラベルです。" },
        { name: "valueLabel", type: "ReactNode", description: "ゲージ内に表示する任意の表示値です。" },
        { name: "formatValue", type: "(value: number) => ReactNode", description: "ゲージとツールチップ範囲に表示する値を整形します。関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。RSC 安全な整形には valueFormat を使う。" },
        { name: "valueFormat", type: "\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions", description: "シリアライズ可能な数値フォーマット＝formatValue の RSC 安全な代替。formatValue 指定時は無視。en-US ロケール固定で整形。(#338)" },
        { name: "rangeLabel", type: "ReactNode", default: "\"Range\"", description: "ツールチップとアクセシビリティテキストで min/max 範囲の前に表示するラベルです。" },
    ],
} as const;

export default function GaugeChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const { locale, sectionLabels } = useLocale();
    const code = codeByLocale[locale];
    const usageCode = usageCodeByLocale[locale];

    return (
        <ComponentLayout
            title={locale === "ja" ? "ゲージチャート" : meta.gaugeChart.title}
            description={meta.gaugeChart.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: locale === "ja" ? "ゲージチャート" : "GaugeChart", href: "/docs/components/gauge-chart" },
                { name: locale === "ja" ? "ツールチップ" : "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: locale === "ja" ? "セグメントゲージカード" : "SegmentedGaugeCard", href: "/docs/components/segmented-gauge-card" },
                { name: locale === "ja" ? "同心円進捗カード" : "ConcentricProgressCard", href: "/docs/components/concentric-progress-card" },
                { name: locale === "ja" ? "ラジアルバーチャート" : "RadialBarChart", href: "/docs/components/radial-bar-chart" },
                { name: locale === "ja" ? "統計" : "Statistic", href: "/docs/components/statistic" },
            ]}
        >
            <ChartPreviewWithControls
                code={code}
                demo="gauge-chart"
                embedBase="/embed/gauge-chart"
                previewHeight={360}
            />

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default",
                            title: locale === "ja" ? "標準表示" : "Default",
                            description: locale === "ja"
                                ? "スコアや進捗の現在値を半円で示す、SSOT 登録済みの標準バリエーションです。"
                                : "The registered SSOT default variant for showing current score or progress as a semicircle.",
                            preview: (
                                <GaugeChart
                                    value={82}
                                    label={locale === "ja" ? "スコア" : "Score"}
                                    valueLabel="82%"
                                    formatValue={(value) => `${value}%`}
                                    rangeLabel={locale === "ja" ? "範囲" : "Range"}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: stateCodeByLocale[locale].default,
                        },
                        {
                            key: "compact",
                            title: locale === "ja" ? "コンパクト" : "Compact",
                            description: locale === "ja"
                                ? "狭いカードやサイドパネルで高さを抑える SSOT 登録済みバリエーションです。"
                                : "A registered SSOT variant that reduces height for narrow cards or side panels.",
                            preview: (
                                <GaugeChart
                                    value={64}
                                    variant="compact"
                                    color="success"
                                    label={locale === "ja" ? "進捗" : "Progress"}
                                    valueLabel="64%"
                                    formatValue={(value) => `${value}%`}
                                    rangeLabel={locale === "ja" ? "範囲" : "Range"}
                                />
                            ),
                            previewBodyWidth: "sm",
                            code: stateCodeByLocale[locale].compact,
                        },
                        {
                            key: "capacity",
                            title: locale === "ja" ? "容量レンジ" : "Capacity range",
                            description: locale === "ja"
                                ? "最大値を変更して、容量や上限付きの使用量を示す状態です。"
                                : "Changes the maximum value to show capacity or bounded usage.",
                            preview: (
                                <GaugeChart
                                    value={420}
                                    max={500}
                                    label={locale === "ja" ? "容量" : "Capacity"}
                                    valueLabel="420GB"
                                    formatValue={(value) => `${value}GB`}
                                    rangeLabel={locale === "ja" ? "容量" : "Capacity"}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: stateCodeByLocale[locale].capacity,
                        },
                        {
                            key: "offset-range",
                            title: locale === "ja" ? "最小値あり" : "Offset range",
                            description: locale === "ja"
                                ? "最小値が 0 ではない範囲でも、現在値を正規化して表示できます。"
                                : "Normalizes values when the range starts below or above zero.",
                            preview: (
                                <GaugeChart
                                    value={12}
                                    min={-50}
                                    max={50}
                                    label={locale === "ja" ? "差分" : "Delta"}
                                    valueLabel="+12pt"
                                    color="info"
                                    formatValue={(value) => `${value}pt`}
                                    rangeLabel={locale === "ja" ? "範囲" : "Range"}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: stateCodeByLocale[locale].offsetRange,
                        },
                        {
                            key: "warning",
                            title: locale === "ja" ? "警告色" : "Warning color",
                            description: locale === "ja"
                                ? "負荷や注意が必要な状態を warning カラーで示します。"
                                : "Uses the warning color for load or caution states.",
                            preview: (
                                <GaugeChart
                                    value={73}
                                    label={locale === "ja" ? "負荷" : "Load"}
                                    valueLabel="73%"
                                    color="warning"
                                    formatValue={(value) => `${value}%`}
                                    rangeLabel={locale === "ja" ? "範囲" : "Range"}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: stateCodeByLocale[locale].warning,
                        },
                        {
                            key: "critical",
                            title: locale === "ja" ? "高リスク" : "Critical",
                            description: locale === "ja"
                                ? "高リスクや危険域に近い値を destructive カラーで示します。"
                                : "Uses the destructive color for high-risk or near-limit values.",
                            preview: (
                                <GaugeChart
                                    value={91}
                                    label={locale === "ja" ? "リスク" : "Risk"}
                                    valueLabel="91%"
                                    color="destructive"
                                    formatValue={(value) => `${value}%`}
                                    rangeLabel={locale === "ja" ? "範囲" : "Range"}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: stateCodeByLocale[locale].critical,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">{sectionLabels.props}</h2>
                <PropsTable data={propsDataByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">{sectionLabels.usage}</h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <CodeBlock code={usageCode} />
            </div>
        </ComponentLayout>
    );
}
