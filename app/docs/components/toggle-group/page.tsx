"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { ToggleGroupDemo } from "@/components/demos/OrganismsDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { ToggleGroup, ToggleGroupItem, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { IconAlignCenter, IconAlignLeft, IconAlignRight, IconBold, IconItalic, IconUnderline } from "@tabler/icons-react";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

function GroupItem({
    value,
    label,
    disabledReason,
    variant,
    children,
    disabled,
}: {
    value: string;
    label: string;
    disabledReason?: string;
    variant?: "default" | "outline";
    children: React.ReactNode;
    disabled?: boolean;
}) {
    const item = (
        <ToggleGroupItem value={value} aria-label={label} disabled={disabled} variant={variant}>
            {children}
        </ToggleGroupItem>
    );

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className={disabled ? "inline-flex cursor-not-allowed" : "inline-flex"}>{item}</span>
            </TooltipTrigger>
            <TooltipContent>{disabled ? disabledReason : label}</TooltipContent>
        </Tooltip>
    );
}

function ToggleGroupStatePreview({
    type = "multiple",
    outline,
    disabled,
}: {
    type?: "single" | "multiple";
    outline?: boolean;
    disabled?: boolean;
}) {
    const { locale } = useLocale();
    const [singleValue, setSingleValue] = React.useState("left");
    const [multiValue, setMultiValue] = React.useState<string[]>(["bold"]);
    const variant = outline ? "outline" : "default";
    const disabledReason = locale === "ja" ? "権限がないため、この項目は変更できません。" : "You do not have permission to change this item.";

    if (type === "single") {
        return (
            <ToggleGroup type="single" value={singleValue} onValueChange={(value) => value && setSingleValue(value)} className="justify-start">
                <GroupItem value="left" label={locale === "ja" ? "左揃え" : "Align left"} disabledReason={disabledReason} variant={variant} disabled={disabled}>
                    <IconAlignLeft className="h-4 w-4" />
                </GroupItem>
                <GroupItem value="center" label={locale === "ja" ? "中央揃え" : "Align center"} disabledReason={disabledReason} variant={variant} disabled={disabled}>
                    <IconAlignCenter className="h-4 w-4" />
                </GroupItem>
                <GroupItem value="right" label={locale === "ja" ? "右揃え" : "Align right"} disabledReason={disabledReason} variant={variant} disabled={disabled}>
                    <IconAlignRight className="h-4 w-4" />
                </GroupItem>
            </ToggleGroup>
        );
    }

    return (
        <ToggleGroup type="multiple" value={multiValue} onValueChange={setMultiValue} className="justify-start">
            <GroupItem value="bold" label={locale === "ja" ? "太字" : "Bold"} disabledReason={disabledReason} variant={variant} disabled={disabled}>
                <IconBold className="h-4 w-4" />
            </GroupItem>
            <GroupItem value="italic" label={locale === "ja" ? "斜体" : "Italic"} disabledReason={disabledReason} variant={variant} disabled={disabled}>
                <IconItalic className="h-4 w-4" />
            </GroupItem>
            <GroupItem value="underline" label={locale === "ja" ? "下線" : "Underline"} disabledReason={disabledReason} variant={variant} disabled={disabled}>
                <IconUnderline className="h-4 w-4" />
            </GroupItem>
        </ToggleGroup>
    );
}

