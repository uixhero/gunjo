"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    ActionHoverCardDemo,
    HoverCardAuditDemo,
    NotificationHoverCardDemo,
    TabbedHoverCardDemo,
} from "@/components/demos/OverlayComponentDemos";
import overlayMetadata from "@design/overlay-metadata.json";
import { useState, type ReactNode } from "react";

function HoverCardPreviewSurface({ children }: { children: (portalContainer: HTMLElement | null) => ReactNode }) {
    const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);

    return (
        <div ref={setPortalContainer} className="relative flex min-h-[320px] items-center justify-center overflow-visible p-8">
            {children(portalContainer)}
        </div>
    );
}

const codeByLocale = {
    ja: `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@gunjo/ui";
import { IconCalendarEvent as CalendarDays } from "@tabler/icons-react";

export function ProfileHoverCard() {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <Button variant="link" className="px-0">@gunjo_design</Button>
      </HoverCardTrigger>
      <HoverCardContent sideOffset={8} className="w-80 items-start text-left">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
            <AvatarFallback>GU</AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-semibold">Gunjo Design</p>
            <p className="text-sm text-muted-foreground">
              Gunjo UI のコンポーネント、トークン、パターンを管理するチームです。
            </p>
            <p className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              2026年5月に更新
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}`,
    en: `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@gunjo/ui";
import { IconCalendarEvent as CalendarDays } from "@tabler/icons-react";

export function ProfileHoverCard() {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <Button variant="link" className="px-0">@gunjo_design</Button>
      </HoverCardTrigger>
      <HoverCardContent sideOffset={8} className="w-80 items-start text-left">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
            <AvatarFallback>GU</AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-semibold">Gunjo Design</p>
            <p className="text-sm text-muted-foreground">
              Team maintaining Gunjo UI components, tokens, and patterns.
            </p>
            <p className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              Updated May 2026
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}`,
} as const;

const notificationCodeByLocale = {
    ja: `import { Button, HoverCard, HoverCardContent, HoverCardTrigger } from "@gunjo/ui";
import { IconBell as Bell } from "@tabler/icons-react";

export function NotificationSummary() {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          通知
        </Button>
      </HoverCardTrigger>
      <HoverCardContent sideOffset={8} className="w-72 items-start text-left">
        <p className="text-sm font-semibold">未読 3 件</p>
        <p className="text-sm text-muted-foreground">
          ホバーカードは、遷移前に少量の補足情報を確認する用途に向いています。
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}`,
    en: `import { Button, HoverCard, HoverCardContent, HoverCardTrigger } from "@gunjo/ui";
import { IconBell as Bell } from "@tabler/icons-react";

export function NotificationSummary() {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </Button>
      </HoverCardTrigger>
      <HoverCardContent sideOffset={8} className="w-72 items-start text-left">
        <p className="text-sm font-semibold">3 unread</p>
        <p className="text-sm text-muted-foreground">
          HoverCard works well for lightweight context before navigation.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}`,
} as const;

const actionCodeByLocale = {
    ja: `import { Avatar, AvatarFallback, AvatarImage, Button, HoverCard, HoverCardContent, HoverCardTrigger } from "@gunjo/ui";
import { IconUser as User } from "@tabler/icons-react";

export function OwnerHoverCard() {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <Button variant="outline" className="gap-2">
          <User className="h-4 w-4" />
          担当者
        </Button>
      </HoverCardTrigger>
      <HoverCardContent sideOffset={8} className="w-80">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
            <AvatarFallback>AO</AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-semibold">青井 ひかり</p>
            <p className="text-sm text-muted-foreground">
              プロダクトデザインとドキュメント整備を担当しています。
            </p>
          </div>
        </div>
        <div className="flex w-full gap-2 pt-2">
          <Button size="sm" className="flex-1">フォロー</Button>
          <Button size="sm" variant="outline" className="flex-1">連絡</Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}`,
    en: `import { Avatar, AvatarFallback, AvatarImage, Button, HoverCard, HoverCardContent, HoverCardTrigger } from "@gunjo/ui";
import { IconUser as User } from "@tabler/icons-react";

export function OwnerHoverCard() {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <Button variant="outline" className="gap-2">
          <User className="h-4 w-4" />
          Owner
        </Button>
      </HoverCardTrigger>
      <HoverCardContent sideOffset={8} className="w-80">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
            <AvatarFallback>AO</AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-semibold">Hikari Aoi</p>
            <p className="text-sm text-muted-foreground">
              Owns product design and documentation quality.
            </p>
          </div>
        </div>
        <div className="flex w-full gap-2 pt-2">
          <Button size="sm" className="flex-1">Follow</Button>
          <Button size="sm" variant="outline" className="flex-1">Message</Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}`,
} as const;

