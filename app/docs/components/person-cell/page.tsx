import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { PersonCellDemo } from "@/components/demos/PersonCellDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { PersonCell, Badge } from "@gunjo/ui"

<PersonCell
  name="佐藤 美咲"
  secondary="プロダクト本部 / シニアUXデザイナー"
  tertiary="正社員・東京本社"
  avatar={{ src: "/avatars/sato.jpg" }}   // omit → 氏名から頭文字フォールバック
  presence="online"
  trailing={<Badge variant="success">在籍</Badge>}
/>

// テーブル行など、行自体が onRowClick で活性なら PersonCell は素のまま置く
<DataTable
  columns={[{ accessorKey: "name", header: "氏名",
    cell: ({ row }) => <PersonCell name={row.original.name} secondary={row.original.role} /> }]}
  onRowClick={open}
/>`;

const propsData = [
  { name: "name", type: "ReactNode", description: "主行（氏名）。文字列なら頭文字フォールバックを自動導出（日本語の姓に対応）。" },
  { name: "secondary", type: "ReactNode", description: "副行（役職 / 部署 / メール）。" },
  { name: "tertiary", type: "ReactNode", description: "3行目（雇用形態 / 勤務地 など）。" },
  { name: "avatar", type: "{ src?, alt?, fallback? }", description: "画像＋フォールバック。src 無しなら fallback か氏名頭文字を表示。" },
  { name: "presence", type: '"online" | "offline" | "away" | "busy" | …', description: "在席ドット（Avatar に委譲）。presenceLabel で読み上げ名。" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "アバター＋テキストのスケール。" },
  { name: "trailing", type: "ReactNode", description: "末尾スロット（ステータスバッジ / シェブロン / 件数 / アクション）。" },
  { name: "avatarClassName", type: "string", description: "アバターの追加クラス（名前由来の背景色など）。" },
];

export default function PersonCellDocPage() {
  const title = meta.personCell.title ?? "PersonCell";
  const description = meta.personCell.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Avatar", href: "/docs/components/avatar" },
        { name: "Badge", href: "/docs/components/badge" },
        { name: "DataTable", href: "/docs/components/data-table" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <PersonCellDemo />
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
