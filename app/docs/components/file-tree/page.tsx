"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    FileTree,
    TooltipButton,
    type FileTreeNode,
} from "@gunjo/ui";
import { IconDots as MoreHorizontal } from "@tabler/icons-react";

const codeByLocale = {
    ja: `import * as React from "react";
import { FileTree, type FileTreeNode } from "@gunjo/ui";

const nodes: FileTreeNode[] = [
  {
    id: "campaign",
    label: "キャンペーン",
    type: "folder",
    count: "2件",
    children: [
      { id: "campaign/hero.png", label: "ヒーロー画像.png", type: "file", size: "2.4 MB" },
      { id: "campaign/banner.jpg", label: "バナー.jpg", type: "file", size: "860 KB" },
    ],
  },
];

export function Example() {
  const [selectedIds, setSelectedIds] = React.useState(["campaign/hero.png"]);

  return (
    <FileTree
      nodes={nodes}
      defaultExpanded={["campaign"]}
      selectedIds={selectedIds}
      onSelectedIdsChange={setSelectedIds}
    />
  );
}`,
    en: `import * as React from "react";
import { FileTree, type FileTreeNode } from "@gunjo/ui";

const nodes: FileTreeNode[] = [
  {
    id: "campaign",
    label: "campaign",
    type: "folder",
    count: "2 items",
    children: [
      { id: "campaign/hero.png", label: "hero.png", type: "file", size: "2.4 MB" },
      { id: "campaign/banner.jpg", label: "banner.jpg", type: "file", size: "860 KB" },
    ],
  },
];

export function Example() {
  const [selectedIds, setSelectedIds] = React.useState(["campaign/hero.png"]);

  return (
    <FileTree
      nodes={nodes}
      defaultExpanded={["campaign"]}
      selectedIds={selectedIds}
      onSelectedIdsChange={setSelectedIds}
    />
  );
}`,
} as const;

const multipleCodeByLocale = {
    ja: `<FileTree
  nodes={nodes}
  selectionMode="multiple"
  defaultExpanded={["campaign", "docs"]}
  defaultSelectedIds={["campaign/hero.png", "docs/brief.md"]}
/>`,
    en: `<FileTree
  nodes={nodes}
  selectionMode="multiple"
  defaultExpanded={["campaign", "docs"]}
  defaultSelectedIds={["campaign/hero.png", "docs/brief.md"]}
/>`,
} as const;

const actionsCodeByLocale = {
    ja: `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  FileTree,
  TooltipButton,
} from "@gunjo/ui";
import { IconDots as MoreHorizontal } from "@tabler/icons-react";

<FileTree
  nodes={nodes}
  defaultExpanded={["campaign"]}
  renderNodeActions={(node) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TooltipButton
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          aria-label={\`\${node.label}の操作\`}
          tooltip={\`\${node.label}の操作\`}
          tooltipSide="right"
        >
          <MoreHorizontal className="h-4 w-4" />
        </TooltipButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right">
        <DropdownMenuItem>詳細を表示</DropdownMenuItem>
        <DropdownMenuItem>名前を変更</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>パスをコピー</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )}
/>`,
    en: `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  FileTree,
  TooltipButton,
} from "@gunjo/ui";
import { IconDots as MoreHorizontal } from "@tabler/icons-react";

<FileTree
  nodes={nodes}
  defaultExpanded={["campaign"]}
  renderNodeActions={(node) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TooltipButton
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          aria-label={\`Actions for \${node.label}\`}
          tooltip={\`Actions for \${node.label}\`}
          tooltipSide="right"
        >
          <MoreHorizontal className="h-4 w-4" />
        </TooltipButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right">
        <DropdownMenuItem>View details</DropdownMenuItem>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Copy path</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )}
/>`,
} as const;

