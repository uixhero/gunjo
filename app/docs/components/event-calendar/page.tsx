"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import {
  Badge,
  EventCalendar,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  type CalendarEvent,
} from "@gunjo/ui";

type Locale = "ja" | "en";

type CalendarSelection =
  | { type: "date"; iso: string; events: CalendarEvent[] }
  | { type: "event"; iso: string; event: CalendarEvent };

function eventDateIso(date: CalendarEvent["date"]) {
  if (date instanceof Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  return date;
}

function eventCalendarCopy(locale: Locale) {
  return locale === "ja"
    ? {
        label: "編集カレンダー",
        previewTitle: "プレビュー",
        dateTitle: (iso: string) => `${iso} の予定`,
        eventTitle: (label: React.ReactNode) => `予定「${String(label)}」`,
        sheetDescription: "選択した日付または予定の詳細を確認します。",
        noEvents: "この日に登録された予定はありません。",
        scheduledEvents: "登録済みの予定",
        close: "閉じる",
        weekdays: ["日", "月", "火", "水", "木", "金", "土"],
        events: [
          { id: "a1", date: "2026-06-03", label: "特集: 夏の旅", tone: "info", ariaLabel: "特集 夏の旅" },
          { id: "a2", date: "2026-06-10", label: "撮影: 商品A", tone: "success", ariaLabel: "撮影 商品A" },
          { id: "a3", date: "2026-06-15", label: "編集会議", tone: "muted", ariaLabel: "編集会議" },
          { id: "a4", date: "2026-06-15", label: "入稿締切: 連載#12", tone: "destructive", ariaLabel: "入稿締切 連載12" },
          { id: "a5", date: "2026-06-15", label: "校了確認", tone: "warning", ariaLabel: "校了確認" },
          { id: "a6", date: "2026-06-15", label: "公開予約", tone: "primary", ariaLabel: "公開予約" },
          { id: "a7", date: "2026-06-24", label: "公開: GunjoUI 解説", tone: "primary", ariaLabel: "公開 GunjoUI 解説" },
        ] satisfies CalendarEvent[],
      }
    : {
        label: "Editorial calendar",
        previewTitle: "Preview",
        dateTitle: (iso: string) => `Schedule for ${iso}`,
        eventTitle: (label: React.ReactNode) => `Event: ${String(label)}`,
        sheetDescription: "Review the selected date or event details.",
        noEvents: "No events are scheduled for this date.",
        scheduledEvents: "Scheduled events",
        close: "Close",
        weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        events: [
          { id: "a1", date: "2026-06-03", label: "Feature: summer travel", tone: "info", ariaLabel: "Feature summer travel" },
          { id: "a2", date: "2026-06-10", label: "Shoot: Product A", tone: "success", ariaLabel: "Shoot Product A" },
          { id: "a3", date: "2026-06-15", label: "Editorial sync", tone: "muted", ariaLabel: "Editorial sync" },
          { id: "a4", date: "2026-06-15", label: "Deadline: series #12", tone: "destructive", ariaLabel: "Deadline series 12" },
          { id: "a5", date: "2026-06-15", label: "Final proof", tone: "warning", ariaLabel: "Final proof" },
          { id: "a6", date: "2026-06-15", label: "Schedule publish", tone: "primary", ariaLabel: "Schedule publish" },
          { id: "a7", date: "2026-06-24", label: "Publish: GunjoUI guide", tone: "primary", ariaLabel: "Publish GunjoUI guide" },
        ] satisfies CalendarEvent[],
      };
}

function EventCalendarPreview({
  locale,
  maxPerDay = 3,
  weekStartsOn = 0,
  customEvent = false,
}: {
  locale: Locale;
  maxPerDay?: number;
  weekStartsOn?: 0 | 1;
  customEvent?: boolean;
}) {
  const copy = eventCalendarCopy(locale);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [month, setMonth] = React.useState(new Date(2026, 5, 1));
  const [selection, setSelection] = React.useState<CalendarSelection | null>(null);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  const openDatePreview = (iso: string) => {
    setSelection({ type: "date", iso, events: copy.events.filter((event) => event.date === iso) });
  };

  const openEventPreview = (event: CalendarEvent) => {
    setSelection({ type: "event", iso: eventDateIso(event.date), event });
  };

  return (
    <div ref={rootRef} className="relative flex w-full max-w-3xl flex-col gap-4">
      <EventCalendar
        month={month}
        events={copy.events}
        today="2026-06-24"
        label={copy.label}
        weekdayLabels={copy.weekdays}
        weekStartsOn={weekStartsOn}
        maxPerDay={maxPerDay}
        onMonthChange={setMonth}
        onSelectDate={openDatePreview}
        onSelectEvent={openEventPreview}
        renderEvent={
          customEvent
            ? (event) => (
                <button
                  key={event.id}
                  type="button"
                  className="w-full truncate rounded bg-accent px-1 py-0.5 text-left text-[11px] leading-tight text-accent-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  onClick={(mouseEvent) => {
                    mouseEvent.stopPropagation();
                    openEventPreview(event);
                  }}
                >
                  {event.label}
                </button>
              )
            : undefined
        }
      />
      <Sheet open={selection != null} onOpenChange={(open) => !open && setSelection(null)}>
        <SheetContent
          portalContainer={portalContainer}
          overlayClassName="rounded-md"
          closeLabel={copy.close}
          className="w-[320px] max-w-[calc(100%-2rem)] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle asChild>
              <p>{copy.previewTitle}</p>
            </SheetTitle>
            <SheetDescription>{copy.sheetDescription}</SheetDescription>
          </SheetHeader>
          {selection ? (
            <div className="mt-4 grid gap-4 text-sm">
              <div className="rounded-lg border bg-card p-3">
                <p className="font-medium text-foreground">
                  {selection.type === "date" ? copy.dateTitle(selection.iso) : copy.eventTitle(selection.event.label)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{selection.iso}</p>
              </div>
              {selection.type === "date" ? (
                <div className="grid gap-2">
                  <p className="text-xs font-medium text-muted-foreground">{copy.scheduledEvents}</p>
                  {selection.events.length > 0 ? (
                    selection.events.map((event) => (
                      <div key={event.id} className="rounded-md border bg-background px-3 py-2">
                        <p className="font-medium text-foreground">{event.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{event.ariaLabel}</p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-md border bg-muted/30 px-3 py-2 text-muted-foreground">{copy.noEvents}</p>
                  )}
                </div>
              ) : (
                <div className="rounded-md border bg-muted/30 px-3 py-2">
                  <p className="font-medium text-foreground">{selection.event.label}</p>
                  <p className="mt-1 text-muted-foreground">{selection.event.ariaLabel}</p>
                </div>
              )}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function EventCalendarDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/event-calendar", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.eventCalendar.title ?? "EventCalendar";
  const description = content?.description ?? metadata.eventCalendar.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import {
  EventCalendar,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  type CalendarEvent,
} from "@gunjo/ui";

type CalendarSelection =
  | { type: "date"; iso: string; events: CalendarEvent[] }
  | { type: "event"; iso: string; event: CalendarEvent };

function eventDateIso(date: CalendarEvent["date"]) {
  if (date instanceof Date) {
    return \`\${date.getFullYear()}-\${String(date.getMonth() + 1).padStart(2, "0")}-\${String(date.getDate()).padStart(2, "0")}\`;
  }
  return date;
}

const events: CalendarEvent[] = [
  { id: "a1", date: "2026-06-03", label: "特集: 夏の旅", tone: "info", ariaLabel: "特集 夏の旅" },
  { id: "a4", date: "2026-06-15", label: "入稿締切: 連載#12", tone: "destructive", ariaLabel: "入稿締切 連載12" },
  { id: "a5", date: "2026-06-15", label: "校了確認", tone: "warning", ariaLabel: "校了確認" },
  { id: "a6", date: "2026-06-15", label: "公開予約", tone: "primary", ariaLabel: "公開予約" },
  { id: "a7", date: "2026-06-24", label: "公開: GunjoUI 解説", tone: "primary", ariaLabel: "公開 GunjoUI 解説" },
];

export function EditorialCalendar() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [month, setMonth] = React.useState(new Date(2026, 5, 1));
  const [selection, setSelection] = React.useState<CalendarSelection | null>(null);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  return (
    <div ref={rootRef} className="relative flex w-full max-w-3xl flex-col gap-4">
      <EventCalendar
        month={month}
        events={events}
        today="2026-06-24"
        label="編集カレンダー"
        weekdayLabels={["日", "月", "火", "水", "木", "金", "土"]}
        maxPerDay={3}
        onMonthChange={setMonth}
        onSelectDate={(iso) => setSelection({ type: "date", iso, events: events.filter((event) => event.date === iso) })}
        onSelectEvent={(event) => setSelection({ type: "event", iso: eventDateIso(event.date), event })}
      />
      <Sheet open={selection != null} onOpenChange={(open) => !open && setSelection(null)}>
        <SheetContent portalContainer={portalContainer} overlayClassName="rounded-md" closeLabel="閉じる">
          <SheetHeader>
            <SheetTitle asChild>
              <p>プレビュー</p>
            </SheetTitle>
            <SheetDescription>選択した日付または予定の詳細を確認します。</SheetDescription>
          </SheetHeader>
          {selection ? (
            <div className="mt-4 grid gap-4 text-sm">
              <div className="rounded-lg border bg-card p-3">
                <p className="font-medium text-foreground">
                  {selection.type === "date" ? \`\${selection.iso} の予定\` : \`予定「\${String(selection.event.label)}」\`}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{selection.iso}</p>
              </div>
              {selection.type === "date" ? (
                <div className="grid gap-2">
                  {selection.events.length > 0 ? (
                    selection.events.map((event) => (
                      <div key={event.id} className="rounded-md border bg-background px-3 py-2">
                        <p className="font-medium text-foreground">{event.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{event.ariaLabel}</p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-md border bg-muted/30 px-3 py-2 text-muted-foreground">この日に登録された予定はありません。</p>
                  )}
                </div>
              ) : (
                <div className="rounded-md border bg-muted/30 px-3 py-2">
                  <p className="font-medium text-foreground">{selection.event.label}</p>
                  <p className="mt-1 text-muted-foreground">{selection.event.ariaLabel}</p>
                </div>
              )}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}`
    : `import * as React from "react";
import {
  EventCalendar,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  type CalendarEvent,
} from "@gunjo/ui";

type CalendarSelection =
  | { type: "date"; iso: string; events: CalendarEvent[] }
  | { type: "event"; iso: string; event: CalendarEvent };

function eventDateIso(date: CalendarEvent["date"]) {
  if (date instanceof Date) {
    return \`\${date.getFullYear()}-\${String(date.getMonth() + 1).padStart(2, "0")}-\${String(date.getDate()).padStart(2, "0")}\`;
  }
  return date;
}

const events: CalendarEvent[] = [
  { id: "a1", date: "2026-06-03", label: "Feature: summer travel", tone: "info", ariaLabel: "Feature summer travel" },
  { id: "a4", date: "2026-06-15", label: "Deadline: series #12", tone: "destructive", ariaLabel: "Deadline series 12" },
  { id: "a5", date: "2026-06-15", label: "Final proof", tone: "warning", ariaLabel: "Final proof" },
  { id: "a6", date: "2026-06-15", label: "Schedule publish", tone: "primary", ariaLabel: "Schedule publish" },
  { id: "a7", date: "2026-06-24", label: "Publish: GunjoUI guide", tone: "primary", ariaLabel: "Publish GunjoUI guide" },
];

export function EditorialCalendar() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [month, setMonth] = React.useState(new Date(2026, 5, 1));
  const [selection, setSelection] = React.useState<CalendarSelection | null>(null);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  return (
    <div ref={rootRef} className="relative flex w-full max-w-3xl flex-col gap-4">
      <EventCalendar
        month={month}
        events={events}
        today="2026-06-24"
        label="Editorial calendar"
        weekdayLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        maxPerDay={3}
        onMonthChange={setMonth}
        onSelectDate={(iso) => setSelection({ type: "date", iso, events: events.filter((event) => event.date === iso) })}
        onSelectEvent={(event) => setSelection({ type: "event", iso: eventDateIso(event.date), event })}
      />
      <Sheet open={selection != null} onOpenChange={(open) => !open && setSelection(null)}>
        <SheetContent portalContainer={portalContainer} overlayClassName="rounded-md" closeLabel="Close">
          <SheetHeader>
            <SheetTitle asChild>
              <p>Preview</p>
            </SheetTitle>
            <SheetDescription>Review the selected date or event details.</SheetDescription>
          </SheetHeader>
          {selection ? (
            <div className="mt-4 grid gap-4 text-sm">
              <div className="rounded-lg border bg-card p-3">
                <p className="font-medium text-foreground">
                  {selection.type === "date" ? \`Schedule for \${selection.iso}\` : \`Event: \${String(selection.event.label)}\`}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{selection.iso}</p>
              </div>
              {selection.type === "date" ? (
                <div className="grid gap-2">
                  {selection.events.length > 0 ? (
                    selection.events.map((event) => (
                      <div key={event.id} className="rounded-md border bg-background px-3 py-2">
                        <p className="font-medium text-foreground">{event.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{event.ariaLabel}</p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-md border bg-muted/30 px-3 py-2 text-muted-foreground">No events are scheduled for this date.</p>
                  )}
                </div>
              ) : (
                <div className="rounded-md border bg-muted/30 px-3 py-2">
                  <p className="font-medium text-foreground">{selection.event.label}</p>
                  <p className="mt-1 text-muted-foreground">{selection.event.ariaLabel}</p>
                </div>
              )}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}`;

  const propsData = [
    {
      name: "month",
      type: "string | Date",
      description: locale === "ja" ? "表示する月に含まれる日付です。" : "Any date within the month to render.",
    },
    {
      name: "events",
      type: "CalendarEvent[]",
      description: locale === "ja" ? "日付に配置する予定です。id、date、label、tone、ariaLabel を渡します。" : "Events placed on dates. Pass id, date, label, tone, and ariaLabel.",
    },
    {
      name: "today",
      type: "string | Date",
      description: locale === "ja" ? "今日として強調する日付です。SSR の決定性のため渡します。" : "Date highlighted as today. Pass it for deterministic SSR.",
    },
    {
      name: "weekStartsOn",
      type: "0 | 1",
      default: "0",
      description: locale === "ja" ? "週の開始曜日です。0 は日曜、1 は月曜です。" : "Week start. 0 is Sunday, 1 is Monday.",
    },
    {
      name: "maxPerDay",
      type: "number",
      default: "3",
      description: locale === "ja" ? "1日に表示する予定チップ数です。超過分は +N で示します。" : "Maximum visible event chips per day before +N overflow.",
    },
    {
      name: "weekdayLabels",
      type: "string[]",
      description: locale === "ja" ? "日曜始まりの7つの曜日ラベルです。" : "Seven weekday labels starting from Sunday.",
    },
    {
      name: "renderEvent",
      type: "(event: CalendarEvent) => ReactNode",
      description: locale === "ja" ? "予定チップの描画を差し替えます。" : "Overrides event-chip rendering.",
    },
    {
      name: "onSelectDate / onSelectEvent",
      type: "(value) => void",
      description: locale === "ja" ? "日付または予定を選択した時に呼びます。" : "Called when a date or event is selected.",
    },
    {
      name: "onMonthChange",
      type: "(month: Date) => void",
      description: locale === "ja" ? "渡すと月見出しと前後移動ボタンを表示します。" : "When provided, renders the month heading and previous/next buttons.",
    },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "EventCalendar", href: "/docs/components/event-calendar" },
        { name: "Sheet", href: "/docs/components/sheet" },
        { name: "TooltipButton", href: "/docs/components/tooltip-button" },
      ]}
      relatedComponents={[
        { name: "Calendar", href: "/docs/components/calendar" },
        { name: "ScheduleGrid", href: "/docs/components/schedule-grid" },
        { name: "WeekView", href: "/docs/components/week-view" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="lg">
        <EventCalendarPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "event-overflow",
              title: locale === "ja" ? "予定の超過表示" : "Event overflow",
              description: locale === "ja"
                ? "同じ日に予定が多い場合、maxPerDay を超えた分を +N で表示します。"
                : "When a day has more events than maxPerDay, the extra items collapse into +N.",
              preview: <EventCalendarPreview locale={locale} maxPerDay={2} />,
              code: `<EventCalendar events={events} maxPerDay={2} month={month} />`,
              previewBodyWidth: "lg",
            },
            {
              key: "monday-start",
              title: locale === "ja" ? "月曜始まり" : "Monday start",
              description: locale === "ja"
                ? "weekStartsOn={1} と曜日ラベルで業務カレンダーの並びに合わせます。"
                : "Use weekStartsOn={1} with matching labels for business calendars.",
              preview: <EventCalendarPreview locale={locale} weekStartsOn={1} />,
              code: locale === "ja"
                ? `<EventCalendar
  month={month}
  events={events}
  weekStartsOn={1}
  weekdayLabels={["日", "月", "火", "水", "木", "金", "土"]}
/>`
                : `<EventCalendar
  month={month}
  events={events}
  weekStartsOn={1}
  weekdayLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
/>`,
              previewBodyWidth: "lg",
            },
            {
              key: "custom-render",
              title: locale === "ja" ? "予定チップの差し替え" : "Custom event chip",
              description: locale === "ja"
                ? "renderEvent で予定チップの見た目を差し替えられます。"
                : "Use renderEvent to replace the default event chip.",
              preview: (
                <div className="grid gap-3">
                  <Badge variant="secondary">{locale === "ja" ? "renderEvent 使用" : "Using renderEvent"}</Badge>
                  <EventCalendarPreview locale={locale} customEvent />
                </div>
              ),
              code: `<EventCalendar
  events={events}
  renderEvent={(event) => (
    <button type="button" className="w-full truncate rounded bg-accent px-1 py-0.5 text-left text-[11px]">
      {event.label}
    </button>
  )}
/>`,
              previewBodyWidth: "lg",
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
          {sectionLabels.props}
        </h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
            {sectionLabels.usage}
          </h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>
    </ComponentLayout>
  );
}
