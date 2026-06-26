import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { StatGroupDemo } from "@/components/demos/StatGroupDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { StatGroup } from "@gunjo/ui"

<StatGroup
  cols={{ base: 2, md: 3, lg: 5 }}
  items={[
    { label: "請求対象者", value: "6名", hint: "未確定 3件" },
    { label: "請求総額", value: "¥1,224,520" },
    { label: "限度額超過者", value: "1名", tone: "negative" },
    { label: "提出期限", value: "6/10", change: "あと4日", trend: "down" },
  ]}
/>`;

const propsData = [
  { name: "items", type: "StatisticProps[]", description: "各指標。Statistic の全プロップ（label/value/change/trend/tone/hint）。" },
  { name: "cols", type: "1–6 | { base?, sm?, md?, lg?, xl? }", default: "{ base: 2, md: 4 }", description: "列数（固定 or レスポンシブ）。" },
  { name: "card", type: "boolean", default: "true", description: "各 Statistic を Card で囲む（back-office のサマリ行）。" },
];

export default function StatGroupDocPage() {
  const title = meta.statGroup.title ?? "StatGroup";
  const description = meta.statGroup.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Statistic", href: "/docs/components/statistic" },
        { name: "Card", href: "/docs/components/card" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="xl">
        <StatGroupDemo />
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
