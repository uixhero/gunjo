"use client";

import * as React from "react";
import { Button, DeviceFrame, cn, type MarqueeViewport } from "@gunjo/ui";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import layoutMetadata from "@design/layout-metadata.json";

const previewSizes: Record<MarqueeViewport, { width: number; height: number }> = {
    desktop: { width: 760, height: 300 },
    tablet: { width: 560, height: 360 },
    mobile: { width: 340, height: 420 },
};

const codeByLocale = {
    en: `import { Button, DeviceFrame, type MarqueeViewport } from "@gunjo/ui";
import * as React from "react";

const previewSizes: Record<MarqueeViewport, { width: number; height: number }> = {
  desktop: { width: 760, height: 300 },
  tablet: { width: 560, height: 360 },
  mobile: { width: 340, height: 420 },
};

export function Example() {
  const [viewport, setViewport] = React.useState<MarqueeViewport>("desktop");
  const [variant, setVariant] = React.useState<"default" | "windows11">("default");
  const size = previewSizes[viewport];

  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "default", label: "macOS" },
          { key: "windows11", label: "Windows 11" },
        ].map((item) => (
          <Button
            key={item.key}
            type="button"
            size="sm"
            variant={variant === item.key ? "default" : "outline"}
            onClick={() => setVariant(item.key as "default" | "windows11")}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg bg-muted/30 p-4">
        <div style={{ width: size.width, maxWidth: "100%" }}>
          <DeviceFrame
            host="gunjo.example"
            path="/dashboard"
            defaultPath="/dashboard"
            variant={variant}
            viewport={viewport}
            onViewportChange={setViewport}
            labels={{
              url: "URL",
              desktop: "Desktop viewport",
              tablet: "Tablet viewport",
              mobile: "Mobile viewport",
            }}
          >
            <div
              className="flex items-center justify-center bg-muted/30 text-sm text-muted-foreground"
              style={{ height: size.height }}
            >
              Pattern content / {viewport}
            </div>
          </DeviceFrame>
        </div>
      </div>
    </div>
  );
}`,
    ja: `import { Button, DeviceFrame, type MarqueeViewport } from "@gunjo/ui";
import * as React from "react";

const previewSizes: Record<MarqueeViewport, { width: number; height: number }> = {
  desktop: { width: 760, height: 300 },
  tablet: { width: 560, height: 360 },
  mobile: { width: 340, height: 420 },
};

export function Example() {
  const [viewport, setViewport] = React.useState<MarqueeViewport>("desktop");
  const [variant, setVariant] = React.useState<"default" | "windows11">("default");
  const size = previewSizes[viewport];

  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "default", label: "macOS" },
          { key: "windows11", label: "Windows 11" },
        ].map((item) => (
          <Button
            key={item.key}
            type="button"
            size="sm"
            variant={variant === item.key ? "default" : "outline"}
            onClick={() => setVariant(item.key as "default" | "windows11")}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg bg-muted/30 p-4">
        <div style={{ width: size.width, maxWidth: "100%" }}>
          <DeviceFrame
            host="gunjo.example"
            path="/dashboard"
            defaultPath="/dashboard"
            variant={variant}
            viewport={viewport}
            onViewportChange={setViewport}
            labels={{
              url: "URL",
              desktop: "デスクトップ幅",
              tablet: "タブレット幅",
              mobile: "モバイル幅",
            }}
          >
            <div
              className="flex items-center justify-center bg-muted/30 text-sm text-muted-foreground"
              style={{ height: size.height }}
            >
              パターンの内容 / {viewport}
            </div>
          </DeviceFrame>
        </div>
      </div>
    </div>
  );
}`,
} as const;

