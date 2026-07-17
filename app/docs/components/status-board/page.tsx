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
import { IconAlertTriangle, IconCar, IconCircleCheck, IconTool } from "@tabler/icons-react";
import { Badge, StatusBoard, type StatusBoardGroup, type StatusBoardItem } from "@gunjo/ui";

type Locale = "ja" | "en";

type StatusBoardDetail = {
  area: string;
  summary: string;
  owner: string;
  nextAction: string;
  updated: string;
};

function formatProblemCount(locale: Locale) {
  return (count: number) => (locale === "ja" ? `${count}件 要対応` : `${count} needs attention`);
}

function formatItemCount(locale: Locale) {
  return (count: number) => (locale === "ja" ? `${count}台` : `${count} units`);
}

function groups(locale: Locale, onSelect?: (id: string) => void): StatusBoardGroup[] {
  return locale === "ja"
    ? [
        {
          label: "渋谷エリア",
          sublabel: "配車・点検",
          items: [
            { id: "501", label: "501号車", icon: <IconCar className="h-4 w-4" />, status: "空車", statusIcon: <IconCircleCheck className="h-3 w-3" />, tone: "success", location: "渋谷駅", note: "最終更新 2分前", trailing: <Badge variant="secondary">待機</Badge>, onSelect: () => onSelect?.("501") },
            { id: "508", label: "508号車", icon: <IconCar className="h-4 w-4" />, status: "故障", statusIcon: <IconAlertTriangle className="h-3 w-3" />, tone: "destructive", location: "営業所", note: "エンジン警告灯", onSelect: () => onSelect?.("508") },
            { id: "512", label: "512号車", icon: <IconCar className="h-4 w-4" />, status: "点検中", statusIcon: <IconTool className="h-3 w-3" />, tone: "warning", location: "整備レーン", note: "ブレーキ確認中", onSelect: () => onSelect?.("512") },
          ],
        },
        {
          label: "品川エリア",
          sublabel: "運行中",
          items: [
            { id: "601", label: "601号車", icon: <IconCar className="h-4 w-4" />, status: "乗車中", tone: "primary", location: "品川駅", note: "羽田方面", onSelect: () => onSelect?.("601") },
            { id: "604", label: "604号車", icon: <IconCar className="h-4 w-4" />, status: "空車", tone: "success", location: "港南口", note: "最終更新 5分前", onSelect: () => onSelect?.("604") },
          ],
        },
      ]
    : [
        {
          label: "Shibuya area",
          sublabel: "Dispatch and inspection",
          items: [
            { id: "501", label: "Car 501", icon: <IconCar className="h-4 w-4" />, status: "Available", statusIcon: <IconCircleCheck className="h-3 w-3" />, tone: "success", location: "Shibuya Station", note: "Updated 2 min ago", trailing: <Badge variant="secondary">Standby</Badge>, onSelect: () => onSelect?.("501") },
            { id: "508", label: "Car 508", icon: <IconCar className="h-4 w-4" />, status: "Fault", statusIcon: <IconAlertTriangle className="h-3 w-3" />, tone: "destructive", location: "Depot", note: "Engine warning", onSelect: () => onSelect?.("508") },
            { id: "512", label: "Car 512", icon: <IconCar className="h-4 w-4" />, status: "Inspection", statusIcon: <IconTool className="h-3 w-3" />, tone: "warning", location: "Service lane", note: "Brake check", onSelect: () => onSelect?.("512") },
          ],
        },
        {
          label: "Shinagawa area",
          sublabel: "In service",
          items: [
            { id: "601", label: "Car 601", icon: <IconCar className="h-4 w-4" />, status: "Occupied", tone: "primary", location: "Shinagawa Station", note: "Toward Haneda", onSelect: () => onSelect?.("601") },
            { id: "604", label: "Car 604", icon: <IconCar className="h-4 w-4" />, status: "Available", tone: "success", location: "Konan exit", note: "Updated 5 min ago", onSelect: () => onSelect?.("604") },
          ],
        },
      ];
}

