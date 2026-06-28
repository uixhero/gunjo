import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { LeaderboardDemo } from "@/components/demos/LeaderboardDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { Leaderboard, type LeaderboardItem } from "@gunjo/ui"

// Caller pre-orders — rank = array position. worst-first for "要対応".
const routes: LeaderboardItem[] = [
  { id: "shibuya88", label: "渋88 系統", sublabel: "渋谷↔六本木",
    value: 3.4, delta: 0.9, tone: "destructive" },
  { id: "shuku51", label: "宿51 系統", value: 2.8, delta: 0.3, tone: "destructive" },
  { id: "to07", label: "都07 系統", value: 1.2, delta: -0.2, tone: "warning" },
]

// 事故率は「上昇＝悪い」→ Delta の色を反転
<Leaderboard
  items={routes}
  label="系統別 事故率ランキング"
  formatValue={(v) => \`\${v.toFixed(1)}件\`}
  deltaTones={{ positive: "destructive", negative: "success" }}
/>`;

const propsData = [
  { name: "items", type: "LeaderboardItem[]", description: "事前に順序付けした行（ランク＝配列位置＋1）。コンポーネントは再ソートしない＝best-first/worst-first は呼び出し側の明示的な選択。" },
  { name: "label", type: "ReactNode", description: "ランキングのアクセシブル名。" },
  { name: "showRank", type: "boolean", default: "true", description: "番号付きランクチップを表示。" },
  { name: "showBar", type: "boolean", default: "true", description: "値のインラインバーを表示（max で正規化）。" },
  { name: "max", type: "number", description: "バー正規化の最大値。既定＝最大 value。" },
  { name: "formatValue", type: "(value, item) => ReactNode", description: "値の整形。既定 toLocaleString。" },
  { name: "formatDelta", type: "(delta) => ReactNode", description: "Delta 数値の整形。" },
  { name: "deltaTones", type: '{ positive?, negative?, zero? }', description: '「上昇＝悪い」ランキング（事故率/コスト/苦情）は { positive: "destructive", negative: "success" }。既定は Delta（上昇＝緑）。' },
  { name: "highlightTop", type: "number", default: "3", description: "上位 N のランクチップを強調（塗りつぶし）。" },
  { name: "selectedId", type: "string | number", description: "1行を強調（他は淡色化）。" },
  { name: "LeaderboardItem.label / sublabel", type: "ReactNode", description: "ランク対象（系統/営業所/商品）＋副次行。" },
  { name: "LeaderboardItem.value / valueLabel", type: "number / ReactNode", description: "バーを駆動する数値＋整形済み表示（あれば優先）。" },
  { name: "LeaderboardItem.fraction", type: "number", description: "0–1 のバー充填率。省略時 value/max。" },
  { name: "LeaderboardItem.delta", type: "number", description: "前期比（Delta チップ）。" },
  { name: "LeaderboardItem.tone", type: '"default" | "primary" | "info" | "success" | "warning" | "destructive" | "muted"', default: '"primary"', description: "バーのトーン。" },
  { name: "LeaderboardItem.icon / trailing / onSelect", type: "ReactNode / ReactNode / () => void", description: "先頭アイコン・右寄せ・選択可能化。" },
];

export default function LeaderboardDocPage() {
  const title = meta.leaderboard.title ?? "Leaderboard";
  const description = meta.leaderboard.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Delta", href: "/docs/components/delta" },
        { name: "BarChart", href: "/docs/components/bar-chart" },
        { name: "StatGroup", href: "/docs/components/stat-group" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <LeaderboardDemo />
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