const stateCodeByLocale = {
    en: {
        macos: `import { DeviceFrame, type MarqueeViewport } from "@gunjo/ui";
import * as React from "react";

const previewSizes: Record<MarqueeViewport, { width: number; height: number }> = {
  desktop: { width: 760, height: 300 },
  tablet: { width: 560, height: 360 },
  mobile: { width: 340, height: 420 },
};

export function MacOSFrame() {
  const [viewport, setViewport] = React.useState<MarqueeViewport>("desktop");
  const size = previewSizes[viewport];

  return (
    <div className="overflow-x-auto rounded-lg bg-muted/30 p-4">
      <div style={{ width: size.width, maxWidth: "100%" }}>
        <DeviceFrame
          host="gunjo.example"
          path="/docs"
          tabTitle="Docs"
          viewport={viewport}
          onViewportChange={setViewport}
        >
          <div
            className="flex items-center justify-center bg-background p-4 text-sm text-muted-foreground"
            style={{ height: size.height }}
          >
            Documentation preview / {viewport}
          </div>
        </DeviceFrame>
      </div>
    </div>
  );
}`,
        windows: `import { DeviceFrame, type MarqueeViewport } from "@gunjo/ui";
import * as React from "react";

const previewSizes: Record<MarqueeViewport, { width: number; height: number }> = {
  desktop: { width: 760, height: 300 },
  tablet: { width: 560, height: 360 },
  mobile: { width: 340, height: 420 },
};

export function WindowsFrame() {
  const [viewport, setViewport] = React.useState<MarqueeViewport>("desktop");
  const size = previewSizes[viewport];

  return (
    <div className="overflow-x-auto rounded-lg bg-muted/30 p-4">
      <div style={{ width: size.width, maxWidth: "100%" }}>
        <DeviceFrame
          host="gunjo.example"
          path="/dashboard"
          variant="windows11"
          viewport={viewport}
          onViewportChange={setViewport}
        >
          <div
            className="flex items-center justify-center bg-muted/30 p-4 text-sm text-muted-foreground"
            style={{ height: size.height }}
          >
            Dashboard preview / {viewport}
          </div>
        </DeviceFrame>
      </div>
    </div>
  );
}`,
        mobile: `import { DeviceFrame, type MarqueeViewport } from "@gunjo/ui";
import * as React from "react";

const previewSizes: Record<MarqueeViewport, { width: number; height: number }> = {
  desktop: { width: 760, height: 300 },
  tablet: { width: 560, height: 360 },
  mobile: { width: 340, height: 420 },
};

export function MobileFrame() {
  const [viewport, setViewport] = React.useState<MarqueeViewport>("mobile");
  const size = previewSizes[viewport];

  return (
    <div className="overflow-x-auto rounded-lg bg-muted/30 p-4">
      <div style={{ width: size.width, maxWidth: "100%" }}>
        <DeviceFrame
          host="gunjo.example"
          path="/mobile"
          viewport={viewport}
          onViewportChange={setViewport}
        >
          <div
            className="flex items-center justify-center bg-background p-4 text-sm text-muted-foreground"
            style={{ height: size.height }}
          >
            Mobile preview / {viewport}
          </div>
        </DeviceFrame>
      </div>
    </div>
  );
}`,
        navigation: `import { DeviceFrame, type MarqueeViewport } from "@gunjo/ui";
import * as React from "react";

const previewSizes: Record<MarqueeViewport, { width: number; height: number }> = {
  desktop: { width: 760, height: 300 },
  tablet: { width: 560, height: 360 },
  mobile: { width: 340, height: 420 },
};

const pageLabels = {
  "/dashboard": "Dashboard",
  "/reports": "Reports",
  "/settings": "Settings",
};

type FramePath = keyof typeof pageLabels;

export function NavigableFrame() {
  const [viewport, setViewport] = React.useState<MarqueeViewport>("desktop");
  const [path, setPath] = React.useState<FramePath>("/dashboard");
  const size = previewSizes[viewport];

  return (
    <div className="overflow-x-auto rounded-lg bg-muted/30 p-4">
      <div style={{ width: size.width, maxWidth: "100%" }}>
        <DeviceFrame
          host="gunjo.example"
          path={path}
          defaultPath="/dashboard"
          viewport={viewport}
          onViewportChange={setViewport}
          navigablePaths={["/dashboard", "/reports", "/settings"]}
          onPathChange={(nextPath) => setPath(nextPath as FramePath)}
        >
          <div
            className="flex flex-col items-center justify-center gap-2 bg-background p-4 text-sm"
            style={{ height: size.height }}
          >
            <p className="font-medium">{pageLabels[path]}</p>
            <p className="text-muted-foreground">
              Try /dashboard, /reports, or /settings in the URL bar.
            </p>
          </div>
        </DeviceFrame>
      </div>
    </div>
  );
}`,
    },
    ja: {
        macos: `import { DeviceFrame, type MarqueeViewport } from "@gunjo/ui";
import * as React from "react";

const previewSizes: Record<MarqueeViewport, { width: number; height: number }> = {
  desktop: { width: 760, height: 300 },
  tablet: { width: 560, height: 360 },
  mobile: { width: 340, height: 420 },
};

export function MacOSFrame() {
  const [viewport, setViewport] = React.useState<MarqueeViewport>("desktop");
  const size = previewSizes[viewport];

  return (
    <div className="overflow-x-auto rounded-lg bg-muted/30 p-4">
      <div style={{ width: size.width, maxWidth: "100%" }}>
        <DeviceFrame
          host="gunjo.example"
          path="/docs"
          tabTitle="ドキュメント"
          viewport={viewport}
          onViewportChange={setViewport}
          labels={{
            desktop: "デスクトップ幅",
            tablet: "タブレット幅",
            mobile: "モバイル幅",
          }}
        >
          <div
            className="flex items-center justify-center bg-background p-4 text-sm text-muted-foreground"
            style={{ height: size.height }}
          >
            ドキュメントのプレビュー / {viewport}
          </div>
        </DeviceFrame>
      </div>
    </div>
  );
}`,
        windows: `import { DeviceFrame, type MarqueeViewport } from "@gunjo/ui";
import * as React from "react";

const previewSizes: Record<MarqueeViewport, { width: number; height: number }> = {
  desktop: { width: 760, height: 300 },
  tablet: { width: 560, height: 360 },
  mobile: { width: 340, height: 420 },
};

export function WindowsFrame() {
  const [viewport, setViewport] = React.useState<MarqueeViewport>("desktop");
  const size = previewSizes[viewport];

  return (
    <div className="overflow-x-auto rounded-lg bg-muted/30 p-4">
      <div style={{ width: size.width, maxWidth: "100%" }}>
        <DeviceFrame
          host="gunjo.example"
          path="/dashboard"
          variant="windows11"
          viewport={viewport}
          onViewportChange={setViewport}
          labels={{
            desktop: "デスクトップ幅",
            tablet: "タブレット幅",
            mobile: "モバイル幅",
          }}
        >
          <div
            className="flex items-center justify-center bg-muted/30 p-4 text-sm text-muted-foreground"
            style={{ height: size.height }}
          >
            ダッシュボードのプレビュー / {viewport}
          </div>
        </DeviceFrame>
      </div>
    </div>
  );
}`,
        mobile: `import { DeviceFrame, type MarqueeViewport } from "@gunjo/ui";
import * as React from "react";

const previewSizes: Record<MarqueeViewport, { width: number; height: number }> = {
  desktop: { width: 760, height: 300 },
  tablet: { width: 560, height: 360 },
  mobile: { width: 340, height: 420 },
};

export function MobileFrame() {
  const [viewport, setViewport] = React.useState<MarqueeViewport>("mobile");
  const size = previewSizes[viewport];

  return (
    <div className="overflow-x-auto rounded-lg bg-muted/30 p-4">
      <div style={{ width: size.width, maxWidth: "100%" }}>
        <DeviceFrame
          host="gunjo.example"
          path="/mobile"
          viewport={viewport}
          onViewportChange={setViewport}
          labels={{
            desktop: "デスクトップ幅",
            tablet: "タブレット幅",
            mobile: "モバイル幅",
          }}
        >
          <div
            className="flex items-center justify-center bg-background p-4 text-sm text-muted-foreground"
            style={{ height: size.height }}
          >
            モバイルのプレビュー / {viewport}
          </div>
        </DeviceFrame>
      </div>
    </div>
  );
}`,
        navigation: `import { DeviceFrame, type MarqueeViewport } from "@gunjo/ui";
import * as React from "react";

const previewSizes: Record<MarqueeViewport, { width: number; height: number }> = {
  desktop: { width: 760, height: 300 },
  tablet: { width: 560, height: 360 },
  mobile: { width: 340, height: 420 },
};

const pageLabels = {
  "/dashboard": "ダッシュボード",
  "/reports": "レポート",
  "/settings": "設定",
};

type FramePath = keyof typeof pageLabels;

export function NavigableFrame() {
  const [viewport, setViewport] = React.useState<MarqueeViewport>("desktop");
  const [path, setPath] = React.useState<FramePath>("/dashboard");
  const size = previewSizes[viewport];

  return (
    <div className="overflow-x-auto rounded-lg bg-muted/30 p-4">
      <div style={{ width: size.width, maxWidth: "100%" }}>
        <DeviceFrame
          host="gunjo.example"
          path={path}
          defaultPath="/dashboard"
          viewport={viewport}
          onViewportChange={setViewport}
          navigablePaths={["/dashboard", "/reports", "/settings"]}
          onPathChange={(nextPath) => setPath(nextPath as FramePath)}
          labels={{
            desktop: "デスクトップ幅",
            tablet: "タブレット幅",
            mobile: "モバイル幅",
          }}
        >
          <div
            className="flex flex-col items-center justify-center gap-2 bg-background p-4 text-sm"
            style={{ height: size.height }}
          >
            <p className="font-medium">{pageLabels[path]}</p>
            <p className="text-muted-foreground">
              /dashboard、/reports、/settings を入力できます。
            </p>
          </div>
        </DeviceFrame>
      </div>
    </div>
  );
}`,
    },
} as const;

