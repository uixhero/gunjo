"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Button, DocNote, Spacer } from "@gunjo/ui";

const codeByLocale = {
    ja: `import { Button, Spacer } from "@gunjo/ui";

export function Toolbar() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline">戻る</Button>
      <Spacer axis="x" />
      <Button>保存</Button>
    </div>
  );
}`,
    en: `import { Button, Spacer } from "@gunjo/ui";

export function Toolbar() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline">Back</Button>
      <Spacer axis="x" />
      <Button>Save</Button>
    </div>
  );
}`,
} as const;

const verticalPushCodeByLocale = {
    ja: `import { Button, Spacer } from "@gunjo/ui";

export function PanelActions() {
  return (
    <div className="flex h-48 flex-col rounded-lg border p-4">
      <p className="text-sm font-medium">公開前チェック</p>
      <p className="text-sm text-muted-foreground">必要な項目を確認します。</p>
      <Spacer axis="y" />
      <Button>確認を開始</Button>
    </div>
  );
}`,
    en: `import { Button, Spacer } from "@gunjo/ui";

export function PanelActions() {
  return (
    <div className="flex h-48 flex-col rounded-lg border p-4">
      <p className="text-sm font-medium">Pre-publish checks</p>
      <p className="text-sm text-muted-foreground">Review the required items.</p>
      <Spacer axis="y" />
      <Button>Start review</Button>
    </div>
  );
}`,
} as const;

const fixedHorizontalCodeByLocale = {
    ja: `import { Spacer } from "@gunjo/ui";

export function FixedHorizontalGap() {
  return (
    <div className="flex items-center">
      <span>ラベル</span>
      <Spacer size={4} />
      <span>値</span>
    </div>
  );
}`,
    en: `import { Spacer } from "@gunjo/ui";

export function FixedHorizontalGap() {
  return (
    <div className="flex items-center">
      <span>Label</span>
      <Spacer size={4} />
      <span>Value</span>
    </div>
  );
}`,
} as const;

