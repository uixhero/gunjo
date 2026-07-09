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
  Button,
  Input,
  ScheduleGrid,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  type ScheduleAxisItem,
  type ScheduleCell,
} from "@gunjo/ui";

type Locale = "ja" | "en";
type EntryKind = "lesson" | "open" | "unavailable";

interface ScheduleEntry {
  rowId: string;
  colId: string;
  kind: EntryKind;
  subject: string;
  detail: string;
  teacher?: string;
  room?: string;
  tone?: ScheduleCell["tone"];
  description: string;
  unavailableReason?: string;
}

function axes(locale: Locale): { rows: ScheduleAxisItem[]; columns: ScheduleAxisItem[] } {
  return locale === "ja"
    ? {
        rows: [
          { id: "p1", label: "1限", sublabel: "8:50", ariaLabel: "1限" },
          { id: "p2", label: "2限", sublabel: "9:50", ariaLabel: "2限" },
          { id: "p3", label: "3限", sublabel: "10:50", ariaLabel: "3限" },
        ],
        columns: [
          { id: "mon", label: "月", ariaLabel: "月曜" },
          { id: "tue", label: "火", ariaLabel: "火曜" },
          { id: "wed", label: "水", ariaLabel: "水曜" },
        ],
      }
    : {
        rows: [
          { id: "p1", label: "P1", sublabel: "8:50", ariaLabel: "Period 1" },
          { id: "p2", label: "P2", sublabel: "9:50", ariaLabel: "Period 2" },
          { id: "p3", label: "P3", sublabel: "10:50", ariaLabel: "Period 3" },
        ],
        columns: [
          { id: "mon", label: "Mon", ariaLabel: "Monday" },
          { id: "tue", label: "Tue", ariaLabel: "Tuesday" },
          { id: "wed", label: "Wed", ariaLabel: "Wednesday" },
        ],
      };
}

function entries(locale: Locale): ScheduleEntry[] {
  return locale === "ja"
    ? [
        { rowId: "p1", colId: "mon", kind: "lesson", subject: "数学", detail: "佐藤 / 2-A", teacher: "佐藤", room: "2-A", description: "数学、佐藤、2-A" },
        { rowId: "p1", colId: "tue", kind: "lesson", subject: "英語", detail: "田中 / 3-B", teacher: "田中", room: "3-B", tone: "info", description: "英語、田中、3-B" },
        { rowId: "p1", colId: "wed", kind: "open", subject: "空き", detail: "授業を追加できます", description: "空き、授業を追加できます" },
        { rowId: "p2", colId: "mon", kind: "unavailable", subject: "利用不可", detail: "全校集会", description: "利用不可、全校集会", unavailableReason: "全校集会のため、この時限には授業を登録できません。" },
        { rowId: "p2", colId: "tue", kind: "lesson", subject: "数学", detail: "佐藤 / 2-A", teacher: "佐藤", room: "2-A", tone: "destructive", description: "数学、佐藤、競合あり" },
        { rowId: "p2", colId: "wed", kind: "open", subject: "空き", detail: "授業を追加できます", description: "空き、授業を追加できます" },
        { rowId: "p3", colId: "mon", kind: "open", subject: "空き", detail: "授業を追加できます", description: "空き、授業を追加できます" },
        { rowId: "p3", colId: "tue", kind: "open", subject: "空き", detail: "授業を追加できます", description: "空き、授業を追加できます" },
        { rowId: "p3", colId: "wed", kind: "lesson", subject: "理科", detail: "山本 / 実験室", teacher: "山本", room: "実験室", tone: "success", description: "理科、山本、実験室" },
      ]
    : [
        { rowId: "p1", colId: "mon", kind: "lesson", subject: "Math", detail: "Sato / 2-A", teacher: "Sato", room: "2-A", description: "Math, Sato, room 2-A" },
        { rowId: "p1", colId: "tue", kind: "lesson", subject: "English", detail: "Tanaka / 3-B", teacher: "Tanaka", room: "3-B", tone: "info", description: "English, Tanaka, room 3-B" },
        { rowId: "p1", colId: "wed", kind: "open", subject: "Open", detail: "Add a lesson", description: "Open slot, add a lesson" },
        { rowId: "p2", colId: "mon", kind: "unavailable", subject: "Unavailable", detail: "School assembly", description: "Unavailable, school assembly", unavailableReason: "A school assembly blocks this period, so a lesson cannot be scheduled." },
        { rowId: "p2", colId: "tue", kind: "lesson", subject: "Math", detail: "Sato / 2-A", teacher: "Sato", room: "2-A", tone: "destructive", description: "Math, Sato, conflict" },
        { rowId: "p2", colId: "wed", kind: "open", subject: "Open", detail: "Add a lesson", description: "Open slot, add a lesson" },
        { rowId: "p3", colId: "mon", kind: "open", subject: "Open", detail: "Add a lesson", description: "Open slot, add a lesson" },
        { rowId: "p3", colId: "tue", kind: "open", subject: "Open", detail: "Add a lesson", description: "Open slot, add a lesson" },
        { rowId: "p3", colId: "wed", kind: "lesson", subject: "Science", detail: "Yamamoto / Lab", teacher: "Yamamoto", room: "Lab", tone: "success", description: "Science, Yamamoto, lab" },
      ];
}

