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
  Gantt,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  type GanttItem,
  type GanttRow,
} from "@gunjo/ui";

type Locale = "ja" | "en";
type GanttDetailTone = NonNullable<GanttItem["tone"]>;

const GANTT_DETAIL_TONE: Record<GanttDetailTone, { panel: string }> = {
  default: { panel: "border-border bg-background" },
  primary: { panel: "border-primary bg-primary/10" },
  info: { panel: "border-info-border bg-info-subtle/55" },
  success: { panel: "border-success-border bg-success-subtle/55" },
  warning: { panel: "border-warning-border bg-warning-subtle/65" },
  destructive: { panel: "border-destructive-border bg-destructive-subtle/55" },
  muted: { panel: "border-border bg-muted/55" },
};

function ganttCopy(locale: Locale) {
  return locale === "ja"
    ? {
        label: "生産ライン計画",
        detailTitle: "工程詳細",
        rowLabel: "担当ライン",
        periodLabel: "期間",
        ownerLabel: "責任者",
        nextLabel: "次の作業",
        closeLabel: "閉じる",
        rows: [
          { id: "l1", label: "第1ライン", sublabel: "組立" },
          { id: "l2", label: "第2ライン", sublabel: "塗装" },
          { id: "l3", label: "第3ライン", sublabel: "検査" },
          { id: "l4", label: "第4ライン", sublabel: "梱包" },
          { id: "l5", label: "第5ライン", sublabel: "出荷前確認" },
          { id: "l6", label: "保全チーム", sublabel: "設備点検" },
        ] satisfies GanttRow[],
        items: [
          { id: "j1", rowId: "l1", start: "2026-06-22", end: "2026-06-24", label: "A-101", tone: "info", ariaLabel: "A-101 組立" },
          { id: "j2", rowId: "l1", start: "2026-06-24", end: "2026-06-27", label: "A-102", tone: "primary", ariaLabel: "A-102 組立" },
          { id: "j3", rowId: "l2", start: "2026-06-22", end: "2026-06-25", label: "B-201", tone: "success", ariaLabel: "B-201 塗装" },
          { id: "j4", rowId: "l2", start: "2026-06-23", end: "2026-06-26", label: "B-202", tone: "warning", ariaLabel: "B-202 塗装" },
          { id: "j5", rowId: "l3", start: "2026-06-25", end: "2026-06-28", label: "検査枠", tone: "muted", ariaLabel: "検査枠" },
          { id: "j6", rowId: "l4", start: "2026-06-22", end: "2026-06-23", label: "梱包準備", tone: "info", ariaLabel: "梱包準備" },
          { id: "j7", rowId: "l4", start: "2026-06-25", end: "2026-06-28", label: "出荷梱包", tone: "success", ariaLabel: "出荷梱包" },
          { id: "j8", rowId: "l5", start: "2026-06-24", end: "2026-06-26", label: "出荷判定", tone: "warning", ariaLabel: "出荷判定" },
          { id: "j9", rowId: "l6", start: "2026-06-21", end: "2026-06-22", label: "設備点検", tone: "destructive", ariaLabel: "設備点検" },
        ] satisfies GanttItem[],
      }
    : {
        label: "Production line plan",
        detailTitle: "Job details",
        rowLabel: "Line",
        periodLabel: "Window",
        ownerLabel: "Owner",
        nextLabel: "Next step",
        closeLabel: "Close",
        rows: [
          { id: "l1", label: "Line 1", sublabel: "Assembly" },
          { id: "l2", label: "Line 2", sublabel: "Painting" },
          { id: "l3", label: "Line 3", sublabel: "Inspection" },
          { id: "l4", label: "Line 4", sublabel: "Packing" },
          { id: "l5", label: "Line 5", sublabel: "Pre-shipment" },
          { id: "l6", label: "Maintenance", sublabel: "Equipment check" },
        ] satisfies GanttRow[],
        items: [
          { id: "j1", rowId: "l1", start: "2026-06-22", end: "2026-06-24", label: "A-101", tone: "info", ariaLabel: "A-101 assembly" },
          { id: "j2", rowId: "l1", start: "2026-06-24", end: "2026-06-27", label: "A-102", tone: "primary", ariaLabel: "A-102 assembly" },
          { id: "j3", rowId: "l2", start: "2026-06-22", end: "2026-06-25", label: "B-201", tone: "success", ariaLabel: "B-201 painting" },
          { id: "j4", rowId: "l2", start: "2026-06-23", end: "2026-06-26", label: "B-202", tone: "warning", ariaLabel: "B-202 painting" },
          { id: "j5", rowId: "l3", start: "2026-06-25", end: "2026-06-28", label: "Inspection", tone: "muted", ariaLabel: "Inspection slot" },
          { id: "j6", rowId: "l4", start: "2026-06-22", end: "2026-06-23", label: "Pack prep", tone: "info", ariaLabel: "Pack prep" },
          { id: "j7", rowId: "l4", start: "2026-06-25", end: "2026-06-28", label: "Shipment pack", tone: "success", ariaLabel: "Shipment pack" },
          { id: "j8", rowId: "l5", start: "2026-06-24", end: "2026-06-26", label: "Ship gate", tone: "warning", ariaLabel: "Ship gate" },
          { id: "j9", rowId: "l6", start: "2026-06-21", end: "2026-06-22", label: "Maintenance", tone: "destructive", ariaLabel: "Maintenance" },
        ] satisfies GanttItem[],
      };
}