type NavigableFramePath = "/dashboard" | "/reports" | "/settings";

const propsDataByLocale = {
    en: [
        { name: "host", type: "string", description: "Fake host shown in the URL bar.", required: true },
        { name: "path", type: "string", description: "Current path shown after the host.", required: true },
        { name: "viewport", type: "desktop | tablet | mobile", description: "Active viewport used for chrome state and controlled parent sizing.", required: true },
        { name: "onViewportChange", type: "(viewport) => void", description: "Called when the user switches viewport.", required: true },
        { name: "variant", type: "default | windows11", default: "default", description: "Visual browser chrome style." },
        { name: "labels", type: "DeviceFrameLabels", description: "Localized labels for the URL field and viewport toggle tooltips." },
        { name: "navigablePaths", type: "string[]", description: "Optional whitelist for URL-bar navigation." },
        { name: "onPathChange", type: "(path) => void", description: "Called when a valid URL path is submitted." },
    ],
    ja: [
        { name: "host", type: "string", description: "URL バーに表示する擬似ホストです。", required: true },
        { name: "path", type: "string", description: "ホストの後ろに表示する現在のパスです。", required: true },
        { name: "viewport", type: "desktop | tablet | mobile", description: "chrome 状態と親側のサイズ制御に使う現在の viewport です。", required: true },
        { name: "onViewportChange", type: "(viewport) => void", description: "viewport 切替時に呼び出されます。", required: true },
        { name: "variant", type: "default | windows11", default: "default", description: "擬似ブラウザ chrome の見た目です。" },
        { name: "labels", type: "DeviceFrameLabels", description: "URL 欄と viewport 切替ツールチップに使うローカライズ済みラベルです。" },
        { name: "navigablePaths", type: "string[]", description: "URL バー遷移を許可するパス一覧です。" },
        { name: "onPathChange", type: "(path) => void", description: "有効な URL パスが送信された時に呼び出されます。" },
    ],
} as const;

