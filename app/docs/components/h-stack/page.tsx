"use client";

import type { ReactNode } from "react";
import { Button, HStack } from "@gunjo/ui";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import layoutMetadata from "@design/layout-metadata.json";

const codeByLocale = {
    en: `import { Button, HStack } from "@gunjo/ui";

export function ToolbarActions() {
  return (
    <HStack gap={2} align="center" wrap>
      <Button size="sm">Save</Button>
      <Button size="sm" variant="outline">Preview</Button>
      <Button size="sm" variant="ghost">Cancel</Button>
    </HStack>
  );
}`,
    ja: `import { Button, HStack } from "@gunjo/ui";

export function ToolbarActions() {
  return (
    <HStack gap={2} align="center" wrap>
      <Button size="sm">保存</Button>
      <Button size="sm" variant="outline">プレビュー</Button>
      <Button size="sm" variant="ghost">キャンセル</Button>
    </HStack>
  );
}`,
} as const;

const stateCodeByLocale = {
    en: {
        toolbar: codeByLocale.en,
        between: `<HStack justify="between" align="center" className="w-full rounded-md border bg-background p-3">
  <span className="text-sm font-medium">Project status</span>
  <Button size="sm">Publish</Button>
</HStack>`,
        wrap: `<HStack gap={2} wrap className="w-56 rounded-md border bg-background p-3">
  {["Draft", "Needs review", "Ready", "Published", "Archived"].map((label) => (
    <span key={label} className="shrink-0 rounded-md border bg-muted/50 px-2 py-1 text-sm">
      {label}
    </span>
  ))}
</HStack>`,
        baseline: `<HStack align="baseline" gap={2}>
  <span className="text-2xl font-semibold">128</span>
  <span className="text-sm text-muted-foreground">active users</span>
</HStack>`,
    },
    ja: {
        toolbar: codeByLocale.ja,
        between: `<HStack justify="between" align="center" className="w-full rounded-md border bg-background p-3">
  <span className="text-sm font-medium">プロジェクト状態</span>
  <Button size="sm">公開</Button>
</HStack>`,
        wrap: `<HStack gap={2} wrap className="w-56 rounded-md border bg-background p-3">
  {["下書き", "公開前確認", "準備完了", "公開済み", "保管済み"].map((label) => (
    <span key={label} className="shrink-0 rounded-md border bg-muted/50 px-2 py-1 text-sm">
      {label}
    </span>
  ))}
</HStack>`,
        baseline: `<HStack align="baseline" gap={2}>
  <span className="text-2xl font-semibold">128</span>
  <span className="text-sm text-muted-foreground">人が利用中</span>
</HStack>`,
    },
} as const;

function Pill({ children }: { children: ReactNode }) {
    return <span className="shrink-0 rounded-md border bg-muted/50 px-2 py-1 text-sm">{children}</span>;
}