const fixedVerticalCodeByLocale = {
    ja: `import { Spacer } from "@gunjo/ui";

export function FixedVerticalGap() {
  return (
    <div className="flex flex-col">
      <span>見出し</span>
      <Spacer size={3} />
      <span className="text-muted-foreground">補足テキスト</span>
    </div>
  );
}`,
    en: `import { Spacer } from "@gunjo/ui";

export function FixedVerticalGap() {
  return (
    <div className="flex flex-col">
      <span>Heading</span>
      <Spacer size={3} />
      <span className="text-muted-foreground">Supporting text</span>
    </div>
  );
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "size", type: "1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 24", description: "固定サイズです。未指定の場合は flex の余白として残り幅や残り高さを埋めます。" },
        { name: "axis", type: "\"x\" | \"y\" | \"both\"", default: "\"both\"", description: "固定サイズ未指定時に、横方向か縦方向の余白として使う意図を示します。" },
        { name: "className", type: "string", description: "必要に応じて追加するクラスです。" },
    ],
    en: [
        { name: "size", type: "1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 24", description: "Fixed size. When omitted, Spacer fills the remaining width or height in a flex layout." },
        { name: "axis", type: "\"x\" | \"y\" | \"both\"", default: "\"both\"", description: "Intent for horizontal or vertical flexible space when no fixed size is set." },
        { name: "className", type: "string", description: "Optional class added to the root element." },
    ],
} as const;

export default function SpacerPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/spacer", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const code = codeByLocale[locale];

    return (
        <ComponentLayout
            title={content?.title ?? meta.spacer.title}
            description={content?.description ?? meta.spacer.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Spacer", href: "/docs/components/spacer" },
                { name: "Button", href: "/docs/components/button" },
                { name: "DocNote", href: "/docs/components/doc-note" },
            ]}
            relatedComponents={[
                { name: "Separator", href: "/docs/components/separator" },
                { name: "HStack", href: "/docs/components/h-stack" },
                { name: "VStack", href: "/docs/components/v-stack" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="md" previewHeight="auto">
                <div className="w-full space-y-3">
                    <div className="text-xs text-muted-foreground">
                        {locale === "ja" ? "Spacer が中央の残り幅を埋め、保存ボタンを右端へ寄せます。" : "Spacer fills the remaining width and pushes Save to the edge."}
                    </div>
                    <div className="flex w-full items-center gap-2 rounded-lg border p-3">
                        <Button variant="outline">{locale === "ja" ? "戻る" : "Back"}</Button>
                        <Spacer axis="x" />
                        <Button>{locale === "ja" ? "保存" : "Save"}</Button>
                    </div>
                </div>
            </ComponentPreview>

            <DocNote heading={locale === "ja" ? "Spacer の役割" : "What Spacer is for"}>
                {locale === "ja"
                    ? "Spacer は見た目を持たない余白要素です。主に flex レイアウトで、残り幅や残り高さを占有して要素を端へ押し出す場合に使います。単純に同じ間隔を並べるだけなら gap や Stack 系のコンポーネントを優先します。"
                    : "Spacer is an invisible spacing element. Use it mainly inside flex layouts to occupy the remaining width or height and push content to an edge. Prefer gap or stack components for repeated equal spacing."}
            </DocNote>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "push-horizontal",
                            title: locale === "ja" ? "横方向に押す" : "Push horizontally",
                            description: locale === "ja"
                                ? "ツールバーでは Spacer が残り幅を埋め、主要アクションを右端へ寄せます。"
                                : "In toolbars, Spacer fills remaining width and pushes the primary action to the far edge.",
                            preview: (
                                <div className="flex w-full max-w-md items-center gap-2 rounded-lg border p-3">
                                    <Button variant="outline">{locale === "ja" ? "戻る" : "Back"}</Button>
                                    <Spacer axis="x" />
                                    <Button>{locale === "ja" ? "保存" : "Save"}</Button>
                                </div>
                            ),
                            code,
                        },
                        {
                            key: "push-vertical",
                            title: locale === "ja" ? "縦方向に押す" : "Push vertically",
                            description: locale === "ja"
                                ? "高さが決まっているパネルでは Spacer が残り高さを埋め、アクションを下端へ寄せます。"
                                : "In fixed-height panels, Spacer fills remaining height and pushes actions to the bottom.",
                            preview: (
                                <div className="flex h-48 w-full max-w-sm flex-col rounded-lg border p-4">
                                    <p className="text-sm font-medium">{locale === "ja" ? "公開前チェック" : "Pre-publish checks"}</p>
                                    <p className="text-sm text-muted-foreground">{locale === "ja" ? "必要な項目を確認します。" : "Review the required items."}</p>
                                    <Spacer axis="y" />
                                    <Button>{locale === "ja" ? "確認を開始" : "Start review"}</Button>
                                </div>
                            ),
                            code: verticalPushCodeByLocale[locale],
                        },
                        {
                            key: "fixed-horizontal",
                            title: locale === "ja" ? "固定サイズ 横" : "Fixed horizontal size",
                            description: locale === "ja"
                                ? "短いラベルと値の間など、一定の余白だけ必要な場合は size を指定します。"
                                : "Use size when you only need a fixed amount of space between nearby items.",
                            preview: (
                                <div className="flex items-center text-sm">
                                    <span>{locale === "ja" ? "ラベル" : "Label"}</span>
                                    <Spacer size={4} />
                                    <span className="font-medium">{locale === "ja" ? "値" : "Value"}</span>
                                </div>
                            ),
                            code: fixedHorizontalCodeByLocale[locale],
                        },
                        {
                            key: "fixed-vertical",
                            title: locale === "ja" ? "固定サイズ 縦" : "Fixed vertical size",
                            description: locale === "ja"
                                ? "見出しと補足文の間など、縦方向に小さな余白だけ必要な場合にも size を使えます。"
                                : "Use size for small vertical gaps between a heading and supporting copy.",
                            preview: (
                                <div className="flex flex-col text-sm">
                                    <span className="font-medium">{locale === "ja" ? "見出し" : "Heading"}</span>
                                    <Spacer size={3} />
                                    <span className="text-muted-foreground">{locale === "ja" ? "補足テキスト" : "Supporting text"}</span>
                                </div>
                            ),
                            code: fixedVerticalCodeByLocale[locale],
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
