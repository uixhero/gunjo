"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
    IconArchive,
    IconPencil,
    IconTrash,
} from "@tabler/icons-react";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import {
    ActionDataTable,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Badge,
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Form,
    FormGroup,
    FormLabel,
    Input,
    Select,
    type ActionDataTableLabels,
} from "@gunjo/ui";

type Campaign = {
    id: string;
    name: string;
    owner: string;
    status: "active" | "draft" | "archived";
    updatedAt: string;
};

const CAMPAIGN_SEEDS: Campaign[] = [
    { id: "c-001", name: "春の新生活バナー", owner: "青井 花", status: "active", updatedAt: "2026-05-12" },
    { id: "c-002", name: "アプリ訴求 LP", owner: "田中 空", status: "draft", updatedAt: "2026-05-10" },
    { id: "c-003", name: "法人向け資料広告", owner: "山本 優", status: "active", updatedAt: "2026-05-08" },
    { id: "c-004", name: "旧キャンペーン素材", owner: "小林 真央", status: "archived", updatedAt: "2026-04-28" },
    { id: "c-005", name: "展示会フォロー", owner: "中村 蓮", status: "draft", updatedAt: "2026-04-25" },
    { id: "c-006", name: "採用サイト告知", owner: "佐藤 葵", status: "active", updatedAt: "2026-04-20" },
    { id: "c-007", name: "店舗向け予約導線", owner: "伊藤 陽", status: "active", updatedAt: "2026-04-18" },
    { id: "c-008", name: "夏季キャンペーン", owner: "高橋 澪", status: "draft", updatedAt: "2026-04-15" },
    { id: "c-009", name: "資料請求リターゲティング", owner: "渡辺 凛", status: "active", updatedAt: "2026-04-12" },
    { id: "c-010", name: "法人向けメール施策", owner: "加藤 蒼", status: "archived", updatedAt: "2026-04-08" },
    { id: "c-011", name: "採用イベント告知", owner: "山口 詩", status: "active", updatedAt: "2026-04-05" },
    { id: "c-012", name: "新機能ティザー", owner: "松本 樹", status: "draft", updatedAt: "2026-04-01" },
    { id: "c-013", name: "代理店向け説明会", owner: "井上 奏", status: "active", updatedAt: "2026-03-28" },
    { id: "c-014", name: "ホワイトペーパー広告", owner: "木村 雫", status: "draft", updatedAt: "2026-03-24" },
    { id: "c-015", name: "月次レポート配信", owner: "林 悠", status: "active", updatedAt: "2026-03-20" },
    { id: "c-016", name: "休眠ユーザー再接触", owner: "清水 碧", status: "archived", updatedAt: "2026-03-18" },
    { id: "c-017", name: "導入事例バナー", owner: "森 結", status: "active", updatedAt: "2026-03-12" },
    { id: "c-018", name: "ウェビナー募集", owner: "池田 旭", status: "draft", updatedAt: "2026-03-08" },
];

