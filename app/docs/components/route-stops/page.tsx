"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Button, RouteStops, type RouteStopItem, type RouteStopStatus } from "@gunjo/ui";

type Locale = "ja" | "en";

function routeLabels(locale: Locale) {
  return locale === "ja"
    ? {
        status: {
          pending: "未着手",
          current: "進行中",
          completed: "完了",
          failed: "失敗",
          delayed: "遅延",
        } satisfies Partial<Record<RouteStopStatus, string>>,
        current: "現在地",
        times: { planned: "予定", actual: "実績" },
        delays: { late: "遅れ", early: "早着", onTime: "定刻" },
        delay: (minutes: number) => `${Math.abs(minutes)}分`,
      }
    : {
        status: {
          pending: "Pending",
          current: "In progress",
          completed: "Done",
          failed: "Failed",
          delayed: "Delayed",
        } satisfies Partial<Record<RouteStopStatus, string>>,
        current: "Current stop",
        times: { planned: "Plan", actual: "Actual" },
        delays: { late: "late", early: "early", onTime: "on time" },
        delay: (minutes: number) => `${Math.abs(minutes)} min`,
      };
}

// Delivery vocab — overrides the neutral component defaults for the delivery demo. (#282)
function deliveryStatusLabels(locale: Locale): Partial<Record<RouteStopStatus, string>> {
  return locale === "ja"
    ? { pending: "未配", current: "配送中", completed: "完了", failed: "不在", delayed: "遅延" }
    : { pending: "Undelivered", current: "In transit", completed: "Delivered", failed: "Missed", delayed: "Delayed" };
}

function deliveryStops(locale: Locale): RouteStopItem[] {
  return locale === "ja"
    ? [
        { id: "1", title: "佐藤 一郎", description: "東京都渋谷区神南 1-2-3", status: "completed", plannedTime: "09:30", actualTime: "09:28", meta: "2個" },
        { id: "2", title: "鈴木 商店", description: "東京都渋谷区宇田川町 4-5", status: "completed", plannedTime: "09:50", actualTime: "09:58", meta: "5個" },
        { id: "3", title: "高橋 花子", description: "東京都渋谷区道玄坂 2-6-7", status: "current", plannedTime: "10:15", actualTime: "10:21", meta: "1個" },
        { id: "4", title: "田中 工業", description: "東京都渋谷区桜丘町 8-9", status: "failed", plannedTime: "10:40", meta: "3個" },
        { id: "5", title: "山田 太郎", description: "東京都目黒区上目黒 1-1", status: "delayed", plannedTime: "11:00", delayMinutes: 18, meta: "1個" },
        { id: "6", title: "伊藤 ストア", description: "東京都目黒区中目黒 3-2", status: "pending", plannedTime: "11:25", meta: "4個" },
      ]
    : [
        { id: "1", title: "Ichiro Sato", description: "1-2-3 Jinnan, Shibuya", status: "completed", plannedTime: "09:30", actualTime: "09:28", meta: "2 boxes" },
        { id: "2", title: "Suzuki Store", description: "4-5 Udagawacho, Shibuya", status: "completed", plannedTime: "09:50", actualTime: "09:58", meta: "5 boxes" },
        { id: "3", title: "Hanako Takahashi", description: "2-6-7 Dogenzaka, Shibuya", status: "current", plannedTime: "10:15", actualTime: "10:21", meta: "1 box" },
        { id: "4", title: "Tanaka Industries", description: "8-9 Sakuragaoka, Shibuya", status: "failed", plannedTime: "10:40", meta: "3 boxes" },
        { id: "5", title: "Taro Yamada", description: "1-1 Kamimeguro, Meguro", status: "delayed", plannedTime: "11:00", delayMinutes: 18, meta: "1 box" },
        { id: "6", title: "Ito Store", description: "3-2 Nakameguro, Meguro", status: "pending", plannedTime: "11:25", meta: "4 boxes" },
      ];
}

