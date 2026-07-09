"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import { IconBuildingPavilion, IconMapPin, IconPlane, IconShip, IconTrain } from "@tabler/icons-react";
import displayMetadata from "@design/display-metadata.json";
import {
  Badge,
  Itinerary,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  type ItineraryDay,
  type ItineraryItem,
} from "@gunjo/ui";

type Locale = "ja" | "en";
type ItineraryDetailTone = NonNullable<ItineraryItem["tone"]>;

const ITINERARY_DETAIL_TONE: Record<ItineraryDetailTone, string> = {
  default: "border-border bg-background",
  primary: "border-primary bg-primary/10",
  info: "border-info-border bg-info-subtle/55",
  success: "border-success-border bg-success-subtle/55",
  warning: "border-warning-border bg-warning-subtle/65",
  muted: "border-border bg-muted/55",
};

type ItineraryDetailCopy = ReturnType<typeof itineraryCopy>;
type ItineraryDetail = { status: string; location: string; reservation: string; next: string };

function ItineraryDetailContent({
  copy,
  item,
  detail,
}: {
  copy: ItineraryDetailCopy;
  item: ItineraryItem;
  detail: ItineraryDetail;
}) {
  const toneClass = ITINERARY_DETAIL_TONE[item.tone ?? "default"];

  return (
    <div className={["rounded-lg border border-l-4 p-3 text-sm shadow-sm", toneClass].join(" ")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mt-1 truncate text-base font-semibold text-foreground">{item.title}</p>
        </div>
        <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">
          {detail.status}
        </Badge>
      </div>
      <dl className="mt-3 grid gap-2 text-xs">
        <div>
          <dt className="text-muted-foreground">{copy.timeLabel}</dt>
          <dd className="font-medium text-foreground">{item.time}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{copy.locationLabel}</dt>
          <dd className="font-medium text-foreground">{detail.location}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{copy.reservationLabel}</dt>
          <dd className="font-medium text-foreground">{detail.reservation}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{copy.nextLabel}</dt>
          <dd className="font-medium text-foreground">{detail.next}</dd>
        </div>
      </dl>
    </div>
  );
}

function itineraryCopy(locale: Locale) {
  return locale === "ja"
    ? {
        detailTitle: "旅程詳細",
        timeLabel: "予定時刻",
        locationLabel: "場所",
        reservationLabel: "予約情報",
        nextLabel: "次の行動",
        days: [
          {
            label: "1日目",
            sublabel: "6月27日(土)・東京 → ホノルル",
            items: [
              {
                id: "flight-out",
                time: "21:55 発 → 10:25 着（現地）",
                icon: <IconPlane className="size-4" />,
                tone: "primary",
                title: "NH182 羽田(HND) → ホノルル(HNL)",
                description: "往路・所要 約7時間30分・座席 32K",
                trailing: <Badge variant="secondary">往路</Badge>,
              },
              {
                id: "hotel",
                time: "チェックイン 15:00",
                icon: <IconBuildingPavilion className="size-4" />,
                tone: "success",
                title: "ハイアット リージェンシー ワイキキ",
                description: "3泊・予約番号 RZ8K4P",
              },
            ],
          },
          {
            label: "2日目",
            sublabel: "6月28日(日)・オアフ島",
            items: [
              {
                id: "activity",
                time: "09:00",
                icon: <IconMapPin className="size-4" />,
                tone: "info",
                title: "ノースショア半日ツアー",
                description: "集合場所: ホテルロビー",
                content: <p className="rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">昼食は現地で自由時間に含めます。</p>,
              },
            ],
          },
        ] satisfies ItineraryDay[],
      }
    : {
        detailTitle: "Itinerary details",
        timeLabel: "Scheduled time",
        locationLabel: "Location",
        reservationLabel: "Reservation",
        nextLabel: "Next action",
        days: [
          {
            label: "Day 1",
            sublabel: "Jun 27 Sat / Tokyo to Honolulu",
            items: [
              {
                id: "flight-out",
                time: "21:55 departure / 10:25 arrival local",
                icon: <IconPlane className="size-4" />,
                tone: "primary",
                title: "NH182 Haneda (HND) to Honolulu (HNL)",
                description: "Outbound / about 7h 30m / seat 32K",
                trailing: <Badge variant="secondary">Outbound</Badge>,
              },
              {
                id: "hotel",
                time: "Check-in 15:00",
                icon: <IconBuildingPavilion className="size-4" />,
                tone: "success",
                title: "Hyatt Regency Waikiki",
                description: "3 nights / reservation RZ8K4P",
              },
            ],
          },
          {
            label: "Day 2",
            sublabel: "Jun 28 Sun / Oahu",
            items: [
              {
                id: "activity",
                time: "09:00",
                icon: <IconMapPin className="size-4" />,
                tone: "info",
                title: "North Shore half-day tour",
                description: "Meet at the hotel lobby",
                content: <p className="rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">Lunch is included in the local free-time window.</p>,
              },
            ],
          },
        ] satisfies ItineraryDay[],
      };
}

function itineraryDetails(locale: Locale): Record<string, { status: string; location: string; reservation: string; next: string }> {
  return locale === "ja"
    ? {
        "flight-out": {
          status: "確定",
          location: "羽田空港 第3ターミナル",
          reservation: "ANA 予約番号 8K2PQA / 座席 32K",
          next: "出発3時間前までにオンラインチェックインを完了",
        },
        hotel: {
          status: "予約済み",
          location: "2424 Kalakaua Ave, Honolulu",
          reservation: "RZ8K4P / 3泊 / オーシャンビュー",
          next: "到着後にパスポートと予約番号を提示",
        },
        activity: {
          status: "集合前",
          location: "ホテルロビー",
          reservation: "ツアーコード NS-094 / 2名",
          next: "08:45 までにロビー集合",
        },
        train: {
          status: "乗車予定",
          location: "空港第2ターミナル駅",
          reservation: "IC 乗車 / 指定席なし",
          next: "08:02 までに改札通過",
        },
        ferry: {
          status: "予約済み",
          location: "湾岸フェリー 3番桟橋",
          reservation: "乗船番号 BF-1182",
          next: "出航15分前までに桟橋へ移動",
        },
      }
    : {
        "flight-out": {
          status: "Confirmed",
          location: "Haneda Terminal 3",
          reservation: "ANA confirmation 8K2PQA / seat 32K",
          next: "Complete online check-in three hours before departure",
        },
        hotel: {
          status: "Booked",
          location: "2424 Kalakaua Ave, Honolulu",
          reservation: "RZ8K4P / 3 nights / ocean view",
          next: "Show passport and reservation number at arrival",
        },
        activity: {
          status: "Pending pickup",
          location: "Hotel lobby",
          reservation: "Tour code NS-094 / 2 guests",
          next: "Meet in the lobby by 08:45",
        },
        train: {
          status: "Scheduled",
          location: "Airport Terminal 2 Station",
          reservation: "IC fare / no reserved seat",
          next: "Enter the gate by 08:02",
        },
        ferry: {
          status: "Booked",
          location: "Bay ferry pier 3",
          reservation: "Boarding number BF-1182",
          next: "Move to the pier 15 minutes before departure",
        },
      };
}

function ItineraryPreview({
  locale,
  flat = false,
  initialSelectedId = null,
}: {
  locale: Locale;
  flat?: boolean;
  initialSelectedId?: string | null;
}) {
  const copy = itineraryCopy(locale);
  const [selectedId, setSelectedId] = React.useState<string | null>(initialSelectedId);
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);

  const withSelect = (item: ItineraryItem): ItineraryItem => ({
    ...item,
    onSelect: () => setSelectedId(String(item.id)),
  });

  const days = copy.days.map((day) => ({
    ...day,
    items: day.items.map(withSelect),
  }));
  const items = [
    {
      id: "train",
      time: locale === "ja" ? "08:10" : "08:10",
      icon: <IconTrain className="size-4" />,
      tone: "muted" as const,
      title: locale === "ja" ? "空港アクセス列車" : "Airport access train",
      description: locale === "ja" ? "第2ターミナルまで直通" : "Direct to Terminal 2",
      onSelect: () => setSelectedId("train"),
    },
    {
      id: "ferry",
      time: locale === "ja" ? "11:30" : "11:30",
      icon: <IconShip className="size-4" />,
      tone: "info" as const,
      title: locale === "ja" ? "湾岸フェリー" : "Bay ferry",
      description: locale === "ja" ? "港から市街地へ移動" : "Transfer from harbor to downtown",
      onSelect: () => setSelectedId("ferry"),
    },
  ];
  const visibleItems = flat ? items : days.flatMap((day) => day.items);
  const selectedItem = selectedId ? visibleItems.find((item) => String(item.id) === selectedId) : undefined;
  const selectedDetail = selectedId ? itineraryDetails(locale)[selectedId] : undefined;

  return (
    <div
      ref={setPortalContainer}
      className={[
        "relative flex w-full max-w-xl flex-col gap-4 overflow-hidden rounded-lg border bg-card p-4",
        flat ? "min-h-[340px]" : "",
      ].join(" ")}
    >
      {flat ? <Itinerary items={items} /> : <Itinerary days={days} />}
      <Sheet modal={false} open={selectedItem != null && selectedDetail != null} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent
          portalContainer={portalContainer}
          overlayClassName="rounded-lg"
          closeLabel={locale === "ja" ? "閉じる" : "Close"}
          className="w-80 max-w-[calc(100%-1rem)] overflow-y-auto p-4"
        >
          {selectedItem && selectedDetail ? (
            <>
              <SheetHeader className="pr-8">
                <SheetTitle>{copy.detailTitle}</SheetTitle>
              </SheetHeader>
              <ItineraryDetailContent copy={copy} item={selectedItem} detail={selectedDetail} />
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function ItineraryDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/itinerary", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.itinerary.title ?? "Itinerary";
  const description = content?.description ?? metadata.itinerary.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { Badge, Itinerary, Sheet, SheetContent, SheetHeader, SheetTitle, type ItineraryDay } from "@gunjo/ui";
import { IconBuildingPavilion, IconPlane } from "@tabler/icons-react";

export function TripItinerary() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);
  const days: ItineraryDay[] = [
    {
      label: "1日目",
      sublabel: "6月27日(土)・東京 → ホノルル",
      items: [
        {
          id: "flight-out",
          time: "21:55 発 → 10:25 着（現地）",
          icon: <IconPlane className="size-4" />,
          tone: "primary",
          title: "NH182 羽田(HND) → ホノルル(HNL)",
          description: "往路・所要 約7時間30分・座席 32K",
          trailing: <Badge variant="secondary">往路</Badge>,
          onSelect: () => setSelectedId("flight-out"),
        },
        {
          id: "hotel",
          time: "チェックイン 15:00",
          icon: <IconBuildingPavilion className="size-4" />,
          tone: "success",
          title: "ハイアット リージェンシー ワイキキ",
          description: "3泊・予約番号 RZ8K4P",
          onSelect: () => setSelectedId("hotel"),
        },
      ],
    },
  ];
  const itemDetails = {
    "flight-out": {
      status: "確定",
      location: "羽田空港 第3ターミナル",
      reservation: "ANA 予約番号 8K2PQA / 座席 32K",
      next: "出発3時間前までにオンラインチェックインを完了",
    },
    hotel: {
      status: "予約済み",
      location: "2424 Kalakaua Ave, Honolulu",
      reservation: "RZ8K4P / 3泊 / オーシャンビュー",
      next: "到着後にパスポートと予約番号を提示",
    },
  };
  const toneStyles = {
    primary: "border-primary bg-primary/10",
    success: "border-success-border bg-success-subtle/55",
  } as const;
  const visibleItems = days.flatMap((day) => day.items);
  const selectedItem = selectedId ? visibleItems.find((item) => item.id === selectedId) : undefined;
  const selectedDetail = selectedId ? itemDetails[selectedId as keyof typeof itemDetails] : undefined;
  const selectedTone = selectedItem?.tone === "success" ? toneStyles.success : toneStyles.primary;

  return (
    <div ref={setPortalContainer} className="relative flex w-full max-w-xl flex-col gap-4 overflow-hidden rounded-lg border bg-card p-4">
      <Itinerary days={days} />
      <Sheet modal={false} open={selectedItem != null && selectedDetail != null} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent portalContainer={portalContainer} overlayClassName="rounded-lg" closeLabel="閉じる" className="w-80 max-w-[calc(100%-1rem)] overflow-y-auto p-4">
        {selectedItem && selectedDetail ? (
          <>
          <SheetHeader className="pr-8">
            <SheetTitle>旅程詳細</SheetTitle>
          </SheetHeader>
          <div className={["rounded-lg border border-l-4 p-3 text-sm shadow-sm", selectedTone].join(" ")}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="mt-1 truncate text-base font-semibold text-foreground">{selectedItem.title}</p>
              </div>
              <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">
                {selectedDetail.status}
              </Badge>
            </div>
            <dl className="mt-3 grid gap-2 text-xs">
              <div>
                <dt className="text-muted-foreground">予定時刻</dt>
                <dd className="font-medium text-foreground">{selectedItem.time}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">場所</dt>
                <dd className="font-medium text-foreground">{selectedDetail.location}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">予約情報</dt>
                <dd className="font-medium text-foreground">{selectedDetail.reservation}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">次の行動</dt>
                <dd className="font-medium text-foreground">{selectedDetail.next}</dd>
              </div>
            </dl>
          </div>
          </>
        ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}`
    : `import * as React from "react";
import { Badge, Itinerary, Sheet, SheetContent, SheetHeader, SheetTitle, type ItineraryDay } from "@gunjo/ui";
import { IconBuildingPavilion, IconPlane } from "@tabler/icons-react";

export function TripItinerary() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);
  const days: ItineraryDay[] = [
    {
      label: "Day 1",
      sublabel: "Jun 27 Sat / Tokyo to Honolulu",
      items: [
        {
          id: "flight-out",
          time: "21:55 departure / 10:25 arrival local",
          icon: <IconPlane className="size-4" />,
          tone: "primary",
          title: "NH182 Haneda (HND) to Honolulu (HNL)",
          description: "Outbound / about 7h 30m / seat 32K",
          trailing: <Badge variant="secondary">Outbound</Badge>,
          onSelect: () => setSelectedId("flight-out"),
        },
        {
          id: "hotel",
          time: "Check-in 15:00",
          icon: <IconBuildingPavilion className="size-4" />,
          tone: "success",
          title: "Hyatt Regency Waikiki",
          description: "3 nights / reservation RZ8K4P",
          onSelect: () => setSelectedId("hotel"),
        },
      ],
    },
  ];
  const itemDetails = {
    "flight-out": {
      status: "Confirmed",
      location: "Haneda Terminal 3",
      reservation: "ANA confirmation 8K2PQA / seat 32K",
      next: "Complete online check-in three hours before departure",
    },
    hotel: {
      status: "Booked",
      location: "2424 Kalakaua Ave, Honolulu",
      reservation: "RZ8K4P / 3 nights / ocean view",
      next: "Show passport and reservation number at arrival",
    },
  };
  const toneStyles = {
    primary: "border-primary bg-primary/10",
    success: "border-success-border bg-success-subtle/55",
  } as const;
  const visibleItems = days.flatMap((day) => day.items);
  const selectedItem = selectedId ? visibleItems.find((item) => item.id === selectedId) : undefined;
  const selectedDetail = selectedId ? itemDetails[selectedId as keyof typeof itemDetails] : undefined;
  const selectedTone = selectedItem?.tone === "success" ? toneStyles.success : toneStyles.primary;

  return (
    <div ref={setPortalContainer} className="relative flex w-full max-w-xl flex-col gap-4 overflow-hidden rounded-lg border bg-card p-4">
      <Itinerary days={days} />
      <Sheet modal={false} open={selectedItem != null && selectedDetail != null} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent portalContainer={portalContainer} overlayClassName="rounded-lg" closeLabel="Close" className="w-80 max-w-[calc(100%-1rem)] overflow-y-auto p-4">
        {selectedItem && selectedDetail ? (
          <>
          <SheetHeader className="pr-8">
            <SheetTitle>Itinerary details</SheetTitle>
          </SheetHeader>
          <div className={["rounded-lg border border-l-4 p-3 text-sm shadow-sm", selectedTone].join(" ")}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="mt-1 truncate text-base font-semibold text-foreground">{selectedItem.title}</p>
              </div>
              <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">
                {selectedDetail.status}
              </Badge>
            </div>
            <dl className="mt-3 grid gap-2 text-xs">
              <div>
                <dt className="text-muted-foreground">Scheduled time</dt>
                <dd className="font-medium text-foreground">{selectedItem.time}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-medium text-foreground">{selectedDetail.location}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Reservation</dt>
                <dd className="font-medium text-foreground">{selectedDetail.reservation}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Next action</dt>
                <dd className="font-medium text-foreground">{selectedDetail.next}</dd>
              </div>
            </dl>
          </div>
          </>
        ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}`;

  const propsData = [
    { name: "days", type: "ItineraryDay[]", description: locale === "ja" ? "日別グループです。各日が見出しと timeline を持ちます。" : "Day groups. Each day owns a heading and timeline." },
    { name: "items", type: "ItineraryItem[]", description: locale === "ja" ? "日別グループなしのフラットな項目です。days がある場合は無視します。" : "Flat items without day grouping. Ignored when days is provided." },
    { name: "ItineraryItem.time", type: "ReactNode", description: locale === "ja" ? "時刻や終日などのラベルです。" : "Time label such as hour, all day, or check-in time." },
    { name: "ItineraryItem.icon", type: "ReactNode", description: locale === "ja" ? "種別を示すマーカーアイコンです。" : "Marker icon for the item kind." },
    { name: "ItineraryItem.tone", type: '"default" | "primary" | "info" | "success" | "warning" | "muted"', default: '"default"', description: locale === "ja" ? "マーカーのトーンです。" : "Marker tone." },
    { name: "ItineraryItem.title / description", type: "ReactNode", description: locale === "ja" ? "主要行と副次行です。" : "Primary and secondary text." },
    { name: "ItineraryItem.content", type: "ReactNode", description: locale === "ja" ? "便詳細や地図などのリッチ内容を置くスロットです。" : "Rich content slot for flight detail, maps, or notes." },
    { name: "ItineraryItem.trailing", type: "ReactNode", description: locale === "ja" ? "右側に置く Badge やメタ情報です。" : "Trailing badge or metadata." },
    { name: "ItineraryItem.onSelect", type: "() => void", description: locale === "ja" ? "行を44px以上のクリック可能領域にします。" : "Makes the row an activatable target of at least 44px." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "Itinerary", href: "/docs/components/itinerary" },
        { name: "Badge", href: "/docs/components/badge" },
        { name: "Sheet", href: "/docs/components/sheet" },
      ]}
      relatedComponents={[
        { name: "Timeline", href: "/docs/components/timeline" },
        { name: "RouteStops", href: "/docs/components/route-stops" },
        { name: "ListCard", href: "/docs/components/list-card" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <ItineraryPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "day-grouped",
              title: locale === "ja" ? "日別グループ" : "Day grouped",
              description: locale === "ja" ? "days を渡すと、日ごとの見出しとタイムラインで表示します。" : "Pass days to render a heading and timeline per day.",
              preview: <ItineraryPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "md",
            },
            {
              key: "flat",
              title: locale === "ja" ? "フラット" : "Flat",
              description: locale === "ja" ? "items だけを渡すと、日別見出しなしの短い移動予定として使えます。" : "Pass only items for a short timeline without day headings.",
              preview: <ItineraryPreview locale={locale} flat initialSelectedId="ferry" />,
              code: locale === "ja"
                ? `import * as React from "react";
import { Badge, Itinerary, Sheet, SheetContent, SheetHeader, SheetTitle } from "@gunjo/ui";
import { IconShip, IconTrain } from "@tabler/icons-react";

const [selectedId, setSelectedId] = React.useState<string | null>("ferry");
const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);
const items = [
  { id: "train", time: "08:10", title: "空港アクセス列車", description: "第2ターミナルまで直通", icon: <IconTrain className="size-4" />, tone: "muted", onSelect: () => setSelectedId("train") },
  { id: "ferry", time: "11:30", title: "湾岸フェリー", description: "港から市街地へ移動", icon: <IconShip className="size-4" />, tone: "info", onSelect: () => setSelectedId("ferry") },
];
const details = {
  train: { status: "乗車予定", location: "空港第2ターミナル駅", next: "08:02 までに改札通過" },
  ferry: { status: "予約済み", location: "湾岸フェリー 3番桟橋", next: "出航15分前までに桟橋へ移動" },
};
const selectedItem = selectedId ? items.find((item) => item.id === selectedId) : undefined;
const selectedDetail = selectedId ? details[selectedId as keyof typeof details] : undefined;

<div ref={setPortalContainer} className="relative min-h-[340px] overflow-hidden rounded-lg border bg-card p-4">
  <Itinerary items={items} />
  <Sheet modal={false} open={selectedItem != null && selectedDetail != null} onOpenChange={(open) => !open && setSelectedId(null)}>
    <SheetContent portalContainer={portalContainer} overlayClassName="rounded-lg" closeLabel="閉じる" className="w-80 max-w-[calc(100%-1rem)] overflow-y-auto p-4">
      {selectedItem && selectedDetail ? (
        <>
          <SheetHeader className="pr-8">
            <SheetTitle>旅程詳細</SheetTitle>
          </SheetHeader>
          <div className="rounded-lg border border-l-4 border-info-border bg-info-subtle/55 p-3 text-sm shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="truncate text-base font-semibold text-foreground">{selectedItem.title}</p>
              <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">{selectedDetail.status}</Badge>
            </div>
            <dl className="mt-3 grid gap-2 text-xs">
              <div><dt className="text-muted-foreground">場所</dt><dd className="font-medium text-foreground">{selectedDetail.location}</dd></div>
              <div><dt className="text-muted-foreground">次の行動</dt><dd className="font-medium text-foreground">{selectedDetail.next}</dd></div>
            </dl>
          </div>
        </>
      ) : null}
    </SheetContent>
  </Sheet>
</div>`
                : `import * as React from "react";
import { Badge, Itinerary, Sheet, SheetContent, SheetHeader, SheetTitle } from "@gunjo/ui";
import { IconShip, IconTrain } from "@tabler/icons-react";

const [selectedId, setSelectedId] = React.useState<string | null>("ferry");
const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);
const items = [
  { id: "train", time: "08:10", title: "Airport access train", description: "Direct to Terminal 2", icon: <IconTrain className="size-4" />, tone: "muted", onSelect: () => setSelectedId("train") },
  { id: "ferry", time: "11:30", title: "Bay ferry", description: "Transfer from harbor to downtown", icon: <IconShip className="size-4" />, tone: "info", onSelect: () => setSelectedId("ferry") },
];
const details = {
  train: { status: "Scheduled", location: "Airport Terminal 2 Station", next: "Enter the gate by 08:02" },
  ferry: { status: "Booked", location: "Bay ferry pier 3", next: "Move to the pier 15 minutes before departure" },
};
const selectedItem = selectedId ? items.find((item) => item.id === selectedId) : undefined;
const selectedDetail = selectedId ? details[selectedId as keyof typeof details] : undefined;

<div ref={setPortalContainer} className="relative min-h-[340px] overflow-hidden rounded-lg border bg-card p-4">
  <Itinerary items={items} />
  <Sheet modal={false} open={selectedItem != null && selectedDetail != null} onOpenChange={(open) => !open && setSelectedId(null)}>
    <SheetContent portalContainer={portalContainer} overlayClassName="rounded-lg" closeLabel="Close" className="w-80 max-w-[calc(100%-1rem)] overflow-y-auto p-4">
      {selectedItem && selectedDetail ? (
        <>
          <SheetHeader className="pr-8">
            <SheetTitle>Itinerary details</SheetTitle>
          </SheetHeader>
          <div className="rounded-lg border border-l-4 border-info-border bg-info-subtle/55 p-3 text-sm shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="truncate text-base font-semibold text-foreground">{selectedItem.title}</p>
              <Badge variant="outline" className="shrink-0 border-border bg-background text-foreground shadow-sm">{selectedDetail.status}</Badge>
            </div>
            <dl className="mt-3 grid gap-2 text-xs">
              <div><dt className="text-muted-foreground">Location</dt><dd className="font-medium text-foreground">{selectedDetail.location}</dd></div>
              <div><dt className="text-muted-foreground">Next action</dt><dd className="font-medium text-foreground">{selectedDetail.next}</dd></div>
            </dl>
          </div>
        </>
      ) : null}
    </SheetContent>
  </Sheet>
</div>`,
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