const propsByLocale = {
    ja: [
        { name: "nodes", type: "FileTreeNode[]", required: true, description: "表示するファイル/フォルダの階層データです。label、type、children、size、count、meta を指定できます。" },
        { name: "variant", type: '"single" | "multiple" | "actions"', default: '"single"', description: "デザイン仕様上の表示バリエーションです。複数選択バリエーションでは、既定の選択モードも複数選択になります。" },
        { name: "selectionMode", type: '"single" | "multiple" | "none"', default: '"single"', description: "単一選択、複数選択、選択なしを切り替えます。" },
        { name: "selectedIds", type: "Iterable<string>", description: "選択中ノードIDの集合です。指定すると選択状態を制御できます。" },
        { name: "defaultSelectedIds", type: "string[]", description: "非制御で使う場合の初期選択ノードIDです。" },
        { name: "onSelectedIdsChange", type: "(ids: string[], node: FileTreeNode) => void", description: "選択状態が変わったときに呼び出されます。" },
        { name: "onNodeSelect", type: "(node: FileTreeNode) => void", description: "ノードが選択操作されたときに呼び出されます。" },
        { name: "renderNodeMeta", type: "(node: FileTreeNode) => React.ReactNode", description: "標準のサイズ、件数、補足情報以外の内容を行内に表示します。" },
        { name: "renderNodeActions", type: "(node: FileTreeNode) => React.ReactNode", description: "行末に編集、削除、メニューなどの操作を表示します。" },
        { name: "getNodeRowProps", type: "(node: FileTreeNode) => HTMLAttributes<HTMLDivElement>", description: "行のラッパーにドラッグ&ドロップや計測用の属性を追加します。" },
        { name: "expanded / onExpandedChange / defaultExpanded", type: "TreeView の開閉 props", description: "フォルダの開閉状態は TreeView と同じ指定方法で制御できます。" },
    ],
    en: [
        { name: "nodes", type: "FileTreeNode[]", required: true, description: "Hierarchical file and folder data. Nodes can include label, type, children, size, count, and meta." },
        { name: "variant", type: '"single" | "multiple" | "actions"', default: '"single"', description: "Design variant. The multiple variant also defaults selectionMode to multiple." },
        { name: "selectionMode", type: '"single" | "multiple" | "none"', default: '"single"', description: "Controls single selection, multi-selection, or no selection." },
        { name: "selectedIds", type: "Iterable<string>", description: "Selected node ids. Provide it to control selection state." },
        { name: "defaultSelectedIds", type: "string[]", description: "Initial selected node ids for uncontrolled usage." },
        { name: "onSelectedIdsChange", type: "(ids: string[], node: FileTreeNode) => void", description: "Called when selection state changes." },
        { name: "onNodeSelect", type: "(node: FileTreeNode) => void", description: "Called when a node is selected." },
        { name: "renderNodeMeta", type: "(node: FileTreeNode) => React.ReactNode", description: "Renders supplemental row metadata beyond the default size/count/meta values." },
        { name: "renderNodeActions", type: "(node: FileTreeNode) => React.ReactNode", description: "Renders edit, delete, or menu actions at the end of each row." },
        { name: "getNodeRowProps", type: "(node: FileTreeNode) => HTMLAttributes<HTMLDivElement>", description: "Adds drag-and-drop or instrumentation attributes to the row wrapper." },
        { name: "expanded / onExpandedChange / defaultExpanded", type: "TreeView props", description: "Folder expansion uses the same controlled and uncontrolled API as TreeView." },
    ],
} as const;

function buildNodes(locale: "ja" | "en"): FileTreeNode[] {
    return [
        {
            id: "campaign",
            label: locale === "ja" ? "キャンペーン" : "campaign",
            type: "folder",
            count: locale === "ja" ? "2件" : "2 items",
            children: [
                { id: "campaign/hero.png", label: locale === "ja" ? "ヒーロー画像.png" : "hero.png", type: "file", size: "2.4 MB" },
                { id: "campaign/banner.jpg", label: locale === "ja" ? "バナー.jpg" : "banner.jpg", type: "file", size: "860 KB" },
            ],
        },
        {
            id: "docs",
            label: locale === "ja" ? "資料" : "docs",
            type: "folder",
            count: locale === "ja" ? "2件" : "2 items",
            children: [
                { id: "docs/brief.md", label: locale === "ja" ? "要件メモ.md" : "brief.md", type: "file", size: "18 KB" },
                { id: "docs/checklist.md", label: locale === "ja" ? "確認リスト.md" : "checklist.md", type: "file", size: "12 KB" },
            ],
        },
    ];
}

