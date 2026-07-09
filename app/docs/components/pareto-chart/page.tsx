"use client";

import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { ParetoChart } from "@gunjo/ui";

type Locale = "ja" | "en";

function paretoData(locale: Locale) {
  return locale === "ja"
    ? [
        { label: "チョコ停", value: 142 },
        { label: "段取替え", value: 96 },
        { label: "故障", value: 64, color: "destructive" as const },
        { label: "材料待ち", value: 38 },
        { label: "品質調整", value: 22 },
        { label: "その他", value: 11, color: "muted" as const },
      ]
    : [
        { label: "Micro-stops", value: 142 },
        { label: "Changeover", value: 96 },
        { label: "Failure", value: 64, color: "destructive" as const },
        { label: "Material wait", value: 38 },
        { label: "Quality tuning", value: 22 },
        { label: "Other", value: 11, color: "muted" as const },
      ];
}

function paretoDataCode(locale: Locale) {
  return locale === "ja"
    ? `[
  { label: "チョコ停", value: 142 },
  { label: "段取替え", value: 96 },
  { label: "故障", value: 64, color: "destructive" },
  { label: "材料待ち", value: 38 },
  { label: "品質調整", value: 22 },
  { label: "その他", value: 11, color: "muted" },
]`
    : `[
  { label: "Micro-stops", value: 142 },
  { label: "Changeover", value: 96 },
  { label: "Failure", value: 64, color: "destructive" },
  { label: "Material wait", value: 38 },
  { label: "Quality tuning", value: 22 },
  { label: "Other", value: 11, color: "muted" },
]`;
}

function paretoChartStateCode(locale: Locale, mode: "default" | "noThreshold" | "unsorted") {
  const label = locale === "ja" ? "停止時間" : "Downtime";
  const cumulativeLabel = locale === "ja" ? "累計" : "Cumulative";
  const thresholdLabel = locale === "ja" ? "主要因 80%" : "Vital 80%";
  const unit = locale === "ja" ? "分" : " min";
  const data = mode === "unsorted" ? `[...${paretoDataCode(locale)}].reverse()` : paretoDataCode(locale);
  const formatValue = locale === "ja" ? "(value) => `${value}分`" : "(value) => `${value} min`";

  return `<ParetoChart
  data={${data}}
  label="${label}"
  cumulativeLabel="${cumulativeLabel}"
  threshold={${mode === "noThreshold" ? "null" : "80"}}
  ${mode === "noThreshold" ? "" : `thresholdLabel="${thresholdLabel}"\n  `}sort={${mode === "unsorted" ? "false" : "true"}}
  formatValue={${formatValue}}
  ${mode === "default" ? "showValues" : ""}
/>`;
}

function ParetoChartPreview({ locale, mode = "default" }: { locale: Locale; mode?: "default" | "noThreshold" | "unsorted" }) {
  const copy = locale === "ja"
    ? {
        label: "停止時間",
        cumulative: "累計",
        threshold: "主要因 80%",
        unit: "分",
      }
    : {
        label: "Downtime",
        cumulative: "Cumulative",
        threshold: "Vital 80%",
        unit: "min",
      };
  const data = mode === "unsorted" ? [...paretoData(locale)].reverse() : paretoData(locale);

  return (
    <div className="flex w-full max-w-3xl flex-col rounded-lg border bg-card p-4">
      <ParetoChart
        data={data}
        label={copy.label}
        cumulativeLabel={copy.cumulative}
        threshold={mode === "noThreshold" ? null : 80}
        thresholdLabel={mode === "noThreshold" ? undefined : copy.threshold}
        sort={mode !== "unsorted"}
        formatValue={(value) => locale === "ja" ? `${value}${copy.unit}` : `${value} ${copy.unit}`}
        showValues={mode === "default"}
      />
    </div>
  );
}