function shipmentStops(locale: Locale): RouteStopItem[] {
  return locale === "ja"
    ? [
        { id: "s1", title: "輸出通関", description: "上海港 (CNSHA)", status: "completed", dateLabel: "2026/05/12 許可" },
        { id: "s2", title: "船積", description: "本船 EVER BLUE / V.0PA21", status: "completed", dateLabel: "2026/05/15" },
        { id: "s3", title: "海上輸送", description: "上海 → 東京", status: "current", dateLabel: "2026/05/16 - 05/29（航行中）" },
        { id: "s4", title: "着港", description: "東京港 (JPTYO)", status: "pending", dateLabel: "ETA 2026/05/30" },
        { id: "s5", title: "国内配送・納品", description: "江東区 物流センター", status: "pending", dateLabel: "予定 2026/06/05" },
      ]
    : [
        { id: "s1", title: "Export clearance", description: "Shanghai port (CNSHA)", status: "completed", dateLabel: "Approved 2026-05-12" },
        { id: "s2", title: "Loaded on vessel", description: "EVER BLUE / V.0PA21", status: "completed", dateLabel: "2026-05-15" },
        { id: "s3", title: "Ocean transit", description: "Shanghai to Tokyo", status: "current", dateLabel: "2026-05-16 to 2026-05-29 / sailing" },
        { id: "s4", title: "Arrival port", description: "Tokyo port (JPTYO)", status: "pending", dateLabel: "ETA 2026-05-30" },
        { id: "s5", title: "Domestic delivery", description: "Koto distribution center", status: "pending", dateLabel: "Planned 2026-06-05" },
      ];
}

function RouteStopsPreview({ locale, mode = "delivery" }: { locale: Locale; mode?: "delivery" | "shipment" | "hideTimes" }) {
  const labels = routeLabels(locale);
  const [currentOutcome, setCurrentOutcome] = React.useState<"active" | "completed" | "failed">("active");

  React.useEffect(() => {
    setCurrentOutcome("active");
  }, [locale]);

  if (mode === "shipment") {
    return (
      <div className="w-full max-w-md rounded-lg border bg-card p-4">
        <RouteStops
          stops={shipmentStops(locale)}
          statusLabels={labels.status}
          currentLabel={labels.current}
          timeLabels={labels.times}
          delayLabels={labels.delays}
          formatDelay={labels.delay}
        />
      </div>
    );
  }

  const stops = deliveryStops(locale).map((stop) => {
    if (stop.id === "3") {
      return {
        ...stop,
        status: currentOutcome === "completed" ? "completed" as const : currentOutcome === "failed" ? "failed" as const : "current" as const,
        actions: currentOutcome === "active" ? (
          <>
            <Button type="button" size="sm" variant="outline" onClick={() => {
              setCurrentOutcome("completed");
            }}>
              {locale === "ja" ? "完了" : "Mark done"}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setCurrentOutcome("failed")}>
              {locale === "ja" ? "不在" : "Failed"}
            </Button>
          </>
        ) : undefined,
      };
    }
    if (currentOutcome !== "active" && stop.id === "4") return { ...stop, status: "current" as const };
    return stop;
  });

  return (
    <div className="flex w-full max-w-md flex-col rounded-lg border bg-card p-4">
      <RouteStops
        stops={stops}
        statusLabels={deliveryStatusLabels(locale)}
        currentLabel={labels.current}
        timeLabels={labels.times}
        delayLabels={labels.delays}
        formatDelay={labels.delay}
        hideTimes={mode === "hideTimes"}
      />
    </div>
  );
}

export default function RouteStopsDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/route-stops", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.routeStops.title ?? "RouteStops";
  const description = content?.description ?? metadata.routeStops.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { Button, RouteStops, type RouteStopItem } from "@gunjo/ui";

const baseStops: RouteStopItem[] = [
  { id: "1", title: "佐藤 一郎", description: "東京都渋谷区神南 1-2-3", status: "completed", plannedTime: "09:30", actualTime: "09:28", meta: "2個" },
  { id: "2", title: "鈴木 商店", description: "東京都渋谷区宇田川町 4-5", status: "completed", plannedTime: "09:50", actualTime: "09:58", meta: "5個" },
  { id: "3", title: "高橋 花子", description: "東京都渋谷区道玄坂 2-6-7", status: "current", plannedTime: "10:15", actualTime: "10:21", meta: "1個" },
  { id: "4", title: "田中 工業", description: "東京都渋谷区桜丘町 8-9", status: "failed", plannedTime: "10:40", meta: "3個" },
  { id: "5", title: "山田 太郎", description: "東京都目黒区上目黒 1-1", status: "delayed", plannedTime: "11:00", delayMinutes: 18, meta: "1個" },
  { id: "6", title: "伊藤 ストア", description: "東京都目黒区中目黒 3-2", status: "pending", plannedTime: "11:25", meta: "4個" },
];

