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
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

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
    const isJa = locale === "ja";
    const code = isJa
        ? `import { TooltipButton } from "@gunjo/ui";
import { IconSparkles } from "@tabler/icons-react";

export function CopySpecAction() {
  return (
    <TooltipButton
      type="button"
      variant="outline"
      size="sm"
      tooltip="コンポーネント仕様を Markdown でコピーします。"
      tooltipContentClassName="max-w-[260px] text-left"
    >
      <IconSparkles className="h-3.5 w-3.5" />
      AI用仕様をコピー
    </TooltipButton>
  );
}`
        : `import { TooltipButton } from "@gunjo/ui";
import { IconSparkles } from "@tabler/icons-react";

export function CopySpecAction() {
  return (
    <TooltipButton
      type="button"
      variant="outline"
      size="sm"
      tooltip="Copy the component spec as Markdown for AI prompts."
      tooltipContentClassName="max-w-[260px] text-left"
    >
      <IconSparkles className="h-3.5 w-3.5" />
      Copy spec for AI
    </TooltipButton>
  );
}`;
    const usageCode = isJa
        ? `import { TooltipButton } from "@gunjo/ui";
import { IconCopy } from "@tabler/icons-react";

export function CopyCodeIconAction() {
  return (
    <TooltipButton
      type="button"
      variant="ghost"
      size="icon"
      aria-label="コードをコピー"
      tooltip="表示中のコード例をコピーします。"
      tooltipOpenOnClick
    >
      <IconCopy className="h-4 w-4" />
    </TooltipButton>
  );
}`
        : `import { TooltipButton } from "@gunjo/ui";
import { IconCopy } from "@tabler/icons-react";

export function CopyCodeIconAction() {
  return (
    <TooltipButton
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Copy code"
      tooltip="Copy the visible code example."
      tooltipOpenOnClick
    >
      <IconCopy className="h-4 w-4" />
    </TooltipButton>
  );
}`;
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
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: ボタン（Button）" : "UIXHERO: Button (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/button`,
                    relation: "nearest",
                },
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
                            code: isJa
                                ? `import { TooltipButton } from "@gunjo/ui";
import { IconTrash } from "@tabler/icons-react";

export function DeleteAssetAction() {
  return (
    <TooltipButton
      type="button"
      variant="destructive"
      tooltip="この操作は取り消せません。実行前に確認してください。"
      tooltipContentClassName="max-w-64 text-left"
    >
      <IconTrash className="h-4 w-4" />
      削除する
    </TooltipButton>
  );
}`
                                : `import { TooltipButton } from "@gunjo/ui";
import { IconTrash } from "@tabler/icons-react";

export function DeleteAssetAction() {
  return (
    <TooltipButton
      type="button"
      variant="destructive"
      tooltip="This action cannot be undone. Confirm before continuing."
      tooltipContentClassName="max-w-64 text-left"
    >
      <IconTrash className="h-4 w-4" />
      Delete
    </TooltipButton>
  );
}`,
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
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>ツールチップ付きのボタンを1つの部品にした。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Button</code> を <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Tooltip</code> で巻く形を画面ごとに書くと、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">asChild</code> の付け忘れや、トリガーとボタンの二重のフォーカス管理で壊れます。ここに寄せて、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tooltip</code> を渡すだけで済むようにしました。
                        </li>
                        <li>
                            <strong>触った瞬間にツールチップを畳む口を用意した。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tooltipCloseOnPress</code> を渡すと、押した瞬間に吹き出しが閉じ、指を離すまで再び開きません。スマホでは「触る」がホバーも兼ねるので、押したあとも説明が画面に残って邪魔になるためです。
                        </li>
                        <li>
                            <strong>押したあとに出す使い方もできる。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tooltipOpenOnClick</code> を渡すと、押したときだけ開いて既定 1600ms で閉じます。ただしこれは説明ではなく短い知らせなので、押した結果そのものを伝えるなら、読み上げに載る <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="status"'}</code> を使ってください（<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">CopyButton</code> がその形です）。
                            <br />
                            一般のボタンの設計は UIXHERO の「ボタン」にあります。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>A button with a tooltip is one component, not a recipe.</strong> Hand-wrapping <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Button</code> in <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Tooltip</code> on every screen invites a missing <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">asChild</code> and two competing focus owners. Consolidating it here means passing <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tooltip</code> and nothing else.
                        </li>
                        <li>
                            <strong>There is an explicit escape for touch.</strong> Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tooltipCloseOnPress</code> and the bubble closes the moment the control is pressed and stays closed until the finger leaves. On a phone a tap is also the hover, so without this the explanation lingers over the result.
                        </li>
                        <li>
                            <strong>It can also open on press.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tooltipOpenOnClick</code> opens the bubble only on click and closes it after 1600ms by default. That is a brief notice rather than an explanation, though: to announce the outcome of a press, use a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="status"'}</code> region instead, the way <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">CopyButton</code> does.
                            <br />
                            The general design of buttons is covered by UIXHERO&rsquo;s button article.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
