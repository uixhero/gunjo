import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { ScheduleGridDemo } from "@/components/demos/ScheduleGridDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { ScheduleGrid, type ScheduleAxisItem, type ScheduleCell } from "@gunjo/ui"

const periods: ScheduleAxisItem[] = [
  { id: "p1", label: "1限", sublabel: "8:50" },
  { id: "p2", label: "2限", sublabel: "9:50" },
]
const days: ScheduleAxisItem[] = [
  { id: "mon", label: "月", ariaLabel: "月曜" },
  { id: "tue", label: "火", ariaLabel: "火曜" },
]

const cells: ScheduleCell[] = [
  {
    rowId: "p1", colId: "mon",
    content: <LessonCard subject="数学" teacher="佐藤" room="2-A" />,
    description: "数学、佐藤、2-A",       // appended to the "<col> <row>" a11y name
    onSelect: () => openEditor("p1", "mon"),
  },
  {
    rowId: "p2", colId: "tue",
    tone: "destructive",                  // conflict → ring + tone
    description: "数学、佐藤、競合あり",
    content: <LessonCard subject="数学" teacher="佐藤" conflict />,
    onSelect: () => openEditor("p2", "tue"),
  },
  { rowId: "p2", colId: "mon", unavailable: true }, // e.g. no class this slot
]

<ScheduleGrid label="2年A組 週間時間割" cornerLabel="時限" rows={periods} columns={days} cells={cells} />`;

const propsData = [
  {
    name: "rows",
    type: "ScheduleAxisItem[]",
    description: "Row axis (e.g. periods) — rendered as rowheaders down the left. { id, label, sublabel?, ariaLabel? }.",
  },
  {
    name: "columns",
    type: "ScheduleAxisItem[]",
    description: "Column axis (e.g. days) — rendered as columnheaders across the top.",
  },
  {
    name: "cells",
    type: "ScheduleCell[]",
    description: "Cells addressed by rowId + colId. Slots with no cell render renderEmpty.",
  },
  {
    name: "ScheduleCell",
    type: "{ rowId; colId; content?; tone?; description?; ariaLabel?; onSelect?; unavailable? }",
    description: "content = cell body; tone (destructive adds a conflict ring); onSelect makes it an activatable button; unavailable = dashed non-interactive; description is appended to the auto '<column> <row>' accessible name; ariaLabel overrides it fully.",
  },
  {
    name: "label",
    type: "ReactNode",
    description: "Accessible name for the whole grid (required).",
  },
  {
    name: "cornerLabel",
    type: "ReactNode",
    description: "Top-left corner header.",
  },
  {
    name: "minColumnWidth",
    type: "number",
    default: "112",
    description: "Min px per column before horizontal scroll kicks in.",
  },
  {
    name: "rowHeaderWidth",
    type: "number",
    default: "72",
    description: "Width (px) of the sticky row-header column.",
  },
  {
    name: "renderEmpty",
    type: "(row, column) => ReactNode",
    description: "Render a slot that has no cell (available/empty). Default a muted dash.",
  },
  {
    name: "unavailableLabel",
    type: "string",
    default: '"利用不可"',
    description: "Announced (and shown) for an unavailable slot.",
  },
];

export default function ScheduleGridDocPage() {
  const title = meta.scheduleGrid.title ?? "ScheduleGrid";
  const description = meta.scheduleGrid.description ?? "";

  return (
    <ComponentLayout title={title} description={description}>
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <ScheduleGridDemo />
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
