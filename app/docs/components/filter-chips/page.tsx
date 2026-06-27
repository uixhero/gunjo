import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { FilterChipsDemo } from "@/components/demos/FilterChipsDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { FilterChips, type FilterChip } from "@gunjo/ui"

const categories: FilterChip[] = [
  { value: "all", label: "すべて", count: 24 },
  { value: "gate", label: "搭乗口", count: 8 },
  { value: "lounge", label: "ラウンジ", count: 3 },
  // …
]

<FilterChips
  items={categories}
  value={category}
  onValueChange={setCategory}
  aria-label="施設カテゴリ"
/>`;

const propsData = [
  { name: "items", type: "FilterChip[]", description: "チップ。各 { value, label, icon?, count?, disabled? }。" },
  { name: "value", type: "string", description: "選択中の value（単一選択）。" },
  { name: "onValueChange", type: "(value: string) => void", description: "選択変更ハンドラ。" },
  { name: "aria-label", type: "string", default: '"絞り込み"', description: "チップ群のアクセシブル名。" },
];

export default function FilterChipsDocPage() {
  const title = meta.filterChips.title ?? "FilterChips";
  const description = meta.filterChips.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "ListCard", href: "/docs/components/list-card" },
        { name: "ToggleGroup", href: "/docs/components/toggle-group" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="md">
        <FilterChipsDemo />
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
