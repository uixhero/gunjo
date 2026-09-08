"use client";

import { Button, EditorTemplate, Input, Label, Menubar, MenubarMenu, MenubarTrigger } from "@gunjo/ui";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { EditorTemplateDemo } from "@/components/demos/TemplateDemos";
import { useLocale } from "@/components/providers/LocaleProvider";
import patternsMetadata from "@design/patterns-metadata.json";

const usageCode = `import { EditorTemplate } from "@gunjo/ui";

export function EditorPage() {
  return (
    <EditorTemplate
        topBar={<div className="h-14 border-b flex items-center px-4">Toolbar</div>}
        leftPanel={<div className="w-64 border-r h-full p-4">Layers</div>}
        rightPanel={<div className="w-72 border-l h-full p-4">Properties</div>}
    >
        <div className="flex-1 bg-muted/50 flex items-center justify-center">
            Canvas Area
        </div>
    </EditorTemplate>
  )
}`;

const propsData = [
    {
        name: "topBar",
        type: "React.ReactNode",
        description: "Content for the top toolbar area (fixed height).",
    },
    {
        name: "leftPanel",
        type: "React.ReactNode",
        description: "Content for the left sidebar (collapsible/responsive logic handled internally if needed).",
    },
    {
        name: "rightPanel",
        type: "React.ReactNode",
        description: "Content for the right sidebar (typically for properties/inspectors).",
    },
    {
        name: "children",
        type: "React.ReactNode",
        description: "The central canvas area content.",
    },
    {
        name: "className",
        type: "string",
        description: "Additional classes for the root container.",
    }
];