function LessonCard({ entry, locale }: { entry: ScheduleEntry; locale: Locale }) {
  return (
    <div className="space-y-0.5">
      <p className="font-medium text-foreground">{entry.subject}</p>
      <p className="text-xs text-muted-foreground">{entry.detail}</p>
      {entry.tone === "destructive" ? <Badge variant="destructive">{locale === "ja" ? "競合" : "Conflict"}</Badge> : null}
    </div>
  );
}

function OpenSlotCard({ locale }: { locale: Locale }) {
  return (
    <div className="space-y-0.5">
      <p className="font-medium text-muted-foreground">{locale === "ja" ? "空き" : "Open"}</p>
      <p className="text-xs text-muted-foreground">{locale === "ja" ? "授業を追加" : "Add lesson"}</p>
    </div>
  );
}

function LessonDetail({ entry, locale }: { entry: ScheduleEntry; locale: Locale }) {
  return (
    <div className="grid gap-4 text-sm">
      <div className="rounded-md border bg-muted/30 p-3">
        <p className="text-xs font-medium text-muted-foreground">{locale === "ja" ? "予定" : "Event"}</p>
        <p className="mt-1 text-base font-semibold text-foreground">{entry.subject}</p>
        <p className="text-muted-foreground">{entry.detail}</p>
      </div>
      <dl className="grid grid-cols-2 gap-3">
        <div>
          <dt className="text-xs text-muted-foreground">{locale === "ja" ? "担当" : "Teacher"}</dt>
          <dd className="font-medium text-foreground">{entry.teacher}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{locale === "ja" ? "教室" : "Room"}</dt>
          <dd className="font-medium text-foreground">{entry.room}</dd>
        </div>
      </dl>
      {entry.tone === "destructive" ? (
        <div className="rounded-md border border-destructive-border bg-destructive-subtle p-3 text-destructive">
          {locale === "ja" ? "同じ担当者に重複した授業があります。担当者または時限を調整してください。" : "This teacher has a scheduling conflict. Adjust the teacher or period."}
        </div>
      ) : null}
      <Button type="button" size="sm">{locale === "ja" ? "予定を編集" : "Edit event"}</Button>
    </div>
  );
}

function CreateLessonForm({ entry, locale }: { entry: ScheduleEntry; locale: Locale }) {
  return (
    <div className="grid gap-4">
      <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
        {locale === "ja" ? "この空き枠に登録する授業を入力します。" : "Enter the lesson to place in this open slot."}
      </div>
      <label className="grid gap-1.5 text-sm font-medium">
        {locale === "ja" ? "科目" : "Subject"}
        <Input defaultValue={entry.subject === "空き" || entry.subject === "Open" ? "" : entry.subject} placeholder={locale === "ja" ? "例: 国語" : "e.g. Literature"} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        {locale === "ja" ? "担当 / 教室" : "Teacher / room"}
        <Input placeholder={locale === "ja" ? "例: 鈴木 / 1-A" : "e.g. Suzuki / 1-A"} />
      </label>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" size="sm">{locale === "ja" ? "下書き保存" : "Save draft"}</Button>
        <Button type="button" size="sm">{locale === "ja" ? "授業を追加" : "Add lesson"}</Button>
      </div>
    </div>
  );
}

