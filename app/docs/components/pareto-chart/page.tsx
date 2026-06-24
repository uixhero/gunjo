import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { ParetoChartDemo } from "@/components/demos/ParetoChartDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { ParetoChart } from "@gunjo/ui"

// descending bars + cumulative-% line + 80% "vital few" threshold
<ParetoChart
  label="停止時間（分）"
  cumulativeLabel="累計"
  threshold={80}
  formatValue={(v) => \`\${v}分\`}
  showValues
  data={[
    { label: "チョコ停", value: 142 },
    { label: "段取替え", value: 96 },
    { label: "故障", value: 64, color: "destructive" },
    { label: "材料待ち", value: 38 },
    { label: "品質調整", value: 22 },
    { label: "その他", value: 11, color: "muted" },
  ]}
/>`;

const propsData = [
  {
    name: "data",
    type: "{ label?: ReactNode; value: number; color?: ChartColor }[]",
    description: "Categories with their count / minutes / cost. Sorted descending by default.",
  },
  {
    name: "threshold",
    type: "number | null",
    default: "80",
    description: "Cumulative-axis reference line in percent — the Pareto 'vital few' cutoff. null hides it.",
  },
  {
    name: "thresholdLabel",
    type: "ReactNode",
    description: "Label for the threshold line. Defaults to \"<threshold>%\".",
  },
  {
    name: "sort",
    type: "boolean",
    default: "true",
    description: "Sort the data descending by value before plotting (the Pareto convention). false keeps the given order.",
  },
  {
    name: "formatValue",
    type: "(value: number) => ReactNode",
    description: "Format the bar values (counts / minutes).",
  },
  {
    name: "formatPercent",
    type: "(percent: number) => ReactNode",
    default: "n%",
    description: "Format the cumulative percentage.",
  },
  {
    name: "showValues",
    type: "boolean",
    default: "false",
    description: "Render the value above each bar.",
  },
  {
    name: "showLegend",
    type: "boolean",
    default: "true",
    description: "Show the bars / cumulative / threshold legend.",
  },
  {
    name: "cumulativeLabel",
    type: "ReactNode",
    default: '"Cumulative"',
    description: "Legend / tooltip label for the cumulative line.",
  },
  {
    name: "label",
    type: "ReactNode",
    description: "Accessible name for the chart (also the bars' legend label).",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS class names.",
  },
];

export default function ParetoChartDocPage() {
  const title = meta.paretoChart.title ?? "ParetoChart";
  const description = meta.paretoChart.description ?? "";

  return (
    <ComponentLayout title={title} description={description}>
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <ParetoChartDemo />
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
