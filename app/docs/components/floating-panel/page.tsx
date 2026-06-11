"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { FloatingPanelAuditDemo } from "@/components/demos/OverlayComponentDemos";
import overlayMetadata from "@design/overlay-metadata.json";

const floatingPanelCodes = {
    canvas: {
        ja: `import { FloatingPanel } from "@gunjo/ui";
import { IconBox as Box, IconPointer as MousePointer2, IconStack2 as Layers } from "@tabler/icons-react";

export function CanvasFloatingPanels() {
  const tools = [
    { icon: MousePointer2, label: "選択" },
    { icon: Box, label: "四角形" },
    { icon: Layers, label: "レイヤー" },
  ];

  return (
    <div className="relative min-h-[420px] w-full overflow-hidden rounded-lg border bg-muted/30 p-4 sm:p-6">
      <div
        className="grid h-full min-h-[380px] place-items-center rounded-md border border-dashed bg-background/70 text-sm text-muted-foreground"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--muted-foreground) / 0.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        キャンバス領域
      </div>
      <FloatingPanel
        title="ツール"
        variant="glass"
        dragEnabled
        resizable
        minWidth={180}
        minHeight={180}
        className="absolute left-8 top-8 h-72 w-56 sm:left-10 sm:top-10"
      >
        <div className="space-y-1 p-3">
          {tools.map(({ icon: Icon, label }) => (
            <button key={label} type="button" className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </FloatingPanel>
      <FloatingPanel
        title="プロパティ"
        variant="solid"
        dragEnabled
        resizable
        minWidth={220}
        minHeight={180}
        className="absolute left-[calc(100%-18rem)] top-[calc(100%-13.25rem)] h-[11.25rem] w-64 sm:left-[calc(100%-18.5rem)] sm:top-[calc(100%-13.75rem)]"
      >
        <dl className="grid grid-cols-2 gap-2 p-3 text-xs">
          <div className="rounded-md bg-muted p-2"><dt className="text-muted-foreground">X</dt><dd className="font-semibold">240</dd></div>
          <div className="rounded-md bg-muted p-2"><dt className="text-muted-foreground">Y</dt><dd className="font-semibold">120</dd></div>
          <div className="rounded-md bg-muted p-2"><dt className="text-muted-foreground">W</dt><dd className="font-semibold">300</dd></div>
          <div className="rounded-md bg-muted p-2"><dt className="text-muted-foreground">H</dt><dd className="font-semibold">200</dd></div>
        </dl>
      </FloatingPanel>
    </div>
  );
}`,
        en: `import { FloatingPanel } from "@gunjo/ui";
import { IconBox as Box, IconPointer as MousePointer2, IconStack2 as Layers } from "@tabler/icons-react";

export function CanvasFloatingPanels() {
  const tools = [
    { icon: MousePointer2, label: "Select" },
    { icon: Box, label: "Rectangle" },
    { icon: Layers, label: "Layers" },
  ];

  return (
    <div className="relative min-h-[420px] w-full overflow-hidden rounded-lg border bg-muted/30 p-4 sm:p-6">
      <div
        className="grid h-full min-h-[380px] place-items-center rounded-md border border-dashed bg-background/70 text-sm text-muted-foreground"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--muted-foreground) / 0.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        Canvas area
      </div>
      <FloatingPanel
        title="Tools"
        variant="glass"
        dragEnabled
        resizable
        minWidth={180}
        minHeight={180}
        className="absolute left-8 top-8 h-72 w-56 sm:left-10 sm:top-10"
      >
        <div className="space-y-1 p-3">
          {tools.map(({ icon: Icon, label }) => (
            <button key={label} type="button" className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </FloatingPanel>
      <FloatingPanel
        title="Properties"
        variant="solid"
        dragEnabled
        resizable
        minWidth={220}
        minHeight={180}
        className="absolute left-[calc(100%-18rem)] top-[calc(100%-13.25rem)] h-[11.25rem] w-64 sm:left-[calc(100%-18.5rem)] sm:top-[calc(100%-13.75rem)]"
      >
        <dl className="grid grid-cols-2 gap-2 p-3 text-xs">
          <div className="rounded-md bg-muted p-2"><dt className="text-muted-foreground">X</dt><dd className="font-semibold">240</dd></div>
          <div className="rounded-md bg-muted p-2"><dt className="text-muted-foreground">Y</dt><dd className="font-semibold">120</dd></div>
          <div className="rounded-md bg-muted p-2"><dt className="text-muted-foreground">W</dt><dd className="font-semibold">300</dd></div>
          <div className="rounded-md bg-muted p-2"><dt className="text-muted-foreground">H</dt><dd className="font-semibold">200</dd></div>
        </dl>
      </FloatingPanel>
    </div>
  );
}`,
    },
    interactive: {
        ja: `import { FloatingPanel } from "@gunjo/ui";

export function DraggableResizableFloatingPanel() {
  return (
    <div className="relative min-h-[420px] w-full overflow-hidden rounded-lg border bg-muted/30 p-4 sm:p-6">
      <div
        className="grid h-full min-h-[380px] place-items-center rounded-md border border-dashed bg-background/70 text-sm text-muted-foreground"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--muted-foreground) / 0.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        作業面
      </div>
      <FloatingPanel
        title="作業メモ"
        variant="glass"
        dragEnabled
        resizable
        minWidth={240}
        minHeight={180}
        className="absolute left-8 top-8 h-56 w-80 sm:left-10 sm:top-10"
        contentClassName="p-4"
      >
        <div className="space-y-3 text-sm">
          <p className="font-medium">公開前チェック</p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" />メタ情報を確認</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-muted-foreground/50" />権限設定を確認</li>
          </ul>
        </div>
      </FloatingPanel>
    </div>
  );
}`,
        en: `import { FloatingPanel } from "@gunjo/ui";

export function DraggableResizableFloatingPanel() {
  return (
    <div className="relative min-h-[420px] w-full overflow-hidden rounded-lg border bg-muted/30 p-4 sm:p-6">
      <div
        className="grid h-full min-h-[380px] place-items-center rounded-md border border-dashed bg-background/70 text-sm text-muted-foreground"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--muted-foreground) / 0.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        Workspace
      </div>
      <FloatingPanel
        title="Working note"
        variant="glass"
        dragEnabled
        resizable
        minWidth={240}
        minHeight={180}
        className="absolute left-8 top-8 h-56 w-80 sm:left-10 sm:top-10"
        contentClassName="p-4"
      >
        <div className="space-y-3 text-sm">
          <p className="font-medium">Pre-publish checks</p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" />Review metadata</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-muted-foreground/50" />Check permissions</li>
          </ul>
        </div>
      </FloatingPanel>
    </div>
  );
}`,
    },
    toolbar: {
        ja: `import { FloatingPanel, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";
import { IconBox as Box, IconPointer as MousePointer2, IconSettings as Settings, IconStack2 as Layers } from "@tabler/icons-react";

export function FloatingToolbar() {
  const tools = [
    { icon: MousePointer2, label: "選択" },
    { icon: Box, label: "追加" },
    { icon: Layers, label: "重なり順" },
    { icon: Settings, label: "設定" },
  ];

  return (
    <div className="relative min-h-[260px] w-full overflow-hidden rounded-lg border bg-muted/30 p-4">
      <div
        className="grid h-full min-h-[220px] place-items-center rounded-md border border-dashed bg-background/70 text-sm text-muted-foreground"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--muted-foreground) / 0.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        編集対象
      </div>
      <FloatingPanel variant="glass" className="absolute left-8 top-8 w-auto" contentClassName="flex items-center gap-1 p-1">
        <TooltipProvider>
          {tools.map(({ icon: Icon, label }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <button type="button" aria-label={label} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Icon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </FloatingPanel>
    </div>
  );
}`,
        en: `import { FloatingPanel, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";
import { IconBox as Box, IconPointer as MousePointer2, IconSettings as Settings, IconStack2 as Layers } from "@tabler/icons-react";

export function FloatingToolbar() {
  const tools = [
    { icon: MousePointer2, label: "Select" },
    { icon: Box, label: "Insert" },
    { icon: Layers, label: "Layers" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="relative min-h-[260px] w-full overflow-hidden rounded-lg border bg-muted/30 p-4">
      <div
        className="grid h-full min-h-[220px] place-items-center rounded-md border border-dashed bg-background/70 text-sm text-muted-foreground"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--muted-foreground) / 0.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        Editable surface
      </div>
      <FloatingPanel variant="glass" className="absolute left-8 top-8 w-auto" contentClassName="flex items-center gap-1 p-1">
        <TooltipProvider>
          {tools.map(({ icon: Icon, label }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <button type="button" aria-label={label} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Icon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </FloatingPanel>
    </div>
  );
}`,
    },
    status: {
        ja: `import { FloatingPanel } from "@gunjo/ui";
import { IconBell as Bell } from "@tabler/icons-react";

export function StatusFloatingPanel() {
  return (
    <div className="relative min-h-[300px] w-full overflow-hidden rounded-lg border bg-muted/30 p-4">
      <div
        className="grid h-full min-h-[260px] place-items-center rounded-md border border-dashed bg-background/70 text-sm text-muted-foreground"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--muted-foreground) / 0.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        レビュー画面
      </div>
      <FloatingPanel title="通知" variant="solid" className="absolute bottom-8 left-8 w-80" contentClassName="p-3">
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Bell className="mt-0.5 h-4 w-4 text-primary" />
            <div className="min-w-0">
              <p className="font-medium">レビューが完了しました</p>
              <p className="text-muted-foreground">2件のコメントを反映できます。</p>
            </div>
          </div>
          <button type="button" className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
            変更を確認
          </button>
        </div>
      </FloatingPanel>
    </div>
  );
}`,
        en: `import { FloatingPanel } from "@gunjo/ui";
import { IconBell as Bell } from "@tabler/icons-react";

export function StatusFloatingPanel() {
  return (
    <div className="relative min-h-[300px] w-full overflow-hidden rounded-lg border bg-muted/30 p-4">
      <div
        className="grid h-full min-h-[260px] place-items-center rounded-md border border-dashed bg-background/70 text-sm text-muted-foreground"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--muted-foreground) / 0.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        Review surface
      </div>
      <FloatingPanel title="Notifications" variant="solid" className="absolute bottom-8 left-8 w-80" contentClassName="p-3">
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Bell className="mt-0.5 h-4 w-4 text-primary" />
            <div className="min-w-0">
              <p className="font-medium">Review complete</p>
              <p className="text-muted-foreground">Two comments are ready to apply.</p>
            </div>
          </div>
          <button type="button" className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
            Review changes
          </button>
        </div>
      </FloatingPanel>
    </div>
  );
}`,
    },
    solid: {
        ja: `import { FloatingPanel } from "@gunjo/ui";

export function SolidFloatingPanel() {
  return (
    <FloatingPanel title="情報" variant="solid" className="w-72">
      <div className="space-y-2 p-4 text-sm">
        <p className="font-medium">選択中の要素</p>
        <p className="text-muted-foreground">Rectangle 1</p>
      </div>
    </FloatingPanel>
  );
}`,
        en: `import { FloatingPanel } from "@gunjo/ui";

export function SolidFloatingPanel() {
  return (
    <FloatingPanel title="Info" variant="solid" className="w-72">
      <div className="space-y-2 p-4 text-sm">
        <p className="font-medium">Selected element</p>
        <p className="text-muted-foreground">Rectangle 1</p>
      </div>
    </FloatingPanel>
  );
}`,
    },
} as const;