function ScheduleGridPreview({ locale, mode = "default" }: { locale: Locale; mode?: "default" | "conflict" | "compact" }) {
  const { rows, columns } = axes(locale);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [selectedEntry, setSelectedEntry] = React.useState<ScheduleEntry | null>(null);
  const [isLargeViewport, setIsLargeViewport] = React.useState(false);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  React.useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const update = () => {
      const surface = node.parentElement ?? node;
      setIsLargeViewport(surface.getBoundingClientRect().width >= 900);
    };
    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const shownColumns = mode === "compact" ? columns.slice(0, 2) : columns;
  const shownColumnIds = new Set(shownColumns.map((column) => column.id));
  const shownEntries = entries(locale)
    .filter((entry) => shownColumnIds.has(entry.colId))
    .filter((entry) => (mode === "conflict" ? entry.tone === "destructive" || entry.kind === "unavailable" : true));

  const cells: ScheduleCell[] = shownEntries.map((entry) => {
    if (entry.kind === "unavailable") {
      return {
        rowId: entry.rowId,
        colId: entry.colId,
        unavailable: true,
        unavailableReason: entry.unavailableReason,
        description: entry.description,
      };
    }

    return {
      rowId: entry.rowId,
      colId: entry.colId,
      tone: entry.kind === "open" ? "muted" : entry.tone,
      content: entry.kind === "open" ? <OpenSlotCard locale={locale} /> : <LessonCard entry={entry} locale={locale} />,
      description: entry.description,
      onSelect: () => setSelectedEntry(entry),
    };
  });

  const sheetTitle = selectedEntry?.kind === "open"
    ? locale === "ja" ? "授業を追加" : "Add lesson"
    : locale === "ja" ? "予定の詳細" : "Event details";

  return (
    <div ref={rootRef} className="relative flex w-full max-w-3xl flex-col gap-3 overflow-hidden rounded-lg border bg-card p-4">
      <ScheduleGrid
        label={locale === "ja" ? "2年A組 週間時間割" : "Class 2-A weekly timetable"}
        cornerLabel={locale === "ja" ? "時限" : "Period"}
        rows={rows}
        columns={shownColumns}
        cells={cells}
        emptyLabel={locale === "ja" ? "空き" : "Empty"}
        unavailableLabel={locale === "ja" ? "利用不可" : "Unavailable"}
        renderEmpty={() => <OpenSlotCard locale={locale} />}
      />
      <Sheet modal={false} open={selectedEntry != null} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <SheetContent
          side={isLargeViewport ? "right" : "bottom"}
          portalContainer={portalContainer}
          overlayClassName="rounded-lg"
          closeLabel={locale === "ja" ? "閉じる" : "Close"}
          className={isLargeViewport ? "w-80 max-w-[calc(100%-1rem)] overflow-y-auto p-4" : "max-h-[74%] overflow-y-auto p-4"}
        >
          {selectedEntry ? (
            <>
              <SheetHeader className="pr-8">
                <SheetTitle>{sheetTitle}</SheetTitle>
                <SheetDescription>{selectedEntry.detail}</SheetDescription>
              </SheetHeader>
              {selectedEntry.kind === "open" ? <CreateLessonForm entry={selectedEntry} locale={locale} /> : <LessonDetail entry={selectedEntry} locale={locale} />}
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function ScheduleGridDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/schedule-grid", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.scheduleGrid.title ?? "ScheduleGrid";
  const description = content?.description ?? metadata.scheduleGrid.description ?? "";

  const usageCode = locale === "ja" ? String.raw`import * as React from "react";
import {
  Button,
  Input,
  ScheduleGrid,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  type ScheduleAxisItem,
  type ScheduleCell,
} from "@gunjo/ui";

const rows: ScheduleAxisItem[] = [
  { id: "p1", label: "1限", sublabel: "8:50", ariaLabel: "1限" },
  { id: "p2", label: "2限", sublabel: "9:50", ariaLabel: "2限" },
  { id: "p3", label: "3限", sublabel: "10:50", ariaLabel: "3限" },
];
const columns: ScheduleAxisItem[] = [
  { id: "mon", label: "月", ariaLabel: "月曜" },
  { id: "tue", label: "火", ariaLabel: "火曜" },
  { id: "wed", label: "水", ariaLabel: "水曜" },
];

export function WeeklyTimetable() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [selected, setSelected] = React.useState<"math" | "english" | "conflict" | "science" | "open" | null>(null);
  const [isLargeViewport, setIsLargeViewport] = React.useState(false);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);
  React.useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const update = () => {
      const surface = node.parentElement ?? node;
      setIsLargeViewport(surface.getBoundingClientRect().width >= 900);
    };
    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const cells: ScheduleCell[] = [
    { rowId: "p1", colId: "mon", content: <span>数学 / 佐藤</span>, description: "数学、佐藤、2-A", onSelect: () => setSelected("math") },
    { rowId: "p1", colId: "tue", tone: "info", content: <span>英語 / 田中</span>, description: "英語、田中、3-B", onSelect: () => setSelected("english") },
    { rowId: "p1", colId: "wed", tone: "muted", content: <span>空き / 授業を追加</span>, description: "空き、授業を追加できます", onSelect: () => setSelected("open") },
    { rowId: "p2", colId: "mon", unavailable: true, unavailableReason: "全校集会のため、この時限には授業を登録できません。" },
    { rowId: "p2", colId: "tue", tone: "destructive", content: <span>数学 / 競合</span>, description: "数学、競合あり", onSelect: () => setSelected("conflict") },
    { rowId: "p3", colId: "wed", tone: "success", content: <span>理科 / 山本</span>, description: "理科、山本、実験室", onSelect: () => setSelected("science") },
  ];

  return (
    <div ref={rootRef} className="relative flex w-full max-w-3xl flex-col gap-3 overflow-hidden rounded-lg border bg-card p-4">
      <ScheduleGrid label="2年A組 週間時間割" cornerLabel="時限" rows={rows} columns={columns} cells={cells} emptyLabel="空き" unavailableLabel="利用不可" />
      <Sheet modal={false} open={selected != null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side={isLargeViewport ? "right" : "bottom"} portalContainer={portalContainer} className="overflow-y-auto p-4">
          <SheetHeader className="pr-8">
            <SheetTitle>{selected === "open" ? "授業を追加" : "予定の詳細"}</SheetTitle>
            <SheetDescription>{selected === "open" ? "この空き枠に登録する授業を入力します。" : "選択した授業の担当と教室を確認します。"}</SheetDescription>
          </SheetHeader>
          {selected === "open" ? (
            <div className="grid gap-4">
              <Input placeholder="例: 国語" />
              <Input placeholder="例: 鈴木 / 1-A" />
              <Button type="button" size="sm">授業を追加</Button>
            </div>
          ) : (
            <div className="grid gap-3 text-sm">
              <p className="font-semibold">数学 / 佐藤</p>
              <p className="text-muted-foreground">2-A</p>
              <Button type="button" size="sm">予定を編集</Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}` : String.raw`import * as React from "react";
import {
  Button,
  Input,
  ScheduleGrid,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  type ScheduleAxisItem,
  type ScheduleCell,
} from "@gunjo/ui";

const rows: ScheduleAxisItem[] = [
  { id: "p1", label: "P1", sublabel: "8:50", ariaLabel: "Period 1" },
  { id: "p2", label: "P2", sublabel: "9:50", ariaLabel: "Period 2" },
  { id: "p3", label: "P3", sublabel: "10:50", ariaLabel: "Period 3" },
];
const columns: ScheduleAxisItem[] = [
  { id: "mon", label: "Mon", ariaLabel: "Monday" },
  { id: "tue", label: "Tue", ariaLabel: "Tuesday" },
  { id: "wed", label: "Wed", ariaLabel: "Wednesday" },
];

export function WeeklyTimetable() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [selected, setSelected] = React.useState<"math" | "english" | "conflict" | "science" | "open" | null>(null);
  const [isLargeViewport, setIsLargeViewport] = React.useState(false);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);
  React.useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const update = () => {
      const surface = node.parentElement ?? node;
      setIsLargeViewport(surface.getBoundingClientRect().width >= 900);
    };
    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const cells: ScheduleCell[] = [
    { rowId: "p1", colId: "mon", content: <span>Math / Sato</span>, description: "Math, Sato, room 2-A", onSelect: () => setSelected("math") },
    { rowId: "p1", colId: "tue", tone: "info", content: <span>English / Tanaka</span>, description: "English, Tanaka, room 3-B", onSelect: () => setSelected("english") },
    { rowId: "p1", colId: "wed", tone: "muted", content: <span>Open / Add lesson</span>, description: "Open slot, add a lesson", onSelect: () => setSelected("open") },
    { rowId: "p2", colId: "mon", unavailable: true, unavailableReason: "A school assembly blocks this period, so a lesson cannot be scheduled." },
    { rowId: "p2", colId: "tue", tone: "destructive", content: <span>Math / conflict</span>, description: "Math, conflict", onSelect: () => setSelected("conflict") },
    { rowId: "p3", colId: "wed", tone: "success", content: <span>Science / Yamamoto</span>, description: "Science, Yamamoto, lab", onSelect: () => setSelected("science") },
  ];

  return (
    <div ref={rootRef} className="relative flex w-full max-w-3xl flex-col gap-3 overflow-hidden rounded-lg border bg-card p-4">
      <ScheduleGrid label="Class 2-A weekly timetable" cornerLabel="Period" rows={rows} columns={columns} cells={cells} emptyLabel="Empty" unavailableLabel="Unavailable" />
      <Sheet modal={false} open={selected != null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side={isLargeViewport ? "right" : "bottom"} portalContainer={portalContainer} className="overflow-y-auto p-4">
          <SheetHeader className="pr-8">
            <SheetTitle>{selected === "open" ? "Add lesson" : "Event details"}</SheetTitle>
            <SheetDescription>{selected === "open" ? "Enter the lesson to place in this open slot." : "Review the selected lesson, teacher, and room."}</SheetDescription>
          </SheetHeader>
          {selected === "open" ? (
            <div className="grid gap-4">
              <Input placeholder="e.g. Literature" />
              <Input placeholder="e.g. Suzuki / 1-A" />
              <Button type="button" size="sm">Add lesson</Button>
            </div>
          ) : (
            <div className="grid gap-3 text-sm">
              <p className="font-semibold">Math / Sato</p>
              <p className="text-muted-foreground">2-A</p>
              <Button type="button" size="sm">Edit event</Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}`;

  const propsData = [
    { name: "rows / columns", type: "ScheduleAxisItem[]", description: locale === "ja" ? "行軸と列軸です。label/sublabel/ariaLabel を持ちます。" : "Row and column axes with label, sublabel, and ariaLabel." },
    { name: "cells", type: "ScheduleCell[]", description: locale === "ja" ? "rowId と colId でセルを配置します。" : "Cells addressed by rowId and colId." },
    { name: "ScheduleCell.content", type: "ReactNode", description: locale === "ja" ? "セル本文です。" : "Cell body." },
    { name: "ScheduleCell.tone", type: "ScheduleCellTone", description: locale === "ja" ? "セルの状態トーンです。destructive は競合リングを持ちます。" : "Cell tone. destructive adds a conflict ring." },
    { name: "ScheduleCell.onSelect", type: "() => void", description: locale === "ja" ? "セルをクリック/Enter/Spaceで操作可能にします。" : "Makes a cell activatable by click, Enter, or Space." },
    { name: "unavailable / unavailableLabel", type: "boolean / string", description: locale === "ja" ? "利用不可スロットとその表示/読み上げ名です。" : "Unavailable slot and its visible/announced label." },
    { name: "unavailableReason", type: "ReactNode", description: locale === "ja" ? "利用不可セルにホバー/フォーカスした時に表示する理由です。" : "Reason shown when an unavailable cell is hovered or focused." },
    { name: "emptyLabel / renderEmpty", type: "string / function", description: locale === "ja" ? "空セルの読み上げ名と表示を指定します。空き枠を操作対象にする場合は onSelect 付きのセルとして渡します。" : "Label and render function for empty slots. Pass an open slot as an onSelect cell when it should be actionable." },
    { name: "minColumnWidth / rowHeaderWidth", type: "number", description: locale === "ja" ? "横スクロール前の列幅と固定行ヘッダー幅です。" : "Column min width and sticky row-header width." },
  ];

  return (
    <ComponentLayout title={title} description={description} sectionLabels={sectionLabels} usedComponents={[{ name: "ScheduleGrid", href: "/docs/components/schedule-grid" }, { name: "Sheet", href: "/docs/components/sheet" }, { name: "Tooltip", href: "/docs/components/tooltip" }]} relatedComponents={[{ name: "Table", href: "/docs/components/table" }, { name: "Calendar", href: "/docs/components/calendar" }]}>
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="xl">
        <ScheduleGridPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">{locale === "ja" ? "状態とバリエーション" : "States and variants"}</h2>
        <ComponentDemoStates
          states={[
            { key: "matrix", title: locale === "ja" ? "予定表" : "Timetable", description: locale === "ja" ? "予定セルは詳細 Sheet、空きセルは予定追加 Sheet を開きます。" : "Scheduled cells open details; open slots open an add-lesson sheet.", preview: <ScheduleGridPreview locale={locale} />, code: usageCode, previewBodyWidth: "xl" },
            { key: "conflict", title: locale === "ja" ? "競合と利用不可" : "Conflict and unavailable", description: locale === "ja" ? "競合セルは詳細で調整内容を確認し、利用不可セルは理由を Tooltip で示します。" : "Conflict cells open details; unavailable cells explain the reason with a tooltip.", preview: <ScheduleGridPreview locale={locale} mode="conflict" />, code: usageCode, previewBodyWidth: "xl" },
            { key: "compact", title: locale === "ja" ? "列数を絞る" : "Fewer columns", description: locale === "ja" ? "狭い画面では列数や minColumnWidth を調整します。" : "Use fewer columns or tune minColumnWidth in narrow contexts.", preview: <ScheduleGridPreview locale={locale} mode="compact" />, code: usageCode, previewBodyWidth: "lg" },
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