export default function HStackPage() {
    const { locale } = useLocale();
    const meta = layoutMetadata as Record<string, { title: string; description: string }>;
    const propsData = locale === "ja"
        ? [
            { name: "gap", type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12", default: "2", description: "子要素間の余白です。" },
            { name: "align", type: '"start" | "center" | "end" | "baseline" | "stretch"', default: '"center"', description: "縦方向の揃え方です。" },
            { name: "justify", type: '"start" | "center" | "end" | "between" | "around" | "evenly"', default: '"start"', description: "横方向の配置方法です。" },
            { name: "wrap", type: "boolean", default: "false", description: "横幅が足りない時に折り返すかどうかです。" },
            { name: "inline", type: "boolean", default: "false", description: "inline-flex として描画します。" },
        ]
        : [
            { name: "gap", type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12", default: "2", description: "Spacing between children." },
            { name: "align", type: '"start" | "center" | "end" | "baseline" | "stretch"', default: '"center"', description: "Cross-axis alignment." },
            { name: "justify", type: '"start" | "center" | "end" | "between" | "around" | "evenly"', default: '"start"', description: "Main-axis distribution." },
            { name: "wrap", type: "boolean", default: "false", description: "Allows children to wrap onto new lines." },
            { name: "inline", type: "boolean", default: "false", description: "Renders as inline-flex." },
        ];

    return (
        <ComponentLayout
            title={locale === "ja" ? "水平スタック" : meta.hStack.title}
            description={locale === "ja" ? "操作、ラベル、短い項目を横方向に並べ、余白・揃え・折り返しを制御します。" : meta.hStack.description}
            usedComponents={[{ name: "HStack", href: "/docs/components/h-stack" }]}
            relatedComponents={[
                { name: "VStack", href: "/docs/components/v-stack" },
                { name: "Cluster", href: "/docs/components/cluster" },
                { name: "Button", href: "/docs/components/button" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/h-stack" code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewBodyWidth="md">
                <HStack gap={2} align="center" wrap>
                    <Button size="sm">{locale === "ja" ? "保存" : "Save"}</Button>
                    <Button size="sm" variant="outline">{locale === "ja" ? "プレビュー" : "Preview"}</Button>
                    <Button size="sm" variant="ghost">{locale === "ja" ? "キャンセル" : "Cancel"}</Button>
                </HStack>
            </ComponentPreview>

            <section className="space-y-6">
                <div className="space-y-1">
                    <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                        {locale === "ja" ? "状態とバリエーション" : "States and Variants"}
                    </h2>
                </div>
                <div className="space-y-8">
                    {[
                        {
                            key: "toolbar",
                            title: locale === "ja" ? "ツールバー操作" : "Toolbar actions",
                            description: locale === "ja" ? "短い操作ボタンを横方向に並べます。" : "Line up short action buttons horizontally.",
                            code: stateCodeByLocale[locale].toolbar,
                            preview: (
                                <HStack gap={2} align="center" wrap>
                                    <Button size="sm">{locale === "ja" ? "保存" : "Save"}</Button>
                                    <Button size="sm" variant="outline">{locale === "ja" ? "プレビュー" : "Preview"}</Button>
                                    <Button size="sm" variant="ghost">{locale === "ja" ? "キャンセル" : "Cancel"}</Button>
                                </HStack>
                            ),
                        },
                        {
                            key: "between",
                            title: locale === "ja" ? "両端揃え" : "Space between",
                            description: locale === "ja" ? "ラベルと操作のように、左右へ分けたい行で使います。" : "Use it for rows that separate label and action.",
                            code: stateCodeByLocale[locale].between,
                            preview: (
                                <HStack justify="between" align="center" className="w-full rounded-md border bg-background p-3">
                                    <span className="text-sm font-medium">{locale === "ja" ? "プロジェクト状態" : "Project status"}</span>
                                    <Button size="sm">{locale === "ja" ? "公開" : "Publish"}</Button>
                                </HStack>
                            ),
                        },
                        {
                            key: "wrap",
                            title: locale === "ja" ? "折り返し" : "Wrapping",
                            description: locale === "ja" ? "タグや短い項目が横幅を超える時に折り返します。" : "Wrap tags or short items when they exceed the available width.",
                            code: stateCodeByLocale[locale].wrap,
                            preview: (
                                <HStack gap={2} wrap className="w-56 rounded-md border bg-background p-3">
                                    {(locale === "ja" ? ["下書き", "公開前確認", "準備完了", "公開済み", "保管済み"] : ["Draft", "Needs review", "Ready", "Published", "Archived"]).map((label) => <Pill key={label}>{label}</Pill>)}
                                </HStack>
                            ),
                        },
                        {
                            key: "baseline",
                            title: locale === "ja" ? "ベースライン揃え" : "Baseline alignment",
                            description: locale === "ja" ? "サイズの違う数値と補足テキストを自然に揃えます。" : "Align metrics and helper text with different font sizes.",
                            code: stateCodeByLocale[locale].baseline,
                            preview: (
                                <HStack align="baseline" gap={2}>
                                    <span className="text-2xl font-semibold">128</span>
                                    <span className="text-sm text-muted-foreground">{locale === "ja" ? "人が利用中" : "active users"}</span>
                                </HStack>
                            ),
                        },
                    ].map((item) => (
                        <section key={item.key} className="space-y-3">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <ComponentPreview code={item.code} codeBlock={<CodeBlock code={item.code} />} previewBodyWidth="md" previewHeight="auto">
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
