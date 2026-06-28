import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { LineChipDemo } from "@/components/demos/LineChipDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { LineChip } from "@gunjo/ui"

// Filled with the line's brand colour — text auto-contrasts (black/white by luminance).
<LineChip label="渋88" color="#e60012" />
<LineChip label="JY" color="#9acd32" />     // light hue → black text
<LineChip label="路線色なし" />               // no colour → neutral chip (label still reads)

// In a ListCard leading slot / a route candidate / a leg row:
<ListCard leading={<LineChip label="宿51" color="#0079c2" />} title="新宿駅西口 → 練馬車庫" />`;

const propsData = [
  { name: "label", type: "ReactNode", description: "路線/系統の識別子（渋66 / JY / 丸ノ内線）。色に依存せず意味を担う。" },
  { name: "color", type: "string", description: "路線のブランド色を hex で（#e60012）。塗りつぶし＋自動コントラスト文字（輝度で黒/白）。非hex/省略は中立チップ。" },
  { name: "icon", type: "ReactNode", description: "先頭アイコン（モード記号など）。" },
  { name: "size", type: '"sm" | "default"', default: '"default"', description: "チップサイズ。" },
];

export default function LineChipDocPage() {
  const title = meta.lineChip.title ?? "LineChip";
  const description = meta.lineChip.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Badge", href: "/docs/components/badge" },
        { name: "ListCard", href: "/docs/components/list-card" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <LineChipDemo />
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
