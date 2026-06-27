import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { TicketStubDemo } from "@/components/demos/TicketStubDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { TicketStub, Badge } from "@gunjo/ui"

<TicketStub value="CPN-NEWDAYS-3X-887412" codeLabel="887412">
  <div className="flex items-center justify-between">
    <span className="font-semibold">NewDays ポイント3倍</span>
    <Badge variant="warning">期間限定</Badge>
  </div>
  <p className="mt-1 text-xs text-muted-foreground">対象：駅ナカ NewDays 全店・〜2026/06/30</p>
</TicketStub>

// 搭乗券（QR）:
<TicketStub value="NH106-X7K2QM-18K" format="qr" codeLabel="X7K2QM">
  {/* OD-pair + 座席/搭乗口 … */}
</TicketStub>`;

const propsData = [
  { name: "value", type: "string", description: "エンコードする値（会員番号 / 予約番号 / クーポンコード）＝コードの内容（読み上げ名にも入る）。" },
  { name: "format", type: '"code128" | "qr"', default: '"code128"', description: "コード形式。code128 = 1次元バーコード、qr = QR マトリクス。" },
  { name: "codeLabel", type: "ReactNode", description: "コード下の可読ラベル。既定は value。" },
  { name: "codeAlt", type: "string", description: "コード画像のアクセシブル名。既定は value から生成。" },
  { name: "children", type: "ReactNode", description: "ミシン目の上の内容（便のOD/座席・クーポン詳細・会員情報）。" },
  { name: "perforation", type: "boolean", default: "true", description: "ミシン目（ノッチ＋破線）の表示。" },
  { name: "code", type: "ReactNode", description: "組み込みの視覚コードを実スキャン可能なバーコード（ライブラリ出力）で差し替え。" },
];

export default function TicketStubDocPage() {
  const title = meta.ticketStub.title ?? "TicketStub";
  const description = meta.ticketStub.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Badge", href: "/docs/components/badge" },
        { name: "ScanInput", href: "/docs/components/scan-input" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="md">
        <TicketStubDemo />
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
