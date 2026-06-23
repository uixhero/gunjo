import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import inputsMetadata from "@design/inputs-metadata.json";

import { ScanInputDemo } from "@/components/demos/ScanInputDemo";

const meta = inputsMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { ScanInput, type ScanResult } from "@gunjo/ui"

export function Example() {
  function handleScan(code: string): ScanResult {
    const line = lines.find((l) => l.jan === code)
    if (!line) return { ok: false, message: \`発注に無い商品です（\${code}）\` }
    increment(line) // your state update
    return { ok: true, message: \`\${line.name} を1点 検品\` }
  }

  return (
    <ScanInput
      label="バーコード / JAN をスキャン"
      placeholder="コードを入力して Enter"
      inputMode="numeric"
      onScan={handleScan}
      showFeed
    />
  )
}`;

const propsData = [
  {
    name: "onScan",
    type: "(code: string) => ScanResult | void",
    description:
      "Fires when a code is committed (scan gun types then Enter, or manual Enter). Return { ok, message } to drive the announcement, tone and feed.",
  },
  {
    name: "label",
    type: "ReactNode",
    description: "Accessible label rendered above the field.",
  },
  {
    name: "description",
    type: "ReactNode",
    description: "Helper text rendered under the field.",
  },
  {
    name: "retainFocus",
    type: "boolean",
    description: "Re-focus the field after each scan so a scan gun fires continuously. Default true.",
  },
  {
    name: "clearOnScan",
    type: "boolean",
    description: "Clear the field after each scan. Default true.",
  },
  {
    name: "lockMs",
    type: "number",
    description: "Ignore repeat commits within this many ms (scan guns can double-fire). Default 150.",
  },
  {
    name: "showFeed",
    type: "boolean",
    description: "Render a running feed of recent scans (newest first). Default false.",
  },
  {
    name: "feedLimit",
    type: "number",
    description: "Max feed entries retained. Default 8.",
  },
  {
    name: "icon",
    type: "ReactNode",
    description: "Leading adornment. Defaults to a barcode icon; pass null to hide.",
  },
  {
    name: "assertive",
    type: "boolean",
    description:
      'Announce results assertively (role="alert" + aria-live="assertive") instead of politely — for safety-critical scanning where a mismatch must interrupt. Default false.',
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS class names on the field wrapper.",
  },
];

export default function ScanInputDocPage() {
  const title = meta.scanInput.title ?? "ScanInput";
  const description = meta.scanInput.description ?? "";

  return (
    <ComponentLayout title={title} description={description}>
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <ScanInputDemo />
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
