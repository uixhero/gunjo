"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import feedbackMetadata from "@design/feedback-metadata.json";
import { Button, Spinner, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

const codeByLocale = {
    ja: `import { Spinner } from "@gunjo/ui"

export function LoadingSpinner() {
  return <Spinner size="lg" aria-label="読み込み中" />
}`,
    en: `import { Spinner } from "@gunjo/ui"

export function LoadingSpinner() {
  return <Spinner size="lg" aria-label="Loading" />
}`,
};

const sizesCodeByLocale = {
    ja: `import { Spinner } from "@gunjo/ui"

export function SpinnerSizes() {
  return (
    <div className="flex items-center gap-4">
      <Spinner size="sm" aria-label="小さい読み込み表示" />
      <Spinner aria-label="読み込み中" />
      <Spinner size="lg" aria-label="大きい読み込み表示" />
    </div>
  )
}`,
    en: `import { Spinner } from "@gunjo/ui"

export function SpinnerSizes() {
  return (
    <div className="flex items-center gap-4">
      <Spinner size="sm" aria-label="Small loading indicator" />
      <Spinner aria-label="Loading" />
      <Spinner size="lg" aria-label="Large loading indicator" />
    </div>
  )
}`,
};

const buttonCodeByLocale = {
    ja: `import { Button, Spinner, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui"

export function SavingButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex" tabIndex={0}>
          <Button disabled className="gap-2">
            <Spinner size="sm" aria-hidden />
            保存中
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>保存処理が完了するまで操作できません。</TooltipContent>
    </Tooltip>
  )
}`,
    en: `import { Button, Spinner, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui"

export function SavingButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex" tabIndex={0}>
          <Button disabled className="gap-2">
            <Spinner size="sm" aria-hidden />
            Saving
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>This action is unavailable until saving finishes.</TooltipContent>
    </Tooltip>
  )
}`,
};

const blockingCodeByLocale = {
    ja: `import { Spinner } from "@gunjo/ui"

export function BlockingLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-40 w-full flex-col items-center justify-center gap-3 rounded-lg border bg-muted/40"
    >
      <Spinner size="lg" aria-hidden />
      <span className="text-sm text-muted-foreground">
        データを読み込んでいます。
      </span>
    </div>
  )
}`,
    en: `import { Spinner } from "@gunjo/ui"

export function BlockingLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-40 w-full flex-col items-center justify-center gap-3 rounded-lg border bg-muted/40"
    >
      <Spinner size="lg" aria-hidden />
      <span className="text-sm text-muted-foreground">
        Loading data.
      </span>
    </div>
  )
}`,
};

const inlineCodeByLocale = {
    ja: `import { Spinner } from "@gunjo/ui"

export function InlineRefreshing() {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner size="sm" aria-hidden />
      最新状態に更新しています。
    </span>
  )
}`,
    en: `import { Spinner } from "@gunjo/ui"

export function InlineRefreshing() {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner size="sm" aria-hidden />
      Refreshing the latest state.
    </span>
  )
}`,
};

export default function SpinnerPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const usageCode = codeByLocale[locale];

    const sizesCode = sizesCodeByLocale[locale];

    const buttonCode = buttonCodeByLocale[locale];

    const blockingCode = blockingCodeByLocale[locale];

    const inlineCode = inlineCodeByLocale[locale];

    const propsData = [
        {
            name: "size",
            type: "'default' | 'sm' | 'lg' | 'icon'",
            default: "'default'",
            description: isJa ? "スピナーの大きさです。ボタン内では sm、単独表示では default または lg を使います。" : "Spinner size. Use sm inside buttons, and default or lg for standalone loading states.",
        },
        {
            name: "className",
            type: "string",
            description: isJa ? "SVG に追加するクラスです。" : "Additional class names applied to the SVG element.",
        },
    ];

    return (
        <ComponentLayout
            title={feedbackMetadata.spinner.title}
            description={feedbackMetadata.spinner.description}
            usedComponents={[{ name: "Spinner", href: "/docs/components/spinner" }]}
            relatedComponents={[
                { name: "Button", href: "/docs/components/button" },
                { name: "Progress", href: "/docs/components/progress" },
                { name: "Skeleton", href: "/docs/components/skeleton" },
            ]}
            sectionLabels={sectionLabels}
        >
            <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} previewHeight="auto" previewBodyWidth="md" sectionLabels={sectionLabels}>
                <Spinner size="lg" aria-label={isJa ? "読み込み中" : "Loading"} />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "sizes",
                            title: isJa ? "サイズ" : "Sizes",
                            description: isJa ? "ボタン内、インライン、単独ローダーで使い分けます。" : "Choose a size for buttons, inline status, or standalone loaders.",
                            preview: (
                                <div className="flex items-center gap-4">
                                    <Spinner size="sm" aria-label={isJa ? "小さい読み込み表示" : "Small loading indicator"} />
                                    <Spinner aria-label={isJa ? "読み込み中" : "Loading"} />
                                    <Spinner size="lg" aria-label={isJa ? "大きい読み込み表示" : "Large loading indicator"} />
                                </div>
                            ),
                            code: sizesCode,
                        },
                        {
                            key: "button",
                            title: isJa ? "ボタン内の処理中" : "Inside a button",
                            description: isJa ? "送信や保存中はボタンを無効化し、表示ラベルと一緒に出します。" : "Disable the action and pair the spinner with visible text while a request is running.",
                            preview: (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="inline-flex" tabIndex={0}>
                                            <Button disabled className="gap-2">
                                                <Spinner size="sm" aria-hidden />
                                                {isJa ? "保存中" : "Saving"}
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isJa ? "保存処理が完了するまで操作できません。" : "This action is unavailable until saving finishes."}
                                    </TooltipContent>
                                </Tooltip>
                            ),
                            code: buttonCode,
                        },
                        {
                            key: "blocking",
                            title: isJa ? "領域全体の読み込み" : "Blocking loader",
                            description: isJa ? "操作を待たせる場合は、状態文と一緒に role=status の領域で伝えます。" : "For blocking states, announce the status text with role=status.",
                            preview: (
                                <div role="status" aria-live="polite" className="flex h-40 w-full flex-col items-center justify-center gap-3 rounded-lg border bg-muted/40">
                                    <Spinner size="lg" aria-hidden />
                                    <span className="text-sm text-muted-foreground">{isJa ? "データを読み込んでいます。" : "Loading data."}</span>
                                </div>
                            ),
                            previewBodyWidth: "lg",
                            code: blockingCode,
                        },
                        {
                            key: "inline",
                            title: isJa ? "テキスト横の状態表示" : "Inline status",
                            description: isJa ? "小さい更新状態は、スピナーだけにせず短い状態文を添えます。" : "Pair compact loading indicators with short status text.",
                            preview: (
                                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                    <Spinner size="sm" aria-hidden />
                                    {isJa ? "最新状態に更新しています。" : "Refreshing the latest state."}
                                </span>
                            ),
                            code: inlineCode,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
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
                            <strong>資料の核である「200ms待ってから出す」は部品に入れていません。</strong>資料は「200ms以内に終わる処理でスピナーを即座に出すと、一瞬光って画面が落ち着かない」を核に挙げています。GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Spinner</code> は渡されたら回るだけの絵で、遅らせる判断は呼ぶ側に残しました。待つべきかどうかは「その処理がどれくらいで終わるか」で決まり、絵の側からは分からないためです。
                        </li>
                        <li>
                            <strong>大きさは生成された3つと、それ以外の1つ。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">sm</code>（12px）と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">default</code>（16px）と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">lg</code>（24px）は設計の元データから生成された <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SpinnerVariantKey</code> です。加えて <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">icon</code> を渡すと40pxになります。資料の目安（ボタンの中は12から16px、区画の中は24から32px、ページ全体は48px以上）に照らすと、GUNJO の刻みは区画までで、ページ全体を覆う大きさは <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">className</code> で足すことになります。
                        </li>
                        <li>
                            <strong>色を決めずに、周りの薄い色を継ぐ。</strong>既定は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">text-muted-foreground</code> です。資料は「文脈の主色を使う」と書いていますが、GUNJO は主色を持たせず、置いた場所に馴染む薄い色から始めます。回っている絵は動きだけで十分に目を引くので、色でさらに引く必要がないためです。目立たせたい場面だけ <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">className</code> で上書きします。
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/spinner"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: スピナー（Spinner）
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>The 200ms delay, which the article calls the core, is not in the component.</strong> The article warns that showing a spinner immediately for work that finishes inside 200ms produces a flash that makes the UI feel unstable. GUNJO ships a spinner that simply spins when rendered, and leaves the delay to the caller, because whether to wait depends on how long the work takes and the graphic cannot know that.
                        </li>
                        <li>
                            <strong>Three generated sizes plus one more.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">sm</code> (12px), <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">default</code> (16px) and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">lg</code> (24px) come from <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SpinnerVariantKey</code>, generated from the design source; passing <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">icon</code> gives 40px. Against the article scale (12 to 16px inside a button, 24 to 32px inside a section, 48px and up for a full page), GUNJO stops at the section size and a page-covering spinner is added through <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">className</code>.
                        </li>
                        <li>
                            <strong>No colour of its own: it inherits the muted tone around it.</strong> The default is <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">text-muted-foreground</code>. The article suggests using the brand colour of the context; GUNJO starts from a muted tone that blends in, because a spinning shape already draws the eye through motion and does not need colour to draw more. Override with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">className</code> when it should stand out.
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/spinner"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: Spinner (in Japanese)
                            </a>
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
