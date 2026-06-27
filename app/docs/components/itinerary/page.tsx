import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { ItineraryDemo } from "@/components/demos/ItineraryDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { Itinerary, Badge, type ItineraryDay } from "@gunjo/ui"
import { IconPlane, IconBuildingPavilion } from "@tabler/icons-react"

const days: ItineraryDay[] = [
  { label: "1日目", sublabel: "6月27日(土)・東京 → ホノルル", items: [
    { time: "21:55 発 → 10:25 着（現地）", icon: <IconPlane className="size-4" />, tone: "primary",
      title: "NH182 羽田(HND) → ホノルル(HNL)", description: "往路・所要 約7時間30分・座席 32K",
      trailing: <Badge variant="info">往路</Badge>, onSelect: () => openFlight() },
    { time: "チェックイン 15:00", icon: <IconBuildingPavilion className="size-4" />, tone: "success",
      title: "ハイアット リージェンシー ワイキキ", description: "3泊・予約番号 RZ8K4P", onSelect: () => openHotel() },
  ]},
]

<Itinerary days={days} />`;

const propsData = [
  { name: "days", type: "ItineraryDay[]", description: "日別グループ（各日 = 見出し＋タイムライン）。" },
  { name: "items", type: "ItineraryItem[]", description: "フラットな項目（日別グループ無し）。days 指定時は無視。" },
  { name: "ItineraryDay.label", type: "ReactNode", description: "日の見出し（1日目 / 6月27日(土)）。" },
  { name: "ItineraryDay.sublabel", type: "ReactNode", description: "副次（場所・日付）。" },
  { name: "ItineraryItem.time", type: "ReactNode", description: "時刻ラベル（08:00 / 終日 / チェックイン15:00）。" },
  { name: "ItineraryItem.icon", type: "ReactNode", description: "種別マーカーのアイコン（便/ホテル/アクティビティ）。" },
  { name: "ItineraryItem.tone", type: '"default" | "primary" | "info" | "success" | "warning" | "muted"', default: '"default"', description: "マーカーのトーン。" },
  { name: "ItineraryItem.title", type: "ReactNode", description: "主要行。" },
  { name: "ItineraryItem.description", type: "ReactNode", description: "副次行。" },
  { name: "ItineraryItem.content", type: "ReactNode", description: "リッチな内容スロット（便の出発→到着ブロック等）。" },
  { name: "ItineraryItem.trailing", type: "ReactNode", description: "右寄せ（Badge/meta）。" },
  { name: "ItineraryItem.onSelect", type: "() => void", description: "行を ≥44px の tappable に（詳細を開く・任意）。" },
];

export default function ItineraryDocPage() {
  const title = meta.itinerary.title ?? "Itinerary";
  const description = meta.itinerary.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Timeline", href: "/docs/components/timeline" },
        { name: "RouteStops", href: "/docs/components/route-stops" },
        { name: "Badge", href: "/docs/components/badge" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="md">
        <ItineraryDemo />
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
