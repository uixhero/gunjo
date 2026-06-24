import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { GanttDemo } from "@/components/demos/GanttDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { Gantt, type GanttRow, type GanttItem } from "@gunjo/ui"

const rows: GanttRow[] = [
  { id: "l1", label: "第1ライン", sublabel: "組立" },
  { id: "l2", label: "第2ライン", sublabel: "塗装" },
]

const items: GanttItem[] = [
  { id: "j1", rowId: "l1", start: "2026-06-22", end: "2026-06-24", label: "A-101", tone: "info" },
  { id: "j3", rowId: "l2", start: "2026-06-22", end: "2026-06-25", label: "B-201", tone: "success" },
  { id: "j4", rowId: "l2", start: "2026-06-23", end: "2026-06-26", label: "B-202", tone: "warning" }, // overlaps → stacks
]

<Gantt
  rows={rows}
  items={items}
  startDate="2026-06-21"
  endDate="2026-06-29"
  today="2026-06-24"          // injectable — SSR-safe
  onSelectItem={(i) => openJob(i)}
/>`;

const propsData = [
  { name: "rows", type: "GanttRow[]", description: "Resource lanes (left axis): { id, label, sublabel? }." },
  { name: "items", type: "GanttItem[]", description: "Bars: { id, rowId, start, end, label, tone?, ariaLabel? }. start/end are 'YYYY-MM-DD' / 'YYYY-MM-DDTHH:mm' / Date. Overlapping bars in a row stack into lanes." },
  { name: "startDate / endDate", type: "string | Date", description: "Visible time window. The component computes the day columns and bar positions." },
  { name: "today", type: "string | Date", description: "Date marked with a vertical line. Injectable so render stays SSR-safe (no internal new Date())." },
  { name: "laneHeight", type: "number", default: "28", description: "Height (px) of one bar lane." },
  { name: "rowLabelWidth", type: "number", default: "120", description: "Width (px) of the sticky row-label gutter." },
  { name: "dayWidth", type: "number", default: "44", description: "Min width (px) per day column (drives horizontal scroll)." },
  { name: "onSelectItem", type: "(item) => void", description: "A bar clicked." },
  { name: "label", type: "ReactNode", description: "Accessible name for the chart." },
];

export default function GanttDocPage() {
  const title = meta.gantt.title ?? "Gantt";
  const description = meta.gantt.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "WeekView", href: "/docs/components/week-view" },
        { name: "EventCalendar", href: "/docs/components/event-calendar" },
        { name: "ScheduleGrid", href: "/docs/components/schedule-grid" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="xl">
        <GanttDemo />
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
