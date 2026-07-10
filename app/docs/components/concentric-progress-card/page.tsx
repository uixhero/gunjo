"use client";

import { CodeCopyButton, ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChartPreviewWithControls } from "@/components/doc/ChartPreviewWithControls";
import displayMetadata from "@design/display-metadata.json";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ConcentricProgressCard } from "@gunjo/ui";
import type { ConcentricProgressMetric, ConcentricProgressRing } from "@gunjo/ui";

const ringsByLocale: Record<"en" | "ja", ConcentricProgressRing[]> = {
    en: [
        { label: "Documents", value: 42, color: "primary", description: "16% of quota", detail: "PDF and workspace files" },
        { label: "Media", value: 68, color: "destructive", description: "27% of quota", detail: "Images and video" },
        { label: "Apps", value: 27, color: "info", description: "11% of quota", detail: "Installed app data" },
        { label: "System", value: 18, color: "success", description: "7% of quota", detail: "Cache and system files" },
    ],
    ja: [
        { label: "書類", value: 42, color: "primary", description: "クォータの16%", detail: "PDF と作業ファイル" },
        { label: "メディア", value: 68, color: "destructive", description: "クォータの27%", detail: "画像と動画" },
        { label: "アプリ", value: 27, color: "info", description: "クォータの11%", detail: "アプリのデータ" },
        { label: "システム", value: 18, color: "success", description: "クォータの7%", detail: "キャッシュとシステム領域" },
    ],
};

const compactRingsByLocale: Record<"en" | "ja", ConcentricProgressRing[]> = {
    en: [
        { label: "CPU", value: 74, color: "destructive", description: "Current utilization" },
        { label: "Memory", value: 62, color: "primary", description: "Current utilization" },
        { label: "Queue", value: 36, color: "info", description: "Current utilization" },
    ],
    ja: [
        { label: "CPU", value: 74, color: "destructive", description: "現在の利用率" },
        { label: "メモリ", value: 62, color: "primary", description: "現在の利用率" },
        { label: "キュー", value: 36, color: "info", description: "現在の利用率" },
    ],
};

const metricsByLocale: Record<"en" | "ja", ConcentricProgressMetric[]> = {
    en: [
        { label: "Used", value: "155GB", description: "61%" },
        { label: "Capacity", value: "256GB" },
        { label: "Selected", value: "Media", description: "68GB" },
    ],
    ja: [
        { label: "使用済み", value: "155GB", description: "61%" },
        { label: "総容量", value: "256GB" },
        { label: "選択中", value: "メディア", description: "68GB" },
    ],
};

const codeByLocale = {
    en: `import { ConcentricProgressCard } from "@gunjo/ui";

const rings = [
    { label: "Documents", value: 42 },
    { label: "Media", value: 68 },
    { label: "Apps", value: 27 },
    { label: "System", value: 18 },
];

export function StorageWidget() {
    return (
        <ConcentricProgressCard
            title="Storage overview"
            description="Concentric progress"
            value="155GB"
            centerLabel="Used storage"
            delta="61%"
            rings={rings}
            selectedIndex={1}
            max={256}
            formatValue={(value) => \`\${value}GB\`}
            maxLabel="Capacity"
            caption="Compare storage, usage, and quota values with selectable rings."
        />
    );
}`,
    ja: `import { ConcentricProgressCard } from "@gunjo/ui";

const rings = [
    { label: "書類", value: 42 },
    { label: "メディア", value: 68 },
    { label: "アプリ", value: 27 },
    { label: "システム", value: 18 },
];

export function StorageWidget() {
    return (
        <ConcentricProgressCard
            title="ストレージ概要"
            description="同心円進捗"
            value="155GB"
            centerLabel="使用済み容量"
            delta="61%"
            rings={rings}
            selectedIndex={1}
            max={256}
            formatValue={(value) => \`\${value}GB\`}
            maxLabel="総容量"
            caption="ストレージ、使用量、クォータなどを複数リングで比較します。"
        />
    );
}`,
} as const;

