import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { DocumentRowDemo } from "@/components/demos/DocumentRowDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { DocumentRow, Checkbox, Button } from "@gunjo/ui"
import { IconFileTypePdf, IconDownload } from "@tabler/icons-react"

<DocumentRow
  icon={<IconFileTypePdf />}
  title="2026年6月分 給与明細"
  meta="PDF・124KB・発行日 2026/06/25"
  control={<Checkbox checked={sel} onCheckedChange={toggle} aria-label="選択" />}
  actions={<Button variant="ghost" size="icon" aria-label="ダウンロード"><IconDownload /></Button>}
/>

// 3 independent hit targets: checkbox / open-to-preview (onOpen) / download — what ListCard can't do.`;

const propsData = [
  { name: "title", type: "ReactNode", description: "書類名（2026年6月分 給与明細）。" },
  { name: "description", type: "ReactNode", description: "タイトル下の副次行。" },
  { name: "meta", type: "ReactNode", description: "形式/サイズ/日付（PDF・124KB・発行日 2026/06/25）。" },
  { name: "icon", type: "ReactNode", description: "ファイル種別アイコン（色付きタイル内）。" },
  { name: "control", type: "ReactNode", description: "先頭の独立した操作対象＝一括選択の Checkbox。" },
  { name: "status", type: "ReactNode", description: "状態ピル（新着/発行済）。" },
  { name: "actions", type: "ReactNode", description: "末尾の独立したアクションボタン＝ダウンロード（onOpen と別）。" },
  { name: "onOpen", type: "() => void", description: "ファイル本体（アイコン＋名前＋meta）をプレビュー button に（actions と独立）。" },
];

export default function DocumentRowDocPage() {
  const title = meta.documentRow.title ?? "DocumentRow";
  const description = meta.documentRow.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "SectionList", href: "/docs/components/section-list" },
        { name: "ListCard", href: "/docs/components/list-card" },
        { name: "NavRow", href: "/docs/components/nav-row" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <DocumentRowDemo />
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
