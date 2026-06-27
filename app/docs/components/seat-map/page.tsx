import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { SeatMapDemo } from "@/components/demos/SeatMapDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { SeatMap, type Seat } from "@gunjo/ui"

const columns = ["A", "B", "C", null, "D", "E", "F"] // null = 通路

<SeatMap
  columns={columns}
  seats={[
    { id: "12A", row: 12, col: "A", position: "window", type: "非常口座席", fee: 1500 },
    { id: "12B", row: 12, col: "B", state: "occupied" },
    // …
  ]}
  selectedIds={selected}
  maxSelectable={2}
  onToggle={(id) => toggle(id)}
/>`;

const propsData = [
  { name: "columns", type: "(string | null)[]", description: "列IDの並び。null は通路（3-3 / 2-4-2 / 2-2）。" },
  { name: "seats", type: "Seat[]", description: "座席。各 { id, row, col, state?, type?, position?, fee? }。" },
  { name: "Seat.state", type: '"available" | "occupied" | "held" | "blocked"', default: '"available"', description: "空席状況。selected は selectedIds から導出。blocked は空きスペース。" },
  { name: "Seat.type", type: "string", description: "種別（非常口 / 足元ゆったり / プレミアム）。読み上げ名＋特別席の見た目に反映。" },
  { name: "Seat.position", type: '"window" | "aisle" | "middle"', description: "窓側 / 通路側。読み上げ名に反映。" },
  { name: "Seat.fee", type: "number", description: "座席指定料。読み上げ名に反映。" },
  { name: "selectedIds", type: "string[]", description: "選択中の座席ID（controlled）。" },
  { name: "maxSelectable", type: "number", description: "選択上限。到達すると未選択席は操作不可に。" },
  { name: "onToggle", type: "(seatId: string) => void", description: "座席のトグル（操作可能な空席のみ発火）。" },
  { name: "formatFee", type: "(fee: number) => string", default: "¥1,500", description: "読み上げ名の料金整形。" },
  { name: "showHeaders", type: "boolean", default: "true", description: "列ヘッダ＋行番号の表示。" },
  { name: "hideLegend", type: "boolean", description: "凡例を隠す。" },
];

export default function SeatMapDocPage() {
  const title = meta.seatMap.title ?? "SeatMap";
  const description = meta.seatMap.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="md">
        <SeatMapDemo />
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