const usageCodeByLocale = {
    en: `import { ConcentricProgressCard } from "@gunjo/ui";

const rings = [
    { label: "Documents", value: 42 },
    { label: "Media", value: 68 },
    { label: "Apps", value: 27 },
    { label: "System", value: 18 },
];

const metrics = [
    { label: "Used", value: "155GB", description: "61%" },
    { label: "Capacity", value: "256GB" },
    { label: "Selected", value: "Media", description: "68GB" },
];

<ConcentricProgressCard rings={rings} max={256} />
<ConcentricProgressCard rings={rings} selectedIndex={1} />
<ConcentricProgressCard rings={rings} metrics={metrics} />
<ConcentricProgressCard rings={rings} showLegend={false} />
<ConcentricProgressCard rings={rings} variant="compact" />`,
    ja: `import { ConcentricProgressCard } from "@gunjo/ui";

const rings = [
    { label: "書類", value: 42 },
    { label: "メディア", value: 68 },
    { label: "アプリ", value: 27 },
    { label: "システム", value: 18 },
];

const metrics = [
    { label: "使用済み", value: "155GB", description: "61%" },
    { label: "総容量", value: "256GB" },
    { label: "選択中", value: "メディア", description: "68GB" },
];

<ConcentricProgressCard rings={rings} max={256} />
<ConcentricProgressCard rings={rings} selectedIndex={1} />
<ConcentricProgressCard rings={rings} metrics={metrics} />
<ConcentricProgressCard rings={rings} showLegend={false} />
<ConcentricProgressCard rings={rings} variant="compact" />`,
} as const;

const stateCodeByLocale = {
    en: {
        default: `<ConcentricProgressCard
  title="Storage overview"
  description="Storage by category"
  value="155GB"
  centerLabel="Used storage"
  delta="61%"
  metrics={metrics}
  rings={rings}
  selectedIndex={1}
  max={256}
  formatValue={(value) => \`\${value}GB\`}
  maxLabel="Capacity"
/>`,
        compact: `<ConcentricProgressCard
  variant="compact"
  title="Resource load"
  description="Current utilization"
  value="74%"
  centerLabel="Peak"
  rings={rings}
  selectedIndex={0}
  max={100}
  formatValue={(value) => \`\${value}%\`}
/>`,
        selected: `import { useState } from "react";

export function StorageSelection() {
  const [selectedIndex, setSelectedIndex] = useState(1);

  return (
    <ConcentricProgressCard
      title="Selected ring"
      description="Use selectedIndex to keep one ring in focus."
      value="68GB"
      centerLabel="Media"
      rings={rings}
      selectedIndex={selectedIndex}
      onRingSelect={(_, index) => setSelectedIndex(index)}
      max={256}
      formatValue={(value) => \`\${value}GB\`}
      maxLabel="Capacity"
    />
  );
}`,
        metrics: `<ConcentricProgressCard
  title="Capacity summary"
  description="Metrics can summarize the chart above the rings."
  metrics={metrics}
  rings={rings}
  selectedIndex={2}
  max={256}
  formatValue={(value) => \`\${value}GB\`}
  maxLabel="Capacity"
/>`,
        chartOnly: `<ConcentricProgressCard
  title="Chart only"
  description="Hide the legend when the parent view owns the details."
  value="155GB"
  centerLabel="Used"
  rings={rings}
  showLegend={false}
  max={256}
  formatValue={(value) => \`\${value}GB\`}
  maxLabel="Capacity"
/>`,
    },
    ja: {
        default: `<ConcentricProgressCard
  title="ストレージ概要"
  description="カテゴリ別の使用量"
  value="155GB"
  centerLabel="使用済み容量"
  delta="61%"
  metrics={metrics}
  rings={rings}
  selectedIndex={1}
  max={256}
  formatValue={(value) => \`\${value}GB\`}
  maxLabel="総容量"
/>`,
        compact: `<ConcentricProgressCard
  variant="compact"
  title="リソース負荷"
  description="現在の利用率"
  value="74%"
  centerLabel="ピーク"
  rings={rings}
  selectedIndex={0}
  max={100}
  formatValue={(value) => \`\${value}%\`}
/>`,
        selected: `import { useState } from "react";

export function StorageSelection() {
  const [selectedIndex, setSelectedIndex] = useState(1);

  return (
    <ConcentricProgressCard
      title="選択中リング"
      description="selectedIndex で確認中のリングを固定します。"
      value="68GB"
      centerLabel="メディア"
      rings={rings}
      selectedIndex={selectedIndex}
      onRingSelect={(_, index) => setSelectedIndex(index)}
      max={256}
      formatValue={(value) => \`\${value}GB\`}
      maxLabel="総容量"
    />
  );
}`,
        metrics: `<ConcentricProgressCard
  title="容量サマリー"
  description="リング上部に概要値を並べます。"
  metrics={metrics}
  rings={rings}
  selectedIndex={2}
  max={256}
  formatValue={(value) => \`\${value}GB\`}
  maxLabel="総容量"
/>`,
        chartOnly: `<ConcentricProgressCard
  title="チャートのみ"
  description="詳細を上位ビューで持つ場合は凡例を非表示にできます。"
  value="155GB"
  centerLabel="使用済み"
  rings={rings}
  showLegend={false}
  max={256}
  formatValue={(value) => \`\${value}GB\`}
  maxLabel="総容量"
/>`,
    },
} as const;

