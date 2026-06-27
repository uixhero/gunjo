import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { LoyaltySummaryCardDemo } from "@/components/demos/LoyaltySummaryCardDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { LoyaltySummaryCard, Badge, Button } from "@gunjo/ui"

<LoyaltySummaryCard
  tone="brand"                       // filled gradient hero (or "default" card)
  meta="ハッピーズドラッグ メンバーズ"
  tier={<Badge variant="outline">ゴールド会員</Badge>}
  balanceLabel="ポイント残高"
  balance="3,480"
  unit="P"
  secondary={[{ label: "当年購入額", value: "¥86,200" }]}
  progress={{ value: 86200, max: 100000,
    label: "プラチナ会員まで あと ¥13,800", caption: "¥86,200 / ¥100,000" }}
  alert="200 P が 2026/06/30 に失効予定です"
  action={<Button size="lg" variant="secondary" className="w-full">会員バーコードを表示</Button>}
/>`;

const propsData = [
  { name: "balance", type: "ReactNode", description: "ヒーローの残高（大きな数字）。" },
  { name: "balanceLabel", type: "ReactNode", description: "残高の上の小ラベル（ポイント残高 など）。" },
  { name: "unit", type: "ReactNode", description: "残高の後ろの単位（P / マイル / 円）。" },
  { name: "meta", type: "ReactNode", description: "プログラム名 / 会員名 / 番号（左上）。" },
  { name: "tier", type: "ReactNode", description: "ランクバッジ（右上）。Badge 等を渡す。" },
  { name: "secondary", type: "{ label, value }[]", description: "ヒーロー下の副次値（IC残高 / 当年実績 など）。" },
  { name: "progress", type: "{ value, max, label?, caption? }", description: "次ランクまでの進捗（higher-is-better・容量Meterのように赤反転しない）。label は残り（『あと ¥13,800』）。" },
  { name: "alert", type: "ReactNode", description: "失効予定などの警告行。" },
  { name: "action", type: "ReactNode", description: "主アクション（Button ノード）。" },
  { name: "tone", type: '"brand" | "default"', default: '"brand"', description: "brand = 塗りつぶしグラデーションのヒーロー、default = 素のカード。" },
];

export default function LoyaltySummaryCardDocPage() {
  const title = meta.loyaltySummaryCard.title ?? "LoyaltySummaryCard";
  const description = meta.loyaltySummaryCard.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Badge", href: "/docs/components/badge" },
        { name: "Button", href: "/docs/components/button" },
        { name: "ListCard", href: "/docs/components/list-card" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="md">
        <LoyaltySummaryCardDemo />
      </ComponentPreview>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Props</h2>
        <PropsTable data={propsData} />
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
          <CodeBlock code={usageCode} />
        </div>
      </div>
    </ComponentLayout>
  );
}
