import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { StringlineDemo } from "@/components/demos/StringlineDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { Stringline, type StringlineStop, type StringlineRun } from "@gunjo/ui"

const stops: StringlineStop[] = [
  { id: "sjk", label: "新宿", distance: 0 },
  { id: "mtk", label: "三鷹", distance: 14.3 },
  { id: "ttc", label: "立川", distance: 27.2 },
]
const runs: StringlineRun[] = [
  { id: "712T", direction: "down", tone: "primary",
    points: [{ stopId: "sjk", time: 432 }, { stopId: "mtk", time: 451 }, { stopId: "ttc", time: 469 }],
    actual: [{ stopId: "sjk", time: 432 }, { stopId: "mtk", time: 455 }, { stopId: "ttc", time: 477 }], // 実績(遅延)
    onSelect: () => openRun("712T") },
]

<Stringline stops={stops} runs={runs} startTime={420} endTime={500} now={450} tickInterval={20} />`;

const propsData = [
  { name: "stops", type: "StringlineStop[]", description: "路線の停車駅（距離軸）。{ id, label, distance }・distance が y を決める。" },
  { name: "runs", type: "StringlineRun[]", description: "各運行（斜め線）。{ id, label?, direction?, tone?, points, actual?, onSelect? }。" },
  { name: "startTime / endTime", type: "number", description: "時間軸の範囲（既定の単位＝午前0時からの分）。" },
  { name: "now", type: "number", description: "現在時刻 → 縦の now-line。SSR安全（時計を読まず値を渡す）。" },
  { name: "tickInterval", type: "number", default: "60", description: "縦の時間目盛りの間隔（時間単位）。分なら60で毎時。" },
  { name: "formatTime", type: "(time: number) => string", description: "軸ラベルの整形。既定は分→HH:MM。" },
  { name: "selectedRunId", type: "string | number", description: "1本を強調（他は淡色化）。" },
  { name: "height", type: "number", default: "320", description: "プロット高さ(px)。" },
  { name: "StringlineRun.points", type: "StringlineRunPoint[]", description: "計画の (stopId, time)。actual がある時は破線（計画）で描画。" },
  { name: "StringlineRun.actual", type: "StringlineRunPoint[]", description: "実績の (stopId, time)。実線で描画＝予実の差・続行が見える。" },
  { name: "StringlineRun.direction", type: '"down" | "up"', description: "進行方向。tone 省略時の既定色（下り→primary・上り→info）。" },
];

export default function StringlineDocPage() {
  const title = meta.stringline.title ?? "Stringline";
  const description = meta.stringline.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Gantt", href: "/docs/components/gantt" },
        { name: "RouteStops", href: "/docs/components/route-stops" },
        { name: "LineChart", href: "/docs/components/line-chart" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <StringlineDemo />
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
