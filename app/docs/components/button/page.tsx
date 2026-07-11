"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import inputsMetadata from "@design/inputs-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { IconDeviceFloppy as Save, IconTrash as Trash2 } from "@tabler/icons-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import { getCategoryVariantUnionType } from "@/lib/docs-spec";

type ButtonVariant =
    | "default"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "destructive"
    | "ghost"
    | "link"
    | "outline"
    | "secondary";

function ButtonVariantSummary({ locale }: { locale: "en" | "ja" }) {
    const variants: Array<{
        key: ButtonVariant;
        description: string;
        label: string;
    }> = [
        {
            key: "default",
            label: locale === "ja" ? "標準操作" : "Default action",
            description:
                locale === "ja"
                    ? "既定の強い操作。互換性のため前景色ベースの黒いボタンとして維持します。"
                    : "The default strong action. Kept foreground-based for compatibility.",
        },
        {
            key: "primary",
            label: locale === "ja" ? "主要操作" : "Primary action",
            description:
                locale === "ja"
                    ? "ブランドカラーを使う主要 CTA。保存、公開、続行など画面の主操作に使います。"
                    : "Brand-colored CTA for save, publish, continue, and other primary flows.",
        },
        {
            key: "info",
            label: locale === "ja" ? "情報操作" : "Info action",
            description:
                locale === "ja"
                    ? "詳細確認や補足情報へ誘導する操作。成功や警告ではない中立的な通知操作に使います。"
                    : "For informational actions that lead to details or supporting context.",
        },
        {
            key: "success",
            label: locale === "ja" ? "完了操作" : "Success action",
            description:
                locale === "ja"
                    ? "完了、承認、接続済みなど、肯定的な結果を明示する操作に使います。"
                    : "For completion, approval, connected, or positive-result actions.",
        },
        {
            key: "warning",
            label: locale === "ja" ? "注意操作" : "Warning action",
            description:
                locale === "ja"
                    ? "注意が必要な継続操作や、破壊的ではない確認操作に使います。"
                    : "For cautionary continuation or confirmation that is not destructive.",
        },
        {
            key: "secondary",
            label: locale === "ja" ? "補助操作" : "Secondary action",
            description:
                locale === "ja"
                    ? "主要操作ほど強くない補助的な操作。並列の選択肢や軽い導線に使います。"
                    : "A supporting action that should not compete with the primary action.",
        },
        {
            key: "outline",
            label: locale === "ja" ? "中立操作" : "Neutral action",
            description:
                locale === "ja"
                    ? "フォームのキャンセルやダイアログ起動など、境界を持たせたい中立操作に使います。"
                    : "A neutral action with a visible boundary, commonly used for cancel or launch actions.",
        },
        {
            key: "ghost",
            label: locale === "ja" ? "低強度操作" : "Low-emphasis action",
            description:
                locale === "ja"
                    ? "ツールバーやリスト行など、背景に溶け込ませたい操作に使います。"
                    : "Low-emphasis action for toolbars, rows, and dense control surfaces.",
        },
        {
            key: "link",
            label: locale === "ja" ? "テキスト導線" : "Text navigation",
            description:
                locale === "ja"
                    ? "通常のボタンよりリンクとして読ませたい遷移や補足操作に使います。"
                    : "For navigation or supporting actions that should read like text links.",
        },
        {
            key: "destructive",
            label: locale === "ja" ? "破壊的操作" : "Destructive action",
            description:
                locale === "ja"
                    ? "削除や取り消せない処理など、注意を促す必要がある操作に使います。"
                    : "For deletion or irreversible actions that need explicit visual caution.",
        },
    ];

    return (
        <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-3">
            {variants.map((variant) => (
                <div
                    key={variant.key}
                    className="grid gap-3 rounded-md bg-background p-3 sm:grid-cols-[8rem_minmax(10rem,auto)_minmax(0,1fr)] sm:items-center"
                >
                    <code className="text-xs font-semibold text-muted-foreground">
                        {variant.key}
                    </code>
                    <Button
                        variant={variant.key}
                        className="w-40 justify-center justify-self-start"
                    >
                        {variant.label}
                    </Button>
                    <p className="text-xs leading-relaxed text-muted-foreground sm:pl-1">
                        {variant.description}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default function ButtonPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/button", locale);
    const title = content?.title ?? (inputsMetadata as Record<string, { title: string }>).button.title;
    const description = content?.description ?? (inputsMetadata as Record<string, { description: string }>).button.description;
    const variantType = getCategoryVariantUnionType("inputs", "button");

    const usageCode = locale === "ja"
        ? `import { Button } from "@gunjo/ui"

export function Example() {
  return <Button variant="primary" onClick={() => console.log("click")}>保存する</Button>
}`
        : `import { Button } from "@gunjo/ui"

export function Example() {
  return <Button variant="primary" onClick={() => console.log("click")}>Click me</Button>
}`;

    const propsData = [
        {
            name: "variant",
            type: variantType,
            default: '"default"',
            description: locale === "ja" ? "ボタンの視覚的な種類を指定します。" : "The visual style of the button.",
        },
        {
            name: "size",
            type: '"xs" | "sm" | "default" | "lg" | "xl" | "touch" | "icon" | "icon-touch"',
            default: '"default"',
            description: locale === "ja"
                ? "ボタンのサイズを指定します。touch は 44px のタップ標的（モバイル/toC 向け・WCAG 2.5.5）で、標準の余白のまま高さだけ確保します。icon-touch はそのアイコン専用版（44×44px）です。"
                : "The size of the button. Use touch for a 44px tap target (mobile / consumer, WCAG 2.5.5) at default density, and icon-touch for its 44×44px icon-only twin.",
        },
        {
            name: "loading",
            type: "boolean",
            default: "false",
            description: locale === "ja"
                ? "処理中状態。Spinner を表示し、ボタンを無効化して aria-busy を設定します（ラベルは残るため幅が安定）。asChild 時は無視されます。"
                : "Async pending state — shows a Spinner, disables the button, and sets aria-busy (label stays, width stable). Ignored when asChild is set.",
        },
        {
            name: "asChild",
            type: "boolean",
            default: "false",
            description: locale === "ja" ? "直下の子要素へ、ボタンの見た目と操作属性を合成します。" : "Merges props onto the immediate child.",
        },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Button", href: "/docs/components/button" },
            ]}
            relatedComponents={[
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "FilterButton", href: "/docs/components/filter-button" },
                { name: "Command", href: "/docs/components/command" },
                { name: "Dialog", href: "/docs/components/dialog" },
            ]}
        >
            <ComponentPreview
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
            >
                <Button variant="primary">{locale === "ja" ? "保存する" : "Click me"}</Button>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "ボタンは見た目の種類と実用状態の両方を持ちます。まず種類ごとの意味を 1 行ずつ確認し、その後に読み込み中、無効化、アイコンのみなどの状態を確認します。"
                        : "Button has both visual variants and practical states. Review each variant as a single row, then scan common states such as loading, disabled, and icon-only usage."}
                </p>
                <ButtonVariantSummary locale={locale} />
                <div className="space-y-1 pt-2">
                    <h3 className="text-xl font-semibold tracking-tight">
                        {locale === "ja" ? "実用状態" : "Practical states"}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {locale === "ja"
                            ? "状態は見た目の種類だけでは表現できない、実装時のふるまいを確認するために並べます。"
                            : "States capture implementation behavior that cannot be explained by the variant prop alone."}
                    </p>
                </div>
                <ComponentDemoStates
                    states={[
                        {
                            key: "sizes",
                            title: locale === "ja" ? "サイズ展開" : "Sizes",
                            description:
                                locale === "ja"
                                    ? "テキストボタンは xs / sm / default / lg / xl を使い分け、アイコンのみの操作は size=\"icon\" と aria-label を組み合わせます。モバイル/toC 画面では 44px のタップ標的（WCAG 2.5.5）を満たす size=\"touch\"（アイコンは size=\"icon-touch\"）を使います。"
                                    : "Use xs / sm / default / lg / xl for text buttons, and pair icon-only actions with size=\"icon\" and an aria-label. On mobile / consumer screens use size=\"touch\" (or size=\"icon-touch\") to meet the 44px tap target (WCAG 2.5.5).",
                            preview: (
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button size="xs">{locale === "ja" ? "極小" : "X-small"}</Button>
                                    <Button size="sm">{locale === "ja" ? "小" : "Small"}</Button>
                                    <Button>{locale === "ja" ? "標準" : "Default"}</Button>
                                    <Button size="lg">{locale === "ja" ? "大" : "Large"}</Button>
                                    <Button size="xl">{locale === "ja" ? "特大" : "X-large"}</Button>
                                    <Button size="touch">{locale === "ja" ? "タップ (44px)" : "Touch (44px)"}</Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        aria-label={locale === "ja" ? "保存" : "Save"}
                                    >
                                        <Save className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon-touch"
                                        variant="outline"
                                        aria-label={locale === "ja" ? "保存（タップ標的 44px）" : "Save (44px tap target)"}
                                    >
                                        <Save className="h-4 w-4" />
                                    </Button>
                                </div>
                            ),
                            code: locale === "ja"
                                ? `import { Button } from "@gunjo/ui";
import { IconDeviceFloppy as Save } from "@tabler/icons-react";

export default function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">極小</Button>
      <Button size="sm">小</Button>
      <Button>標準</Button>
      <Button size="lg">大</Button>
      <Button size="xl">特大</Button>
      <Button size="touch">タップ (44px)</Button>
      <Button size="icon" variant="outline" aria-label="保存">
        <Save className="h-4 w-4" />
      </Button>
      <Button size="icon-touch" variant="outline" aria-label="保存（タップ標的 44px）">
        <Save className="h-4 w-4" />
      </Button>
    </div>
  );
}`
                                : `import { Button } from "@gunjo/ui";
import { IconDeviceFloppy as Save } from "@tabler/icons-react";

export default function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">X-small</Button>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">X-large</Button>
      <Button size="touch">Touch (44px)</Button>
      <Button size="icon" variant="outline" aria-label="Save">
        <Save className="h-4 w-4" />
      </Button>
      <Button size="icon-touch" variant="outline" aria-label="Save (44px tap target)">
        <Save className="h-4 w-4" />
      </Button>
    </div>
  );
}`,
                        },
                        {
                            key: "loading",
                            title: locale === "ja" ? "処理中" : "Loading",
                            description:
                                locale === "ja"
                                    ? "処理中は loading を渡すだけで、Spinner 表示・disabled・aria-busy がまとめて有効になります（ラベルは残り幅が安定）。"
                                    : "Pass loading — it shows the Spinner, disables the button, and sets aria-busy (the label stays, so the width is stable).",
                            preview: (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="inline-flex" tabIndex={0}>
                                            <Button loading>
                                                {locale === "ja" ? "保存中..." : "Saving..."}
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {locale === "ja" ? "保存処理が完了するまで操作できません。" : "This action is unavailable until saving finishes."}
                                    </TooltipContent>
                                </Tooltip>
                            ),
                            code: locale === "ja"
                                ? `import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export default function SavingButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex" tabIndex={0}>
          <Button loading>保存中...</Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>保存処理が完了するまで操作できません。</TooltipContent>
    </Tooltip>
  );
}`
                                : `import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export default function SavingButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex" tabIndex={0}>
          <Button loading>Saving...</Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>This action is unavailable until saving finishes.</TooltipContent>
    </Tooltip>
  );
}`,
                        },
                        {
                            key: "destructive-with-icon",
                            title:
                                locale === "ja"
                                    ? "破壊的アクション + アイコン"
                                    : "Destructive with icon",
                            description:
                                locale === "ja"
                                    ? "削除など取り戻せない操作では、破壊的な見た目とアイコンで意図を強調します。"
                                    : "Irreversible actions. Pair `destructive` with a leading icon to underline intent.",
                            preview: (
                                <Button variant="destructive" className="gap-2">
                                    <Trash2 className="h-4 w-4" />
                                    {locale === "ja" ? "アカウントを削除" : "Delete account"}
                                </Button>
                            ),
                            code: locale === "ja"
                                ? `import { Button } from "@gunjo/ui";
import { IconTrash as Trash2 } from "@tabler/icons-react";

export default function DeleteButton() {
  return (
    <Button variant="destructive" className="gap-2">
      <Trash2 className="h-4 w-4" />
      アカウントを削除
    </Button>
  );
}`
                                : `import { Button } from "@gunjo/ui";
import { IconTrash as Trash2 } from "@tabler/icons-react";

export default function DeleteButton() {
  return (
    <Button variant="destructive" className="gap-2">
      <Trash2 className="h-4 w-4" />
      Delete account
    </Button>
  );
}`,
                        },
                        {
                            key: "with-tooltip",
                            title:
                                locale === "ja"
                                    ? "ツールチップと組み合わせ"
                                    : "Composed with Tooltip",
                            description:
                                locale === "ja"
                                    ? "アイコンのみのボタンには必ずホバー時の説明を。"
                                    : "Always pair icon-only buttons with a Tooltip describing the action.",
                            preview: (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            aria-label={locale === "ja" ? "変更を保存" : "Save changes"}
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{locale === "ja" ? "変更を保存" : "Save changes"}</TooltipContent>
                                </Tooltip>
                            ),
                            code: locale === "ja"
                                ? `import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { IconDeviceFloppy as Save } from "@tabler/icons-react";

export default function SaveIconButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="outline" aria-label="変更を保存">
          <Save className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>変更を保存</TooltipContent>
    </Tooltip>
  );
}`
                                : `import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { IconDeviceFloppy as Save } from "@tabler/icons-react";

export default function SaveIconButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="outline" aria-label="Save changes">
          <Save className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Save changes</TooltipContent>
    </Tooltip>
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description:
                                locale === "ja"
                                    ? "条件を満たさない時は操作できない状態にし、ホバーやフォーカスで理由を伝えます。"
                                    : "When prerequisites are not met, disable the button and explain the reason on hover or focus.",
                            preview: (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="inline-flex" tabIndex={0}>
                                            <Button disabled>{locale === "ja" ? "送信" : "Submit"}</Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {locale === "ja" ? "必須項目を入力すると送信できます。" : "Complete the required fields to submit."}
                                    </TooltipContent>
                                </Tooltip>
                            ),
                            code: locale === "ja"
                                ? `import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export default function SubmitButton({ ready }: { ready: boolean }) {
  if (ready) {
    return <Button>送信</Button>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex" tabIndex={0}>
          <Button disabled>送信</Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>必須項目を入力すると送信できます。</TooltipContent>
    </Tooltip>
  );
}`
                                : `import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export default function SubmitButton({ ready }: { ready: boolean }) {
  if (ready) {
    return <Button>Submit</Button>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex" tabIndex={0}>
          <Button disabled>Submit</Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>Complete the required fields to submit.</TooltipContent>
    </Tooltip>
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={usageCode} />
                </div>
            </div>
        </ComponentLayout>
    );
}