export function DeliveryRoute() {
  const [currentOutcome, setCurrentOutcome] = React.useState<"active" | "completed" | "failed">("active");
  const stops = baseStops.map((stop) => {
    if (stop.id === "3") {
      return {
          ...stop,
          status: currentOutcome === "completed" ? "completed" as const : currentOutcome === "failed" ? "failed" as const : "current" as const,
          actions: currentOutcome === "active" ? (
            <>
              <Button type="button" size="sm" variant="outline" onClick={() => setCurrentOutcome("completed")}>
                完了
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setCurrentOutcome("failed")}>
                不在
              </Button>
            </>
          ) : undefined,
        };
    }
    if (currentOutcome !== "active" && stop.id === "4") return { ...stop, status: "current" as const };
    return stop;
  });

  return (
    <div className="flex w-full max-w-md flex-col rounded-lg border bg-card p-4">
      <RouteStops stops={stops} currentLabel="現在地" timeLabels={{ planned: "予定", actual: "実績" }} />
    </div>
  );
}`
    : `import * as React from "react";
import { Button, RouteStops, type RouteStopItem } from "@gunjo/ui";

const baseStops: RouteStopItem[] = [
  { id: "1", title: "Ichiro Sato", description: "1-2-3 Jinnan, Shibuya", status: "completed", plannedTime: "09:30", actualTime: "09:28", meta: "2 boxes" },
  { id: "2", title: "Suzuki Store", description: "4-5 Udagawacho, Shibuya", status: "completed", plannedTime: "09:50", actualTime: "09:58", meta: "5 boxes" },
  { id: "3", title: "Hanako Takahashi", description: "2-6-7 Dogenzaka, Shibuya", status: "current", plannedTime: "10:15", actualTime: "10:21", meta: "1 box" },
  { id: "4", title: "Tanaka Industries", description: "8-9 Sakuragaoka, Shibuya", status: "failed", plannedTime: "10:40", meta: "3 boxes" },
  { id: "5", title: "Taro Yamada", description: "1-1 Kamimeguro, Meguro", status: "delayed", plannedTime: "11:00", delayMinutes: 18, meta: "1 box" },
  { id: "6", title: "Ito Store", description: "3-2 Nakameguro, Meguro", status: "pending", plannedTime: "11:25", meta: "4 boxes" },
];

export function DeliveryRoute() {
  const [currentOutcome, setCurrentOutcome] = React.useState<"active" | "completed" | "failed">("active");
  const stops = baseStops.map((stop) => {
    if (stop.id === "3") {
      return {
          ...stop,
          status: currentOutcome === "completed" ? "completed" as const : currentOutcome === "failed" ? "failed" as const : "current" as const,
          actions: currentOutcome === "active" ? (
            <>
              <Button type="button" size="sm" variant="outline" onClick={() => setCurrentOutcome("completed")}>
                Mark done
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setCurrentOutcome("failed")}>
                Failed
              </Button>
            </>
          ) : undefined,
        };
    }
    if (currentOutcome !== "active" && stop.id === "4") return { ...stop, status: "current" as const };
    return stop;
  });

  return (
    <div className="flex w-full max-w-md flex-col rounded-lg border bg-card p-4">
      <RouteStops
        stops={stops}
        statusLabels={{ pending: "Pending", current: "In progress", completed: "Done", failed: "Failed", delayed: "Delayed" }}
        currentLabel="Current stop"
        timeLabels={{ planned: "Plan", actual: "Actual" }}
        delayLabels={{ late: "late", early: "early", onTime: "on time" }}
        formatDelay={(minutes) => String(Math.abs(minutes)) + " min"}
      />
    </div>
  );
}`;

  const shipmentStateCode = locale === "ja"
    ? `import { RouteStops, type RouteStopItem } from "@gunjo/ui";

const stops: RouteStopItem[] = [
  { id: "s1", title: "輸出通関", description: "上海港 (CNSHA)", status: "completed", dateLabel: "2026/05/12 許可" },
  { id: "s2", title: "船積", description: "本船 EVER BLUE / V.0PA21", status: "completed", dateLabel: "2026/05/15" },
  { id: "s3", title: "海上輸送", description: "上海 → 東京", status: "current", dateLabel: "2026/05/16 - 05/29（航行中）" },
  { id: "s4", title: "着港", description: "東京港 (JPTYO)", status: "pending", dateLabel: "ETA 2026/05/30" },
  { id: "s5", title: "国内配送・納品", description: "江東区 物流センター", status: "pending", dateLabel: "予定 2026/06/05" },
];

