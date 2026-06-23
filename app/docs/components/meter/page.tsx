import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { MeterDemo } from "@/components/demos/MeterDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { Meter } from "@gunjo/ui"

// tone is derived from thresholds; incoming previews a pending change
<Meter
  label="重量積載率"
  value={2100}
  max={3000}
  incoming={350}              // striped overlay: "after I add this shipment"
  unit="kg"
  thresholds={{ warning: 0.8, over: 1 }}
/>

// compact size for a table cell
<Meter size="inline" value={41} max={40} label="棚 D-03 充填" />`;

const propsData = [
  {
    name: "value",
    type: "number",
    description: "Current measured value.",
  },
  {
    name: "max",
    type: "number",
    default: "100",
    description: "Upper bound of the range.",
  },
  {
    name: "incoming",
    type: "number",
    description:
      "Extra amount layered on top of value as a striped overlay — preview the result of a pending change. Also drives the tone, so an overflow is flagged before it's committed.",
  },
  {
    name: "thresholds",
    type: "{ warning?: number; over?: number }",
    default: "{ warning: 0.8, over: 1 }",
    description: "Fractions of max that flip the auto tone (near-full → warning, over → destructive).",
  },
  {
    name: "tone",
    type: '"success" | "warning" | "destructive" | "info" | "primary" | "muted"',
    description: "Force the fill tone instead of deriving it from thresholds.",
  },
  {
    name: "label",
    type: "ReactNode",
    description: "Accessible name — a meter needs one.",
  },
  {
    name: "valueText / unit",
    type: "string",
    description: "Override the announced value text, or set a unit suffix (kg / m³) for the default readout.",
  },
  {
    name: "size",
    type: '"default" | "sm" | "inline"',
    default: '"default"',
    description: "inline is a thin bar + compact % for table cells.",
  },
  {
    name: "showValue",
    type: "boolean",
    default: "true",
    description: "Show the numeric readout.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS class names.",
  },
];

export default function MeterDocPage() {
  const title = meta.meter.title ?? "Meter";
  const description = meta.meter.description ?? "";

  return (
    <ComponentLayout title={title} description={description}>
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <MeterDemo />
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
