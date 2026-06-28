import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { ExpiryBadgeDemo } from "@/components/demos/ExpiryBadgeDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { ExpiryBadge, classifyExpiry } from "@gunjo/ui"

// component — colour-safe state chip + date + 残N日/N日超過
<ExpiryBadge value="2026-07-20" today={today} warnWithinDays={60} />

// pure helper (mirrors ReferenceValue's flagValue) — drive your own UI / sort / counts
const { state, days } = classifyExpiry("2026-07-20", { today, warnWithinDays: 60 })
// → { state: "expiring", days: 22 }   // "valid" | "expiring" | "expired" | "missing"`;

const propsData = [
  { name: "value", type: "string | number | Date | null", description: "有効期限（ISO文字列/タイムスタンプ/Date）。null/省略 → 未登録。" },
  { name: "today", type: "string | number | Date", default: "new Date()", description: "判定の基準日。SSR決定性のため渡すことを推奨（Gantt の today と同様）。" },
  { name: "warnWithinDays", type: "number", default: "30", description: "この日数以内を「期限間近」とする。" },
  { name: "showDate", type: "boolean", default: "true", description: "状態チップの横に日付を表示。" },
  { name: "hideRemaining", type: "boolean", default: "false", description: "残N日 / N日超過 の表示を隠す。" },
  { name: "formatDate", type: "(d: Date) => string", description: "日付の整形。既定は YYYY/MM/DD。" },
  { name: "labels", type: "Partial<Record<ExpiryState, ReactNode>>", description: "状態ラベルの上書き（有効/期限間近/失効/未登録）。" },
  { name: "classifyExpiry()", type: "(value, { today?, warnWithinDays? }) => { state, days }", description: "純関数の分類器（flagValue の日付版）。state＝valid/expiring/expired/missing、days＝期限までの日数。" },
];

export default function ExpiryBadgeDocPage() {
  const title = meta.expiryBadge.title ?? "ExpiryBadge";
  const description = meta.expiryBadge.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "ReferenceValue", href: "/docs/components/reference-value" },
        { name: "Meter", href: "/docs/components/meter" },
        { name: "Badge", href: "/docs/components/badge" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="md">
        <ExpiryBadgeDemo />
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
