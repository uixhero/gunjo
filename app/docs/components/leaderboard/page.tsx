"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import { IconBus, IconMapPin, IconTrophy } from "@tabler/icons-react";
import displayMetadata from "@design/display-metadata.json";
import {
  Badge,
  Leaderboard,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  type LeaderboardItem,
} from "@gunjo/ui";

type Locale = "ja" | "en";

type LeaderboardDetail = {
  status: string;
  scope: string;
  owner: string;
  period: string;
  next: string;
};

function leaderboardCopy(locale: Locale) {
  return locale === "ja"
    ? {
        label: "系統別 事故率ランキング",
        detailTitle: "ランキング詳細",
        valueLabel: "指標値",
        deltaLabel: "前月比",
        scopeLabel: "対象範囲",
        ownerLabel: "担当",
        periodLabel: "集計期間",
        nextLabel: "次の対応",
        closeLabel: "閉じる",
        items: [
          { id: "shibuya88", label: "渋88 系統", sublabel: "渋谷↔六本木", value: 3.4, delta: 0.9, tone: "destructive", icon: <IconBus className="h-4 w-4" /> },
          { id: "shuku51", label: "宿51 系統", sublabel: "新宿↔渋谷", value: 2.8, delta: 0.3, tone: "destructive", icon: <IconBus className="h-4 w-4" /> },
          { id: "to07", label: "都07 系統", sublabel: "錦糸町↔門前仲町", value: 1.2, delta: -0.2, tone: "warning", icon: <IconMapPin className="h-4 w-4" /> },
          { id: "km01", label: "海01 系統", sublabel: "門前仲町↔東京テレポート", value: 0.7, delta: -0.4, tone: "success", icon: <IconBus className="h-4 w-4" /> },
          { id: "shina97", label: "品97 系統", sublabel: "品川↔新宿", value: 0.6, delta: -0.1, tone: "success", icon: <IconBus className="h-4 w-4" /> },
          { id: "higashi15", label: "東15 系統", sublabel: "東京駅↔深川車庫", value: 0.4, delta: 0, tone: "info", icon: <IconBus className="h-4 w-4" /> },
          { id: "to05", label: "都05 系統", sublabel: "東京駅↔晴海埠頭", value: 0, delta: 0, tone: "success", icon: <IconMapPin className="h-4 w-4" /> },
        ] satisfies LeaderboardItem[],
      }
    : {
        label: "Incident rate by route",
        detailTitle: "Ranking details",
        valueLabel: "Metric value",
        deltaLabel: "Month over month",
        scopeLabel: "Scope",
        ownerLabel: "Owner",
        periodLabel: "Period",
        nextLabel: "Next action",
        closeLabel: "Close",
        items: [
          { id: "shibuya88", label: "Shibuya 88", sublabel: "Shibuya to Roppongi", value: 3.4, delta: 0.9, tone: "destructive", icon: <IconBus className="h-4 w-4" /> },
          { id: "shuku51", label: "Shuku 51", sublabel: "Shinjuku to Shibuya", value: 2.8, delta: 0.3, tone: "destructive", icon: <IconBus className="h-4 w-4" /> },
          { id: "to07", label: "To 07", sublabel: "Kinshicho to Monzen-nakacho", value: 1.2, delta: -0.2, tone: "warning", icon: <IconMapPin className="h-4 w-4" /> },
          { id: "km01", label: "Kai 01", sublabel: "Monzen-nakacho to Tokyo Teleport", value: 0.7, delta: -0.4, tone: "success", icon: <IconBus className="h-4 w-4" /> },
          { id: "shina97", label: "Shina 97", sublabel: "Shinagawa to Shinjuku", value: 0.6, delta: -0.1, tone: "success", icon: <IconBus className="h-4 w-4" /> },
          { id: "higashi15", label: "Higashi 15", sublabel: "Tokyo Station to Fukagawa depot", value: 0.4, delta: 0, tone: "info", icon: <IconBus className="h-4 w-4" /> },
          { id: "to05", label: "To 05", sublabel: "Tokyo Station to Harumi pier", value: 0, delta: 0, tone: "success", icon: <IconMapPin className="h-4 w-4" /> },
        ] satisfies LeaderboardItem[],
      };
}

