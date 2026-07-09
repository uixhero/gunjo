"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import {
  IconArmchair2,
  IconCup,
  IconDoorEnter,
  IconPlaneDeparture,
  IconToolsKitchen2,
  IconWifi,
} from "@tabler/icons-react";
import displayMetadata from "@design/display-metadata.json";
import {
  Badge,
  FilterChips,
  ListCard,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  type FilterChip,
} from "@gunjo/ui";

type Locale = "ja" | "en";

type Facility = {
  id: string;
  category: string;
  title: string;
  description: string;
  status: string;
  meta: string;
};

type FilterPreviewSelection = { type: "facility"; facility: Facility };

const disabledGateIds = Array.from({ length: 3 }, (_, index) => index + 1);

function filterChipsCopy(locale: Locale) {
  return locale === "ja"
    ? {
        ariaLabel: "施設カテゴリ",
        previewTitle: "プレビュー",
        previewDescription: "選択した施設の詳細を確認します。",
        facilityTitle: (title: string) => `施設: ${title}`,
        close: "閉じる",
        disabledReason: "このカテゴリは現在選択できません。",
        disabledReasons: {
          lounge: "ラウンジは満席のため、この時間帯は選択できません。",
          smoking: "喫煙所は改修中のため、このフロアでは選択できません。",
        },
        chips: [
          { value: "all", label: "すべて", count: 24, icon: <IconPlaneDeparture className="h-4 w-4" /> },
          { value: "gate", label: "搭乗口", count: 8, icon: <IconDoorEnter className="h-4 w-4" /> },
          { value: "lounge", label: "ラウンジ", count: 3, icon: <IconArmchair2 className="h-4 w-4" /> },
          { value: "food", label: "飲食", count: 6, icon: <IconToolsKitchen2 className="h-4 w-4" /> },
          { value: "cafe", label: "カフェ", count: 4, icon: <IconCup className="h-4 w-4" /> },
          { value: "wifi", label: "Wi-Fi", count: 2, icon: <IconWifi className="h-4 w-4" /> },
          { value: "smoking", label: "喫煙所", count: 0, disabled: true },
        ] satisfies FilterChip[],
        facilities: [
          { id: "gate-12", category: "gate", title: "12番搭乗口", description: "国内線・保安検査場から徒歩4分", status: "搭乗中", meta: "4分" },
          { id: "sakura-lounge", category: "lounge", title: "サクララウンジ", description: "対象カード・上級会員向け", status: "空席あり", meta: "3F" },
          { id: "ramen", category: "food", title: "空港食堂 そら", description: "定食・ラーメン・朝食営業", status: "営業中", meta: "2F" },
          { id: "coffee", category: "cafe", title: "Blue Coffee Stand", description: "テイクアウト・電源席あり", status: "混雑", meta: "1F" },
          { id: "wifi-counter", category: "wifi", title: "Wi-Fi カウンター", description: "接続サポート・充電ケーブル貸出", status: "受付中", meta: "B1F" },
        ] satisfies Facility[],
        disabledExample: {
          chips: [
            { value: "all", label: "すべて", count: 3, icon: <IconPlaneDeparture className="h-4 w-4" /> },
            { value: "gate", label: "搭乗口", count: 3, icon: <IconDoorEnter className="h-4 w-4" /> },
            { value: "lounge", label: "ラウンジ", count: 0, icon: <IconArmchair2 className="h-4 w-4" />, disabled: true, disabledReason: "ラウンジは満席のため、この時間帯は選択できません。" },
            { value: "smoking", label: "喫煙所", count: 0, disabled: true, disabledReason: "喫煙所は改修中のため、このフロアでは選択できません。" },
          ] satisfies FilterChip[],
          facilities: disabledGateIds.map((id) => ({
            id: `gate-${id}`,
            category: "gate",
            title: `${id + 10}番搭乗口`,
            description: `国内線・保安検査場から徒歩${Math.min(id + 2, 9)}分`,
            status: id <= 3 ? "搭乗中" : "準備中",
            meta: `${Math.min(id + 2, 9)}分`,
          })) satisfies Facility[],
        },
      }
    : {
        ariaLabel: "Facility category",
        previewTitle: "Preview",
        previewDescription: "Review the selected facility details.",
        facilityTitle: (title: string) => `Facility: ${title}`,
        close: "Close",
        disabledReason: "This category is currently unavailable.",
        disabledReasons: {
          lounge: "Lounges are full for this time slot.",
          smoking: "Smoking areas are under renovation on this floor.",
        },
        chips: [
          { value: "all", label: "All", count: 24, icon: <IconPlaneDeparture className="h-4 w-4" /> },
          { value: "gate", label: "Gates", count: 8, icon: <IconDoorEnter className="h-4 w-4" /> },
          { value: "lounge", label: "Lounges", count: 3, icon: <IconArmchair2 className="h-4 w-4" /> },
          { value: "food", label: "Food", count: 6, icon: <IconToolsKitchen2 className="h-4 w-4" /> },
          { value: "cafe", label: "Cafe", count: 4, icon: <IconCup className="h-4 w-4" /> },
          { value: "wifi", label: "Wi-Fi", count: 2, icon: <IconWifi className="h-4 w-4" /> },
          { value: "smoking", label: "Smoking", count: 0, disabled: true },
        ] satisfies FilterChip[],
        facilities: [
          { id: "gate-12", category: "gate", title: "Gate 12", description: "Domestic flights / 4 min from security", status: "Boarding", meta: "4 min" },
          { id: "sakura-lounge", category: "lounge", title: "Sakura Lounge", description: "Eligible cards and premium members", status: "Seats open", meta: "3F" },
          { id: "ramen", category: "food", title: "Airport Kitchen Sora", description: "Set meals, ramen, breakfast", status: "Open", meta: "2F" },
          { id: "coffee", category: "cafe", title: "Blue Coffee Stand", description: "Takeout and power seats", status: "Busy", meta: "1F" },
          { id: "wifi-counter", category: "wifi", title: "Wi-Fi Counter", description: "Connection support and charging cable rental", status: "Open", meta: "B1F" },
        ] satisfies Facility[],
        disabledExample: {
          chips: [
            { value: "all", label: "All", count: 3, icon: <IconPlaneDeparture className="h-4 w-4" /> },
            { value: "gate", label: "Gates", count: 3, icon: <IconDoorEnter className="h-4 w-4" /> },
            { value: "lounge", label: "Lounges", count: 0, icon: <IconArmchair2 className="h-4 w-4" />, disabled: true, disabledReason: "Lounges are full for this time slot." },
            { value: "smoking", label: "Smoking", count: 0, disabled: true, disabledReason: "Smoking areas are under renovation on this floor." },
          ] satisfies FilterChip[],
          facilities: disabledGateIds.map((id) => ({
            id: `gate-${id}`,
            category: "gate",
            title: `Gate ${id + 10}`,
            description: `Domestic flights / ${Math.min(id + 2, 9)} min from security`,
            status: id <= 3 ? "Boarding" : "Preparing",
            meta: `${Math.min(id + 2, 9)} min`,
          })) satisfies Facility[],
        },
      };
}

