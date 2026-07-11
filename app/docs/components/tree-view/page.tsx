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
    TooltipButton,
    TreeView,
    type TreeNode,
} from "@gunjo/ui";
import { IconDots as MoreHorizontal, IconFileText as FileText, IconFolder as Folder, IconPhoto as Image, IconSettings as Settings } from "@tabler/icons-react";

const codeByLocale = {
    ja: `import * as React from "react";
import { TreeView, type TreeNode } from "@gunjo/ui";
import { IconFileText as FileText, IconFolder as Folder } from "@tabler/icons-react";

const nodes: TreeNode[] = [
  {
    id: "guides",
    label: "ガイド",
    icon: <Folder className="h-4 w-4" />,
    children: [
      { id: "guides/getting-started.md", label: "導入ガイド.md", icon: <FileText className="h-4 w-4" /> },
      { id: "guides/release.md", label: "公開手順.md", icon: <FileText className="h-4 w-4" /> },
    ],
  },
];

export function Example() {
  const [expanded, setExpanded] = React.useState(new Set(["guides"]));
  const [selectedId, setSelectedId] = React.useState("guides/getting-started.md");

  return (
    <TreeView
      nodes={nodes}
      expanded={expanded}
      onExpandedChange={setExpanded}
      selectedId={selectedId}
      onSelectedIdChange={setSelectedId}
    />
  );
}`,
    en: `import * as React from "react";
import { TreeView, type TreeNode } from "@gunjo/ui";
import { IconFileCode as FileCode2, IconFileText as FileText, IconFolder as Folder } from "@tabler/icons-react";

const nodes: TreeNode[] = [
  {
    id: "app",
    label: "app",
    icon: <Folder className="h-4 w-4" />,
    children: [
      { id: "app/page.tsx", label: "page.tsx", icon: <FileCode2 className="h-4 w-4" /> },
      { id: "app/readme.md", label: "readme.md", icon: <FileText className="h-4 w-4" /> },
    ],
  },
];

export function Example() {
  const [expanded, setExpanded] = React.useState(new Set(["app"]));
  const [selectedId, setSelectedId] = React.useState("app/page.tsx");

  return (
    <TreeView
      nodes={nodes}
      expanded={expanded}
      onExpandedChange={setExpanded}
      selectedId={selectedId}
      onSelectedIdChange={setSelectedId}
    />
  );
}`,
} as const;

const defaultExpandedCodeByLocale = {
    ja: `import { TreeView, type TreeNode } from "@gunjo/ui";

const nodes: TreeNode[] = [
  { id: "settings", label: "設定", children: [{ id: "settings/profile", label: "プロフィール" }] },
  { id: "help", label: "ヘルプ" },
];

export function DefaultExpandedTree() {
  return <TreeView nodes={nodes} defaultExpanded={["settings"]} />;
}`,
    en: `import { TreeView, type TreeNode } from "@gunjo/ui";

const nodes: TreeNode[] = [
  { id: "src", label: "src", children: [{ id: "src/Button.tsx", label: "Button.tsx" }] },
  { id: "package.json", label: "package.json" },
];

export function DefaultExpandedTree() {
  return <TreeView nodes={nodes} defaultExpanded={["src"]} />;
}`,
} as const;

const selectedCodeByLocale = {
    ja: `import * as React from "react";
import { TreeView, type TreeNode } from "@gunjo/ui";

const nodes: TreeNode[] = [
  { id: "documents", label: "ドキュメント", children: [{ id: "documents/operation.md", label: "操作ガイド.md" }] },
];

export function SelectedTree() {
  const [selectedId, setSelectedId] = React.useState("documents/operation.md");

  return (
    <TreeView
      nodes={nodes}
      defaultExpanded={["documents"]}
      selectedId={selectedId}
      onSelectedIdChange={setSelectedId}
    />
  );
}`,
    en: `import * as React from "react";
import { TreeView, type TreeNode } from "@gunjo/ui";

const nodes: TreeNode[] = [
  { id: "docs", label: "docs", children: [{ id: "docs/guide.md", label: "guide.md" }] },
];

export function SelectedTree() {
  const [selectedId, setSelectedId] = React.useState("docs/guide.md");

  return (
    <TreeView
      nodes={nodes}
      defaultExpanded={["docs"]}
      selectedId={selectedId}
      onSelectedIdChange={setSelectedId}
    />
  );
}`,
} as const;