const propsDataByLocale = {
    en: [
        {
            name: "rings",
            type: "{ label?: ReactNode; value: number; color?: ChartColor; description?: ReactNode; detail?: ReactNode }[]",
            description: "Progress rings rendered as selectable concentric bands.",
        },
        {
            name: "metrics",
            type: "{ label: ReactNode; value: ReactNode; description?: ReactNode }[]",
            description: "Optional summary metrics shown above the ring chart.",
        },
        {
            name: "selectedIndex",
            type: "number",
            description: "Highlights the ring currently being inspected.",
        },
        {
            name: "max",
            type: "number",
            description: "Maximum value used to normalize every ring.",
        },
        {
            name: "variant",
            type: "\"default\" | \"compact\"",
            default: "\"default\"",
            description: "Registered SSOT variant for card density.",
        },
        {
            name: "showLegend",
            type: "boolean",
            default: "true",
            description: "Shows or hides the ring detail rows next to the chart.",
        },
        {
            name: "caption",
            type: "ReactNode",
            description: "Optional note rendered below the chart and legend.",
        },
        {
            name: "formatValue",
            type: "(value: number) => ReactNode",
            description: "Formats ring, metric, tooltip, and legend values. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Use valueFormat for RSC-safe formatting.",
        },
        {
            name: "valueFormat",
            type: "\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions",
            description: "Serializable numeric format — the RSC-safe alternative to formatValue. Ignored when formatValue is set. Fixed en-US locale. (#338)",
        },
        {
            name: "maxLabel",
            type: "ReactNode",
            default: "\"Max\"",
            description: "Label used when the tooltip describes the normalized maximum.",
        },
        {
            name: "onRingSelect",
            type: "(ring: ConcentricProgressRing, index: number) => void",
            description: "Called when a ring or legend row is selected.",
        },
    ],
    ja: [
        {
            name: "rings",
            type: "{ label?: ReactNode; value: number; color?: ChartColor; description?: ReactNode; detail?: ReactNode }[]",
            description: "選択可能な同心円バンドとして表示する進捗リングです。",
        },
        {
            name: "metrics",
            type: "{ label: ReactNode; value: ReactNode; description?: ReactNode }[]",
            description: "リング上部に表示する任意の概要指標です。",
        },
        {
            name: "selectedIndex",
            type: "number",
            description: "確認中のリングを強調します。",
        },
        {
            name: "max",
            type: "number",
            description: "各リングを正規化する最大値です。",
        },
        {
            name: "variant",
            type: "\"default\" | \"compact\"",
            default: "\"default\"",
            description: "カード密度を切り替える SSOT 登録済みバリアントです。",
        },
        {
            name: "showLegend",
            type: "boolean",
            default: "true",
            description: "チャート横のリング詳細行を表示または非表示にします。",
        },
        {
            name: "caption",
            type: "ReactNode",
            description: "チャートと凡例の下に表示する任意の補足です。",
        },
        {
            name: "formatValue",
            type: "(value: number) => ReactNode",
            description: "リング、指標、ツールチップ、凡例の値を整形します。 関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。RSC 安全な整形には valueFormat を使う。",
        },
        {
            name: "valueFormat",
            type: "\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions",
            description: "シリアライズ可能な数値フォーマット＝formatValue の RSC 安全な代替。formatValue 指定時は無視。en-US ロケール固定。(#338)",
        },
        {
            name: "maxLabel",
            type: "ReactNode",
            default: "\"Max\"",
            description: "ツールチップで正規化の最大値を示すラベルです。",
        },
        {
            name: "onRingSelect",
            type: "(ring: ConcentricProgressRing, index: number) => void",
            description: "リングまたは凡例行が選択されたときに呼ばれます。",
        },
    ],
} as const;

