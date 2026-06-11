"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { TooltipButton } from "@gunjo/ui";
import { IconCopy, IconSparkles, IconTrash } from "@tabler/icons-react";

function TooltipButtonStatePreview({ iconOnly, destructive }: { iconOnly?: boolean; destructive?: boolean }) {
    const { locale } = useLocale();

    if (iconOnly) {
        return (
            <TooltipButton
                type="button"
                variant="ghost"
                size="icon"
                aria-label={locale === "ja" ? "コードをコピー" : "Copy code"}
                tooltip={locale === "ja" ? "表示中のコード例をコピーします。" : "Copy the visible code example."}
                tooltipOpenOnClick
            >
                <IconCopy className="h-4 w-4" />
            </TooltipButton>
        );
    }

    if (destructive) {
        return (
            <TooltipButton
                type="button"
                variant="destructive"
                tooltip={locale === "ja" ? "この操作は取り消せません。実行前に確認してください。" : "This action cannot be undone. Confirm before continuing."}
                tooltipContentClassName="max-w-64 text-left"
            >
                <IconTrash className="h-4 w-4" />
                {locale === "ja" ? "削除する" : "Delete"}
            </TooltipButton>
        );
    }

    return (
        <TooltipButton
            type="button"
            variant="outline"
            size="sm"
            tooltip={locale === "ja" ? "コンポーネント仕様を Markdown でコピーし、AI への依頼文に貼り付けられるようにします。" : "Copy the component spec as Markdown for AI prompts."}
            tooltipSide="bottom"
            tooltipContentClassName="max-w-[260px] text-left leading-5"
        >
            <IconSparkles className="h-3.5 w-3.5" />
            {locale === "ja" ? "AI用仕様をコピー" : "Copy spec for AI"}
        </TooltipButton>
    );
}

export default function TooltipButtonDocPage() {
    const { locale, sectionLabels } = useLocale();
    const code = `import { TooltipButton } from "@gunjo/ui";
import { IconSparkles } from "@tabler/icons-react";

export function CopySpecAction() {
  return (
    <TooltipButton
      type="button"
      variant="outline"
      size="sm"
      tooltip="${locale === "ja" ? "コンポーネント仕様を Markdown でコピーし、AI への依頼文に貼り付けられるようにします。" : "Copy the component spec as Markdown for AI prompts."}"
      tooltipContentClassName="max-w-[260px] text-left"
    >
      <IconSparkles className="h-3.5 w-3.5" />
      ${locale === "ja" ? "AI用仕様をコピー" : "Copy spec for AI"}
    </TooltipButton>
  );
}`;
    const usageCode = `import { TooltipButton } from "@gunjo/ui";
import { IconCopy } from "@tabler/icons-react";

<TooltipButton
  type="button"
  variant="ghost"
  size="icon"
  aria-label="${locale === "ja" ? "コードをコピー" : "Copy code"}"
  tooltip="${locale === "ja" ? "表示中のコード例をコピーします。" : "Copy the visible code example."}"
  tooltipOpenOnClick
>
  <IconCopy className="h-4 w-4" />
</TooltipButton>`;
    const propsData = [
        { name: "tooltip", type: "React.ReactNode", description: locale === "ja" ? "ボタン操作の意味や結果を説明するツールチップ内容です。" : "Tooltip content explaining the button action." },
        { name: "tooltipSide", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: locale === "ja" ? "ツールチップを表示したい方向です。" : "Preferred tooltip side." },
        { name: "tooltipAlign", type: '"start" | "center" | "end"', default: '"center"', description: locale === "ja" ? "ボタンに対するツールチップの揃え位置です。" : "Tooltip alignment relative to the trigger." },
        { name: "tooltipSideOffset", type: "number", default: "4", description: locale === "ja" ? "ボタンとツールチップの間隔です。" : "Distance between trigger and tooltip." },
        { name: "tooltipContentClassName", type: "string", description: locale === "ja" ? "ツールチップ内容に追加するクラス名です。" : "Additional class names for tooltip content." },
        { name: "tooltipOpenOnClick", type: "boolean", default: "false", description: locale === "ja" ? "タップやクリックでもツールチップを短時間表示するか。スマホのアイコンのみボタンで使います。" : "Whether a click or tap briefly opens the tooltip. Use this for icon-only buttons on touch devices." },
        { name: "tooltipClickDuration", type: "number", default: "1600", description: locale === "ja" ? "tooltipOpenOnClick 時にツールチップを表示しておく時間です。" : "How long the tooltip stays open when tooltipOpenOnClick is enabled." },
        { name: "variant / size / children", type: "Button props", description: locale === "ja" ? "Button と同じ見た目・サイズ・内容を指定できます。" : "Forwards the regular Button API to the trigger button." },
    ];

    return (
        <ComponentLayout
            title={(inputsMetadata as Record<string, { title: string }>).tooltipButton.title}
            description={(inputsMetadata as Record<string, { description: string }>).tooltipButton.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "Toggle", href: "/docs/components/toggle" },
                { name: "CollapsiblePanelToggle", href: "/docs/components/collapsible-panel-toggle" },
                { name: "EditableField", href: "/docs/components/editable-field" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels}>
                <div className="flex flex-wrap items-center gap-3">
                    <TooltipButtonStatePreview />
                    <TooltipButtonStatePreview iconOnly />
                </div>
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "text",
                            title: locale === "ja" ? "説明付きアクション" : "Explained action",
                            description: locale === "ja" ? "実行結果が分かりにくいボタンには、ツールチップで何が起こるかを説明します。" : "Explain what happens when the result of an action is not obvious.",
                            preview: <TooltipButtonStatePreview />,
                            previewHeight: 150,
                            code,
                        },
                        {
                            key: "icon-only",
                            title: locale === "ja" ? "アイコンのみ" : "Icon only",
                            description: locale === "ja" ? "アイコンだけの操作では、支援技術向けラベルとツールチップの文言を揃えます。スマホで確認できるように tooltipOpenOnClick を使います。" : "Icon-only actions need both aria-label and tooltip copy. Use tooltipOpenOnClick so touch users can reveal it.",
                            preview: <TooltipButtonStatePreview iconOnly />,
                            previewHeight: 150,
                            code: usageCode,
                        },
                        {
                            key: "destructive",
                            title: locale === "ja" ? "破壊的操作" : "Destructive action",
                            description: locale === "ja" ? "取り消しにくい操作は破壊的な見た目と説明文で意図を明確にします。" : "Use destructive styling and explanatory copy for irreversible actions.",
                            preview: <TooltipButtonStatePreview destructive />,
                            previewHeight: 150,
                            code: `<TooltipButton variant="destructive" tooltip="${locale === "ja" ? "この操作は取り消せません。" : "This action cannot be undone."}">${locale === "ja" ? "削除する" : "Delete"}</TooltipButton>`,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </section>
        </ComponentLayout>
    );
}
