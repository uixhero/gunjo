import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { PageHeaderDemo } from "@/components/demos/PageHeaderDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { PageHeader, Button } from "@gunjo/ui"
import { IconRefresh } from "@tabler/icons-react"

<PageHeader
  title="手荷物追跡"
  subtitle="ヤマダ クロウ 様・ABC123"
  onBack={() => router.back()}     // ≥44px back button
  actions={
    <Button size="icon" variant="ghost" aria-label="更新">
      <IconRefresh className="size-5" />
    </Button>
  }
/>`;

const propsData = [
  { name: "title", type: "ReactNode", description: "ページタイトル。" },
  { name: "subtitle", type: "ReactNode", description: "タイトル下の副次行（任意）。" },
  { name: "onBack", type: "() => void", description: "戻るハンドラ。指定すると先頭に ≥44px の戻るボタンを描画。" },
  { name: "backLabel", type: "string", default: '"戻る"', description: "戻るボタンのアクセシブル名。" },
  { name: "leading", type: "ReactNode", description: "先頭スロットの差し替え（戻るボタンの代わり）。" },
  { name: "actions", type: "ReactNode", description: "末尾のアクション（閉じる/更新/メニュー 等）。" },
  { name: "sticky", type: "boolean", default: "true", description: "スクロールコンテナの上部に固定。" },
  { name: "align", type: '"left" | "center"', default: '"left"', description: "タイトル寄せ。center は iOS 風の中央タイトル。" },
];

export default function PageHeaderDocPage() {
  const title = meta.pageHeader.title ?? "PageHeader";
  const description = meta.pageHeader.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Button", href: "/docs/components/button" },
        { name: "Header", href: "/docs/components/header" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="md">
        <PageHeaderDemo />
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
