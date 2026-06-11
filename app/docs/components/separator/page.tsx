"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Separator } from "@gunjo/ui";

const codeByLocale = {
    ja: `import { Separator } from "@gunjo/ui";

export function Example() {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">公開設定</p>
      <Separator />
      <p className="text-sm text-muted-foreground">公開前に内容を確認してください。</p>
    </div>
  );
}`,
    en: `import { Separator } from "@gunjo/ui";

export function Example() {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Publish settings</p>
      <Separator />
      <p className="text-sm text-muted-foreground">Review the content before publishing.</p>
    </div>
  );
}`,
} as const;

const verticalCodeByLocale = {
    ja: `import { Separator } from "@gunjo/ui";

export function ToolbarMeta() {
  return (
    <div className="flex h-5 items-center gap-3 text-sm">
      <span>下書き</span>
      <Separator orientation="vertical" />
      <span>最終更新 5分前</span>
    </div>
  );
}`,
    en: `import { Separator } from "@gunjo/ui";

export function ToolbarMeta() {
  return (
    <div className="flex h-5 items-center gap-3 text-sm">
      <span>Draft</span>
      <Separator orientation="vertical" />
      <span>Updated 5 min ago</span>
    </div>
  );
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "orientation", type: "\"horizontal\" | \"vertical\"", default: "\"horizontal\"", description: "区切り線の向きです。" },
        { name: "className", type: "string", description: "長さや余白を調整するクラスです。" },
    ],
    en: [
        { name: "orientation", type: "\"horizontal\" | \"vertical\"", default: "\"horizontal\"", description: "Separator orientation." },
        { name: "className", type: "string", description: "Optional classes for length or spacing adjustments." },
    ],
} as const;

export default function SeparatorPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/separator", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const code = codeByLocale[locale];

    return (
        <ComponentLayout
            title={content?.title ?? meta.separator.title}
            description={content?.description ?? meta.separator.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Separator", href: "/docs/components/separator" },
            ]}
            relatedComponents={[
                { name: "Spacer", href: "/docs/components/spacer" },
                { name: "Card", href: "/docs/components/card" },
                { name: "Table", href: "/docs/components/table" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="sm" previewHeight="auto">
                <div className="w-full space-y-3">
                    <p className="text-sm font-medium">{locale === "ja" ? "公開設定" : "Publish settings"}</p>
                    <Separator className="w-full" />
                    <p className="text-sm text-muted-foreground">{locale === "ja" ? "公開前に内容を確認してください。" : "Review the content before publishing."}</p>
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "vertical",
                            title: locale === "ja" ? "垂直" : "Vertical",
                            description: locale === "ja"
                                ? "ツールバーやメタ情報の短い区切りには vertical を使います。"
                                : "Use vertical separators between short toolbar or metadata items.",
                            preview: (
                                <div className="flex h-5 items-center gap-3 text-sm">
                                    <span>{locale === "ja" ? "下書き" : "Draft"}</span>
                                    <Separator orientation="vertical" />
                                    <span>{locale === "ja" ? "最終更新 5分前" : "Updated 5 min ago"}</span>
                                </div>
                            ),
                            code: verticalCodeByLocale[locale],
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </div>
        </ComponentLayout>
    );
}
