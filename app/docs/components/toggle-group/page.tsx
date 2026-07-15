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
    const code = `import { ToggleGroup, ToggleGroupItem } from "@gunjo/ui";
import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react";

export function ToggleGroupDemo() {
  return (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="${locale === "ja" ? "太字" : "Bold"}">
        <IconBold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="${locale === "ja" ? "斜体" : "Italic"}">
        <IconItalic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="${locale === "ja" ? "下線" : "Underline"}">
        <IconUnderline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}`;
    const usageCode = `import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@gunjo/ui";

export function AlignControl() {
  const [value, setValue] = React.useState("left");

  return (
    <ToggleGroup type="single" value={value} onValueChange={(next) => next && setValue(next)}>
      <ToggleGroupItem value="left">${locale === "ja" ? "左" : "Left"}</ToggleGroupItem>
      <ToggleGroupItem value="center">${locale === "ja" ? "中央" : "Center"}</ToggleGroupItem>
      <ToggleGroupItem value="right">${locale === "ja" ? "右" : "Right"}</ToggleGroupItem>
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
                            code: `<ToggleGroup type="single" value={value} onValueChange={setValue}>...</ToggleGroup>`,
                        },
                        {
                            key: "outline",
                            title: locale === "ja" ? "アウトライン" : "Outline",
                            description: locale === "ja" ? "ツールバー内でボタン境界を見せたい場合に使います。" : "Use when toolbar item boundaries should be visible.",
                            preview: <ToggleGroupStatePreview outline />,
                            previewHeight: 150,
                            code: `<ToggleGroupItem variant="outline" value="bold" />`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "一時的に操作できない項目はボタンの形を保ち、ツールチップで理由を補足します。" : "Disabled items keep their button shape and explain the reason with a tooltip.",
                            preview: <ToggleGroupStatePreview disabled />,
                            previewHeight: 150,
                            code: `<Tooltip>
  <TooltipTrigger asChild>
    <span className="inline-flex cursor-not-allowed">
      <ToggleGroupItem value="bold" disabled />
    </span>
  </TooltipTrigger>
  <TooltipContent>${locale === "ja" ? "権限がないため、この項目は変更できません。" : "You do not have permission to change this item."}</TooltipContent>
</Tooltip>`,
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