function leaderboardDetails(locale: Locale, variant: "worst" | "best" | "compact"): Record<string, LeaderboardDetail> {
  if (variant === "best") {
    return locale === "ja"
      ? {
          first: { status: "目標超過", scope: "申請処理チーム A", owner: "オペレーション企画", period: "2026年6月", next: "高処理量の運用手順を他チームへ展開します。" },
          second: { status: "順調", scope: "申請処理チーム B", owner: "東日本オペレーション", period: "2026年6月", next: "レビュー待ちの滞留を週次で確認します。" },
          third: { status: "確認中", scope: "申請処理チーム C", owner: "西日本オペレーション", period: "2026年6月", next: "減少要因を担当リードと確認します。" },
        }
      : {
          first: { status: "Above goal", scope: "Application team A", owner: "Operations planning", period: "June 2026", next: "Roll out the high-throughput workflow to other teams." },
          second: { status: "On track", scope: "Application team B", owner: "East operations", period: "June 2026", next: "Review pending work weekly." },
          third: { status: "Under review", scope: "Application team C", owner: "West operations", period: "June 2026", next: "Review the decline with the team lead." },
        };
  }

  return locale === "ja"
    ? {
        shibuya88: { status: "重点対応", scope: "渋谷から六本木の運行区間", owner: "城南営業所", period: "2026年6月", next: "朝ピーク帯のヒヤリハット記録を翌営業日までに確認します。" },
        shuku51: { status: "要確認", scope: "新宿から渋谷の運行区間", owner: "新宿営業所", period: "2026年6月", next: "交差点付近の遅延要因と運転記録を確認します。" },
        to07: { status: "改善傾向", scope: "錦糸町から門前仲町の運行区間", owner: "深川営業所", period: "2026年6月", next: "改善施策を継続し、雨天日の発生率だけを追加で確認します。" },
        km01: { status: "安定", scope: "門前仲町から東京テレポートの運行区間", owner: "臨海営業所", period: "2026年6月", next: "現行運用を継続し、次月も同じ指標で比較します。" },
        shina97: { status: "安定", scope: "品川から新宿の運行区間", owner: "品川営業所", period: "2026年6月", next: "現行の安全確認フローを継続します。" },
        higashi15: { status: "通常監視", scope: "東京駅から深川車庫の運行区間", owner: "深川営業所", period: "2026年6月", next: "通常の月次レビューで推移を確認します。" },
        to05: { status: "良好", scope: "東京駅から晴海埠頭の運行区間", owner: "晴海営業所", period: "2026年6月", next: "改善値を維持できているか来月も確認します。" },
      }
    : {
        shibuya88: { status: "Priority response", scope: "Shibuya to Roppongi operating section", owner: "Jonan depot", period: "June 2026", next: "Review near-miss logs for morning peak by the next business day." },
        shuku51: { status: "Needs review", scope: "Shinjuku to Shibuya operating section", owner: "Shinjuku depot", period: "June 2026", next: "Check intersection delays and driving records." },
        to07: { status: "Improving", scope: "Kinshicho to Monzen-nakacho operating section", owner: "Fukagawa depot", period: "June 2026", next: "Continue the countermeasure and review rainy-day incidents separately." },
        km01: { status: "Stable", scope: "Monzen-nakacho to Tokyo Teleport operating section", owner: "Rinkai depot", period: "June 2026", next: "Keep the current operation and compare the same metric next month." },
        shina97: { status: "Stable", scope: "Shinagawa to Shinjuku operating section", owner: "Shinagawa depot", period: "June 2026", next: "Continue the current safety-check workflow." },
        higashi15: { status: "Standard monitoring", scope: "Tokyo Station to Fukagawa depot operating section", owner: "Fukagawa depot", period: "June 2026", next: "Review the trend in the regular monthly review." },
        to05: { status: "Healthy", scope: "Tokyo Station to Harumi pier operating section", owner: "Harumi depot", period: "June 2026", next: "Confirm next month that the improvement is sustained." },
      };
}

