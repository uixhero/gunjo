import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { StatusBoardDemo } from "@/components/demos/StatusBoardDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { StatusBoard, type StatusBoardGroup } from "@gunjo/ui"
import { IconCar } from "@tabler/icons-react"

const groups: StatusBoardGroup[] = [
  { label: "渋谷エリア", items: [
    { id: "501", label: "501号車", icon: <IconCar/>, status: "空車", tone: "success",
      location: "佐藤 乗務", note: "渋谷駅付け待ち", onSelect: () => openVehicle("501") },
    { id: "508", label: "508号車", status: "故障", tone: "danger",
      location: "鈴木 乗務", note: "エンジン警告灯・対応要", onSelect: () => openVehicle("508") },
  ]},
]

<StatusBoard groups={groups} />        // or flat: <StatusBoard items={...} />`;

const propsData = [
  { name: "groups", type: "StatusBoardGroup[]", description: "グループ化タイル（各グループ＝見出し＋タイルグリッド＋要対応件数）。" },
  { name: "items", type: "StatusBoardItem[]", description: "フラットなタイル（グループ無し）。groups 指定時は無視。" },
  { name: "selectedId", type: "string | number", description: "1タイルを強調（他は淡色化）。" },
  { name: "minTileWidth", type: "number", default: "150", description: "レスポンシブグリッドのタイル最小幅(px)。" },
  { name: "problemTones", type: "StatusBoardTone[]", default: '["danger","warning"]', description: "要対応カウント＋ソート優先に数えるトーン。" },
  { name: "sort", type: "boolean", default: "true", description: "fault-first ソート（rank→トーン重大度）。" },
  { name: "StatusBoardItem.label", type: "ReactNode", description: "エンティティ名（号車/機器名）。" },
  { name: "StatusBoardItem.status", type: "ReactNode", description: "状態（空車/故障）＝アイコン＋テキストの色安全ピル。" },
  { name: "StatusBoardItem.tone", type: '"default" | "primary" | "info" | "success" | "warning" | "danger" | "muted"', default: '"default"', description: "状態ピル＋タイルのアクセント。" },
  { name: "StatusBoardItem.location / note / icon / trailing", type: "ReactNode", description: "場所・メモ・先頭アイコン・右寄せ（Meter/件数）。" },
  { name: "StatusBoardItem.rank", type: "number", description: "明示ソート順（小さいほど先頭）。省略時はトーン重大度順。" },
  { name: "StatusBoardItem.onSelect", type: "() => void", description: "タイルを選択可能に（詳細を開く）。" },
];

export default function StatusBoardDocPage() {
  const title = meta.statusBoard.title ?? "StatusBoard";
  const description = meta.statusBoard.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "ActionQueue", href: "/docs/components/action-queue" },
        { name: "DataTable", href: "/docs/components/data-table" },
        { name: "Badge", href: "/docs/components/badge" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <StatusBoardDemo />
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
