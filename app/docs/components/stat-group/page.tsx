"use client";

import { CodeBlock } from "@/components/doc/CodeBlock";
import {
  CodeCopyButton,
  ComponentLayout,
  ComponentPreview,
} from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { StatGroup, type StatisticProps } from "@gunjo/ui";

type Locale = "ja" | "en";

function stats(locale: Locale): StatisticProps[] {
  return locale === "ja"
    ? [
        { label: "請求対象者", value: "6名", hint: "未確定 3件" },
        { label: "請求総額", value: "¥1,224,520", change: "+8.2%", trend: "up", tone: "positive" },
        { label: "限度額超過者", value: "1名", change: "+1", trend: "up", tone: "negative" },
        { label: "提出期限", value: "6/10", change: "あと4日", trend: "down", tone: "neutral" },
      ]
    : [
        { label: "Billable people", value: "6", hint: "3 not finalized" },
        { label: "Invoice total", value: "$8,164", change: "+8.2%", trend: "up", tone: "positive" },
        { label: "Over limit", value: "1", change: "+1", trend: "up", tone: "negative" },
        { label: "Due date", value: "Jun 10", change: "4 days left", trend: "down", tone: "neutral" },
      ];
}

function StatGroupPreview({ locale, mode = "cards" }: { locale: Locale; mode?: "cards" | "bare" | "compact" }) {
  const visibleStats = mode === "compact" ? stats(locale).slice(0, 3) : stats(locale);

  return (
    <div className={mode === "bare" ? "w-full max-w-4xl rounded-lg border bg-card p-4" : "w-full max-w-4xl"}>
      <StatGroup
        items={visibleStats}
        cols={mode === "compact" ? { base: 1, sm: 3 } : { base: 1, sm: 2, md: 4 }}
        card={mode !== "bare"}
      />
    </div>
  );
}

