import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import inputsMetadata from "@design/inputs-metadata.json";

import { SegmentedControlDemo } from "@/components/demos/SegmentedControlDemo";

const meta = inputsMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { SegmentedControl } from "@gunjo/ui"

const [passenger, setPassenger] = React.useState("adult")

<SegmentedControl
  aria-label="旅客区分"
  value={passenger}
  onValueChange={setPassenger}     // always a single string
  options={[
    { value: "adult", label: "大人" },
    { value: "child", label: "小児" },
    { value: "disabled", label: "障がい者" },
  ]}
/>`;

const propsData = [
  { name: "options", type: "SegmentedControlOption[]", description: "セグメント（2〜4が適量）。各 { value, label, icon?, disabled? }。" },
  { name: "value", type: "string", description: "制御された選択値。" },
  { name: "defaultValue", type: "string", description: "非制御の初期値。" },
  { name: "onValueChange", type: "(value: string) => void", description: "選択値で発火＝常に単一の string（配列にならない）。" },
  { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "セグメント高さ（default=h-9 / lg=h-11≥44px タッチ）。" },
  { name: "fullWidth", type: "boolean", default: "true", description: "等幅セグメントで横幅いっぱい（セグメント表示）。" },
  { name: "disabled", type: "boolean", default: "false", description: "コントロール全体を無効化。" },
  { name: "aria-label", type: "string", description: "グループのアクセシブル名。" },
  { name: "SegmentedControlOption.value / label", type: "string / ReactNode", description: "選択時の値・セグメントのラベル。" },
  { name: "SegmentedControlOption.icon / disabled", type: "ReactNode / boolean", description: "先頭アイコン・この1セグメントのみ無効化。" },
];

export default function SegmentedControlDocPage() {
  const title = meta.segmentedControl.title ?? "SegmentedControl";
  const description = meta.segmentedControl.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "ToggleGroup", href: "/docs/components/toggle-group" },
        { name: "RadioCard", href: "/docs/components/radio-card" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <SegmentedControlDemo />
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
