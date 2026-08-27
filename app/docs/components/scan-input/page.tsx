import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import inputsMetadata from "@design/inputs-metadata.json";

import { ScanInputDemo } from "@/components/demos/ScanInputDemo";

const meta = inputsMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import * as React from "react";
import { ScanInput, type ScanResult } from "@gunjo/ui";

const ORDER_LINES = [
  { jan: "4901234567894", name: "アスコルビン酸 500mg" },
  { jan: "4901234567900", name: "コットンパッド 80枚" },
];

export function ReceivingScanField() {
  const [counts, setCounts] = React.useState<Record<string, number>>({});

  function handleScan(code: string): ScanResult {
    const line = ORDER_LINES.find((l) => l.jan === code);
    if (!line) {
      return { ok: false, message: "発注に無い商品です（" + code + "）" };
    }
    setCounts((prev) => ({ ...prev, [line.jan]: (prev[line.jan] ?? 0) + 1 }));
    return { ok: true, message: line.name + " を1点 検品" };
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <ScanInput
        label="バーコード / JAN をスキャン"
        placeholder="コードを入力して Enter"
        inputMode="numeric"
        onScan={handleScan}
        showFeed
      />
      <p className="text-sm text-muted-foreground">
        検品済み: {Object.values(counts).reduce((a, b) => a + b, 0)} 点
      </p>
    </div>
  );
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
    name: "onScannerOpen",
    type: "(action: ScanInputAction) => void",
    description: "Turns the leading barcode icon into a scan action. Open a scanner UI and call action.commit(code) to commit the read.",
  },
  {
    name: "scannerLabel",
    type: "string",
    description: "Accessible label and tooltip for the barcode scan action.",
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
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Tooltip", href: "/docs/components/tooltip" },
        { name: "TooltipContent", href: "/docs/components/tooltip" },
        { name: "TooltipTrigger", href: "/docs/components/tooltip" },
      ]}
      relatedComponents={[
        { name: "ScanGate", href: "/docs/components/scan-gate" },
        { name: "Input", href: "/docs/components/input" },
        { name: "SearchInput", href: "/docs/components/search-input" },
        { name: "ActionQueue", href: "/docs/components/action-queue" },
      ]}
    >
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
