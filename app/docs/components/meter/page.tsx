"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Button, Meter } from "@gunjo/ui";

type Locale = "ja" | "en";

const MAX_WEIGHT = 3000;
const NEXT_WEIGHT = 350;

function formatWeight(locale: Locale) {
  return (value: number) => locale === "ja" ? `${value.toLocaleString("ja-JP")}kg` : `${value.toLocaleString("en-US")} kg`;
}

function MeterPreview({ locale, mode = "capacity" }: { locale: Locale; mode?: "capacity" | "target" | "inline" }) {
  const [loaded, setLoaded] = React.useState(2100);
  const [previewIncoming, setPreviewIncoming] = React.useState(false);
  const incoming = previewIncoming ? NEXT_WEIGHT : undefined;
  const projected = Math.min(MAX_WEIGHT, loaded + NEXT_WEIGHT);
  const copy = locale === "ja"
    ? {
        label: "重量積載率",
        add: `次の出荷を積む（+${NEXT_WEIGHT}kg）`,
        reset: "リセット",
        current: "現在",
        projected: "反映後",
        shelf: "棚充填",
        target: "稼働率（目標 90%）",
        coverage: "受注カバー率",
      }
    : {
        label: "Weight load",
        add: `Add next shipment (+${NEXT_WEIGHT} kg)`,
        reset: "Reset",
        current: "Current",
        projected: "Projected",
        shelf: "Bin fill",
        target: "Utilization target 90%",
        coverage: "Order coverage",
      };

  if (mode === "target") {
    return (
      <div className="grid w-full max-w-lg gap-4 rounded-lg border bg-card p-4">
        <Meter label={copy.target} value={86} max={100} unit="%" direction="higher-is-better" target={90} />
        <Meter label={copy.coverage} value={87} max={100} unit="%" direction="fill-is-good" />
        <Meter
          label={locale === "ja" ? "予算消化" : "Budget spent"}
          value={2_340_000}
          max={3_000_000}
          direction="higher-is-worse"
          formatValue={(value) => locale === "ja" ? `¥${value.toLocaleString("ja-JP")}` : `$${value.toLocaleString("en-US")}`}
        />
      </div>
    );
  }

  if (mode === "inline") {
    const rows = [
      { bin: "D-01", value: 18, max: 40 },
      { bin: "D-02", value: 36, max: 40 },
      { bin: "D-03", value: 41, max: 40 },
    ];

    return (
      <table className="w-full max-w-lg rounded-lg border bg-card text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.bin} className="border-b last:border-b-0">
              <th className="whitespace-nowrap px-3 py-3 text-left font-medium text-foreground">{row.bin}</th>
              <td className="w-full px-3 py-3">
                <Meter size="inline" value={row.value} max={row.max} label={`${row.bin} ${copy.shelf}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-5 rounded-lg border bg-card p-4">
      <Meter
        label={copy.label}
        value={loaded}
        max={MAX_WEIGHT}
        incoming={incoming}
        thresholds={{ warning: 0.8, over: 1 }}
        formatValue={formatWeight(locale)}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onMouseEnter={() => setPreviewIncoming(true)}
          onMouseLeave={() => setPreviewIncoming(false)}
          onFocus={() => setPreviewIncoming(true)}
          onBlur={() => setPreviewIncoming(false)}
          onClick={() => {
            setLoaded(projected);
            setPreviewIncoming(false);
          }}
        >
          {copy.add}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setLoaded(2100)}>
          {copy.reset}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md border bg-muted/30 px-3 py-2">
          <span className="text-muted-foreground">{copy.current}</span>
          <span className="mt-1 block font-medium tabular-nums text-foreground">{formatWeight(locale)(loaded)}</span>
        </div>
        <div className={previewIncoming ? "rounded-md border border-primary-border bg-primary-subtle px-3 py-2" : "rounded-md border bg-muted/30 px-3 py-2"}>
          <span className={previewIncoming ? "text-primary-subtle-foreground/80" : "text-muted-foreground"}>{copy.projected}</span>
          <span className={previewIncoming ? "mt-1 block font-medium tabular-nums text-primary-subtle-foreground" : "mt-1 block font-medium tabular-nums text-foreground"}>{formatWeight(locale)(projected)}</span>
        </div>
      </div>
    </div>
  );
}

export default function MeterDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/meter", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.meter.title ?? "Meter";
  const description = content?.description ?? metadata.meter.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { Button, Meter } from "@gunjo/ui";

const MAX_WEIGHT = 3000;
const NEXT_WEIGHT = 350;

export function ShipmentCapacityMeter() {
  const [loaded, setLoaded] = React.useState(2100);
  const [previewIncoming, setPreviewIncoming] = React.useState(false);
  const projected = Math.min(MAX_WEIGHT, loaded + NEXT_WEIGHT);

  return (
    <div className="flex w-full max-w-lg flex-col gap-5 rounded-lg border bg-card p-4">
      <Meter
        label="重量積載率"
        value={loaded}
        max={MAX_WEIGHT}
        incoming={previewIncoming ? NEXT_WEIGHT : undefined}
        thresholds={{ warning: 0.8, over: 1 }}
        formatValue={(value) => \`\${value.toLocaleString("ja-JP")}kg\`}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onMouseEnter={() => setPreviewIncoming(true)}
          onMouseLeave={() => setPreviewIncoming(false)}
          onFocus={() => setPreviewIncoming(true)}
          onBlur={() => setPreviewIncoming(false)}
          onClick={() => {
            setLoaded(projected);
            setPreviewIncoming(false);
          }}
        >
          次の出荷を積む（+350kg）
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setLoaded(2100)}>
          リセット
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md border bg-muted/30 px-3 py-2">
          <span className="text-muted-foreground">現在</span>
          <span className="mt-1 block font-medium tabular-nums text-foreground">{loaded.toLocaleString("ja-JP")}kg</span>
        </div>
        <div className={previewIncoming ? "rounded-md border border-primary-border bg-primary-subtle px-3 py-2" : "rounded-md border bg-muted/30 px-3 py-2"}>
          <span className={previewIncoming ? "text-primary-subtle-foreground/80" : "text-muted-foreground"}>反映後</span>
          <span className={previewIncoming ? "mt-1 block font-medium tabular-nums text-primary-subtle-foreground" : "mt-1 block font-medium tabular-nums text-foreground"}>{projected.toLocaleString("ja-JP")}kg</span>
        </div>
      </div>
    </div>
  );
}`
    : `import * as React from "react";
import { Button, Meter } from "@gunjo/ui";

const MAX_WEIGHT = 3000;
const NEXT_WEIGHT = 350;

export function ShipmentCapacityMeter() {
  const [loaded, setLoaded] = React.useState(2100);
  const [previewIncoming, setPreviewIncoming] = React.useState(false);
  const projected = Math.min(MAX_WEIGHT, loaded + NEXT_WEIGHT);

  return (
    <div className="flex w-full max-w-lg flex-col gap-5 rounded-lg border bg-card p-4">
      <Meter
        label="Weight load"
        value={loaded}
        max={MAX_WEIGHT}
        incoming={previewIncoming ? NEXT_WEIGHT : undefined}
        thresholds={{ warning: 0.8, over: 1 }}
        formatValue={(value) => \`\${value.toLocaleString("en-US")} kg\`}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onMouseEnter={() => setPreviewIncoming(true)}
          onMouseLeave={() => setPreviewIncoming(false)}
          onFocus={() => setPreviewIncoming(true)}
          onBlur={() => setPreviewIncoming(false)}
          onClick={() => {
            setLoaded(projected);
            setPreviewIncoming(false);
          }}
        >
          Add next shipment (+350 kg)
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setLoaded(2100)}>
          Reset
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md border bg-muted/30 px-3 py-2">
          <span className="text-muted-foreground">Current</span>
          <span className="mt-1 block font-medium tabular-nums text-foreground">{loaded.toLocaleString("en-US")} kg</span>
        </div>
        <div className={previewIncoming ? "rounded-md border border-primary-border bg-primary-subtle px-3 py-2" : "rounded-md border bg-muted/30 px-3 py-2"}>
          <span className={previewIncoming ? "text-primary-subtle-foreground/80" : "text-muted-foreground"}>Projected</span>
          <span className={previewIncoming ? "mt-1 block font-medium tabular-nums text-primary-subtle-foreground" : "mt-1 block font-medium tabular-nums text-foreground"}>{projected.toLocaleString("en-US")} kg</span>
        </div>
      </div>
    </div>
  );
}`;

  const targetStateCode = locale === "ja"
    ? `import { Meter } from "@gunjo/ui";

export function UtilizationMeters() {
  return (
    <div className="grid w-full max-w-lg gap-4 rounded-lg border bg-card p-4">
      <Meter label="稼働率（目標 90%）" value={86} max={100} unit="%" direction="higher-is-better" target={90} />
      <Meter label="受注カバー率" value={87} max={100} unit="%" direction="fill-is-good" />
      <Meter
        label="予算消化"
        value={2340000}
        max={3000000}
        direction="higher-is-worse"
        formatValue={(value) => \`¥\${value.toLocaleString("ja-JP")}\`}
      />
    </div>
  );
}`
    : `import { Meter } from "@gunjo/ui";

export function UtilizationMeters() {
  return (
    <div className="grid w-full max-w-lg gap-4 rounded-lg border bg-card p-4">
      <Meter label="Utilization target 90%" value={86} max={100} unit="%" direction="higher-is-better" target={90} />
      <Meter label="Order coverage" value={87} max={100} unit="%" direction="fill-is-good" />
      <Meter
        label="Budget spent"
        value={2340000}
        max={3000000}
        direction="higher-is-worse"
        formatValue={(value) => \`$\${value.toLocaleString("en-US")}\`}
      />
    </div>
  );
}`;

  const inlineStateCode = locale === "ja"
    ? `import { Meter } from "@gunjo/ui";

const rows = [
  { bin: "D-01", value: 18, max: 40 },
  { bin: "D-02", value: 36, max: 40 },
  { bin: "D-03", value: 41, max: 40 },
];

export function BinFillTable() {
  return (
    <table className="w-full max-w-lg rounded-lg border bg-card text-sm">
      <tbody>
        {rows.map((row) => (
          <tr key={row.bin} className="border-b last:border-b-0">
            <th className="whitespace-nowrap px-3 py-3 text-left font-medium text-foreground">{row.bin}</th>
            <td className="w-full px-3 py-3">
              <Meter size="inline" value={row.value} max={row.max} label={\`\${row.bin} 棚充填\`} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}`
    : `import { Meter } from "@gunjo/ui";

const rows = [
  { bin: "D-01", value: 18, max: 40 },
  { bin: "D-02", value: 36, max: 40 },
  { bin: "D-03", value: 41, max: 40 },
];

export function BinFillTable() {
  return (
    <table className="w-full max-w-lg rounded-lg border bg-card text-sm">
      <tbody>
        {rows.map((row) => (
          <tr key={row.bin} className="border-b last:border-b-0">
            <th className="whitespace-nowrap px-3 py-3 text-left font-medium text-foreground">{row.bin}</th>
            <td className="w-full px-3 py-3">
              <Meter size="inline" value={row.value} max={row.max} label={\`\${row.bin} Bin fill\`} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}`;

  const propsData = [
    { name: "value", type: "number", description: locale === "ja" ? "現在値です。" : "Current measured value." },
    { name: "max", type: "number", default: "100", description: locale === "ja" ? "範囲の上限です。0 以下の値は安全な既定値に正規化されます。" : "Upper bound of the range. Non-positive values are normalized to a safe default." },
    { name: "incoming", type: "number", description: locale === "ja" ? "追加予定分を斜線の上乗せとして表示し、反映後のトーン判定にも使います。" : "Pending additional amount rendered as a striped overlay and included in tone resolution." },
    { name: "thresholds", type: "{ warning?: number; over?: number }", default: "{ warning: 0.8, over: 1 }", description: locale === "ja" ? "higher-is-worse で warning / destructive に切り替える割合です。" : "Fractions that switch higher-is-worse meters to warning or destructive." },
    { name: "direction", type: '"higher-is-worse" | "higher-is-better" | "fill-is-good"', default: '"higher-is-worse"', description: locale === "ja" ? "高い値を悪い状態と見るか、目標以上を良い状態と見るか、満杯に近いほど良い状態と見るかを選びます。" : "Chooses whether high values are bad, at-target values are good, or fill toward max is good." },
    { name: "target", type: "number", description: locale === "ja" ? "目標線です。higher-is-better ではトーン判定にも使います。" : "Goal marker. With higher-is-better it also drives tone." },
    { name: "tone", type: '"success" | "warning" | "destructive" | "info" | "primary" | "muted"', description: locale === "ja" ? "自動判定を使わず明示的なトーンを指定します。" : "Forces the tone instead of deriving it." },
    { name: "label", type: "ReactNode", description: locale === "ja" ? "meter のアクセシブル名として使われるラベルです。" : "Visible label that also names the meter when it is a string." },
    { name: "valueText", type: "string", description: locale === "ja" ? "支援技術に読み上げる値の説明を上書きします。" : "Overrides the announced value text." },
    { name: "unit / formatValue", type: "string / (value) => string", description: locale === "ja" ? "表示値の単位または独自フォーマットです。" : "Unit suffix or custom visible value formatter." },
    { name: "size", type: '"default" | "sm" | "inline"', default: '"default"', description: locale === "ja" ? "通常、やや小さめ、表セル向けインラインのサイズです。" : "Default, small, or compact inline size for table cells." },
    { name: "showValue", type: "boolean", default: "true", description: locale === "ja" ? "数値の読み取り表示を出すかどうかです。" : "Whether to show the numeric readout." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "Meter", href: "/docs/components/meter" }, { name: "Button", href: "/docs/components/button" }]}
      relatedComponents={[{ name: "Progress", href: "/docs/components/progress" }, { name: "LimitMonitor", href: "/docs/components/limit-monitor" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="lg">
        <MeterPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "incoming",
              title: locale === "ja" ? "追加予定のプレビュー" : "Incoming preview",
              description: locale === "ja" ? "incoming は未確定の追加量を斜線で重ね、反映後の超過も先に示します。" : "incoming overlays a pending change and resolves the projected tone before it is committed.",
              preview: <MeterPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "lg",
            },
            {
              key: "target",
              title: locale === "ja" ? "目標値と充足率" : "Target and fill",
              description: locale === "ja" ? "direction を切り替えると、同じバーを稼働率や充足率にも使えます。" : "Change direction to use the same bar for utilization targets or completion.",
              preview: <MeterPreview locale={locale} mode="target" />,
              code: targetStateCode,
              previewBodyWidth: "lg",
            },
            {
              key: "inline",
              title: locale === "ja" ? "表セル向け" : "Inline table cell",
              description: locale === "ja" ? "size=\"inline\" は一覧表の中で幅を取りすぎない薄い表示です。" : "size=\"inline\" keeps the meter compact inside dense table rows.",
              preview: <MeterPreview locale={locale} mode="inline" />,
              code: inlineStateCode,
              previewBodyWidth: "lg",
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
