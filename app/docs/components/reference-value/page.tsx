"use client";

import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { ReferenceValue, flagValue, type RangeFlag, type ReferenceRange } from "@gunjo/ui";

type Locale = "ja" | "en";

type ResultRow = { name: string; value: number; unit: string; range: ReferenceRange };

function flagLabels(locale: Locale): Partial<Record<RangeFlag, string>> | undefined {
  return locale === "ja"
    ? undefined
    : {
        normal: "Within range",
        high: "High",
        low: "Low",
        "critical-high": "Critical high",
        "critical-low": "Critical low",
      };
}

function resultRows(locale: Locale): ResultRow[] {
  return locale === "ja"
    ? [
        { name: "体温", value: 38.9, unit: "℃", range: { low: 36.0, high: 37.5, criticalHigh: 40.0 } },
        { name: "SpO₂", value: 88, unit: "%", range: { low: 96, criticalLow: 90 } },
        { name: "脈拍", value: 72, unit: "回/分", range: { low: 60, high: 100 } },
        { name: "K（カリウム）", value: 6.8, unit: "mEq/L", range: { low: 3.5, high: 5.0, criticalHigh: 6.0 } },
      ]
    : [
        { name: "Temperature", value: 38.9, unit: "C", range: { low: 36.0, high: 37.5, criticalHigh: 40.0 } },
        { name: "SpO2", value: 88, unit: "%", range: { low: 96, criticalLow: 90 } },
        { name: "Pulse", value: 72, unit: "bpm", range: { low: 60, high: 100 } },
        { name: "Potassium", value: 6.8, unit: "mEq/L", range: { low: 3.5, high: 5.0, criticalHigh: 6.0 } },
      ];
}

