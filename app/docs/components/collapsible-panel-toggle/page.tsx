"use client";

import * as React from "react";
import { CollapsiblePanelToggle, cn } from "@gunjo/ui";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import layoutMetadata from "@design/layout-metadata.json";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

const usageCodeByLocale = {
    en: `import { CollapsiblePanelToggle } from "@gunjo/ui";
import { useState } from "react";

export function SidebarHandle() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 0 : 176;

  return (
    <div
      className="relative grid h-56 overflow-visible rounded-lg border bg-background transition-[grid-template-columns]"
      style={{ gridTemplateColumns: \`\${sidebarWidth}px minmax(0, 1fr)\` }}
    >
      <aside
        className="relative min-w-0 overflow-visible border-r bg-muted/30"
      >
        <div
          className={
            collapsed
              ? "pointer-events-none w-44 -translate-x-2 space-y-2 p-4 text-sm opacity-0 transition-[opacity,transform]"
              : "w-44 translate-x-0 space-y-2 p-4 text-sm opacity-100 transition-[opacity,transform]"
          }
          aria-hidden={collapsed}
        >
          <p className="font-medium">Navigation</p>
          <div className="rounded bg-background px-2 py-1 text-muted-foreground">Pages</div>
          <div className="rounded bg-background px-2 py-1 text-muted-foreground">Settings</div>
        </div>
        <CollapsiblePanelToggle
          side="left"
          collapsed={collapsed}
          openLabel="Open left panel"
          closeLabel="Close left panel"
          onClick={() => setCollapsed((value) => !value)}
          className="absolute right-0 top-10 translate-x-1/2"
        />
      </aside>
      <main className="flex min-w-0 flex-1 items-center justify-center p-4">
        Main content
      </main>
    </div>
  );
}`,
    ja: `import { CollapsiblePanelToggle } from "@gunjo/ui";
import { useState } from "react";

export function SidebarHandle() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 0 : 176;

  return (
    <div
      className="relative grid h-56 overflow-visible rounded-lg border bg-background transition-[grid-template-columns]"
      style={{ gridTemplateColumns: \`\${sidebarWidth}px minmax(0, 1fr)\` }}
    >
      <aside
        className="relative min-w-0 overflow-visible border-r bg-muted/30"
      >
        <div
          className={
            collapsed
              ? "pointer-events-none w-44 -translate-x-2 space-y-2 p-4 text-sm opacity-0 transition-[opacity,transform]"
              : "w-44 translate-x-0 space-y-2 p-4 text-sm opacity-100 transition-[opacity,transform]"
          }
          aria-hidden={collapsed}
        >
          <p className="font-medium">ナビゲーション</p>
          <div className="rounded bg-background px-2 py-1 text-muted-foreground">ページ一覧</div>
          <div className="rounded bg-background px-2 py-1 text-muted-foreground">設定</div>
        </div>
        <CollapsiblePanelToggle
          side="left"
          collapsed={collapsed}
          openLabel="左パネルを開く"
          closeLabel="左パネルを閉じる"
          onClick={() => setCollapsed((value) => !value)}
          className="absolute right-0 top-10 translate-x-1/2"
        />
      </aside>
      <main className="flex min-w-0 flex-1 items-center justify-center p-4">
        メインコンテンツ
      </main>
    </div>
  );
}`,
} as const;

