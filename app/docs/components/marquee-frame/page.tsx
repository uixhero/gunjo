"use client";

import * as React from "react";
import { Button, MarqueeFrame } from "@gunjo/ui";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import layoutMetadata from "@design/layout-metadata.json";

const codeByLocale = {
    en: `import * as React from "react";
import { Button, MarqueeFrame } from "@gunjo/ui";

const pathOptions = [
  { path: "/media", label: "Library" },
  { path: "/media/assets", label: "Assets" },
  { path: "/media/settings", label: "Settings" },
];

const pageCopy = {
  "/media": {
    title: "Media Library",
    description: "The URL bar is controlled by MarqueeFrame.",
  },
  "/media/assets": {
    title: "All Assets",
    description: "This state represents a page transition inside the fake browser.",
  },
  "/media/settings": {
    title: "Library Settings",
    description: "Submitting a valid URL can update the rendered pattern.",
  },
};

export function Example() {
  const [path, setPath] = React.useState("/media");
  const copy = pageCopy[path];

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {pathOptions.map((item) => (
          <Button
            key={item.path}
            type="button"
            size="sm"
            variant={path === item.path ? "default" : "outline"}
            onClick={() => setPath(item.path)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <MarqueeFrame
        host="gunjo.example"
        path={path}
        defaultPath="/media"
        navigablePaths={pathOptions.map((item) => item.path)}
        onPathChange={setPath}
      >
        {(viewport) => (
          <div className="flex h-full items-center justify-center bg-muted/30 p-6">
            <div className="w-full max-w-sm rounded-lg border bg-background p-5 shadow-sm">
              <p className="text-xs font-medium uppercase text-muted-foreground">{path}</p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{copy.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{copy.description}</p>
              <p className="mt-4 text-xs text-muted-foreground">Active viewport: {viewport}</p>
            </div>
          </div>
        )}
      </MarqueeFrame>
    </div>
  );
}`,
    ja: `import * as React from "react";
import { Button, MarqueeFrame } from "@gunjo/ui";

const pathOptions = [
  { path: "/media", label: "ライブラリ" },
  { path: "/media/assets", label: "素材" },
  { path: "/media/settings", label: "設定" },
];

const pageCopy = {
  "/media": {
    title: "メディアライブラリ",
    description: "URL バーの変更が MarqueeFrame から通知されます。",
  },
  "/media/assets": {
    title: "すべての素材",
    description: "擬似ブラウザ内のページ遷移として表示が切り替わります。",
  },
  "/media/settings": {
    title: "ライブラリ設定",
    description: "有効な URL を送信すると描画中のパターンを更新できます。",
  },
};

export function Example() {
  const [path, setPath] = React.useState("/media");
  const copy = pageCopy[path];

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {pathOptions.map((item) => (
          <Button
            key={item.path}
            type="button"
            size="sm"
            variant={path === item.path ? "default" : "outline"}
            onClick={() => setPath(item.path)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <MarqueeFrame
        host="gunjo.example"
        path={path}
        defaultPath="/media"
        navigablePaths={pathOptions.map((item) => item.path)}
        onPathChange={setPath}
      >
        {(viewport) => (
          <div className="flex h-full items-center justify-center bg-muted/30 p-6">
            <div className="w-full max-w-sm rounded-lg border bg-background p-5 shadow-sm">
              <p className="text-xs font-medium uppercase text-muted-foreground">{path}</p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{copy.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{copy.description}</p>
              <p className="mt-4 text-xs text-muted-foreground">現在の表示サイズ: {viewport}</p>
            </div>
          </div>
        )}
      </MarqueeFrame>
    </div>
  );
}`,
} as const;