const tabbedCodeByLocale = {
    ja: `import { Button, HoverCard, HoverCardContent, HoverCardTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from "@gunjo/ui";
import { IconFileText as FileText } from "@tabler/icons-react";

export function ReleaseHoverCard() {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          リリース概要
        </Button>
      </HoverCardTrigger>
      <HoverCardContent sideOffset={8} className="w-[min(24rem,calc(100vw-2rem))] p-3">
        <Tabs defaultValue="summary" className="w-full border-0">
          <TabsList className="min-h-10 w-full justify-start p-1">
            <TabsTrigger value="summary" className="h-8 px-3 text-xs">概要</TabsTrigger>
            <TabsTrigger value="changes" className="h-8 px-3 text-xs">変更</TabsTrigger>
            <TabsTrigger value="risk" className="h-8 px-3 text-xs">注意</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="mt-2 p-1 text-sm text-muted-foreground">
            入力、表示、チャート、フィードバックの監査済み内容をまとめたリリースです。
          </TabsContent>
          <TabsContent value="changes" className="mt-2 space-y-1 p-1 text-sm text-muted-foreground">
            <p>・docs プレビューの横幅と高さを整理</p>
            <p>・コード例をコピー可能な内容へ更新</p>
          </TabsContent>
          <TabsContent value="risk" className="mt-2 p-1 text-sm text-muted-foreground">
            カラー見直しは別タスクで全体確認します。
          </TabsContent>
        </Tabs>
      </HoverCardContent>
    </HoverCard>
  );
}`,
    en: `import { Button, HoverCard, HoverCardContent, HoverCardTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from "@gunjo/ui";
import { IconFileText as FileText } from "@tabler/icons-react";

export function ReleaseHoverCard() {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Release brief
        </Button>
      </HoverCardTrigger>
      <HoverCardContent sideOffset={8} className="w-[min(24rem,calc(100vw-2rem))] p-3">
        <Tabs defaultValue="summary" className="w-full border-0">
          <TabsList className="min-h-10 w-full justify-start p-1">
            <TabsTrigger value="summary" className="h-8 px-3 text-xs">Summary</TabsTrigger>
            <TabsTrigger value="changes" className="h-8 px-3 text-xs">Changes</TabsTrigger>
            <TabsTrigger value="risk" className="h-8 px-3 text-xs">Risk</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="mt-2 p-1 text-sm text-muted-foreground">
            Release summary for audited input, display, chart, and feedback components.
          </TabsContent>
          <TabsContent value="changes" className="mt-2 space-y-1 p-1 text-sm text-muted-foreground">
            <p>- Adjusted docs preview sizing</p>
            <p>- Updated code examples for copy-ready use</p>
          </TabsContent>
          <TabsContent value="risk" className="mt-2 p-1 text-sm text-muted-foreground">
            Semantic color review remains a separate follow-up.
          </TabsContent>
        </Tabs>
      </HoverCardContent>
    </HoverCard>
  );
}`,
} as const;

