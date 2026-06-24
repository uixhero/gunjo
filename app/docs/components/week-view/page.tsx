import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { WeekViewDemo } from "@/components/demos/WeekViewDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { WeekView, type WeekEvent } from "@gunjo/ui"

const events: WeekEvent[] = [
  { id: "e1", start: "2026-06-22T09:00", end: "2026-06-22T10:30", label: "編集会議", tone: "info" },
  { id: "e2", start: "2026-06-22T10:00", end: "2026-06-22T11:00", label: "1on1", tone: "primary" }, // overlaps → side-by-side
  { id: "e5", start: "2026-06-24T15:00", end: "2026-06-24T18:00", label: "撮影", tone: "info" },
]

<WeekView
  weekOf="2026-06-24"
  today="2026-06-24"        // injectable — SSR-safe
  events={events}
  startHour={8}
  endHour={19}
  onSelectEvent={(e) => openEvent(e)}
/>`;

const propsData = [
  { name: "weekOf", type: "string | Date", description: "Any date within the week to show. The component computes the day columns." },
  { name: "events", type: "WeekEvent[]", description: "{ id, start, end, label, tone?, ariaLabel? } — start/end are 'YYYY-MM-DDTHH:mm' or Date. Overlapping events are packed side-by-side." },
  { name: "today", type: "string | Date", description: "The date highlighted as today. Injectable so render stays SSR-safe (no internal new Date())." },
  { name: "dayCount", type: "number", default: "7", description: "Day columns (7 = full week, 5 = Mon–Fri workweek)." },
  { name: "weekStartsOn", type: "0 | 1", default: "0", description: "0 = Sunday, 1 = Monday." },
  { name: "startHour / endHour", type: "number", default: "8 / 21", description: "Visible hour range." },
  { name: "hourHeight", type: "number", default: "48", description: "Pixels per hour (row height)." },
  { name: "weekdayLabels", type: "string[]", default: "日 月 火 …", description: "7 short weekday labels starting Sunday." },
  { name: "onSelectEvent", type: "(event) => void", description: "An event clicked." },
  { name: "label", type: "ReactNode", description: "Accessible name for the calendar." },
];

export default function WeekViewDocPage() {
  const title = meta.weekView.title ?? "WeekView";
  const description = meta.weekView.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "EventCalendar", href: "/docs/components/event-calendar" },
        { name: "ScheduleGrid", href: "/docs/components/schedule-grid" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="xl">
        <WeekViewDemo />
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