const stateCodeByLocale = {
    en: {
        default: codeByLocale.en,
        mobile: `import { MarqueeFrame } from "@gunjo/ui";

export function MobileFirstFrame() {
  return (
    <MarqueeFrame path="/preview" initialViewport="mobile" maxCanvasHeight={620}>
      {(viewport) => (
        <div className="flex h-full items-center justify-center bg-background p-6">
          Mobile-first preview / {viewport}
        </div>
      )}
    </MarqueeFrame>
  );
}`,
        customSizes: `import { MarqueeFrame } from "@gunjo/ui";

const viewportSizes = {
  desktop: { width: 960, height: 540 },
  tablet: { width: 720, height: 720 },
  mobile: { width: 360, height: 640 },
};

export function CustomViewportFrame() {
  return (
    <MarqueeFrame path="/custom" viewportSizes={viewportSizes} maxCanvasHeight={540}>
      {(viewport) => (
        <div className="flex h-full items-center justify-center bg-background p-6">
          Custom viewport / {viewport}
        </div>
      )}
    </MarqueeFrame>
  );
}`,
    },
    ja: {
        default: codeByLocale.ja,
        mobile: `import { MarqueeFrame } from "@gunjo/ui";

export function MobileFirstFrame() {
  return (
    <MarqueeFrame path="/preview" initialViewport="mobile" maxCanvasHeight={620}>
      {(viewport) => (
        <div className="flex h-full items-center justify-center bg-background p-6">
          モバイル優先プレビュー / {viewport}
        </div>
      )}
    </MarqueeFrame>
  );
}`,
        customSizes: `import { MarqueeFrame } from "@gunjo/ui";

const viewportSizes = {
  desktop: { width: 960, height: 540 },
  tablet: { width: 720, height: 720 },
  mobile: { width: 360, height: 640 },
};

export function CustomViewportFrame() {
  return (
    <MarqueeFrame path="/custom" viewportSizes={viewportSizes} maxCanvasHeight={540}>
      {(viewport) => (
        <div className="flex h-full items-center justify-center bg-background p-6">
          カスタム表示サイズ / {viewport}
        </div>
      )}
    </MarqueeFrame>
  );
}`,
    },
} as const;

const pathOptions = [
    { path: "/media", label: { en: "Library", ja: "ライブラリ" } },
    { path: "/media/assets", label: { en: "Assets", ja: "素材" } },
    { path: "/media/settings", label: { en: "Settings", ja: "設定" } },
] as const;

const pageCopy = {
    "/media": {
        en: { title: "Media Library", description: "The URL bar is controlled by MarqueeFrame." },
        ja: { title: "メディアライブラリ", description: "URL バーの変更が MarqueeFrame から通知されます。" },
    },
    "/media/assets": {
        en: { title: "All Assets", description: "This state represents a page transition inside the fake browser." },
        ja: { title: "すべての素材", description: "擬似ブラウザ内のページ遷移として表示が切り替わります。" },
    },
    "/media/settings": {
        en: { title: "Library Settings", description: "Submitting a valid URL can update the rendered pattern." },
        ja: { title: "ライブラリ設定", description: "有効な URL を送信すると描画中のパターンを更新できます。" },
    },
} as const;

const propsDataByLocale = {
    en: [
        { name: "path", type: "string", description: "Current path rendered in the frame URL.", required: true },
        { name: "children", type: "(viewport) => ReactNode", description: "Pattern content rendered with the active viewport.", required: true },
        { name: "host", type: "string", default: "gunjo.example", description: "Fake host shown in the URL bar." },
        { name: "storageKey", type: "string", description: "Optional sessionStorage key for persisting the selected viewport." },
        { name: "viewportSizes", type: "Record<viewport, size>", description: "Overrides desktop, tablet, and mobile viewport presets." },
        { name: "onPathChange", type: "(path) => void", description: "Called when a valid URL path is submitted." },
    ],
    ja: [
        { name: "path", type: "string", description: "フレームの URL に表示する現在のパスです。", required: true },
        { name: "children", type: "(viewport) => ReactNode", description: "現在の表示サイズを受け取って描画するパターン内容です。", required: true },
        { name: "host", type: "string", default: "gunjo.example", description: "URL バーに表示する擬似ホストです。" },
        { name: "storageKey", type: "string", description: "選択中の表示サイズを sessionStorage に保存するキーです。" },
        { name: "viewportSizes", type: "Record<viewport, size>", description: "デスクトップ / タブレット / モバイルの表示サイズプリセットを差し替えます。" },
        { name: "onPathChange", type: "(path) => void", description: "有効な URL パスが送信された時に呼び出されます。" },
    ],
} as const;