function ReferenceValuePreview({ locale, mode = "table" }: { locale: Locale; mode?: "table" | "labels" | "hideFlag" }) {
  const labels = flagLabels(locale);
  const rangeLabel = locale === "ja" ? "基準" : "Range";
  const rows = resultRows(locale);

  if (mode === "labels") {
    return (
      <div className="grid w-full max-w-md gap-3 rounded-lg border bg-card p-4">
        <ReferenceValue value={38.9} unit={locale === "ja" ? "℃" : "C"} range={{ low: 36, high: 37.5, criticalHigh: 40 }} labels={labels} showLabel showRange rangeLabel={rangeLabel} format={(value) => value.toFixed(1)} />
        <ReferenceValue value={88} unit="%" range={{ low: 96, criticalLow: 90 }} labels={labels} showLabel showRange rangeLabel={rangeLabel} />
        <ReferenceValue value={72} unit={locale === "ja" ? "回/分" : "bpm"} range={{ low: 60, high: 100 }} labels={labels} showLabel showRange rangeLabel={rangeLabel} />
      </div>
    );
  }

  if (mode === "hideFlag") {
    return (
      <div className="grid w-full max-w-md gap-3 rounded-lg border bg-card p-4">
        <ReferenceValue value={6.8} unit="mEq/L" range={{ low: 3.5, high: 5.0, criticalHigh: 6.0 }} labels={labels} hideFlag showRange rangeLabel={rangeLabel} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg rounded-lg border bg-card p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th scope="col" className="py-1.5 pr-3 font-medium">{locale === "ja" ? "項目" : "Metric"}</th>
            <th scope="col" className="py-1.5 font-medium">{locale === "ja" ? "結果" : "Result"}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b last:border-0">
              <th scope="row" className="py-2 pr-3 text-left font-normal text-foreground">{row.name}</th>
              <td className="py-2">
                <ReferenceValue
                  value={row.value}
                  unit={row.unit}
                  range={row.range}
                  labels={labels}
                  rangeLabel={rangeLabel}
                  size="inline"
                  showRange
                  format={(value) => (Number.isInteger(value) ? String(value) : value.toFixed(1))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ReferenceValueDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/reference-value", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.referenceValue.title ?? "ReferenceValue";
  const description = content?.description ?? metadata.referenceValue.description ?? "";

  const usageCode = locale === "ja"
    ? `import { ReferenceValue, type ReferenceRange } from "@gunjo/ui";

type ResultRow = { name: string; value: number; unit: string; range: ReferenceRange };

const rows: ResultRow[] = [
  { name: "体温", value: 38.9, unit: "℃", range: { low: 36.0, high: 37.5, criticalHigh: 40.0 } },
  { name: "SpO₂", value: 88, unit: "%", range: { low: 96, criticalLow: 90 } },
  { name: "脈拍", value: 72, unit: "回/分", range: { low: 60, high: 100 } },
  { name: "K（カリウム）", value: 6.8, unit: "mEq/L", range: { low: 3.5, high: 5.0, criticalHigh: 6.0 } },
];

export function VitalResultTable() {
  return (
    <div className="w-full max-w-lg rounded-lg border bg-card p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th scope="col" className="py-1.5 pr-3 font-medium">項目</th>
            <th scope="col" className="py-1.5 font-medium">結果</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b last:border-0">
              <th scope="row" className="py-2 pr-3 text-left font-normal text-foreground">{row.name}</th>
              <td className="py-2">
                <ReferenceValue
                  value={row.value}
                  unit={row.unit}
                  range={row.range}
                  rangeLabel="基準"
                  size="inline"
                  showRange
                  format={(value) => (Number.isInteger(value) ? String(value) : value.toFixed(1))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`
    : `import { ReferenceValue, type RangeFlag, type ReferenceRange } from "@gunjo/ui";

const labels: Partial<Record<RangeFlag, string>> = {
  normal: "Within range",
  high: "High",
  low: "Low",
  "critical-high": "Critical high",
  "critical-low": "Critical low",
};

type ResultRow = { name: string; value: number; unit: string; range: ReferenceRange };

const rows: ResultRow[] = [
  { name: "Temperature", value: 38.9, unit: "C", range: { low: 36.0, high: 37.5, criticalHigh: 40.0 } },
  { name: "SpO2", value: 88, unit: "%", range: { low: 96, criticalLow: 90 } },
  { name: "Pulse", value: 72, unit: "bpm", range: { low: 60, high: 100 } },
  { name: "Potassium", value: 6.8, unit: "mEq/L", range: { low: 3.5, high: 5.0, criticalHigh: 6.0 } },
];

export function VitalResultTable() {
  return (
    <div className="w-full max-w-lg rounded-lg border bg-card p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th scope="col" className="py-1.5 pr-3 font-medium">Metric</th>
            <th scope="col" className="py-1.5 font-medium">Result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b last:border-0">
              <th scope="row" className="py-2 pr-3 text-left font-normal text-foreground">{row.name}</th>
              <td className="py-2">
                <ReferenceValue
                  value={row.value}
                  unit={row.unit}
                  range={row.range}
                  labels={labels}
                  rangeLabel="Range"
                  size="inline"
                  showRange
                  format={(value) => (Number.isInteger(value) ? String(value) : value.toFixed(1))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`;

  const labelsStateCode = locale === "ja"
    ? `import { ReferenceValue } from "@gunjo/ui";

export function LabeledReferenceValues() {
  return (
    <div className="grid w-full max-w-md gap-3 rounded-lg border bg-card p-4">
      <ReferenceValue value={38.9} unit="℃" range={{ low: 36, high: 37.5, criticalHigh: 40 }} showLabel showRange rangeLabel="基準" format={(value) => value.toFixed(1)} />
      <ReferenceValue value={88} unit="%" range={{ low: 96, criticalLow: 90 }} showLabel showRange rangeLabel="基準" />
      <ReferenceValue value={72} unit="回/分" range={{ low: 60, high: 100 }} showLabel showRange rangeLabel="基準" />
    </div>
  );
}`
    : `import { ReferenceValue, type RangeFlag } from "@gunjo/ui";

const labels: Partial<Record<RangeFlag, string>> = {
  normal: "Within range",
  high: "High",
  low: "Low",
  "critical-high": "Critical high",
  "critical-low": "Critical low",
};

export function LabeledReferenceValues() {
  return (
    <div className="grid w-full max-w-md gap-3 rounded-lg border bg-card p-4">
      <ReferenceValue value={38.9} unit="C" range={{ low: 36, high: 37.5, criticalHigh: 40 }} labels={labels} showLabel showRange rangeLabel="Range" format={(value) => value.toFixed(1)} />
      <ReferenceValue value={88} unit="%" range={{ low: 96, criticalLow: 90 }} labels={labels} showLabel showRange rangeLabel="Range" />
      <ReferenceValue value={72} unit="bpm" range={{ low: 60, high: 100 }} labels={labels} showLabel showRange rangeLabel="Range" />
    </div>
  );
}`;

  const hideFlagStateCode = locale === "ja"
    ? `import { ReferenceValue } from "@gunjo/ui";

export function CompactReferenceValue() {
  return (
    <div className="grid w-full max-w-md gap-3 rounded-lg border bg-card p-4">
      <ReferenceValue value={6.8} unit="mEq/L" range={{ low: 3.5, high: 5.0, criticalHigh: 6.0 }} hideFlag showRange rangeLabel="基準" />
    </div>
  );
}`
    : `import { ReferenceValue, type RangeFlag } from "@gunjo/ui";

const labels: Partial<Record<RangeFlag, string>> = {
  normal: "Within range",
  high: "High",
  low: "Low",
  "critical-high": "Critical high",
  "critical-low": "Critical low",
};

export function CompactReferenceValue() {
  return (
    <div className="grid w-full max-w-md gap-3 rounded-lg border bg-card p-4">
      <ReferenceValue value={6.8} unit="mEq/L" range={{ low: 3.5, high: 5.0, criticalHigh: 6.0 }} labels={labels} hideFlag showRange rangeLabel="Range" />
    </div>
  );
}`;

  const propsData = [
    { name: "value", type: "number", description: locale === "ja" ? "計測値です。" : "Measured value." },
    { name: "range", type: "{ low?: number; high?: number; criticalLow?: number; criticalHigh?: number }", description: locale === "ja" ? "正常範囲と異常値境界です。critical が通常の low/high より優先されます。" : "Normal and critical bounds. Critical thresholds win over normal low/high bounds." },
    { name: "format", type: "(value: number) => ReactNode", description: locale === "ja" ? "値と基準範囲の数値表示を整形します。" : "Formats the value and range bounds." },
    { name: "unit", type: "string", description: locale === "ja" ? "単位サフィックスです。" : "Unit suffix." },
    { name: "labels", type: "Partial<Record<RangeFlag, string>>", description: locale === "ja" ? "状態ラベルをローカライズします。showLabel と sr-only に使われます。" : "Localized flag labels used visibly with showLabel and in screen-reader text." },
    { name: "showLabel", type: "boolean", default: "false", description: locale === "ja" ? "H/L/HH/LL の横に状態名を表示します。" : "Shows the flag label next to H/L/HH/LL." },
    { name: "showRange / rangeLabel", type: "boolean / string", description: locale === "ja" ? "基準範囲のテキストとその接頭辞です。" : "Normal-range text and its prefix." },
    { name: "hideFlag", type: "boolean", default: "false", description: locale === "ja" ? "チップを非表示にします。値のトーンと sr-only ラベルは残ります。" : "Hides the chip while preserving tone and screen-reader label." },
    { name: "affirmative / positiveLabel", type: "boolean / string", default: "false", description: locale === "ja" ? "基準値内の値に肯定的な success チップ（✓＋positiveLabel、既定は normal ラベル）と success トーンを付けます。合格・平均以上など「良い」値を積極的に示したい時に。異常値では無視されます。(#291)" : "Give an in-range value an affirmative success chip (✓ + positiveLabel, default = the normal label) and success tone — for passing/above-average values worth a positive highlight. Ignored for abnormal values. (#291)" },
    { name: "size", type: '"default" | "inline"', default: '"default"', description: locale === "ja" ? "表セル向けの compact 表示にできます。" : "Compact inline size for table cells." },
    { name: "flagValue", type: "(value, range) => RangeFlag", description: locale === "ja" ? "UIなしで同じ判定を返す純関数です。" : "Pure helper that returns the same classification without UI." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "ReferenceValue", href: "/docs/components/reference-value" }]}
      relatedComponents={[{ name: "Table", href: "/docs/components/table" }, { name: "LimitMonitor", href: "/docs/components/limit-monitor" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <ReferenceValuePreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "range",
              title: locale === "ja" ? "基準範囲つき" : "With reference range",
              description: locale === "ja" ? "showRange で正常範囲を値の横に表示します。" : "showRange renders the reference range beside the value.",
              preview: <ReferenceValuePreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "md",
            },
            {
              key: "labels",
              title: locale === "ja" ? "状態名を表示" : "Visible labels",
              description: locale === "ja" ? "showLabel はコードに加えて「高値」「異常低値」などのラベルを見せます。" : "showLabel adds words such as High or Critical low next to the code.",
              preview: <ReferenceValuePreview locale={locale} mode="labels" />,
              code: labelsStateCode,
              previewBodyWidth: "md",
            },
            {
              key: "hide-flag",
              title: locale === "ja" ? "チップなし" : "Hidden chip",
              description: locale === "ja" ? "hideFlag は表内などでチップを省きたい場合に使います。" : "hideFlag is useful when table density cannot afford a chip.",
              preview: <ReferenceValuePreview locale={locale} mode="hideFlag" />,
              code: hideFlagStateCode,
              previewBodyWidth: "md",
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
