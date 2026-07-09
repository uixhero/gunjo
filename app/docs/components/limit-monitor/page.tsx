"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { LimitMonitor, classifyLimit } from "@gunjo/ui";

type Locale = "ja" | "en";

function limitLabels(locale: Locale) {
  return locale === "ja"
    ? undefined
    : { ok: "Within limit", near: "Near limit", over: "Over limit", critical: "Critical" };
}

function formatHours(value: number) {
  return `${value.toFixed(1)}h`;
}

function formatReadout(locale: Locale) {
  return ({ over, direction, formatValue }: { over: number; direction: "ceiling" | "floor"; formatValue: (value: number) => React.ReactNode }) => {
    const amount = formatValue(Math.abs(over));
    if (locale === "ja") {
      if (direction === "floor") return over > 0 ? `下限まで ${amount} 不足` : `下限まで 残り ${amount}`;
      return over >= 0 ? `基準を ${amount} 超過` : `基準まで 残り ${amount}`;
    }
    if (direction === "floor") return over > 0 ? `${amount} below minimum` : `${amount} above minimum`;
    return over >= 0 ? `${amount} over limit` : `${amount} remaining`;
  };
}

function LimitMonitorPreview({ locale, state = "mixed" }: { locale: Locale; state?: "mixed" | "floor" | "critical" }) {
  const copy = locale === "ja"
    ? {
        classified: "分類結果",
        rows: [
          { label: "拘束時間（当日）", value: 12.4, limit: 13, hardLimit: 16, warnWithin: 1 },
          { label: "連続運転", value: 4.2, limit: 4, hardLimit: 4.5, warnWithin: 0.25 },
          { label: "休息期間", value: 9.5, limit: 11, direction: "floor" as const, warnWithin: 1 },
        ],
      }
    : {
        classified: "Classification",
        rows: [
          { label: "On-duty time", value: 12.4, limit: 13, hardLimit: 16, warnWithin: 1 },
          { label: "Continuous driving", value: 4.2, limit: 4, hardLimit: 4.5, warnWithin: 0.25 },
          { label: "Rest period", value: 9.5, limit: 11, direction: "floor" as const, warnWithin: 1 },
        ],
      };
  const rows = state === "floor"
    ? copy.rows.filter((row) => row.direction === "floor")
    : state === "critical"
      ? [{ label: locale === "ja" ? "拘束時間（重大超過）" : "On-duty time critical", value: 16.2, limit: 13, hardLimit: 16, warnWithin: 1 }]
      : copy.rows;
  const classified = classifyLimit(rows[0].value, rows[0]);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 rounded-lg border bg-card p-4">
      <div className="grid gap-4">
        {rows.map((row) => (
          <LimitMonitor
            key={row.label}
            {...row}
            formatValue={formatHours}
            formatReadout={formatReadout(locale)}
            labels={limitLabels(locale)}
          />
        ))}
      </div>
      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground" aria-live="polite">
        {copy.classified}: {classified.state} / {formatHours(classified.over)}
      </p>
    </div>
  );
}