export function ShipmentRouteStops() {
  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-4">
      <RouteStops stops={stops} currentLabel="現在地" />
    </div>
  );
}`
    : `import { RouteStops, type RouteStopItem, type RouteStopStatus } from "@gunjo/ui";

const stops: RouteStopItem[] = [
  { id: "s1", title: "Export clearance", description: "Shanghai port (CNSHA)", status: "completed", dateLabel: "Approved 2026-05-12" },
  { id: "s2", title: "Loaded on vessel", description: "EVER BLUE / V.0PA21", status: "completed", dateLabel: "2026-05-15" },
  { id: "s3", title: "Ocean transit", description: "Shanghai to Tokyo", status: "current", dateLabel: "2026-05-16 to 2026-05-29 / sailing" },
  { id: "s4", title: "Arrival port", description: "Tokyo port (JPTYO)", status: "pending", dateLabel: "ETA 2026-05-30" },
  { id: "s5", title: "Domestic delivery", description: "Koto distribution center", status: "pending", dateLabel: "Planned 2026-06-05" },
];

const statusLabels: Partial<Record<RouteStopStatus, string>> = {
  pending: "Pending",
  current: "In progress",
  completed: "Done",
  failed: "Failed",
  delayed: "Delayed",
};

export function ShipmentRouteStops() {
  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-4">
      <RouteStops stops={stops} statusLabels={statusLabels} currentLabel="Current stop" />
    </div>
  );
}`;

  const hideTimesStateCode = locale === "ja"
    ? `import * as React from "react";
import { Button, RouteStops, type RouteStopItem } from "@gunjo/ui";

const baseStops: RouteStopItem[] = [
  { id: "1", title: "佐藤 一郎", description: "東京都渋谷区神南 1-2-3", status: "completed", plannedTime: "09:30", actualTime: "09:28", meta: "2個" },
  { id: "2", title: "鈴木 商店", description: "東京都渋谷区宇田川町 4-5", status: "completed", plannedTime: "09:50", actualTime: "09:58", meta: "5個" },
  { id: "3", title: "高橋 花子", description: "東京都渋谷区道玄坂 2-6-7", status: "current", plannedTime: "10:15", actualTime: "10:21", meta: "1個" },
  { id: "4", title: "田中 工業", description: "東京都渋谷区桜丘町 8-9", status: "failed", plannedTime: "10:40", meta: "3個" },
  { id: "5", title: "山田 太郎", description: "東京都目黒区上目黒 1-1", status: "delayed", plannedTime: "11:00", delayMinutes: 18, meta: "1個" },
  { id: "6", title: "伊藤 ストア", description: "東京都目黒区中目黒 3-2", status: "pending", plannedTime: "11:25", meta: "4個" },
];

export function RouteStopsWithoutTimes() {
  return (
    <div className="flex w-full max-w-md flex-col rounded-lg border bg-card p-4">
      <RouteStops stops={baseStops} currentLabel="現在地" hideTimes />
    </div>
  );
}`
    : `import { RouteStops, type RouteStopItem, type RouteStopStatus } from "@gunjo/ui";

const stops: RouteStopItem[] = [
  { id: "1", title: "Ichiro Sato", description: "1-2-3 Jinnan, Shibuya", status: "completed", plannedTime: "09:30", actualTime: "09:28", meta: "2 boxes" },
  { id: "2", title: "Suzuki Store", description: "4-5 Udagawacho, Shibuya", status: "completed", plannedTime: "09:50", actualTime: "09:58", meta: "5 boxes" },
  { id: "3", title: "Hanako Takahashi", description: "2-6-7 Dogenzaka, Shibuya", status: "current", plannedTime: "10:15", actualTime: "10:21", meta: "1 box" },
  { id: "4", title: "Tanaka Industries", description: "8-9 Sakuragaoka, Shibuya", status: "failed", plannedTime: "10:40", meta: "3 boxes" },
  { id: "5", title: "Taro Yamada", description: "1-1 Kamimeguro, Meguro", status: "delayed", plannedTime: "11:00", delayMinutes: 18, meta: "1 box" },
  { id: "6", title: "Ito Store", description: "3-2 Nakameguro, Meguro", status: "pending", plannedTime: "11:25", meta: "4 boxes" },
];