const stateCodeByLocale = {
    en: {
        left: usageCodeByLocale.en,
        right: `import { CollapsiblePanelToggle } from "@gunjo/ui";
import { useState } from "react";

export function InspectorHandle() {
  const [collapsed, setCollapsed] = useState(false);
  const panelWidth = collapsed ? 0 : 160;

  return (
    <div className="relative flex h-48 overflow-visible rounded-lg border bg-background">
      <main className="flex min-w-0 flex-1 items-center justify-center p-4">
        Canvas
      </main>
      <aside
        className="min-w-0 overflow-hidden border-l bg-muted/30 transition-[width]"
        style={{ width: panelWidth }}
      >
        <div
          className={
            collapsed
              ? "pointer-events-none w-40 translate-x-2 space-y-2 p-4 text-sm opacity-0 transition-[opacity,transform]"
              : "w-40 translate-x-0 space-y-2 p-4 text-sm opacity-100 transition-[opacity,transform]"
          }
          aria-hidden={collapsed}
        >
          <p className="font-medium">Inspector</p>
          <div className="rounded bg-background px-2 py-1 text-muted-foreground">Size</div>
          <div className="rounded bg-background px-2 py-1 text-muted-foreground">Spacing</div>
        </div>
      </aside>
      <CollapsiblePanelToggle
        side="right"
        collapsed={collapsed}
        openLabel="Open right panel"
        closeLabel="Close right panel"
        onClick={() => setCollapsed((value) => !value)}
        className="absolute top-1/2 -translate-y-1/2 translate-x-1/2"
        style={{ right: panelWidth }}
      />
    </div>
  );
}`,
        top: `import { CollapsiblePanelToggle } from "@gunjo/ui";
import { useState } from "react";

export function ToolbarHandle() {
  const [collapsed, setCollapsed] = useState(false);
  const panelHeight = collapsed ? 0 : 56;

  return (
    <div className="relative h-48 overflow-visible rounded-lg border bg-background">
      <div
        className="overflow-hidden border-b bg-muted/30 transition-[height,opacity]"
        style={{ height: panelHeight, opacity: collapsed ? 0 : 1 }}
        aria-hidden={collapsed}
      >
        <div className="flex h-14 items-center gap-2 px-4 text-sm">
          <span className="font-medium">Filters</span>
          <span className="rounded bg-background px-2 py-1 text-muted-foreground">Published</span>
          <span className="rounded bg-background px-2 py-1 text-muted-foreground">Assigned</span>
        </div>
      </div>
      <main className="flex items-center justify-center p-4" style={{ height: \`calc(100% - \${panelHeight}px)\` }}>
        Results
      </main>
      <CollapsiblePanelToggle
        side="top"
        collapsed={collapsed}
        openLabel="Open top panel"
        closeLabel="Close top panel"
        onClick={() => setCollapsed((value) => !value)}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ top: panelHeight }}
      />
    </div>
  );
}`,
    },
    ja: {
        left: usageCodeByLocale.ja,
        right: `import { CollapsiblePanelToggle } from "@gunjo/ui";
import { useState } from "react";

export function InspectorHandle() {
  const [collapsed, setCollapsed] = useState(false);
  const panelWidth = collapsed ? 0 : 160;

  return (
    <div className="relative flex h-48 overflow-visible rounded-lg border bg-background">
      <main className="flex min-w-0 flex-1 items-center justify-center p-4">
        キャンバス
      </main>
      <aside
        className="min-w-0 overflow-hidden border-l bg-muted/30 transition-[width]"
        style={{ width: panelWidth }}
      >
        <div
          className={
            collapsed
              ? "pointer-events-none w-40 translate-x-2 space-y-2 p-4 text-sm opacity-0 transition-[opacity,transform]"
              : "w-40 translate-x-0 space-y-2 p-4 text-sm opacity-100 transition-[opacity,transform]"
          }
          aria-hidden={collapsed}
        >
          <p className="font-medium">インスペクター</p>
          <div className="rounded bg-background px-2 py-1 text-muted-foreground">サイズ</div>
          <div className="rounded bg-background px-2 py-1 text-muted-foreground">余白</div>
        </div>
      </aside>
      <CollapsiblePanelToggle
        side="right"
        collapsed={collapsed}
        openLabel="右パネルを開く"
        closeLabel="右パネルを閉じる"
        onClick={() => setCollapsed((value) => !value)}
        className="absolute top-1/2 -translate-y-1/2 translate-x-1/2"
        style={{ right: panelWidth }}
      />
    </div>
  );
}`,
        top: `import { CollapsiblePanelToggle } from "@gunjo/ui";
import { useState } from "react";

export function ToolbarHandle() {
  const [collapsed, setCollapsed] = useState(false);
  const panelHeight = collapsed ? 0 : 56;

  return (
    <div className="relative h-48 overflow-visible rounded-lg border bg-background">
      <div
        className="overflow-hidden border-b bg-muted/30 transition-[height,opacity]"
        style={{ height: panelHeight, opacity: collapsed ? 0 : 1 }}
        aria-hidden={collapsed}
      >
        <div className="flex h-14 items-center gap-2 px-4 text-sm">
          <span className="font-medium">フィルター</span>
          <span className="rounded bg-background px-2 py-1 text-muted-foreground">公開中</span>
          <span className="rounded bg-background px-2 py-1 text-muted-foreground">担当あり</span>
        </div>
      </div>
      <main className="flex items-center justify-center p-4" style={{ height: \`calc(100% - \${panelHeight}px)\` }}>
        結果一覧
      </main>
      <CollapsiblePanelToggle
        side="top"
        collapsed={collapsed}
        openLabel="上パネルを開く"
        closeLabel="上パネルを閉じる"
        onClick={() => setCollapsed((value) => !value)}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ top: panelHeight }}
      />
    </div>
  );
}`,
    },
} as const;

