"use client";

import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import { IconBus, IconTrain } from "@tabler/icons-react";
import displayMetadata from "@design/display-metadata.json";
import { LineChip, ListCard } from "@gunjo/ui";

type Locale = "ja" | "en";

function LineChipPreview({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <LineChip label="渋88" color="#e60012" icon={<IconBus className="h-3.5 w-3.5" />} size={compact ? "sm" : "default"} />
        <LineChip label="JY" color="#9acd32" icon={<IconTrain className="h-3.5 w-3.5" />} size={compact ? "sm" : "default"} />
        <LineChip label={locale === "ja" ? "丸ノ内線" : "Marunouchi"} color="#f62e36" size={compact ? "sm" : "default"} />
        <LineChip label={locale === "ja" ? "路線色なし" : "No color"} size={compact ? "sm" : "default"} />
      </div>
      <ListCard
        leading={<LineChip label="宿51" color="#0079c2" />}
        title={locale === "ja" ? "新宿駅西口 → 練馬車庫" : "Shinjuku West Exit to Nerima Depot"}
        description={locale === "ja" ? "所要 42分・途中 18停留所" : "42 min / 18 stops"}
        meta={locale === "ja" ? "7分後" : "in 7 min"}
      />
    </div>
  );
}

export default function LineChipDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/line-chip", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.lineChip.title ?? "LineChip";
  const description = content?.description ?? metadata.lineChip.description ?? "";

  const usageCode = locale === "ja"
    ? `import { LineChip, ListCard } from "@gunjo/ui";
import { IconBus, IconTrain } from "@tabler/icons-react";

export function RouteCandidate() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <LineChip label="渋88" color="#e60012" icon={<IconBus className="h-3.5 w-3.5" />} />
        <LineChip label="JY" color="#9acd32" icon={<IconTrain className="h-3.5 w-3.5" />} />
        <LineChip label="丸ノ内線" color="#f62e36" />
        <LineChip label="路線色なし" />
      </div>
      <ListCard
        leading={<LineChip label="宿51" color="#0079c2" />}
        title="新宿駅西口 → 練馬車庫"
        description="所要 42分・途中 18停留所"
        meta="7分後"
      />
    </div>
  );
}`
    : `import { LineChip, ListCard } from "@gunjo/ui";
import { IconBus, IconTrain } from "@tabler/icons-react";

export function RouteCandidate() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <LineChip label="渋88" color="#e60012" icon={<IconBus className="h-3.5 w-3.5" />} />
        <LineChip label="JY" color="#9acd32" icon={<IconTrain className="h-3.5 w-3.5" />} />
        <LineChip label="Marunouchi" color="#f62e36" />
        <LineChip label="No color" />
      </div>
      <ListCard
        leading={<LineChip label="宿51" color="#0079c2" />}
        title="Shinjuku West Exit to Nerima Depot"
        description="42 min / 18 stops"
        meta="in 7 min"
      />
    </div>
  );
}`;

  const compactCode = usageCode.replace(/<LineChip([^>]*)\/>/g, '<LineChip$1 size="sm" />');

  const propsData = [
    { name: "label", type: "ReactNode", description: locale === "ja" ? "路線名や系統番号です。色に依存せず意味を担います。" : "Transit line or route identifier. The label carries meaning, not color alone." },
    { name: "color", type: "string", description: locale === "ja" ? "hex のブランド色です。非 hex または省略時は中立チップになります。" : "Hex brand color. Non-hex or omitted values render a neutral chip." },
    { name: "icon", type: "ReactNode", description: locale === "ja" ? "バスや鉄道などの先頭アイコンです。" : "Optional leading icon such as bus or train." },
    { name: "size", type: '"sm" | "default"', default: '"default"', description: locale === "ja" ? "チップサイズです。" : "Chip size." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "LineChip", href: "/docs/components/line-chip" },
        { name: "ListCard", href: "/docs/components/list-card" },
      ]}
      relatedComponents={[
        { name: "Badge", href: "/docs/components/badge" },
        { name: "OriginDestination", href: "/docs/components/origin-destination" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <LineChipPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "brand-color",
              title: locale === "ja" ? "ブランド色" : "Brand color",
              description: locale === "ja" ? "hex 色を渡すと背景色に応じて文字色を自動で白/黒にします。" : "A hex color fills the chip and automatically chooses black or white text.",
              preview: <LineChipPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "md",
            },
            {
              key: "neutral",
              title: locale === "ja" ? "中立色" : "Neutral",
              description: locale === "ja" ? "色がない場合でも label が意味を担ち、中立トーンで表示します。" : "When no color is provided, the label still carries meaning and the chip uses the neutral tone.",
              preview: <LineChip label={locale === "ja" ? "路線色なし" : "No color"} />,
              code: `<div className="flex items-center gap-2">
  <LineChip label="${locale === "ja" ? "路線色なし" : "No color"}" />
  <span className="text-sm text-muted-foreground">
    ${locale === "ja" ? "ブランド色が未登録の路線" : "A route without registered brand color"}
  </span>
</div>`,
            },
            {
              key: "small",
              title: locale === "ja" ? "小サイズ" : "Small size",
              description: locale === "ja" ? "混雑した一覧では size=\"sm\" を使います。" : "Use size=\"sm\" in dense lists.",
              preview: <LineChipPreview locale={locale} compact />,
              code: compactCode,
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