export default function MarqueeFrameDocPage() {
    const { locale } = useLocale();
    const [docsPath, setDocsPath] = React.useState<(typeof pathOptions)[number]["path"]>("/media");
    const [navigationPath, setNavigationPath] = React.useState<(typeof pathOptions)[number]["path"]>("/media");
    const meta = layoutMetadata as Record<string, { title: string; description: string }>;
    const docsCopy = pageCopy[docsPath][locale];
    const navigationCopy = pageCopy[navigationPath][locale];

    return (
        <ComponentLayout
            title={locale === "ja" ? "マーキーフレーム" : meta.marqueeFrame.title}
            description={locale === "ja" ? "パターンや画面を、擬似ブラウザと表示サイズ切り替えの中で確認するフレームです。" : meta.marqueeFrame.description}
            usedComponents={[
                { name: "MarqueeFrame", href: "/docs/components/marquee-frame" },
                { name: "DeviceFrame", href: "/docs/components/device-frame" },
            ]}
            relatedComponents={[
                { name: "DeviceFrame", href: "/docs/components/device-frame" },
                { name: "SpatialCanvas", href: "/docs/components/spatial-canvas" },
                { name: "MediaLibraryTemplate", href: "/patterns/media-library" },
            ]}
        >
            <ComponentPreview code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewBodyWidth="full" previewHeight={900} className="transition-none">
                <div className="w-full space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {pathOptions.map((item) => (
                            <Button
                                key={item.path}
                                type="button"
                                size="sm"
                                variant={docsPath === item.path ? "default" : "outline"}
                                onClick={() => setDocsPath(item.path)}
                            >
                                {item.label[locale]}
                            </Button>
                        ))}
                    </div>
                    <MarqueeFrame
                        host="gunjo.example"
                        path={docsPath}
                        defaultPath="/media"
                        navigablePaths={pathOptions.map((item) => item.path)}
                        onPathChange={(nextPath) => {
                            if (pathOptions.some((item) => item.path === nextPath)) {
                                setDocsPath(nextPath as (typeof pathOptions)[number]["path"]);
                            }
                        }}
                    >
                        {(viewport) => (
                            <div className="flex h-full items-center justify-center bg-muted/30 p-6">
                                <div className="w-full max-w-sm rounded-lg border bg-background p-5 shadow-sm">
                                    <p className="text-xs font-medium uppercase text-muted-foreground">{docsPath}</p>
                                    <h3 className="mt-2 text-xl font-semibold text-foreground">{docsCopy.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{docsCopy.description}</p>
                                    <p className="mt-4 text-xs text-muted-foreground">
                                        {locale === "ja" ? `現在の表示サイズ: ${viewport}` : `Active viewport: ${viewport}`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </MarqueeFrame>
                </div>
            </ComponentPreview>

            <section className="space-y-6">
                <div className="space-y-1">
                    <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                        {locale === "ja" ? "状態とバリエーション" : "States and Variants"}
                    </h2>
                </div>
                <div className="space-y-8">
                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "URL 連動" : "URL navigation"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "URL バーと外部ボタンのどちらからでも、擬似ブラウザ内の表示を切り替えます。" : "Change the fake browser content from the URL bar or external buttons."}
                            </p>
                        </div>
                        <ComponentPreview code={stateCodeByLocale[locale].default} codeBlock={<CodeBlock code={stateCodeByLocale[locale].default} />} previewBodyWidth="full" previewHeight={900} className="transition-none">
                            <div className="w-full space-y-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    {pathOptions.map((item) => (
                                        <Button
                                            key={item.path}
                                            type="button"
                                            size="sm"
                                            variant={navigationPath === item.path ? "default" : "outline"}
                                            onClick={() => setNavigationPath(item.path)}
                                        >
                                            {item.label[locale]}
                                        </Button>
                                    ))}
                                </div>
                                <MarqueeFrame
                                    host="gunjo.example"
                                    path={navigationPath}
                                    defaultPath="/media"
                                    navigablePaths={pathOptions.map((item) => item.path)}
                                    onPathChange={(nextPath) => {
                                        if (pathOptions.some((item) => item.path === nextPath)) {
                                            setNavigationPath(nextPath as (typeof pathOptions)[number]["path"]);
                                        }
                                    }}
                                >
                                    {(viewport) => (
                                        <div className="flex h-full items-center justify-center bg-muted/30 p-6">
                                            <div className="w-full max-w-sm rounded-lg border bg-background p-5 shadow-sm">
                                                <p className="text-xs font-medium uppercase text-muted-foreground">{navigationPath}</p>
                                                <h3 className="mt-2 text-xl font-semibold text-foreground">{navigationCopy.title}</h3>
                                                <p className="mt-2 text-sm text-muted-foreground">{navigationCopy.description}</p>
                                                <p className="mt-4 text-xs text-muted-foreground">
                                                    {locale === "ja" ? `現在の表示サイズ: ${viewport}` : `Active viewport: ${viewport}`}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </MarqueeFrame>
                            </div>
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "モバイル初期表示" : "Mobile first"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "スマホ画面の確認を主目的にする場合は、初期表示サイズをモバイルにします。" : "Set the initial viewport to mobile when phone review is the primary task."}
                            </p>
                        </div>
                        <ComponentPreview code={stateCodeByLocale[locale].mobile} codeBlock={<CodeBlock code={stateCodeByLocale[locale].mobile} />} previewBodyWidth="full" previewHeight={840} className="transition-none">
                            <MarqueeFrame path="/preview" initialViewport="mobile" maxCanvasHeight={620}>
                                {(viewport) => (
                                    <div className="flex h-full items-center justify-center bg-background p-6">
                                        {locale === "ja" ? "モバイル優先プレビュー" : "Mobile-first preview"} / {viewport}
                                    </div>
                                )}
                            </MarqueeFrame>
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "カスタム表示サイズ" : "Custom viewport sizes"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "パターン固有の画面比率に合わせて、デスクトップ / タブレット / モバイルのサイズを差し替えます。" : "Override desktop, tablet, and mobile dimensions for a pattern-specific aspect ratio."}
                            </p>
                        </div>
                        <ComponentPreview code={stateCodeByLocale[locale].customSizes} codeBlock={<CodeBlock code={stateCodeByLocale[locale].customSizes} />} previewBodyWidth="full" previewHeight={760} className="transition-none">
                            <MarqueeFrame
                                path="/custom"
                                maxCanvasHeight={540}
                                viewportSizes={{
                                    desktop: { width: 960, height: 540 },
                                    tablet: { width: 720, height: 720 },
                                    mobile: { width: 360, height: 640 },
                                }}
                            >
                                {(viewport) => (
                                    <div className="flex h-full items-center justify-center bg-background p-6">
                                        {locale === "ja" ? "カスタム表示サイズ" : "Custom viewport"} / {viewport}
                                    </div>
                                )}
                            </MarqueeFrame>
                        </ComponentPreview>
                    </section>
                </div>
            </section>

            <section className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">{locale === "ja" ? "プロパティ" : "Props"}</h2>
                <PropsTable data={propsDataByLocale[locale]} />
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
