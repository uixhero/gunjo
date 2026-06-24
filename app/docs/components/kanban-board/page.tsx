import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { KanbanBoardDemo } from "@/components/demos/KanbanBoardDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { KanbanBoard, Badge, type KanbanColumn } from "@gunjo/ui"

const columns: KanbanColumn[] = [
  { id: "todo", title: "未着手", tone: "muted" },
  { id: "doing", title: "進行中", tone: "info" },
  { id: "done", title: "完了", tone: "success" },
]

<KanbanBoard<Task>
  columns={columns}
  items={tasks}                       // flat list
  getItemId={(t) => t.id}
  getColumnId={(t) => t.status}       // grouped into columns
  onCardSelect={(t) => openTask(t)}   // cards become buttons
  renderCard={(t) => (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">{t.title}</span>
      <span className="text-xs text-muted-foreground">{t.assignee}</span>
    </div>
  )}
/>
// drag-and-drop is bring-your-own (e.g. dnd-kit) around the board`;

const propsData = [
  { name: "columns", type: "KanbanColumn[]", description: "Ordered lanes: { id, title, tone? }. tone draws an accent dot in the header." },
  { name: "items", type: "T[]", description: "All cards in any order — grouped into columns via getColumnId." },
  { name: "getItemId", type: "(item: T) => string", description: "Stable React key per card." },
  { name: "getColumnId", type: "(item: T) => string", description: "Which column a card belongs to (matches a columns[].id)." },
  { name: "renderCard", type: "(item: T) => ReactNode", description: "Render a card's body (compose Badge / text / etc.)." },
  { name: "onCardSelect", type: "(item: T) => void", description: "When set, each card is an activatable button (click / Enter / Space)." },
  { name: "showCount", type: "boolean", default: "true", description: "Per-column count badge." },
  { name: "emptyLabel", type: "ReactNode", default: '"なし"', description: "Placeholder for an empty column." },
  { name: "columnWidth", type: "number", default: "260", description: "Column width in px." },
];

export default function KanbanBoardDocPage() {
  const title = meta.kanbanBoard.title ?? "KanbanBoard";
  const description = meta.kanbanBoard.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Badge", href: "/docs/components/badge" },
        { name: "Card", href: "/docs/components/card" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="xl">
        <KanbanBoardDemo />
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