function ganttDetails(locale: Locale): Record<string, { status: string; owner: string; next: string }> {
  return locale === "ja"
    ? {
        j1: { status: "進行中", owner: "生産管理 A", next: "塗装前検査" },
        j2: { status: "準備中", owner: "生産管理 B", next: "治具確認" },
        j3: { status: "進行中", owner: "塗装班", next: "乾燥室へ移動" },
        j4: { status: "要確認", owner: "品質保証", next: "色差チェック" },
        j5: { status: "待機中", owner: "検査班", next: "抜取検査" },
        j6: { status: "準備中", owner: "梱包班", next: "資材をラインへ補充" },
        j7: { status: "予定済み", owner: "物流担当", next: "送り状と数量を照合" },
        j8: { status: "要確認", owner: "出荷責任者", next: "判定記録を承認" },
        j9: { status: "停止中", owner: "保全担当", next: "復旧後に安全確認" },
        "rotation-1": { status: "進行中", owner: "工程管理", next: "塗装区間へ引き渡し" },
        "run-1": { status: "運行中", owner: "配車担当", next: "12:30 帰着確認" },
        "run-2": { status: "待機中", owner: "配車担当", next: "13:15 点呼" },
      }
    : {
        j1: { status: "In progress", owner: "Production A", next: "Pre-paint inspection" },
        j2: { status: "Ready", owner: "Production B", next: "Fixture check" },
        j3: { status: "In progress", owner: "Paint crew", next: "Move to drying room" },
        j4: { status: "Needs review", owner: "Quality", next: "Color variance check" },
        j5: { status: "Queued", owner: "Inspection", next: "Sampling inspection" },
        j6: { status: "Ready", owner: "Packing crew", next: "Replenish materials" },
        j7: { status: "Scheduled", owner: "Logistics", next: "Match labels and quantities" },
        j8: { status: "Needs review", owner: "Shipping lead", next: "Approve gate record" },
        j9: { status: "Stopped", owner: "Maintenance", next: "Run safety check after recovery" },
        "rotation-1": { status: "In progress", owner: "Ops control", next: "Hand off to paint segment" },
        "run-1": { status: "In service", owner: "Dispatcher", next: "Confirm return at 12:30" },
        "run-2": { status: "Queued", owner: "Dispatcher", next: "Briefing at 13:15" },
      };
}