function LeaderboardDetailPanel({
  copy,
  item,
  detail,
  value,
}: {
  copy: ReturnType<typeof leaderboardCopy>;
  item: LeaderboardItem;
  detail: LeaderboardDetail;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-l-4 border-primary bg-background p-3 text-sm shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-foreground">{item.label}</p>
          {item.sublabel != null ? <p className="mt-1 text-xs text-muted-foreground">{item.sublabel}</p> : null}
        </div>
        <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">
          {detail.status}
        </Badge>
      </div>
      <dl className="mt-3 grid gap-2 text-xs">
        <div>
          <dt className="text-muted-foreground">{copy.valueLabel}</dt>
          <dd className="font-medium text-foreground">{value}</dd>
        </div>
        {item.delta != null ? (
          <div>
            <dt className="text-muted-foreground">{copy.deltaLabel}</dt>
            <dd className="font-medium text-foreground">{item.delta > 0 ? "+" : ""}{item.delta.toFixed(1)}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-muted-foreground">{copy.scopeLabel}</dt>
          <dd className="font-medium text-foreground">{detail.scope}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{copy.ownerLabel}</dt>
          <dd className="font-medium text-foreground">{detail.owner}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{copy.periodLabel}</dt>
          <dd className="font-medium text-foreground">{detail.period}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{copy.nextLabel}</dt>
          <dd className="font-medium text-foreground">{detail.next}</dd>
        </div>
      </dl>
    </div>
  );
}

function LeaderboardPreview({ locale, variant = "worst" }: { locale: Locale; variant?: "worst" | "best" | "compact" }) {
  const copy = leaderboardCopy(locale);
  const [selectedId, setSelectedId] = React.useState<string | number | undefined>("shibuya88");
  const [compactDetailOpen, setCompactDetailOpen] = React.useState(false);
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);
  const [isCompactLayout, setIsCompactLayout] = React.useState(false);
  const bestItems: LeaderboardItem[] = [
    {
      id: "first",
      label: locale === "ja" ? "目標達成チーム A" : "Goal team A",
      sublabel: locale === "ja" ? "今月の処理件数" : "Monthly completions",
      value: 148,
      delta: 16,
      tone: "success",
      icon: <IconTrophy className="h-4 w-4" />,
    },
    {
      id: "second",
      label: locale === "ja" ? "目標達成チーム B" : "Goal team B",
      sublabel: locale === "ja" ? "今月の処理件数" : "Monthly completions",
      value: 132,
      delta: 8,
      tone: "primary",
    },
    {
      id: "third",
      label: locale === "ja" ? "目標達成チーム C" : "Goal team C",
      sublabel: locale === "ja" ? "今月の処理件数" : "Monthly completions",
      value: 118,
      delta: -2,
      tone: "info",
    },
  ];
  const items = variant === "best" ? bestItems : copy.items;
  const selectedItem = items.find((item) => item.id === selectedId);
  const selectedDetail = selectedItem ? leaderboardDetails(locale, variant)[String(selectedItem.id)] : undefined;
  const formattedValue = (item: LeaderboardItem) =>
    variant === "best" ? item.value.toLocaleString() : item.value === 0 ? (locale === "ja" ? "0件" : "0") : `${item.value.toFixed(1)}${locale === "ja" ? "件" : ""}`;

  React.useEffect(() => {
    if (!portalContainer) return;

    const updateLayout = () => {
      setIsCompactLayout(portalContainer.getBoundingClientRect().width < 720);
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(portalContainer);
    return () => observer.disconnect();
  }, [portalContainer]);

  React.useEffect(() => {
    if (!isCompactLayout) {
      setCompactDetailOpen(false);
    }
  }, [isCompactLayout]);

  const selectable = items.map((item) => ({
    ...item,
    onSelect: () => {
      setSelectedId(item.id);
      setCompactDetailOpen(isCompactLayout);
    },
  }));

  return (
    <div
      ref={setPortalContainer}
      className={
        isCompactLayout
          ? "relative grid w-full max-w-5xl grid-cols-[minmax(0,1fr)] gap-4 overflow-visible rounded-lg border bg-card p-4"
          : "relative grid w-full max-w-5xl grid-cols-[minmax(0,1fr)] gap-4 overflow-hidden rounded-lg border bg-card p-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]"
      }
    >
      <Leaderboard
        items={selectable}
        label={variant === "best" ? (locale === "ja" ? "処理件数ランキング" : "Completion leaderboard") : copy.label}
        selectedId={selectedId}
        showBar={variant !== "compact"}
        formatValue={(_, item) => formattedValue(item)}
        deltaTones={variant === "worst" ? { positive: "destructive", negative: "success" } : undefined}
      />
      <Sheet
        open={isCompactLayout && compactDetailOpen && Boolean(selectedItem && selectedDetail)}
        onOpenChange={setCompactDetailOpen}
      >
        <SheetContent
          side="bottom"
          portalContainer={portalContainer}
          closeLabel={copy.closeLabel}
          overlayClassName="bg-overlay/45"
          className="max-h-[calc(100%-2rem)] overflow-y-auto rounded-t-lg p-4"
        >
          <SheetHeader className="pr-8 text-left">
            <SheetTitle>{copy.detailTitle}</SheetTitle>
            {selectedItem ? (
              <SheetDescription>
                {selectedItem.label}
                {selectedItem.sublabel != null ? ` / ${selectedItem.sublabel}` : ""}
              </SheetDescription>
            ) : null}
          </SheetHeader>
          {selectedItem && selectedDetail ? (
            <div className="mt-4">
              <LeaderboardDetailPanel copy={copy} item={selectedItem} detail={selectedDetail} value={formattedValue(selectedItem)} />
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
      {!isCompactLayout && selectedItem && selectedDetail ? (
        <aside className="hidden min-w-0 rounded-lg border bg-muted/20 p-3 lg:block">
          <h3 className="mb-3 text-sm font-semibold text-foreground">{copy.detailTitle}</h3>
          <LeaderboardDetailPanel copy={copy} item={selectedItem} detail={selectedDetail} value={formattedValue(selectedItem)} />
        </aside>
      ) : null}
    </div>
  );
}

export default function LeaderboardDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/leaderboard", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.leaderboard.title ?? "Leaderboard";
  const description = content?.description ?? metadata.leaderboard.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
	import {
	  Badge,
	  Leaderboard,
	  Sheet,
	  SheetContent,
	  SheetDescription,
	  SheetHeader,
	  SheetTitle,
	  type LeaderboardItem,
	} from "@gunjo/ui";
import { IconBus, IconMapPin } from "@tabler/icons-react";

const routes: LeaderboardItem[] = [
  { id: "shibuya88", label: "渋88 系統", sublabel: "渋谷↔六本木", value: 3.4, delta: 0.9, tone: "destructive", icon: <IconBus className="h-4 w-4" /> },
  { id: "shuku51", label: "宿51 系統", sublabel: "新宿↔渋谷", value: 2.8, delta: 0.3, tone: "destructive", icon: <IconBus className="h-4 w-4" /> },
  { id: "to07", label: "都07 系統", sublabel: "錦糸町↔門前仲町", value: 1.2, delta: -0.2, tone: "warning", icon: <IconMapPin className="h-4 w-4" /> },
  { id: "km01", label: "海01 系統", sublabel: "門前仲町↔東京テレポート", value: 0.7, delta: -0.4, tone: "success", icon: <IconBus className="h-4 w-4" /> },
  { id: "shina97", label: "品97 系統", sublabel: "品川↔新宿", value: 0.6, delta: -0.1, tone: "success", icon: <IconBus className="h-4 w-4" /> },
  { id: "higashi15", label: "東15 系統", sublabel: "東京駅↔深川車庫", value: 0.4, delta: 0, tone: "info", icon: <IconBus className="h-4 w-4" /> },
  { id: "to05", label: "都05 系統", sublabel: "東京駅↔晴海埠頭", value: 0, delta: 0, tone: "success", icon: <IconMapPin className="h-4 w-4" /> },
];

const routeDetails = {
  shibuya88: { status: "重点対応", scope: "渋谷から六本木の運行区間", owner: "城南営業所", period: "2026年6月", next: "朝ピーク帯のヒヤリハット記録を翌営業日までに確認します。" },
  shuku51: { status: "要確認", scope: "新宿から渋谷の運行区間", owner: "新宿営業所", period: "2026年6月", next: "交差点付近の遅延要因と運転記録を確認します。" },
  to07: { status: "改善傾向", scope: "錦糸町から門前仲町の運行区間", owner: "深川営業所", period: "2026年6月", next: "改善施策を継続し、雨天日の発生率だけを追加で確認します。" },
  km01: { status: "安定", scope: "門前仲町から東京テレポートの運行区間", owner: "臨海営業所", period: "2026年6月", next: "現行運用を継続し、次月も同じ指標で比較します。" },
  shina97: { status: "安定", scope: "品川から新宿の運行区間", owner: "品川営業所", period: "2026年6月", next: "現行の安全確認フローを継続します。" },
  higashi15: { status: "通常監視", scope: "東京駅から深川車庫の運行区間", owner: "深川営業所", period: "2026年6月", next: "通常の月次レビューで推移を確認します。" },
  to05: { status: "良好", scope: "東京駅から晴海埠頭の運行区間", owner: "晴海営業所", period: "2026年6月", next: "改善値を維持できているか来月も確認します。" },
};

export function IncidentLeaderboard() {
  const [selectedId, setSelectedId] = React.useState<string | number | undefined>("shibuya88");
  const [compactDetailOpen, setCompactDetailOpen] = React.useState(false);
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);
  const [isCompactLayout, setIsCompactLayout] = React.useState(false);
  const selectedRoute = routes.find((route) => route.id === selectedId);
  const selectedDetail = selectedId ? routeDetails[selectedId as keyof typeof routeDetails] : undefined;

  React.useEffect(() => {
    if (!portalContainer) return;

    const updateLayout = () => {
      setIsCompactLayout(portalContainer.getBoundingClientRect().width < 720);
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(portalContainer);
    return () => observer.disconnect();
  }, [portalContainer]);

  React.useEffect(() => {
    if (!isCompactLayout) {
      setCompactDetailOpen(false);
    }
  }, [isCompactLayout]);

  const items = routes.map((route) => ({
    ...route,
    onSelect: () => {
      setSelectedId(route.id);
      setCompactDetailOpen(isCompactLayout);
    },
  }));

  return (
    <div
      ref={setPortalContainer}
      className={isCompactLayout ? "relative grid w-full max-w-5xl grid-cols-[minmax(0,1fr)] gap-4 overflow-visible rounded-lg border bg-card p-4" : "relative grid w-full max-w-5xl grid-cols-[minmax(0,1fr)] gap-4 overflow-hidden rounded-lg border bg-card p-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]"}
    >
      <Leaderboard
        items={items}
        label="系統別 事故率ランキング"
        selectedId={selectedId}
        formatValue={(value) => value === 0 ? "0件" : value.toFixed(1) + "件"}
        deltaTones={{ positive: "destructive", negative: "success" }}
      />
      <Sheet
        open={isCompactLayout && compactDetailOpen && Boolean(selectedRoute && selectedDetail)}
        onOpenChange={setCompactDetailOpen}
      >
        <SheetContent
          side="bottom"
          portalContainer={portalContainer}
          closeLabel="閉じる"
          overlayClassName="bg-overlay/45"
          className="max-h-[calc(100%-2rem)] overflow-y-auto rounded-t-lg p-4"
        >
          <SheetHeader className="pr-8 text-left">
            <SheetTitle>ランキング詳細</SheetTitle>
            {selectedRoute ? (
              <SheetDescription>{selectedRoute.label} / {selectedRoute.sublabel}</SheetDescription>
            ) : null}
          </SheetHeader>
          {selectedRoute && selectedDetail ? (
            <div className="mt-4">
              <div className="min-w-0 rounded-lg border border-l-4 border-primary bg-background p-3 text-sm shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-foreground">{selectedRoute.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{selectedRoute.sublabel}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">{selectedDetail.status}</Badge>
                </div>
                <dl className="mt-3 grid gap-2 text-xs">
                  <div><dt className="text-muted-foreground">指標値</dt><dd className="font-medium text-foreground">{selectedRoute.value === 0 ? "0件" : selectedRoute.value.toFixed(1) + "件"}</dd></div>
                  <div><dt className="text-muted-foreground">前月比</dt><dd className="font-medium text-foreground">{selectedRoute.delta && selectedRoute.delta > 0 ? "+" : ""}{selectedRoute.delta?.toFixed(1)}</dd></div>
                  <div><dt className="text-muted-foreground">対象範囲</dt><dd className="font-medium text-foreground">{selectedDetail.scope}</dd></div>
                  <div><dt className="text-muted-foreground">担当</dt><dd className="font-medium text-foreground">{selectedDetail.owner}</dd></div>
                  <div><dt className="text-muted-foreground">集計期間</dt><dd className="font-medium text-foreground">{selectedDetail.period}</dd></div>
                  <div><dt className="text-muted-foreground">次の対応</dt><dd className="font-medium text-foreground">{selectedDetail.next}</dd></div>
                </dl>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
      {!isCompactLayout && selectedRoute && selectedDetail ? (
        <aside className="hidden min-w-0 rounded-lg border bg-muted/20 p-3 lg:block">
          <h3 className="mb-3 text-sm font-semibold text-foreground">ランキング詳細</h3>
          <div className="min-w-0 rounded-lg border border-l-4 border-primary bg-background p-3 text-sm shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-foreground">{selectedRoute.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{selectedRoute.sublabel}</p>
              </div>
              <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">{selectedDetail.status}</Badge>
            </div>
            <dl className="mt-3 grid gap-2 text-xs">
              <div><dt className="text-muted-foreground">指標値</dt><dd className="font-medium text-foreground">{selectedRoute.value === 0 ? "0件" : selectedRoute.value.toFixed(1) + "件"}</dd></div>
              <div><dt className="text-muted-foreground">前月比</dt><dd className="font-medium text-foreground">{selectedRoute.delta && selectedRoute.delta > 0 ? "+" : ""}{selectedRoute.delta?.toFixed(1)}</dd></div>
              <div><dt className="text-muted-foreground">対象範囲</dt><dd className="font-medium text-foreground">{selectedDetail.scope}</dd></div>
              <div><dt className="text-muted-foreground">担当</dt><dd className="font-medium text-foreground">{selectedDetail.owner}</dd></div>
              <div><dt className="text-muted-foreground">集計期間</dt><dd className="font-medium text-foreground">{selectedDetail.period}</dd></div>
              <div><dt className="text-muted-foreground">次の対応</dt><dd className="font-medium text-foreground">{selectedDetail.next}</dd></div>
            </dl>
          </div>
        </aside>
      ) : null}
    </div>
  );
}`
    : `import * as React from "react";
	import {
	  Badge,
	  Leaderboard,
	  Sheet,
	  SheetContent,
	  SheetDescription,
	  SheetHeader,
	  SheetTitle,
	  type LeaderboardItem,
	} from "@gunjo/ui";
import { IconBus, IconMapPin } from "@tabler/icons-react";

const routes: LeaderboardItem[] = [
  { id: "shibuya88", label: "Shibuya 88", sublabel: "Shibuya to Roppongi", value: 3.4, delta: 0.9, tone: "destructive", icon: <IconBus className="h-4 w-4" /> },
  { id: "shuku51", label: "Shuku 51", sublabel: "Shinjuku to Shibuya", value: 2.8, delta: 0.3, tone: "destructive", icon: <IconBus className="h-4 w-4" /> },
  { id: "to07", label: "To 07", sublabel: "Kinshicho to Monzen-nakacho", value: 1.2, delta: -0.2, tone: "warning", icon: <IconMapPin className="h-4 w-4" /> },
  { id: "km01", label: "Kai 01", sublabel: "Monzen-nakacho to Tokyo Teleport", value: 0.7, delta: -0.4, tone: "success", icon: <IconBus className="h-4 w-4" /> },
  { id: "shina97", label: "Shina 97", sublabel: "Shinagawa to Shinjuku", value: 0.6, delta: -0.1, tone: "success", icon: <IconBus className="h-4 w-4" /> },
  { id: "higashi15", label: "Higashi 15", sublabel: "Tokyo Station to Fukagawa depot", value: 0.4, delta: 0, tone: "info", icon: <IconBus className="h-4 w-4" /> },
  { id: "to05", label: "To 05", sublabel: "Tokyo Station to Harumi pier", value: 0, delta: 0, tone: "success", icon: <IconMapPin className="h-4 w-4" /> },
];

const routeDetails = {
  shibuya88: { status: "Priority response", scope: "Shibuya to Roppongi operating section", owner: "Jonan depot", period: "June 2026", next: "Review near-miss logs for morning peak by the next business day." },
  shuku51: { status: "Needs review", scope: "Shinjuku to Shibuya operating section", owner: "Shinjuku depot", period: "June 2026", next: "Check intersection delays and driving records." },
  to07: { status: "Improving", scope: "Kinshicho to Monzen-nakacho operating section", owner: "Fukagawa depot", period: "June 2026", next: "Continue the countermeasure and review rainy-day incidents separately." },
  km01: { status: "Stable", scope: "Monzen-nakacho to Tokyo Teleport operating section", owner: "Rinkai depot", period: "June 2026", next: "Keep the current operation and compare the same metric next month." },
  shina97: { status: "Stable", scope: "Shinagawa to Shinjuku operating section", owner: "Shinagawa depot", period: "June 2026", next: "Continue the current safety-check workflow." },
  higashi15: { status: "Standard monitoring", scope: "Tokyo Station to Fukagawa depot operating section", owner: "Fukagawa depot", period: "June 2026", next: "Review the trend in the regular monthly review." },
  to05: { status: "Healthy", scope: "Tokyo Station to Harumi pier operating section", owner: "Harumi depot", period: "June 2026", next: "Confirm next month that the improvement is sustained." },
};

export function IncidentLeaderboard() {
  const [selectedId, setSelectedId] = React.useState<string | number | undefined>("shibuya88");
  const [compactDetailOpen, setCompactDetailOpen] = React.useState(false);
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);
  const [isCompactLayout, setIsCompactLayout] = React.useState(false);
  const selectedRoute = routes.find((route) => route.id === selectedId);
  const selectedDetail = selectedId ? routeDetails[selectedId as keyof typeof routeDetails] : undefined;

  React.useEffect(() => {
    if (!portalContainer) return;

    const updateLayout = () => {
      setIsCompactLayout(portalContainer.getBoundingClientRect().width < 720);
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(portalContainer);
    return () => observer.disconnect();
  }, [portalContainer]);

  React.useEffect(() => {
    if (!isCompactLayout) {
      setCompactDetailOpen(false);
    }
  }, [isCompactLayout]);

  const items = routes.map((route) => ({
    ...route,
    onSelect: () => {
      setSelectedId(route.id);
      setCompactDetailOpen(isCompactLayout);
    },
  }));

  return (
    <div
      ref={setPortalContainer}
      className={isCompactLayout ? "relative grid w-full max-w-5xl grid-cols-[minmax(0,1fr)] gap-4 overflow-visible rounded-lg border bg-card p-4" : "relative grid w-full max-w-5xl grid-cols-[minmax(0,1fr)] gap-4 overflow-hidden rounded-lg border bg-card p-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]"}
    >
      <Leaderboard
        items={items}
        label="Incident rate by route"
        selectedId={selectedId}
        formatValue={(value) => value === 0 ? "0" : value.toFixed(1)}
        deltaTones={{ positive: "destructive", negative: "success" }}
      />
      <Sheet
        open={isCompactLayout && compactDetailOpen && Boolean(selectedRoute && selectedDetail)}
        onOpenChange={setCompactDetailOpen}
      >
        <SheetContent
          side="bottom"
          portalContainer={portalContainer}
          closeLabel="Close"
          overlayClassName="bg-overlay/45"
          className="max-h-[calc(100%-2rem)] overflow-y-auto rounded-t-lg p-4"
        >
          <SheetHeader className="pr-8 text-left">
            <SheetTitle>Ranking details</SheetTitle>
            {selectedRoute ? (
              <SheetDescription>{selectedRoute.label} / {selectedRoute.sublabel}</SheetDescription>
            ) : null}
          </SheetHeader>
          {selectedRoute && selectedDetail ? (
            <div className="mt-4">
              <div className="min-w-0 rounded-lg border border-l-4 border-primary bg-background p-3 text-sm shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-foreground">{selectedRoute.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{selectedRoute.sublabel}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">{selectedDetail.status}</Badge>
                </div>
                <dl className="mt-3 grid gap-2 text-xs">
                  <div><dt className="text-muted-foreground">Metric value</dt><dd className="font-medium text-foreground">{selectedRoute.value === 0 ? "0" : selectedRoute.value.toFixed(1)}</dd></div>
                  <div><dt className="text-muted-foreground">Month over month</dt><dd className="font-medium text-foreground">{selectedRoute.delta && selectedRoute.delta > 0 ? "+" : ""}{selectedRoute.delta?.toFixed(1)}</dd></div>
                  <div><dt className="text-muted-foreground">Scope</dt><dd className="font-medium text-foreground">{selectedDetail.scope}</dd></div>
                  <div><dt className="text-muted-foreground">Owner</dt><dd className="font-medium text-foreground">{selectedDetail.owner}</dd></div>
                  <div><dt className="text-muted-foreground">Period</dt><dd className="font-medium text-foreground">{selectedDetail.period}</dd></div>
                  <div><dt className="text-muted-foreground">Next action</dt><dd className="font-medium text-foreground">{selectedDetail.next}</dd></div>
                </dl>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
      {!isCompactLayout && selectedRoute && selectedDetail ? (
        <aside className="hidden min-w-0 rounded-lg border bg-muted/20 p-3 lg:block">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Ranking details</h3>
          <div className="min-w-0 rounded-lg border border-l-4 border-primary bg-background p-3 text-sm shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-foreground">{selectedRoute.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{selectedRoute.sublabel}</p>
              </div>
              <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">{selectedDetail.status}</Badge>
            </div>
            <dl className="mt-3 grid gap-2 text-xs">
              <div><dt className="text-muted-foreground">Metric value</dt><dd className="font-medium text-foreground">{selectedRoute.value === 0 ? "0" : selectedRoute.value.toFixed(1)}</dd></div>
              <div><dt className="text-muted-foreground">Month over month</dt><dd className="font-medium text-foreground">{selectedRoute.delta && selectedRoute.delta > 0 ? "+" : ""}{selectedRoute.delta?.toFixed(1)}</dd></div>
              <div><dt className="text-muted-foreground">Scope</dt><dd className="font-medium text-foreground">{selectedDetail.scope}</dd></div>
              <div><dt className="text-muted-foreground">Owner</dt><dd className="font-medium text-foreground">{selectedDetail.owner}</dd></div>
              <div><dt className="text-muted-foreground">Period</dt><dd className="font-medium text-foreground">{selectedDetail.period}</dd></div>
              <div><dt className="text-muted-foreground">Next action</dt><dd className="font-medium text-foreground">{selectedDetail.next}</dd></div>
            </dl>
          </div>
        </aside>
      ) : null}
    </div>
  );
}`;

  const propsData = [
    { name: "items", type: "LeaderboardItem[]", description: locale === "ja" ? "事前に並び替え済みの行です。順位は配列位置で決まります。" : "Pre-ordered rows. Rank is the array position." },
    { name: "label", type: "ReactNode", description: locale === "ja" ? "ランキングのアクセシブル名です。" : "Accessible name for the ranked list." },
    { name: "showRank", type: "boolean", default: "true", description: locale === "ja" ? "番号付きランクチップを表示します。" : "Shows numbered rank chips." },
    { name: "showBar", type: "boolean", default: "true", description: locale === "ja" ? "値のバーを表示します。" : "Shows the normalized value bar." },
    { name: "max", type: "number", description: locale === "ja" ? "バー正規化の最大値です。省略時は最大 value です。" : "Maximum used to normalize bars. Defaults to the largest value." },
    { name: "formatValue / formatDelta", type: "(value) => ReactNode", description: locale === "ja" ? "値と前期比の表示を整形します。" : "Formats values and deltas." },
    { name: "deltaTones", type: '{ positive?, negative?, zero? }', description: locale === "ja" ? "上昇が悪い指標では positive を destructive にできます。" : "Use destructive positive deltas when an increase is bad." },
    { name: "highlightTop", type: "number", default: "3", description: locale === "ja" ? "上位 N 件のランクチップを強調します。" : "Highlights the first N rank chips." },
    { name: "selectedId", type: "string | number", description: locale === "ja" ? "選択中の行を強調します。" : "Highlights one selected row." },
    { name: "LeaderboardItem.onSelect", type: "() => void", description: locale === "ja" ? "行を選択可能なボタンにします。" : "Makes a row selectable." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "Leaderboard", href: "/docs/components/leaderboard" },
        { name: "Delta", href: "/docs/components/delta" },
        { name: "Badge", href: "/docs/components/badge" },
        { name: "Sheet", href: "/docs/components/sheet" },
      ]}
      relatedComponents={[
        { name: "BarChart", href: "/docs/components/bar-chart" },
        { name: "StatGroup", href: "/docs/components/stat-group" },
        { name: "ListCard", href: "/docs/components/list-card" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="xl">
        <LeaderboardPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "worst-first",
              title: locale === "ja" ? "要対応順" : "Worst first",
              description: locale === "ja" ? "事故率やコストなど、上昇が悪い指標では deltaTones を反転します。" : "For incident rate or cost, invert delta tones because increases are bad.",
              preview: <LeaderboardPreview locale={locale} variant="worst" />,
              code: usageCode,
              previewBodyWidth: "xl",
            },
            {
              key: "best-first",
              title: locale === "ja" ? "上位順" : "Best first",
              description: locale === "ja" ? "処理件数や売上など、値が大きいほど良いランキングにも使えます。" : "Use the same component for higher-is-better rankings such as completions or revenue.",
              preview: <LeaderboardPreview locale={locale} variant="best" />,
              code: locale === "ja"
                ? `<Leaderboard
  items={[
    { id: "first", label: "目標達成チーム A", value: 148, delta: 16, tone: "success" },
    { id: "second", label: "目標達成チーム B", value: 132, delta: 8, tone: "primary" },
  ]}
  label="処理件数ランキング"
/>`
                : `<Leaderboard
  items={[
    { id: "first", label: "Goal team A", value: 148, delta: 16, tone: "success" },
    { id: "second", label: "Goal team B", value: 132, delta: 8, tone: "primary" },
  ]}
  label="Completion leaderboard"
/>`,
              previewBodyWidth: "xl",
            },
            {
              key: "compact",
              title: locale === "ja" ? "バーなし" : "Without bars",
              description: locale === "ja" ? "値の比較より順位ラベルを優先する場合は showBar={false} にします。" : "Use showBar={false} when rank and labels matter more than bar comparison.",
              preview: <LeaderboardPreview locale={locale} variant="compact" />,
              code: `<Leaderboard
  items={[
    { id: "shibuya88", label: "${locale === "ja" ? "渋88 系統" : "Shibuya 88"}", value: 3.4 },
    { id: "shuku51", label: "${locale === "ja" ? "宿51 系統" : "Shuku 51"}", value: 2.8 },
  ]}
  showBar={false}
  selectedId="shibuya88"
/>`,
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