function flatItems(locale: Locale, onSelect?: (id: string) => void): StatusBoardItem[] {
  return groups(locale, onSelect).flatMap((group) => group.items);
}

function statusDetails(locale: Locale): Record<string, StatusBoardDetail> {
  return locale === "ja"
    ? {
        "501": { area: "渋谷エリア", summary: "渋谷駅西口で待機中。次の配車指示を受けられます。", owner: "配車担当: 青井", nextAction: "予約便 ORD-2406 を割り当て", updated: "2分前" },
        "508": { area: "渋谷エリア", summary: "エンジン警告灯が点灯。営業所で整備確認中です。", owner: "整備担当: 田中", nextAction: "代替車 604号車へ切り替え", updated: "8分前" },
        "512": { area: "渋谷エリア", summary: "整備レーンでブレーキ確認中。完了後に運行へ戻します。", owner: "整備担当: 佐藤", nextAction: "点検記録を承認", updated: "12分前" },
        "601": { area: "品川エリア", summary: "品川駅から羽田方面へ乗車中です。", owner: "乗務員: 山田", nextAction: "到着後に空車へ戻す", updated: "1分前" },
        "604": { area: "品川エリア", summary: "港南口で待機中。渋谷エリアの代替車候補です。", owner: "配車担当: 青井", nextAction: "508号車の代替可否を確認", updated: "5分前" },
      }
    : {
        "501": { area: "Shibuya area", summary: "Waiting at Shibuya Station west exit and ready for the next dispatch.", owner: "Dispatcher: Aoi", nextAction: "Assign reservation ORD-2406", updated: "2 min ago" },
        "508": { area: "Shibuya area", summary: "Engine warning is active. The depot team is checking the vehicle.", owner: "Maintenance: Tanaka", nextAction: "Switch to backup car 604", updated: "8 min ago" },
        "512": { area: "Shibuya area", summary: "Brake inspection is in progress in the service lane.", owner: "Maintenance: Sato", nextAction: "Approve inspection log", updated: "12 min ago" },
        "601": { area: "Shinagawa area", summary: "Passenger trip is in progress from Shinagawa toward Haneda.", owner: "Driver: Yamada", nextAction: "Return to available after arrival", updated: "1 min ago" },
        "604": { area: "Shinagawa area", summary: "Standing by at Konan exit and available as a Shibuya backup car.", owner: "Dispatcher: Aoi", nextAction: "Confirm backup for car 508", updated: "5 min ago" },
      };
}