const propsData = [
    {
        name: "side",
        type: '"left" | "right" | "top" | "bottom"',
        default: '"left"',
        description: "The panel edge this toggle controls. It also selects the icon and default tooltip side.",
    },
    {
        name: "collapsed",
        type: "boolean",
        description: "Whether the controlled panel is currently collapsed.",
    },
    {
        name: "openLabel",
        type: "string",
        default: '"Open panel"',
        description: "Accessible label and tooltip text when the panel is collapsed.",
    },
    {
        name: "closeLabel",
        type: "string",
        default: '"Close panel"',
        description: "Accessible label and tooltip text when the panel is expanded.",
    },
    {
        name: "tooltip",
        type: "React.ReactNode",
        description: "Optional tooltip override. If omitted, the active open/close label is used.",
    },
    {
        name: "iconClassName",
        type: "string",
        description: "Additional class names for the icon.",
    },
    {
        name: "Button props",
        type: "TooltipButton props",
        description: "Forwards standard button props such as onClick, disabled, and className.",
    },
];

const propsDataJa = [
    { name: "side", type: '"left" | "right" | "top" | "bottom"', default: '"left"', description: "トグルを置くパネルの境界です。アイコンとツールチップ方向も切り替わります。" },
    { name: "collapsed", type: "boolean", description: "対象パネルが折りたたまれているかどうかです。" },
    { name: "openLabel", type: "string", default: '"Open panel"', description: "折りたたみ時に表示する aria-label とツールチップです。" },
    { name: "closeLabel", type: "string", default: '"Close panel"', description: "展開時に表示する aria-label とツールチップです。" },
    { name: "tooltip", type: "React.ReactNode", description: "ツールチップ内容の上書きです。未指定時は openLabel / closeLabel を使います。" },
    { name: "iconClassName", type: "string", description: "アイコンに追加する className です。" },
    { name: "Button props", type: "TooltipButton props", description: "onClick、disabled、className などのボタン props を渡せます。" },
];

function LeftPanelPreview({ locale }: { locale: "en" | "ja" }) {
    const [collapsed, setCollapsed] = React.useState(false);
    const sidebarWidth = collapsed ? 0 : 176;

    return (
        <div className="w-full overflow-visible px-5 py-4">
            <div
                className="relative grid h-56 overflow-visible rounded-lg border bg-background shadow-sm transition-[grid-template-columns] duration-300 ease-out motion-reduce:transition-none"
                style={{ gridTemplateColumns: `${sidebarWidth}px minmax(0, 1fr)` }}
            >
                <aside
                    className="relative min-w-0 overflow-visible border-r bg-muted/30"
                >
                    <div
                        className={cn(
                            "w-44 space-y-2 p-4 text-sm transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                            collapsed
                                ? "pointer-events-none -translate-x-2 opacity-0"
                                : "translate-x-0 opacity-100"
                        )}
                        aria-hidden={collapsed}
                    >
                        <p className="font-medium">{locale === "ja" ? "ナビゲーション" : "Navigation"}</p>
                        <div className="rounded bg-background px-2 py-1 text-muted-foreground">{locale === "ja" ? "ページ一覧" : "Pages"}</div>
                        <div className="rounded bg-background px-2 py-1 text-muted-foreground">{locale === "ja" ? "設定" : "Settings"}</div>
                    </div>
                    <CollapsiblePanelToggle
                        side="left"
                        collapsed={collapsed}
                        openLabel={locale === "ja" ? "左パネルを開く" : "Open left panel"}
                        closeLabel={locale === "ja" ? "左パネルを閉じる" : "Close left panel"}
                        onClick={() => setCollapsed((value) => !value)}
                        className="absolute right-0 top-10 translate-x-1/2"
                    />
                </aside>
                <main className="flex min-w-0 flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
                    {locale === "ja" ? "メインコンテンツ" : "Main content"}
                </main>
            </div>
        </div>
    );
}

