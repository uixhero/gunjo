"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
    DocNote,
} from "@gunjo/ui";

function MenubarExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>{isJa ? "ファイル" : "File"}</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>{isJa ? "新しいタブ" : "New tab"} <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
                    <MenubarItem>{isJa ? "新しいウィンドウ" : "New window"} <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                    <MenubarItem>{isJa ? "書き出し設定を開く" : "Open export settings"}</MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                        <MenubarSubTrigger>{isJa ? "共有" : "Share"}</MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarItem>{isJa ? "リンクをコピー" : "Copy link"}</MenubarItem>
                            <MenubarItem>{isJa ? "メールで送信" : "Send email"}</MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>{isJa ? "編集" : "Edit"}</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>{isJa ? "取り消し" : "Undo"} <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
                    <MenubarItem>{isJa ? "やり直し" : "Redo"} <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>{isJa ? "切り取り" : "Cut"} <MenubarShortcut>⌘X</MenubarShortcut></MenubarItem>
                    <MenubarItem>{isJa ? "コピー" : "Copy"} <MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
                    <MenubarItem>{isJa ? "貼り付け" : "Paste"} <MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                        <MenubarSubTrigger>{isJa ? "検索" : "Find"}</MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarItem>{isJa ? "このページを検索" : "Find in page"} <MenubarShortcut>⌘F</MenubarShortcut></MenubarItem>
                            <MenubarItem>{isJa ? "次を検索" : "Find next"} <MenubarShortcut>⌘G</MenubarShortcut></MenubarItem>
                            <MenubarItem>{isJa ? "前を検索" : "Find previous"} <MenubarShortcut>⇧⌘G</MenubarShortcut></MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>{isJa ? "表示" : "View"}</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>{isJa ? "再読み込み" : "Reload"} <MenubarShortcut>⌘R</MenubarShortcut></MenubarItem>
                    <MenubarItem>{isJa ? "全画面表示" : "Fullscreen"}</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}

function ViewSettingsMenubarExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>{isJa ? "表示" : "View"}</MenubarTrigger>
                <MenubarContent>
                    <MenubarCheckboxItem checked>{isJa ? "サイドバーを表示" : "Show sidebar"}</MenubarCheckboxItem>
                    <MenubarCheckboxItem>{isJa ? "ステータスバーを表示" : "Show status bar"}</MenubarCheckboxItem>
                    <MenubarSeparator />
                    <MenubarRadioGroup value="comfortable">
                        <MenubarRadioItem value="compact">{isJa ? "コンパクト" : "Compact"}</MenubarRadioItem>
                        <MenubarRadioItem value="comfortable">{isJa ? "標準" : "Comfortable"}</MenubarRadioItem>
                    </MenubarRadioGroup>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}

function AppWindowMenubarExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <div className="w-full max-w-2xl overflow-hidden rounded-md border bg-background shadow-sm">
            <div className="flex h-10 items-center justify-between border-b bg-muted/40 px-3">
                <div className="flex items-center gap-1.5" aria-hidden>
                    <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                    <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                    <span className="h-2.5 w-2.5 rounded-full bg-success" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">{isJa ? "キャンバス編集" : "Canvas editor"}</p>
                <div className="w-12" />
            </div>
            <Menubar className="h-9 rounded-none border-x-0 border-t-0 bg-background">
                <MenubarMenu>
                    <MenubarTrigger>{isJa ? "ファイル" : "File"}</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>{isJa ? "保存" : "Save"} <MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
                        <MenubarItem>{isJa ? "別名で保存" : "Save as"} <MenubarShortcut>⇧⌘S</MenubarShortcut></MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>{isJa ? "編集" : "Edit"}</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>{isJa ? "取り消し" : "Undo"} <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
                        <MenubarItem>{isJa ? "やり直し" : "Redo"} <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>{isJa ? "複製" : "Duplicate"} <MenubarShortcut>⌘D</MenubarShortcut></MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>{isJa ? "表示" : "View"}</MenubarTrigger>
                    <MenubarContent>
                        <MenubarCheckboxItem checked>{isJa ? "グリッドを表示" : "Show grid"}</MenubarCheckboxItem>
                        <MenubarCheckboxItem>{isJa ? "ガイドを表示" : "Show guides"}</MenubarCheckboxItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
            <div className="grid min-h-36 place-items-center bg-muted/20 p-6 text-sm text-muted-foreground">
                {isJa ? "作業領域" : "Workspace"}
            </div>
        </div>
    );
}

