import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { SectionListDemo } from "@/components/demos/SectionListDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { SectionList, ListCard, type SectionListSection } from "@gunjo/ui"

// The caller owns the groupBy + subtotal math; SectionList owns the header/footer chrome.
const sections: SectionListSection[] = groups.map((g) => ({
  key: g.key,
  title: g.title,                 // 2026年6月末締め
  sublabel: \`\${g.rows.length}社\`,
  meta: \`小計 ¥\${subtotal(g).toLocaleString()}\`,   // right-aligned group aggregate
  content: g.rows.map((r) => <ListCard key={r.id} title={r.title} status={yen(r.amount)} />),
  footer: <><span>締め小計</span><span>¥{subtotal(g).toLocaleString()}</span></>,
}))

<SectionList sections={sections} label="締め別 請求一覧" />`;

const propsData = [
  { name: "sections", type: "SectionListSection[]", description: "事前グループ化したセクション（groupBy は呼び出し側）。各＝見出し帯＋本文＋任意の小計フッター。" },
  { name: "stickyHeaders", type: "boolean", default: "false", description: "スクロール中セクション見出しを上部に固定。" },
  { name: "label", type: "ReactNode", description: "グループ全体のアクセシブル名。" },
  { name: "SectionListSection.key", type: "string | number", description: "セクションの安定キー。" },
  { name: "SectionListSection.title / sublabel", type: "ReactNode", description: "グループ見出し（荷主/締め/月）＋副次。" },
  { name: "SectionListSection.meta", type: "ReactNode", description: "見出し右寄せのグループ集計（小計¥…/N件）。" },
  { name: "SectionListSection.content", type: "ReactNode", description: "セクション本文＝呼び出し側の行（ListCard／Table／台帳行）。" },
  { name: "SectionListSection.footer", type: "ReactNode", description: "グループごとの小計フッター帯（任意）。" },
];

export default function SectionListDocPage() {
  const title = meta.sectionList.title ?? "SectionList";
  const description = meta.sectionList.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "ListCard", href: "/docs/components/list-card" },
        { name: "AmountBreakdown", href: "/docs/components/amount-breakdown" },
        { name: "Table", href: "/docs/components/table" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <SectionListDemo />
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