export default function ConcentricProgressCardPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const { locale, sectionLabels } = useLocale();
    const stateCodeData = usageCodeByLocale[locale]
        .split("\n\n<ConcentricProgressCard")[0]
        .replace('import { ConcentricProgressCard } from "@gunjo/ui";\n\n', "");
    const withStateCodeData = (nextCode: string) => `${stateCodeData}\n\n${nextCode}`;
    const rings = ringsByLocale[locale];
    const compactRings = compactRingsByLocale[locale];
    const metrics = metricsByLocale[locale];

    return (
        <ComponentLayout
            title={locale === "ja" ? "同心円進捗カード" : meta.concentricProgressCard.title}
            description={meta.concentricProgressCard.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: locale === "ja" ? "同心円進捗カード" : "ConcentricProgressCard", href: "/docs/components/concentric-progress-card" },
                { name: locale === "ja" ? "ツールチップ" : "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: locale === "ja" ? "ラジアルバーチャート" : "RadialBarChart", href: "/docs/components/radial-bar-chart" },
                { name: locale === "ja" ? "ゲージチャート" : "GaugeChart", href: "/docs/components/gauge-chart" },
                { name: locale === "ja" ? "分析カード" : "AnalyticsCard", href: "/docs/components/analytics-card" },
                { name: locale === "ja" ? "統計" : "Statistic", href: "/docs/components/statistic" },
            ]}
        >
            <ChartPreviewWithControls
                code={codeByLocale[locale]}
                demo="concentric-progress-card"
                embedBase="/embed/concentric-progress-card"
                previewHeight={540}
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
                                ? "概要指標、選択中リング、中央の値、凡例をまとめて表示する標準の SSOT 登録済みバリエーションです。"
                                : "The default registered SSOT variant with metrics, selected ring, center value, and legend.",
                            preview: (
                                <ConcentricProgressCard
                                    className="mx-auto max-w-3xl"
                                    title={locale === "ja" ? "ストレージ概要" : "Storage overview"}
                                    description={locale === "ja" ? "カテゴリ別の使用量" : "Storage by category"}
                                    value="155GB"
                                    centerLabel={locale === "ja" ? "使用済み容量" : "Used storage"}
                                    delta="61%"
                                    metrics={metrics}
                                    rings={rings}
                                    selectedIndex={1}
                                    max={256}
                                    formatValue={(value) => `${value}GB`}
                                    maxLabel={locale === "ja" ? "総容量" : "Capacity"}
                                />
                            ),
                            previewBodyWidth: "xl",
                            code: withStateCodeData(stateCodeByLocale[locale].default),
                        },
                        {
                            key: "compact",
                            title: locale === "ja" ? "コンパクト" : "Compact",
                            description: locale === "ja"
                                ? "狭いカードやサイドパネルで余白とチャートサイズを抑える SSOT 登録済みバリエーションです。"
                                : "A registered SSOT variant that reduces spacing and chart size for narrow cards or side panels.",
                            preview: (
                                <ConcentricProgressCard
                                    className="mx-auto max-w-md"
                                    variant="compact"
                                    title={locale === "ja" ? "リソース負荷" : "Resource load"}
                                    description={locale === "ja" ? "現在の利用率" : "Current utilization"}
                                    value="74%"
                                    centerLabel={locale === "ja" ? "ピーク" : "Peak"}
                                    rings={compactRings}
                                    selectedIndex={0}
                                    max={100}
                                    formatValue={(value) => `${value}%`}
                                    maxLabel={locale === "ja" ? "最大" : "Max"}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: withStateCodeData(stateCodeByLocale[locale].compact),
                        },
                        {
                            key: "selected-ring",
                            title: locale === "ja" ? "選択中リング" : "Selected ring",
                            description: locale === "ja"
                                ? "確認中のリングを固定し、リングや凡例行の選択を受け取る状態です。"
                                : "Use selectedIndex to pin the focused ring and onRingSelect to receive ring or legend-row selection.",
                            preview: (
                                <ConcentricProgressCard
                                    className="mx-auto max-w-2xl"
                                    title={locale === "ja" ? "選択中リング" : "Selected ring"}
                                    description={locale === "ja" ? "確認中のカテゴリを強調します" : "Highlights the inspected category"}
                                    value="68GB"
                                    centerLabel={locale === "ja" ? "メディア" : "Media"}
                                    rings={rings}
                                    selectedIndex={1}
                                    onRingSelect={() => undefined}
                                    max={256}
                                    formatValue={(value) => `${value}GB`}
                                    maxLabel={locale === "ja" ? "総容量" : "Capacity"}
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: withStateCodeData(stateCodeByLocale[locale].selected),
                        },
                        {
                            key: "metrics",
                            title: locale === "ja" ? "概要指標付き" : "With metrics",
                            description: locale === "ja"
                                ? "リングの上に使用量、総容量、選択カテゴリなどの概要値を並べる状態です。"
                                : "Shows summary values such as usage, capacity, and selected category above the rings.",
                            preview: (
                                <ConcentricProgressCard
                                    className="mx-auto max-w-3xl"
                                    title={locale === "ja" ? "容量サマリー" : "Capacity summary"}
                                    description={locale === "ja" ? "概要値とリングを合わせて確認します" : "Combines summary metrics and rings"}
                                    metrics={metrics}
                                    rings={rings}
                                    selectedIndex={2}
                                    max={256}
                                    formatValue={(value) => `${value}GB`}
                                    maxLabel={locale === "ja" ? "総容量" : "Capacity"}
                                />
                            ),
                            previewBodyWidth: "xl",
                            code: withStateCodeData(stateCodeByLocale[locale].metrics),
                        },
                        {
                            key: "chart-only",
                            title: locale === "ja" ? "凡例なし" : "Without legend",
                            description: locale === "ja"
                                ? "詳細やランキングを上位ビューで持つ場合に、チャートだけを中央に見せる状態です。"
                                : "Disable showLegend when a parent view owns details or ranking outside the card.",
                            preview: (
                                <ConcentricProgressCard
                                    className="mx-auto max-w-md"
                                    title={locale === "ja" ? "チャートのみ" : "Chart only"}
                                    description={locale === "ja" ? "詳細は親ビューで表示" : "Details live in the parent view"}
                                    value="155GB"
                                    centerLabel={locale === "ja" ? "使用済み" : "Used"}
                                    rings={rings}
                                    showLegend={false}
                                    max={256}
                                    formatValue={(value) => `${value}GB`}
                                    maxLabel={locale === "ja" ? "総容量" : "Capacity"}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: withStateCodeData(stateCodeByLocale[locale].chartOnly),
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
                    <CodeCopyButton code={usageCodeByLocale[locale]} />
                </div>
                <CodeBlock code={usageCodeByLocale[locale]} />
            </div>
        </ComponentLayout>
    );
}
