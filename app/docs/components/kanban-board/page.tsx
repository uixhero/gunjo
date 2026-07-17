"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Badge, KanbanBoard, Sheet, SheetContent, SheetHeader, SheetTitle, type KanbanColumn } from "@gunjo/ui";

type Locale = "ja" | "en";

type Task = {
  id: string;
  status: string;
  title: string;
  assignee: string;
  priority: string;
  due: string;
  summary: string;
};

type KanbanDetailTone = NonNullable<KanbanColumn["tone"]>;

const KANBAN_DETAIL_TONE: Record<KanbanDetailTone, string> = {
  default: "border-border bg-background",
  primary: "border-primary bg-primary/10",
  info: "border-info-border bg-info-subtle/55",
  success: "border-success-border bg-success-subtle/55",
  warning: "border-warning-border bg-warning-subtle/65",
  destructive: "border-destructive-border bg-destructive-subtle/55",
  muted: "border-border bg-muted/55",
};

function kanbanCopy(locale: Locale) {
  return locale === "ja"
    ? {
        detailTitle: "タスク詳細",
        assigneeLabel: "担当",
        priorityLabel: "優先度",
        statusLabel: "ステータス",
        dueLabel: "期限",
        nextLabel: "次のアクション",
        emptyLabel: "なし",
        columns: [
          { id: "todo", title: "未着手", tone: "muted" },
          { id: "doing", title: "進行中", tone: "info" },
          { id: "review", title: "レビュー", tone: "warning" },
          { id: "done", title: "完了", tone: "success" },
        ] satisfies KanbanColumn[],
        tasks: [
          { id: "t1", status: "todo", title: "申請フォームの入力確認", assignee: "青井", priority: "通常", due: "7月10日", summary: "必須項目、エラー文言、入力補助の整合性を確認します。" },
          { id: "t2", status: "doing", title: "通知メールの文面調整", assignee: "三宅", priority: "高", due: "7月8日", summary: "審査完了と差し戻し時のメール文面を最終確認します。" },
          { id: "t5", status: "doing", title: "権限変更ログの表示", assignee: "宇佐美", priority: "通常", due: "7月8日", summary: "管理者が確認できる変更履歴の表示項目を整理します。" },
          { id: "t6", status: "doing", title: "添付ファイルの容量確認", assignee: "青井", priority: "通常", due: "7月9日", summary: "アップロード上限とエラー表示が仕様どおりか確認します。" },
          { id: "t3", status: "review", title: "公開前チェックリスト", assignee: "黒川", priority: "高", due: "7月9日", summary: "公開前レビューの残項目と承認者を確認します。" },
          { id: "t4", status: "done", title: "権限ロールの棚卸し", assignee: "宇佐美", priority: "通常", due: "完了", summary: "既存ロールの利用状況を整理し、不要な権限を削除しました。" },
        ] satisfies Task[],
      }
    : {
        detailTitle: "Task details",
        assigneeLabel: "Owner",
        priorityLabel: "Priority",
        statusLabel: "Status",
        dueLabel: "Due",
        nextLabel: "Next action",
        emptyLabel: "None",
        columns: [
          { id: "todo", title: "To do", tone: "muted" },
          { id: "doing", title: "In progress", tone: "info" },
          { id: "review", title: "Review", tone: "warning" },
          { id: "done", title: "Done", tone: "success" },
        ] satisfies KanbanColumn[],
        tasks: [
          { id: "t1", status: "todo", title: "Review application form inputs", assignee: "Aoi", priority: "Normal", due: "Jul 10", summary: "Check required fields, validation copy, and input assistance." },
          { id: "t2", status: "doing", title: "Adjust notification email copy", assignee: "Miyake", priority: "High", due: "Jul 8", summary: "Finalize approval and send-back email copy." },
          { id: "t5", status: "doing", title: "Show permission change log", assignee: "Usami", priority: "Normal", due: "Jul 8", summary: "Confirm which change-history fields administrators can review." },
          { id: "t6", status: "doing", title: "Check attachment size limits", assignee: "Aoi", priority: "Normal", due: "Jul 9", summary: "Verify upload limits and error messages against the spec." },
          { id: "t3", status: "review", title: "Pre-publication checklist", assignee: "Kurokawa", priority: "High", due: "Jul 9", summary: "Review remaining launch tasks and approvers." },
          { id: "t4", status: "done", title: "Audit permission roles", assignee: "Usami", priority: "Normal", due: "Done", summary: "Reviewed role usage and removed obsolete permissions." },
        ] satisfies Task[],
      };
}