export default function ToggleGroupPage() {
    const { locale, sectionLabels } = useLocale();
    const code = locale === "ja"
        ? `import { ToggleGroup, ToggleGroupItem } from "@gunjo/ui";
import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react";

export function ToggleGroupDemo() {
  return (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="太字">
        <IconBold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="斜体">
        <IconItalic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="下線">
        <IconUnderline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}`
        : `import { ToggleGroup, ToggleGroupItem } from "@gunjo/ui";
import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react";

export function ToggleGroupDemo() {
  return (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <IconBold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <IconItalic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <IconUnderline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}`;
    const usageCode = locale === "ja"
        ? `import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@gunjo/ui";

export function AlignControl() {
  const [value, setValue] = React.useState("left");

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => next && setValue(next)}
    >
      <ToggleGroupItem value="left">左</ToggleGroupItem>
      <ToggleGroupItem value="center">中央</ToggleGroupItem>
      <ToggleGroupItem value="right">右</ToggleGroupItem>
    </ToggleGroup>
  );
}`
        : `import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@gunjo/ui";

export function AlignControl() {
  const [value, setValue] = React.useState("left");

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => next && setValue(next)}
    >
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  );
}`;
    const propsData = [
        { name: "type", type: "'single' | 'multiple'", description: locale === "ja" ? "単一選択か複数選択かを指定します。" : "Controls whether one or multiple items can be active." },
        { name: "value / defaultValue", type: "string | string[]", description: locale === "ja" ? "選択中の値です。type に応じて型が変わります。" : "Current value. Shape depends on the `type`." },
        { name: "onValueChange", type: "(value: string | string[]) => void", description: locale === "ja" ? "選択状態が変わった時に呼ばれます。" : "Called when selection changes." },
        { name: "disabled", type: "boolean", default: "false", description: locale === "ja" ? "グループ全体、または項目ごとに操作を無効化します。理由が必要な場合はツールチップで補足します。" : "Disables the group or individual items. Explain the reason with a tooltip when needed." },
        { name: "variant", type: "'default' | 'outline'", default: "'default'", description: locale === "ja" ? "各項目の見た目です。枠線を見せたい時は outline を使います。" : "Visual variant for each ToggleGroupItem." },
        { name: "size", type: "'default' | 'sm' | 'lg'", default: "'default'", description: locale === "ja" ? "各 ToggleGroupItem のサイズです。" : "Size for each ToggleGroupItem." },
        { name: "ToggleGroupItem.tone", type: "'default' | 'info' | 'success' | 'warning' | 'destructive'", default: "'default'", description: locale === "ja" ? "選択中の色を項目ごとに指定します（状態セグメント：休講→destructive、補講→info、通常→default など）。default は primary。(#288)" : "Per-item selected-state color (status segments: 休講→destructive, 補講→info, 通常→default). default = primary. (#288)" },
    ];

    return (
        <ComponentLayout
            title={(inputsMetadata as Record<string, { title: string }>).toggleGroup.title}
            description={(inputsMetadata as Record<string, { description: string }>).toggleGroup.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "ToggleGroup", href: "/docs/components/toggle-group" },
                { name: "ToggleGroupItem", href: "/docs/components/toggle-group" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "Toggle", href: "/docs/components/toggle" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "Button", href: "/docs/components/button" },
            ]}
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: トグルグループ（Toggle Group）" : "UIXHERO: Toggle Group (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/toggle-group`,
                },
            ]}
        >
            <ComponentPreview embedSrc="/embed/toggle-group" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels}>
                <ToggleGroupDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "multiple",
                            title: locale === "ja" ? "複数選択" : "Multiple selection",
                            description: locale === "ja" ? "書式設定のように、複数の状態を同時にオンにできます。" : "Use when multiple options can be active at once.",
                            preview: <ToggleGroupStatePreview />,
                            previewHeight: 150,
                            code,
                        },
                        {
                            key: "single",
                            title: locale === "ja" ? "単一選択" : "Single selection",
                            description: locale === "ja" ? "配置や表示モードなど、1つだけ選ぶ操作に使います。" : "Use for mutually exclusive choices such as alignment.",
                            preview: <ToggleGroupStatePreview type="single" />,
                            previewHeight: 150,
                            code: `import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@gunjo/ui";

export function AlignControl() {
  const [value, setValue] = React.useState("left");

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => next && setValue(next)}
    >
      <ToggleGroupItem value="left">左</ToggleGroupItem>
      <ToggleGroupItem value="center">中央</ToggleGroupItem>
      <ToggleGroupItem value="right">右</ToggleGroupItem>
    </ToggleGroup>
  );
}`,
                        },
                        {
                            key: "outline",
                            title: locale === "ja" ? "アウトライン" : "Outline",
                            description: locale === "ja" ? "ツールバー内でボタン境界を見せたい場合に使います。" : "Use when toolbar item boundaries should be visible.",
                            preview: <ToggleGroupStatePreview outline />,
                            previewHeight: 150,
                            code: `import { ToggleGroup, ToggleGroupItem } from "@gunjo/ui";

