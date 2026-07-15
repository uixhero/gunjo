"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import {
  CodeCopyButton,
  ComponentLayout,
  ComponentPreview,
} from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Badge, WeekView, type WeekEvent } from "@gunjo/ui";

type Locale = "ja" | "en";

type EventDetail = {
  time: string;
  location: string;
  owner: string;
  status: string;
  summary: string;
};

const WEEKDAYS = {
  ja: ["日", "月", "火", "水", "木", "金", "土"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
} satisfies Record<Locale, string[]>;

function events(locale: Locale): WeekEvent[] {
  return locale === "ja"
    ? [
        { id: "e1", start: "2026-06-22T09:00", end: "2026-06-22T10:30", label: "編集会議", tone: "info" },
        { id: "e2", start: "2026-06-22T10:00", end: "2026-06-22T11:00", label: "1on1", tone: "primary" },
        { id: "e3", start: "2026-06-23T13:00", end: "2026-06-23T15:00", label: "素材レビュー", tone: "warning" },
        { id: "e4", start: "2026-06-24T15:00", end: "2026-06-24T18:00", label: "撮影", tone: "success" },
        { id: "e5", start: "2026-06-26T10:00", end: "2026-06-26T11:30", label: "公開判定", tone: "destructive" },
      ]
    : [
        { id: "e1", start: "2026-06-22T09:00", end: "2026-06-22T10:30", label: "Editorial meeting", tone: "info" },
        { id: "e2", start: "2026-06-22T10:00", end: "2026-06-22T11:00", label: "One-on-one", tone: "primary" },
        { id: "e3", start: "2026-06-23T13:00", end: "2026-06-23T15:00", label: "Asset review", tone: "warning" },
        { id: "e4", start: "2026-06-24T15:00", end: "2026-06-24T18:00", label: "Photo shoot", tone: "success" },
        { id: "e5", start: "2026-06-26T10:00", end: "2026-06-26T11:30", label: "Launch decision", tone: "destructive" },
      ];
}

function eventDetails(locale: Locale): Record<string, EventDetail> {
  return locale === "ja"
    ? {
        e1: { time: "6/22 09:00-10:30", location: "編集室 A", owner: "担当: 青井", status: "議題確定", summary: "週次企画の優先順位と公開枠を確認します。" },
        e2: { time: "6/22 10:00-11:00", location: "オンライン", owner: "担当: 田中", status: "準備済み", summary: "進行中タスクとレビュー待ちの相談枠です。" },
        e3: { time: "6/23 13:00-15:00", location: "レビュー卓", owner: "担当: 佐藤", status: "確認中", summary: "公開前素材の差し替え候補と権利表記を確認します。" },
        e4: { time: "6/24 15:00-18:00", location: "スタジオ 2", owner: "担当: 撮影チーム", status: "進行中", summary: "キャンペーン用キービジュアルと商品カットを撮影します。" },
        e5: { time: "6/26 10:00-11:30", location: "会議室 C", owner: "担当: 公開判定会", status: "要承認", summary: "公開可否、影響範囲、未解決タスクを最終確認します。" },
      }
    : {
        e1: { time: "Jun 22 09:00-10:30", location: "Editorial room A", owner: "Owner: Aoi", status: "Agenda ready", summary: "Review weekly priorities and publishing slots." },
        e2: { time: "Jun 22 10:00-11:00", location: "Online", owner: "Owner: Tanaka", status: "Prepared", summary: "Discuss active tasks and review blockers." },
        e3: { time: "Jun 23 13:00-15:00", location: "Review desk", owner: "Owner: Sato", status: "In review", summary: "Check replacement assets and rights notices before publishing." },
        e4: { time: "Jun 24 15:00-18:00", location: "Studio 2", owner: "Owner: photo team", status: "In progress", summary: "Capture campaign hero visuals and product shots." },
        e5: { time: "Jun 26 10:00-11:30", location: "Meeting room C", owner: "Owner: launch review", status: "Approval needed", summary: "Confirm launch readiness, impact, and unresolved tasks." },
      };
}

function WeekViewPreview({ locale, mode = "workweek" }: { locale: Locale; mode?: "workweek" | "full" | "dense" }) {
  const [selectedEventId, setSelectedEventId] = React.useState("e4");

  React.useEffect(() => {
    setSelectedEventId(mode === "dense" ? "e1" : "e4");
  }, [locale, mode]);

  const visibleEvents = mode === "dense" ? events(locale).slice(0, 3) : events(locale);
  const selectedEvent = visibleEvents.find((event) => event.id === selectedEventId) ?? visibleEvents[0];
  const detail = eventDetails(locale)[selectedEvent.id];
  const selectedLabel = typeof selectedEvent.label === "string" ? selectedEvent.label : selectedEvent.id;

  return (
    <div className="flex w-full max-w-5xl flex-col gap-3 rounded-lg border bg-card p-4">
      <WeekView
        weekOf="2026-06-24"
        today="2026-06-24"
        events={visibleEvents}
        dayCount={mode === "full" ? 7 : 5}
        weekStartsOn={1}
        startHour={8}
        endHour={mode === "dense" ? 13 : 19}
        hourHeight={mode === "dense" ? 42 : 44}
        weekdayLabels={WEEKDAYS[locale]}
        daySuffix={locale === "ja" ? "曜" : ""}
        label={locale === "ja" ? "週表示カレンダー" : "Weekly calendar"}
        formatEventAriaLabel={(event, context) => {
          const eventLabel = event.ariaLabel ?? (typeof event.label === "string" ? event.label : event.id);
          return locale === "ja"
            ? `${context.weekday}曜 ${context.start}から${context.end} ${eventLabel}`
            : `${context.weekday} ${context.start} to ${context.end} ${eventLabel}`;
        }}
        onSelectEvent={(event) => setSelectedEventId(event.id)}
      />
      <section className="grid min-w-0 gap-3 rounded-md border bg-background p-3" aria-live="polite" aria-label={locale === "ja" ? "選択中予定の詳細" : "Selected event details"}>
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{selectedLabel}</h3>
            <Badge variant={selectedEvent.tone === "destructive" ? "destructive" : "secondary"}>{detail.status}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{detail.time} / {detail.location}</p>
          <p className="text-sm text-foreground">{detail.summary}</p>
        </div>
        <dl className="grid min-w-0 gap-2 rounded-md bg-muted/40 p-3 text-xs">
          <div>
            <dt className="text-muted-foreground">{locale === "ja" ? "担当" : "Owner"}</dt>
            <dd className="font-medium text-foreground">{detail.owner}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{locale === "ja" ? "表示範囲" : "Visible range"}</dt>
            <dd className="font-medium text-foreground">{mode === "full" ? (locale === "ja" ? "7日表示" : "Full week") : mode === "dense" ? (locale === "ja" ? "午前の重なり" : "Morning overlap") : (locale === "ja" ? "平日表示" : "Workweek")}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

export default function WeekViewDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/week-view", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.weekView.title ?? "WeekView";
  const description = content?.description ?? metadata.weekView.description ?? "";

  const usageCode =
    locale === "ja"
      ? `import * as React from "react";
import { Badge, WeekView, type WeekEvent } from "@gunjo/ui";

const events: WeekEvent[] = [
  { id: "e1", start: "2026-06-22T09:00", end: "2026-06-22T10:30", label: "編集会議", tone: "info" },
  { id: "e2", start: "2026-06-22T10:00", end: "2026-06-22T11:00", label: "1on1", tone: "primary" },
  { id: "e3", start: "2026-06-23T13:00", end: "2026-06-23T15:00", label: "素材レビュー", tone: "warning" },
  { id: "e4", start: "2026-06-24T15:00", end: "2026-06-24T18:00", label: "撮影", tone: "success" },
  { id: "e5", start: "2026-06-26T10:00", end: "2026-06-26T11:30", label: "公開判定", tone: "destructive" },
];

const details = {
  e1: { time: "6/22 09:00-10:30", location: "編集室 A", owner: "担当: 青井", status: "議題確定", summary: "週次企画の優先順位と公開枠を確認します。" },
  e2: { time: "6/22 10:00-11:00", location: "オンライン", owner: "担当: 田中", status: "準備済み", summary: "進行中タスクとレビュー待ちの相談枠です。" },
  e3: { time: "6/23 13:00-15:00", location: "レビュー卓", owner: "担当: 佐藤", status: "確認中", summary: "公開前素材の差し替え候補と権利表記を確認します。" },
  e4: { time: "6/24 15:00-18:00", location: "スタジオ 2", owner: "担当: 撮影チーム", status: "進行中", summary: "キャンペーン用キービジュアルと商品カットを撮影します。" },
  e5: { time: "6/26 10:00-11:30", location: "会議室 C", owner: "担当: 公開判定会", status: "要承認", summary: "公開可否、影響範囲、未解決タスクを最終確認します。" },
};

export function WeeklySchedule() {
  const [selectedEventId, setSelectedEventId] = React.useState("e4");
  const selectedEvent = events.find((event) => event.id === selectedEventId)!;
  const detail = details[selectedEventId as keyof typeof details];

  return (
    <div className="flex w-full max-w-5xl flex-col gap-3 rounded-lg border bg-card p-4">
      <WeekView weekOf="2026-06-24" today="2026-06-24" events={events} weekStartsOn={1} dayCount={5} startHour={8} endHour={19} label="週表示カレンダー" onSelectEvent={(event) => setSelectedEventId(event.id)} />
      <section className="grid min-w-0 gap-3 rounded-md border bg-background p-3" aria-live="polite" aria-label="選択中予定の詳細">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{selectedEvent.label}</h3>
            <Badge variant="secondary">{detail.status}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{detail.time} / {detail.location}</p>
          <p className="text-sm text-foreground">{detail.summary}</p>
        </div>
        <dl className="grid min-w-0 gap-2 rounded-md bg-muted/40 p-3 text-xs">
          <div><dt className="text-muted-foreground">担当</dt><dd className="font-medium text-foreground">{detail.owner}</dd></div>
          <div><dt className="text-muted-foreground">表示範囲</dt><dd className="font-medium text-foreground">平日表示</dd></div>
        </dl>
      </section>
    </div>
  );
}`
      : `import * as React from "react";
import { Badge, WeekView, type WeekEvent } from "@gunjo/ui";

const events: WeekEvent[] = [
  { id: "e1", start: "2026-06-22T09:00", end: "2026-06-22T10:30", label: "Editorial meeting", tone: "info" },
  { id: "e2", start: "2026-06-22T10:00", end: "2026-06-22T11:00", label: "One-on-one", tone: "primary" },
  { id: "e3", start: "2026-06-23T13:00", end: "2026-06-23T15:00", label: "Asset review", tone: "warning" },
  { id: "e4", start: "2026-06-24T15:00", end: "2026-06-24T18:00", label: "Photo shoot", tone: "success" },
  { id: "e5", start: "2026-06-26T10:00", end: "2026-06-26T11:30", label: "Launch decision", tone: "destructive" },
];

const details = {
  e1: { time: "Jun 22 09:00-10:30", location: "Editorial room A", owner: "Owner: Aoi", status: "Agenda ready", summary: "Review weekly priorities and publishing slots." },
  e2: { time: "Jun 22 10:00-11:00", location: "Online", owner: "Owner: Tanaka", status: "Prepared", summary: "Discuss active tasks and review blockers." },
  e3: { time: "Jun 23 13:00-15:00", location: "Review desk", owner: "Owner: Sato", status: "In review", summary: "Check replacement assets and rights notices before publishing." },
  e4: { time: "Jun 24 15:00-18:00", location: "Studio 2", owner: "Owner: photo team", status: "In progress", summary: "Capture campaign hero visuals and product shots." },
  e5: { time: "Jun 26 10:00-11:30", location: "Meeting room C", owner: "Owner: launch review", status: "Approval needed", summary: "Confirm launch readiness, impact, and unresolved tasks." },
};

export function WeeklySchedule() {
  const [selectedEventId, setSelectedEventId] = React.useState("e4");
  const selectedEvent = events.find((event) => event.id === selectedEventId)!;
  const detail = details[selectedEventId as keyof typeof details];

  return (
    <div className="flex w-full max-w-5xl flex-col gap-3 rounded-lg border bg-card p-4">
      <WeekView weekOf="2026-06-24" today="2026-06-24" events={events} weekStartsOn={1} dayCount={5} startHour={8} endHour={19} weekdayLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]} daySuffix="" label="Weekly calendar" onSelectEvent={(event) => setSelectedEventId(event.id)} />
      <section className="grid min-w-0 gap-3 rounded-md border bg-background p-3" aria-live="polite" aria-label="Selected event details">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{selectedEvent.label}</h3>
            <Badge variant="secondary">{detail.status}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{detail.time} / {detail.location}</p>
          <p className="text-sm text-foreground">{detail.summary}</p>
        </div>
        <dl className="grid min-w-0 gap-2 rounded-md bg-muted/40 p-3 text-xs">
          <div><dt className="text-muted-foreground">Owner</dt><dd className="font-medium text-foreground">{detail.owner}</dd></div>
          <div><dt className="text-muted-foreground">Visible range</dt><dd className="font-medium text-foreground">Workweek</dd></div>
        </dl>
      </section>
    </div>
  );
}`;

  const fullWeekCode =
    locale === "ja"
      ? usageCode
          .replace("dayCount={5}", "dayCount={7}")
          .replace("平日表示</dd>", "7日表示</dd>")
      : usageCode
          .replace("dayCount={5}", "dayCount={7}")
          .replace("Workweek</dd>", "Full week</dd>");

  const denseCode =
    locale === "ja"
      ? usageCode
          .replace('React.useState("e4")', 'React.useState("e1")')
          .replace("dayCount={5} startHour={8} endHour={19}", "dayCount={5} startHour={8} endHour={13} hourHeight={42}")
          .replace("平日表示</dd>", "午前の重なり</dd>")
      : usageCode
          .replace('React.useState("e4")', 'React.useState("e1")')
          .replace("dayCount={5} startHour={8} endHour={19}", "dayCount={5} startHour={8} endHour={13} hourHeight={42}")
          .replace("Workweek</dd>", "Morning overlap</dd>");

  const propsData = [
    { name: "weekOf", type: "string | Date", description: locale === "ja" ? "表示する週に含まれる日付です。" : "Any date within the week to display." },
    { name: "events", type: "WeekEvent[]", description: locale === "ja" ? "開始、終了、ラベル、toneを持つ予定です。重なりは横並びになります。" : "Events with start, end, label, and tone. Overlaps are packed side by side." },
    { name: "dayCount", type: "number", default: "7", description: locale === "ja" ? "表示する日数です。5で平日表示になります。" : "Number of day columns. Use 5 for a workweek." },
    { name: "weekStartsOn", type: "0 | 1", default: "0", description: locale === "ja" ? "週の開始曜日です。" : "Start day of the week." },
    { name: "startHour / endHour", type: "number", default: "8 / 21", description: locale === "ja" ? "表示する時間帯です。" : "Visible hour range." },
    { name: "weekdayLabels / daySuffix", type: "string[] / string", description: locale === "ja" ? "曜日ヘッダーと読み上げ用の曜日接尾辞です。" : "Weekday headers and suffix used in event accessible names." },
    { name: "formatEventAriaLabel", type: "function", description: locale === "ja" ? "予定ボタンの読み上げ名を上書きします。関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。event+context から合成するため serializable な代替は無く、RSC からは \"use client\" ラッパーで包む。(#338)" : "Overrides event button accessible names. Function prop — pass only from a Client Component; from a Server Component it breaks next build. It composes from event + context so there is no serializable preset — wrap in a \"use client\" component to pass it from an RSC. (#338)" },
    { name: "onSelectEvent", type: "(event: WeekEvent) => void", description: locale === "ja" ? "予定を選択した時に呼ばれます。" : "Called when an event is selected." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "WeekView", href: "/docs/components/week-view" }]}
      relatedComponents={[{ name: "EventCalendar", href: "/docs/components/event-calendar" }, { name: "ScheduleGrid", href: "/docs/components/schedule-grid" }, { name: "SwatchLegend", href: "/docs/components/chart-legend" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="xl">
        <WeekViewPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            { key: "workweek", title: locale === "ja" ? "平日表示" : "Workweek", description: locale === "ja" ? "dayCount=5 と weekStartsOn=1 で月曜始まりの平日表示にします。" : "Use dayCount=5 and weekStartsOn=1 for a Monday-start workweek.", preview: <WeekViewPreview locale={locale} />, code: usageCode, previewBodyWidth: "xl" },
            { key: "full", title: locale === "ja" ? "7日表示" : "Full week", description: locale === "ja" ? "週末も含める場合は dayCount=7 を使います。" : "Use dayCount=7 when weekends are part of the schedule.", preview: <WeekViewPreview locale={locale} mode="full" />, code: fullWeekCode, previewBodyWidth: "xl" },
            { key: "dense", title: locale === "ja" ? "重なり予定" : "Overlapping events", description: locale === "ja" ? "同時間帯の予定は列内で横並びになります。" : "Overlapping events are packed side by side within a day.", preview: <WeekViewPreview locale={locale} mode="dense" />, code: denseCode, previewBodyWidth: "xl" },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">{sectionLabels.props}</h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">{sectionLabels.usage}</h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>
    </ComponentLayout>
  );
}