export default function EditorPage() {
    const { locale } = useLocale();

    const canvas = (
        <div className="flex items-center justify-center p-10">
            <div className="rounded-lg border bg-background px-16 py-12 text-sm text-muted-foreground">
                {locale === "ja" ? "アートボード" : "Artboard"}
            </div>
        </div>
    );

    const layerNames = locale === "ja"
        ? ["長方形 1", "楕円 2", "テキスト"]
        : ["Rectangle 1", "Ellipse 2", "Text layer"];

    const layersPanel = (
        <div className="space-y-3 p-3">
            <p className="px-1 text-xs font-semibold uppercase text-muted-foreground">
                {locale === "ja" ? "レイヤー" : "Layers"}
            </p>
            <div className="space-y-1">
                {layerNames.map((name, index) => (
                    <div key={name} className={index === 0 ? "rounded bg-accent px-2 py-1 text-sm" : "rounded px-2 py-1 text-sm text-muted-foreground"}>
                        {name}
                    </div>
                ))}
            </div>
        </div>
    );

    const toolbar = (
        <div className="flex w-full items-center justify-between px-4">
            <Menubar className="border-none">
                <MenubarMenu>
                    <MenubarTrigger>{locale === "ja" ? "ファイル" : "File"}</MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>{locale === "ja" ? "編集" : "Edit"}</MenubarTrigger>
                </MenubarMenu>
            </Menubar>
            <Button size="sm">{locale === "ja" ? "共有" : "Share"}</Button>
        </div>
    );

    return (
        <ComponentLayout
            title={patternsMetadata.editorTemplate.title}
            description={patternsMetadata.editorTemplate.description}
            usedComponents={[
                { name: "EditorTemplate", href: "/docs/components/editor" },
                { name: "Menubar", href: "/docs/components/menubar" },
                { name: "SpatialCanvas", href: "/docs/components/spatial-canvas" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Input", href: "/docs/components/input" },
                { name: "Label", href: "/docs/components/label" },
            ]}
            relatedComponents={[
                { name: "BannalyzeTemplate", href: "/docs/components/bannalyze" },
                { name: "MediaLibraryTemplate", href: "/docs/components/media-library" },
                { name: "InspectorPanel", href: "/docs/components/inspector-panel" },
                { name: "FloatingPanel", href: "/docs/components/floating-panel" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/editor" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <EditorTemplateDemo />
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "topBar・leftPanel・rightPanel はどれも省略でき、渡した口だけが現れます。左の枠は中くらいの幅から、右の枠は広い幅から出ます。"
                        : "topBar, leftPanel, and rightPanel are all optional, and only the slots you pass appear. The left panel shows from medium widths, the right one only on wide screens."}
                </p>
                <ComponentDemoStates
                    states={[
                        {
                            key: "all-panels",
                            title: locale === "ja" ? "3つの枠すべて" : "All three panels",
                            description: locale === "ja"
                                ? "上の帯・左のレイヤー・右の属性をそろえた、編集画面の標準形です。"
                                : "Toolbar on top, layers on the left, properties on the right — the standard editing screen.",
                            preview: (
                                <EditorTemplate
                                    className="h-auto"
                                    topBar={toolbar}
                                    leftPanel={layersPanel}
                                    rightPanel={
                                        <div className="space-y-4 p-4">
                                            <p className="text-xs font-semibold uppercase text-muted-foreground">
                                                {locale === "ja" ? "属性" : "Properties"}
                                            </p>
                                            <div className="grid gap-2">
                                                <Label htmlFor="editor-width">{locale === "ja" ? "幅" : "Width"}</Label>
                                                <Input id="editor-width" defaultValue="100%" />
                                            </div>
                                        </div>
                                    }
                                >
                                    {canvas}
                                </EditorTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Button, EditorTemplate, Input, Label } from "@gunjo/ui";

export function FullEditor() {
  return (
    <EditorTemplate
      className="h-auto"
      topBar={
        <div className="flex w-full items-center justify-between px-4">
          <span className="text-sm font-medium">名称未設定</span>
          <Button size="sm">共有</Button>
        </div>
      }
      leftPanel={
        <div className="space-y-1 p-3">
          <p className="px-1 text-xs font-semibold uppercase text-muted-foreground">レイヤー</p>
          <div className="rounded bg-accent px-2 py-1 text-sm">長方形 1</div>
        </div>
      }
      rightPanel={
        <div className="space-y-4 p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">属性</p>
          <div className="grid gap-2">
            <Label htmlFor="width">幅</Label>
            <Input id="width" defaultValue="100%" />
          </div>
        </div>
      }
    >
      <div className="flex items-center justify-center p-10">
        <div className="rounded-lg border bg-background px-16 py-12 text-sm text-muted-foreground">
          アートボード
        </div>
      </div>
    </EditorTemplate>
  );
}`
                                : `import { Button, EditorTemplate, Input, Label } from "@gunjo/ui";

export function FullEditor() {
  return (
    <EditorTemplate
      className="h-auto"
      topBar={
        <div className="flex w-full items-center justify-between px-4">
          <span className="text-sm font-medium">Untitled design</span>
          <Button size="sm">Share</Button>
        </div>
      }
      leftPanel={
        <div className="space-y-1 p-3">
          <p className="px-1 text-xs font-semibold uppercase text-muted-foreground">Layers</p>
          <div className="rounded bg-accent px-2 py-1 text-sm">Rectangle 1</div>
        </div>
      }
      rightPanel={
        <div className="space-y-4 p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Properties</p>
          <div className="grid gap-2">
            <Label htmlFor="width">Width</Label>
            <Input id="width" defaultValue="100%" />
          </div>
        </div>
      }
    >
      <div className="flex items-center justify-center p-10">
        <div className="rounded-lg border bg-background px-16 py-12 text-sm text-muted-foreground">
          Artboard
        </div>
      </div>
    </EditorTemplate>
  );
}`,
                        },
                        {
                            key: "no-right-panel",
                            title: locale === "ja" ? "右の枠を外す" : "Without the right panel",
                            description: locale === "ja"
                                ? "rightPanel を省くと、キャンバスが右まで広がります。属性を浮かせて出す編集画面はこの形です。"
                                : "Drop rightPanel and the canvas runs to the right edge. Editors that float their inspector use this shape.",
                            preview: (
                                <EditorTemplate className="h-auto" topBar={toolbar} leftPanel={layersPanel}>
                                    {canvas}
                                </EditorTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Button, EditorTemplate } from "@gunjo/ui";

export function EditorWithoutInspector() {
  return (
    <EditorTemplate
      className="h-auto"
      topBar={
        <div className="flex w-full items-center justify-between px-4">
          <span className="text-sm font-medium">名称未設定</span>
          <Button size="sm">共有</Button>
        </div>
      }
      leftPanel={
        <div className="space-y-1 p-3">
          <p className="px-1 text-xs font-semibold uppercase text-muted-foreground">レイヤー</p>
          <div className="rounded bg-accent px-2 py-1 text-sm">長方形 1</div>
        </div>
      }
    >
      <div className="flex items-center justify-center p-10">
        <div className="rounded-lg border bg-background px-16 py-12 text-sm text-muted-foreground">
          アートボード
        </div>
      </div>
    </EditorTemplate>
  );
}`
                                : `import { Button, EditorTemplate } from "@gunjo/ui";

export function EditorWithoutInspector() {
  return (
    <EditorTemplate
      className="h-auto"
      topBar={
        <div className="flex w-full items-center justify-between px-4">
          <span className="text-sm font-medium">Untitled design</span>
          <Button size="sm">Share</Button>
        </div>
      }
      leftPanel={
        <div className="space-y-1 p-3">
          <p className="px-1 text-xs font-semibold uppercase text-muted-foreground">Layers</p>
          <div className="rounded bg-accent px-2 py-1 text-sm">Rectangle 1</div>
        </div>
      }
    >
      <div className="flex items-center justify-center p-10">
        <div className="rounded-lg border bg-background px-16 py-12 text-sm text-muted-foreground">
          Artboard
        </div>
      </div>
    </EditorTemplate>
  );
}`,
                        },
                        {
                            key: "canvas-only",
                            title: locale === "ja" ? "キャンバスだけ" : "Canvas only",
                            description: locale === "ja"
                                ? "topBar だけを残して左右を外すと、絵に集中する形になります。閲覧や書き出しの画面に向きます。"
                                : "Keep only topBar and the screen gives all its room to the artwork. This suits viewing and export modes.",
                            preview: (
                                <EditorTemplate className="h-auto" topBar={toolbar}>
                                    {canvas}
                                </EditorTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Button, EditorTemplate } from "@gunjo/ui";

export function CanvasOnlyEditor() {
  return (
    <EditorTemplate
      className="h-auto"
      topBar={
        <div className="flex w-full items-center justify-between px-4">
          <span className="text-sm font-medium">名称未設定</span>
          <Button size="sm">共有</Button>
        </div>
      }
    >
      <div className="flex items-center justify-center p-10">
        <div className="rounded-lg border bg-background px-16 py-12 text-sm text-muted-foreground">
          アートボード
        </div>
      </div>
    </EditorTemplate>
  );
}`
                                : `import { Button, EditorTemplate } from "@gunjo/ui";

export function CanvasOnlyEditor() {
  return (
    <EditorTemplate
      className="h-auto"
      topBar={
        <div className="flex w-full items-center justify-between px-4">
          <span className="text-sm font-medium">Untitled design</span>
          <Button size="sm">Share</Button>
        </div>
      }
    >
      <div className="flex items-center justify-center p-10">
        <div className="rounded-lg border bg-background px-16 py-12 text-sm text-muted-foreground">
          Artboard
        </div>
      </div>
    </EditorTemplate>
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Props</h2>
                <PropsTable data={propsData} />
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Usage</h2>
                <CodeBlock code={usageCode} language="tsx" />
            </div>
        </ComponentLayout>
    );
}
