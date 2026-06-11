"use client";

import * as React from "react";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    buttonVariants,
    cn,
    SidebarItem,
    TooltipButton,
} from "@gunjo/ui";
import {
    IconChevronRight as ChevronRight,
    IconFileText as FileText,
    IconFolder as Folder,
    IconGridDots as Grid,
    IconPlus as Plus,
    IconStar as Star,
    IconTrash as Trash2,
} from "@tabler/icons-react";

const libraryItems = [
    { id: "all", label: { ja: "すべての素材", en: "All assets" }, icon: Grid, count: 128 },
    { id: "favorite", label: { ja: "お気に入り", en: "Favorites" }, icon: Star, count: 24 },
    { id: "uncategorized", label: { ja: "未分類", en: "Uncategorized" }, icon: Folder, count: 8 },
    { id: "trash", label: { ja: "ごみ箱", en: "Trash" }, icon: Trash2, count: 3 },
] as const;

const folderItems = [
    { id: "campaign", label: { ja: "キャンペーン", en: "Campaigns" }, icon: Folder, count: 18, level: 0, hasChildren: true },
    { id: "spring", label: { ja: "春の公開素材", en: "Spring launch" }, icon: FileText, count: 6, level: 1, hasChildren: false },
    { id: "product", label: { ja: "商品写真", en: "Product photos" }, icon: Folder, count: 42, level: 0, hasChildren: false },
] as const;

function FlatItemsExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [activeId, setActiveId] = React.useState("home");

    return (
        <div className="w-full max-w-sm space-y-1 rounded-md border bg-background p-2">
            <SidebarItem
                id="home"
                icon={<Grid size={16} />}
                label={isJa ? "ホーム" : "Home"}
                isActive={activeId === "home"}
                onClick={() => setActiveId("home")}
                reserveChevronSpace={false}
            />
            <SidebarItem
                id="notes"
                icon={<FileText size={16} />}
                label={isJa ? "リリースノート" : "Release notes"}
                count={3}
                isActive={activeId === "notes"}
                onClick={() => setActiveId("notes")}
                reserveChevronSpace={false}
            />
        </div>
    );
}

function SidebarContentExample({ actions = false, nested = true }: { actions?: boolean; nested?: boolean }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [activeId, setActiveId] = React.useState("favorite");
    const [foldersExpanded, setFoldersExpanded] = React.useState(true);
    const [campaignExpanded, setCampaignExpanded] = React.useState(true);
    const [deletedId, setDeletedId] = React.useState<string | null>(null);
    const [pendingDelete, setPendingDelete] = React.useState<{ id: string; label: string } | null>(null);
    const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);
    const visibleFolderItems = folderItems.filter((item) => item.id !== deletedId);

    return (
        <div ref={setPortalContainer} className="relative flex min-h-[340px] w-full items-start justify-center overflow-hidden rounded-md">
            <AlertDialog open={actions && Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
                <AlertDialogContent portalContainer={portalContainer}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{isJa ? "フォルダを削除しますか" : "Delete this folder?"}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingDelete
                                ? isJa
                                    ? `${pendingDelete.label} をサイドバーから削除します。この操作は取り消せません。`
                                    : `${pendingDelete.label} will be removed from the sidebar. This action cannot be undone.`
                                : null}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {pendingDelete ? (
                        <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm font-medium">
                            {pendingDelete.label}
                        </div>
                    ) : null}
                    <AlertDialogFooter>
                        <AlertDialogCancel>{isJa ? "キャンセル" : "Cancel"}</AlertDialogCancel>
                        <AlertDialogAction
                            className={cn(buttonVariants({ variant: "destructive" }))}
                            onClick={() => {
                                if (!pendingDelete) return;
                                setDeletedId(pendingDelete.id);
                                setPendingDelete(null);
                            }}
                        >
                            {isJa ? "削除" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="w-full max-w-sm rounded-md border bg-muted/30 p-3">
                <section className="space-y-1">
                    <p className="px-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        {isJa ? "ライブラリ" : "Libraries"}
                    </p>
                    {libraryItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <SidebarItem
                                key={item.id}
                                id={item.id}
                                icon={<Icon size={18} />}
                                label={item.label[locale]}
                                count={item.count}
                                isActive={activeId === item.id}
                                onClick={() => setActiveId(item.id)}
                                reserveChevronSpace={false}
                            />
                        );
                    })}
                </section>

                {nested ? (
                    <section className="mt-4 space-y-1">
                        <div className="flex items-center justify-between pl-2">
                            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                                {isJa ? "フォルダ" : "Folders"}
                            </p>
                            <div className="grid w-14 grid-cols-[1.5rem_1.5rem] items-center justify-end">
                                <TooltipButton
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground"
                                    tooltip={isJa ? "フォルダを追加" : "Add folder"}
                                    aria-label={isJa ? "フォルダを追加" : "Add folder"}
                                >
                                    <Plus size={14} />
                                </TooltipButton>
                                <TooltipButton
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground"
                                    tooltip={foldersExpanded ? (isJa ? "フォルダを閉じる" : "Collapse folders") : (isJa ? "フォルダを開く" : "Expand folders")}
                                    aria-label={foldersExpanded ? (isJa ? "フォルダを閉じる" : "Collapse folders") : (isJa ? "フォルダを開く" : "Expand folders")}
                                    onClick={() => setFoldersExpanded((open) => !open)}
                                >
                                    <ChevronRight size={14} className={foldersExpanded ? "rotate-90 transition-transform" : "transition-transform"} />
                                </TooltipButton>
                            </div>
                        </div>
                        {foldersExpanded ? (
                            <div className="space-y-1">
                                {visibleFolderItems.map((item) => {
                                    if (item.id === "spring" && !campaignExpanded) return null;
                                    const Icon = item.icon;
                                    return (
                                        <SidebarItem
                                            key={item.id}
                                            id={item.id}
                                            icon={<Icon size={18} />}
                                            label={item.label[locale]}
                                            count={item.count}
                                            level={item.level ?? 0}
                                            hasChildren={item.hasChildren}
                                            isExpanded={campaignExpanded}
                                            isActive={activeId === item.id}
                                            onClick={() => setActiveId(item.id)}
                                            onToggleExpand={(event) => {
                                                event.stopPropagation();
                                                setCampaignExpanded((open) => !open);
                                            }}
                                            onDelete={actions && item.id !== "campaign" ? (event) => {
                                                event.stopPropagation();
                                                setPendingDelete({ id: item.id, label: item.label[locale] });
                                            } : undefined}
                                            deleteLabel={isJa ? "フォルダを削除" : "Delete folder"}
                                        />
                                    );
                                })}
                            </div>
                        ) : null}
                    </section>
                ) : null}
            </div>
        </div>
    );
}

