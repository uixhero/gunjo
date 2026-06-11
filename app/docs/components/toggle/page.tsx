"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { ToggleDemo } from "@/components/demos/ToggleDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { Toggle, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react";

function TooltippedToggle({
    label,
    disabledReason,
    pressed,
    disabled,
    variant,
    size,
    children,
}: {
    label: string;
    disabledReason?: string;
    pressed?: boolean;
    disabled?: boolean;
    variant?: "default" | "outline";
    size?: "default" | "sm" | "lg";
    children: React.ReactNode;
}) {
    const toggle = (
        <Toggle aria-label={label} defaultPressed={pressed} disabled={disabled} variant={variant} size={size}>
            {children}
        </Toggle>
    );

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className={disabled ? "inline-flex cursor-not-allowed" : "inline-flex"}>{toggle}</span>
            </TooltipTrigger>
            <TooltipContent>{disabled ? disabledReason : label}</TooltipContent>
        </Tooltip>
    );
}

function ToggleStatePreview({ disabled, outline, pressed }: { disabled?: boolean; outline?: boolean; pressed?: boolean }) {
    const { locale } = useLocale();
    const disabledReason = locale === "ja" ? "公開済みの設定では変更できません。" : "This setting cannot be changed after publishing.";

    return (
        <div className="flex flex-wrap items-center gap-2">
            <TooltippedToggle
                label={locale === "ja" ? "太字を切り替え" : "Toggle bold"}
                disabledReason={disabledReason}
                pressed={pressed}
                disabled={disabled}
                variant={outline ? "outline" : "default"}
            >
                <IconBold className="h-4 w-4" />
            </TooltippedToggle>
            <TooltippedToggle
                label={locale === "ja" ? "斜体を切り替え" : "Toggle italic"}
                disabledReason={disabledReason}
                disabled={disabled}
                variant={outline ? "outline" : "default"}
            >
                <IconItalic className="h-4 w-4" />
            </TooltippedToggle>
            <TooltippedToggle
                label={locale === "ja" ? "下線を切り替え" : "Toggle underline"}
                disabledReason={disabledReason}
                pressed
                disabled={disabled}
                variant={outline ? "outline" : "default"}
            >
                <IconUnderline className="h-4 w-4" />
            </TooltippedToggle>
        </div>
    );
}

function ToggleSizePreview() {
    const { locale } = useLocale();

    return (
        <div className="flex flex-wrap items-center gap-3">
            <TooltippedToggle label={locale === "ja" ? "小さいサイズ" : "Small size"} size="sm" pressed>
                SM
            </TooltippedToggle>
            <TooltippedToggle label={locale === "ja" ? "標準サイズ" : "Default size"} pressed>
                DF
            </TooltippedToggle>
            <TooltippedToggle label={locale === "ja" ? "大きいサイズ" : "Large size"} size="lg" pressed>
                LG
            </TooltippedToggle>
        </div>
    );
}

