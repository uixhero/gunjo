"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@gunjo/ui";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import layoutMetadata from "@design/layout-metadata.json";

const codeByLocale = {
    en: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@gunjo/ui";

export function ResizableWorkspace() {
  return (
    <div className="h-64 w-full max-w-2xl overflow-hidden rounded-lg border">
      <ResizablePanelGroup direction="horizontal" defaultLayout={{ sidebar: 32, canvas: 68 }} className="h-full w-full">
        <ResizablePanel id="sidebar" defaultSize="32%" minSize="20%">
          <div className="flex h-full items-center justify-center p-4">Sidebar</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="canvas" defaultSize="68%" minSize="40%">
          <div className="flex h-full items-center justify-center p-4">Canvas</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}`,
    ja: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@gunjo/ui";

export function ResizableWorkspace() {
  return (
    <div className="h-64 w-full max-w-2xl overflow-hidden rounded-lg border">
      <ResizablePanelGroup direction="horizontal" defaultLayout={{ sidebar: 32, canvas: 68 }} className="h-full w-full">
        <ResizablePanel id="sidebar" defaultSize="32%" minSize="20%">
          <div className="flex h-full items-center justify-center p-4">サイドバー</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="canvas" defaultSize="68%" minSize="40%">
          <div className="flex h-full items-center justify-center p-4">キャンバス</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}`,
} as const;

const stateCodeByLocale = {
    en: {
        horizontal: codeByLocale.en,
        vertical: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@gunjo/ui";

export function VerticalResizableWorkspace() {
  return (
    <div className="h-72 w-full max-w-2xl overflow-hidden rounded-lg border">
      <ResizablePanelGroup direction="vertical" defaultLayout={{ preview: 45, console: 55 }} className="h-full w-full">
        <ResizablePanel id="preview" defaultSize="45%" minSize="25%">
          <div className="flex h-full items-center justify-center p-4">Preview</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="console" defaultSize="55%" minSize="25%">
          <div className="flex h-full items-center justify-center p-4">Console</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}`,
        nested: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@gunjo/ui";

export function NestedResizableWorkspace() {
  return (
    <div className="h-72 w-full max-w-2xl overflow-hidden rounded-lg border">
      <ResizablePanelGroup direction="horizontal" defaultLayout={{ files: 28, workspace: 72 }} className="h-full w-full">
        <ResizablePanel id="files" defaultSize="28%" minSize="18%">
          <div className="flex h-full items-center justify-center p-4">Files</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel id="workspace" defaultSize="72%">
          <ResizablePanelGroup direction="vertical" defaultLayout={{ editor: 65, terminal: 35 }} className="h-full w-full">
            <ResizablePanel id="editor" defaultSize="65%">
              <div className="flex h-full items-center justify-center p-4">Editor</div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel id="terminal" defaultSize="35%">
              <div className="flex h-full items-center justify-center p-4">Terminal</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}`,
        collapsible: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@gunjo/ui";

export function CollapsibleResizableWorkspace() {
  return (
    <div className="h-64 w-full max-w-2xl overflow-hidden rounded-lg border">
      <ResizablePanelGroup direction="horizontal" defaultLayout={{ support: 25, main: 75 }} className="h-full w-full">
        <ResizablePanel id="support" defaultSize="25%" minSize="15%" collapsible>
          <div className="flex h-full items-center justify-center p-4">Collapsible</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="main" defaultSize="75%">
          <div className="flex h-full items-center justify-center p-4">Main</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}`,
        threeColumn: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@gunjo/ui";

export function ThreeColumnResizableWorkspace() {
  return (
    <div className="h-72 w-full max-w-3xl overflow-hidden rounded-lg border">
      <ResizablePanelGroup direction="horizontal" defaultLayout={{ navigation: 24, content: 48, inspector: 28 }} className="h-full w-full">
        <ResizablePanel id="navigation" defaultSize="24%" minSize="16%">
          <div className="flex h-full items-center justify-center p-4">Navigation</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="content" defaultSize="48%" minSize="32%">
          <div className="flex h-full items-center justify-center p-4">Content</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="inspector" defaultSize="28%" minSize="18%">
          <div className="flex h-full items-center justify-center p-4">Inspector</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}`,
    },
    ja: {
        horizontal: codeByLocale.ja,
        vertical: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@gunjo/ui";

export function VerticalResizableWorkspace() {
  return (
    <div className="h-72 w-full max-w-2xl overflow-hidden rounded-lg border">
      <ResizablePanelGroup direction="vertical" defaultLayout={{ preview: 45, console: 55 }} className="h-full w-full">
        <ResizablePanel id="preview" defaultSize="45%" minSize="25%">
          <div className="flex h-full items-center justify-center p-4">プレビュー</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="console" defaultSize="55%" minSize="25%">
          <div className="flex h-full items-center justify-center p-4">コンソール</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}`,
        nested: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@gunjo/ui";

export function NestedResizableWorkspace() {
  return (
    <div className="h-72 w-full max-w-2xl overflow-hidden rounded-lg border">
      <ResizablePanelGroup direction="horizontal" defaultLayout={{ files: 28, workspace: 72 }} className="h-full w-full">
        <ResizablePanel id="files" defaultSize="28%" minSize="18%">
          <div className="flex h-full items-center justify-center p-4">ファイル</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel id="workspace" defaultSize="72%">
          <ResizablePanelGroup direction="vertical" defaultLayout={{ editor: 65, terminal: 35 }} className="h-full w-full">
            <ResizablePanel id="editor" defaultSize="65%">
              <div className="flex h-full items-center justify-center p-4">エディタ</div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel id="terminal" defaultSize="35%">
              <div className="flex h-full items-center justify-center p-4">ターミナル</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}`,
        collapsible: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@gunjo/ui";

export function CollapsibleResizableWorkspace() {
  return (
    <div className="h-64 w-full max-w-2xl overflow-hidden rounded-lg border">
      <ResizablePanelGroup direction="horizontal" defaultLayout={{ support: 25, main: 75 }} className="h-full w-full">
        <ResizablePanel id="support" defaultSize="25%" minSize="15%" collapsible>
          <div className="flex h-full items-center justify-center p-4">折りたたみ可能</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="main" defaultSize="75%">
          <div className="flex h-full items-center justify-center p-4">メイン</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}`,
        threeColumn: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@gunjo/ui";

export function ThreeColumnResizableWorkspace() {
  return (
    <div className="h-72 w-full max-w-3xl overflow-hidden rounded-lg border">
      <ResizablePanelGroup direction="horizontal" defaultLayout={{ navigation: 24, content: 48, inspector: 28 }} className="h-full w-full">
        <ResizablePanel id="navigation" defaultSize="24%" minSize="16%">
          <div className="flex h-full items-center justify-center p-4">ナビゲーション</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="content" defaultSize="48%" minSize="32%">
          <div className="flex h-full items-center justify-center p-4">コンテンツ</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="inspector" defaultSize="28%" minSize="18%">
          <div className="flex h-full items-center justify-center p-4">インスペクター</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}`,
    },
} as const;

function PanelContent({ children }: { children: string }) {
    return <div className="flex h-full items-center justify-center p-4 text-sm font-medium text-muted-foreground">{children}</div>;
}

export default function ResizablePage() {
    const { locale } = useLocale();
    const meta = layoutMetadata as Record<string, { title: string; description: string }>;
    const propsData = locale === "ja"
        ? [
            { name: "direction", type: '"vertical" | "horizontal"', description: "分割方向です。ResizablePanelGroup に指定します。" },
            { name: "defaultLayout", type: "Record<string, number>", description: "パネル ID ごとの初期比率です。ハンドルをダブルクリックした時のリセット先にも使います。" },
            { name: "groupRef", type: "Ref<GroupImperativeHandle>", description: "現在の比率取得や setLayout によるレイアウト変更に使います。" },
            { name: "onLayoutChange / onLayoutChanged", type: "(layout: Record<string, number>) => void", description: "パネルサイズが変わる時、または変更完了時に呼び出されます。" },
            { name: "defaultSize", type: "number | string", description: "ResizablePanel の初期サイズです。割合で使う場合は \"32%\" のように単位を明示します。" },
            { name: "minSize / maxSize", type: "number | string", description: "ResizablePanel の最小/最大サイズです。割合指定では \"20%\" のように書きます。" },
            { name: "collapsible", type: "boolean", description: "パネルを折りたためるようにします。" },
            { name: "withHandle", type: "boolean", description: "ResizableHandle に視覚的なグリップを表示します。" },
        ]
        : [
            { name: "direction", type: '"vertical" | "horizontal"', description: "Split direction for ResizablePanelGroup." },
            { name: "defaultLayout", type: "Record<string, number>", description: "Initial percentage by panel ID. Also used as the reset target when the handle is double-clicked." },
            { name: "groupRef", type: "Ref<GroupImperativeHandle>", description: "Reads the current layout or updates it with setLayout." },
            { name: "onLayoutChange / onLayoutChanged", type: "(layout: Record<string, number>) => void", description: "Called while the layout changes or after resizing finishes." },
            { name: "defaultSize", type: "number | string", description: "Initial ResizablePanel size. Use explicit units such as \"32%\" for percentage layouts." },
            { name: "minSize / maxSize", type: "number | string", description: "Minimum and maximum ResizablePanel size. Use strings such as \"20%\" for percentages." },
            { name: "collapsible", type: "boolean", description: "Allows a panel to collapse." },
            { name: "withHandle", type: "boolean", description: "Shows a visible grip in ResizableHandle." },
        ];

    return (
            <ComponentLayout
                title={locale === "ja" ? "リサイズ可能" : meta.resizable.title}
            description={locale === "ja" ? "キーボード操作にも対応した、リサイズ可能な分割パネルレイアウトです。ハンドルをダブルクリックすると defaultLayout に戻ります。" : meta.resizable.description}
            usedComponents={[
                { name: "ResizablePanelGroup", href: "/docs/components/resizable" },
                { name: "ResizablePanel", href: "/docs/components/resizable" },
                { name: "ResizableHandle", href: "/docs/components/resizable" },
            ]}
            relatedComponents={[
                { name: "InspectorPanel", href: "/docs/components/inspector-panel" },
                { name: "Sidebar", href: "/docs/components/sidebar" },
                { name: "SpatialCanvas", href: "/docs/components/spatial-canvas" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/resizable" code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewBodyWidth="lg" previewHeight={360}>
                <div className="h-64 w-full max-w-2xl overflow-hidden rounded-lg border">
                    <ResizablePanelGroup direction="horizontal" defaultLayout={{ sidebar: 32, canvas: 68 }} className="h-full w-full">
                        <ResizablePanel id="sidebar" defaultSize="32%" minSize="20%"><PanelContent>{locale === "ja" ? "サイドバー" : "Sidebar"}</PanelContent></ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel id="canvas" defaultSize="68%" minSize="40%"><PanelContent>{locale === "ja" ? "キャンバス" : "Canvas"}</PanelContent></ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </ComponentPreview>

            <section className="space-y-6">
                <div className="space-y-1">
                    <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">{locale === "ja" ? "状態とバリエーション" : "States and Variants"}</h2>
                </div>
                <div className="space-y-8">
                    {[
                        {
                            key: "horizontal",
                            title: locale === "ja" ? "水平分割" : "Horizontal split",
                            description: locale === "ja" ? "サイドバーとメイン領域のような左右分割に使います。" : "Use for side-by-side layouts such as sidebar and main canvas.",
                            code: stateCodeByLocale[locale].horizontal,
                            preview: (
                                <div className="h-64 w-full max-w-2xl overflow-hidden rounded-lg border">
                                    <ResizablePanelGroup direction="horizontal" defaultLayout={{ sidebar: 32, canvas: 68 }} className="h-full w-full">
                                        <ResizablePanel id="sidebar" defaultSize="32%" minSize="20%"><PanelContent>{locale === "ja" ? "サイドバー" : "Sidebar"}</PanelContent></ResizablePanel>
                                        <ResizableHandle withHandle />
                                        <ResizablePanel id="canvas" defaultSize="68%" minSize="40%"><PanelContent>{locale === "ja" ? "キャンバス" : "Canvas"}</PanelContent></ResizablePanel>
                                    </ResizablePanelGroup>
                                </div>
                            ),
                        },
                        {
                            key: "vertical",
                            title: locale === "ja" ? "垂直分割" : "Vertical split",
                            description: locale === "ja" ? "プレビューとログ、エディタとコンソールなど上下分割に使います。" : "Use for preview/log or editor/console vertical layouts.",
                            code: stateCodeByLocale[locale].vertical,
                            preview: (
                                <div className="h-72 w-full max-w-2xl overflow-hidden rounded-lg border">
                                    <ResizablePanelGroup direction="vertical" defaultLayout={{ preview: 45, console: 55 }} className="h-full w-full">
                                        <ResizablePanel id="preview" defaultSize="45%" minSize="25%"><PanelContent>{locale === "ja" ? "プレビュー" : "Preview"}</PanelContent></ResizablePanel>
                                        <ResizableHandle withHandle />
                                        <ResizablePanel id="console" defaultSize="55%" minSize="25%"><PanelContent>{locale === "ja" ? "コンソール" : "Console"}</PanelContent></ResizablePanel>
                                    </ResizablePanelGroup>
                                </div>
                            ),
                        },
                        {
                            key: "nested",
                            title: locale === "ja" ? "入れ子" : "Nested panels",
                            description: locale === "ja" ? "ファイル、エディタ、ターミナルのような複合ワークスペースを作ります。" : "Compose complex workspaces such as files, editor, and terminal.",
                            code: stateCodeByLocale[locale].nested,
                            preview: (
                                <div className="h-72 w-full max-w-2xl overflow-hidden rounded-lg border">
                                    <ResizablePanelGroup direction="horizontal" defaultLayout={{ files: 28, workspace: 72 }} className="h-full w-full">
                                        <ResizablePanel id="files" defaultSize="28%" minSize="18%"><PanelContent>{locale === "ja" ? "ファイル" : "Files"}</PanelContent></ResizablePanel>
                                        <ResizableHandle />
                                        <ResizablePanel id="workspace" defaultSize="72%">
                                            <ResizablePanelGroup direction="vertical" defaultLayout={{ editor: 65, terminal: 35 }} className="h-full w-full">
                                                <ResizablePanel id="editor" defaultSize="65%"><PanelContent>{locale === "ja" ? "エディタ" : "Editor"}</PanelContent></ResizablePanel>
                                                <ResizableHandle />
                                                <ResizablePanel id="terminal" defaultSize="35%"><PanelContent>{locale === "ja" ? "ターミナル" : "Terminal"}</PanelContent></ResizablePanel>
                                            </ResizablePanelGroup>
                                        </ResizablePanel>
                                    </ResizablePanelGroup>
                                </div>
                            ),
                        },
                        {
                            key: "threeColumn",
                            title: locale === "ja" ? "3 カラム" : "Three columns",
                            description: locale === "ja" ? "ナビゲーション、本文、インスペクターのような横 3 分割を構成します。" : "Use for three-pane layouts such as navigation, content, and inspector.",
                            code: stateCodeByLocale[locale].threeColumn,
                            preview: (
                                <div className="h-72 w-full max-w-3xl overflow-hidden rounded-lg border">
                                    <ResizablePanelGroup direction="horizontal" defaultLayout={{ navigation: 24, content: 48, inspector: 28 }} className="h-full w-full">
                                        <ResizablePanel id="navigation" defaultSize="24%" minSize="16%"><PanelContent>{locale === "ja" ? "ナビゲーション" : "Navigation"}</PanelContent></ResizablePanel>
                                        <ResizableHandle withHandle />
                                        <ResizablePanel id="content" defaultSize="48%" minSize="32%"><PanelContent>{locale === "ja" ? "コンテンツ" : "Content"}</PanelContent></ResizablePanel>
                                        <ResizableHandle withHandle />
                                        <ResizablePanel id="inspector" defaultSize="28%" minSize="18%"><PanelContent>{locale === "ja" ? "インスペクター" : "Inspector"}</PanelContent></ResizablePanel>
                                    </ResizablePanelGroup>
                                </div>
                            ),
                        },
                        {
                            key: "collapsible",
                            title: locale === "ja" ? "折りたたみ可能" : "Collapsible panel",
                            description: locale === "ja" ? "補助パネルを最小化できるレイアウトにします。" : "Allow a supporting panel to collapse down when not needed.",
                            code: stateCodeByLocale[locale].collapsible,
                            preview: (
                                <div className="h-64 w-full max-w-2xl overflow-hidden rounded-lg border">
                                    <ResizablePanelGroup direction="horizontal" defaultLayout={{ support: 25, main: 75 }} className="h-full w-full">
                                        <ResizablePanel id="support" defaultSize="25%" minSize="15%" collapsible><PanelContent>{locale === "ja" ? "折りたたみ可能" : "Collapsible"}</PanelContent></ResizablePanel>
                                        <ResizableHandle withHandle />
                                        <ResizablePanel id="main" defaultSize="75%"><PanelContent>{locale === "ja" ? "メイン" : "Main"}</PanelContent></ResizablePanel>
                                    </ResizablePanelGroup>
                                </div>
                            ),
                        },
                    ].map((item) => (
                        <section key={item.key} className="space-y-3">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <ComponentPreview code={item.code} codeBlock={<CodeBlock code={item.code} />} previewBodyWidth="lg" previewHeight={380}>
                                {item.preview}
                            </ComponentPreview>
                        </section>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">{locale === "ja" ? "プロパティ" : "Props"}</h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight">{locale === "ja" ? "使い方" : "Usage"}</h2>
                    <CodeCopyButton code={codeByLocale[locale]} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={codeByLocale[locale]} />
                </div>
            </section>
        </ComponentLayout>
    );
}
