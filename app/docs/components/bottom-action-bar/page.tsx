import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { BottomActionBarDemo } from "@/components/demos/BottomActionBarDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { BottomActionBar, Button } from "@gunjo/ui"

<BottomActionBar actions={<Button size="lg" onClick={call}>この内容で呼ぶ</Button>}>
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground">見積もり料金</span>
    <span className="text-base font-semibold tabular-nums">¥1,200〜・到着 4分</span>
  </div>
</BottomActionBar>

// full-width CTA above the summary:
<BottomActionBar stack actions={<Button size="lg">支払う</Button>}>…</BottomActionBar>`;

const propsData = [
  { name: "children", type: "ReactNode", description: "左の走行サマリ（合計金額/到着まで○分/件数）。残り幅を取る。" },
  { name: "actions", type: "ReactNode", description: "右寄せのアクション（主要CTA＋任意の副次）。各 ≥44px。" },
  { name: "stack", type: "boolean", default: "false", description: "CTA をサマリの上に全幅で積む（横並びでなく縦）。" },
  { name: "sticky", type: "boolean", default: "true", description: "スクロールコンテナの下部に固定。" },
  { name: "maxWidth", type: '"sm" | "md" | "lg" | "xl"', description: "タブレット/デスクトップで中央寄せ＋幅上限。" },
];

export default function BottomActionBarDocPage() {
  const title = meta.bottomActionBar.title ?? "BottomActionBar";
  const description = meta.bottomActionBar.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "PageHeader", href: "/docs/components/page-header" },
        { name: "Button", href: "/docs/components/button" },
        { name: "AmountBreakdown", href: "/docs/components/amount-breakdown" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="md">
        <BottomActionBarDemo />
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