export default function StatGroupDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/stat-group", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.statGroup.title ?? "StatGroup";
  const description = content?.description ?? metadata.statGroup.description ?? "";

  const usageCode =
    locale === "ja"
      ? `import { StatGroup } from "@gunjo/ui";

const items = [
  { label: "請求対象者", value: "6名", hint: "未確定 3件" },
  { label: "請求総額", value: "¥1,224,520", change: "+8.2%", trend: "up", tone: "positive" },
  { label: "限度額超過者", value: "1名", change: "+1", trend: "up", tone: "negative" },
  { label: "提出期限", value: "6/10", change: "あと4日", trend: "down", tone: "neutral" },
];

export function InvoiceSummary() {
	  return (
	    <div className="w-full max-w-4xl">
	      <StatGroup items={items} cols={{ base: 1, sm: 2, md: 4 }} />
	    </div>
	  );
	}`
      : `import { StatGroup } from "@gunjo/ui";

const items = [
  { label: "Billable people", value: "6", hint: "3 not finalized" },
  { label: "Invoice total", value: "$8,164", change: "+8.2%", trend: "up", tone: "positive" },
  { label: "Over limit", value: "1", change: "+1", trend: "up", tone: "negative" },
  { label: "Due date", value: "Jun 10", change: "4 days left", trend: "down", tone: "neutral" },
];

export function InvoiceSummary() {
	  return (
	    <div className="w-full max-w-4xl">
	      <StatGroup items={items} cols={{ base: 1, sm: 2, md: 4 }} />
	    </div>
	  );
	}`;

  const bareCode =
    locale === "ja"
      ? `import { StatGroup } from "@gunjo/ui";

const items = [
  { label: "請求対象者", value: "6名", hint: "未確定 3件" },
  { label: "請求総額", value: "¥1,224,520", change: "+8.2%", trend: "up", tone: "positive" },
  { label: "限度額超過者", value: "1名", change: "+1", trend: "up", tone: "negative" },
  { label: "提出期限", value: "6/10", change: "あと4日", trend: "down", tone: "neutral" },
];

export function InvoiceSummaryPanel() {
  return (
    <div className="w-full max-w-4xl rounded-lg border bg-card p-4">
      <StatGroup card={false} items={items} cols={{ base: 1, sm: 2, md: 4 }} />
    </div>
  );
}`
      : `import { StatGroup } from "@gunjo/ui";

const items = [
  { label: "Billable people", value: "6", hint: "3 not finalized" },
  { label: "Invoice total", value: "$8,164", change: "+8.2%", trend: "up", tone: "positive" },
  { label: "Over limit", value: "1", change: "+1", trend: "up", tone: "negative" },
  { label: "Due date", value: "Jun 10", change: "4 days left", trend: "down", tone: "neutral" },
];

export function InvoiceSummaryPanel() {
  return (
    <div className="w-full max-w-4xl rounded-lg border bg-card p-4">
      <StatGroup card={false} items={items} cols={{ base: 1, sm: 2, md: 4 }} />
    </div>
  );
}`;

  const compactCode =
    locale === "ja"
      ? `import { StatGroup } from "@gunjo/ui";

const items = [
  { label: "請求対象者", value: "6名", hint: "未確定 3件" },
  { label: "請求総額", value: "¥1,224,520", change: "+8.2%", trend: "up", tone: "positive" },
  { label: "限度額超過者", value: "1名", change: "+1", trend: "up", tone: "negative" },
];

export function CompactInvoiceSummary() {
  return (
    <div className="w-full max-w-3xl">
      <StatGroup items={items} cols={{ base: 1, sm: 3 }} />
    </div>
  );
}`
      : `import { StatGroup } from "@gunjo/ui";

const items = [
  { label: "Billable people", value: "6", hint: "3 not finalized" },
  { label: "Invoice total", value: "$8,164", change: "+8.2%", trend: "up", tone: "positive" },
  { label: "Over limit", value: "1", change: "+1", trend: "up", tone: "negative" },
];

export function CompactInvoiceSummary() {
  return (
    <div className="w-full max-w-3xl">
      <StatGroup items={items} cols={{ base: 1, sm: 3 }} />
    </div>
  );
}`;

  const propsData = [
    { name: "items", type: "StatisticProps[]", description: locale === "ja" ? "各指標です。Statistic の label/value/change/trend/tone/hint を渡します。" : "Metric items using Statistic label, value, change, trend, tone, and hint props." },
    { name: "cols", type: "1-8 | { base?, sm?, md?, lg?, xl? }", default: "{ base: 1, sm: 2, md: 4 }", description: locale === "ja" ? "列数の上限です。既定では最大4列で、狭いコンテナでは1列まで折り返します。" : "Upper bound for the column count. The default allows up to four columns and wraps down to one column in narrow containers." },
    { name: "card", type: "boolean", default: "true", description: locale === "ja" ? "各 Statistic のカード面を表示するかどうかです。周囲がカードの場合は false にします。" : "Controls whether each Statistic keeps its card surface. Set false when the surrounding panel already frames the content." },
    { name: "className", type: "string", description: locale === "ja" ? "グリッドルートに追加するクラスです。" : "Additional classes for the grid root." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "StatGroup", href: "/docs/components/stat-group" }, { name: "Statistic", href: "/docs/components/statistic" }]}
      relatedComponents={[{ name: "Card", href: "/docs/components/card" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="xl">
        <StatGroupPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            { key: "cards", title: locale === "ja" ? "カード付き" : "Card surfaces", description: locale === "ja" ? "バックオフィスのサマリ行では、各指標のカード面だけで区切ります。" : "Use one card surface per metric for summary strips.", preview: <StatGroupPreview locale={locale} />, code: usageCode, previewBodyWidth: "xl" },
            { key: "bare", title: locale === "ja" ? "カードなし" : "Bare statistics", description: locale === "ja" ? "周囲がすでにカードの時は card=false にして、内側の枠線を増やしません。" : "Set card=false when the surrounding panel already frames the content.", preview: <StatGroupPreview locale={locale} mode="bare" />, code: bareCode, previewBodyWidth: "xl" },
            { key: "compact", title: locale === "ja" ? "少数指標" : "Fewer metrics", description: locale === "ja" ? "3件程度の指標では列数を狭めて密度を保ちます。" : "Reduce columns for a smaller set of metrics.", preview: <StatGroupPreview locale={locale} mode="compact" />, code: compactCode, previewBodyWidth: "lg" },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">{sectionLabels.props}</h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">{sectionLabels.usage}</h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>
    </ComponentLayout>
  );
}