export default function SidebarItemPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
const code = `import * as React from "react"
import { SidebarItem, TooltipButton } from "@gunjo/ui"
import { IconChevronRight as ChevronRight, IconFileText as FileText, IconFolder as Folder, IconGridDots as Grid, IconPlus as Plus, IconStar as Star, IconTrash as Trash2 } from "@tabler/icons-react"

const libraryItems = [
  { id: "all", label: "${isJa ? "すべての素材" : "All assets"}", icon: Grid, count: 128 },
  { id: "favorite", label: "${isJa ? "お気に入り" : "Favorites"}", icon: Star, count: 24 },
  { id: "uncategorized", label: "${isJa ? "未分類" : "Uncategorized"}", icon: Folder, count: 8 },
  { id: "trash", label: "${isJa ? "ごみ箱" : "Trash"}", icon: Trash2, count: 3 },
]

const folderItems = [
  { id: "campaign", label: "${isJa ? "キャンペーン" : "Campaigns"}", icon: Folder, count: 18, level: 0, hasChildren: true },
  { id: "spring", label: "${isJa ? "春の公開素材" : "Spring launch"}", icon: FileText, count: 6, level: 1, hasChildren: false },
  { id: "product", label: "${isJa ? "商品写真" : "Product photos"}", icon: Folder, count: 42, level: 0, hasChildren: false },
]

export function MediaLibrarySidebarContent() {
  const [activeId, setActiveId] = React.useState("favorite")
  const [foldersExpanded, setFoldersExpanded] = React.useState(true)
  const [campaignExpanded, setCampaignExpanded] = React.useState(true)

  return (
    <div className="w-full max-w-sm rounded-md border bg-muted/30 p-3">
      <section className="space-y-1">
        <p className="px-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">${isJa ? "ライブラリ" : "Libraries"}</p>
        {libraryItems.map((item) => {
          const Icon = item.icon

          return (
            <SidebarItem
              key={item.id}
              id={item.id}
              icon={<Icon size={18} />}
              label={item.label}
              count={item.count}
              isActive={activeId === item.id}
              onClick={() => setActiveId(item.id)}
              reserveChevronSpace={false}
            />
          )
        })}
      </section>

      <section className="mt-4 space-y-1">
        <div className="flex items-center justify-between pl-2">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">${isJa ? "フォルダ" : "Folders"}</p>
          <div className="grid w-14 grid-cols-[1.5rem_1.5rem] items-center justify-end">
            <TooltipButton type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" tooltip="${isJa ? "フォルダを追加" : "Add folder"}" aria-label="${isJa ? "フォルダを追加" : "Add folder"}">
              <Plus size={14} />
            </TooltipButton>
            <TooltipButton
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground"
              tooltip={foldersExpanded ? "${isJa ? "フォルダを閉じる" : "Collapse folders"}" : "${isJa ? "フォルダを開く" : "Expand folders"}"}
              aria-label={foldersExpanded ? "${isJa ? "フォルダを閉じる" : "Collapse folders"}" : "${isJa ? "フォルダを開く" : "Expand folders"}"}
              onClick={() => setFoldersExpanded((open) => !open)}
            >
              <ChevronRight size={14} className={foldersExpanded ? "rotate-90 transition-transform" : "transition-transform"} />
            </TooltipButton>
          </div>
        </div>

        {foldersExpanded ? (
          <div className="space-y-1">
            {folderItems.map((item) => {
              if (item.id === "spring" && !campaignExpanded) return null
              const Icon = item.icon

              return (
                <SidebarItem
                  key={item.id}
                  id={item.id}
                  icon={<Icon size={18} />}
                  label={item.label}
                  count={item.count}
                  level={item.level ?? 0}
                  hasChildren={item.hasChildren}
                  isExpanded={campaignExpanded}
                  isActive={activeId === item.id}
                  onClick={() => setActiveId(item.id)}
                  onToggleExpand={(event) => {
                    event.stopPropagation()
                    setCampaignExpanded((open) => !open)
                  }}
                />
              )
            })}
          </div>
        ) : null}
      </section>
    </div>
  )
}`;
    const actionsCode = code
        .replace(
            `import { SidebarItem, TooltipButton } from "@gunjo/ui"`,
            `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  buttonVariants,
  cn,
  SidebarItem,
  TooltipButton,
} from "@gunjo/ui"`
        )
        .replace(
            `  const [campaignExpanded, setCampaignExpanded] = React.useState(true)`,
            `  const [campaignExpanded, setCampaignExpanded] = React.useState(true)
  const [deletedId, setDeletedId] = React.useState(null)
  const [pendingDelete, setPendingDelete] = React.useState(null)
  const [portalContainer, setPortalContainer] = React.useState(null)
  const visibleFolderItems = folderItems.filter((item) => item.id !== deletedId)`
        )
        .replace(
            `    <div className="w-full max-w-sm rounded-md border bg-muted/30 p-3">`,
            `    <div ref={setPortalContainer} className="relative flex min-h-[340px] w-full items-start justify-center overflow-hidden rounded-md">
      {pendingDelete ? (
        <AlertDialog open onOpenChange={(open) => !open && setPendingDelete(null)}>
          <AlertDialogContent portalContainer={portalContainer}>
            <AlertDialogHeader>
              <AlertDialogTitle>${isJa ? "フォルダを削除しますか" : "Delete this folder?"}</AlertDialogTitle>
              <AlertDialogDescription>
                {pendingDelete.label} ${isJa ? "をサイドバーから削除します。この操作は取り消せません。" : "will be removed from the sidebar. This action cannot be undone."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm font-medium">
              {pendingDelete.label}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>${isJa ? "キャンセル" : "Cancel"}</AlertDialogCancel>
              <AlertDialogAction
                className={cn(buttonVariants({ variant: "destructive" }))}
                onClick={() => {
                  setDeletedId(pendingDelete.id)
                  setPendingDelete(null)
                }}
              >
                ${isJa ? "削除" : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
      <div className="w-full max-w-sm rounded-md border bg-muted/30 p-3">`
        )
        .replace(
            `{folderItems.map((item) => {`,
            `{visibleFolderItems.map((item) => {`
        )
        .replace(
        `onToggleExpand={(event) => {
                    event.stopPropagation()
                    setCampaignExpanded((open) => !open)
                  }}
                />`,
        `onToggleExpand={(event) => {
                    event.stopPropagation()
                    setCampaignExpanded((open) => !open)
                  }}
                  onDelete={item.id !== "campaign" ? (event) => {
                    event.stopPropagation()
                    setPendingDelete({ id: item.id, label: item.label })
                  } : undefined}
                  deleteLabel="${isJa ? "フォルダを削除" : "Delete folder"}"
                />`
    );
    const actionsCodeWithWrapper = actionsCode.replace(
        `      </section>
    </div>
  )
}`,
        `      </section>
      </div>
    </div>
  )
}`
    );
