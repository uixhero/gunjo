"use client";

import { Button, Card, CardHeader, CardTitle, KanbanTemplate, SidebarItem } from "@gunjo/ui";
import { IconLayoutKanban as LayoutKanban, IconArchive as Archive } from "@tabler/icons-react";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { KanbanTemplateDemo } from "@/components/demos/TemplateDemos";
import { useLocale } from "@/components/providers/LocaleProvider";
import patternsMetadata from "@design/patterns-metadata.json";

const usageCode = `import { KanbanTemplate, Card, CardHeader, CardTitle } from "@gunjo/ui";

export function KanbanPage() {
  return (
    <KanbanTemplate
        header={<div>My Board</div>}
        sidebar={<div>Sidebar</div>}
    >
        {/* Column 1 */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-4">
            <h3>To Do</h3>
            <Card>
                <CardHeader><CardTitle>Task 1</CardTitle></CardHeader>
            </Card>
        </div>
        {/* Column 2 */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-4">
            <h3>In Progress</h3>
             <Card>
                <CardHeader><CardTitle>Task 2</CardTitle></CardHeader>
            </Card>
        </div>
    </KanbanTemplate>
  )
}`;

const propsData = [
    {
        name: "sidebar",
        type: "React.ReactNode",
        description: "Content for the sidebar panel.",
    },
    {
        name: "header",
        type: "React.ReactNode",
        description: "Content for the top header bar.",
    },
    {
        name: "children",
        type: "React.ReactNode",
        description: "The main content area, typically horizontally scrolling columns.",
    },
    {
        name: "className",
        type: "string",
        description: "Additional classes for the root container.",
    }
];

