"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DrawerAuditDemo } from "@/components/demos/OverlayComponentDemos";
import overlayMetadata from "@design/overlay-metadata.json";

type DrawerSide = "bottom" | "right" | "left" | "top";

function createDrawerCode(locale: "ja" | "en", side: DrawerSide = "bottom") {
    const isJa = locale === "ja";
    const componentNameBySide: Record<DrawerSide, string> = {
        bottom: "DeliverySettingsDrawer",
        right: "RightDeliverySettingsDrawer",
        left: "LeftDeliverySettingsDrawer",
        top: "TopDeliverySettingsDrawer",
    };
    const componentName = componentNameBySide[side];
    const directionProp = side === "bottom" ? "" : ` direction="${side}"`;
    const contentSideProp = side === "bottom" ? "" : ` side="${side}"`;

    return `import * as React from "react";
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  Label,
  Textarea,
} from "@gunjo/ui";

export function ${componentName}() {
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);

  return (
    <div ref={setPortalContainer} className="relative min-h-[420px] overflow-hidden rounded-md">
      <Drawer${directionProp} shouldScaleBackground={false} container={portalContainer}>
        <DrawerTrigger asChild>
          <Button variant="outline">${isJa ? "詳細を開く" : "Open details"}</Button>
        </DrawerTrigger>
        <DrawerContent${contentSideProp} portalContainer={portalContainer}>
          <DrawerHeader>
            <DrawerTitle>${isJa ? "配信設定" : "Delivery settings"}</DrawerTitle>
            <DrawerDescription>
              ${isJa
                ? "画面を離れずに補助的な設定を確認・変更します。"
                : "Review and change supporting settings without leaving the page."}
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-3 px-4 pb-4">
            <Label htmlFor="title">${isJa ? "タイトル" : "Title"}</Label>
            <Input id="title" className="w-full" defaultValue="${isJa ? "週次レポート" : "Weekly report"}" />
            <Label htmlFor="note">${isJa ? "補足" : "Note"}</Label>
            <Textarea id="note" className="w-full" defaultValue="${isJa ? "公開前にレビューが必要です。" : "Review is required before publishing."}" />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">${isJa ? "キャンセル" : "Cancel"}</Button>
            </DrawerClose>
            <Button>${isJa ? "保存" : "Save"}</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}`;
}

export default function DrawerPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const code = createDrawerCode(locale);
    const rightCode = createDrawerCode(locale, "right");
    const leftCode = createDrawerCode(locale, "left");
    const topCode = createDrawerCode(locale, "top");

    return (
        <ComponentLayout
            title={overlayMetadata.drawer.title}
            description={overlayMetadata.drawer.description}
            usedComponents={[
                { name: "Button", href: "/docs/components/button" },
                { name: "Input", href: "/docs/components/input" },
                { name: "Textarea", href: "/docs/components/textarea" },
            ]}
            relatedComponents={[
                { name: "Dialog", href: "/docs/components/dialog" },
                { name: "Sheet", href: "/docs/components/sheet" },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/drawer"
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewHeight={420}
                fitEmbedHeightContent={false}
            >
                <DrawerAuditDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {isJa ? "状態とバリエーション" : "States and Variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "bottom",
                            title: isJa ? "下から開く標準表示" : "Bottom drawer",
                            description: isJa
                                ? "モバイル寄りの補助操作や短いフォームに向いた標準形です。"
                                : "Default mobile-friendly shape for supporting actions and short forms.",
                            preview: <DrawerAuditDemo />,
                            embedSrc: "/embed/drawer?side=bottom",
                            code,
                            previewHeight: 420,
                            fitEmbedHeightContent: false,
                        },
                        {
                            key: "right",
                            title: isJa ? "右から開く" : "Right side",
                            description: isJa
                                ? "広い画面では、詳細パネルや設定パネルとして右側から開けます。"
                                : "On wider screens, use the side variant for detail or settings panels.",
                            preview: <DrawerAuditDemo side="right" />,
                            embedSrc: "/embed/drawer?side=right",
                            code: rightCode,
                            previewHeight: 420,
                            fitEmbedHeightContent: false,
                        },
                        {
                            key: "left",
                            title: isJa ? "左から開く" : "Left side",
                            description: isJa
                                ? "ナビゲーションや補助メニューを左側から開く構成です。"
                                : "Use the left side for navigation or supporting menus.",
                            preview: <DrawerAuditDemo side="left" />,
                            embedSrc: "/embed/drawer?side=left",
                            code: leftCode,
                            previewHeight: 420,
                            fitEmbedHeightContent: false,
                        },
                        {
                            key: "top",
                            title: isJa ? "上から開く" : "Top drawer",
                            description: isJa
                                ? "短い確認や一時的な設定を上部から表示できます。"
                                : "Use the top edge for short confirmations or temporary settings.",
                            preview: <DrawerAuditDemo side="top" />,
                            embedSrc: "/embed/drawer?side=top",
                            code: topCode,
                            previewHeight: 420,
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
                            name: "side",
                            type: '"bottom" | "right" | "left" | "top"',
                            default: '"bottom"',
                            description: isJa ? "DrawerContent の表示方向です。" : "Side where DrawerContent appears.",
                        },
                        {
                            name: "shouldScaleBackground",
                            type: "boolean",
                            default: "true",
                            description: isJa ? "開いた時に背面を縮小するかを制御します。" : "Controls whether the background scales while the drawer is open.",
                        },
                        {
                            name: "container",
                            type: "HTMLElement | null",
                            description: isJa ? "Drawer のポータルや背面処理を閉じ込めるコンテナです。" : "Container used to scope the drawer portal and background behavior.",
                        },
                        {
                            name: "portalContainer",
                            type: "HTMLElement | null",
                            description: isJa ? "DrawerContent を描画するポータル先です。docs や埋め込みプレビュー内に閉じ込める時に使います。" : "Portal target for DrawerContent, useful for containing the drawer inside docs or embedded previews.",
                        },
                        {
                            name: "overlayClassName",
                            type: "string",
                            description: isJa ? "DrawerOverlay に追加するクラス名です。" : "Additional class name applied to DrawerOverlay.",
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