function RightPanelPreview({ locale }: { locale: "en" | "ja" }) {
    const [collapsed, setCollapsed] = React.useState(false);
    const panelWidth = collapsed ? 0 : 160;

    return (
        <div className="w-full overflow-visible px-5 py-4">
            <div className="relative flex h-48 overflow-visible rounded-lg border bg-background shadow-sm">
                <main className="flex min-w-0 flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
                    {locale === "ja" ? "キャンバス" : "Canvas"}
                </main>
                <aside
                    className={cn(
                        "min-w-0 overflow-hidden border-l bg-muted/30 transition-[width] duration-300 ease-out motion-reduce:transition-none"
                    )}
                    style={{ width: panelWidth }}
                >
                    <div
                        className={cn(
                            "w-40 space-y-2 p-4 text-sm transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                            collapsed
                                ? "pointer-events-none translate-x-2 opacity-0"
                                : "translate-x-0 opacity-100"
                        )}
                        aria-hidden={collapsed}
                    >
                        <p className="font-medium">{locale === "ja" ? "インスペクター" : "Inspector"}</p>
                        <div className="rounded bg-background px-2 py-1 text-muted-foreground">{locale === "ja" ? "サイズ" : "Size"}</div>
                        <div className="rounded bg-background px-2 py-1 text-muted-foreground">{locale === "ja" ? "余白" : "Spacing"}</div>
                    </div>
                </aside>
                <CollapsiblePanelToggle
                    side="right"
                    collapsed={collapsed}
                    openLabel={locale === "ja" ? "右パネルを開く" : "Open right panel"}
                    closeLabel={locale === "ja" ? "右パネルを閉じる" : "Close right panel"}
                    onClick={() => setCollapsed((value) => !value)}
                    className="absolute top-1/2 -translate-y-1/2 translate-x-1/2"
                    style={{ right: panelWidth }}
                />
            </div>
        </div>
    );
}

function TopPanelPreview({ locale }: { locale: "en" | "ja" }) {
    const [collapsed, setCollapsed] = React.useState(false);
    const panelHeight = collapsed ? 0 : 56;

    return (
        <div className="w-full overflow-visible px-5 py-6">
            <div className="relative h-48 overflow-visible rounded-lg border bg-background shadow-sm">
                <div
                    className={cn(
                        "overflow-hidden border-b bg-muted/30 transition-[height,opacity] duration-200 ease-out motion-reduce:transition-none",
                        collapsed ? "opacity-0" : "opacity-100"
                    )}
                    style={{ height: panelHeight }}
                    aria-hidden={collapsed}
                >
                    <div className="flex h-14 items-center gap-2 px-4 text-sm">
                        <span className="font-medium">{locale === "ja" ? "フィルター" : "Filters"}</span>
                        <span className="rounded bg-background px-2 py-1 text-muted-foreground">{locale === "ja" ? "公開中" : "Published"}</span>
                        <span className="rounded bg-background px-2 py-1 text-muted-foreground">{locale === "ja" ? "担当あり" : "Assigned"}</span>
                    </div>
                </div>
                <main
                    className="flex items-center justify-center p-4 text-sm text-muted-foreground"
                    style={{ height: `calc(100% - ${panelHeight}px)` }}
                >
                    {locale === "ja" ? "結果一覧" : "Results"}
                </main>
                <CollapsiblePanelToggle
                    side="top"
                    collapsed={collapsed}
                    openLabel={locale === "ja" ? "上パネルを開く" : "Open top panel"}
                    closeLabel={locale === "ja" ? "上パネルを閉じる" : "Close top panel"}
                    onClick={() => setCollapsed((value) => !value)}
                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ top: panelHeight }}
                />
            </div>
        </div>
    );
}

