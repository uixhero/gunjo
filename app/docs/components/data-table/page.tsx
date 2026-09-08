"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { Badge, Button, DataTable, type DataTableLabels, Input } from "@gunjo/ui";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

type Member = {
    id: string;
    name: string;
    role: "owner" | "admin" | "member";
    status: "active" | "invited" | "suspended";
    joinedAt: string;
};

const TEAM_DATA: Member[] = [
    { id: "1", name: "青井 花", role: "owner", status: "active", joinedAt: "2024-01-15" },
    { id: "2", name: "田中 空", role: "admin", status: "active", joinedAt: "2024-03-08" },
    { id: "3", name: "山本 優", role: "member", status: "invited", joinedAt: "2025-04-22" },
    { id: "4", name: "小林 真央", role: "member", status: "active", joinedAt: "2024-06-30" },
    { id: "5", name: "中村 蓮", role: "admin", status: "suspended", joinedAt: "2024-11-04" },
    { id: "6", name: "佐藤 葵", role: "member", status: "active", joinedAt: "2025-02-12" },
    { id: "7", name: "鈴木 凛", role: "member", status: "active", joinedAt: "2025-06-18" },
    { id: "8", name: "高橋 海", role: "member", status: "invited", joinedAt: "2025-08-01" },
    { id: "9", name: "伊藤 碧", role: "admin", status: "active", joinedAt: "2025-09-20" },
    { id: "10", name: "渡辺 陽", role: "member", status: "suspended", joinedAt: "2025-10-11" },
    { id: "11", name: "加藤 澪", role: "member", status: "active", joinedAt: "2025-12-03" },
    { id: "12", name: "森 七海", role: "member", status: "active", joinedAt: "2026-01-09" },
    { id: "13", name: "石井 悠", role: "admin", status: "active", joinedAt: "2026-02-14" },
    { id: "14", name: "清水 旭", role: "member", status: "invited", joinedAt: "2026-03-07" },
    { id: "15", name: "林 彩", role: "member", status: "active", joinedAt: "2026-04-16" },
    { id: "16", name: "井上 湊", role: "member", status: "suspended", joinedAt: "2026-05-02" },
    { id: "17", name: "木村 詩", role: "member", status: "active", joinedAt: "2026-05-10" },
    { id: "18", name: "斎藤 光", role: "member", status: "active", joinedAt: "2026-05-21" },
];

const STATUS_VARIANT: Record<Member["status"], "default" | "secondary" | "destructive"> = {
    active: "default",
    invited: "secondary",
    suspended: "destructive",
};

// onRowClick demo: clicking the row body (or Enter on the focused row) selects it,
// while clicking an interactive control inside the row (the 詳細 button) does NOT
// fire the row click.
function RowClickDemo() {
    const [selected, setSelected] = React.useState<string | null>(null);
    const [action, setAction] = React.useState<string | null>(null);
    const cols: ColumnDef<Member>[] = [
        { accessorKey: "name", header: "氏名" },
        { accessorKey: "role", header: "権限" },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <Button size="sm" variant="outline" onClick={() => setAction(row.original.name)}>
                    詳細
                </Button>
            ),
        },
    ];
    return (
        <div className="flex w-full flex-col gap-3">
            <DataTable columns={cols} data={TEAM_DATA.slice(0, 4)} onRowClick={(m) => setSelected(m.name)} />
            <p className="text-sm text-muted-foreground" aria-live="polite" data-testid="rowclick-status">
                行クリック: <span className="font-medium text-foreground">{selected ?? "—"}</span> ／ 詳細ボタン:{" "}
                <span className="font-medium text-foreground">{action ?? "—"}</span>
            </p>
        </div>
    );
}

// Totals/footer demo: a column's TanStack `footer` renders a totals row. The
// totals sum the *filtered* rows so they match what's shown. Editing an amount
// updates the footer live. (#255)
type Invoice = { id: string; item: string; qty: number; amount: number };

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

