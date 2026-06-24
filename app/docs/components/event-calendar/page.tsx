import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { EventCalendarDemo } from "@/components/demos/EventCalendarDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import * as React from "react"
import { EventCalendar, type CalendarEvent } from "@gunjo/ui"

const events: CalendarEvent[] = [
  { id: "a1", date: "2026-06-03", label: "特集: 夏の旅", tone: "info" },
  { id: "a4", date: "2026-06-15", label: "入稿締切: 連載#12", tone: "destructive" },
  { id: "a8", date: "2026-06-24", label: "公開: 群青UI 解説", tone: "primary" },
]

function Calendar() {
  const [month, setMonth] = React.useState(new Date(2026, 5, 1))
  return (
    <EventCalendar
      month={month}
      events={events}
      today="2026-06-24"            // injectable — SSR-safe
      onMonthChange={setMonth}      // renders prev/next header
      onSelectDate={(iso) => openDay(iso)}
      onSelectEvent={(e) => openEvent(e)}
    />
  )
}`;

const propsData = [
  { name: "month", type: "string | Date", description: "Any date within the month to show (\"YYYY-MM\" / \"YYYY-MM-DD\" / Date). The component computes the 6-week grid." },
  { name: "events", type: "CalendarEvent[]", description: "{ id, date, label, tone?, ariaLabel? }. Placed as chips on their date; multiple per day stack with a ＋N overflow." },
  { name: "today", type: "string | Date", description: "The date marked as today. Injectable (pass it in) so render stays SSR-safe — no internal new Date()." },
  { name: "weekStartsOn", type: "0 | 1", default: "0", description: "0 = Sunday, 1 = Monday." },
  { name: "maxPerDay", type: "number", default: "3", description: "Max event chips per day before a ＋N affordance." },
  { name: "weekdayLabels", type: "string[]", default: "日 月 火 …", description: "7 short weekday labels starting Sunday." },
  { name: "renderEvent", type: "(event) => ReactNode", description: "Render an event chip (default: a tone pill)." },
  { name: "onSelectDate", type: "(iso: string) => void", description: "Day clicked / Enter on the focused day." },
  { name: "onSelectEvent", type: "(event) => void", description: "An event chip clicked." },
  { name: "onMonthChange", type: "(month: Date) => void", description: "When provided, renders a header with the month title + prev/next buttons." },
  { name: "label", type: "ReactNode", description: "Accessible name for the grid." },
];

export default function EventCalendarDocPage() {
  const title = meta.eventCalendar.title ?? "EventCalendar";
  const description = meta.eventCalendar.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Button", href: "/docs/components/button" },
        { name: "Badge", href: "/docs/components/badge" },
        { name: "ScheduleGrid", href: "/docs/components/schedule-grid" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <EventCalendarDemo />
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