export default function KanbanPage() {
    const { locale } = useLocale();

    const columns = locale === "ja"
        ? [{ name: "未着手", task: "配色を決める" }, { name: "進行中", task: "一覧画面を組む" }]
        : [{ name: "To do", task: "Pick the palette" }, { name: "In progress", task: "Build the list screen" }];

    const board = columns.map((column) => (
        <div key={column.name} className="flex w-72 flex-shrink-0 flex-col gap-3">
            <h3 className="text-sm font-semibold text-muted-foreground">{column.name}</h3>
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">{column.task}</CardTitle>
                </CardHeader>
            </Card>
        </div>
    ));

    const boardHeader = (
        <div className="flex w-full items-center justify-between">
            <span className="font-semibold">{locale === "ja" ? "設計ボード" : "Design board"}</span>
            <Button size="sm">{locale === "ja" ? "カードを足す" : "Add card"}</Button>
        </div>
    );

    const boardSidebar = (
        <div className="space-y-1 p-2">
            <SidebarItem id="board" label={locale === "ja" ? "ボード" : "Board"} icon={<LayoutKanban size={20} />} isActive onClick={() => {}} />
            <SidebarItem id="archive" label={locale === "ja" ? "書庫" : "Archive"} icon={<Archive size={20} />} isActive={false} onClick={() => {}} />
        </div>
    );

    return (
        <ComponentLayout
            title={patternsMetadata.kanbanTemplate.title}
            description={patternsMetadata.kanbanTemplate.description}
            usedComponents={[
                { name: "KanbanTemplate", href: "/docs/components/kanban" },
                { name: "Card", href: "/docs/components/card" },
                { name: "SidebarItem", href: "/docs/components/sidebar-item" },
                { name: "Button", href: "/docs/components/button" },
            ]}
            relatedComponents={[
                { name: "KanbanBoard", href: "/docs/components/kanban-board" },
                { name: "StatusBoard", href: "/docs/components/status-board" },
                { name: "DashboardTemplate", href: "/docs/components/dashboard" },
                { name: "ListCard", href: "/docs/components/list-card" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/kanban" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <KanbanTemplateDemo />
                </div>
            </ComponentPreview>

            <div className="space-y-3 rounded-lg border bg-muted/30 p-5">
                <h2 className="text-lg font-semibold tracking-tight">Layout scope</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    KanbanTemplate provides the responsive shell for sidebar, header, and horizontally
                    scrolling columns. It does not own card state, column data, or drag-and-drop behavior.
                    Wire those pieces in the consuming app.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    For a production board, pair this shell with <code className="font-mono text-xs">dnd-kit</code>
                    and keep stable item ids, keyboard sensors, and SSR-safe aria ids in the board implementation.
                </p>
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "sidebar と header はどちらも省略できます。列は children にそのまま並べ、幅が足りなければ横に流れます。"
                        : "Both sidebar and header are optional. Columns go straight into children and scroll sideways when they run out of room."}
                </p>
                <ComponentDemoStates
                    states={[
                        {
                            key: "board-with-sidebar",
                            title: locale === "ja" ? "案内と見出しつき" : "With sidebar and header",
                            description: locale === "ja"
                                ? "左に案内、上に見出しを置いた標準形です。左の案内は中くらいの幅から現れます。"
                                : "Navigation on the left, a header across the top. The sidebar appears from medium widths up.",
                            preview: (
                                <KanbanTemplate className="h-auto" header={boardHeader} sidebar={boardSidebar}>
                                    {board}
                                </KanbanTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Button, Card, CardHeader, CardTitle, KanbanTemplate } from "@gunjo/ui";

const COLUMNS = [
  { name: "未着手", task: "配色を決める" },
  { name: "進行中", task: "一覧画面を組む" },
];

export function BoardWithSidebar() {
  return (
    <KanbanTemplate
      className="h-auto"
      header={
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold">設計ボード</span>
          <Button size="sm">カードを足す</Button>
        </div>
      }
      sidebar={<div className="p-3 text-sm text-muted-foreground">ボード</div>}
    >
      {COLUMNS.map((column) => (
        <div key={column.name} className="flex w-72 flex-shrink-0 flex-col gap-3">
          <h3 className="text-sm font-semibold text-muted-foreground">{column.name}</h3>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{column.task}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      ))}
    </KanbanTemplate>
  );
}`
                                : `import { Button, Card, CardHeader, CardTitle, KanbanTemplate } from "@gunjo/ui";

const COLUMNS = [
  { name: "To do", task: "Pick the palette" },
  { name: "In progress", task: "Build the list screen" },
];

export function BoardWithSidebar() {
  return (
    <KanbanTemplate
      className="h-auto"
      header={
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold">Design board</span>
          <Button size="sm">Add card</Button>
        </div>
      }
      sidebar={<div className="p-3 text-sm text-muted-foreground">Board</div>}
    >
      {COLUMNS.map((column) => (
        <div key={column.name} className="flex w-72 flex-shrink-0 flex-col gap-3">
          <h3 className="text-sm font-semibold text-muted-foreground">{column.name}</h3>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{column.task}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      ))}
    </KanbanTemplate>
  );
}`,
                        },
                        {
                            key: "board-without-sidebar",
                            title: locale === "ja" ? "案内を外す" : "Without the sidebar",
                            description: locale === "ja"
                                ? "sidebar を省くと列が左端から始まります。ボードが1枚しか無いときはこの形です。"
                                : "Drop sidebar and the columns start at the left edge. Use it when there is only one board to show.",
                            preview: (
                                <KanbanTemplate className="h-auto" header={boardHeader}>
                                    {board}
                                </KanbanTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Button, Card, CardHeader, CardTitle, KanbanTemplate } from "@gunjo/ui";

const COLUMNS = [
  { name: "未着手", task: "配色を決める" },
  { name: "進行中", task: "一覧画面を組む" },
];

export function BoardWithoutSidebar() {
  return (
    <KanbanTemplate
      className="h-auto"
      header={
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold">設計ボード</span>
          <Button size="sm">カードを足す</Button>
        </div>
      }
    >
      {COLUMNS.map((column) => (
        <div key={column.name} className="flex w-72 flex-shrink-0 flex-col gap-3">
          <h3 className="text-sm font-semibold text-muted-foreground">{column.name}</h3>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{column.task}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      ))}
    </KanbanTemplate>
  );
}`
                                : `import { Button, Card, CardHeader, CardTitle, KanbanTemplate } from "@gunjo/ui";

const COLUMNS = [
  { name: "To do", task: "Pick the palette" },
  { name: "In progress", task: "Build the list screen" },
];

export function BoardWithoutSidebar() {
  return (
    <KanbanTemplate
      className="h-auto"
      header={
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold">Design board</span>
          <Button size="sm">Add card</Button>
        </div>
      }
    >
      {COLUMNS.map((column) => (
        <div key={column.name} className="flex w-72 flex-shrink-0 flex-col gap-3">
          <h3 className="text-sm font-semibold text-muted-foreground">{column.name}</h3>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{column.task}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      ))}
    </KanbanTemplate>
  );
}`,
                        },
                        {
                            key: "columns-only",
                            title: locale === "ja" ? "列だけ" : "Columns only",
                            description: locale === "ja"
                                ? "header も外すと列だけが残ります。すでに見出しを持つ画面へ埋め込むときに使います。"
                                : "Drop header too and only the columns remain. Use this when the surrounding screen already has a heading.",
                            preview: (
                                <KanbanTemplate className="h-auto">
                                    {board}
                                </KanbanTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Card, CardHeader, CardTitle, KanbanTemplate } from "@gunjo/ui";

const COLUMNS = [
  { name: "未着手", task: "配色を決める" },
  { name: "進行中", task: "一覧画面を組む" },
];

export function ColumnsOnlyBoard() {
  return (
    <KanbanTemplate className="h-auto">
      {COLUMNS.map((column) => (
        <div key={column.name} className="flex w-72 flex-shrink-0 flex-col gap-3">
          <h3 className="text-sm font-semibold text-muted-foreground">{column.name}</h3>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{column.task}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      ))}
    </KanbanTemplate>
  );
}`
                                : `import { Card, CardHeader, CardTitle, KanbanTemplate } from "@gunjo/ui";

const COLUMNS = [
  { name: "To do", task: "Pick the palette" },
  { name: "In progress", task: "Build the list screen" },
];

export function ColumnsOnlyBoard() {
  return (
    <KanbanTemplate className="h-auto">
      {COLUMNS.map((column) => (
        <div key={column.name} className="flex w-72 flex-shrink-0 flex-col gap-3">
          <h3 className="text-sm font-semibold text-muted-foreground">{column.name}</h3>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{column.task}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      ))}
    </KanbanTemplate>
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Props</h2>
                <PropsTable data={propsData} />
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Usage</h2>
                <CodeBlock code={usageCode} language="tsx" />
            </div>
        </ComponentLayout>
    );
}
