"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ContextMenuAuditDemo } from "@/components/demos/OverlayComponentDemos";
import overlayMetadata from "@design/overlay-metadata.json";

const codeByLocale = {
    ja: `import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@gunjo/ui";
import { IconCopy as Copy, IconFileText as FileText } from "@tabler/icons-react";

export function FileContextMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex min-h-40 w-full max-w-md items-center justify-center rounded-lg border border-dashed bg-muted/35 p-6 text-center text-sm text-muted-foreground">
        ここを右クリックして行アクションを開く
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuLabel>ファイル操作</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          詳細を表示
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy className="h-4 w-4 shrink-0 text-muted-foreground" />
          パスをコピー
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset disabled disabledReason="権限を変更するには管理者ロールが必要です。">権限を変更</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>お気に入り</ContextMenuCheckboxItem>
        <ContextMenuRadioGroup value="viewer">
          <ContextMenuLabel inset>権限</ContextMenuLabel>
          <ContextMenuRadioItem value="viewer">閲覧者</ContextMenuRadioItem>
          <ContextMenuRadioItem value="editor">編集者</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}`,
    en: `import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@gunjo/ui";
import { IconCopy as Copy, IconFileText as FileText } from "@tabler/icons-react";

export function FileContextMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex min-h-40 w-full max-w-md items-center justify-center rounded-lg border border-dashed bg-muted/35 p-6 text-center text-sm text-muted-foreground">
        Right-click here to open row actions
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuLabel>File actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          View details
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy className="h-4 w-4 shrink-0 text-muted-foreground" />
          Copy path
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset disabled disabledReason="You need the administrator role to change permissions.">Change permissions</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>Favorite</ContextMenuCheckboxItem>
        <ContextMenuRadioGroup value="viewer">
          <ContextMenuLabel inset>Role</ContextMenuLabel>
          <ContextMenuRadioItem value="viewer">Viewer</ContextMenuRadioItem>
          <ContextMenuRadioItem value="editor">Editor</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}`,
} as const;

const textOnlyCodeByLocale = {
    ja: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@gunjo/ui";

export function TextOnlyContextMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex min-h-40 w-full max-w-md items-center justify-center rounded-lg border border-dashed bg-muted/35 p-6 text-center text-sm text-muted-foreground">
        テキストのみのメニューを右クリックで開く
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>表示</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>プレビューを開く</ContextMenuItem>
        <ContextMenuItem>名前を変更</ContextMenuItem>
        <ContextMenuItem>複製</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled disabledReason="固定フォルダー内の項目は移動できません。">移動</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}`,
    en: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@gunjo/ui";

export function TextOnlyContextMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex min-h-40 w-full max-w-md items-center justify-center rounded-lg border border-dashed bg-muted/35 p-6 text-center text-sm text-muted-foreground">
        Right-click to open a text-only menu
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>View</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>Open preview</ContextMenuItem>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled disabledReason="Items in a locked folder cannot be moved.">Move</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}`,
} as const;

const nestedCodeByLocale = {
    ja: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@gunjo/ui";
import { IconCopy as Copy, IconFileText as FileText, IconSettings as Settings } from "@tabler/icons-react";

export function NestedContextMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex min-h-40 w-full max-w-md items-center justify-center rounded-lg border border-dashed bg-muted/35 p-6 text-center text-sm text-muted-foreground">
        サブメニューを含む操作を右クリックで開く
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuLabel>素材操作</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          詳細を表示
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
            変換
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>Web 用に圧縮</ContextMenuItem>
            <ContextMenuItem>サムネイルを作成</ContextMenuItem>
            <ContextMenuItem>メタデータを削除</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem>
          <Copy className="h-4 w-4 shrink-0 text-muted-foreground" />
          リンクをコピー
          <ContextMenuShortcut>⌘L</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset disabled disabledReason="非公開プロジェクトでは共有リンクを作成できません。">共有</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}`,
    en: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@gunjo/ui";
import { IconCopy as Copy, IconFileText as FileText, IconSettings as Settings } from "@tabler/icons-react";

export function NestedContextMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex min-h-40 w-full max-w-md items-center justify-center rounded-lg border border-dashed bg-muted/35 p-6 text-center text-sm text-muted-foreground">
        Right-click to open nested actions
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuLabel>Asset actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          View details
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
            Convert
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>Compress for web</ContextMenuItem>
            <ContextMenuItem>Create thumbnail</ContextMenuItem>
            <ContextMenuItem>Remove metadata</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem>
          <Copy className="h-4 w-4 shrink-0 text-muted-foreground" />
          Copy link
          <ContextMenuShortcut>⌘L</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset disabled disabledReason="Private projects cannot create share links.">Share</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}`,
} as const;