function ControlledFileTree({ locale }: { locale: "ja" | "en" }) {
    const nodes = React.useMemo(() => buildNodes(locale), [locale]);
    const [selectedIds, setSelectedIds] = React.useState(["campaign/hero.png"]);

    React.useEffect(() => {
        setSelectedIds(["campaign/hero.png"]);
    }, [locale]);

    return (
        <FileTree
            className="w-full max-w-sm"
            nodes={nodes}
            defaultExpanded={["campaign", "docs"]}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
        />
    );
}

function FileTreeWithActions({ locale }: { locale: "ja" | "en" }) {
    const nodes = React.useMemo(() => buildNodes(locale), [locale]);

    return (
        <FileTree
            className="w-full max-w-sm"
            nodes={nodes}
            defaultExpanded={["campaign", "docs"]}
            selectedIds={["campaign/banner.jpg"]}
            renderNodeActions={(node) => {
                const label = typeof node.label === "string" ? node.label : locale === "ja" ? "項目" : "item";
                const actionLabel = locale === "ja" ? `${label}の操作` : `Actions for ${label}`;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <TooltipButton
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                aria-label={actionLabel}
                                tooltip={actionLabel}
                                tooltipSide="right"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </TooltipButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" side="right">
                            <DropdownMenuItem>{locale === "ja" ? "詳細を表示" : "View details"}</DropdownMenuItem>
                            <DropdownMenuItem>{locale === "ja" ? "名前を変更" : "Rename"}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>{locale === "ja" ? "パスをコピー" : "Copy path"}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }}
        />
    );
}

export default function FileTreePage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/file-tree", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const nodes = React.useMemo(() => buildNodes(locale), [locale]);
    const code = codeByLocale[locale];

    return (
        <ComponentLayout
            title={content?.title ?? meta.fileTree.title}
            description={content?.description ?? meta.fileTree.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "FileTree", href: "/docs/components/file-tree" },
                { name: "TreeView", href: "/docs/components/tree-view" },
                { name: "DropdownMenu", href: "/docs/components/dropdown-menu" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
            ]}
            relatedComponents={[
                { name: "TreeView", href: "/docs/components/tree-view" },
                { name: "AssetGrid", href: "/docs/components/asset-grid" },
                { name: "MediaLibraryTemplate", href: "/docs/components/media-library" },
                { name: "SidebarItem", href: "/docs/components/sidebar-item" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="md" previewHeight="auto">
                <ControlledFileTree locale={locale} />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "single",
                            title: locale === "ja" ? "単一選択" : "Single selection",
                            description: locale === "ja"
                                ? "現在開いているフォルダやプレビュー対象のファイルを一つだけ選ぶ場合に使います。"
                                : "Use single selection for the active folder or the one file being previewed.",
                            preview: <ControlledFileTree locale={locale} />,
                            code,
                        },
                        {
                            key: "multiple",
                            title: locale === "ja" ? "複数選択" : "Multiple selection",
                            description: locale === "ja"
                                ? "一括移動、削除、タグ付けの対象を複数選ぶ場合は selectionMode=\"multiple\" を使います。"
                                : "Use selectionMode=\"multiple\" for bulk move, delete, or tagging flows.",
                            preview: (
                                <FileTree
                                    className="w-full max-w-sm"
                                    nodes={nodes}
                                    selectionMode="multiple"
                                    defaultExpanded={["campaign", "docs"]}
                                    defaultSelectedIds={["campaign/hero.png", "docs/brief.md"]}
                                />
                            ),
                            code: multipleCodeByLocale[locale],
                        },
                        {
                            key: "actions",
                            title: locale === "ja" ? "行アクション" : "Row actions",
                            description: locale === "ja"
                                ? "編集、削除、詳細メニューなどは renderNodeActions で行末に差し込みます。"
                                : "Use renderNodeActions for edit, delete, and overflow menu controls at the end of each row.",
                            preview: <FileTreeWithActions locale={locale} />,
                            code: actionsCodeByLocale[locale],
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
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
