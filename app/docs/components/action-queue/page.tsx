import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { ActionQueueDemo } from "@/components/demos/ActionQueueDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { ActionQueue, Button } from "@gunjo/ui"

<ActionQueue
  items={[
    { severity: "critical", kind: "失効リスク", title: "田所さま — 終身保険が今月末で失効",
      detail: "失効防止コールを本日中に。", meta: "本日",
      actions: <Button size="sm">対応</Button> },
    { severity: "warning", kind: "更新", title: "三宅さま — 更新期限", meta: "あと7日" },
    { severity: "info", kind: "誕生日", title: "宇佐美さま — お誕生日", meta: "明日" },
  ]}
/>`;

const propsData = [
  { name: "items", type: "ActionItem[]", description: "対応項目の配列。" },
  { name: "ActionItem.severity", type: '"critical" | "warning" | "info" | "neutral"', default: '"neutral"', description: "重大度。アイコン＋トーン＋（ソート時の）並び順を決める。色だけに依存しない（アイコン形＋sr-only ラベル）。" },
  { name: "ActionItem.kind", type: "ReactNode", description: "種別チップ（失効リスク / 更新 / 満期 / 遅延拡大 …）。" },
  { name: "ActionItem.title", type: "ReactNode", description: "見出し（何を・誰/どこに対して）。" },
  { name: "ActionItem.detail", type: "ReactNode", description: "補足行（推奨アクション・文脈）。" },
  { name: "ActionItem.meta", type: "ReactNode", description: "右寄せの副次テキスト（期日 / 時刻 / 件数）。" },
  { name: "ActionItem.actions", type: "ReactNode", description: "末尾のアクションボタン（行ボタンに入れ子にせず兄弟として描画）。" },
  { name: "ActionItem.onSelect", type: "() => void", description: "行の本文を活性化（詳細を開く）。任意——省略すると行は表示専用。" },
  { name: "sortBySeverity", type: "boolean", default: "true", description: "描画前に重大度（critical → neutral）でソート。" },
  { name: "emptyLabel", type: "ReactNode", default: '"対応が必要な項目はありません"', description: "項目が無いときの破線プレースホルダ。" },
];

export default function ActionQueueDocPage() {
  const title = meta.actionQueue.title ?? "ActionQueue";
  const description = meta.actionQueue.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "StatGroup", href: "/docs/components/stat-group" },
        { name: "Alert", href: "/docs/components/alert" },
        { name: "Button", href: "/docs/components/button" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="lg">
        <ActionQueueDemo />
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
