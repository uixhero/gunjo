import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { DeltaDemo } from "@/components/demos/DeltaDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { Delta, formatCurrency } from "@gunjo/ui"

const yen = (v: number) => formatCurrency(v, { signed: true })

export function Example() {
  return (
    <>
      {/* Gain/loss — default tones (positive = success, negative = destructive) */}
      <Delta value={12500} format={yen} labels={{ positive: "増加", negative: "減少" }} />

      {/* Cash over/short — positive isn't "good", so remap the tones */}
      <Delta
        value={-930}
        format={yen}
        tones={{ positive: "warning", negative: "destructive", zero: "success" }}
        labels={{ positive: "過剰", negative: "不足", zero: "一致" }}
        showLabel
      />
    </>
  )
}`;

const propsData = [
  {
    name: "value",
    type: "number",
    description: "The signed change. Its sign drives the arrow, tone and label.",
  },
  {
    name: "format",
    type: "(value: number) => React.ReactNode",
    description:
      "Format the numeric value. Default: signed, grouped ja-JP (+1,000 / −930). Pass formatCurrency for ¥.",
  },
  {
    name: "tones",
    type: "Partial<Record<DeltaSign, DeltaTone>>",
    description:
      "Tone per sign. Default { positive: \"success\", negative: \"destructive\", zero: \"muted\" }. Override where positive isn't \"good\" (cash over/short).",
  },
  {
    name: "labels",
    type: "Partial<Record<DeltaSign, React.ReactNode>>",
    description:
      "Accessible (and optionally visible) label per sign, e.g. { positive: \"過剰\", negative: \"不足\", zero: \"一致\" }. Always announced — meaning never rides on colour alone.",
  },
  {
    name: "showLabel",
    type: "boolean",
    description: "Render the sign label visibly after the value. Default false (screen-reader-only).",
  },
  {
    name: "hideArrow",
    type: "boolean",
    description: "Hide the directional arrow. Default false.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS class names.",
  },
];

export default function DeltaDocPage() {
  const title = meta.delta.title ?? "Delta";
  const description = meta.delta.description ?? "";

  return (
    <ComponentLayout title={title} description={description}>
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <DeltaDemo />
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