const CAMPAIGNS: Campaign[] = Array.from({ length: 300 }, (_, index) => {
    const source = CAMPAIGN_SEEDS[index % CAMPAIGN_SEEDS.length];
    const day = 28 - (index % 28);
    const month = 5 - Math.floor((index % 120) / 28);
    const normalizedMonth = month > 0 ? month : 1;
    return {
        ...source,
        id: `c-${String(index + 1).padStart(3, "0")}`,
        name: index < CAMPAIGN_SEEDS.length ? source.name : `${source.name} ${index + 1}`,
        updatedAt: `2026-${String(normalizedMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    };
});

const STATUS_VARIANT: Record<Campaign["status"], "default" | "secondary" | "outline"> = {
    active: "default",
    draft: "secondary",
    archived: "outline",
};

function getLabels(isJa: boolean): ActionDataTableLabels {
    return isJa
        ? {
            filterPlaceholder: "キャンペーン名で絞り込み...",
            noResults: "該当するキャンペーンがありません。",
            previous: "前へ",
            next: "次へ",
            firstPage: "最初のページへ",
            lastPage: "最後のページへ",
            firstPageUnavailable: "すでに最初のページです",
            previousPageUnavailable: "前のページはありません",
            nextPageUnavailable: "次のページはありません",
            lastPageUnavailable: "すでに最後のページです",
            rowsPerPage: "表示件数",
            pageSizeOption: (size) => `${size}件`,
            paginationSummary: (from, to, total) => `${from.toLocaleString("ja-JP")} - ${to.toLocaleString("ja-JP")} / 全${total.toLocaleString("ja-JP")}件`,
            pageSummary: (current, total) => `${current.toLocaleString("ja-JP")} / ${total.toLocaleString("ja-JP")}`,
            pageSelect: "ページを選択",
            pageOption: (page) => page.toLocaleString("ja-JP"),
            goToPage: (page) => `${page}ページへ移動`,
            sortAscending: "クリックすると昇順に並び替えます",
            sortDescending: "クリックすると降順に並び替えます",
            clearSort: "クリックすると並び替えを解除します",
            sortUnsorted: "現在: 並び替えなし",
            sortCurrentAscending: "現在: 昇順",
            sortCurrentDescending: "現在: 降順",
            selectedRows: (count) => `${count}件を選択中`,
            selectedRowsLabel: "選択中",
            selectAllRows: "すべての行を選択します",
            selectRow: (label) => `${label}を選択します`,
            selectAllRowsSelected: "すべての選択を外します",
            selectRowSelected: (label) => `${label}の選択を外します`,
            clearSelection: "選択を解除",
            actions: "行操作",
            bulkActions: "一括操作",
            bulkActionPlaceholder: "一括操作",
            disabledAction: "行を選択すると操作できます",
        }
        : {
            filterPlaceholder: "Filter campaigns...",
            noResults: "No campaigns found.",
            previous: "Previous",
            next: "Next",
            firstPage: "First page",
            lastPage: "Last page",
            firstPageUnavailable: "Already on the first page",
            previousPageUnavailable: "No previous page",
            nextPageUnavailable: "No next page",
            lastPageUnavailable: "Already on the last page",
            rowsPerPage: "Rows",
            pageSizeOption: (size) => `${size} rows`,
            paginationSummary: (from, to, total) => `${from.toLocaleString("en-US")} - ${to.toLocaleString("en-US")} / ${total.toLocaleString("en-US")} rows`,
            pageSummary: (current, total) => `${current.toLocaleString("en-US")} / ${total.toLocaleString("en-US")}`,
            pageSelect: "Select page",
            pageOption: (page) => page.toLocaleString("en-US"),
            goToPage: (page) => `Go to page ${page}`,
            sortAscending: "Click to sort ascending",
            sortDescending: "Click to sort descending",
            clearSort: "Click to clear sorting",
            sortUnsorted: "Current: unsorted",
            sortCurrentAscending: "Current: ascending",
            sortCurrentDescending: "Current: descending",
            selectedRows: (count) => `${count} selected`,
            selectedRowsLabel: "selected",
            selectAllRows: "Select all rows",
            selectRow: (label) => `Select ${label}`,
            selectAllRowsSelected: "Deselect all rows",
            selectRowSelected: (label) => `Deselect ${label}`,
            clearSelection: "Clear selection",
            actions: "Row actions",
            bulkActions: "Bulk actions",
            bulkActionPlaceholder: "Bulk actions",
            disabledAction: "Select rows first",
        };
}

function getColumns(isJa: boolean): ColumnDef<Campaign>[] {
    const statusLabels: Record<Campaign["status"], string> = isJa
        ? { active: "公開中", draft: "下書き", archived: "保管済み" }
        : { active: "Active", draft: "Draft", archived: "Archived" };

    return [
        {
            accessorKey: "name",
            header: isJa ? "キャンペーン" : "Campaign",
            size: 320,
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
            accessorKey: "owner",
            header: isJa ? "担当者" : "Owner",
            size: 128,
        },
        {
            accessorKey: "status",
            header: isJa ? "状態" : "Status",
            size: 112,
            cell: ({ row }) => {
                const status = row.original.status;
                return <Badge variant={STATUS_VARIANT[status]}>{statusLabels[status]}</Badge>;
            },
        },
        {
            accessorKey: "updatedAt",
            header: isJa ? "更新日" : "Updated",
            size: 120,
        },
    ];
}

function ActionDataTableDemo({ compact = false }: { compact?: boolean }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const labels = React.useMemo(() => getLabels(isJa), [isJa]);
    const columns = React.useMemo(() => getColumns(isJa), [isJa]);
    const [rows, setRows] = React.useState(CAMPAIGNS);
    const [editing, setEditing] = React.useState<Campaign | null>(null);
    const [pendingDeleteRows, setPendingDeleteRows] = React.useState<Campaign[]>([]);
    const [draftName, setDraftName] = React.useState("");
    const [draftStatus, setDraftStatus] = React.useState<Campaign["status"]>("draft");

    React.useEffect(() => {
        if (!editing) return;
        setDraftName(editing.name);
        setDraftStatus(editing.status);
    }, [editing]);

    const archiveRows = React.useCallback((selectedRows: Campaign[]) => {
        const selectedIds = new Set(selectedRows.map((row) => row.id));
        setRows((current) =>
            current.map((row) =>
                selectedIds.has(row.id)
                    ? { ...row, status: "archived", updatedAt: "2026-05-22" }
                    : row
            )
        );
    }, []);

    const deleteRows = React.useCallback((selectedRows: Campaign[]) => {
        const selectedIds = new Set(selectedRows.map((row) => row.id));
        setRows((current) => current.filter((row) => !selectedIds.has(row.id)));
    }, []);

    const requestDeleteRows = React.useCallback((selectedRows: Campaign[]) => {
        if (selectedRows.length === 0) return;
        setPendingDeleteRows(selectedRows);
    }, []);

    const confirmDeleteRows = React.useCallback(() => {
        deleteRows(pendingDeleteRows);
        setPendingDeleteRows([]);
    }, [deleteRows, pendingDeleteRows]);

    const submitEdit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editing) return;
        setRows((current) =>
            current.map((row) =>
                row.id === editing.id
                    ? { ...row, name: draftName.trim() || row.name, status: draftStatus, updatedAt: "2026-05-22" }
                    : row
            )
        );
        setEditing(null);
    }, [draftName, draftStatus, editing]);

    return (
        <div className="w-full space-y-3">
            <ActionDataTable
                columns={columns}
                data={rows}
                filter={compact ? null : { columnId: "name", placeholder: labels.filterPlaceholder }}
                pageSize={10}
                pageSizeOptions={[10, 25, 50, 100, 200]}
                labels={labels}
                getRowId={(row) => row.id}
                getRowLabel={(row) => row.name}
                bulkActions={[
                    {
                        id: "archive",
                        label: isJa ? "保管" : "Archive",
                        icon: IconArchive,
                        disabledReason: isJa ? "行を選択すると保管できます" : "Select rows to archive",
                        onSelect: archiveRows,
                    },
                    {
                        id: "delete",
                        label: isJa ? "削除" : "Delete",
                        icon: IconTrash,
                        variant: "destructive",
                        disabledReason: isJa ? "行を選択すると削除できます" : "Select rows to delete",
                        onSelect: requestDeleteRows,
                    },
                ]}
                rowActions={[
                    {
                        id: "edit",
                        label: isJa ? "編集" : "Edit",
                        icon: IconPencil,
                        onSelect: setEditing,
                    },
                    {
                        id: "archive",
                        label: isJa ? "保管" : "Archive",
                        icon: IconArchive,
                        disabled: (row) => row.status === "archived",
                        disabledReason: isJa ? "すでに保管済みです" : "Already archived",
                        onSelect: (row) => archiveRows([row]),
                    },
                    {
                        id: "delete",
                        label: isJa ? "削除" : "Delete",
                        icon: IconTrash,
                        variant: "destructive",
                        disabled: (row) => row.status === "archived",
                        disabledReason: isJa ? "保管済みの行はこの画面から削除できません" : "Archived rows cannot be deleted here",
                        onSelect: (row) => requestDeleteRows([row]),
                    },
                ]}
            />
            <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{isJa ? "キャンペーンを編集" : "Edit campaign"}</DialogTitle>
                        <DialogDescription>
                            {isJa
                                ? "名前と状態を変更すると、保存後にテーブルへ反映されます。"
                                : "Change the name and status, then save to update the table."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form className="gap-5" onSubmit={submitEdit}>
                        <FormGroup>
                            <FormLabel htmlFor="action-data-table-name">{isJa ? "キャンペーン名" : "Campaign name"}</FormLabel>
                            <Input
                                id="action-data-table-name"
                                className="w-full"
                                value={draftName}
                                onChange={(event) => setDraftName(event.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="action-data-table-status">{isJa ? "状態" : "Status"}</FormLabel>
                            <Select
                                id="action-data-table-status"
                                className="w-full"
                                value={draftStatus}
                                onChange={(event) => setDraftStatus(event.target.value as Campaign["status"])}
                            >
                                <option value="active">{isJa ? "公開中" : "Active"}</option>
                                <option value="draft">{isJa ? "下書き" : "Draft"}</option>
                                <option value="archived">{isJa ? "保管済み" : "Archived"}</option>
                            </Select>
                        </FormGroup>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                                {isJa ? "キャンセル" : "Cancel"}
                            </Button>
                            <Button type="submit">{isJa ? "保存" : "Save"}</Button>
                        </DialogFooter>
                    </Form>
                </DialogContent>
            </Dialog>
            <AlertDialog open={pendingDeleteRows.length > 0} onOpenChange={(open) => !open && setPendingDeleteRows([])}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{isJa ? "削除してもよろしいですか？" : "Delete selected rows?"}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {isJa
                                ? `${pendingDeleteRows.length}件のキャンペーンを削除します。この操作は元に戻せません。`
                                : `This will delete ${pendingDeleteRows.length} campaign${pendingDeleteRows.length === 1 ? "" : "s"}. This action cannot be undone.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {pendingDeleteRows.length > 0 ? (
                        <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                            {pendingDeleteRows.slice(0, 3).map((row) => (
                                <div key={row.id} className="truncate">
                                    {row.name}
                                </div>
                            ))}
                            {pendingDeleteRows.length > 3 ? (
                                <div>{isJa ? `ほか ${pendingDeleteRows.length - 3} 件` : `and ${pendingDeleteRows.length - 3} more`}</div>
                            ) : null}
                        </div>
                    ) : null}
                    <AlertDialogFooter>
                        <AlertDialogCancel>{isJa ? "キャンセル" : "Cancel"}</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive-strong text-destructive-strong-foreground hover:bg-destructive-strong"
                            onClick={confirmDeleteRows}
                        >
                            {isJa ? "削除" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function ActionDataTablePage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variants";
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    const code = `"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { IconArchive, IconPencil, IconTrash } from "@tabler/icons-react"
import { ActionDataTable, Badge, type ActionDataTableLabels } from "@gunjo/ui"

type Campaign = {
  id: string
  name: string
  owner: string
  status: "active" | "draft" | "archived"
  updatedAt: string
}

const campaigns: Campaign[] = [
  { id: "c-001", name: "${isJa ? "春の新生活バナー" : "Spring campaign"}", owner: "${isJa ? "青井 花" : "Hana Aoi"}", status: "active", updatedAt: "2026-05-12" },
  { id: "c-002", name: "${isJa ? "アプリ訴求 LP" : "App landing page"}", owner: "${isJa ? "田中 空" : "Sora Tanaka"}", status: "draft", updatedAt: "2026-05-10" },
  { id: "c-003", name: "${isJa ? "法人向け資料広告" : "B2B document ad"}", owner: "${isJa ? "山本 優" : "Yu Yamamoto"}", status: "active", updatedAt: "2026-05-08" },
  { id: "c-004", name: "${isJa ? "旧キャンペーン素材" : "Archived campaign assets"}", owner: "${isJa ? "小林 真央" : "Mao Kobayashi"}", status: "archived", updatedAt: "2026-04-28" },
  { id: "c-005", name: "${isJa ? "展示会フォロー" : "Event follow-up"}", owner: "${isJa ? "中村 蓮" : "Ren Nakamura"}", status: "draft", updatedAt: "2026-04-25" },
]

const statusLabels: Record<Campaign["status"], string> = {
  active: "${isJa ? "公開中" : "Active"}",
  draft: "${isJa ? "下書き" : "Draft"}",
  archived: "${isJa ? "保管済み" : "Archived"}",
}

const statusVariants: Record<Campaign["status"], "default" | "secondary" | "outline"> = {
  active: "default",
  draft: "secondary",
  archived: "outline",
}

const columns: ColumnDef<Campaign>[] = [
  {
    accessorKey: "name",
    header: "${isJa ? "キャンペーン" : "Campaign"}",
    size: 280,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  { accessorKey: "owner", header: "${isJa ? "担当者" : "Owner"}", size: 128 },
  {
    accessorKey: "status",
    header: "${isJa ? "状態" : "Status"}",
    size: 112,
    cell: ({ row }) => {
      const status = row.original.status
      return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>
    },
  },
  { accessorKey: "updatedAt", header: "${isJa ? "更新日" : "Updated"}", size: 120 },
]

const labels: ActionDataTableLabels = {
  filterPlaceholder: "${isJa ? "キャンペーン名で絞り込み..." : "Filter campaigns..."}",
  noResults: "${isJa ? "該当するキャンペーンがありません。" : "No campaigns found."}",
  previous: "${isJa ? "前へ" : "Previous"}",
  next: "${isJa ? "次へ" : "Next"}",
  rowsPerPage: "${isJa ? "表示件数" : "Rows"}",
  selectedRows: (count) => ${isJa ? 'count + "件を選択中"' : 'count + " selected"'},
  selectedRowsLabel: "${isJa ? "選択中" : "selected"}",
  selectAllRows: "${isJa ? "すべての行を選択します" : "Select all rows"}",
  selectRow: (label) => ${isJa ? 'label + "を選択します"' : '"Select " + label'},
  selectAllRowsSelected: "${isJa ? "すべての選択を外します" : "Deselect all rows"}",
  selectRowSelected: (label) => ${isJa ? 'label + "の選択を外します"' : '"Deselect " + label'},
  clearSelection: "${isJa ? "選択を解除" : "Clear selection"}",
  actions: "${isJa ? "行操作" : "Row actions"}",
  bulkActions: "${isJa ? "一括操作" : "Bulk actions"}",
  bulkActionPlaceholder: "${isJa ? "一括操作" : "Bulk actions"}",
  disabledAction: "${isJa ? "行を選択すると操作できます" : "Select rows first"}",
}

export function CampaignTable() {
  const [rows, setRows] = React.useState(campaigns)

  const archiveRows = (selectedRows: Campaign[]) => {
    const selectedIds = new Set(selectedRows.map((row) => row.id))
    setRows((current) =>
      current.map((row) =>
        selectedIds.has(row.id)
          ? { ...row, status: "archived", updatedAt: "2026-05-22" }
          : row
      )
    )
  }

  const deleteRows = (selectedRows: Campaign[]) => {
    const selectedIds = new Set(selectedRows.map((row) => row.id))
    setRows((current) => current.filter((row) => !selectedIds.has(row.id)))
  }

  return (
    <ActionDataTable
      columns={columns}
      data={rows}
      filter={{ columnId: "name", placeholder: labels.filterPlaceholder }}
      labels={labels}
      getRowId={(row) => row.id}
      getRowLabel={(row) => row.name}
      rowActions={[
        {
          id: "edit",
          label: "${isJa ? "編集" : "Edit"}",
          icon: IconPencil,
          onSelect: (row) => window.alert(row.name + "${isJa ? "を編集します" : " will be edited"}"),
        },
        {
          id: "archive",
          label: "${isJa ? "保管" : "Archive"}",
          icon: IconArchive,
          disabled: (row) => row.status === "archived",
          disabledReason: "${isJa ? "すでに保管済みです" : "Already archived"}",
          onSelect: (row) => archiveRows([row]),
        },
        {
          id: "delete",
          label: "${isJa ? "削除" : "Delete"}",
          icon: IconTrash,
          variant: "destructive",
          disabled: (row) => row.status === "archived",
          disabledReason: "${isJa ? "保管済みの行はこの画面から削除できません" : "Archived rows cannot be deleted here"}",
          onSelect: (row) => deleteRows([row]),
        },
      ]}
      bulkActions={[
        {
          id: "archive",
          label: "${isJa ? "保管" : "Archive"}",
          icon: IconArchive,
          disabledReason: "${isJa ? "行を選択すると保管できます" : "Select rows to archive"}",
          onSelect: archiveRows,
        },
        {
          id: "delete",
          label: "${isJa ? "削除" : "Delete"}",
          icon: IconTrash,
          variant: "destructive",
          disabledReason: "${isJa ? "行を選択すると削除できます" : "Select rows to delete"}",
          onSelect: deleteRows,
        },
      ]}
    />
  )
}`;

    const usageCode = code;

    const propsData = [
        {
            name: "columns",
            type: "ColumnDef<TData, TValue>[]",
            description: isJa ? "表示列です。選択列と行操作列は ActionDataTable が追加します。" : "Display columns. ActionDataTable adds selection and row-action columns.",
        },
        {
            name: "data",
            type: "TData[]",
            description: isJa ? "表示する行データです。" : "Rows displayed in the table.",
        },
        {
            name: "getRowId",
            type: "(row: TData, index: number) => string",
            description: isJa ? "選択状態を維持するための安定した行 ID を返します。" : "Returns a stable row id for selection state.",
        },
        {
            name: "getRowLabel",
            type: "(row: TData, index: number) => string",
            description: isJa ? "行選択チェックボックスのアクセシブル名に使うラベルです。" : "Label used for row-selection checkbox accessibility.",
        },
        {
            name: "enableSelection",
            type: "boolean",
            default: "true",
            description: isJa ? "行選択列を表示するかどうかです。" : "Controls whether the selection column is shown.",
        },
        {
            name: "rowActions",
            type: "ActionDataTableRowAction<TData>[]",
            description: isJa ? "各行の右端に表示する操作です。無効理由はツールチップで説明します。" : "Actions shown at the end of each row. Disabled reasons appear in tooltips.",
        },
        {
            name: "bulkActions",
            type: "ActionDataTableBulkAction<TData>[]",
            description: isJa ? "選択行に対して実行する一括操作です。" : "Bulk actions executed against selected rows.",
        },
        {
            name: "labels",
            type: "ActionDataTableLabels",
            description: isJa ? "DataTable の文言に加えて、選択・一括操作・行操作の文言を差し替えます。" : "Overrides DataTable labels plus selection, bulk-action, and row-action labels.",
        },
    ];

    return (
        <ComponentLayout
            title={meta.actionDataTable.title}
            description={meta.actionDataTable.description}
            usedComponents={[
                { name: "ActionDataTable", href: "/docs/components/action-data-table" },
                { name: "DataTable", href: "/docs/components/data-table" },
                { name: "Checkbox", href: "/docs/components/checkbox" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Badge", href: "/docs/components/badge" },
                { name: "Form", href: "/docs/components/form" },
                { name: "Input", href: "/docs/components/input" },
                { name: "Select", href: "/docs/components/select" },
                { name: "Dialog", href: "/docs/components/dialog" },
                { name: "AlertDialog", href: "/docs/components/alert-dialog" },
            ]}
            relatedComponents={[
                { name: "DataTable", href: "/docs/components/data-table" },
                { name: "Table", href: "/docs/components/table" },
                { name: "FilterButton", href: "/docs/components/filter-button" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto" previewBodyWidth="xl">
                <ActionDataTableDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "with-actions",
                            title: isJa ? "選択と一括操作" : "Selection and bulk actions",
                            description: isJa
                                ? "行を選択すると一括操作が有効になり、未選択時は理由をツールチップで説明します。"
                                : "Bulk actions become available after selecting rows and explain disabled states with tooltips.",
                            preview: <ActionDataTableDemo compact />,
                            previewHeight: "auto",
                            previewClassName: "max-w-none",
                            code,
                        },
                        {
                            key: "row-actions",
                            title: isJa ? "行操作" : "Row actions",
                            description: isJa
                                ? "各行の操作は右端に固定し、無効な行操作は理由をツールチップで表示します。"
                                : "Row actions stay at the end of each row and disabled actions explain why.",
                            preview: <ActionDataTableDemo compact />,
                            previewHeight: "auto",
                            previewClassName: "max-w-none",
                            code,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="usage">
                    {sectionLabels.usage}
                </h2>
                <CodeCopyButton code={usageCode} />
                <CodeBlock code={usageCode} />
            </section>
        </ComponentLayout>
    );
}
