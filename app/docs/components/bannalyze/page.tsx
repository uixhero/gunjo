"use client";

import { Badge, BannalyzeTemplate, Button } from "@gunjo/ui";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { BannalyzeTemplateDemo } from "@/components/demos/BannalyzeTemplateDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import patternsMetadata from "@design/patterns-metadata.json";

const usageCode = `import { BannalyzeTemplate } from "@gunjo/ui";

export function AnalysisPage() {
  return (
    <BannalyzeTemplate
      header={<div>Header Content</div>}
      sidebar={<div>Sidebar List</div>}
      inspector={<div>Analysis Data</div>}
    >
      <div className="flex items-center justify-center h-full">
         <img src="/banner.jpg" alt="Banner" />
      </div>
    </BannalyzeTemplate>
  )
}`;

const propsData = [
    {
        name: "header",
        type: "React.ReactNode",
        description: "Content for the top navigation bar.",
    },
    {
        name: "sidebar",
        type: "React.ReactNode",
        description: "Content for the left sidebar (navigation, history).",
    },
    {
        name: "children",
        type: "React.ReactNode",
        description: "The main content area (canvas, center stage).",
    },
    {
        name: "inspector",
        type: "React.ReactNode",
        description: "Content for the right sidebar (analysis results, details).",
    },
    {
        name: "className",
        type: "string",
        description: "Additional classes for the root container.",
    }
];