function DeviceFrameScenarioPreview({
    locale,
    variant = "default",
    initialViewport = "desktop",
    path,
    tabTitle,
    content,
    contentClassName,
}: {
    locale: "en" | "ja";
    variant?: "default" | "windows11";
    initialViewport?: MarqueeViewport;
    path: string;
    tabTitle?: string;
    content: string;
    contentClassName?: string;
}) {
    const [viewport, setViewport] = React.useState<MarqueeViewport>(initialViewport);
    const size = previewSizes[viewport];

    return (
        <div className="w-full overflow-x-auto rounded-lg bg-muted/30 p-4">
            <div
                className="transition-[width] duration-200"
                style={{ width: size.width, maxWidth: "100%" }}
            >
                <DeviceFrame
                    host="gunjo.example"
                    path={path}
                    tabTitle={tabTitle}
                    variant={variant}
                    viewport={viewport}
                    onViewportChange={setViewport}
                    labels={{
                        url: locale === "ja" ? "URL" : "URL",
                        desktop: locale === "ja" ? "デスクトップ幅" : "Desktop viewport",
                        tablet: locale === "ja" ? "タブレット幅" : "Tablet viewport",
                        mobile: locale === "ja" ? "モバイル幅" : "Mobile viewport",
                    }}
                >
                    <div
                        className={cn("flex items-center justify-center bg-background p-4 text-sm text-muted-foreground", contentClassName)}
                        style={{ height: size.height }}
                    >
                        {content} / {viewport}
                    </div>
                </DeviceFrame>
            </div>
        </div>
    );
}