function FilterChipsPreview({
  locale,
  initialValue = "all",
  disabledExample = false,
}: {
  locale: Locale;
  initialValue?: string;
  disabledExample?: boolean;
}) {
  const copy = filterChipsCopy(locale);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [category, setCategory] = React.useState(initialValue);
  const [selection, setSelection] = React.useState<FilterPreviewSelection | null>(null);
  const sourceChips: FilterChip[] = disabledExample ? copy.disabledExample.chips : copy.chips;
  const facilities = disabledExample ? copy.disabledExample.facilities : copy.facilities;
  const chips = sourceChips.map((chip) => ({
    ...chip,
    disabledReason: chip.disabled ? chip.disabledReason ?? copy.disabledReason : undefined,
  }));
  const visibleFacilities = category === "all"
    ? facilities
    : facilities.filter((facility) => facility.category === category);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  const handleCategoryChange = (nextValue: string) => {
    setCategory(nextValue);
    setSelection(null);
  };

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-[360px] w-full max-w-2xl flex-col gap-4"
    >
      <FilterChips
        items={chips}
        value={category}
        onValueChange={handleCategoryChange}
        aria-label={copy.ariaLabel}
      />
      <div className="grid gap-2">
        {visibleFacilities.map((facility) => (
          <ListCard
            key={facility.id}
            title={facility.title}
            description={facility.description}
            status={<Badge variant="secondary">{facility.status}</Badge>}
            meta={facility.meta}
            selected={selection?.type === "facility" && selection.facility.id === facility.id}
            onSelect={() => setSelection({ type: "facility", facility })}
          />
        ))}
      </div>
      {selection && portalContainer
        ? createPortal(
          <div
            aria-hidden="true"
            className="absolute inset-0 z-40 rounded-md bg-overlay/60"
            onPointerDown={(event) => {
              event.preventDefault();
              setSelection(null);
            }}
          />,
          portalContainer
        )
        : null}
      <Sheet modal={false} open={selection != null} onOpenChange={(open) => !open && setSelection(null)}>
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
            <SheetDescription>{copy.previewDescription}</SheetDescription>
          </SheetHeader>
          {selection ? (
            <div className="mt-4 grid gap-4 text-sm">
              <div className="rounded-lg border bg-card p-3">
                <p className="font-medium text-foreground">
                  {copy.facilityTitle(selection.facility.title)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selection.facility.meta}
                </p>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{selection.facility.title}</p>
                  <Badge variant="secondary">{selection.facility.status}</Badge>
                </div>
                <p className="mt-1 text-muted-foreground">{selection.facility.description}</p>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function FilterChipsDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/filter-chips", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.filterChips.title ?? "FilterChips";
  const description = content?.description ?? metadata.filterChips.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { createPortal } from "react-dom";
import {
  Badge,
  FilterChips,
  ListCard,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  type FilterChip,
} from "@gunjo/ui";
import {
  IconArmchair2,
  IconCup,
  IconDoorEnter,
  IconPlaneDeparture,
  IconToolsKitchen2,
  IconWifi,
} from "@tabler/icons-react";

const categories: FilterChip[] = [
  { value: "all", label: "すべて", count: 24, icon: <IconPlaneDeparture className="h-4 w-4" /> },
  { value: "gate", label: "搭乗口", count: 8, icon: <IconDoorEnter className="h-4 w-4" /> },
  { value: "lounge", label: "ラウンジ", count: 3, icon: <IconArmchair2 className="h-4 w-4" /> },
  { value: "food", label: "飲食", count: 6, icon: <IconToolsKitchen2 className="h-4 w-4" /> },
  { value: "cafe", label: "カフェ", count: 4, icon: <IconCup className="h-4 w-4" /> },
  { value: "wifi", label: "Wi-Fi", count: 2, icon: <IconWifi className="h-4 w-4" /> },
  {
    value: "smoking",
    label: "喫煙所",
    count: 0,
    disabled: true,
    disabledReason: "喫煙所は改修中のため、このフロアでは選択できません。",
  },
];

const facilities = [
  { id: "gate-12", category: "gate", title: "12番搭乗口", description: "国内線・保安検査場から徒歩4分", status: "搭乗中", meta: "4分" },
  { id: "sakura-lounge", category: "lounge", title: "サクララウンジ", description: "対象カード・上級会員向け", status: "空席あり", meta: "3F" },
  { id: "ramen", category: "food", title: "空港食堂 そら", description: "定食・ラーメン・朝食営業", status: "営業中", meta: "2F" },
  { id: "coffee", category: "cafe", title: "Blue Coffee Stand", description: "テイクアウト・電源席あり", status: "混雑", meta: "1F" },
  { id: "wifi-counter", category: "wifi", title: "Wi-Fi カウンター", description: "接続サポート・充電ケーブル貸出", status: "受付中", meta: "B1F" },
];

type PreviewSelection = { type: "facility"; facility: (typeof facilities)[number] };

export function FacilityFinder() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [category, setCategory] = React.useState("all");
  const [selection, setSelection] = React.useState<PreviewSelection | null>(null);
  const visibleFacilities = category === "all" ? facilities : facilities.filter((facility) => facility.category === category);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  return (
    <div ref={rootRef} className="relative flex min-h-[360px] w-full max-w-2xl flex-col gap-4">
      <FilterChips
        items={categories}
        value={category}
        onValueChange={(nextValue) => {
          setCategory(nextValue);
          setSelection(null);
        }}
        aria-label="施設カテゴリ"
      />
      <div className="grid gap-2">
        {visibleFacilities.map((facility) => (
          <ListCard
            key={facility.id}
            title={facility.title}
            description={facility.description}
            status={<Badge variant="secondary">{facility.status}</Badge>}
            meta={facility.meta}
            selected={selection?.type === "facility" && selection.facility.id === facility.id}
            onSelect={() => setSelection({ type: "facility", facility })}
          />
        ))}
      </div>
      {selection && portalContainer
        ? createPortal(
          <div
            aria-hidden="true"
            className="absolute inset-0 z-40 rounded-md bg-overlay/60"
            onPointerDown={(event) => {
              event.preventDefault();
              setSelection(null);
            }}
          />,
          portalContainer
        )
        : null}
      <Sheet modal={false} open={selection != null} onOpenChange={(open) => !open && setSelection(null)}>
        <SheetContent portalContainer={portalContainer} overlayClassName="rounded-md" closeLabel="閉じる">
          <SheetHeader>
            <SheetTitle asChild>
              <p>プレビュー</p>
            </SheetTitle>
            <SheetDescription>選択した施設の詳細を確認します。</SheetDescription>
          </SheetHeader>
          {selection ? (
            <div className="mt-4 grid gap-4 text-sm">
              <div className="rounded-lg border bg-card p-3">
                <p className="font-medium text-foreground">
                  {"施設: " + selection.facility.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selection.facility.meta}
                </p>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{selection.facility.title}</p>
                  <Badge variant="secondary">{selection.facility.status}</Badge>
                </div>
                <p className="mt-1 text-muted-foreground">{selection.facility.description}</p>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}`
    : `import * as React from "react";
import { createPortal } from "react-dom";
import {
  Badge,
  FilterChips,
  ListCard,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  type FilterChip,
} from "@gunjo/ui";
import {
  IconArmchair2,
  IconCup,
  IconDoorEnter,
  IconPlaneDeparture,
  IconToolsKitchen2,
  IconWifi,
} from "@tabler/icons-react";

const categories: FilterChip[] = [
  { value: "all", label: "All", count: 24, icon: <IconPlaneDeparture className="h-4 w-4" /> },
  { value: "gate", label: "Gates", count: 8, icon: <IconDoorEnter className="h-4 w-4" /> },
  { value: "lounge", label: "Lounges", count: 3, icon: <IconArmchair2 className="h-4 w-4" /> },
  { value: "food", label: "Food", count: 6, icon: <IconToolsKitchen2 className="h-4 w-4" /> },
  { value: "cafe", label: "Cafe", count: 4, icon: <IconCup className="h-4 w-4" /> },
  { value: "wifi", label: "Wi-Fi", count: 2, icon: <IconWifi className="h-4 w-4" /> },
  {
    value: "smoking",
    label: "Smoking",
    count: 0,
    disabled: true,
    disabledReason: "Smoking areas are under renovation on this floor.",
  },
];

const facilities = [
  { id: "gate-12", category: "gate", title: "Gate 12", description: "Domestic flights / 4 min from security", status: "Boarding", meta: "4 min" },
  { id: "sakura-lounge", category: "lounge", title: "Sakura Lounge", description: "Eligible cards and premium members", status: "Seats open", meta: "3F" },
  { id: "ramen", category: "food", title: "Airport Kitchen Sora", description: "Set meals, ramen, breakfast", status: "Open", meta: "2F" },
  { id: "coffee", category: "cafe", title: "Blue Coffee Stand", description: "Takeout and power seats", status: "Busy", meta: "1F" },
  { id: "wifi-counter", category: "wifi", title: "Wi-Fi Counter", description: "Connection support and charging cable rental", status: "Open", meta: "B1F" },
];

type PreviewSelection = { type: "facility"; facility: (typeof facilities)[number] };

export function FacilityFinder() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [category, setCategory] = React.useState("all");
  const [selection, setSelection] = React.useState<PreviewSelection | null>(null);
  const visibleFacilities = category === "all" ? facilities : facilities.filter((facility) => facility.category === category);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  return (
    <div ref={rootRef} className="relative flex min-h-[360px] w-full max-w-2xl flex-col gap-4">
      <FilterChips
        items={categories}
        value={category}
        onValueChange={(nextValue) => {
          setCategory(nextValue);
          setSelection(null);
        }}
        aria-label="Facility category"
      />
      <div className="grid gap-2">
        {visibleFacilities.map((facility) => (
          <ListCard
            key={facility.id}
            title={facility.title}
            description={facility.description}
            status={<Badge variant="secondary">{facility.status}</Badge>}
            meta={facility.meta}
            selected={selection?.type === "facility" && selection.facility.id === facility.id}
            onSelect={() => setSelection({ type: "facility", facility })}
          />
        ))}
      </div>
      {selection && portalContainer
        ? createPortal(
          <div
            aria-hidden="true"
            className="absolute inset-0 z-40 rounded-md bg-overlay/60"
            onPointerDown={(event) => {
              event.preventDefault();
              setSelection(null);
            }}
          />,
          portalContainer
        )
        : null}
      <Sheet modal={false} open={selection != null} onOpenChange={(open) => !open && setSelection(null)}>
        <SheetContent portalContainer={portalContainer} overlayClassName="rounded-md" closeLabel="Close">
          <SheetHeader>
            <SheetTitle asChild>
              <p>Preview</p>
            </SheetTitle>
            <SheetDescription>Review the selected facility details.</SheetDescription>
          </SheetHeader>
          {selection ? (
            <div className="mt-4 grid gap-4 text-sm">
              <div className="rounded-lg border bg-card p-3">
                <p className="font-medium text-foreground">
                  {"Facility: " + selection.facility.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selection.facility.meta}
                </p>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{selection.facility.title}</p>
                  <Badge variant="secondary">{selection.facility.status}</Badge>
                </div>
                <p className="mt-1 text-muted-foreground">{selection.facility.description}</p>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}`;

  const propsData = [
    {
      name: "items",
      type: "FilterChip[]",
      description: locale === "ja" ? "表示するチップです。value、label、icon、count、disabled、disabledReason を渡せます。" : "Chips to render. Each item can include value, label, icon, count, disabled, and disabledReason.",
    },
    {
      name: "value",
      type: "string",
      description: locale === "ja" ? "選択中の value です。" : "Currently selected value.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      description: locale === "ja" ? "チップ選択時に呼びます。" : "Called when a chip is selected.",
    },
    {
      name: "aria-label",
      type: "string",
      default: locale === "ja" ? '"絞り込み"' : '"絞り込み"',
      description: locale === "ja" ? "チップ群のアクセシブル名です。" : "Accessible name for the chip group.",
    },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "FilterChips", href: "/docs/components/filter-chips" },
        { name: "ListCard", href: "/docs/components/list-card" },
        { name: "Sheet", href: "/docs/components/sheet" },
        { name: "Tooltip", href: "/docs/components/tooltip" },
      ]}
      relatedComponents={[
        { name: "ToggleGroup", href: "/docs/components/toggle-group" },
        { name: "FilterButton", href: "/docs/components/filter-button" },
        { name: "Badge", href: "/docs/components/badge" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="lg">
        <FilterChipsPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "selected",
              title: locale === "ja" ? "選択中" : "Selected",
              description: locale === "ja"
                ? "選択中のカテゴリは塗りつぶしチップで示し、下の一覧も同じ value で絞り込みます。"
                : "The selected category is filled and filters the list below with the same value.",
              preview: <FilterChipsPreview locale={locale} initialValue="gate" />,
              code: locale === "ja"
                ? `<FilterChips
  items={[
    { value: "all", label: "すべて", count: 24 },
    { value: "gate", label: "搭乗口", count: 8 },
    { value: "lounge", label: "ラウンジ", count: 3 },
  ]}
  value="gate"
  onValueChange={setCategory}
  aria-label="施設カテゴリ"
/>`
                : `<FilterChips
  items={[
    { value: "all", label: "All", count: 24 },
    { value: "gate", label: "Gates", count: 8 },
    { value: "lounge", label: "Lounges", count: 3 },
  ]}
  value="gate"
  onValueChange={setCategory}
  aria-label="Facility category"
/>`,
              previewBodyWidth: "lg",
            },
            {
              key: "disabled",
              title: locale === "ja" ? "無効チップ" : "Disabled chip",
              description: locale === "ja"
                ? "disabledReason を渡すと、選べない理由をホバーまたはフォーカスで説明します。"
                : "Pass disabledReason so unavailable chips explain why on hover or focus.",
              preview: <FilterChipsPreview locale={locale} disabledExample />,
              code: locale === "ja"
                ? `const categories = [
    { value: "all", label: "すべて", count: 3 },
    { value: "gate", label: "搭乗口", count: 3 },
    {
      value: "lounge",
      label: "ラウンジ",
      count: 0,
      disabled: true,
      disabledReason: "ラウンジは満席のため、この時間帯は選択できません。",
    },
    {
      value: "smoking",
      label: "喫煙所",
      count: 0,
      disabled: true,
      disabledReason: "喫煙所は改修中のため、このフロアでは選択できません。",
    },
  ];

const facilities = [
  { id: "gate-11", category: "gate", title: "11番搭乗口", description: "国内線・保安検査場から徒歩3分", status: "搭乗中", meta: "3分" },
  { id: "gate-12", category: "gate", title: "12番搭乗口", description: "国内線・保安検査場から徒歩4分", status: "搭乗中", meta: "4分" },
  { id: "gate-13", category: "gate", title: "13番搭乗口", description: "国内線・保安検査場から徒歩5分", status: "搭乗中", meta: "5分" },
];

<div className="grid gap-4">
  <FilterChips
    items={categories}
    value={category}
    onValueChange={setCategory}
    aria-label="施設カテゴリ"
  />
  <div className="grid gap-2">
    {facilities.map((facility) => (
      <ListCard
        key={facility.id}
        title={facility.title}
        description={facility.description}
        status={<Badge variant="secondary">{facility.status}</Badge>}
        meta={facility.meta}
      />
    ))}
  </div>
</div>`
                : `const categories = [
    { value: "all", label: "All", count: 3 },
    { value: "gate", label: "Gates", count: 3 },
    {
      value: "lounge",
      label: "Lounges",
      count: 0,
      disabled: true,
      disabledReason: "Lounges are full for this time slot.",
    },
    {
      value: "smoking",
      label: "Smoking",
      count: 0,
      disabled: true,
      disabledReason: "Smoking areas are under renovation on this floor.",
    },
  ];

const facilities = [
  { id: "gate-11", category: "gate", title: "Gate 11", description: "Domestic flights / 3 min from security", status: "Boarding", meta: "3 min" },
  { id: "gate-12", category: "gate", title: "Gate 12", description: "Domestic flights / 4 min from security", status: "Boarding", meta: "4 min" },
  { id: "gate-13", category: "gate", title: "Gate 13", description: "Domestic flights / 5 min from security", status: "Boarding", meta: "5 min" },
];

<div className="grid gap-4">
  <FilterChips
    items={categories}
    value={category}
    onValueChange={setCategory}
    aria-label="Facility category"
  />
  <div className="grid gap-2">
    {facilities.map((facility) => (
      <ListCard
        key={facility.id}
        title={facility.title}
        description={facility.description}
        status={<Badge variant="secondary">{facility.status}</Badge>}
        meta={facility.meta}
      />
    ))}
  </div>
</div>`,
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
