import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { AmountBreakdownDemo } from "@/components/demos/AmountBreakdownDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { AmountBreakdown } from "@gunjo/ui"

<AmountBreakdown
  lines={[
    { type: "heading", label: "認定損害額" },
    { label: "修理費", amount: 480000 },
    { label: "レッカー費用", amount: 22000 },
    { type: "subtotal", label: "認定損害額 計", amount: 502000 },
    { label: "過失相殺", kind: "subtract", amount: 150600, note: "認定額 × 過失割合 30%" },
    { label: "免責金額", kind: "subtract", amount: 50000 },
    { label: "既払金（内払）", kind: "subtract", amount: 100000 },
  ]}
  total={{ label: "今回支払額", amount: 201400 }}
  formula="今回支払額 = 認定損害額 − 過失相殺 − 免責 − 既払金"
/>`;

const propsData = [
  { name: "lines", type: "AmountLine[]", description: "行（順番どおり）。各行は line（既定）/ subtotal（点線の小計）/ heading（セクション見出し）。" },
  { name: "AmountLine.label", type: "ReactNode", description: "行ラベル。" },
  { name: "AmountLine.amount", type: "number", description: "金額。正の値を渡し、減算は kind で表す（heading は省略）。" },
  { name: "AmountLine.kind", type: '"add" | "subtract"', default: '"add"', description: "subtract は −|amount| を控除トーンで表示（符号は色だけに依存しない）。" },
  { name: "AmountLine.note", type: "ReactNode", description: "ラベル下の補足（過失割合 30% / 特約名 / 等級 など）。" },
  { name: "total", type: "{ label, amount, tone? }", description: "強調表示する導出合計。tone は neutral（既定）/ positive / negative。" },
  { name: "formula", type: "ReactNode", description: "合計の下に出す数式キャプション（例: 今回支払額 = 認定損害額 − 過失相殺 − 免責 − 既払金）。" },
  { name: "formatValue", type: "(value: number) => string", default: "formatCurrency", description: "値の整形。既定は formatCurrency（JPY / ja-JP）＝RSC安全。独自の関数を渡すのはクライアント境界からのみ。" },
];

export default function AmountBreakdownDocPage() {
  const title = meta.amountBreakdown.title ?? "AmountBreakdown";
  const description = meta.amountBreakdown.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Separator", href: "/docs/components/separator" },
        { name: "Card", href: "/docs/components/card" },
        { name: "ToggleGroup", href: "/docs/components/toggle-group" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <AmountBreakdownDemo />
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