function NavigableDeviceFramePreview({ locale }: { locale: "en" | "ja" }) {
    const [viewport, setViewport] = React.useState<MarqueeViewport>("desktop");
    const [path, setPath] = React.useState<NavigableFramePath>("/dashboard");
    const size = previewSizes[viewport];
    const pageLabels: Record<NavigableFramePath, string> = locale === "ja"
        ? { "/dashboard": "ダッシュボード", "/reports": "レポート", "/settings": "設定" }
        : { "/dashboard": "Dashboard", "/reports": "Reports", "/settings": "Settings" };

    return (
        <div className="w-full overflow-x-auto rounded-lg bg-muted/30 p-4">
            <div
                className="transition-[width] duration-200"
                style={{ width: size.width, maxWidth: "100%" }}
            >
                <DeviceFrame
                    host="gunjo.example"
                    path={path}
                    defaultPath="/dashboard"
                    viewport={viewport}
                    onViewportChange={setViewport}
                    navigablePaths={["/dashboard", "/reports", "/settings"]}
                    onPathChange={(nextPath) => setPath(nextPath as NavigableFramePath)}
                    labels={{
                        url: locale === "ja" ? "URL" : "URL",
                        desktop: locale === "ja" ? "デスクトップ幅" : "Desktop viewport",
                        tablet: locale === "ja" ? "タブレット幅" : "Tablet viewport",
                        mobile: locale === "ja" ? "モバイル幅" : "Mobile viewport",
                    }}
                >
                    <div
                        className="flex flex-col items-center justify-center gap-2 bg-background p-4 text-sm"
                        style={{ height: size.height }}
                    >
                        <p className="font-medium">{pageLabels[path]}</p>
                        <p className="text-muted-foreground">
                            {locale === "ja"
                                ? "/dashboard、/reports、/settings を入力できます。"
                                : "Try /dashboard, /reports, or /settings in the URL bar."}
                        </p>
                    </div>
                </DeviceFrame>
            </div>
        </div>
    );
}