export default function TogglePage() {
    const { locale, sectionLabels } = useLocale();
    const code = `import { Toggle, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { IconBold } from "@tabler/icons-react";

export function ToggleDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle aria-label="${locale === "ja" ? "太字を切り替え" : "Toggle bold"}">
          <IconBold className="h-4 w-4" />
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>${locale === "ja" ? "太字を切り替え" : "Toggle bold"}</TooltipContent>
    </Tooltip>
  );
}`;
    const usageCode = `import { Toggle } from "@gunjo/ui";
import { IconBold } from "@tabler/icons-react";

<Toggle aria-label="${locale === "ja" ? "太字を切り替え" : "Toggle bold"}">
  <IconBold className="h-4 w-4" />
</Toggle>`;
    const propsData = [
        { name: "variant", type: "'default' | 'outline'", default: "'default'", description: locale === "ja" ? "見た目の種類です。枠線を見せたい時は outline を使います。" : "Visual variant. Outline adds a border." },
        { name: "size", type: "'default' | 'sm' | 'lg'", default: "'default'", description: locale === "ja" ? "トグルボタンのサイズです。" : "Toggle button size." },
        { name: "pressed / defaultPressed", type: "boolean", description: locale === "ja" ? "オン状態を制御、または初期値として指定します。" : "Controlled pressed state or initial uncontrolled state." },
        { name: "onPressedChange", type: "(pressed: boolean) => void", description: locale === "ja" ? "オン/オフが変わった時に呼ばれます。" : "Called when pressed state changes." },
        { name: "disabled", type: "boolean", default: "false", description: locale === "ja" ? "操作できない状態にします。理由が必要な場合はツールチップで補足します。" : "Disables interaction. Explain the reason with a tooltip when needed." },
        { name: "aria-label", type: "string", description: locale === "ja" ? "アイコンだけのトグルには必ず操作名を付けます。" : "Required for icon-only toggles." },
    ];

    return (
        <ComponentLayout
            title={(inputsMetadata as Record<string, { title: string }>).toggle.title}
            description={(inputsMetadata as Record<string, { description: string }>).toggle.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Toggle", href: "/docs/components/toggle" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "ToggleGroup", href: "/docs/components/toggle-group" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "Button", href: "/docs/components/button" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/toggle" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels}>
                <ToggleDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default",
                            title: locale === "ja" ? "標準" : "Default",
                            description: locale === "ja" ? "単体のオン/オフ操作に使います。アイコンだけならツールチップを併用します。" : "Use for a single on/off action. Pair icon-only toggles with a tooltip.",
                            preview: <ToggleStatePreview />,
                            previewHeight: 150,
                            code,
                        },
                        {
                            key: "pressed",
                            title: locale === "ja" ? "選択中" : "Pressed",
                            description: locale === "ja" ? "選択中は背景色と文字色を反転し、オンになっていることを明確に示します。" : "The pressed state inverts the background and text color.",
                            preview: <ToggleStatePreview pressed />,
                            previewHeight: 150,
                            code: `<Toggle defaultPressed aria-label="${locale === "ja" ? "太字を切り替え" : "Toggle bold"}" />`,
                        },
                        {
                            key: "outline",
                            title: locale === "ja" ? "アウトライン" : "Outline",
                            description: locale === "ja" ? "ツールバー上で境界を見せたい場合に使います。" : "Use when the toolbar needs visible button boundaries.",
                            preview: <ToggleStatePreview outline />,
                            previewHeight: 150,
                            code: `<Toggle variant="outline" aria-label="${locale === "ja" ? "太字を切り替え" : "Toggle bold"}" />`,
                        },
                        {
                            key: "size",
                            title: locale === "ja" ? "サイズ" : "Sizes",
                            description: locale === "ja" ? "配置するツールバーや密度に合わせて、sm / default / lg を使い分けます。" : "Use sm, default, and lg according to toolbar density and available space.",
                            preview: <ToggleSizePreview />,
                            previewHeight: 150,
                            code: `<Toggle size="sm" defaultPressed aria-label="${locale === "ja" ? "小さいサイズ" : "Small size"}">SM</Toggle>
<Toggle defaultPressed aria-label="${locale === "ja" ? "標準サイズ" : "Default size"}">DF</Toggle>
<Toggle size="lg" defaultPressed aria-label="${locale === "ja" ? "大きいサイズ" : "Large size"}">LG</Toggle>`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "操作できない状態でもボタンの形は保ち、ツールチップで理由を補足します。" : "Disabled toggles keep their button shape and explain the reason with a tooltip.",
                            preview: <ToggleStatePreview disabled />,
                            previewHeight: 150,
                            code: `<Tooltip>
  <TooltipTrigger asChild>
    <span className="inline-flex cursor-not-allowed">
      <Toggle disabled aria-label="${locale === "ja" ? "太字を切り替え" : "Toggle bold"}" />
    </span>
  </TooltipTrigger>
  <TooltipContent>${locale === "ja" ? "公開済みの設定では変更できません。" : "This setting cannot be changed after publishing."}</TooltipContent>
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
