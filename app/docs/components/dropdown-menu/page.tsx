"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    DropdownMenuAuditDemo,
    SplitDropdownMenuAuditDemo,
    UserMenuAuditDemo,
} from "@/components/demos/OverlayComponentDemos";
import overlayMetadata from "@design/overlay-metadata.json";

const codeByLocale = {
    ja: `import * as React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@gunjo/ui";

export function ViewSettingsMenu() {
  const [showStatus, setShowStatus] = React.useState(true);
  const [showActivity, setShowActivity] = React.useState(false);
  const [density, setDensity] = React.useState("comfortable");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">表示設定</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>表示</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
          ステータスバー
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={showActivity} onCheckedChange={setShowActivity}>
          アクティビティバー
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>密度</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
          <DropdownMenuRadioItem value="compact">コンパクト</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="comfortable">標準</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="spacious">ゆったり</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`,
    en: `import * as React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@gunjo/ui";

export function ViewSettingsMenu() {
  const [showStatus, setShowStatus] = React.useState(true);
  const [showActivity, setShowActivity] = React.useState(false);
  const [density, setDensity] = React.useState("comfortable");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View settings</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>View</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
          Status bar
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={showActivity} onCheckedChange={setShowActivity}>
          Activity bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Density</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
          <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="spacious">Spacious</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`,
} as const;

const splitButtonCodeByLocale = {
    ja: `import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gunjo/ui";
import { IconChevronDown as ChevronDown } from "@tabler/icons-react";

export function PublishSplitButton() {
  return (
    <DropdownMenu>
      <div className="inline-flex overflow-hidden rounded-md border bg-background shadow-sm">
        <Button variant="ghost" className="h-9 rounded-none border-0 px-3">
          公開
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-none border-0 border-l"
                aria-label="公開オプションを開く"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>公開オプションを開く</TooltipContent>
        </Tooltip>
      </div>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>公開オプション</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>今すぐ公開</DropdownMenuItem>
        <DropdownMenuItem>予約公開</DropdownMenuItem>
        <DropdownMenuItem>下書きとして保存</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>プレビューを共有</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`,
    en: `import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gunjo/ui";
import { IconChevronDown as ChevronDown } from "@tabler/icons-react";

export function PublishSplitButton() {
  return (
    <DropdownMenu>
      <div className="inline-flex overflow-hidden rounded-md border bg-background shadow-sm">
        <Button variant="ghost" className="h-9 rounded-none border-0 px-3">
          Publish
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-none border-0 border-l"
                aria-label="Open publish options"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Open publish options</TooltipContent>
        </Tooltip>
      </div>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Publish options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Publish now</DropdownMenuItem>
        <DropdownMenuItem>Schedule publish</DropdownMenuItem>
        <DropdownMenuItem>Save as draft</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Share preview</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`,
} as const;

const userMenuCodeByLocale = {
    ja: `import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@gunjo/ui";
import { IconLogout as LogOut, IconSettings as Settings, IconTrash as Trash2, IconUser as User } from "@tabler/icons-react";

export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">アカウント</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>アカウント</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          プロフィール
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          設定
          <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          アカウントを削除
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`,
    en: `import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@gunjo/ui";
import { IconLogout as LogOut, IconSettings as Settings, IconTrash as Trash2, IconUser as User } from "@tabler/icons-react";

export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
          <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete account
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`,
} as const;

export default function DropdownMenuPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const code = codeByLocale[locale];
    const userMenuCode = userMenuCodeByLocale[locale];
    const splitButtonCode = splitButtonCodeByLocale[locale];

    return (
        <ComponentLayout
            title={overlayMetadata.dropdownMenu.title}
            description={overlayMetadata.dropdownMenu.description}
            usedComponents={[
                { name: "Button", href: "/docs/components/button" },
            ]}
            relatedComponents={[
                { name: "ContextMenu", href: "/docs/components/context-menu" },
                { name: "Menubar", href: "/docs/components/menubar" },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/dropdown-menu"
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewHeight={360}
                fitEmbedHeightContent={false}
            >
                <DropdownMenuAuditDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {isJa ? "状態とバリエーション" : "States and Variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "checkbox-radio",
                            title: isJa ? "チェック項目と単一選択" : "Checkbox and radio items",
                            description: isJa
                                ? "表示設定や密度など、メニュー内で状態を切り替える例です。"
                                : "Use menu items to toggle settings and choose one value from a group.",
                            preview: <DropdownMenuAuditDemo />,
                            embedSrc: "/embed/dropdown-menu",
                            code,
                            previewHeight: 360,
                            fitEmbedHeightContent: false,
                        },
                        {
                            key: "account",
                            title: isJa ? "アカウントメニュー" : "Account menu",
                            description: isJa
                                ? "ショートカット、区切り、破壊的操作を含むよくあるユーザーメニューです。"
                                : "A common user menu with shortcuts, separators, and a destructive item.",
                            preview: <UserMenuAuditDemo />,
                            embedSrc: "/embed/dropdown-menu?variant=account",
                            code: userMenuCode,
                            previewHeight: 360,
                            fitEmbedHeightContent: false,
                        },
                        {
                            key: "split-button",
                            title: isJa ? "スプリットボタン" : "Split button",
                            description: isJa
                                ? "主操作は左側のボタンに残し、追加操作だけを下向きシェブロンから開きます。"
                                : "Keep the primary action on the main button and expose related actions from the chevron.",
                            preview: <SplitDropdownMenuAuditDemo />,
                            embedSrc: "/embed/dropdown-menu?variant=split-button",
                            code: splitButtonCode,
                            previewHeight: 360,
                            fitEmbedHeightContent: false,
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
                            name: "open",
                            type: "boolean",
                            description: isJa ? "開閉状態を外部で制御します。" : "Controlled open state.",
                        },
                        {
                            name: "onOpenChange",
                            type: "(open: boolean) => void",
                            description: isJa ? "開閉状態が変わった時に呼び出されます。" : "Called when open state changes.",
                        },
                        {
                            name: "portalContainer",
                            type: "HTMLElement | null",
                            description: isJa ? "プレビュー枠や疑似ブラウザ内に閉じ込めたい場合のポータル先です。" : "Portal target for framed previews or contained app surfaces.",
                        },
                        {
                            name: "disabled",
                            type: "boolean",
                            description: isJa ? "項目を選択できない状態にします。" : "Prevents a menu item from being selected.",
                        },
                        {
                            name: "DropdownMenuItem.disabledReason",
                            type: "React.ReactNode",
                            description: isJa ? "無効な項目に hover / focus / touch で表示する理由です。" : "Reason shown on hover, focus, and touch for a disabled item.",
                        },
                        {
                            name: "DropdownMenuItem.disabledReasonPortalContainer",
                            type: "HTMLElement | null",
                            description: isJa ? "プレビュー枠や疑似ブラウザ内にツールチップを閉じ込める場合のポータル先です。" : "Portal target for keeping the disabled reason tooltip inside a preview or fake browser.",
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
