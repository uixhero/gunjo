import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { RadioCardDemo } from "@/components/demos/RadioCardDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { RadioCardGroup, RadioCard, Badge, formatCurrency } from "@gunjo/ui"

<RadioCardGroup value={value} onValueChange={setValue} aria-label="おトクなきっぷ">
  <RadioCard
    value="holiday"
    title="休日おでかけパス"
    description="首都圏フリーエリア・土休日限定"
    tags={<Badge variant="success">観光向け</Badge>}
    price={formatCurrency(2720)}
    highlight="約1,000円分おトク"
  />
  <RadioCard value="metro24" title="東京メトロ 24時間券"
    description="東京メトロ全線 24時間" price={formatCurrency(600)} highlight="4回乗ればモト" />
</RadioCardGroup>`;

const propsData = [
  { name: "RadioCardGroup.value", type: "string", description: "選択中の value（controlled）。" },
  { name: "RadioCardGroup.defaultValue", type: "string", description: "非制御の初期値。" },
  { name: "RadioCardGroup.onValueChange", type: "(value: string) => void", description: "選択変更ハンドラ。" },
  { name: "RadioCardGroup.name", type: "string", description: "フォーム送信名（各 RadioCard が隠し input を出す）。" },
  { name: "RadioCard.value", type: "string", description: "このカードが選択する値（必須）。" },
  { name: "RadioCard.title", type: "ReactNode", description: "主要行（商品名/プラン名）。" },
  { name: "RadioCard.description", type: "ReactNode", description: "副次行（エリア・期間・条件）。" },
  { name: "RadioCard.tags", type: "ReactNode", description: "タイトル上のチップ列（人気/期間限定/おすすめ）。" },
  { name: "RadioCard.price", type: "ReactNode", description: "強調表示する価格スロット（右寄せ・太字）。" },
  { name: "RadioCard.highlight", type: "ReactNode", description: "おトクのフック行（○○円分おトク / ○回でモト）。" },
  { name: "RadioCard.leading", type: "ReactNode", description: "先頭のアクセサリ（アイコン/サムネ）。" },
];

export default function RadioCardDocPage() {
  const title = meta.radioCard.title ?? "RadioCard";
  const description = meta.radioCard.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "ListCard", href: "/docs/components/list-card" },
        { name: "RadioGroup", href: "/docs/components/radio-group" },
        { name: "Badge", href: "/docs/components/badge" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="md">
        <RadioCardDemo />
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