function GanttDetailPanel({
  copy,
  item,
  row,
  detail,
  compact = false,
}: {
  copy: ReturnType<typeof ganttCopy>;
  item: GanttItem;
  row?: GanttRow;
  detail: { status: string; owner: string; next: string };
  compact?: boolean;
}) {
  const tone = GANTT_DETAIL_TONE[item.tone ?? "default"];

  return (
    <div className={["min-w-0 rounded-lg border border-l-4 text-sm shadow-sm", compact ? "p-2" : "p-3", tone.panel].join(" ")}>
      {compact ? (
        <div className="flex justify-end">
          <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">
            {detail.status}
          </Badge>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">{copy.detailTitle}</h3>
            <p className="mt-1 truncate text-base font-semibold text-foreground">{item.label}</p>
          </div>
          <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">
            {detail.status}
          </Badge>
        </div>
      )}
      <dl className={compact ? "mt-1.5 grid gap-1 text-xs" : "mt-3 grid gap-2 text-xs"}>
        <div>
          <dt className="text-muted-foreground">{copy.rowLabel}</dt>
          <dd className="font-medium text-foreground">{row?.label}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{copy.periodLabel}</dt>
          <dd className="font-medium text-foreground">
            {String(item.start)} - {String(item.end)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{copy.ownerLabel}</dt>
          <dd className="font-medium text-foreground">{detail.owner}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{copy.nextLabel}</dt>
          <dd className="font-medium text-foreground">{detail.next}</dd>
        </div>
      </dl>
    </div>
  );
}

function GanttPreview({ locale, variant = "default" }: { locale: Locale; variant?: "default" | "segmented" | "hour" }) {
  const copy = ganttCopy(locale);
  const isHour = variant === "hour";
  const rows = isHour
    ? [{ id: "bus-1", label: locale === "ja" ? "車両 12" : "Vehicle 12", sublabel: locale === "ja" ? "運行日" : "Service day" }]
    : copy.rows;
  const items: GanttItem[] = variant === "segmented"
    ? [
        {
          id: "rotation-1",
          rowId: "l1",
          start: "2026-06-22",
          end: "2026-06-27",
          label: locale === "ja" ? "A-101 ローテーション" : "A-101 rotation",
          tone: "muted",
          ariaLabel: locale === "ja" ? "A-101 ローテーション" : "A-101 rotation",
          segments: [
            { start: "2026-06-22", end: "2026-06-23", label: locale === "ja" ? "組立" : "Build", tone: "info", kind: "build" },
            { start: "2026-06-24", end: "2026-06-25", label: locale === "ja" ? "塗装" : "Paint", tone: "success", kind: "paint" },
            { start: "2026-06-26", end: "2026-06-27", label: locale === "ja" ? "検査" : "QA", tone: "warning", kind: "qa" },
          ],
        },
      ]
    : isHour
      ? [
          {
            id: "run-1",
            rowId: "bus-1",
            start: "2026-06-24T08:00",
            end: "2026-06-24T12:30",
            label: locale === "ja" ? "朝便" : "Morning run",
            tone: "primary",
          },
          {
            id: "run-2",
            rowId: "bus-1",
            start: "2026-06-24T13:30",
            end: "2026-06-24T17:30",
            label: locale === "ja" ? "午後便" : "Afternoon run",
            tone: "success",
          },
        ]
      : copy.items;
  const [selectedId, setSelectedId] = React.useState<string | null>(variant === "segmented" ? null : items[0]?.id ?? null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [previewRoot, setPreviewRoot] = React.useState<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [isCompactLayout, setIsCompactLayout] = React.useState(false);
  const selectedItem = selectedId ? items.find((item) => item.id === selectedId) : undefined;
  const selectedRow = rows.find((row) => row.id === selectedItem?.rowId);
  const selectedDetail = selectedItem ? ganttDetails(locale)[selectedItem.id] : undefined;
  const drawerSide = isCompactLayout ? "bottom" : "right";

  React.useEffect(() => {
    if (!previewRoot) return;

    const updateLayout = () => {
      const width = previewRoot.offsetWidth || previewRoot.getBoundingClientRect().width;
      setIsCompactLayout(width < 800);
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(previewRoot);
    return () => observer.disconnect();
  }, [previewRoot]);

  const setPreviewNode = React.useCallback((node: HTMLDivElement | null) => {
    setPreviewRoot(node);
    setPortalContainer(node);
  }, []);

  return (
    <div ref={setPreviewNode} className="relative flex w-full max-w-4xl flex-col gap-4 overflow-visible rounded-lg border bg-card p-4">
      <div className="grid min-w-0 gap-4">
        <Gantt
          rows={rows}
          items={items}
          startDate={isHour ? "2026-06-24T08:00" : "2026-06-21"}
          endDate={isHour ? "2026-06-24T18:00" : "2026-06-29"}
          today={isHour ? "2026-06-24T12:00" : "2026-06-24"}
          label={copy.label}
          resolution={isHour ? "hour" : "day"}
          hourStep={2}
          dayWidth={52}
          onSelectItem={(item) => {
            setSelectedId(item.id);
            setDrawerOpen(true);
          }}
        />
      </div>
      <Sheet
        open={drawerOpen && Boolean(selectedItem && selectedDetail)}
        onOpenChange={setDrawerOpen}
      >
        <SheetContent
          side={drawerSide}
          portalContainer={portalContainer}
          closeLabel={copy.closeLabel}
          overlayClassName="bg-overlay/45"
          className={
            drawerSide === "bottom"
              ? "max-h-[calc(100%-2rem)] overflow-y-auto rounded-t-lg p-4"
              : "w-[min(360px,calc(100%-2rem))] max-w-sm overflow-y-auto p-4"
          }
        >
          <SheetHeader className="pr-8 text-left">
            <SheetTitle>
              {copy.detailTitle}
              {selectedItem ? ` / ${selectedItem.label}` : ""}
            </SheetTitle>
          </SheetHeader>
          {selectedItem && selectedDetail ? (
            <div className="mt-4">
              <GanttDetailPanel
                copy={copy}
                item={selectedItem}
                row={selectedRow}
                detail={selectedDetail}
                compact={drawerSide === "bottom"}
              />
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function GanttDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/gantt", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.gantt.title ?? "Gantt";
  const description = content?.description ?? metadata.gantt.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
	import {
	  Badge,
	  Gantt,
	  Sheet,
	  SheetContent,
	  SheetHeader,
	  SheetTitle,
	  type GanttItem,
	  type GanttRow,
	} from "@gunjo/ui";

const rows: GanttRow[] = [
  { id: "l1", label: "第1ライン", sublabel: "組立" },
  { id: "l2", label: "第2ライン", sublabel: "塗装" },
];

const items: GanttItem[] = [
  { id: "j1", rowId: "l1", start: "2026-06-22", end: "2026-06-24", label: "A-101", tone: "info" },
  { id: "j3", rowId: "l2", start: "2026-06-22", end: "2026-06-25", label: "B-201", tone: "success" },
  { id: "j4", rowId: "l2", start: "2026-06-23", end: "2026-06-26", label: "B-202", tone: "warning" },
];

const itemDetails = {
  j1: { status: "進行中", owner: "生産管理 A", next: "塗装前検査" },
  j3: { status: "進行中", owner: "塗装班", next: "乾燥室へ移動" },
  j4: { status: "要確認", owner: "品質保証", next: "色差チェック" },
};

const toneStyles = {
  default: { panel: "border-border bg-background" },
  primary: { panel: "border-primary bg-primary/10" },
  info: { panel: "border-info-border bg-info-subtle/55" },
  success: { panel: "border-success-border bg-success-subtle/55" },
  warning: { panel: "border-warning-border bg-warning-subtle/65" },
} as const;

export function ProductionGantt() {
  const [selectedId, setSelectedId] = React.useState(items[0].id);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [previewRoot, setPreviewRoot] = React.useState<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [isCompactLayout, setIsCompactLayout] = React.useState(false);
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];
  const selectedRow = rows.find((row) => row.id === selectedItem.rowId);
  const selectedDetail = itemDetails[selectedItem.id as keyof typeof itemDetails];
  const selectedTone = toneStyles[selectedItem.tone ?? "default"];

  React.useEffect(() => {
    if (!previewRoot) return;
    const updateLayout = () => {
      const width = previewRoot.offsetWidth || previewRoot.getBoundingClientRect().width;
      setIsCompactLayout(width < 800);
    };
    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(previewRoot);
    return () => observer.disconnect();
  }, [previewRoot]);

  const setPreviewNode = React.useCallback((node: HTMLDivElement | null) => {
    setPreviewRoot(node);
    setPortalContainer(node);
  }, []);

  return (
    <div ref={setPreviewNode} className="relative flex w-full max-w-4xl flex-col gap-4 overflow-visible rounded-lg border bg-card p-4">
      <div className="grid min-w-0 gap-4">
        <Gantt
          rows={rows}
          items={items}
          startDate="2026-06-21"
          endDate="2026-06-29"
          today="2026-06-24"
          label="生産ライン計画"
          dayWidth={52}
          onSelectItem={(item) => {
            setSelectedId(item.id);
            setDrawerOpen(true);
          }}
        />
      </div>
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side={isCompactLayout ? "bottom" : "right"}
          portalContainer={portalContainer}
          closeLabel="閉じる"
          overlayClassName="bg-overlay/45"
          className={
            isCompactLayout
              ? "max-h-[calc(100%-2rem)] overflow-y-auto rounded-t-lg p-4"
              : "w-[min(360px,calc(100%-2rem))] max-w-sm overflow-y-auto p-4"
          }
        >
          <SheetHeader className="pr-8 text-left">
            <SheetTitle>工程詳細 / {selectedItem.label}</SheetTitle>
          </SheetHeader>
          <div className={["mt-4 rounded-lg border border-l-4 p-2 text-sm shadow-sm", selectedTone.panel].join(" ")}>
            <div className="flex justify-end">
              <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">
                {selectedDetail.status}
              </Badge>
            </div>
            <dl className="mt-1.5 grid gap-1 text-xs">
              <div><dt className="text-muted-foreground">担当ライン</dt><dd className="font-medium text-foreground">{selectedRow?.label}</dd></div>
              <div><dt className="text-muted-foreground">期間</dt><dd className="font-medium text-foreground">{String(selectedItem.start)} - {String(selectedItem.end)}</dd></div>
              <div><dt className="text-muted-foreground">責任者</dt><dd className="font-medium text-foreground">{selectedDetail.owner}</dd></div>
              <div><dt className="text-muted-foreground">次の作業</dt><dd className="font-medium text-foreground">{selectedDetail.next}</dd></div>
            </dl>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}`
    : `import * as React from "react";
	import {
	  Badge,
	  Gantt,
	  Sheet,
	  SheetContent,
	  SheetHeader,
	  SheetTitle,
	  type GanttItem,
	  type GanttRow,
	} from "@gunjo/ui";

const rows: GanttRow[] = [
  { id: "l1", label: "Line 1", sublabel: "Assembly" },
  { id: "l2", label: "Line 2", sublabel: "Painting" },
];

const items: GanttItem[] = [
  { id: "j1", rowId: "l1", start: "2026-06-22", end: "2026-06-24", label: "A-101", tone: "info" },
  { id: "j3", rowId: "l2", start: "2026-06-22", end: "2026-06-25", label: "B-201", tone: "success" },
  { id: "j4", rowId: "l2", start: "2026-06-23", end: "2026-06-26", label: "B-202", tone: "warning" },
];

const itemDetails = {
  j1: { status: "In progress", owner: "Production A", next: "Pre-paint inspection" },
  j3: { status: "In progress", owner: "Paint crew", next: "Move to drying room" },
  j4: { status: "Needs review", owner: "Quality", next: "Color variance check" },
};

const toneStyles = {
  default: { panel: "border-border bg-background" },
  primary: { panel: "border-primary bg-primary/10" },
  info: { panel: "border-info-border bg-info-subtle/55" },
  success: { panel: "border-success-border bg-success-subtle/55" },
  warning: { panel: "border-warning-border bg-warning-subtle/65" },
} as const;

export function ProductionGantt() {
  const [selectedId, setSelectedId] = React.useState(items[0].id);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [previewRoot, setPreviewRoot] = React.useState<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [isCompactLayout, setIsCompactLayout] = React.useState(false);
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];
  const selectedRow = rows.find((row) => row.id === selectedItem.rowId);
  const selectedDetail = itemDetails[selectedItem.id as keyof typeof itemDetails];
  const selectedTone = toneStyles[selectedItem.tone ?? "default"];

  React.useEffect(() => {
    if (!previewRoot) return;
    const updateLayout = () => {
      const width = previewRoot.offsetWidth || previewRoot.getBoundingClientRect().width;
      setIsCompactLayout(width < 800);
    };
    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(previewRoot);
    return () => observer.disconnect();
  }, [previewRoot]);

  const setPreviewNode = React.useCallback((node: HTMLDivElement | null) => {
    setPreviewRoot(node);
    setPortalContainer(node);
  }, []);

  return (
    <div ref={setPreviewNode} className="relative flex w-full max-w-4xl flex-col gap-4 overflow-visible rounded-lg border bg-card p-4">
      <div className="grid min-w-0 gap-4">
        <Gantt
          rows={rows}
          items={items}
          startDate="2026-06-21"
          endDate="2026-06-29"
          today="2026-06-24"
          label="Production line plan"
          dayWidth={52}
          onSelectItem={(item) => {
            setSelectedId(item.id);
            setDrawerOpen(true);
          }}
        />
      </div>
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side={isCompactLayout ? "bottom" : "right"}
          portalContainer={portalContainer}
          closeLabel="Close"
          overlayClassName="bg-overlay/45"
          className={
            isCompactLayout
              ? "max-h-[calc(100%-2rem)] overflow-y-auto rounded-t-lg p-4"
              : "w-[min(360px,calc(100%-2rem))] max-w-sm overflow-y-auto p-4"
          }
        >
          <SheetHeader className="pr-8 text-left">
            <SheetTitle>Job details / {selectedItem.label}</SheetTitle>
          </SheetHeader>
          <div className={["mt-4 rounded-lg border border-l-4 p-2 text-sm shadow-sm", selectedTone.panel].join(" ")}>
            <div className="flex justify-end">
              <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">
                {selectedDetail.status}
              </Badge>
            </div>
            <dl className="mt-1.5 grid gap-1 text-xs">
              <div><dt className="text-muted-foreground">Line</dt><dd className="font-medium text-foreground">{selectedRow?.label}</dd></div>
              <div><dt className="text-muted-foreground">Window</dt><dd className="font-medium text-foreground">{String(selectedItem.start)} - {String(selectedItem.end)}</dd></div>
              <div><dt className="text-muted-foreground">Owner</dt><dd className="font-medium text-foreground">{selectedDetail.owner}</dd></div>
              <div><dt className="text-muted-foreground">Next step</dt><dd className="font-medium text-foreground">{selectedDetail.next}</dd></div>
            </dl>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}`;

  const propsData = [
    { name: "rows", type: "GanttRow[]", description: locale === "ja" ? "左軸のリソース行です。id、label、sublabel を渡します。" : "Resource lanes on the left axis. Pass id, label, and sublabel." },
    { name: "items", type: "GanttItem[]", description: locale === "ja" ? "時間軸に配置するバーです。rowId、start、end、label、tone、segments を持てます。" : "Bars placed on the time axis. Items can include rowId, start, end, label, tone, and segments." },
    { name: "startDate / endDate", type: "string | Date", description: locale === "ja" ? "表示する時間範囲です。" : "Visible time window." },
    { name: "today", type: "string | Date", description: locale === "ja" ? "今日線として表示する日付です。SSR のため明示指定します。" : "Date or time shown as the today line. Pass explicitly for SSR." },
    { name: "resolution", type: '"day" | "hour"', default: '"day"', description: locale === "ja" ? "日単位または時間単位の軸を選びます。" : "Choose day or hour axis resolution." },
    { name: "laneHeight", type: "number", default: "28", description: locale === "ja" ? "重なりを積む1レーンの高さです。" : "Height of one stacked lane." },
    { name: "rowLabelWidth", type: "number", default: "120", description: locale === "ja" ? "固定される行ラベル列の幅です。" : "Width of the sticky row-label gutter." },
    { name: "dayWidth / hourWidth", type: "number", default: "44", description: locale === "ja" ? "横スクロール内の軸1単位の幅です。" : "Width of each day or hour tick inside horizontal scroll." },
    { name: "onSelectItem", type: "(item: GanttItem) => void", description: locale === "ja" ? "バー選択時に呼びます。" : "Called when a bar is selected." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "Gantt", href: "/docs/components/gantt" },
        { name: "Sheet", href: "/docs/components/sheet" },
        { name: "Badge", href: "/docs/components/badge" },
      ]}
      relatedComponents={[
        { name: "WeekView", href: "/docs/components/week-view" },
        { name: "EventCalendar", href: "/docs/components/event-calendar" },
        { name: "ScheduleGrid", href: "/docs/components/schedule-grid" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="xl">
        <GanttPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "overlap",
              title: locale === "ja" ? "重なりレーン" : "Overlapping lanes",
              description: locale === "ja" ? "同じ行で期間が重なるバーは自動で縦に積まれます。" : "Overlapping bars in the same row are lane-packed vertically.",
              preview: <GanttPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "xl",
            },
            {
              key: "segmented",
              title: locale === "ja" ? "区間分割" : "Segmented bar",
              description: locale === "ja" ? "segments を渡すと、1本のバー内に工程や折返し区間を表現できます。" : "Pass segments to show sub-spans inside a single bar.",
              preview: <GanttPreview locale={locale} variant="segmented" />,
              code: `import * as React from "react";
	import { Badge, Gantt, Sheet, SheetContent, SheetHeader, SheetTitle } from "@gunjo/ui";

	const [selectedId, setSelectedId] = React.useState<string | null>(null);
	const [open, setOpen] = React.useState(false);

const rows = [{ id: "l1", label: "${locale === "ja" ? "第1ライン" : "Line 1"}", sublabel: "${locale === "ja" ? "組立" : "Assembly"}" }];
const items = [
  {
    id: "rotation-1",
    rowId: "l1",
    start: "2026-06-22",
    end: "2026-06-27",
    label: "${locale === "ja" ? "A-101 ローテーション" : "A-101 rotation"}",
    segments: [
      { start: "2026-06-22", end: "2026-06-23", label: "${locale === "ja" ? "組立" : "Build"}", tone: "info" },
      { start: "2026-06-24", end: "2026-06-25", label: "${locale === "ja" ? "塗装" : "Paint"}", tone: "success" },
    ],
  },
];
const detail = {
  status: "${locale === "ja" ? "進行中" : "In progress"}",
  next: "${locale === "ja" ? "塗装区間へ引き渡し" : "Hand off to paint segment"}",
  tone: { panel: "border-border bg-muted/55" },
};
const selectedItem = selectedId ? items.find((item) => item.id === selectedId) : undefined;

	<div className="relative grid gap-4 rounded-lg border bg-card p-4">
	  <Gantt
	    rows={rows}
	    items={items}
    startDate="2026-06-21"
    endDate="2026-06-29"
    today="2026-06-24"
    label="${locale === "ja" ? "生産ライン計画" : "Production line plan"}"
    dayWidth={52}
	    onSelectItem={(item) => {
	      setSelectedId(item.id);
	      setOpen(true);
	    }}
	  />
	  <Sheet open={open && Boolean(selectedItem)} onOpenChange={setOpen}>
	    <SheetContent side="bottom" className="max-h-[calc(100%-2rem)] overflow-y-auto rounded-t-lg p-4">
	      <SheetHeader className="pr-8 text-left">
	        <SheetTitle>${locale === "ja" ? "工程詳細" : "Job details"} / {selectedItem?.label}</SheetTitle>
	      </SheetHeader>
	      <div className={["mt-4 rounded-lg border border-l-4 p-3 text-sm shadow-sm", detail.tone.panel].join(" ")}>
	        <div className="flex justify-end">
	          <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">
	            {detail.status}
	          </Badge>
	        </div>
	        <dl className="mt-3 grid gap-2 text-xs">
	          <div>
	            <dt className="text-muted-foreground">${locale === "ja" ? "次の作業" : "Next step"}</dt>
	            <dd className="font-medium text-foreground">{detail.next}</dd>
	          </div>
	        </dl>
	      </div>
	    </SheetContent>
	  </Sheet>
	</div>`,
              previewBodyWidth: "xl",
            },
            {
              key: "hour",
              title: locale === "ja" ? "時間単位" : "Hour resolution",
              description: locale === "ja" ? "resolution=\"hour\" は1日の配車や運行表に使います。" : "Use resolution=\"hour\" for intraday dispatch or operations plans.",
              preview: <GanttPreview locale={locale} variant="hour" />,
              code: `import * as React from "react";
	import { Badge, Gantt, Sheet, SheetContent, SheetHeader, SheetTitle } from "@gunjo/ui";

	const [selectedId, setSelectedId] = React.useState("run-1");
	const [open, setOpen] = React.useState(false);

const rows = [{ id: "bus-1", label: "${locale === "ja" ? "車両 12" : "Vehicle 12"}" }];
const items = [
  { id: "run-1", rowId: "bus-1", start: "2026-06-24T08:00", end: "2026-06-24T12:30", label: "${locale === "ja" ? "朝便" : "Morning run"}" },
  { id: "run-2", rowId: "bus-1", start: "2026-06-24T13:30", end: "2026-06-24T17:30", label: "${locale === "ja" ? "午後便" : "Afternoon run"}" },
];
const detail = {
  status: "${locale === "ja" ? "運行中" : "In service"}",
  next: "${locale === "ja" ? "12:30 帰着確認" : "Confirm return at 12:30"}",
  tone: { panel: "border-primary bg-primary/10" },
};

	<div className="relative grid gap-4 rounded-lg border bg-card p-4">
	  <Gantt
	    rows={rows}
	    items={items}
    startDate="2026-06-24T08:00"
    endDate="2026-06-24T18:00"
    today="2026-06-24T12:00"
    label="${locale === "ja" ? "生産ライン計画" : "Production line plan"}"
    resolution="hour"
    hourStep={2}
	    onSelectItem={(item) => {
	      setSelectedId(item.id);
	      setOpen(true);
	    }}
	  />
	  <Sheet open={open} onOpenChange={setOpen}>
	    <SheetContent side="bottom" className="max-h-[calc(100%-2rem)] overflow-y-auto rounded-t-lg p-4">
	      <SheetHeader className="pr-8 text-left">
	        <SheetTitle>
	          ${locale === "ja" ? "工程詳細" : "Job details"} / {items.find((item) => item.id === selectedId)?.label}
	        </SheetTitle>
	      </SheetHeader>
	      <div className={["mt-4 rounded-lg border border-l-4 p-3 text-sm shadow-sm", detail.tone.panel].join(" ")}>
	        <div className="flex justify-end">
	          <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">
	            {detail.status}
	          </Badge>
	        </div>
	        <dl className="mt-3 grid gap-2 text-xs">
	          <div>
	            <dt className="text-muted-foreground">${locale === "ja" ? "次の作業" : "Next step"}</dt>
	            <dd className="font-medium text-foreground">{detail.next}</dd>
	          </div>
	        </dl>
	      </div>
	    </SheetContent>
	  </Sheet>
	</div>`,
              previewBodyWidth: "xl",
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
