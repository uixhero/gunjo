import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { RelationshipRowDemo } from "@/components/demos/RelationshipRowDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { RelationshipRow, Badge } from "@gunjo/ui"

// 利用者 ⟷ 担当ケアマネ — each side is a full PersonCell
<RelationshipRow
  from={{ name: "渡辺 文雄", secondary: "利用者・要介護3", avatar: { fallback: "渡" } }}
  relationshipLabel="担当"
  to={{ name: "田渕 美和子", secondary: "介護支援専門員" }}
  trailing={<Badge variant="success">交付済</Badge>}
/>`;

const propsData = [
  { name: "from", type: "PersonCellProps", description: "左の人物（PersonCell の全プロップ: name/secondary/tertiary/avatar/presence/trailing…）。" },
  { name: "to", type: "PersonCellProps", description: "右の人物（同上）。" },
  { name: "relationshipLabel", type: "ReactNode", description: "コネクタ下の小ラベル＝関係の種類（担当 / 上司 / 訪問 など）。" },
  { name: "connector", type: "ReactNode", default: "⟷", description: "2人の間のグリフ／要素。既定は双方向矢印。" },
  { name: "trailing", type: "ReactNode", description: "末尾スロット（ステータスバッジ / シェブロン / アクション）。" },
  { name: "size", type: '"sm" | "md" | "lg"', description: "両 PersonCell に伝播（from/to が各自 size で上書き可）。" },
];

export default function RelationshipRowDocPage() {
  const title = meta.relationshipRow.title ?? "RelationshipRow";
  const description = meta.relationshipRow.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "PersonCell", href: "/docs/components/person-cell" },
        { name: "Badge", href: "/docs/components/badge" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <RelationshipRowDemo />
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
