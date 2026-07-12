"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { PropsTable } from "@/components/doc/PropsTable";
import { RadioGroupDemo } from "@/components/demos/FormDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { Label, RadioGroup, RadioGroupItem } from "@gunjo/ui";

export default function RadioGroupPage() {
    const { locale, sectionLabels } = useLocale();
    const code = `import { Label, RadioGroup, RadioGroupItem } from "@gunjo/ui";

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="standard">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="basic" id="plan-basic" />
        <Label htmlFor="plan-basic">${locale === "ja" ? "ベーシック" : "Basic"}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="standard" id="plan-standard" />
        <Label htmlFor="plan-standard">${locale === "ja" ? "スタンダード" : "Standard"}</Label>
      </div>
    </RadioGroup>
  );
}`;

    const usageCode = `import { Label, RadioGroup, RadioGroupItem } from "@gunjo/ui";

export function PlanPicker() {
  return (
    <RadioGroup defaultValue="standard">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="basic" id="plan-basic" />
        <Label htmlFor="plan-basic">${locale === "ja" ? "ベーシック" : "Basic"}</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="standard" id="plan-standard" />
        <Label htmlFor="plan-standard">${locale === "ja" ? "スタンダード" : "Standard"}</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="team" id="plan-team" />
        <Label htmlFor="plan-team">${locale === "ja" ? "チーム" : "Team"}</Label>
      </div>
    </RadioGroup>
  );
}`;

    const propsData = [
        {
            name: "defaultValue",
            type: "string",
            description:
                locale === "ja"
                    ? "内部状態で使う場合に、初期選択する項目の値です。"
                    : "Initial selected value for uncontrolled usage.",
        },
        {
            name: "value",
            type: "string",
            description:
                locale === "ja"
                    ? "外部から渡す選択値です。"
                    : "Controlled selected value.",
        },
        {
            name: "onValueChange",
            type: "(value: string) => void",
            description:
                locale === "ja"
                    ? "選択値が変わった時に呼ばれます。"
                    : "Called when the selected value changes.",
        },
        {
            name: "disabled",
            type: "boolean",
            default: "false",
            description:
                locale === "ja"
                    ? "RadioGroup に渡すと全項目を、RadioGroupItem に渡すとその項目を無効化します。祖先の <fieldset disabled> も同様に尊重され、各 radio は aria-disabled になり roving tabindex から外れます。(#273)"
                    : "On RadioGroup disables every item; on a RadioGroupItem disables that item. An ancestor <fieldset disabled> is honored the same way — each radio becomes aria-disabled and drops out of the roving tab order. (#273)",
        },
    ];

    const planOptions = [
        {
            value: "free",
            title: locale === "ja" ? "無料" : "Free",
            hint: locale === "ja" ? "3プロジェクトまで、コミュニティサポート。" : "Up to 3 projects, community support.",
        },
        {
            value: "standard",
            title: locale === "ja" ? "スタンダード" : "Standard",
            hint: locale === "ja" ? "無制限プロジェクト、メールサポート。" : "Unlimited projects, email support.",
        },
        {
            value: "team",
            title: locale === "ja" ? "チーム" : "Team",
            hint: locale === "ja" ? "共有ワークスペースとシングルサインオン。" : "Shared workspaces and SSO.",
        },
    ];
    const densities = [
        { value: "compact", label: locale === "ja" ? "コンパクト" : "Compact" },
        { value: "comfortable", label: locale === "ja" ? "標準" : "Comfortable" },
        { value: "spacious", label: locale === "ja" ? "広め" : "Spacious" },
    ];

    return (
        <ComponentLayout
            title={inputsMetadata.radioGroup.title}
            description={inputsMetadata.radioGroup.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "RadioGroup", href: "/docs/components/radio-group" },
                { name: "RadioGroupItem", href: "/docs/components/radio-group" },
                { name: "Label", href: "/docs/components/label" },
            ]}
            relatedComponents={[
                { name: "Checkbox", href: "/docs/components/checkbox" },
                { name: "Switch", href: "/docs/components/switch" },
                { name: "ToggleGroup", href: "/docs/components/toggle-group" },
                { name: "Form", href: "/docs/components/form" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/radio-group" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels}>
                <RadioGroupDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "rich-options",
                            title: locale === "ja" ? "説明付き選択肢" : "Rich option labels",
                            description:
                                locale === "ja"
                                    ? "見出しと補足を含めると、選択肢の違いを比較しやすくなります。"
                                    : "Heading and helper copy make each option easier to compare.",
                            preview: (
                                <RadioGroup defaultValue="standard" className="space-y-3">
                                    {planOptions.map((option) => (
                                        <Label
                                            key={option.value}
                                            htmlFor={`plan-${option.value}`}
                                            className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-muted/40"
                                        >
                                            <RadioGroupItem value={option.value} id={`plan-${option.value}`} className="mt-0.5" />
                                            <span className="space-y-0.5">
                                                <span className="block font-medium leading-none">{option.title}</span>
                                                <span className="block text-xs font-normal text-muted-foreground">{option.hint}</span>
                                            </span>
                                        </Label>
                                    ))}
                                </RadioGroup>
                            ),
                            previewHeight: 300,
                            code: usageCode,
                        },
                        {
                            key: "horizontal",
                            title: locale === "ja" ? "横並び" : "Horizontal layout",
                            description:
                                locale === "ja"
                                    ? "密度や表示モードのような短い排他的選択では、横並びが使えます。"
                                    : "Inline orientation works for short mutually-exclusive choices like density.",
                            preview: (
                                <RadioGroup defaultValue="comfortable" className="flex flex-wrap gap-4">
                                    {densities.map((option) => (
                                        <div key={option.value} className="flex items-center gap-2">
                                            <RadioGroupItem value={option.value} id={`density-${option.value}`} />
                                            <Label htmlFor={`density-${option.value}`}>{option.label}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            ),
                            previewHeight: 150,
                            code: `import { Label, RadioGroup, RadioGroupItem } from "@gunjo/ui";

<RadioGroup defaultValue="comfortable" className="flex gap-4">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="compact" id="density-compact" />
    <Label htmlFor="density-compact">${locale === "ja" ? "コンパクト" : "Compact"}</Label>
  </div>
</RadioGroup>`,
                        },
                        {
                            key: "disabled-option",
                            title: locale === "ja" ? "選択肢の無効化" : "Disabled option",
                            description:
                                locale === "ja"
                                    ? "選べない理由はツールチップで伝えます。"
                                    : "Explain why an option is unavailable with a Tooltip.",
                            preview: (
                                <RadioGroup defaultValue="standard" className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="standard" id="radio-standard" />
                                        <Label htmlFor="radio-standard">{locale === "ja" ? "スタンダード" : "Standard"}</Label>
                                    </div>
                                    <DisabledReasonTooltip reason={locale === "ja" ? "エンタープライズプランは審査後に選択できます。" : "Enterprise is available after review."}>
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="enterprise" id="radio-enterprise" disabled />
                                            <Label htmlFor="radio-enterprise" className="text-muted-foreground">
                                                {locale === "ja" ? "エンタープライズ" : "Enterprise"}
                                            </Label>
                                        </div>
                                    </DisabledReasonTooltip>
                                </RadioGroup>
                            ),
                            previewHeight: 170,
                            code: `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { Label, RadioGroupItem } from "@gunjo/ui";

<DisabledReasonTooltip reason="${locale === "ja" ? "エンタープライズプランは審査後に選択できます。" : "Enterprise is available after review."}">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="enterprise" id="enterprise" disabled />
    <Label htmlFor="enterprise">${locale === "ja" ? "エンタープライズ" : "Enterprise"}</Label>
  </div>
</DisabledReasonTooltip>`,
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
