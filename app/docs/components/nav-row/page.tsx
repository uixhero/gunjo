import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { NavRowDemo } from "@/components/demos/NavRowDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { NavRow, SettingGroup, Switch } from "@gunjo/ui"

<SettingGroup label="お支払い">
  {/* Navigation row — opens a detail. aria-haspopup, NOT aria-pressed. */}
  <NavRow icon={<IconCreditCard />} label="お支払い方法" value="口座振替"
    opensDialog onSelect={() => open("payment")} />

  {/* Static control row — a Switch in trailing (no onSelect → not a button). */}
  <NavRow label="配達前プッシュ通知"
    trailing={<Switch checked={on} onCheckedChange={setOn} aria-label="配達前プッシュ通知" />} />
</SettingGroup>`;

const propsData = [
  { name: "label", type: "ReactNode", description: "主ラベル。" },
  { name: "icon", type: "ReactNode", description: "先頭アイコン。" },
  { name: "description", type: "ReactNode", description: "ラベル下の副次行。" },
  { name: "value", type: "ReactNode", description: "右寄せの現在値（お支払い方法→口座振替）。" },
  { name: "trailing", type: "ReactNode", description: "末尾アクセサリ。onSelect 時は既定で chevron。Switch/Badge を渡すと非ナビの操作行。null で抑制。" },
  { name: "opensDialog", type: "boolean", description: "行が詳細を その場で開く（aria-haspopup=\"dialog\"）。別画面遷移なら省略。" },
  { name: "onSelect", type: "() => void", description: "行全体をナビ/ディスクロージャーの button に（aria-pressed ではない＝トグルでなく遷移）。省略すると静的な操作行。" },
  { name: "SettingGroup.label", type: "ReactNode", description: "グループ見出し（コンテナ上に表示）。" },
  { name: "SettingGroup.children", type: "ReactNode", description: "NavRow 群＝丸角コンテナ内をハイラインで区切る。" },
];

export default function NavRowDocPage() {
  const title = meta.navRow.title ?? "NavRow";
  const description = meta.navRow.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "ListCard", href: "/docs/components/list-card" },
        { name: "Switch", href: "/docs/components/switch" },
        { name: "PageHeader", href: "/docs/components/page-header" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <NavRowDemo />
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