const flatCode = `import * as React from "react"
import { SidebarItem } from "@gunjo/ui"
import { IconFileText as FileText, IconGridDots as Grid } from "@tabler/icons-react"

export function FlatNavigationItems() {
  const [activeId, setActiveId] = React.useState("home")

  return (
    <div className="w-full max-w-sm space-y-1 rounded-md border bg-background p-2">
      <SidebarItem
        id="home"
        icon={<Grid size={16} />}
        label="${isJa ? "ホーム" : "Home"}"
        isActive={activeId === "home"}
        onClick={() => setActiveId("home")}
        reserveChevronSpace={false}
      />
      <SidebarItem
        id="notes"
        icon={<FileText size={16} />}
        label="${isJa ? "リリースノート" : "Release notes"}"
        count={3}
        isActive={activeId === "notes"}
        onClick={() => setActiveId("notes")}
        reserveChevronSpace={false}
      />
    </div>
  )
}`;

    return (
        <ComponentLayout
            title={isJa ? "サイドバー項目" : navigationMetadata.sidebarItem.title}
            description={isJa ? "サイドバー内で使う選択行です。アイコン、ラベル、件数、階層、開閉、削除操作を同じ行幅で揃えて表示します。" : navigationMetadata.sidebarItem.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "SidebarItem", href: "/docs/components/sidebar-item" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "AlertDialog", href: "/docs/components/alert-dialog" },
            ]}
            relatedComponents={[
                { name: "Sidebar", href: "/docs/components/sidebar" },
                { name: "FileTree", href: "/docs/components/file-tree" },
                { name: "TreeView", href: "/docs/components/tree-view" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="md" previewHeight="auto">
                <SidebarContentExample />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {isJa ? "状態とバリエーション" : "States and variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "flat",
                            title: isJa ? "フラットな項目" : "Flat items",
                            description: isJa ? "階層を持たないナビゲーションでは、先頭の開閉スペースを消して左端を揃えます。" : "Remove the leading chevron slot for flat navigation rows.",
                            preview: <FlatItemsExample />,
                            previewBodyWidth: "md",
                            previewHeight: "auto",
                            code: flatCode,
                        },
                        {
                            key: "actions",
                            title: isJa ? "行アクション付き" : "Row actions",
                            description: isJa ? "削除などの行アクションは右端の予約枠に置き、件数の位置を揃えます。" : "Place row actions in the reserved trailing slot so counts remain aligned.",
                            preview: <SidebarContentExample actions />,
                            previewBodyWidth: "md",
                            previewHeight: "auto",
                            code: actionsCodeWithWrapper,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <PropsTable
                    data={[
                        { name: "id", type: "string", description: isJa ? "項目を識別する ID。" : "Unique identifier for the item." },
                        { name: "label", type: "string", description: isJa ? "行に表示するラベル。" : "Visible row label." },
                        { name: "icon", type: "ReactNode", description: isJa ? "ラベルの前に表示するアイコン。" : "Icon rendered before the label." },
                        { name: "count", type: "number", description: isJa ? "右端に表示する件数。" : "Count shown at the end of the row." },
                        { name: "isActive", type: "boolean", description: isJa ? "現在選択中の項目かどうか。" : "Whether this item is currently selected." },
                        { name: "level", type: "number", default: "0", description: isJa ? "階層の深さ。子要素のインデントに使います。" : "Indentation level for nested rows." },
                        { name: "hasChildren", type: "boolean", default: "false", description: isJa ? "開閉できる子要素を持つことを示します。" : "Shows that the item can expand nested children." },
                        { name: "isExpanded", type: "boolean", default: "false", description: isJa ? "子要素が開いている状態を示します。" : "Whether nested children are expanded." },
                        { name: "reserveChevronSpace", type: "boolean", default: "true", description: isJa ? "階層表示のための開閉スペースを予約します。" : "Reserves the leading chevron slot for tree alignment." },
                        { name: "onClick", type: "() => void", description: isJa ? "行を選択した時に呼ばれます。" : "Called when the row is selected." },
                        { name: "onToggleExpand", type: "(event: MouseEvent) => void", description: isJa ? "開閉アイコンまたは子を持つ行を操作した時に呼ばれます。" : "Called when the expand affordance or expandable row is activated." },
                        { name: "onDelete", type: "(event: MouseEvent) => void", description: isJa ? "右端の削除ボタンを押した時に呼ばれます。" : "Called from the trailing delete button." },
                        { name: "deleteLabel", type: "ReactNode", default: "\"Delete\"", description: isJa ? "削除ボタンのツールチップと aria-label。" : "Tooltip and aria-label for the delete button." },
                        { name: "dragOverId / dragAction", type: "string | null", description: isJa ? "ドラッグ中の並び替え・ネスト位置を行上に表示します。" : "Shows reorder and nesting indicators during drag interactions." },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </div>
        </ComponentLayout>
    );
}
