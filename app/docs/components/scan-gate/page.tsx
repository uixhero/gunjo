import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import inputsMetadata from "@design/inputs-metadata.json";

import { ScanGateDemo } from "@/components/demos/ScanGateDemo";

const meta = inputsMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { ScanGate, type ScanGateResult } from "@gunjo/ui"

// carton → item packing: scan a carton to open it, then scan items into it
<ScanGate
  stages={[
    {
      id: "carton",
      label: "① カートンをスキャン",
      onScan: (code): ScanGateResult => {
        const carton = openCarton(code)
        if (!carton) return { ok: false, message: "カートンが見つかりません", advance: "stay" }
        return { ok: true, message: \`\${code} を開きました\`, advance: "next", value: carton }
      },
    },
    {
      id: "item",
      label: "② 商品をスキャン",
      onScan: (code, ctx): ScanGateResult => {
        const carton = ctx.values.carton // confirmed in the previous stage
        const line = pack(code, carton)
        if (!line) return { ok: false, message: "受注に無い商品", advance: "stay" }
        return { ok: true, message: \`\${line.name} を梱包\`, advance: "stay" } // keep packing
      },
    },
  ]}
/>`;

const propsData = [
  {
    name: "stages",
    type: "ScanGateStage[]",
    description:
      "Ordered scan stages. Each has id / label / onScan(code, ctx) => ScanGateResult. The first stage is active initially.",
  },
  {
    name: "ScanGateResult.advance",
    type: '"next" | "stay" | "reset" | "done" | stageId',
    description:
      'Returned from onScan to control flow. "next" advances (wraps + clears on the last stage = one cycle, for cyclic flows like packing), "stay" remains, "reset" returns to the first stage and clears context, "done" completes a terminating flow (holds the stage, keeps context, fires onComplete — use on the last stage of a verify-then-act gate), a stage id jumps. Default ok ? "next" : "stay".',
  },
  {
    name: "ScanGateResult.value",
    type: "unknown",
    description: "Remember a confirmed value for the stage; later stages read it via ctx.values[stageId].",
  },
  {
    name: "onStageChange",
    type: "(stageId, ctx) => void",
    description: "Notified when the active stage changes.",
  },
  {
    name: "onComplete",
    type: "(ctx) => void",
    description: 'Fired when a stage returns advance:"done" — the terminating flow is complete; ctx holds the verified values.',
  },
  {
    name: "assertive",
    type: "boolean",
    description: 'Announce results assertively (role="alert" + aria-live="assertive") for safety-critical verify gates. Forwarded to ScanInput. Default false.',
  },
  {
    name: "showSteps",
    type: "boolean",
    description: "Show the numbered step indicator. Default true.",
  },
  {
    name: "autoFocus",
    type: "boolean",
    description: "Focus the active field on mount and on each advance (scan-gun loop). Default true.",
  },
  {
    name: "showFeed / feedLimit / lockMs",
    type: "boolean / number / number",
    description: "Forwarded to the active ScanInput (recent-scan feed, feed cap, double-fire debounce).",
  },
  {
    name: "ref",
    type: "ScanGateHandle",
    description: "Imperative handle: reset() (back to first stage + clear), goTo(stageId), getValues(). Use for a 'close carton' button.",
  },
];

export default function ScanGateDocPage() {
  const title = meta.scanGate.title ?? "ScanGate";
  const description = meta.scanGate.description ?? "";

  return (
    <ComponentLayout title={title} description={description}>
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <ScanGateDemo />
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