const statusLabels: Partial<Record<RouteStopStatus, string>> = {
  pending: "Pending",
  current: "In progress",
  completed: "Done",
  failed: "Failed",
  delayed: "Delayed",
};

export function RouteStopsWithoutTimes() {
  return (
    <div className="flex w-full max-w-md flex-col rounded-lg border bg-card p-4">
      <RouteStops stops={stops} statusLabels={statusLabels} currentLabel="Current stop" hideTimes />
    </div>
  );
}`;

  const propsData = [
    { name: "stops", type: "RouteStopItem[]", description: locale === "ja" ? "停止地点の順序付き配列です。id/title/status/time/meta/actions を含みます。" : "Ordered stops with id, title, status, time, metadata, and optional actions." },
    { name: "RouteStopItem.status", type: '"pending" | "current" | "completed" | "failed" | "delayed"', description: locale === "ja" ? "マーカー、バッジ、current の aria-current を決めます。" : "Drives marker, badge, and aria-current for the current stop." },
    { name: "plannedTime / actualTime", type: '"HH:MM"', description: locale === "ja" ? "当日配送向けの予定/実績時刻です。両方ある場合は遅延を計算します。" : "Same-day planned and actual times. Delay is computed when both are present." },
    { name: "delayMinutes", type: "number", description: locale === "ja" ? "明示的な遅延分です。正は遅れ、負は早着です。" : "Explicit signed delay minutes. Positive is late, negative is early." },
    { name: "dateLabel", type: "ReactNode", description: locale === "ja" ? "複数日・複数週の輸送追跡で使う自由形式の日付行です。" : "Free-form date row for multi-day or multi-week shipment timelines." },
    { name: "actions", type: "ReactNode", description: locale === "ja" ? "停止地点ごとの状態更新などの操作です。" : "Per-stop actions such as status updates." },
    { name: "statusLabels / currentLabel", type: "localized labels", description: locale === "ja" ? "状態バッジと現在地ラベルを上書きします。既定は中立語彙（未着手 / 進行中 / 完了 / 失敗 / 遅延）で、ドメインごとに上書きします（配送＝未配 / 配送中 / 不在 など）。(#282)" : "Overrides the status badges and current-stop label. Defaults are neutral (未着手 / 進行中 / 完了 / 失敗 / 遅延); override per domain (delivery: 未配 / 配送中 / 不在, etc.). (#282)" },
    { name: "timeLabels / delayLabels / formatDelay", type: "localized labels", description: locale === "ja" ? "予定/実績/遅延の表示をローカライズします。" : "Localizes planned, actual, and delay readouts." },
    { name: "hideTimes", type: "boolean", default: "false", description: locale === "ja" ? "時刻や遅延行を隠します。" : "Hides the time and delay row." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "RouteStops", href: "/docs/components/route-stops" }, { name: "Badge", href: "/docs/components/badge" }, { name: "Button", href: "/docs/components/button" }]}
      relatedComponents={[{ name: "Itinerary", href: "/docs/components/itinerary" }, { name: "OriginDestination", href: "/docs/components/origin-destination" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <RouteStopsPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "delivery",
              title: locale === "ja" ? "当日配送" : "Same-day delivery",
              description: locale === "ja" ? "予定/実績時刻と遅延を同じ停止地点に表示します。" : "Shows planned and actual times plus delay for each stop.",
              preview: <RouteStopsPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "md",
            },
            {
              key: "shipment",
              title: locale === "ja" ? "複数日の輸送追跡" : "Multi-day shipment",
              description: locale === "ja" ? "dateLabel を使うと HH:MM ではなく日付またぎの追跡にできます。" : "dateLabel switches the row from HH:MM timing to multi-day tracking.",
              preview: <RouteStopsPreview locale={locale} mode="shipment" />,
              code: shipmentStateCode,
              previewBodyWidth: "md",
            },
            {
              key: "hide-times",
              title: locale === "ja" ? "時刻なし" : "Without times",
              description: locale === "ja" ? "状態の順序だけを見せたい一覧では hideTimes を使います。" : "Use hideTimes when the timeline only needs status order.",
              preview: <RouteStopsPreview locale={locale} mode="hideTimes" />,
              code: hideTimesStateCode,
              previewBodyWidth: "md",
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
