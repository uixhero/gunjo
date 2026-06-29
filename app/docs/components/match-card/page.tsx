import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { MatchCardDemo } from "@/components/demos/MatchCardDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { MatchCard, CompanyCell, type MatchFactor } from "@gunjo/ui"

// Entity-agnostic — the two sides can be DIFFERENT kinds (a company × a subsidy program).
<MatchCard
  left={<CompanyCell name="協栄精密工業" secondary="製造業・愛知" />}
  right={<CompanyCell name="ものづくり補助金" secondary="設備投資・上限1,250万円" />}
  score={<span className="text-lg font-bold">92%</span>}
  factors={[
    { label: "対象事業者", value: "◎", tone: "success" },
    { label: "設備投資要件", value: "△", tone: "warning", detail: "見積追加が必要" },
  ]}
  actions={<Button variant="primary" size="sm">申請を準備する</Button>}
/>`;

const propsData = [
  { name: "left / right", type: "ReactNode", description: "左右のエンティティ（CompanyCell/PersonCell/任意）。人前提でない＝異なる種類でも可（会社と制度）。" },
  { name: "score", type: "ReactNode", description: "中央の適合度/コネクタ（数値・Meter・Badge）。既定は ⟷。" },
  { name: "factors", type: "MatchFactor[]", description: "要件/評価項目ごとの適合（{ label, value, tone?, detail? }）。" },
  { name: "factorsLabel", type: "ReactNode", default: '"適合の内訳"', description: "内訳の見出し。" },
  { name: "actions", type: "ReactNode", description: "末尾アクション（打診/申請/NDA）。" },
  { name: "label", type: "ReactNode", description: "アクセシブル名。" },
  { name: "MatchFactor.label / value", type: "ReactNode", description: "評価項目名・判定（◎○△×/Meter/テキスト）。" },
  { name: "MatchFactor.tone", type: '"default" | "success" | "warning" | "destructive" | "muted"', default: '"default"', description: "判定チップのトーン。" },
  { name: "MatchFactor.detail", type: "ReactNode", description: "行下の詳細（自社 vs 制度 の値）。" },
];

export default function MatchCardDocPage() {
  const title = meta.matchCard.title ?? "MatchCard";
  const description = meta.matchCard.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "CompanyCell", href: "/docs/components/company-cell" },
        { name: "Leaderboard", href: "/docs/components/leaderboard" },
        { name: "Meter", href: "/docs/components/meter" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <MatchCardDemo />
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