const withoutIconsCodeByLocale = {
    ja: `import { TreeView, type TreeNode } from "@gunjo/ui";

const nodes: TreeNode[] = [
  {
    id: "settings",
    label: "設定",
    children: [
      { id: "settings/profile", label: "プロフィール" },
      { id: "settings/security", label: "セキュリティ" },
    ],
  },
];

export function TreeWithoutIcons() {
  return <TreeView nodes={nodes} defaultExpanded={["settings"]} selectedId="settings/profile" />;
}`,
    en: `import { TreeView, type TreeNode } from "@gunjo/ui";

const nodes: TreeNode[] = [
  {
    id: "settings",
    label: "settings",
    children: [
      { id: "settings/profile", label: "profile" },
      { id: "settings/security", label: "security" },
    ],
  },
];

export function TreeWithoutIcons() {
  return <TreeView nodes={nodes} defaultExpanded={["settings"]} selectedId="settings/profile" />;
}`,
} as const;

const metaActionsCodeByLocale = {
    ja: `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  TooltipButton,
  TreeView,
  type TreeNode,
} from "@gunjo/ui";
import { IconDots as MoreHorizontal, IconFileText as FileText, IconFolder as Folder, IconPhoto as Image } from "@tabler/icons-react";

const nodes: TreeNode[] = [
  {
    id: "assets",
    label: "素材",
    icon: <Folder className="h-4 w-4" />,
    children: [
      { id: "assets/hero.png", label: "ヒーロー画像.png", icon: <Image className="h-4 w-4" /> },
      { id: "assets/spec.md", label: "仕様メモ.md", icon: <FileText className="h-4 w-4" /> },
    ],
  },
];

const nodeMeta: Record<string, string> = {
  assets: "2件",
  "assets/hero.png": "2.4 MB",
  "assets/spec.md": "18 KB",
};

function getNodeLabel(node: TreeNode) {
  return typeof node.label === "string" ? node.label : "項目";
}

export function TreeViewWithSlots() {
  return (
    <TreeView
      nodes={nodes}
      defaultExpanded={["assets"]}
      renderNodeMeta={(node) => nodeMeta[node.id] ?? null}
      renderNodeActions={(node) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TooltipButton
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              aria-label={\`\${getNodeLabel(node)}の操作\`}
              tooltip={\`\${getNodeLabel(node)}の操作\`}
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
    />
  );
}`,
    en: `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  TooltipButton,
  TreeView,
  type TreeNode,
} from "@gunjo/ui";
import { IconDots as MoreHorizontal, IconFileText as FileText, IconFolder as Folder, IconPhoto as Image } from "@tabler/icons-react";

const nodes: TreeNode[] = [
  {
    id: "assets",
    label: "assets",
    icon: <Folder className="h-4 w-4" />,
    children: [
      { id: "assets/hero.png", label: "hero.png", icon: <Image className="h-4 w-4" /> },
      { id: "assets/spec.md", label: "spec.md", icon: <FileText className="h-4 w-4" /> },
    ],
  },
];

const nodeMeta: Record<string, string> = {
  assets: "2 items",
  "assets/hero.png": "2.4 MB",
  "assets/spec.md": "18 KB",
};

function getNodeLabel(node: TreeNode) {
  return typeof node.label === "string" ? node.label : "item";
}

export function TreeViewWithSlots() {
  return (
    <TreeView
      nodes={nodes}
      defaultExpanded={["assets"]}
      renderNodeMeta={(node) => nodeMeta[node.id] ?? null}
      renderNodeActions={(node) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TooltipButton
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              aria-label={\`Actions for \${getNodeLabel(node)}\`}
              tooltip={\`Actions for \${getNodeLabel(node)}\`}
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
    />
  );
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "nodes", type: "TreeNode[]", required: true, description: "表示する階層データです。各ノードは id、label、任意の icon、children を持てます。" },
        { name: "expanded", type: "Set<string>", description: "開いているノードIDの集合です。指定すると開閉状態を制御できます。" },
        { name: "onExpandedChange", type: "(expanded: Set<string>) => void", description: "開閉状態が変わったときに呼び出されます。" },
        { name: "defaultExpanded", type: "string[]", description: "非制御で使う場合の初期展開ノードIDです。" },
        { name: "selectedId", type: "string", description: "選択中のノードIDです。" },
        { name: "selectedIds", type: "Iterable<string>", description: "複数の選択状態を表示する場合のノードID集合です。選択のルールは FileTree など上位のコンポーネントで扱います。" },
        { name: "selectionMode", type: '"single" | "multiple" | "none"', default: '"single"', description: "選択状態の表示と ARIA 属性の意味付けを指定します。" },
        { name: "onSelectedIdChange", type: "(id: string) => void", description: "ノードが選択されたときに呼び出されます。" },
        { name: "renderNodeMeta", type: "(node: TreeNode) => React.ReactNode", description: "行のラベル後に件数、容量、状態などの補足情報を表示するための描画関数です。関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。JSX を返すため serializable な代替は無く、RSC からは \"use client\" ラッパーで包む。(#338)" },
        { name: "renderNodeActions", type: "(node: TreeNode) => React.ReactNode", description: "行末に編集、削除、メニューなどの操作を表示するための描画関数です。関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。JSX を返すため serializable な代替は無く、RSC からは \"use client\" ラッパーで包む。(#338)" },
        { name: "getNodeRowProps", type: "(node: TreeNode) => HTMLAttributes<HTMLDivElement>", description: "行のラッパーにドラッグ&ドロップや計測用の属性を追加します。" },
        { name: "className", type: "string", description: "必要に応じて外側に追加するクラスです。" },
    ],
    en: [
        { name: "nodes", type: "TreeNode[]", required: true, description: "Hierarchical data to render. Each node can include id, label, optional icon, and children." },
        { name: "expanded", type: "Set<string>", description: "Set of expanded node ids. Provide it to control expansion state." },
        { name: "onExpandedChange", type: "(expanded: Set<string>) => void", description: "Called when expansion state changes." },
        { name: "defaultExpanded", type: "string[]", description: "Initial expanded node ids for uncontrolled usage." },
        { name: "selectedId", type: "string", description: "Currently selected node id." },
        { name: "selectedIds", type: "Iterable<string>", description: "Node ids used to display multiple selected rows. Selection logic belongs to higher-level components such as FileTree." },
        { name: "selectionMode", type: '"single" | "multiple" | "none"', default: '"single"', description: "Controls selected row styling and aria selection semantics." },
        { name: "onSelectedIdChange", type: "(id: string) => void", description: "Called when a node is selected." },
        { name: "renderNodeMeta", type: "(node: TreeNode) => React.ReactNode", description: "Render function for supplemental row metadata, such as count, file size, or status. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Render props return JSX (no serializable alternative) — wrap in a \"use client\" component to pass from an RSC. (#338)" },
        { name: "renderNodeActions", type: "(node: TreeNode) => React.ReactNode", description: "Render function for row-end actions, such as edit, delete, or overflow menus. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Render props return JSX (no serializable alternative) — wrap in a \"use client\" component to pass from an RSC. (#338)" },
        { name: "getNodeRowProps", type: "(node: TreeNode) => HTMLAttributes<HTMLDivElement>", description: "Adds drag-and-drop or instrumentation attributes to the row wrapper." },
        { name: "className", type: "string", description: "Optional class added to the root element." },
    ],
} as const;

function buildNodes(locale: "ja" | "en"): TreeNode[] {
    return [
        {
            id: "guides",
            label: locale === "ja" ? "ガイド" : "guides",
            icon: <Folder className="h-4 w-4" />,
            children: [
                { id: "guides/getting-started.md", label: locale === "ja" ? "導入ガイド.md" : "getting-started.md", icon: <FileText className="h-4 w-4" /> },
                { id: "guides/release.md", label: locale === "ja" ? "公開手順.md" : "release.md", icon: <FileText className="h-4 w-4" /> },
            ],
        },
        {
            id: "assets",
            label: locale === "ja" ? "素材" : "assets",
            icon: <Folder className="h-4 w-4" />,
            children: [
                { id: "assets/hero.png", label: locale === "ja" ? "ヒーロー画像.png" : "hero.png", icon: <Image className="h-4 w-4" /> },
                { id: "assets/settings.json", label: locale === "ja" ? "表示設定.json" : "settings.json", icon: <Settings className="h-4 w-4" /> },
            ],
        },
    ];
}

function buildNodesWithoutIcons(locale: "ja" | "en"): TreeNode[] {
    return [
        {
            id: "settings",
            label: locale === "ja" ? "設定" : "settings",
            children: [
                { id: "settings/profile", label: locale === "ja" ? "プロフィール" : "profile" },
                { id: "settings/security", label: locale === "ja" ? "セキュリティ" : "security" },
            ],
        },
        {
            id: "help",
            label: locale === "ja" ? "ヘルプ" : "help",
            children: [
                { id: "help/contact", label: locale === "ja" ? "問い合わせ" : "contact" },
            ],
        },
    ];
}

function ControlledTreeView({ locale }: { locale: "ja" | "en" }) {
    const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set(["guides", "assets"]));
    const [selectedId, setSelectedId] = React.useState("guides/getting-started.md");
    const nodes = React.useMemo(() => buildNodes(locale), [locale]);

    React.useEffect(() => {
        setExpanded(new Set(["guides", "assets"]));
        setSelectedId("guides/getting-started.md");
    }, [locale]);

    return (
        <TreeView
            className="w-full max-w-sm"
            nodes={nodes}
            expanded={expanded}
            onExpandedChange={setExpanded}
            selectedId={selectedId}
            onSelectedIdChange={setSelectedId}
        />
    );
}

const nodeMetaByLocale = {
    ja: {
        guides: "2件",
        "guides/getting-started.md": "24 KB",
        "guides/release.md": "18 KB",
        assets: "2件",
        "assets/hero.png": "2.4 MB",
        "assets/settings.json": "8 KB",
    },
    en: {
        guides: "2 items",
        "guides/getting-started.md": "24 KB",
        "guides/release.md": "18 KB",
        assets: "2 items",
        "assets/hero.png": "2.4 MB",
        "assets/settings.json": "8 KB",
    },
} as const;

function getNodeLabel(node: TreeNode, locale: "ja" | "en") {
    if (typeof node.label === "string") return node.label;
    return locale === "ja" ? "項目" : "item";
}

function TreeViewWithMetaActions({ locale }: { locale: "ja" | "en" }) {
    const nodes = React.useMemo(() => buildNodes(locale), [locale]);
    const nodeMeta = nodeMetaByLocale[locale];

    return (
        <TreeView
            className="w-full max-w-sm"
            nodes={nodes}
            defaultExpanded={["guides", "assets"]}
            selectedId="assets/hero.png"
            renderNodeMeta={(node) => nodeMeta[node.id as keyof typeof nodeMeta] ?? null}
            renderNodeActions={(node) => {
                const label = getNodeLabel(node, locale);
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

export default function TreeViewPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/tree-view", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const nodes = React.useMemo(() => buildNodes(locale), [locale]);
    const code = codeByLocale[locale];

    return (
        <ComponentLayout
            title={content?.title ?? meta.treeView.title}
            description={content?.description ?? meta.treeView.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "TreeView", href: "/docs/components/tree-view" },
                { name: "DropdownMenu", href: "/docs/components/dropdown-menu" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
            ]}
            relatedComponents={[
                { name: "List", href: "/docs/components/list" },
                { name: "Accordion", href: "/docs/components/accordion" },
                { name: "FileTree", href: "/docs/components/file-tree" },
                { name: "MetadataList", href: "/docs/components/metadata-list" },
                { name: "ToolPill", href: "/docs/components/tool-pill" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="md" previewHeight="auto">
                <ControlledTreeView locale={locale} />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default-expanded",
                            title: locale === "ja" ? "初期展開" : "Default expanded",
                            description: locale === "ja"
                                ? "非制御で使う場合は defaultExpanded に最初から開くノードIDを渡します。"
                                : "For uncontrolled usage, pass initially open node ids to defaultExpanded.",
                            preview: <TreeView className="w-full max-w-sm" nodes={nodes} defaultExpanded={["guides"]} />,
                            code: defaultExpandedCodeByLocale[locale],
                        },
                        {
                            key: "controlled-selection",
                            title: locale === "ja" ? "選択状態" : "Controlled selection",
                            description: locale === "ja"
                                ? "ファイルブラウザーや設定ナビでは selectedId を外側の状態と同期します。"
                                : "In file browsers and settings navigation, synchronize selectedId with outer state.",
                            preview: <ControlledTreeView locale={locale} />,
                            code: selectedCodeByLocale[locale],
                        },
                        {
                            key: "without-icons",
                            title: locale === "ja" ? "アイコンなし" : "Without icons",
                            description: locale === "ja"
                                ? "設定やカテゴリのように文字だけで十分に判別できる階層では icon を省略できます。"
                                : "Omit icon when text labels are enough, such as settings or category trees.",
                            preview: <TreeView className="w-full max-w-sm" nodes={buildNodesWithoutIcons(locale)} defaultExpanded={["settings", "help"]} selectedId="settings/profile" />,
                            code: withoutIconsCodeByLocale[locale],
                        },
                        {
                            key: "with-icons",
                            title: locale === "ja" ? "アイコン付き" : "With icons",
                            description: locale === "ja"
                                ? "フォルダー、コード、画像など種類が混ざるツリーでは icon で判別性を上げます。"
                                : "Use icons to improve scanning when folders, code, and images appear together.",
                            preview: <TreeView className="w-full max-w-sm" nodes={nodes} defaultExpanded={["guides", "assets"]} selectedId="assets/hero.png" />,
                            code,
                        },
                        {
                            key: "meta-actions",
                            title: locale === "ja" ? "メタ情報と操作" : "Metadata and actions",
                            description: locale === "ja"
                                ? "件数やファイルサイズは renderNodeMeta、編集やメニューは renderNodeActions で上位の FileTree から差し込みます。"
                                : "Use renderNodeMeta for counts or file sizes, and renderNodeActions for edit or menu controls owned by a FileTree composition.",
                            preview: <TreeViewWithMetaActions locale={locale} />,
                            code: metaActionsCodeByLocale[locale],
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