function FooterTotalsDemo({ isJa }: { isJa: boolean }) {
    const [rows, setRows] = React.useState<Invoice[]>([
        { id: "1", item: isJa ? "初期設定サポート" : "Onboarding", qty: 1, amount: 40000 },
        { id: "2", item: isJa ? "月額プラン" : "Monthly plan", qty: 3, amount: 12000 },
        { id: "3", item: isJa ? "追加ストレージ" : "Extra storage", qty: 2, amount: 3000 },
    ]);
    const setAmount = (id: string, value: number) =>
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, amount: value } : r)));

    const cols: ColumnDef<Invoice>[] = [
        { accessorKey: "item", header: isJa ? "品目" : "Item", footer: () => (isJa ? "合計" : "Total") },
        {
            accessorKey: "qty",
            header: isJa ? "数量" : "Qty",
            footer: ({ table }) =>
                table.getFilteredRowModel().rows.reduce((sum, r) => sum + r.original.qty, 0),
        },
        {
            accessorKey: "amount",
            header: isJa ? "金額" : "Amount",
            cell: ({ row }) => (
                <Input
                    type="number"
                    aria-label={`${row.original.item}${isJa ? " の金額" : " amount"}`}
                    value={row.original.amount}
                    onChange={(event) => setAmount(row.original.id, Number(event.target.value) || 0)}
                    className="h-8 w-28"
                />
            ),
            footer: ({ table }) =>
                yen(table.getFilteredRowModel().rows.reduce((sum, r) => sum + r.original.amount, 0)),
        },
    ];

    return (
        <div className="flex w-full flex-col gap-2">
            <DataTable
                columns={cols}
                data={rows}
                filter={null}
                caption={isJa ? "請求内訳" : "Invoice breakdown"}
                captionClassName="sr-only"
            />
            <p className="text-xs text-muted-foreground">
                {isJa ? "金額を編集すると合計行が追従します。" : "Edit an amount and the totals row follows."}
            </p>
        </div>
    );
}

function getTableLabels(isJa: boolean): DataTableLabels {
    return isJa
        ? {
            filterPlaceholder: "名前で絞り込み...",
            noResults: "該当する結果がありません。",
            page: "ページ",
            of: "/",
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
        }
        : {
            filterPlaceholder: "Filter by name...",
            noResults: "No results.",
            page: "Page",
            of: "of",
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
        };
}

function getColumns(isJa: boolean): ColumnDef<Member>[] {
    const roleLabels: Record<Member["role"], string> = isJa
        ? { owner: "所有者", admin: "管理者", member: "メンバー" }
        : { owner: "Owner", admin: "Admin", member: "Member" };
    const statusLabels: Record<Member["status"], string> = isJa
        ? { active: "有効", invited: "招待中", suspended: "停止中" }
        : { active: "Active", invited: "Invited", suspended: "Suspended" };

    return [
        {
            accessorKey: "name",
            header: isJa ? "名前" : "Name",
            cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
        },
        {
            accessorKey: "role",
            header: isJa ? "権限" : "Role",
            cell: ({ row }) => roleLabels[row.getValue<Member["role"]>("role")],
        },
        {
            accessorKey: "status",
            header: isJa ? "状態" : "Status",
            cell: ({ row }) => {
                const status = row.getValue<Member["status"]>("status");
                return <Badge variant={STATUS_VARIANT[status]}>{statusLabels[status]}</Badge>;
            },
        },
        {
            accessorKey: "joinedAt",
            header: isJa ? "参加日" : "Joined",
        },
    ];
}