export default function ContextMenuPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const code = codeByLocale[locale];
    const textOnlyCode = textOnlyCodeByLocale[locale];
    const nestedCode = nestedCodeByLocale[locale];

    return (
        <ComponentLayout
            title={overlayMetadata.contextMenu.title}
            description={overlayMetadata.contextMenu.description}
            usedComponents={[
                { name: "ContextMenu", href: "/docs/components/context-menu" },
            ]}
            relatedComponents={[
                { name: "DropdownMenu", href: "/docs/components/dropdown-menu" },
                { name: "Menubar", href: "/docs/components/menubar" },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/context-menu"
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewHeight={360}
                previewBodyWidth="lg"
            >
                <ContextMenuAuditDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {isJa ? "状態とバリエーション" : "States and Variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "file-actions",
                            title: isJa ? "ファイルの行アクション" : "File row actions",
                            description: isJa
                                ? "右クリック、キーボード操作、チェック項目、単一選択を同じメニュー内で扱う例です。"
                                : "A context menu with right-click access, keyboard support, checkboxes, and radio selection.",
                            preview: <ContextMenuAuditDemo />,
                            code,
                            embedSrc: "/embed/context-menu?variant=file-actions",
                            previewHeight: 360,
                            previewBodyWidth: "lg",
                        },
                        {
                            key: "text-only",
                            title: isJa ? "テキストのみ" : "Text only",
                            description: isJa
                                ? "アイコンを使わないメニューでも、項目は左揃えで読みやすく配置します。"
                                : "Keeps a plain text menu left-aligned and easy to scan.",
                            preview: <ContextMenuAuditDemo variant="text-only" />,
                            code: textOnlyCode,
                            embedSrc: "/embed/context-menu?variant=text-only",
                            previewHeight: 360,
                            previewBodyWidth: "lg",
                        },
                        {
                            key: "nested-actions",
                            title: isJa ? "サブメニュー付き" : "Nested actions",
                            description: isJa
                                ? "関連する操作をサブメニューにまとめ、ショートカットや無効項目も同じ揃えで表示します。"
                                : "Groups related actions in a submenu while preserving shortcut and disabled item alignment.",
                            preview: <ContextMenuAuditDemo variant="nested-actions" />,
                            code: nestedCode,
                            embedSrc: "/embed/context-menu?variant=nested-actions",
                            previewHeight: 360,
                            previewBodyWidth: "lg",
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {sectionLabels.props}
                </h2>
                <PropsTable
                    data={[
                        {
                            name: "modal",
                            type: "boolean",
                            default: "true",
                            description: isJa ? "開いている間のフォーカス制御をモーダルとして扱うかを指定します。" : "Whether focus behavior should be modal while open.",
                        },
                        {
                            name: "onOpenChange",
                            type: "(open: boolean) => void",
                            description: isJa ? "開閉状態が変わった時に呼び出されます。" : "Called when the open state changes.",
                        },
                        {
                            name: "disabled",
                            type: "boolean",
                            description: isJa ? "トリガーや項目を操作できない状態にします。" : "Disables a trigger or menu item.",
                        },
                        {
                            name: "disabledReason",
                            type: "ReactNode",
                            description: isJa
                                ? "無効な項目に表示する理由です。hover / focus / スマホのタップでツールチップに表示します。"
                                : "Reason shown for a disabled item on hover, focus, or mobile tap.",
                        },
                        {
                            name: "portalContainer",
                            type: "HTMLElement | null",
                            description: isJa
                                ? "ContextMenuContent / ContextMenuSubContent のポータル先です。疑似ブラウザやプレビュー内にメニューを閉じ込める場合に使います。"
                                : "Portal target for ContextMenuContent and ContextMenuSubContent when the menu must stay inside a preview or framed app.",
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </section>
        </ComponentLayout>
    );
}