function StatusBoardPreview({ locale, mode = "grouped" }: { locale: Locale; mode?: "grouped" | "flat" | "selected" }) {
  const [selected, setSelected] = React.useState<string | number>(mode === "selected" ? "508" : "501");

  React.useEffect(() => {
    setSelected(mode === "selected" ? "508" : "501");
  }, [locale, mode]);

  const onSelect = (id: string) => setSelected(id);
  const items = flatItems(locale, onSelect);
  const selectedItem = items.find((item) => item.id === selected) ?? items[0];
  const detail = statusDetails(locale)[String(selectedItem?.id ?? "501")];

  return (
    <div className="flex w-full max-w-4xl flex-col gap-3 rounded-lg border bg-card p-4">
      <StatusBoard
        groups={mode === "grouped" || mode === "selected" ? groups(locale, onSelect) : undefined}
        items={mode === "flat" ? items : undefined}
        selectedId={selected}
        minTileWidth={148}
        formatProblemCount={formatProblemCount(locale)}
        formatItemCount={formatItemCount(locale)}
      />
      <section className="grid min-w-0 gap-3 rounded-md border bg-background p-3" aria-live="polite" aria-label={locale === "ja" ? "選択中車両の詳細" : "Selected vehicle details"}>
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{selectedItem?.label}</h3>
            <Badge variant={selectedItem?.tone === "destructive" ? "destructive" : "secondary"}>{selectedItem?.status}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{detail.area} / {selectedItem?.location}</p>
          <p className="text-sm text-foreground">{detail.summary}</p>
        </div>
        <dl className="grid min-w-0 gap-2 rounded-md bg-muted/40 p-3 text-xs">
          <div>
            <dt className="text-muted-foreground">{locale === "ja" ? "担当" : "Owner"}</dt>
            <dd className="font-medium text-foreground">{detail.owner}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{locale === "ja" ? "次の対応" : "Next action"}</dt>
            <dd className="font-medium text-foreground">{detail.nextAction}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{locale === "ja" ? "更新" : "Updated"}</dt>
            <dd className="font-medium text-foreground">{detail.updated}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

export default function StatusBoardDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/status-board", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.statusBoard.title ?? "StatusBoard";
  const description = content?.description ?? metadata.statusBoard.description ?? "";

  const usageCode =
    locale === "ja"
      ? `import * as React from "react";
import { Badge, StatusBoard, type StatusBoardGroup } from "@gunjo/ui";
import { IconAlertTriangle, IconCar, IconCircleCheck, IconTool } from "@tabler/icons-react";

const groups: StatusBoardGroup[] = [
  {
    label: "渋谷エリア",
    sublabel: "配車・点検",
    items: [
      { id: "501", label: "501号車", icon: <IconCar className="h-4 w-4" />, status: "空車", statusIcon: <IconCircleCheck className="h-3 w-3" />, tone: "success", location: "渋谷駅", note: "最終更新 2分前", trailing: <Badge variant="secondary">待機</Badge> },
      { id: "508", label: "508号車", icon: <IconCar className="h-4 w-4" />, status: "故障", statusIcon: <IconAlertTriangle className="h-3 w-3" />, tone: "destructive", location: "営業所", note: "エンジン警告灯" },
      { id: "512", label: "512号車", icon: <IconCar className="h-4 w-4" />, status: "点検中", statusIcon: <IconTool className="h-3 w-3" />, tone: "warning", location: "整備レーン", note: "ブレーキ確認中" },
    ],
  },
  {
    label: "品川エリア",
    sublabel: "運行中",
    items: [
      { id: "601", label: "601号車", icon: <IconCar className="h-4 w-4" />, status: "乗車中", tone: "primary", location: "品川駅", note: "羽田方面" },
      { id: "604", label: "604号車", icon: <IconCar className="h-4 w-4" />, status: "空車", tone: "success", location: "港南口", note: "最終更新 5分前" },
    ],
  },
];

const details = {
  "501": { area: "渋谷エリア", summary: "渋谷駅西口で待機中。次の配車指示を受けられます。", owner: "配車担当: 青井", nextAction: "予約便 ORD-2406 を割り当て", updated: "2分前" },
  "508": { area: "渋谷エリア", summary: "エンジン警告灯が点灯。営業所で整備確認中です。", owner: "整備担当: 田中", nextAction: "代替車 604号車へ切り替え", updated: "8分前" },
  "512": { area: "渋谷エリア", summary: "整備レーンでブレーキ確認中。完了後に運行へ戻します。", owner: "整備担当: 佐藤", nextAction: "点検記録を承認", updated: "12分前" },
  "601": { area: "品川エリア", summary: "品川駅から羽田方面へ乗車中です。", owner: "乗務員: 山田", nextAction: "到着後に空車へ戻す", updated: "1分前" },
  "604": { area: "品川エリア", summary: "港南口で待機中。渋谷エリアの代替車候補です。", owner: "配車担当: 青井", nextAction: "508号車の代替可否を確認", updated: "5分前" },
};

export function DispatchBoard() {
  const [selectedId, setSelectedId] = React.useState("501");
  const selectableGroups = groups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item, onSelect: () => setSelectedId(String(item.id)) })),
  }));
  const selectedItem = selectableGroups.flatMap((group) => group.items).find((item) => item.id === selectedId)!;
  const detail = details[selectedId as keyof typeof details];

  return (
    <div className="flex w-full max-w-4xl flex-col gap-3 rounded-lg border bg-card p-4">
      <StatusBoard groups={selectableGroups} selectedId={selectedId} formatProblemCount={(count) => count + "件 要対応"} formatItemCount={(count) => count + "台"} />
      <section className="grid min-w-0 gap-3 rounded-md border bg-background p-3" aria-live="polite" aria-label="選択中車両の詳細">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{selectedItem.label}</h3>
            <Badge variant={selectedItem.tone === "destructive" ? "destructive" : "secondary"}>{selectedItem.status}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{detail.area} / {selectedItem.location}</p>
          <p className="text-sm text-foreground">{detail.summary}</p>
        </div>
        <dl className="grid min-w-0 gap-2 rounded-md bg-muted/40 p-3 text-xs">
          <div><dt className="text-muted-foreground">担当</dt><dd className="font-medium text-foreground">{detail.owner}</dd></div>
          <div><dt className="text-muted-foreground">次の対応</dt><dd className="font-medium text-foreground">{detail.nextAction}</dd></div>
          <div><dt className="text-muted-foreground">更新</dt><dd className="font-medium text-foreground">{detail.updated}</dd></div>
        </dl>
      </section>
    </div>
  );
}`
      : `import * as React from "react";
import { Badge, StatusBoard, type StatusBoardGroup } from "@gunjo/ui";
import { IconAlertTriangle, IconCar, IconCircleCheck, IconTool } from "@tabler/icons-react";

const groups: StatusBoardGroup[] = [
  {
    label: "Shibuya area",
    sublabel: "Dispatch and inspection",
    items: [
      { id: "501", label: "Car 501", icon: <IconCar className="h-4 w-4" />, status: "Available", statusIcon: <IconCircleCheck className="h-3 w-3" />, tone: "success", location: "Shibuya Station", note: "Updated 2 min ago", trailing: <Badge variant="secondary">Standby</Badge> },
      { id: "508", label: "Car 508", icon: <IconCar className="h-4 w-4" />, status: "Fault", statusIcon: <IconAlertTriangle className="h-3 w-3" />, tone: "destructive", location: "Depot", note: "Engine warning" },
      { id: "512", label: "Car 512", icon: <IconCar className="h-4 w-4" />, status: "Inspection", statusIcon: <IconTool className="h-3 w-3" />, tone: "warning", location: "Service lane", note: "Brake check" },
    ],
  },
  {
    label: "Shinagawa area",
    sublabel: "In service",
    items: [
      { id: "601", label: "Car 601", icon: <IconCar className="h-4 w-4" />, status: "Occupied", tone: "primary", location: "Shinagawa Station", note: "Toward Haneda" },
      { id: "604", label: "Car 604", icon: <IconCar className="h-4 w-4" />, status: "Available", tone: "success", location: "Konan exit", note: "Updated 5 min ago" },
    ],
  },
];

const details = {
  "501": { area: "Shibuya area", summary: "Waiting at Shibuya Station west exit and ready for the next dispatch.", owner: "Dispatcher: Aoi", nextAction: "Assign reservation ORD-2406", updated: "2 min ago" },
  "508": { area: "Shibuya area", summary: "Engine warning is active. The depot team is checking the vehicle.", owner: "Maintenance: Tanaka", nextAction: "Switch to backup car 604", updated: "8 min ago" },
  "512": { area: "Shibuya area", summary: "Brake inspection is in progress in the service lane.", owner: "Maintenance: Sato", nextAction: "Approve inspection log", updated: "12 min ago" },
  "601": { area: "Shinagawa area", summary: "Passenger trip is in progress from Shinagawa toward Haneda.", owner: "Driver: Yamada", nextAction: "Return to available after arrival", updated: "1 min ago" },
  "604": { area: "Shinagawa area", summary: "Standing by at Konan exit and available as a Shibuya backup car.", owner: "Dispatcher: Aoi", nextAction: "Confirm backup for car 508", updated: "5 min ago" },
};

export function DispatchBoard() {
  const [selectedId, setSelectedId] = React.useState("501");
  const selectableGroups = groups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item, onSelect: () => setSelectedId(String(item.id)) })),
  }));
  const selectedItem = selectableGroups.flatMap((group) => group.items).find((item) => item.id === selectedId)!;
  const detail = details[selectedId as keyof typeof details];

  return (
    <div className="flex w-full max-w-4xl flex-col gap-3 rounded-lg border bg-card p-4">
      <StatusBoard groups={selectableGroups} selectedId={selectedId} formatProblemCount={(count) => count + " needs attention"} formatItemCount={(count) => count + " units"} />
      <section className="grid min-w-0 gap-3 rounded-md border bg-background p-3" aria-live="polite" aria-label="Selected vehicle details">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{selectedItem.label}</h3>
            <Badge variant={selectedItem.tone === "destructive" ? "destructive" : "secondary"}>{selectedItem.status}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{detail.area} / {selectedItem.location}</p>
          <p className="text-sm text-foreground">{detail.summary}</p>
        </div>
        <dl className="grid min-w-0 gap-2 rounded-md bg-muted/40 p-3 text-xs">
          <div><dt className="text-muted-foreground">Owner</dt><dd className="font-medium text-foreground">{detail.owner}</dd></div>
          <div><dt className="text-muted-foreground">Next action</dt><dd className="font-medium text-foreground">{detail.nextAction}</dd></div>
          <div><dt className="text-muted-foreground">Updated</dt><dd className="font-medium text-foreground">{detail.updated}</dd></div>
        </dl>
      </section>
    </div>
  );
}`;

  const propsData = [
    { name: "groups", type: "StatusBoardGroup[]", description: locale === "ja" ? "見出し付きのグループです。各グループに要対応件数を表示します。" : "Grouped tiles with a heading and per-group problem count." },
    { name: "items", type: "StatusBoardItem[]", description: locale === "ja" ? "グループなしで並べるフラットなタイルです。" : "Flat tile list when grouping is not needed." },
    { name: "selectedId", type: "string | number", description: locale === "ja" ? "詳細対象として強調するタイルIDです。" : "Tile id highlighted as the current detail target." },
    { name: "minTileWidth", type: "number", default: "150", description: locale === "ja" ? "auto-fill grid の最小タイル幅です。" : "Minimum tile width for the auto-fill grid." },
    { name: "problemTones", type: "StatusBoardTone[]", default: '["destructive","warning"]', description: locale === "ja" ? "要対応件数とソートで問題扱いするtoneです。" : "Tones counted as problems for counts and sorting." },
    { name: "sort", type: "boolean", default: "true", description: locale === "ja" ? "rank とtone重大度で問題優先に並べます。" : "Sorts fault-first by rank and tone severity." },
    { name: "formatProblemCount / formatItemCount", type: "(count: number) => ReactNode", description: locale === "ja" ? "グループ見出し右側の件数表示をローカライズします。" : "Localizes the count copy in group headers." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "StatusBoard", href: "/docs/components/status-board" }, { name: "Badge", href: "/docs/components/badge" }]}
      relatedComponents={[{ name: "ActionQueue", href: "/docs/components/action-queue" }, { name: "DataTable", href: "/docs/components/data-table" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="xl">
        <StatusBoardPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            { key: "grouped", title: locale === "ja" ? "エリア別" : "Grouped by area", description: locale === "ja" ? "問題件数をグループ見出しに集約します。" : "Problem counts are summarized in each group header.", preview: <StatusBoardPreview locale={locale} />, code: usageCode, previewBodyWidth: "xl" },
            { key: "flat", title: locale === "ja" ? "フラット表示" : "Flat board", description: locale === "ja" ? "分類が不要な監視盤では items を直接渡します。" : "Pass items directly when grouping is unnecessary.", preview: <StatusBoardPreview locale={locale} mode="flat" />, code: usageCode, previewBodyWidth: "xl" },
            { key: "selected", title: locale === "ja" ? "選択中" : "Selected tile", description: locale === "ja" ? "selectedId で詳細対象をリング表示します。" : "Use selectedId to ring the current detail target.", preview: <StatusBoardPreview locale={locale} mode="selected" />, code: usageCode, previewBodyWidth: "xl" },
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
