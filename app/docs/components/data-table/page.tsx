"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { Badge, DataTable, type DataTableLabels } from "@gunjo/ui";

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

    const code = `import type { ColumnDef } from "@tanstack/react-table"
import { Badge, DataTable, type DataTableLabels } from "@gunjo/ui"

type Member = {
  id: string
  name: string
  role: "owner" | "admin" | "member"
  status: "active" | "invited" | "suspended"
  joinedAt: string
}

const members: Member[] = [
  { id: "1", name: "${isJa ? "青井 花" : "Hana Aoi"}", role: "owner", status: "active", joinedAt: "2024-01-15" },
  { id: "2", name: "${isJa ? "田中 空" : "Sora Tanaka"}", role: "admin", status: "active", joinedAt: "2024-03-08" },
  { id: "3", name: "${isJa ? "山本 優" : "Yu Yamamoto"}", role: "member", status: "invited", joinedAt: "2025-04-22" },
  { id: "4", name: "${isJa ? "小林 真央" : "Mao Kobayashi"}", role: "member", status: "active", joinedAt: "2024-06-30" },
  { id: "5", name: "${isJa ? "中村 蓮" : "Ren Nakamura"}", role: "admin", status: "suspended", joinedAt: "2024-11-04" },
  { id: "6", name: "${isJa ? "佐藤 葵" : "Aoi Sato"}", role: "member", status: "active", joinedAt: "2025-02-12" },
  { id: "7", name: "${isJa ? "鈴木 凛" : "Rin Suzuki"}", role: "member", status: "active", joinedAt: "2025-06-18" },
  { id: "8", name: "${isJa ? "高橋 海" : "Kai Takahashi"}", role: "member", status: "invited", joinedAt: "2025-08-01" },
  { id: "9", name: "${isJa ? "伊藤 碧" : "Aoi Ito"}", role: "admin", status: "active", joinedAt: "2025-09-20" },
  { id: "10", name: "${isJa ? "渡辺 陽" : "Haru Watanabe"}", role: "member", status: "suspended", joinedAt: "2025-10-11" },
  { id: "11", name: "${isJa ? "加藤 澪" : "Mio Kato"}", role: "member", status: "active", joinedAt: "2025-12-03" },
  { id: "12", name: "${isJa ? "森 七海" : "Nanami Mori"}", role: "member", status: "active", joinedAt: "2026-01-09" },
  { id: "13", name: "${isJa ? "石井 悠" : "Yu Ishii"}", role: "admin", status: "active", joinedAt: "2026-02-14" },
  { id: "14", name: "${isJa ? "清水 旭" : "Asahi Shimizu"}", role: "member", status: "invited", joinedAt: "2026-03-07" },
  { id: "15", name: "${isJa ? "林 彩" : "Aya Hayashi"}", role: "member", status: "active", joinedAt: "2026-04-16" },
  { id: "16", name: "${isJa ? "井上 湊" : "Minato Inoue"}", role: "member", status: "suspended", joinedAt: "2026-05-02" },
  { id: "17", name: "${isJa ? "木村 詩" : "Uta Kimura"}", role: "member", status: "active", joinedAt: "2026-05-10" },
  { id: "18", name: "${isJa ? "斎藤 光" : "Hikaru Saito"}", role: "member", status: "active", joinedAt: "2026-05-21" },
]

const roleLabels: Record<Member["role"], string> = {
  owner: "${isJa ? "所有者" : "Owner"}",
  admin: "${isJa ? "管理者" : "Admin"}",
  member: "${isJa ? "メンバー" : "Member"}",
}

const statusLabels: Record<Member["status"], string> = {
  active: "${isJa ? "有効" : "Active"}",
  invited: "${isJa ? "招待中" : "Invited"}",
  suspended: "${isJa ? "停止中" : "Suspended"}",
}

const statusVariants: Record<Member["status"], "default" | "secondary" | "destructive"> = {
  active: "default",
  invited: "secondary",
  suspended: "destructive",
}

const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: "${isJa ? "名前" : "Name"}",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "role",
    header: "${isJa ? "権限" : "Role"}",
    cell: ({ row }) => roleLabels[row.original.role],
  },
  {
    accessorKey: "status",
    header: "${isJa ? "状態" : "Status"}",
    cell: ({ row }) => {
      const status = row.original.status
      return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>
    },
  },
  { accessorKey: "joinedAt", header: "${isJa ? "参加日" : "Joined"}" },
]

const labels: DataTableLabels = {
  filterPlaceholder: "${isJa ? "名前で絞り込み..." : "Filter by name..."}",
  noResults: "${isJa ? "該当する結果がありません。" : "No results."}",
  previous: "${isJa ? "前へ" : "Previous"}",
  next: "${isJa ? "次へ" : "Next"}",
  rowsPerPage: "${isJa ? "表示件数" : "Rows"}",
  pageSizeOption: (size) => ${isJa ? 'size + "件"' : 'size + " rows"'},
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
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto" previewBodyWidth="xl">
                <DataTable
                    columns={columns}
                    data={TEAM_DATA}
                    filter={{ columnId: "name", placeholder: labels.filterPlaceholder }}
                    labels={labels}
                />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
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