export default function MenubarPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const code = `import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@gunjo/ui"

export function FileMenubar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>${isJa ? "ファイル" : "File"}</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>${isJa ? "新しいタブ" : "New tab"} <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
          <MenubarItem>${isJa ? "新しいウィンドウ" : "New window"} <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarItem>${isJa ? "書き出し設定を開く" : "Open export settings"}</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>${isJa ? "共有" : "Share"}</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>${isJa ? "リンクをコピー" : "Copy link"}</MenubarItem>
              <MenubarItem>${isJa ? "メールで送信" : "Send email"}</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>${isJa ? "編集" : "Edit"}</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>${isJa ? "取り消し" : "Undo"} <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
          <MenubarItem>${isJa ? "やり直し" : "Redo"} <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>${isJa ? "切り取り" : "Cut"} <MenubarShortcut>⌘X</MenubarShortcut></MenubarItem>
          <MenubarItem>${isJa ? "コピー" : "Copy"} <MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
          <MenubarItem>${isJa ? "貼り付け" : "Paste"} <MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>${isJa ? "検索" : "Find"}</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>${isJa ? "このページを検索" : "Find in page"} <MenubarShortcut>⌘F</MenubarShortcut></MenubarItem>
              <MenubarItem>${isJa ? "次を検索" : "Find next"} <MenubarShortcut>⌘G</MenubarShortcut></MenubarItem>
              <MenubarItem>${isJa ? "前を検索" : "Find previous"} <MenubarShortcut>⇧⌘G</MenubarShortcut></MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>${isJa ? "表示" : "View"}</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>${isJa ? "再読み込み" : "Reload"} <MenubarShortcut>⌘R</MenubarShortcut></MenubarItem>
          <MenubarItem>${isJa ? "全画面表示" : "Fullscreen"}</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}`;
    const checksCode = `import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarTrigger } from "@gunjo/ui"

export function ViewMenubar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>${isJa ? "表示" : "View"}</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked>${isJa ? "サイドバーを表示" : "Show sidebar"}</MenubarCheckboxItem>
          <MenubarCheckboxItem>${isJa ? "ステータスバーを表示" : "Show status bar"}</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarRadioGroup value="comfortable">
            <MenubarRadioItem value="compact">${isJa ? "コンパクト" : "Compact"}</MenubarRadioItem>
            <MenubarRadioItem value="comfortable">${isJa ? "標準" : "Comfortable"}</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}`;
    const appWindowCode = `import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@gunjo/ui"

export function EditorWindowMenubar() {
  return (
    <div className="overflow-hidden rounded-md border bg-background">
      <div className="flex h-10 items-center justify-center border-b bg-muted/40 text-xs font-medium text-muted-foreground">
        ${isJa ? "キャンバス編集" : "Canvas editor"}
      </div>
      <Menubar className="h-9 rounded-none border-x-0 border-t-0 bg-background">
        <MenubarMenu>
          <MenubarTrigger>${isJa ? "ファイル" : "File"}</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>${isJa ? "保存" : "Save"} <MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
            <MenubarItem>${isJa ? "別名で保存" : "Save as"} <MenubarShortcut>⇧⌘S</MenubarShortcut></MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>${isJa ? "編集" : "Edit"}</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>${isJa ? "取り消し" : "Undo"} <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
            <MenubarItem>${isJa ? "やり直し" : "Redo"} <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
            <MenubarSeparator />
            <MenubarItem>${isJa ? "複製" : "Duplicate"} <MenubarShortcut>⌘D</MenubarShortcut></MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>${isJa ? "表示" : "View"}</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked>${isJa ? "グリッドを表示" : "Show grid"}</MenubarCheckboxItem>
            <MenubarCheckboxItem>${isJa ? "ガイドを表示" : "Show guides"}</MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}`;

    return (
        <ComponentLayout
            title={navigationMetadata.menubar.title}
            description={isJa ? "作業中の画面に対するコマンドを、ファイル・編集・表示のような常時表示メニューにまとめます。" : navigationMetadata.menubar.description}
            sectionLabels={sectionLabels}
            usedComponents={[{ name: "Menubar", href: "/docs/components/menubar" }]}
            relatedComponents={[{ name: "ContextMenu", href: "/docs/components/context-menu" }]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="md" previewHeight="auto">
                <MenubarExample />
            </ComponentPreview>

            <DocNote heading={isJa ? "使いどころ" : "When to use"} className="w-full">
                {isJa
                    ? "メニューバーはサイト全体のページ移動ではなく、エディタや管理画面などの作業領域に対するコマンドを並べるために使います。ウィンドウのヘッダー直下やツールバーの上に置く用途が中心です。ContextMenu は右クリックや長押しで対象物ごとに出す一時メニューなので、常時見せる操作群は Menubar、選択中の行やカードなど対象に紐づく操作は ContextMenu に分けます。標準のトリガーには下向きシェヴロンを付けず、サブメニューだけ右向きシェヴロンで階層を示します。"
                    : "Use Menubar for commands that act on the current app workspace, not for global site navigation. It usually sits below a window header or above a toolbar. ContextMenu is a temporary menu opened from right-click or long-press on a specific target, so keep always-visible command groups in Menubar and target-specific actions on rows, cards, or objects in ContextMenu. Top-level triggers do not need down chevrons; nested submenu triggers use right chevrons to show hierarchy."}
            </DocNote>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {isJa ? "状態とバリエーション" : "States and variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "app-window",
                            title: isJa ? "ウィンドウヘッダー下" : "Below a window header",
                            description: isJa ? "エディタや管理画面のタイトルバー直下に置き、現在の作業対象に対する操作をまとめます。" : "Place it below an editor or admin window header to group commands for the current workspace.",
                            preview: <AppWindowMenubarExample />,
                            previewBodyWidth: "full",
                            previewHeight: "auto",
                            code: appWindowCode,
                        },
                        {
                            key: "checkbox-radio",
                            title: isJa ? "チェックと選択肢" : "Checks and radio items",
                            description: isJa ? "表示設定やモード切替のように、現在値をメニュー内で示す場合に使います。" : "Use checked and radio items when the menu needs to show current view settings.",
                            preview: <ViewSettingsMenubarExample />,
                            previewBodyWidth: "md",
                            previewHeight: "auto",
                            code: checksCode,
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
                        { name: "Menubar", type: "Root", description: isJa ? "横並びのメニュー群をまとめるルート。" : "Root for a horizontal application menubar." },
                        { name: "MenubarTrigger", type: "button", description: isJa ? "各メニューを開くトリガー。" : "Trigger that opens one menu." },
                        { name: "MenubarContent", type: "menu", description: isJa ? "項目、区切り線、サブメニューを含むポップアップ領域。" : "Popup menu content containing items, separators, and submenus." },
                        { name: "MenubarItem.disabled", type: "boolean", description: isJa ? "利用できない項目を表示だけ残します。" : "Keeps an unavailable item visible but inactive." },
                        { name: "MenubarItem.disabledReason", type: "React.ReactNode", description: isJa ? "無効な項目に hover / focus / touch で表示する理由です。" : "Reason shown on hover, focus, and touch for a disabled item." },
                        { name: "MenubarItem.disabledReasonLabel", type: "string", description: isJa ? "無効理由を読むためのフォーカス対象に付ける支援技術向けラベル。" : "Accessible label for the disabled reason trigger." },
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