export default function HoverCardPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const code = codeByLocale[locale];
    const notificationCode = notificationCodeByLocale[locale];
    const actionCode = actionCodeByLocale[locale];
    const tabbedCode = tabbedCodeByLocale[locale];

    return (
        <ComponentLayout
            title={overlayMetadata.hoverCard.title}
            description={overlayMetadata.hoverCard.description}
            usedComponents={[
                { name: "Avatar", href: "/docs/components/avatar" },
                { name: "Button", href: "/docs/components/button" },
            ]}
            relatedComponents={[
                { name: "Tooltip", href: "/docs/components/tooltip" },
                { name: "Popover", href: "/docs/components/popover" },
            ]}
        >
            <ComponentPreview
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewHeight="auto"
                className="overflow-visible"
            >
                <HoverCardPreviewSurface>
                    {(portalContainer) => <HoverCardAuditDemo portalContainer={portalContainer} />}
                </HoverCardPreviewSurface>
            </ComponentPreview>

            <section className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {isJa ? "状態とバリエーション" : "States and Variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "profile",
                            title: isJa ? "プロフィール概要" : "Profile preview",
                            description: isJa
                                ? "リンク先に移動する前に、人物やチームの概要を確認する例です。"
                                : "Preview a person or team before navigating away.",
                            preview: (
                                <HoverCardPreviewSurface>
                                    {(portalContainer) => <HoverCardAuditDemo portalContainer={portalContainer} />}
                                </HoverCardPreviewSurface>
                            ),
                            code,
                            previewHeight: "auto",
                            previewClassName: "overflow-visible",
                        },
                        {
                            key: "notification",
                            title: isJa ? "補足サマリー" : "Supplemental summary",
                            description: isJa
                                ? "通知数やステータスなど、短い補足情報の表示にも使えます。"
                                : "Use it for short supplemental summaries such as counts or status.",
                            preview: (
                                <HoverCardPreviewSurface>
                                    {(portalContainer) => <NotificationHoverCardDemo portalContainer={portalContainer} />}
                                </HoverCardPreviewSurface>
                            ),
                            code: notificationCode,
                            previewHeight: "auto",
                            previewClassName: "overflow-visible",
                        },
                        {
                            key: "actions",
                            title: isJa ? "アクションボタン付き" : "With action buttons",
                            description: isJa
                                ? "人物や担当者の概要に、フォローや連絡などの軽い操作を添える例です。"
                                : "Add lightweight actions such as follow or message to a person preview.",
                            preview: (
                                <HoverCardPreviewSurface>
                                    {(portalContainer) => <ActionHoverCardDemo portalContainer={portalContainer} />}
                                </HoverCardPreviewSurface>
                            ),
                            code: actionCode,
                            previewHeight: "auto",
                            previewClassName: "overflow-visible",
                        },
                        {
                            key: "tabs",
                            title: isJa ? "タブ付きカード" : "Tabbed card",
                            description: isJa
                                ? "1枚のホバーカード内で、概要・変更・注意点のように短い情報を切り替えます。"
                                : "Switch compact details such as summary, changes, and risk inside one hover card.",
                            preview: (
                                <HoverCardPreviewSurface>
                                    {(portalContainer) => <TabbedHoverCardDemo portalContainer={portalContainer} />}
                                </HoverCardPreviewSurface>
                            ),
                            code: tabbedCode,
                            previewHeight: "auto",
                            previewClassName: "overflow-visible",
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
                            name: "openDelay",
                            type: "number",
                            default: "700",
                            description: isJa ? "トリガーに入ってから開くまでの遅延時間です。" : "Delay before opening after pointer enters the trigger.",
                        },
                        {
                            name: "closeDelay",
                            type: "number",
                            default: "300",
                            description: isJa ? "トリガーから離れてから閉じるまでの遅延時間です。" : "Delay before closing after pointer leaves the trigger.",
                        },
                        {
                            name: "portalContainer",
                            type: "HTMLElement | null",
                            description: isJa ? "プレビュー枠や疑似ブラウザ内に閉じ込めたい場合のポータル先です。" : "Portal target for framed previews or contained app surfaces.",
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
