import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { LimitMonitorDemo } from "@/components/demos/LimitMonitorDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { LimitMonitor, classifyLimit } from "@gunjo/ui"

// 拘束時間: ceiling — 基準13h / 上限16h, 1h 前から near. Limits in HOURS, not fractions of max.
<LimitMonitor
  label="拘束時間（当日）"
  value={13.5}
  limit={13}
  hardLimit={16}
  warnWithin={1}
  formatValue={(v) => \`\${v.toFixed(1)}時間\`}
/>

// 休息期間: floor — value must stay ABOVE 11h
<LimitMonitor label="休息期間" value={9.5} limit={11} direction="floor" />

// Pure classifier for KPI/queue logic (server-side):
const { state, over } = classifyLimit(13.5, { limit: 13, hardLimit: 16 })
// → { state: "over", over: 0.5 }`;

const propsData = [
  { name: "value", type: "number", description: "計測値。" },
  { name: "limit", type: "number", description: "ソフト/基準の上限（値の単位そのまま＝maxの割合ではない）。" },
  { name: "hardLimit", type: "number", description: "ハード/絶対上限（上限・最大）。第2の線を描画・超過で critical。" },
  { name: "warnWithin", type: "number", description: "limit の手前このマージンで near（基準間近）。値の単位。" },
  { name: "direction", type: '"ceiling" | "floor"', default: '"ceiling"', description: "ceiling＝下回るべき（拘束/連続運転/過積載）・floor＝上回るべき（休息期間）。" },
  { name: "max", type: "number", description: "バー正規化の最大値。既定＝value/hardLimit/limit×1.25 の最大。" },
  { name: "label", type: "ReactNode", description: "指標名（拘束時間/連続運転/過積載率）。" },
  { name: "formatValue", type: "(value: number) => ReactNode", description: "値+上限の表示整形。既定 toLocaleString。" },
  { name: "labels", type: "Partial<Record<LimitState, ReactNode>>", description: "状態チップのラベル上書き（ok/near/over/critical）。" },
  { name: "classifyLimit(value, options)", type: "→ { state, over }", description: "純粋関数（classifyExpiry/flagValue の上限版）。over＝基準を超えた符号付き差。KPI/キュー計算に。" },
];

export default function LimitMonitorDocPage() {
  const title = meta.limitMonitor.title ?? "LimitMonitor";
  const description = meta.limitMonitor.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "ExpiryBadge", href: "/docs/components/expiry-badge" },
        { name: "ReferenceValue", href: "/docs/components/reference-value" },
        { name: "Meter", href: "/docs/components/meter" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <LimitMonitorDemo />
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