export default function BannalyzePage() {
    const { locale } = useLocale();

    const canvas = (
        <div className="rounded-md border bg-background px-16 py-12 text-sm text-muted-foreground">
            {locale === "ja" ? "解析する画像" : "Image under analysis"}
        </div>
    );

    const history = (
        <div className="space-y-1 p-3">
            <p className="px-1 pb-2 text-xs font-semibold uppercase text-muted-foreground">
                {locale === "ja" ? "履歴" : "History"}
            </p>
            {(locale === "ja" ? ["夏の広告 v3", "夏の広告 v2", "夏の広告 v1"] : ["Summer ad v3", "Summer ad v2", "Summer ad v1"]).map((name, index) => (
                <div key={name} className={index === 0 ? "rounded bg-accent px-2 py-1 text-sm" : "rounded px-2 py-1 text-sm text-muted-foreground"}>
                    {name}
                </div>
            ))}
        </div>
    );

    const analysisHeader = (
        <div className="flex w-full items-center justify-between">
            <span className="font-semibold">{locale === "ja" ? "夏の広告 v3" : "Summer ad v3"}</span>
            <Button size="sm">{locale === "ja" ? "書き出す" : "Export"}</Button>
        </div>
    );

    return (
        <ComponentLayout
            title={patternsMetadata.bannalyzeTemplate.title}
            description={patternsMetadata.bannalyzeTemplate.description}
            usedComponents={[
                { name: "Button", href: "/docs/components/button" },
                { name: "Badge", href: "/docs/components/badge" },
                { name: "SidebarItem", href: "/docs/components/sidebar-item" },
                { name: "Input", href: "/docs/components/input" },
            ]}
            relatedComponents={[
                { name: "MediaLibraryTemplate", href: "/docs/components/media-library" },
                { name: "EditorTemplate", href: "/docs/components/editor" },
                { name: "InspectorPanel", href: "/docs/components/inspector-panel" },
                { name: "ImagePreview", href: "/docs/components/image-preview" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/bannalyze" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <BannalyzeTemplateDemo />
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "header・sidebar・inspector はどれも省略できます。左の履歴は中くらいの幅から、右の解析結果は広い幅から現れ、真ん中の画像は常に中央に置かれます。"
                        : "header, sidebar, and inspector are all optional. The history appears from medium widths, the results panel only on wide ones, and the artwork stays centered at every size."}
                </p>
                <ComponentDemoStates
                    states={[
                        {
                            key: "full-analysis",
                            title: locale === "ja" ? "履歴と解析結果つき" : "History and results",
                            description: locale === "ja"
                                ? "左に過去の版、右に解析結果を並べた標準形です。真ん中は見るものだけに使います。"
                                : "Past versions on the left, results on the right. The middle is kept for the thing being looked at.",
                            preview: (
                                <BannalyzeTemplate
                                    className="h-auto"
                                    header={analysisHeader}
                                    sidebar={history}
                                    inspector={
                                        <div className="space-y-3 p-4">
                                            <p className="text-xs font-semibold uppercase text-muted-foreground">
                                                {locale === "ja" ? "解析結果" : "Results"}
                                            </p>
                                            <div className="flex items-center justify-between text-sm">
                                                <span>{locale === "ja" ? "読みやすさ" : "Legibility"}</span>
                                                <Badge variant="success">{locale === "ja" ? "良好" : "Good"}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span>{locale === "ja" ? "文字の量" : "Text density"}</span>
                                                <Badge variant="warning">{locale === "ja" ? "多い" : "High"}</Badge>
                                            </div>
                                        </div>
                                    }
                                >
                                    {canvas}
                                </BannalyzeTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Badge, BannalyzeTemplate, Button } from "@gunjo/ui";

const VERSIONS = ["夏の広告 v3", "夏の広告 v2", "夏の広告 v1"];

export function FullAnalysis() {
  return (
    <BannalyzeTemplate
      className="h-auto"
      header={
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold">夏の広告 v3</span>
          <Button size="sm">書き出す</Button>
        </div>
      }
      sidebar={
        <div className="space-y-1 p-3">
          {VERSIONS.map((name) => (
            <div key={name} className="rounded px-2 py-1 text-sm text-muted-foreground">{name}</div>
          ))}
        </div>
      }
      inspector={
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between text-sm">
            <span>読みやすさ</span>
            <Badge variant="success">良好</Badge>
          </div>
        </div>
      }
    >
      <div className="rounded-md border bg-background px-16 py-12 text-sm text-muted-foreground">
        解析する画像
      </div>
    </BannalyzeTemplate>
  );
}`
                                : `import { Badge, BannalyzeTemplate, Button } from "@gunjo/ui";

const VERSIONS = ["Summer ad v3", "Summer ad v2", "Summer ad v1"];

export function FullAnalysis() {
  return (
    <BannalyzeTemplate
      className="h-auto"
      header={
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold">Summer ad v3</span>
          <Button size="sm">Export</Button>
        </div>
      }
      sidebar={
        <div className="space-y-1 p-3">
          {VERSIONS.map((name) => (
            <div key={name} className="rounded px-2 py-1 text-sm text-muted-foreground">{name}</div>
          ))}
        </div>
      }
      inspector={
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between text-sm">
            <span>Legibility</span>
            <Badge variant="success">Good</Badge>
          </div>
        </div>
      }
    >
      <div className="rounded-md border bg-background px-16 py-12 text-sm text-muted-foreground">
        Image under analysis
      </div>
    </BannalyzeTemplate>
  );
}`,
                        },
                        {
                            key: "no-inspector",
                            title: locale === "ja" ? "解析結果を閉じる" : "Without the results panel",
                            description: locale === "ja"
                                ? "inspector を省くと画像が右まで広がります。解析の前や、結果を別の画面で見せるときの形です。"
                                : "Drop inspector and the artwork widens. Use it before analysis has run, or when the results live on another screen.",
                            preview: (
                                <BannalyzeTemplate className="h-auto" header={analysisHeader} sidebar={history}>
                                    {canvas}
                                </BannalyzeTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { BannalyzeTemplate, Button } from "@gunjo/ui";

const VERSIONS = ["夏の広告 v3", "夏の広告 v2", "夏の広告 v1"];

export function AnalysisWithoutInspector() {
  return (
    <BannalyzeTemplate
      className="h-auto"
      header={
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold">夏の広告 v3</span>
          <Button size="sm">書き出す</Button>
        </div>
      }
      sidebar={
        <div className="space-y-1 p-3">
          {VERSIONS.map((name) => (
            <div key={name} className="rounded px-2 py-1 text-sm text-muted-foreground">{name}</div>
          ))}
        </div>
      }
    >
      <div className="rounded-md border bg-background px-16 py-12 text-sm text-muted-foreground">
        解析する画像
      </div>
    </BannalyzeTemplate>
  );
}`
                                : `import { BannalyzeTemplate, Button } from "@gunjo/ui";

const VERSIONS = ["Summer ad v3", "Summer ad v2", "Summer ad v1"];

export function AnalysisWithoutInspector() {
  return (
    <BannalyzeTemplate
      className="h-auto"
      header={
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold">Summer ad v3</span>
          <Button size="sm">Export</Button>
        </div>
      }
      sidebar={
        <div className="space-y-1 p-3">
          {VERSIONS.map((name) => (
            <div key={name} className="rounded px-2 py-1 text-sm text-muted-foreground">{name}</div>
          ))}
        </div>
      }
    >
      <div className="rounded-md border bg-background px-16 py-12 text-sm text-muted-foreground">
        Image under analysis
      </div>
    </BannalyzeTemplate>
  );
}`,
                        },
                        {
                            key: "canvas-only",
                            title: locale === "ja" ? "画像だけ" : "Artwork only",
                            description: locale === "ja"
                                ? "children だけを渡すと、余計なものが消えて画像だけが残ります。発表や確認のときに使います。"
                                : "Pass only children and everything else falls away, leaving the artwork. Use it for presenting or for a final check.",
                            preview: (
                                <BannalyzeTemplate className="h-auto">
                                    {canvas}
                                </BannalyzeTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { BannalyzeTemplate } from "@gunjo/ui";

export function ArtworkOnly() {
  return (
    <BannalyzeTemplate className="h-auto">
      <div className="rounded-md border bg-background px-16 py-12 text-sm text-muted-foreground">
        解析する画像
      </div>
    </BannalyzeTemplate>
  );
}`
                                : `import { BannalyzeTemplate } from "@gunjo/ui";

export function ArtworkOnly() {
  return (
    <BannalyzeTemplate className="h-auto">
      <div className="rounded-md border bg-background px-16 py-12 text-sm text-muted-foreground">
        Image under analysis
      </div>
    </BannalyzeTemplate>
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
