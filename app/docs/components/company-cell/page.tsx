import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { CompanyCellDemo } from "@/components/demos/CompanyCellDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { CompanyCell } from "@gunjo/ui"

<CompanyCell name="協栄精密工業株式会社" secondary="製造業・愛知県" logo={<IconBuildingFactory2 />} />
<CompanyCell name="ものづくり補助金" secondary="設備投資・上限1,250万円" />  // → square initial tile`;

const propsData = [
  { name: "name", type: "ReactNode", description: "企業/組織/エンティティ名（○○製作所 / IT導入補助金）。" },
  { name: "secondary", type: "ReactNode", description: "副次行（業種/所在地/制度区分/法人番号）。" },
  { name: "logo", type: "ReactNode", description: "ロゴ（img/アイコン）。省略時は name から四角のイニシャルタイル。" },
  { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "サイズ。" },
  { name: "logoClassName", type: "string", description: "ロゴタイルの追加クラス（ブランド色など）。" },
];

export default function CompanyCellDocPage() {
  const title = meta.companyCell.title ?? "CompanyCell";
  const description = meta.companyCell.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "PersonCell", href: "/docs/components/person-cell" },
        { name: "MatchCard", href: "/docs/components/match-card" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <CompanyCellDemo />
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
