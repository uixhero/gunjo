import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { RouteStopsDemo } from "@/components/demos/RouteStopsDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { RouteStops, type RouteStopItem } from "@gunjo/ui"

const stops: RouteStopItem[] = [
  { id: "1", title: "佐藤 一郎", description: "渋谷区神南 1-2-3",
    status: "completed", plannedTime: "09:30", actualTime: "09:28", meta: "2 個" },
  { id: "3", title: "高橋 花子", description: "渋谷区道玄坂 2-6-7",
    status: "current", plannedTime: "10:15", actualTime: "10:21", meta: "1 個",
    actions: <Button size="sm" variant="outline">完了</Button> },
  { id: "4", title: "田中 工業", status: "failed", plannedTime: "10:40",
    actions: <Button size="sm" variant="outline">再配達を設定</Button> },
  { id: "5", title: "山田 太郎", status: "delayed", plannedTime: "11:00", delayMinutes: 18 },
  { id: "6", title: "伊藤 ストア", status: "pending", plannedTime: "11:25" },
]

<RouteStops stops={stops} />`;

const propsData = [
  {
    name: "stops",
    type: "RouteStopItem[]",
    description:
      "Ordered stops. Each: id / title / description / status / plannedTime / actualTime / delayMinutes / seq / meta / actions.",
  },
  {
    name: "RouteStopItem.status",
    type: '"pending" | "current" | "completed" | "failed" | "delayed"',
    description:
      'Drives the marker, the status label/Badge, and (for current) aria-current="step". Completed = check, failed = ×, delayed = clock.',
  },
  {
    name: "RouteStopItem.plannedTime / actualTime",
    type: 'string ("HH:MM")',
    description: "Planned ETA vs actual arrival. A signed delay (Delta) is computed from both when delayMinutes is omitted.",
  },
  {
    name: "RouteStopItem.delayMinutes",
    type: "number",
    description: "Delay in minutes (+late / −early). Shown via Delta (late → destructive, early → success).",
  },
  {
    name: "RouteStopItem.actions",
    type: "ReactNode",
    description: "Trailing per-stop actions (status update, reschedule).",
  },
  {
    name: "statusLabels",
    type: "Partial<Record<RouteStopStatus, string>>",
    description: "Localize the status labels.",
  },
  {
    name: "hideTimes",
    type: "boolean",
    description: "Hide the planned / actual time + delay row. Default false.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS class names.",
  },
];

export default function RouteStopsDocPage() {
  const title = meta.routeStops.title ?? "RouteStops";
  const description = meta.routeStops.description ?? "";

  return (
    <ComponentLayout title={title} description={description}>
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <RouteStopsDemo />
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
