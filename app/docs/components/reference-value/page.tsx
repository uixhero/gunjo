import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { ReferenceValueDemo } from "@/components/demos/ReferenceValueDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { ReferenceValue, flagValue } from "@gunjo/ui"

// value judged against a reference range → flag + tone + sr text
<ReferenceValue value={38.9} unit="℃" range={{ low: 36.0, high: 37.5, criticalHigh: 40.0 }} showRange />
<ReferenceValue value={88}  unit="%"  range={{ low: 96, criticalLow: 90 }} />   // → 88% LL (異常低値)

// the pure classifier, for colouring table cells / chart points without re-deriving
flagValue(6.8, { low: 3.5, high: 5.0, criticalHigh: 6.0 })   // → "critical-high"`;

const propsData = [
  {
    name: "value",
    type: "number",
    description: "The measured value.",
  },
  {
    name: "range",
    type: "{ low?, high?, criticalLow?, criticalHigh? }",
    description:
      "Reference range. Below low → L, above high → H, at/beyond criticalLow/criticalHigh → LL/HH. Critical bounds win.",
  },
  {
    name: "format",
    type: "(value: number) => ReactNode",
    description: "Format the value and the range bounds. Default String(value).",
  },
  {
    name: "unit",
    type: "string",
    description: 'Unit suffix (e.g. "℃", "mg", "mEq/L").',
  },
  {
    name: "labels",
    type: "Partial<Record<RangeFlag, string>>",
    description: "Localized flag labels (announced + shown when showLabel). Defaults to JA (高値/低値/異常…).",
  },
  {
    name: "showLabel / showRange",
    type: "boolean",
    description: "Show the flag label visibly / show the normal-range text (基準 36.0–37.5).",
  },
  {
    name: "hideFlag",
    type: "boolean",
    description: "Hide the flag chip (value stays toned + sr-only flag text kept). Default false.",
  },
  {
    name: "size",
    type: '"default" | "inline"',
    default: '"default"',
    description: "inline is compact for table cells.",
  },
  {
    name: "flagValue(value, range)",
    type: "() => RangeFlag",
    description:
      'Exported pure classifier → "normal" | "high" | "low" | "critical-high" | "critical-low". Use to colour table cells / chart points.',
  },
];

export default function ReferenceValueDocPage() {
  const title = meta.referenceValue.title ?? "ReferenceValue";
  const description = meta.referenceValue.description ?? "";

  return (
    <ComponentLayout title={title} description={description}>
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <ReferenceValueDemo />
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
