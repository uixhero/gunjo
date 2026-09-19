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
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

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
    const code = locale === "ja"
        ? `import { Toggle, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { IconBold } from "@tabler/icons-react";

export function ToggleDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle aria-label="太字を切り替え">
          <IconBold className="h-4 w-4" />
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>太字を切り替え</TooltipContent>
    </Tooltip>
  );
}`
        : `import { Toggle, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { IconBold } from "@tabler/icons-react";

export function ToggleDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle aria-label="Toggle bold">
          <IconBold className="h-4 w-4" />
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>Toggle bold</TooltipContent>
    </Tooltip>
  );
}`;
    const usageCode = locale === "ja"
        ? `import { Toggle } from "@gunjo/ui";
import { IconBold } from "@tabler/icons-react";

export function BoldToggle() {
  return (
    <Toggle aria-label="太字を切り替え">
      <IconBold className="h-4 w-4" />
    </Toggle>
  );
}`
        : `import { Toggle } from "@gunjo/ui";
import { IconBold } from "@tabler/icons-react";

export function BoldToggle() {
  return (
    <Toggle aria-label="Toggle bold">
      <IconBold className="h-4 w-4" />
    </Toggle>
  );
}`;
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
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: トグル（Toggle）" : "UIXHERO: Toggle (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/toggle`,
                },
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
                            code: locale === "ja"
                                ? `import { Toggle } from "@gunjo/ui";

export function PressedBoldToggle() {
  return (
    <Toggle defaultPressed aria-label="太字を切り替え" />
  );
}`
                                : `import { Toggle } from "@gunjo/ui";

export function PressedBoldToggle() {
  return (
    <Toggle defaultPressed aria-label="Toggle bold" />
  );
}`,
                        },
                        {
                            key: "outline",
                            title: locale === "ja" ? "アウトライン" : "Outline",
                            description: locale === "ja" ? "ツールバー上で境界を見せたい場合に使います。" : "Use when the toolbar needs visible button boundaries.",
                            preview: <ToggleStatePreview outline />,
                            previewHeight: 150,
                            code: locale === "ja"
                                ? `import { Toggle } from "@gunjo/ui";

export function OutlineBoldToggle() {
  return (
    <Toggle variant="outline" aria-label="太字を切り替え" />
  );
}`
                                : `import { Toggle } from "@gunjo/ui";

export function OutlineBoldToggle() {
  return (
    <Toggle variant="outline" aria-label="Toggle bold" />
  );
}`,
                        },
                        {
                            key: "size",
                            title: locale === "ja" ? "サイズ" : "Sizes",
                            description: locale === "ja" ? "配置するツールバーや密度に合わせて、sm / default / lg を使い分けます。" : "Use sm, default, and lg according to toolbar density and available space.",
                            preview: <ToggleSizePreview />,
                            previewHeight: 150,
                            code: locale === "ja"
                                ? `import { Toggle } from "@gunjo/ui";

export function ToggleSizes() {
  return (
    <div className="flex items-center gap-2">
      <Toggle size="sm" defaultPressed aria-label="小さいサイズ">SM</Toggle>
      <Toggle defaultPressed aria-label="標準サイズ">DF</Toggle>
      <Toggle size="lg" defaultPressed aria-label="大きいサイズ">LG</Toggle>
    </div>
  );
}`
                                : `import { Toggle } from "@gunjo/ui";

export function ToggleSizes() {
  return (
    <div className="flex items-center gap-2">
      <Toggle size="sm" defaultPressed aria-label="Small size">SM</Toggle>
      <Toggle defaultPressed aria-label="Default size">DF</Toggle>
      <Toggle size="lg" defaultPressed aria-label="Large size">LG</Toggle>
    </div>
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "操作できない状態でもボタンの形は保ち、ツールチップで理由を補足します。" : "Disabled toggles keep their button shape and explain the reason with a tooltip.",
                            preview: <ToggleStatePreview disabled />,
                            previewHeight: 150,
                            code: locale === "ja"
                                ? `import { Toggle, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export function DisabledBoldToggle() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-not-allowed">
          <Toggle disabled aria-label="太字を切り替え" />
        </span>
      </TooltipTrigger>
      <TooltipContent>公開済みの設定では変更できません。</TooltipContent>
    </Tooltip>
  );
}`
                                : `import { Toggle, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export function DisabledBoldToggle() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-not-allowed">
          <Toggle disabled aria-label="Toggle bold" />
        </span>
      </TooltipTrigger>
      <TooltipContent>This setting cannot be changed after publishing.</TooltipContent>
    </Tooltip>
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
                            <strong>入りは色だけでなく、地と字の両方を入れ替える。</strong>資料は「押されている状態の見分けが色の変化だけでは伝わらない」を崩れた形に挙げています。GUNJO は入りのとき、背景を <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">primary</code>、文字を <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">primary-foreground</code> にします。地と字がまとめて反転するので、薄い色の差ではなく面として分かります。資料が求める <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-pressed</code> は土台の Radix が付けます。
                        </li>
                        <li>
                            <strong>押せない状態でも、入りか切りかは残す。</strong>ふつう使えない状態は全体を薄くしますが、それだと入りのトグルが「押せない」と「切り」の見分けが付かなくなります。GUNJO は使えないときの透明度を戻したうえで、入りのままなら <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">primary-subtle</code> の淡い塗りを残し、切りのときは枠線と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">muted</code> の地にします。
                        </li>
                        <li>
                            <strong>見た目は2つだけにした。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">variant</code> は地の無いものと枠線のあるものの2つ、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">size</code> は3つです。1つだけ置くトグルは周りに馴染ませ、並べて使うときは <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ToggleGroup</code> に移る、という切り分けにしてあるので、単体のトグルに区切りや連結の見た目を増やしていません。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>On flips both the surface and the text, not just a colour.</strong> The article lists a weak pressed state as a broken pattern, since a colour shift alone does not reach every reader. When on, GUNJO sets the background to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">primary</code> and the text to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">primary-foreground</code>, so the change reads as a filled area rather than a tint. The <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-pressed</code> the article requires comes from Radix.
                        </li>
                        <li>
                            <strong>Even when it cannot be pressed, on and off stay distinguishable.</strong> The usual disabled treatment fades everything, which makes a disabled-on toggle look the same as an off one. GUNJO restores the opacity and keeps a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">primary-subtle</code> fill when the toggle is on, while an off one falls back to a border over a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">muted</code> surface.
                        </li>
                        <li>
                            <strong>Two looks and no more.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">variant</code> is either bare or outlined, with three sizes. A lone toggle is meant to blend into its surroundings, and a row of them is meant to become a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ToggleGroup</code>, so no joined or segmented styling was added to the single control.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