export default function CollapsiblePanelToggleDocPage() {
    const { locale } = useLocale();
    const meta = layoutMetadata as Record<string, { title: string; description: string }>;
    const usageCode = usageCodeByLocale[locale];

    return (
        <ComponentLayout
            title={meta.collapsiblePanelToggle.title}
            description={meta.collapsiblePanelToggle.description}
            usedComponents={[
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "Sidebar", href: "/docs/components/sidebar" },
                { name: "Resizable", href: "/docs/components/resizable" },
                { name: "Sheet", href: "/docs/components/sheet" },
            ]}
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: トグルボタン（Toggle）" : "UIXHERO: Toggle (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/toggle`,
                    relation: "nearest",
                },
            ]}
        >
            <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="lg" previewHeight="auto">
                <LeftPanelPreview locale={locale} />
            </ComponentPreview>

            <section className="space-y-6">
                <div className="space-y-1">
                    <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                        {locale === "ja" ? "状態とバリエーション" : "States and Variants"}
                    </h2>
                </div>
                <ComponentDemoStates
                    states={[
                        {
                            key: "left-edge",
                            title: locale === "ja" ? "左境界" : "Left edge",
                            description: locale === "ja" ? "左側のナビゲーションやサイドバーを開閉する標準的な境界トグルです。" : "Use this standard edge toggle to collapse a left navigation or sidebar.",
                            code: stateCodeByLocale[locale].left,
                            previewBodyWidth: "md",
                            preview: (
                                <LeftPanelPreview locale={locale} />
                            ),
                        },
                        {
                            key: "right-edge",
                            title: locale === "ja" ? "右境界" : "Right edge",
                            description: locale === "ja" ? "右側の補助パネルやインスペクターを開閉する境界トグルです。" : "Use this toggle on the right edge for aside panels or inspectors.",
                            code: stateCodeByLocale[locale].right,
                            previewBodyWidth: "md",
                            preview: (
                                <RightPanelPreview locale={locale} />
                            ),
                        },
                        {
                            key: "top-edge",
                            title: locale === "ja" ? "上境界" : "Top edge",
                            description: locale === "ja" ? "上部のフィルターや補助ツールバーを開閉する境界トグルです。" : "Use this toggle on the top edge for filter bars or auxiliary toolbars.",
                            code: stateCodeByLocale[locale].top,
                            previewBodyWidth: "md",
                            preview: (
                                <TopPanelPreview locale={locale} />
                            ),
                        },
                    ]}
                />
            </section>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {locale === "ja" ? "プロパティ" : "Props"}
                </h2>
                <PropsTable data={locale === "ja" ? propsDataJa : propsData} />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {locale === "ja" ? "使い方" : "Usage"}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </div>
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>ON と OFF ではなく、次にやることを書く。</strong>資料はトグルを「状態を持つボタン」と定義していますが、この部品は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-pressed</code> を持たず、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">collapsed</code> の値でラベルとアイコンを「開く／閉じる」に入れ替える押しボタンです。パネルの開閉は結果が画面に大きく出るので、ボタン自身に状態を持たせるより「次にどうなるか」を書くほうが読みやすいと判断しました。
                        </li>
                        <li>
                            <strong>どの辺のパネルかで、アイコンとツールチップの向きが決まる。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">side</code> に上下左右のどれかを渡すと、対応するアイコンに変わり、ツールチップはパネルの反対側に出ます。ツールチップが、自分が畳むパネルの上に重なると読めないためです。
                        </li>
                        <li>
                            <strong>押した瞬間にツールチップを畳む。一方、パネルとの結び付きはまだ書いていません。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tooltipCloseOnPress</code> を渡してあるので、押したあとに吹き出しが残りません。ただし <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-expanded</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-controls</code> で「どのパネルを開くのか」を伝えるところは<strong>まだ書いていません</strong>。読み上げでは、ラベルの「パネルを開く」までしか分かりません。
                            <br />
                            一般のトグルの設計は UIXHERO の「トグルボタン」にあります。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>It states the next action, not an on/off state.</strong> The article defines a toggle as a button that holds state. This one deliberately does not set <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-pressed</code>: <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">collapsed</code> swaps the label and icon between open and close. Collapsing a panel produces a large visible result, so naming what will happen next reads better than reporting a pressed state.
                        </li>
                        <li>
                            <strong>The panel&rsquo;s edge decides the icon and the tooltip side.</strong> Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">side</code> as left, right, top or bottom and the icon changes to match while the tooltip opens on the opposite side, because a tooltip that lands on the very panel being collapsed cannot be read.
                        </li>
                        <li>
                            <strong>The tooltip closes on press; the link to the panel is not written yet.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tooltipCloseOnPress</code> is set, so no bubble is left hanging after the press. But <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-expanded</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-controls</code> are <strong>not written yet</strong>, so a screen reader hears only the label and never learns which panel this button governs.
                            <br />
                            The general design of toggles is covered by UIXHERO&rsquo;s toggle article.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