export default function FloatingPanelPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const code = floatingPanelCodes.canvas[locale];

    return (
        <ComponentLayout
            title={overlayMetadata.floatingPanel.title}
            description={isJa
                ? "作業面やキャンバス上に、ツール、状態、補助情報を重ねて表示するパネルです。必要に応じてドラッグやリサイズも有効化できます。"
                : overlayMetadata.floatingPanel.description
            }
            usedComponents={[
                { name: "FloatingPanel", href: "/docs/components/floating-panel" },
            ]}
            relatedComponents={[
                { name: "Dialog", href: "/docs/components/dialog" },
                { name: "Popover", href: "/docs/components/popover" },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/floating-panel"
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewBodyWidth="full"
                previewHeight={520}
            >
                <FloatingPanelAuditDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {isJa ? "状態とバリエーション" : "States and Variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "canvas",
                            title: isJa ? "キャンバス上の複数パネル" : "Multiple panels on canvas",
                            description: isJa
                                ? "ツールパネルやプロパティパネルのように、作業面に重ねて配置します。"
                                : "Overlay tool and property panels on top of a working surface.",
                            preview: <FloatingPanelAuditDemo />,
                            code: floatingPanelCodes.canvas[locale],
                            embedSrc: "/embed/floating-panel?variant=canvas",
                            previewBodyWidth: "full",
                            previewHeight: 520,
                        },
                        {
                            key: "interactive",
                            title: isJa ? "ドラッグ・リサイズ可能" : "Draggable and resizable",
                            description: isJa
                                ? "タイトルバーをドラッグして移動し、右下のハンドルでサイズを調整できます。"
                                : "Drag the title bar to move the panel and resize it from the bottom-right handle.",
                            preview: <FloatingPanelAuditDemo variant="interactive" />,
                            code: floatingPanelCodes.interactive[locale],
                            embedSrc: "/embed/floating-panel?variant=interactive",
                            previewBodyWidth: "full",
                            previewHeight: 520,
                        },
                        {
                            key: "toolbar",
                            title: isJa ? "フローティングツールバー" : "Floating toolbar",
                            description: isJa
                                ? "編集対象の近くに、アイコン操作をまとめた小さなパネルを置きます。"
                                : "Group compact icon actions close to the editable target.",
                            preview: <FloatingPanelAuditDemo variant="toolbar" />,
                            code: floatingPanelCodes.toolbar[locale],
                            embedSrc: "/embed/floating-panel?variant=toolbar",
                            previewBodyWidth: "full",
                            previewHeight: 340,
                        },
                        {
                            key: "status",
                            title: isJa ? "通知と状態" : "Notification and status",
                            description: isJa
                                ? "作業の完了や確認が必要な状態を、画面上に一時的に重ねます。"
                                : "Temporarily layer completion or review status over the current surface.",
                            preview: <FloatingPanelAuditDemo variant="status" />,
                            code: floatingPanelCodes.status[locale],
                            embedSrc: "/embed/floating-panel?variant=status",
                            previewBodyWidth: "full",
                            previewHeight: 380,
                        },
                        {
                            key: "solid",
                            title: isJa ? "固定幅の情報パネル" : "Solid info panel",
                            description: isJa
                                ? "背景を透過しない情報パネルとして使う場合は solid を選びます。"
                                : "Use solid when the panel should not blend with the surface underneath.",
                            preview: <FloatingPanelAuditDemo variant="solid" />,
                            code: floatingPanelCodes.solid[locale],
                            embedSrc: "/embed/floating-panel?variant=solid",
                            previewHeight: 320,
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
                            name: "variant",
                            type: '"glass" | "solid" | "ghost"',
                            default: '"glass"',
                            description: isJa ? "パネルの見た目を切り替えます。" : "Visual style of the panel.",
                        },
                        {
                            name: "title",
                            type: "string",
                            description: isJa ? "ヘッダーに表示する任意のタイトルです。" : "Optional title shown in the panel header.",
                        },
                        {
                            name: "dragEnabled",
                            type: "boolean",
                            default: "false",
                            description: isJa ? "タイトルバーをドラッグハンドルとして移動を有効にします。" : "Enables moving the panel by dragging the title bar.",
                        },
                        {
                            name: "resizable",
                            type: "boolean",
                            default: "false",
                            description: isJa ? "右下からサイズ変更できるようにします。" : "Allows resizing from the bottom-right corner.",
                        },
                        {
                            name: "minWidth / minHeight",
                            type: "number",
                            default: "220 / 140",
                            description: isJa ? "リサイズ時の最小サイズを指定します。" : "Minimum size used while resizing.",
                        },
                        {
                            name: "contentClassName",
                            type: "string",
                            description: isJa ? "スクロール領域など、本文エリアに追加する className です。" : "Class name applied to the content area.",
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