export function OutlineToggleGroup() {
  return (
    <ToggleGroup type="multiple">
      <ToggleGroupItem variant="outline" value="bold" />
    </ToggleGroup>
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "一時的に操作できない項目はボタンの形を保ち、ツールチップで理由を補足します。" : "Disabled items keep their button shape and explain the reason with a tooltip.",
                            preview: <ToggleGroupStatePreview disabled />,
                            previewHeight: 150,
                            code: locale === "ja"
                                ? `import {
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gunjo/ui";

export function DisabledToggleGroupItem() {
  return (
    <ToggleGroup type="multiple">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-not-allowed">
            <ToggleGroupItem value="bold" disabled />
          </span>
        </TooltipTrigger>
        <TooltipContent>権限がないため、この項目は変更できません。</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  );
}`
                                : `import {
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gunjo/ui";

export function DisabledToggleGroupItem() {
  return (
    <ToggleGroup type="multiple">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-not-allowed">
            <ToggleGroupItem value="bold" disabled />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          You do not have permission to change this item.
        </TooltipContent>
      </Tooltip>
    </ToggleGroup>
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
                            <strong>「全部は外せない」を、既定ではなく明示の指定にした。</strong>資料は「単一選択では、選ばれている項目をもう一度押しても外れないようにする」を挙げています。GUNJO は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">disallowEmpty</code> を渡したときだけそうします（#170）。フィルターのように「0件は、すべて表示」が正しい画面もあり、どちらが正しいかは並べたものの意味で変わるからです。土台の Radix が空の値を返してきたときに、それを捨てる形で作ってあります。
                        </li>
                        <li>
                            <strong>選ばれたときの色を、項目ごとに変えられる。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tone</code> に注意や成功や警告や破壊を渡すと、その項目が選ばれたときだけ淡い色に変わります（#288）。休講と補講と通常のように、選択肢そのものが意味を持つ切り替えのためです。色は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Badge</code> や <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Alert</code> と同じ淡い色の組み合わせなので、文字とのコントラストは揃っています。
                        </li>
                        <li>
                            <strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">variant</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">size</code> は親に1回書けば足りる。</strong>文脈で子に配り、項目ごとの上書きもできます。資料が求める <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">role</code> の付与と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-pressed</code> は土台の Radix が持つので、こちらは目的を伝える <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code> を親に渡すだけで済みます。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Not-empty is opt-in, not the default.</strong> The article asks that a single-select group refuse to clear itself when the active item is pressed again. GUNJO does that only when <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">disallowEmpty</code> is passed (#170), because a filter row where zero selected means show everything is equally valid, and which reading is right depends on what the items mean. It is implemented by discarding the empty value Radix reports.
                        </li>
                        <li>
                            <strong>The selected colour can differ per item.</strong> Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tone</code> as info, success, warning or destructive and that item tints only while selected (#288). This is for controls where the options themselves carry meaning, such as cancelled, make-up and normal class states. The tones reuse the same subtle pairs as <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Badge</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Alert</code>, so the text contrast is already settled.
                        </li>
                        <li>
                            <strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">variant</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">size</code> are written once on the parent.</strong> They travel to the items through context and each item can still override. The group role and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-pressed</code> the article requires come from Radix, which leaves only the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code> naming the purpose of the group to pass in.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
