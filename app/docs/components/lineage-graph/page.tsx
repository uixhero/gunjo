import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { LineageGraphDemo } from "@/components/demos/LineageGraphDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { LineageGraph, type LineageNode, type LineageEdge } from "@gunjo/ui"

const nodes: LineageNode[] = [
  { id: "m1", label: "原料ロット RM-01", tone: "info" },
  { id: "m2", label: "原料ロット RM-02", tone: "info" },
  { id: "p1", label: "製品ロット PL-2405", tone: "primary" },
  { id: "s2", label: "出荷 SH-102", tone: "destructive" },
]
const edges: LineageEdge[] = [
  { from: "m1", to: "p1" },
  { from: "m2", to: "p1" },   // multi-parent (fan-in)
  { from: "p1", to: "s2" },   // multi-child (fan-out)
]

<LineageGraph nodes={nodes} edges={edges} onSelectNode={(n) => inspect(n)} />`;

const propsData = [
  { name: "nodes", type: "LineageNode[]", description: "{ id, label, sublabel?, tone?, ariaLabel? }." },
  { name: "edges", type: "LineageEdge[]", description: "{ from, to } directed edges (a DAG; from is upstream). Multi-parent / multi-child are supported and drawn as cross-links." },
  { name: "direction", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Flow axis: left→right or top→bottom." },
  { name: "renderNode", type: "(node) => ReactNode", description: "Render a node's body (default: label + sublabel)." },
  { name: "onSelectNode", type: "(node) => void", description: "When set, nodes are activatable buttons." },
  { name: "nodeWidth / nodeHeight", type: "number", default: "160 / 56", description: "Node box size." },
  { name: "layerGap / rowGap", type: "number", default: "64 / 16", description: "Gap between layers (depth) / between nodes in a layer." },
  { name: "label", type: "ReactNode", description: "Accessible name for the graph." },
];

export default function LineageGraphDocPage() {
  const title = meta.lineageGraph.title ?? "LineageGraph";
  const description = meta.lineageGraph.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Badge", href: "/docs/components/badge" },
        { name: "TreeView", href: "/docs/components/tree-view" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="xl">
        <LineageGraphDemo />
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
