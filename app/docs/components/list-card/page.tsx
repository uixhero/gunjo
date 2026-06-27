import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { ListCardDemo } from "@/components/demos/ListCardDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { ListCard, Badge } from "@gunjo/ui"

<ListCard
  leading={<span className="size-3 rounded-full bg-destructive" />}
  title="中央線快速"
  description="人身事故の影響"
  status={<Badge variant="destructive">運転見合わせ</Badge>}
  meta="7:42 更新"
  severity="critical"
  onSelect={() => openLine("chuo")}
/>

// 検索結果カードとしても:
<ListCard
  title="10:42 → 11:14"
  description="32分・乗換0回・34.1km"
  tags={<><Badge variant="info">最速</Badge><Badge variant="success">最安</Badge></>}
  meta="¥580"
  selected={selectedId === "r1"}
  onSelect={() => setSelectedId("r1")}
/>`;

const propsData = [
  { name: "title", type: "ReactNode", description: "主要行（必須）。" },
  { name: "leading", type: "ReactNode", description: "先頭のアクセサリ（アイコン / アバター / 路線色ドット / 順位 / 路線チップ）。" },
  { name: "description", type: "ReactNode", description: "タイトル下の副次行。" },
  { name: "tags", type: "ReactNode", description: "タイトル下に折り返すチップ列（最速 / 最安 / おすすめ など）。" },
  { name: "status", type: "ReactNode", description: "右寄せのステータス枠（アイコン付き Badge＝色のみに依存しない）。" },
  { name: "meta", type: "ReactNode", description: "右寄せの副次テキスト（価格 / 時刻 / 件数 / 更新時刻）。" },
  { name: "trailing", type: "ReactNode", description: "末尾のアクセサリ。onSelect 時は既定で chevron。null で抑制。" },
  { name: "severity", type: '"critical" | "warning" | "info" | "success" | "neutral"', description: "左のアクセントレール（任意）。" },
  { name: "selected", type: "boolean", description: "選択中の見た目（ring＋アクセント背景）。" },
  { name: "onSelect", type: "() => void", description: "カード全体を ≥44px の tappable ボタンに（任意・省略で表示専用）。" },
];

export default function ListCardDocPage() {
  const title = meta.listCard.title ?? "ListCard";
  const description = meta.listCard.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Badge", href: "/docs/components/badge" },
        { name: "ActionQueue", href: "/docs/components/action-queue" },
        { name: "StatGroup", href: "/docs/components/stat-group" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="md">
        <ListCardDemo />
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