function TaskDetail({
  task,
  column,
  locale,
}: {
  task: Task;
  column: KanbanColumn | undefined;
  locale: Locale;
}) {
  const copy = kanbanCopy(locale);
  const tone = KANBAN_DETAIL_TONE[column?.tone ?? "default"];
  return (
    <div className={["rounded-lg border border-l-4 p-3 text-sm shadow-sm", tone].join(" ")}>
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 truncate text-base font-semibold text-foreground">{task.title}</p>
        <Badge variant={task.priority === (locale === "ja" ? "高" : "High") ? "destructive" : "outline"} className="shrink-0">
          {task.priority}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{task.summary}</p>
      <dl className="mt-3 grid gap-2 text-xs">
        <div>
          <dt className="text-muted-foreground">{copy.statusLabel}</dt>
          <dd className="font-medium text-foreground">{column?.title}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{copy.assigneeLabel}</dt>
          <dd className="font-medium text-foreground">{task.assignee}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{copy.dueLabel}</dt>
          <dd className="font-medium text-foreground">{task.due}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{copy.nextLabel}</dt>
          <dd className="font-medium text-foreground">
            {locale === "ja" ? "担当者が次の更新を登録します。" : "The owner records the next update."}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function TaskCard({ task, locale }: { task: Task; locale: Locale }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-foreground">{task.title}</span>
      <span className="text-xs text-muted-foreground">
        {locale === "ja" ? "担当" : "Owner"}: {task.assignee}
      </span>
      <div className="flex flex-wrap gap-1.5">
        <Badge variant={task.priority === (locale === "ja" ? "高" : "High") ? "destructive" : "secondary"}>
          {task.priority}
        </Badge>
      </div>
    </div>
  );
}

function KanbanBoardPreview({ locale, emptyColumn = false, hideCount = false }: { locale: Locale; emptyColumn?: boolean; hideCount?: boolean }) {
  const copy = kanbanCopy(locale);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);
  const tasks = emptyColumn ? copy.tasks.filter((task) => task.status !== "review") : copy.tasks;
  const selectedTask = selectedId ? tasks.find((task) => task.id === selectedId) : undefined;
  const selectedColumn = selectedTask ? copy.columns.find((column) => column.id === selectedTask.status) : undefined;

  return (
    <div ref={setPortalContainer} className="relative flex w-full max-w-4xl flex-col gap-4 overflow-hidden rounded-lg border bg-card p-4">
      <KanbanBoard<Task>
        columns={copy.columns}
        items={tasks}
        getItemId={(task) => task.id}
        getColumnId={(task) => task.status}
        emptyLabel={copy.emptyLabel}
        showCount={!hideCount}
        onCardSelect={(task) => setSelectedId(task.id)}
        renderCard={(task) => <TaskCard task={task} locale={locale} />}
      />
      <Sheet modal={false} open={selectedTask != null} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent
          portalContainer={portalContainer}
          overlayClassName="rounded-lg"
          closeLabel={locale === "ja" ? "閉じる" : "Close"}
          className="w-80 max-w-[calc(100%-1rem)] overflow-y-auto p-4"
        >
          {selectedTask ? (
            <>
              <SheetHeader className="pr-8">
                <SheetTitle>{copy.detailTitle}</SheetTitle>
              </SheetHeader>
              <TaskDetail task={selectedTask} column={selectedColumn} locale={locale} />
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function KanbanBoardDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/kanban-board", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.kanbanBoard.title ?? "KanbanBoard";
  const description = content?.description ?? metadata.kanbanBoard.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { Badge, KanbanBoard, Sheet, SheetContent, SheetHeader, SheetTitle, type KanbanColumn } from "@gunjo/ui";

type Task = { id: string; status: string; title: string; assignee: string; priority: string; due: string; summary: string };

const columns: KanbanColumn[] = [
  { id: "todo", title: "未着手", tone: "muted" },
  { id: "doing", title: "進行中", tone: "info" },
  { id: "review", title: "レビュー", tone: "warning" },
  { id: "done", title: "完了", tone: "success" },
];

const tasks: Task[] = [
  { id: "t1", status: "todo", title: "申請フォームの入力確認", assignee: "青井", priority: "通常", due: "7月10日", summary: "必須項目、エラー文言、入力補助の整合性を確認します。" },
  { id: "t2", status: "doing", title: "通知メールの文面調整", assignee: "三宅", priority: "高", due: "7月8日", summary: "審査完了と差し戻し時のメール文面を最終確認します。" },
  { id: "t5", status: "doing", title: "権限変更ログの表示", assignee: "宇佐美", priority: "通常", due: "7月8日", summary: "管理者が確認できる変更履歴の表示項目を整理します。" },
  { id: "t6", status: "doing", title: "添付ファイルの容量確認", assignee: "青井", priority: "通常", due: "7月9日", summary: "アップロード上限とエラー表示が仕様どおりか確認します。" },
  { id: "t3", status: "review", title: "公開前チェックリスト", assignee: "黒川", priority: "高", due: "7月9日", summary: "公開前レビューの残項目と承認者を確認します。" },
  { id: "t4", status: "done", title: "権限ロールの棚卸し", assignee: "宇佐美", priority: "通常", due: "完了", summary: "既存ロールの利用状況を整理し、不要な権限を削除しました。" },
];

export function ReviewKanban() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);
  const selectedTask = selectedId ? tasks.find((task) => task.id === selectedId) : undefined;
  const selectedColumn = selectedTask ? columns.find((column) => column.id === selectedTask.status) : undefined;

  return (
    <div ref={setPortalContainer} className="relative flex w-full max-w-4xl flex-col gap-4 overflow-hidden rounded-lg border bg-card p-4">
      <KanbanBoard<Task>
        columns={columns}
        items={tasks}
        getItemId={(task) => task.id}
        getColumnId={(task) => task.status}
        emptyLabel="なし"
        onCardSelect={(task) => setSelectedId(task.id)}
        renderCard={(task) => (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{task.title}</span>
            <span className="text-xs text-muted-foreground">担当: {task.assignee}</span>
            <Badge variant={task.priority === "高" ? "destructive" : "secondary"}>{task.priority}</Badge>
          </div>
        )}
      />
      <Sheet modal={false} open={selectedTask != null} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent portalContainer={portalContainer} overlayClassName="rounded-lg" closeLabel="閉じる" className="w-80 max-w-[calc(100%-1rem)] overflow-y-auto p-4">
          {selectedTask ? (
            <>
              <SheetHeader className="pr-8">
                <SheetTitle>タスク詳細</SheetTitle>
              </SheetHeader>
              <div className="rounded-lg border border-l-4 border-warning-border bg-warning-subtle/65 p-3 text-sm shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate text-base font-semibold text-foreground">{selectedTask.title}</p>
                  <Badge variant={selectedTask.priority === "高" ? "destructive" : "outline"}>{selectedTask.priority}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{selectedTask.summary}</p>
                <dl className="mt-3 grid gap-2 text-xs">
                  <div><dt className="text-muted-foreground">ステータス</dt><dd className="font-medium text-foreground">{selectedColumn?.title}</dd></div>
                  <div><dt className="text-muted-foreground">担当</dt><dd className="font-medium text-foreground">{selectedTask.assignee}</dd></div>
                  <div><dt className="text-muted-foreground">期限</dt><dd className="font-medium text-foreground">{selectedTask.due}</dd></div>
                </dl>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}`
    : `import * as React from "react";
import { Badge, KanbanBoard, Sheet, SheetContent, SheetHeader, SheetTitle, type KanbanColumn } from "@gunjo/ui";

type Task = { id: string; status: string; title: string; assignee: string; priority: string; due: string; summary: string };

const columns: KanbanColumn[] = [
  { id: "todo", title: "To do", tone: "muted" },
  { id: "doing", title: "In progress", tone: "info" },
  { id: "review", title: "Review", tone: "warning" },
  { id: "done", title: "Done", tone: "success" },
];

const tasks: Task[] = [
  { id: "t1", status: "todo", title: "Review application form inputs", assignee: "Aoi", priority: "Normal", due: "Jul 10", summary: "Check required fields, validation copy, and input assistance." },
  { id: "t2", status: "doing", title: "Adjust notification email copy", assignee: "Miyake", priority: "High", due: "Jul 8", summary: "Finalize approval and send-back email copy." },
  { id: "t5", status: "doing", title: "Show permission change log", assignee: "Usami", priority: "Normal", due: "Jul 8", summary: "Confirm which change-history fields administrators can review." },
  { id: "t6", status: "doing", title: "Check attachment size limits", assignee: "Aoi", priority: "Normal", due: "Jul 9", summary: "Verify upload limits and error messages against the spec." },
  { id: "t3", status: "review", title: "Pre-publication checklist", assignee: "Kurokawa", priority: "High", due: "Jul 9", summary: "Review remaining launch tasks and approvers." },
  { id: "t4", status: "done", title: "Audit permission roles", assignee: "Usami", priority: "Normal", due: "Done", summary: "Reviewed role usage and removed obsolete permissions." },
];

export function ReviewKanban() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);
  const selectedTask = selectedId ? tasks.find((task) => task.id === selectedId) : undefined;
  const selectedColumn = selectedTask ? columns.find((column) => column.id === selectedTask.status) : undefined;

  return (
    <div ref={setPortalContainer} className="relative flex w-full max-w-4xl flex-col gap-4 overflow-hidden rounded-lg border bg-card p-4">
      <KanbanBoard<Task>
        columns={columns}
        items={tasks}
        getItemId={(task) => task.id}
        getColumnId={(task) => task.status}
        emptyLabel="None"
        onCardSelect={(task) => setSelectedId(task.id)}
        renderCard={(task) => (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{task.title}</span>
            <span className="text-xs text-muted-foreground">Owner: {task.assignee}</span>
            <Badge variant={task.priority === "High" ? "destructive" : "secondary"}>{task.priority}</Badge>
          </div>
        )}
      />
      <Sheet modal={false} open={selectedTask != null} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent portalContainer={portalContainer} overlayClassName="rounded-lg" closeLabel="Close" className="w-80 max-w-[calc(100%-1rem)] overflow-y-auto p-4">
          {selectedTask ? (
            <>
              <SheetHeader className="pr-8">
                <SheetTitle>Task details</SheetTitle>
              </SheetHeader>
              <div className="rounded-lg border border-l-4 border-warning-border bg-warning-subtle/65 p-3 text-sm shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate text-base font-semibold text-foreground">{selectedTask.title}</p>
                  <Badge variant={selectedTask.priority === "High" ? "destructive" : "outline"}>{selectedTask.priority}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{selectedTask.summary}</p>
                <dl className="mt-3 grid gap-2 text-xs">
                  <div><dt className="text-muted-foreground">Status</dt><dd className="font-medium text-foreground">{selectedColumn?.title}</dd></div>
                  <div><dt className="text-muted-foreground">Owner</dt><dd className="font-medium text-foreground">{selectedTask.assignee}</dd></div>
                  <div><dt className="text-muted-foreground">Due</dt><dd className="font-medium text-foreground">{selectedTask.due}</dd></div>
                </dl>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}`;

  const propsData = [
    { name: "columns", type: "KanbanColumn[]", description: locale === "ja" ? "順序付きの列です。tone は見出しのアクセント点に使います。" : "Ordered columns. tone drives the header accent dot." },
    { name: "items", type: "T[]", description: locale === "ja" ? "列分け前のフラットなカード配列です。" : "Flat card list before grouping." },
    { name: "getItemId", type: "(item: T) => string", description: locale === "ja" ? "カードの安定したキーを返します。" : "Returns a stable card key." },
    { name: "getColumnId", type: "(item: T) => string", description: locale === "ja" ? "カードが入る列 id を返します。" : "Returns the column id for each card." },
    { name: "renderCard", type: "(item: T) => ReactNode", description: locale === "ja" ? "カード本体を描画します。関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。JSX を返すため serializable な代替は無く、RSC からは \"use client\" ラッパーで包む。(#338)" : "Renders each card body. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Render props return JSX (no serializable alternative) — wrap in a \"use client\" component to pass from an RSC. (#338)" },
    { name: "onCardSelect", type: "(item: T) => void", description: locale === "ja" ? "渡すとカードがボタンになり、クリックやキーボードで選択できます。" : "When provided, cards become buttons for pointer and keyboard selection." },
    { name: "showCount", type: "boolean", default: "true", description: locale === "ja" ? "列見出しに件数 Badge を表示します。" : "Shows count badges in column headers." },
    { name: "emptyLabel", type: "ReactNode", default: '"なし"', description: locale === "ja" ? "空列のプレースホルダーです。" : "Placeholder for an empty column." },
    { name: "columnWidth", type: "number", default: "260", description: locale === "ja" ? "横スクロール内の列幅です。" : "Column width inside horizontal scroll." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "KanbanBoard", href: "/docs/components/kanban-board" },
        { name: "Badge", href: "/docs/components/badge" },
        { name: "Sheet", href: "/docs/components/sheet" },
      ]}
      relatedComponents={[
        { name: "StatusBoard", href: "/docs/components/status-board" },
        { name: "ListCard", href: "/docs/components/list-card" },
        { name: "Card", href: "/docs/components/card" },
        { name: "SwatchLegend", href: "/docs/components/chart-legend" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="xl">
        <KanbanBoardPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "selectable",
              title: locale === "ja" ? "選択可能カード" : "Selectable cards",
              description: locale === "ja" ? "onCardSelect を渡すとカードがボタンになります。" : "Pass onCardSelect to make each card an activatable button.",
              preview: <KanbanBoardPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "xl",
            },
            {
              key: "empty-column",
              title: locale === "ja" ? "空列" : "Empty column",
              description: locale === "ja" ? "該当カードがない列には emptyLabel を表示します。" : "Columns without cards render emptyLabel.",
              preview: <KanbanBoardPreview locale={locale} emptyColumn />,
              code: `<KanbanBoard
  columns={[
    { id: "todo", title: "${locale === "ja" ? "未着手" : "To do"}" },
    { id: "review", title: "${locale === "ja" ? "レビュー" : "Review"}" },
  ]}
  items={[{ id: "t1", status: "todo", title: "${locale === "ja" ? "申請フォームの入力確認" : "Review application form inputs"}" }]}
  getItemId={(task) => task.id}
  getColumnId={(task) => task.status}
  emptyLabel="${locale === "ja" ? "なし" : "None"}"
  renderCard={(task) => <span className="text-sm font-medium">{task.title}</span>}
/>`,
              previewBodyWidth: "xl",
            },
            {
              key: "without-count",
              title: locale === "ja" ? "件数なし" : "Without counts",
              description: locale === "ja" ? "列数が十分に少ない場合は showCount={false} で件数を隠せます。" : "Use showCount={false} when the column count is visually redundant.",
              preview: <KanbanBoardPreview locale={locale} hideCount />,
              code: `<KanbanBoard
  columns={[{ id: "todo", title: "${locale === "ja" ? "未着手" : "To do"}" }]}
  items={[{ id: "t1", status: "todo", title: "${locale === "ja" ? "申請フォームの入力確認" : "Review application form inputs"}" }]}
  getItemId={(task) => task.id}
  getColumnId={(task) => task.status}
  showCount={false}
  renderCard={(task) => <span className="text-sm font-medium">{task.title}</span>}
/>`,
              previewBodyWidth: "xl",
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
          {sectionLabels.props}
        </h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
            {sectionLabels.usage}
          </h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>
    </ComponentLayout>
  );
}