export default function DataTablePage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variants";
    const columns = React.useMemo(() => getColumns(isJa), [isJa]);
    const labels = React.useMemo(() => getTableLabels(isJa), [isJa]);

    const code = isJa
        ? `import type { ColumnDef } from "@tanstack/react-table"
import { Badge, DataTable, type DataTableLabels } from "@gunjo/ui"

type Member = {
  id: string
  name: string
  role: "owner" | "admin" | "member"
  status: "active" | "invited" | "suspended"
  joinedAt: string
}

const members: Member[] = [
  { id: "1", name: "青井 花", role: "owner", status: "active", joinedAt: "2024-01-15" },
  { id: "2", name: "田中 空", role: "admin", status: "active", joinedAt: "2024-03-08" },
  { id: "3", name: "山本 優", role: "member", status: "invited", joinedAt: "2025-04-22" },
  { id: "4", name: "小林 真央", role: "member", status: "active", joinedAt: "2024-06-30" },
  { id: "5", name: "中村 蓮", role: "admin", status: "suspended", joinedAt: "2024-11-04" },
  { id: "6", name: "佐藤 葵", role: "member", status: "active", joinedAt: "2025-02-12" },
  { id: "7", name: "鈴木 凛", role: "member", status: "active", joinedAt: "2025-06-18" },
  { id: "8", name: "高橋 海", role: "member", status: "invited", joinedAt: "2025-08-01" },
  { id: "9", name: "伊藤 碧", role: "admin", status: "active", joinedAt: "2025-09-20" },
  { id: "10", name: "渡辺 陽", role: "member", status: "suspended", joinedAt: "2025-10-11" },
  { id: "11", name: "加藤 澪", role: "member", status: "active", joinedAt: "2025-12-03" },
  { id: "12", name: "森 七海", role: "member", status: "active", joinedAt: "2026-01-09" },
  { id: "13", name: "石井 悠", role: "admin", status: "active", joinedAt: "2026-02-14" },
  { id: "14", name: "清水 旭", role: "member", status: "invited", joinedAt: "2026-03-07" },
  { id: "15", name: "林 彩", role: "member", status: "active", joinedAt: "2026-04-16" },
  { id: "16", name: "井上 湊", role: "member", status: "suspended", joinedAt: "2026-05-02" },
  { id: "17", name: "木村 詩", role: "member", status: "active", joinedAt: "2026-05-10" },
  { id: "18", name: "斎藤 光", role: "member", status: "active", joinedAt: "2026-05-21" },
]

const roleLabels: Record<Member["role"], string> = {
  owner: "所有者",
  admin: "管理者",
  member: "メンバー",
}

const statusLabels: Record<Member["status"], string> = {
  active: "有効",
  invited: "招待中",
  suspended: "停止中",
}

const statusVariants: Record<Member["status"], "default" | "secondary" | "destructive"> = {
  active: "default",
  invited: "secondary",
  suspended: "destructive",
}

const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: "名前",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "role",
    header: "権限",
    cell: ({ row }) => roleLabels[row.original.role],
  },
  {
    accessorKey: "status",
    header: "状態",
    cell: ({ row }) => {
      const status = row.original.status
      return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>
    },
  },
  { accessorKey: "joinedAt", header: "参加日" },
]

const labels: DataTableLabels = {
  filterPlaceholder: "名前で絞り込み...",
  noResults: "該当する結果がありません。",
  previous: "前へ",
  next: "次へ",
  rowsPerPage: "表示件数",
  pageSizeOption: (size) => size + "件",
}

export function MembersTable() {
  return (
    <DataTable
      columns={columns}
      data={members}
      filter={{ columnId: "name", placeholder: labels.filterPlaceholder }}
      labels={labels}
      pageSize={10}
      pageSizeOptions={[10, 25, 50, 100, 200]}
    />
  )
}`
        : `import type { ColumnDef } from "@tanstack/react-table"
import { Badge, DataTable, type DataTableLabels } from "@gunjo/ui"

type Member = {
  id: string
  name: string
  role: "owner" | "admin" | "member"
  status: "active" | "invited" | "suspended"
  joinedAt: string
}

const members: Member[] = [
  { id: "1", name: "Hana Aoi", role: "owner", status: "active", joinedAt: "2024-01-15" },
  { id: "2", name: "Sora Tanaka", role: "admin", status: "active", joinedAt: "2024-03-08" },
  { id: "3", name: "Yu Yamamoto", role: "member", status: "invited", joinedAt: "2025-04-22" },
  { id: "4", name: "Mao Kobayashi", role: "member", status: "active", joinedAt: "2024-06-30" },
  { id: "5", name: "Ren Nakamura", role: "admin", status: "suspended", joinedAt: "2024-11-04" },
  { id: "6", name: "Aoi Sato", role: "member", status: "active", joinedAt: "2025-02-12" },
  { id: "7", name: "Rin Suzuki", role: "member", status: "active", joinedAt: "2025-06-18" },
  { id: "8", name: "Kai Takahashi", role: "member", status: "invited", joinedAt: "2025-08-01" },
  { id: "9", name: "Aoi Ito", role: "admin", status: "active", joinedAt: "2025-09-20" },
  { id: "10", name: "Haru Watanabe", role: "member", status: "suspended", joinedAt: "2025-10-11" },
  { id: "11", name: "Mio Kato", role: "member", status: "active", joinedAt: "2025-12-03" },
  { id: "12", name: "Nanami Mori", role: "member", status: "active", joinedAt: "2026-01-09" },
  { id: "13", name: "Yu Ishii", role: "admin", status: "active", joinedAt: "2026-02-14" },
  { id: "14", name: "Asahi Shimizu", role: "member", status: "invited", joinedAt: "2026-03-07" },
  { id: "15", name: "Aya Hayashi", role: "member", status: "active", joinedAt: "2026-04-16" },
  { id: "16", name: "Minato Inoue", role: "member", status: "suspended", joinedAt: "2026-05-02" },
  { id: "17", name: "Uta Kimura", role: "member", status: "active", joinedAt: "2026-05-10" },
  { id: "18", name: "Hikaru Saito", role: "member", status: "active", joinedAt: "2026-05-21" },
]

const roleLabels: Record<Member["role"], string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
}

const statusLabels: Record<Member["status"], string> = {
  active: "Active",
  invited: "Invited",
  suspended: "Suspended",
}

const statusVariants: Record<Member["status"], "default" | "secondary" | "destructive"> = {
  active: "default",
  invited: "secondary",
  suspended: "destructive",
}

const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => roleLabels[row.original.role],
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>
    },
  },
  { accessorKey: "joinedAt", header: "Joined" },
]

const labels: DataTableLabels = {
  filterPlaceholder: "Filter by name...",
  noResults: "No results.",
  previous: "Previous",
  next: "Next",
  rowsPerPage: "Rows",
  pageSizeOption: (size) => size + " rows",
}

export function MembersTable() {
  return (
    <DataTable
      columns={columns}
      data={members}
      filter={{ columnId: "name", placeholder: labels.filterPlaceholder }}
      labels={labels}
      pageSize={10}
      pageSizeOptions={[10, 25, 50, 100, 200]}
    />
  )
}`;

    const usageCode = code;
    const emptyCode = code.replace(
        /const members: Member\[] = \[[\s\S]*?\]\n\nconst roleLabels/,
        "const members: Member[] = []\n\nconst roleLabels"
    );

    const footerTotalsCode = isJa
        ? `import type { ColumnDef, Table } from "@tanstack/react-table";
import { DataTable } from "@gunjo/ui";

type Invoice = { id: string; item: string; qty: number; amount: number };

const invoices: Invoice[] = [
  { id: "1", item: "初期設定サポート", qty: 1, amount: 40000 },
  { id: "2", item: "月額プラン", qty: 3, amount: 12000 },
  { id: "3", item: "追加ストレージ", qty: 2, amount: 3000 },
];

const yen = (n: number) => "¥" + n.toLocaleString("ja-JP");

// 合計はフィルタ後の全行で計算します（表示中のページだけではありません）。
const sumColumn = (table: Table<Invoice>, get: (row: Invoice) => number) =>
  table.getFilteredRowModel().rows.reduce((sum, r) => sum + get(r.original), 0);

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "item",
    header: "品目",
    footer: () => "合計",
  },
  {
    accessorKey: "qty",
    header: "数量",
    footer: ({ table }) => sumColumn(table, (r) => r.qty),
  },
  {
    accessorKey: "amount",
    header: "金額",
    cell: ({ row }) => yen(row.original.amount),
    footer: ({ table }) => yen(sumColumn(table, (r) => r.amount)),
  },
];

export function InvoiceTotalsTable() {
  return <DataTable columns={columns} data={invoices} filter={null} />;
}`
        : `import type { ColumnDef, Table } from "@tanstack/react-table";
import { DataTable } from "@gunjo/ui";

type Invoice = { id: string; item: string; qty: number; amount: number };

const invoices: Invoice[] = [
  { id: "1", item: "Onboarding", qty: 1, amount: 40000 },
  { id: "2", item: "Monthly plan", qty: 3, amount: 12000 },
  { id: "3", item: "Extra storage", qty: 2, amount: 3000 },
];

const yen = (n: number) => "¥" + n.toLocaleString("ja-JP");

// Total a numeric field over the *filtered* rows (not just the page).
const sumColumn = (table: Table<Invoice>, get: (row: Invoice) => number) =>
  table.getFilteredRowModel().rows.reduce((sum, r) => sum + get(r.original), 0);

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "item",
    header: "Item",
    footer: () => "Total",
  },
  {
    accessorKey: "qty",
    header: "Qty",
    footer: ({ table }) => sumColumn(table, (r) => r.qty),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => yen(row.original.amount),
    footer: ({ table }) => yen(sumColumn(table, (r) => r.amount)),
  },
];

export function InvoiceTotalsTable() {
  return <DataTable columns={columns} data={invoices} filter={null} />;
}`;

    const propsData = [
        {
            name: "columns",
            type: "ColumnDef<TData, TValue>[]",
            description: isJa ? "行データをどう表示するかを定義する列設定です。" : "Column definitions that describe how each row is rendered.",
        },
        {
            name: "data",
            type: "TData[]",
            description: isJa ? "テーブルに表示する行データです。" : "Rows displayed in the table.",
        },
        {
            name: "columns[].footer",
            type: "ColumnDef['footer']",
            description: isJa
                ? "いずれかの列に TanStack の footer を定義すると、合計行（<tfoot>）を表示します。footer(({ table }) => …) で getFilteredRowModel() を使うとフィルタ後の合計になります。card モードでは表示されません。(#255)"
                : "Defining a TanStack footer on any column renders a totals row (<tfoot>). Use footer(({ table }) => …) with getFilteredRowModel() to total the filtered rows. Not shown in card mode. (#255)",
        },
        {
            name: "filter",
            type: "{ columnId: string; placeholder?: string } | null",
            default: "undefined",
            description: isJa ? "指定した列を絞り込む入力欄を表示します。null で非表示にします。" : "Shows a filter input for a column. Pass null to hide it.",
        },
        {
            name: "pageSize",
            type: "number",
            default: "10",
            description: isJa ? "1ページに表示する行数です。" : "Rows shown per page.",
        },
        {
            name: "pageSizeOptions",
            type: "number[]",
            default: "[10, 25, 50, 100, 200]",
            description: isJa ? "ページネーションで選べる表示件数です。" : "Selectable page sizes for pagination.",
        },
        {
            name: "labels",
            type: "DataTableLabels",
            description: isJa ? "検索、空状態、並び替え、ページネーションの文言を差し替えます。" : "Overrides labels for filtering, empty state, sorting, and pagination.",
        },
        {
            name: "onRowClick",
            type: "(row: TData) => void",
            description: isJa ? "指定すると各行がフォーカス可能・アクティブ化可能になり、クリック/Enter で呼ばれます。行内のインタラクティブ要素（ボタン等）のクリックは除外されます。" : "Makes each row focusable/activatable; called on click or Enter. Clicks on interactive controls inside the row are excluded.",
        },
        {
            name: "renderCard",
            type: "(row: TData) => ReactNode",
            description: isJa
                ? "モバイル（< md）で行をカードのスタックとして表示します。onRowClick 指定時はカード自体が role=\"button\" になるため、非インタラクティブな内容を返すこと（カード全体をタップ可能にするには onRowClick を使い、カードのルートに自前の button/a を置かない）。行内の小さな操作ボタンは可。関数propのため Client Component からのみ渡すこと。(#333/#338)"
                : "Renders rows as a stacked card list on mobile (< md). With onRowClick the card is itself role=\"button\" — return non-interactive content (use onRowClick to make the whole card tappable; don't add your own button/link as the card root). Small per-row controls are fine. Function prop — pass only from a Client Component. (#333/#338)",
        },
        {
            name: "caption",
            type: "React.ReactNode",
            description: isJa
                ? "テーブルの <caption>（アクセシブル名）。複数テーブルがある画面で screen reader が区別できます。既定は可視、captionClassName=\"sr-only\" で読み上げ専用に。(#298)"
                : "Renders a <caption> (the table's accessible name). Helps screen-reader users tell multiple tables apart. Visible by default; pass captionClassName=\"sr-only\" to hide it visually. (#298)",
        },
        {
            name: "aria-label / aria-labelledby",
            type: "string",
            description: isJa
                ? "可視 caption が無いとき <table> に名前を付けます。既存の見出し（CardTitle 等）の id を指す aria-labelledby を推奨。(#298)"
                : "Names the <table> when there's no visible caption. Prefer aria-labelledby pointing at an existing heading's id (e.g. a CardTitle). (#298)",
        },
        {
            name: "hidePaginationSummary",
            type: "boolean",
            description: isJa
                ? "ページネーション見出しの「1 - 4 / 4」サマリを隠します。狭いホスト（例: 約420px のマスター列）向け。ページャは自動で下段に折り返します。(#311)"
                : "Hides the \"1 - 4 / 4\" summary text in the pagination header — for a narrow host (e.g. a ~420px master column). The pager still wraps below on its own line. (#311)",
        },
        {
            name: "className",
            type: "string",
            description: isJa ? "ラッパーに追加するクラスです。" : "Additional class names applied to the wrapper.",
        },
    ];

    return (
        <ComponentLayout
            title={(displayMetadata as Record<string, { title: string }>).dataTable.title}
            description={(displayMetadata as Record<string, { description: string }>).dataTable.description}
            usedComponents={[
                { name: "DataTable", href: "/docs/components/data-table" },
                { name: "Input", href: "/docs/components/input" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Badge", href: "/docs/components/badge" },
                { name: "Icon", href: "/docs/components/icon" },
            ]}
            relatedComponents={[
                { name: "ActionDataTable", href: "/docs/components/action-data-table" },
                { name: "Table", href: "/docs/components/table" },
                { name: "Pagination", href: "/docs/components/pagination" },
                { name: "SortButton", href: "/docs/components/sort-button" },
            ]}
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: テーブル（Table）" : "UIXHERO: Table (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/table`,
                    relation: "nearest",
                },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto" previewBodyWidth="xl">
                <DataTable
                    columns={columns}
                    data={TEAM_DATA}
                    filter={{ columnId: "name", placeholder: labels.filterPlaceholder }}
                    labels={labels}
                    renderCard={(m) => (
                        <div className="flex flex-col gap-1">
                            <span className="font-medium">{m.name}</span>
                            <span className="capitalize text-muted-foreground">{m.role} · {m.status}</span>
                            <span className="text-xs text-muted-foreground">{m.joinedAt}</span>
                        </div>
                    )}
                />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "row-click",
                            title: isJa ? "行クリック" : "Row click",
                            description: isJa
                                ? "onRowClick で行全体をクリック（またはフォーカス時に Enter）で開けます。行内のボタンなどインタラクティブ要素のクリックは行クリックを発火しません。"
                                : "With onRowClick the whole row is clickable (or Enter when focused). Clicking an interactive control inside the row does not trigger the row click.",
                            preview: <RowClickDemo />,
                            previewHeight: "auto",
                            previewClassName: "max-w-none",
                            code: `<DataTable\n  columns={columns}\n  data={data}\n  onRowClick={(row) => openDetail(row)}\n/>`,
                        },
                        {
                            key: "rich-cells",
                            title: isJa ? "バッジ付きセル" : "Rich cells",
                            description: isJa
                                ? "セル内では Badge や Button などの GunjoUI コンポーネントを組み合わせられます。"
                                : "Cells can compose GunjoUI components such as Badge and Button.",
                            preview: (
                                <DataTable
                                    columns={columns}
                                    data={TEAM_DATA}
                                    filter={{ columnId: "name", placeholder: labels.filterPlaceholder }}
                                    labels={labels}
                                />
                            ),
                            previewHeight: "auto",
                            previewClassName: "max-w-none",
                            code,
                        },
                        {
                            key: "empty",
                            title: isJa ? "空状態" : "Empty state",
                            description: isJa
                                ? "データがない場合は、テーブル内に空状態の行を表示します。"
                                : "When no rows are available, the table renders an empty-state row.",
                            preview: (
                                <DataTable
                                    columns={columns}
                                    data={[]}
                                    filter={{ columnId: "name", placeholder: labels.filterPlaceholder }}
                                    labels={labels}
                                />
                            ),
                            previewHeight: "auto",
                            previewClassName: "max-w-none",
                            code: emptyCode,
                        },
                        {
                            key: "no-filter",
                            title: isJa ? "絞り込みなし" : "Without filter",
                            description: isJa
                                ? "一覧が短い場合や外部フィルターを使う場合は、テーブル内の検索入力を非表示にします。"
                                : "Hide the built-in filter when the table is short or filtered elsewhere.",
                            preview: (
                                <DataTable columns={columns} data={TEAM_DATA.slice(0, 10)} filter={null} labels={labels} />
                            ),
                            previewHeight: "auto",
                            previewClassName: "max-w-none",
                            code: code.replace("filter={{ columnId: \"name\", placeholder: labels.filterPlaceholder }}", "filter={null}"),
                        },
                        {
                            key: "footer-totals",
                            title: isJa ? "合計 / フッター行" : "Totals / footer row",
                            description: isJa
                                ? "列に TanStack の footer を定義すると、テーブル下部に合計行（<tfoot>）が出ます。合計は「フィルタ後の全行」で計算するので、表示中のページだけでなく絞り込み結果に一致します。金額を編集すると合計が追従します。card モード（renderCard）では出ないので、その場合は合計をカード外に置いてください。"
                                : "Define a TanStack footer on a column to render a totals row (<tfoot>) at the bottom. Totals here sum the filtered rows, so they match the filter (not just the current page). Edit an amount to watch the total follow. Not shown in card mode (renderCard) — put totals outside the cards there.",
                            preview: <FooterTotalsDemo isJa={isJa} />,
                            previewHeight: "auto",
                            previewClassName: "max-w-none",
                            code: footerTotalsCode,
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
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>横スクロールをこの箱の中に閉じ込めた。</strong>表は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">overflow-x-auto</code> の入れ物に入れ、さらに <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">[contain:paint]</code> を付けています。これが無いと、幅の広い表がスマホ（375px）でページ全体の横スクロールを引き起こしていました（#289）。表そのものは最低 720px を確保します。
                        </li>
                        <li>
                            <strong>スマホでは「横に流す」か「積み直す」かを選べる。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">renderCard</code> を渡すと、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">md</code> 未満では同じ行をカードの縦積みで出します（#195）。渡さなければどの幅でも表のまま横に流れます。資料は「行を読むのではなく列をスキャンする」を核に挙げていますが、スマホには列を並べる幅が無いので、そこだけ形を変える口を開けました。
                        </li>
                        <li>
                            <strong>並べ替えの状態は見出しのセルが持つ。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-sort</code> は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">th</code> に付けてあり、中の並べ替えボタンには付けていません。二重に読み上げられるのを避けるためです。表の名前は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">caption</code> か <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-labelledby</code> で必ず付けられるようにしました（#298）。1つの画面に表が複数あるとき、読み上げで区別が付かなくなるからです。
                            <br />
                            一般の表の設計は UIXHERO の「テーブル」にあります。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Horizontal scrolling is contained in this box.</strong> The table sits in an <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">overflow-x-auto</code> container marked <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">[contain:paint]</code>. Without that, a wide table leaked page-level horizontal scroll on a 375px phone (#289). The table itself holds a 720px floor.
                        </li>
                        <li>
                            <strong>On a phone you choose between scrolling and restacking.</strong> Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">renderCard</code> and rows below <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">md</code> render as a stacked card list instead (#195); omit it and the table stays a table at every width and scrolls sideways. The article&rsquo;s core is scanning columns rather than reading rows, but a phone has no room for columns, so that is the one place the shape is allowed to change.
                        </li>
                        <li>
                            <strong>Sort state lives on the header cell.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-sort</code> is set on the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">th</code>, not on the button inside it, so the state is not announced twice. Every table can be named through <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">caption</code> or <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-labelledby</code> (#298), because several tables on one screen are otherwise indistinguishable to a screen reader.
                            <br />
                            The general design of tables is covered by UIXHERO&rsquo;s table article.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
