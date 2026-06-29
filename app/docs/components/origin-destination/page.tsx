import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { OriginDestinationDemo } from "@/components/demos/OriginDestinationDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { OriginDestination } from "@gunjo/ui"

// Header — prominent A→B with a swap button + duration connector.
<OriginDestination
  from={{ label: "東京", sub: "新幹線" }}
  to={{ label: "新大阪", sub: "新幹線" }}
  connector="のぞみ最速 2:27"
  onSwap={swapStations}
/>

// Inline — the per-result 発→着 row.
<OriginDestination inline from={{ label: "06:00", sub: "発" }} to={{ label: "08:27", sub: "着" }} />`;

const propsData = [
  { name: "from / to", type: "OriginDestinationEndpoint", description: "出発・到着＝{ label, sub? }（東京 / HND / 上海港 ＋ コード/時刻/番線）。" },
  { name: "via", type: "OriginDestinationEndpoint[]", description: "経由地（from と to の間に表示）。" },
  { name: "connector", type: "ReactNode", description: "矢印の所要時間/モードアイコン等（既定は矢印のみ）。" },
  { name: "onSwap", type: "() => void", description: "出発⇄到着 の入れ替えボタン（via 無しのとき）。" },
  { name: "inline", type: "boolean", default: "false", description: "結果行用の小さい1行レイアウト（発→着 時刻）。既定は目立つヘッダ。" },
  { name: "label", type: "ReactNode", description: "アクセシブル名。既定「<from> から <to>」。" },
];

export default function OriginDestinationDocPage() {
  const title = meta.originDestination.title ?? "OriginDestination";
  const description = meta.originDestination.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "RouteStops", href: "/docs/components/route-stops" },
        { name: "Itinerary", href: "/docs/components/itinerary" },
        { name: "LineChip", href: "/docs/components/line-chip" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <OriginDestinationDemo />
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