export default function ParetoChartDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/pareto-chart", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.paretoChart.title ?? "ParetoChart";
  const description = content?.description ?? metadata.paretoChart.description ?? "";

  const usageCode = locale === "ja"
    ? `import { ParetoChart } from "@gunjo/ui";

const downtimeCauses = [
  { label: "チョコ停", value: 142 },
  { label: "段取替え", value: 96 },
  { label: "故障", value: 64, color: "destructive" },
  { label: "材料待ち", value: 38 },
  { label: "品質調整", value: 22 },
  { label: "その他", value: 11, color: "muted" },
];

export function DowntimePareto() {
  return (
    <div className="flex w-full max-w-3xl flex-col rounded-lg border bg-card p-4">
      <ParetoChart
        data={downtimeCauses}
        label="停止時間"
        cumulativeLabel="累計"
        threshold={80}
        thresholdLabel="主要因 80%"
        formatValue={(value) => \`\${value}分\`}
        showValues
      />
    </div>
  );
}`
    : `import { ParetoChart } from "@gunjo/ui";

const downtimeCauses = [
  { label: "Micro-stops", value: 142 },
  { label: "Changeover", value: 96 },
  { label: "Failure", value: 64, color: "destructive" },
  { label: "Material wait", value: 38 },
  { label: "Quality tuning", value: 22 },
  { label: "Other", value: 11, color: "muted" },
];

export function DowntimePareto() {
  return (
    <div className="flex w-full max-w-3xl flex-col rounded-lg border bg-card p-4">
      <ParetoChart
        data={downtimeCauses}
        label="Downtime"
        cumulativeLabel="Cumulative"
        threshold={80}
        thresholdLabel="Vital 80%"
        formatValue={(value) => \`\${value} min\`}
        showValues
      />
    </div>
  );
}`;

  const propsData = [
    { name: "data", type: "{ label?: ReactNode; value: number; color?: ChartColor }[]", description: locale === "ja" ? "要因ごとの値です。既定では value の降順に並び替えます。" : "Category values. Sorted descending by value by default." },
    { name: "threshold", type: "number | null", default: "80", description: locale === "ja" ? "累積率の基準線です。null で非表示にします。" : "Cumulative percentage reference line. Set null to hide it." },
    { name: "thresholdLabel", type: "ReactNode", description: locale === "ja" ? "基準線のラベルです。省略時は割合を表示します。" : "Label for the threshold line. Defaults to the percentage." },
    { name: "sort", type: "boolean", default: "true", description: locale === "ja" ? "値の降順に並べるかどうかです。false で渡した順を保ちます。" : "Whether to sort descending. false preserves input order." },
    { name: "formatValue", type: "(value: number) => ReactNode", description: locale === "ja" ? "棒の値と tooltip の値を整形します。" : "Formats bar and tooltip values." },
    { name: "formatPercent", type: "(percent: number) => ReactNode", default: '"<n>%"', description: locale === "ja" ? "累積率の表示を整形します。" : "Formats cumulative percentages." },
    { name: "showGrid", type: "boolean", default: "true", description: locale === "ja" ? "25/50/75/100% の横グリッドを表示します。" : "Shows 25/50/75/100 percent grid lines." },
    { name: "showValues", type: "boolean", default: "false", description: locale === "ja" ? "各棒の上に値を表示します。" : "Shows values above each bar." },
    { name: "showLegend", type: "boolean", default: "true", description: locale === "ja" ? "棒、累積線、基準線の凡例を表示します。" : "Shows the bar, cumulative, and threshold legend." },
    { name: "label", type: "ReactNode", description: locale === "ja" ? "チャートのアクセシブル名と棒の凡例ラベルです。" : "Accessible chart name and bar legend label." },
    { name: "cumulativeLabel", type: "ReactNode", default: '"Cumulative"', description: locale === "ja" ? "累積線の凡例と tooltip ラベルです。" : "Legend and tooltip label for the cumulative line." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "ParetoChart", href: "/docs/components/pareto-chart" }]}
      relatedComponents={[{ name: "BarChart", href: "/docs/components/charts" }, { name: "LineChart", href: "/docs/components/charts" }, { name: "Tooltip", href: "/docs/components/tooltip" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="xl">
        <ParetoChartPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "threshold",
              title: locale === "ja" ? "80%基準線" : "80% threshold",
              description: locale === "ja" ? "既定の Pareto 表示です。基準線と累積線で主要因を読み取ります。" : "The default Pareto view uses the threshold and cumulative line to find vital causes.",
              preview: <ParetoChartPreview locale={locale} />,
              code: paretoChartStateCode(locale, "default"),
              previewBodyWidth: "xl",
            },
            {
              key: "no-threshold",
              title: locale === "ja" ? "基準線なし" : "No threshold",
              description: locale === "ja" ? "累積の傾向だけを見たい場合は threshold={null} で基準線を隠します。" : "Use threshold={null} when the cumulative trend matters more than a cutoff.",
              preview: <ParetoChartPreview locale={locale} mode="noThreshold" />,
              code: paretoChartStateCode(locale, "noThreshold"),
              previewBodyWidth: "xl",
            },
            {
              key: "unsorted",
              title: locale === "ja" ? "入力順を保持" : "Preserve input order",
              description: locale === "ja" ? "時系列や工程順で見せたい場合は sort={false} を使います。" : "Use sort={false} when sequence or process order matters more than Pareto ordering.",
              preview: <ParetoChartPreview locale={locale} mode="unsorted" />,
              code: paretoChartStateCode(locale, "unsorted"),
              previewBodyWidth: "xl",
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
          {sectionLabels.props}
        </h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
            {sectionLabels.usage}
          </h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>
    </ComponentLayout>
  );
}
