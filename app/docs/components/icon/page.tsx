"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Icon } from "@gunjo/ui";
import {
    IconAlertTriangle,
    IconBell,
    IconCheck,
    IconChevronDown,
    IconInfoCircle,
    IconSparkles,
} from "@tabler/icons-react";

export default function IconPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/icon", locale);
    const title = content?.title ?? displayMetadata.icon.title;
    const description = content?.description ?? displayMetadata.icon.description;

    const code = locale === "ja"
        ? `import { Icon } from "@gunjo/ui";
import { IconBell } from "@tabler/icons-react";

export function Example() {
  return (
    <Icon
      icon={IconBell}
      size="md"
      label="通知"
      decorative={false}
    />
  );
}`
        : `import { Icon } from "@gunjo/ui";
import { IconBell } from "@tabler/icons-react";

export function Example() {
  return (
    <Icon
      icon={IconBell}
      size="md"
      label="Notifications"
      decorative={false}
    />
  );
}`;

    const usageCode = locale === "ja"
        ? `import { Icon } from "@gunjo/ui";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";

export function StatusIcons() {
  return (
    <div className="flex items-center gap-3">
      <Icon
        icon={IconCheck}
        size="sm"
        className="text-success"
        label="完了"
        decorative={false}
      />
      <Icon
        icon={IconAlertTriangle}
        size="sm"
        className="text-destructive"
        label="注意"
        decorative={false}
      />
    </div>
  );
}`
        : `import { Icon } from "@gunjo/ui";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";

export function StatusIcons() {
  return (
    <div className="flex items-center gap-3">
      <Icon
        icon={IconCheck}
        size="sm"
        className="text-success"
        label="Complete"
        decorative={false}
      />
      <Icon
        icon={IconAlertTriangle}
        size="sm"
        className="text-destructive"
        label="Warning"
        decorative={false}
      />
    </div>
  );
}`;

    const propsData = [
        {
            name: "icon",
            type: "IconGlyph",
            description: locale === "ja" ? "表示するアイコンコンポーネントです。" : "Icon component to render.",
            required: true,
        },
        {
            name: "size",
            type: '"xs" | "sm" | "md" | "lg" | "xl"',
            default: '"sm"',
            description: locale === "ja" ? "アイコンの大きさを GunjoUI の共通サイズに揃えます。" : "Normalizes icon size to GunjoUI size tokens.",
        },
        {
            name: "label",
            type: "string",
            description: locale === "ja" ? "意味を持つアイコンを支援技術へ伝える名前です。" : "Accessible name for meaningful icons.",
        },
        {
            name: "decorative",
            type: "boolean",
            default: "true",
            description: locale === "ja" ? "装飾としてだけ使うアイコンを支援技術から隠すかどうかを指定します。" : "Whether the icon should be hidden from assistive technology.",
        },
        {
            name: "strokeWidth",
            type: "number",
            default: "2",
            description: locale === "ja" ? "アイコンの線幅を指定します。" : "Controls the icon stroke width.",
        },
        {
            name: "className",
            type: "string",
            description: locale === "ja" ? "色や余白など、利用側の文脈で必要なスタイルを渡します。Icon 自体は色を決めません。" : "Pass context-specific styles such as color or spacing. Icon itself does not own color.",
        },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Icon", href: "/docs/components/icon" },
            ]}
            relatedComponents={[
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Accordion", href: "/docs/components/accordion" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/icon" code={code} codeBlock={<CodeBlock code={code} />}>
                <Icon icon={IconBell} size="md" label={locale === "ja" ? "通知" : "Notifications"} decorative={false} />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "sizes",
                            title: locale === "ja" ? "サイズ" : "Sizes",
                            description: locale === "ja"
                                ? "同じアイコンでも、用途に合わせて xs から xl までのサイズに揃えられます。"
                                : "The same glyph can be normalized across xs through xl sizes.",
                            preview: (
                                <div className="flex items-center gap-4 text-muted-foreground">
                                    <Icon icon={IconSparkles} size="xs" />
                                    <Icon icon={IconSparkles} size="sm" />
                                    <Icon icon={IconSparkles} size="md" />
                                    <Icon icon={IconSparkles} size="lg" />
                                    <Icon icon={IconSparkles} size="xl" />
                                </div>
                            ),
                            code: `import { Icon } from "@gunjo/ui";
import { IconSparkles } from "@tabler/icons-react";

export function IconSizes() {
  return (
    <div className="flex items-center gap-4">
      <Icon icon={IconSparkles} size="xs" />
      <Icon icon={IconSparkles} size="sm" />
      <Icon icon={IconSparkles} size="md" />
      <Icon icon={IconSparkles} size="lg" />
      <Icon icon={IconSparkles} size="xl" />
    </div>
  );
}`,
                        },
                        {
                            key: "semantic",
                            title: locale === "ja" ? "意味を持つアイコン" : "Meaningful icon",
                            description: locale === "ja"
                                ? "アイコンだけで意味を伝える場合は、装飾扱いにせず、支援技術向けの名前を渡します。色は用途側の状態色として指定します。"
                                : "When an icon carries meaning by itself, set decorative to false and provide a label. Color comes from the usage context.",
                            preview: (
                                <div className="flex items-center gap-3">
                                    <Icon icon={IconCheck} size="sm" className="text-success" label={locale === "ja" ? "完了" : "Complete"} decorative={false} />
                                    <Icon icon={IconAlertTriangle} size="sm" className="text-destructive" label={locale === "ja" ? "注意" : "Warning"} decorative={false} />
                                    <Icon icon={IconInfoCircle} size="sm" className="text-info" label={locale === "ja" ? "情報" : "Information"} decorative={false} />
                                </div>
                            ),
                            code: usageCode,
                        },
                        {
                            key: "indicator",
                            title: locale === "ja" ? "インジケーター" : "Indicator",
                            description: locale === "ja"
                                ? "アコーディオンなどの開閉表示では、コンポーネント側が Icon を使ってサイズと線幅を揃えます。"
                                : "Disclosure components such as Accordion use Icon to keep indicator size and stroke consistent.",
                            preview: (
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Icon icon={IconChevronDown} size="sm" />
                                    <Icon icon={IconSparkles} size="sm" strokeWidth={1.75} />
                                </div>
                            ),
                            code: `import { Icon } from "@gunjo/ui";
import { IconChevronDown } from "@tabler/icons-react";

export function IndicatorIcon() {
  return <Icon icon={IconChevronDown} size="sm" />;
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">{locale === "ja" ? "プロパティ" : "Props"}</h2>
                <PropsTable data={propsData} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">{locale === "ja" ? "使い方" : "Usage"}</h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "Icon は見た目の大きさ、線幅、支援技術への伝え方を揃えるためのプリミティブです。色、クリック、ホバー、無効化、開閉状態は、Icon を使う Button、TooltipButton、Accordion などのコンポーネント側で扱います。"
                        : "Icon only normalizes visual size, stroke, and assistive technology semantics. Color, click, hover, disabled, and disclosure states belong to the Button, TooltipButton, Accordion, or other component that uses the icon."}
                </p>
                <CodeBlock code={usageCode} />
            </div>
        </ComponentLayout>
    );
}
