import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { CheckListDemo } from "@/components/demos/CheckListDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { CheckList, Badge, type CheckListItem } from "@gunjo/ui"

const items: CheckListItem[] = [
  {
    id: "id",
    label: "本人確認書類（運転免許証等）",
    checked: true,
    trailing: <Badge variant="success" icon={<IconCheck />}>確認済</Badge>,
  },
  {
    id: "former",
    label: "転出証明書",
    description: "前住所地の市区町村が発行",
    checked: false,
    trailing: <Badge variant="warning">未確認</Badge>,
  },
  // a row with no \`checked\` renders as a plain display row (no checkbox)
  { id: "note", label: "備考", description: "世帯主のみ来庁" },
]

<CheckList items={items} onCheckedChange={(id, checked) => toggle(id, checked)} />`;

const propsData = [
  {
    name: "items",
    type: "CheckListItem[]",
    description: "Rows: { id, label, description?, trailing?, checked?, disabled? }. Omit checked for a non-checkable display row.",
  },
  {
    name: "onCheckedChange",
    type: "(id: string, checked: boolean) => void",
    description: "Called when a row's checkbox toggles.",
  },
  {
    name: "CheckListItem.trailing",
    type: "ReactNode",
    description: "Right-aligned content (status Badge, action, amount) — outside the toggle so clicking it doesn't flip the checkbox.",
  },
  {
    name: "CheckListItem.checked",
    type: "boolean",
    description: "Controlled checked state. Omit → a plain display row (label/description + trailing, no checkbox).",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS class names on the <ul>.",
  },
];

export default function CheckListDocPage() {
  const title = meta.checkList.title ?? "CheckList";
  const description = meta.checkList.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Checkbox", href: "/docs/components/checkbox" },
        { name: "Badge", href: "/docs/components/badge" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <CheckListDemo />
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