export default function LimitMonitorDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/limit-monitor", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.limitMonitor.title ?? "LimitMonitor";
  const description = content?.description ?? metadata.limitMonitor.description ?? "";

  const usageCode = locale === "ja"
    ? `import { LimitMonitor, classifyLimit } from "@gunjo/ui";

function formatHours(value: number) {
  return \`\${value.toFixed(1)}h\`;
}

export function DriverLimitPanel() {
  const result = classifyLimit(13.5, { limit: 13, hardLimit: 16, warnWithin: 1 });

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 rounded-lg border bg-card p-4">
      <LimitMonitor
        label="拘束時間（当日）"
        value={13.5}
        limit={13}
        hardLimit={16}
        warnWithin={1}
        formatValue={formatHours}
      />
      <LimitMonitor
        label="連続運転"
        value={4.2}
        limit={4}
        hardLimit={4.5}
        warnWithin={0.25}
        formatValue={formatHours}
      />
      <LimitMonitor
        label="休息期間"
        value={9.5}
        limit={11}
        direction="floor"
        warnWithin={1}
        formatValue={formatHours}
      />
      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
        分類結果: {result.state} / {formatHours(result.over)}
      </p>
    </div>
  );
}`
    : `import { LimitMonitor, classifyLimit } from "@gunjo/ui";

function formatHours(value: number) {
  return \`\${value.toFixed(1)}h\`;
}

function formatReadout({ over, direction, formatValue }) {
  const amount = formatValue(Math.abs(over));
  if (direction === "floor") return over > 0 ? \`\${amount} below minimum\` : \`\${amount} above minimum\`;
  return over >= 0 ? \`\${amount} over limit\` : \`\${amount} remaining\`;
}

export function DriverLimitPanel() {
  const result = classifyLimit(13.5, { limit: 13, hardLimit: 16, warnWithin: 1 });

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 rounded-lg border bg-card p-4">
      <LimitMonitor
        label="On-duty time"
        value={13.5}
        limit={13}
        hardLimit={16}
        warnWithin={1}
        formatValue={formatHours}
        formatReadout={formatReadout}
        labels={{ ok: "Within limit", near: "Near limit", over: "Over limit", critical: "Critical" }}
      />
      <LimitMonitor
        label="Continuous driving"
        value={4.2}
        limit={4}
        hardLimit={4.5}
        warnWithin={0.25}
        formatValue={formatHours}
        formatReadout={formatReadout}
        labels={{ ok: "Within limit", near: "Near limit", over: "Over limit", critical: "Critical" }}
      />
      <LimitMonitor
        label="Rest period"
        value={9.5}
        limit={11}
        direction="floor"
        warnWithin={1}
        formatValue={formatHours}
        formatReadout={formatReadout}
        labels={{ ok: "Within limit", near: "Near limit", over: "Over limit", critical: "Critical" }}
      />
      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
        Classification: {result.state} / {formatHours(result.over)}
      </p>
    </div>
  );
}`;

  const floorCode = locale === "ja"
    ? `import { LimitMonitor } from "@gunjo/ui";

function formatHours(value: number) {
  return \`\${value.toFixed(1)}h\`;
}

export function RestPeriodLimit() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 rounded-lg border bg-card p-4">
      <LimitMonitor
        label="休息期間"
        value={9.5}
        limit={11}
        direction="floor"
        warnWithin={1}
        formatValue={formatHours}
      />
    </div>
  );
}`
    : `import { LimitMonitor } from "@gunjo/ui";

function formatHours(value: number) {
  return \`\${value.toFixed(1)}h\`;
}

export function RestPeriodLimit() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 rounded-lg border bg-card p-4">
      <LimitMonitor
        label="Rest period"
        value={9.5}
        limit={11}
        direction="floor"
        warnWithin={1}
        formatValue={formatHours}
        labels={{ ok: "Within limit", near: "Near limit", over: "Over limit", critical: "Critical" }}
      />
    </div>
  );
}`;

  const criticalCode = locale === "ja"
    ? `import { LimitMonitor } from "@gunjo/ui";

function formatHours(value: number) {
  return \`\${value.toFixed(1)}h\`;
}

export function CriticalLimit() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 rounded-lg border bg-card p-4">
      <LimitMonitor
        label="拘束時間（重大超過）"
        value={16.2}
        limit={13}
        hardLimit={16}
        warnWithin={1}
        formatValue={formatHours}
      />
    </div>
  );
}`
    : `import { LimitMonitor } from "@gunjo/ui";

function formatHours(value: number) {
  return \`\${value.toFixed(1)}h\`;
}

export function CriticalLimit() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 rounded-lg border bg-card p-4">
      <LimitMonitor
        label="On-duty time critical"
        value={16.2}
        limit={13}
        hardLimit={16}
        warnWithin={1}
        formatValue={formatHours}
        labels={{ ok: "Within limit", near: "Near limit", over: "Over limit", critical: "Critical" }}
      />
    </div>
  );
}`;

  const propsData = [
    { name: "value", type: "number", description: locale === "ja" ? "計測値です。" : "Measured value." },
    { name: "limit", type: "number", description: locale === "ja" ? "ソフトな基準値です。max に対する割合ではなく実単位で渡します。" : "Soft or regulatory limit in real units, not a fraction of max." },
    { name: "hardLimit", type: "number", description: locale === "ja" ? "重大超過を判定する絶対上限または下限です。" : "Hard limit that classifies the value as critical." },
    { name: "warnWithin", type: "number", default: "0", description: locale === "ja" ? "基準の手前で near とする余白です。" : "Margin before the limit that becomes near." },
    { name: "direction", type: '"ceiling" | "floor"', default: '"ceiling"', description: locale === "ja" ? "上限以下に保つか、下限以上に保つかを選びます。" : "Whether the value must stay below a ceiling or above a floor." },
    { name: "max", type: "number", description: locale === "ja" ? "バー正規化の最大値です。" : "Maximum used to normalize the bar." },
    { name: "label", type: "ReactNode", description: locale === "ja" ? "指標名です。" : "Metric label." },
    { name: "formatValue", type: "(value: number) => ReactNode", description: locale === "ja" ? "値と基準値の表示を整形します。" : "Formats value and limit readouts." },
    { name: "formatReadout", type: "({ state, over, direction, formatValue }) => ReactNode", description: locale === "ja" ? "バー下の説明文を整形します。" : "Formats the explanatory text below the bar." },
    { name: "labels", type: "Partial<Record<LimitState, ReactNode>>", description: locale === "ja" ? "状態チップのラベルを上書きします。" : "Overrides state chip labels." },
    { name: "classifyLimit", type: "(value, options) => { state, over }", description: locale === "ja" ? "同じ基準分類を UI なしで返す純関数です。" : "Pure helper that returns the same limit classification without UI." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "LimitMonitor", href: "/docs/components/limit-monitor" },
      ]}
      relatedComponents={[
        { name: "ExpiryBadge", href: "/docs/components/expiry-badge" },
        { name: "ReferenceValue", href: "/docs/components/reference-value" },
        { name: "Meter", href: "/docs/components/meter" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="lg">
        <LimitMonitorPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "ceiling",
              title: locale === "ja" ? "上限監視" : "Ceiling limit",
              description: locale === "ja" ? "拘束時間や連続運転のように、値を基準以下に保つ指標です。" : "Use ceiling for metrics that must stay below the limit.",
              preview: <LimitMonitorPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "lg",
            },
            {
              key: "floor",
              title: locale === "ja" ? "下限監視" : "Floor limit",
              description: locale === "ja" ? "休息期間のように、値を基準以上に保つ指標です。" : "Use floor for metrics that must stay above the limit.",
              preview: <LimitMonitorPreview locale={locale} state="floor" />,
              code: floorCode,
              previewBodyWidth: "lg",
            },
            {
              key: "critical",
              title: locale === "ja" ? "重大超過" : "Critical",
              description: locale === "ja" ? "hardLimit を超えると critical の塗りつぶし表示になります。" : "Crossing hardLimit switches the state to critical.",
              preview: <LimitMonitorPreview locale={locale} state="critical" />,
              code: criticalCode,
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