export default function DeviceFrameDocPage() {
    const { locale } = useLocale();
    const [viewport, setViewport] = React.useState<MarqueeViewport>("desktop");
    const [variant, setVariant] = React.useState<"default" | "windows11">("default");
    const meta = layoutMetadata as Record<string, { title: string; description: string }>;
    const previewSize = previewSizes[viewport];

    return (
        <ComponentLayout
            title={meta.deviceFrame.title}
            description={meta.deviceFrame.description}
            usedComponents={[
                { name: "DeviceFrame", href: "/docs/components/device-frame" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "Button", href: "/docs/components/button" },
            ]}
            relatedComponents={[
                { name: "MediaLightbox", href: "/docs/components/media-lightbox" },
                { name: "Modal", href: "/docs/components/modal" },
                { name: "Container", href: "/docs/components/container" },
            ]}
        >
            <ComponentPreview code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewHeight="auto">
                <div className="w-full max-w-3xl space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { key: "default", label: locale === "ja" ? "macOS" : "macOS" },
                            { key: "windows11", label: "Windows 11" },
                        ].map((item) => (
                            <Button
                                key={item.key}
                                type="button"
                                size="sm"
                                variant={variant === item.key ? "default" : "outline"}
                                onClick={() => setVariant(item.key as "default" | "windows11")}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </div>
                    <div className="overflow-x-auto rounded-lg bg-muted/30 p-4">
                        <div
                            className="transition-[width] duration-200"
                            style={{ width: previewSize.width, maxWidth: "100%" }}
                        >
                            <DeviceFrame
                                host="gunjo.example"
                                path="/dashboard"
                                defaultPath="/dashboard"
                                variant={variant}
                                viewport={viewport}
                                onViewportChange={setViewport}
                                labels={{
                                    url: locale === "ja" ? "URL" : "URL",
                                    desktop: locale === "ja" ? "デスクトップ幅" : "Desktop viewport",
                                    tablet: locale === "ja" ? "タブレット幅" : "Tablet viewport",
                                    mobile: locale === "ja" ? "モバイル幅" : "Mobile viewport",
                                }}
                            >
                                <div
                                    className="flex items-center justify-center bg-muted/30 text-sm text-muted-foreground"
                                    style={{ height: previewSize.height }}
                                >
                                    {locale === "ja" ? `パターンの内容 / ${viewport}` : `Pattern content / ${viewport}`}
                                </div>
                            </DeviceFrame>
                        </div>
                    </div>
                </div>
            </ComponentPreview>

            <section className="space-y-6">
                <div className="space-y-1">
                    <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                        {locale === "ja" ? "状態とバリエーション" : "States and Variants"}
                    </h2>
                </div>
                <div className="space-y-8">
                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "macOS 風 chrome" : "macOS chrome"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "ドキュメントやWebページの確認に使う、標準のブラウザ風フレームです。" : "Use the default browser-style frame for docs and web page previews."}
                            </p>
                        </div>
                        <ComponentPreview
                            code={stateCodeByLocale[locale].macos}
                            codeBlock={<CodeBlock code={stateCodeByLocale[locale].macos} />}
                            previewBodyWidth="lg"
                            previewHeight="auto"
                        >
                            <DeviceFrameScenarioPreview
                                locale={locale}
                                path="/docs"
                                tabTitle={locale === "ja" ? "ドキュメント" : "Docs"}
                                content={locale === "ja" ? "ドキュメントのプレビュー" : "Documentation preview"}
                            />
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "Windows 11 風 chrome" : "Windows 11 chrome"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "デスクトップアプリや業務画面の検証に合う、Windows 11 風の chrome です。" : "Use the Windows 11 chrome for desktop app or operations-style previews."}
                            </p>
                        </div>
                        <ComponentPreview
                            code={stateCodeByLocale[locale].windows}
                            codeBlock={<CodeBlock code={stateCodeByLocale[locale].windows} />}
                            previewBodyWidth="lg"
                            previewHeight="auto"
                        >
                            <DeviceFrameScenarioPreview
                                locale={locale}
                                path="/dashboard"
                                variant="windows11"
                                content={locale === "ja" ? "ダッシュボードのプレビュー" : "Dashboard preview"}
                                contentClassName="bg-muted/30"
                            />
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "モバイル幅" : "Mobile viewport"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "スマートフォン幅で、同じフレーム内のコンテンツが収まるか確認します。" : "Check whether the same framed content holds up at a phone viewport."}
                            </p>
                        </div>
                        <ComponentPreview
                            code={stateCodeByLocale[locale].mobile}
                            codeBlock={<CodeBlock code={stateCodeByLocale[locale].mobile} />}
                            previewBodyWidth="lg"
                            previewHeight="auto"
                        >
                            <DeviceFrameScenarioPreview
                                locale={locale}
                                path="/mobile"
                                initialViewport="mobile"
                                content={locale === "ja" ? "モバイルのプレビュー" : "Mobile preview"}
                            />
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "URL 入力" : "URL navigation"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja"
                                    ? "URL バーに許可されたパスを入力した時に、フレーム内の表示を切り替えます。"
                                    : "Update the framed content when the URL bar receives an allowed path."}
                            </p>
                        </div>
                        <ComponentPreview
                            code={stateCodeByLocale[locale].navigation}
                            codeBlock={<CodeBlock code={stateCodeByLocale[locale].navigation} />}
                            previewBodyWidth="lg"
                            previewHeight="auto"
                        >
                            <NavigableDeviceFramePreview locale={locale} />
                        </ComponentPreview>
                    </section>
                </div>
            </section>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">{locale === "ja" ? "プロパティ" : "Props"}</h2>
                <PropsTable data={propsDataByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {locale === "ja" ? "使い方" : "Usage"}
                    </h2>
                    <CodeCopyButton code={codeByLocale[locale]} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={codeByLocale[locale]} />
                </div>
            </div>
        </ComponentLayout>
    );
}
