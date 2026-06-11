"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import inputsMetadata from "@design/inputs-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import { LabelDemo } from "@/components/demos/LabelDemo";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Checkbox, FormControl, FormDescription, FormGroup, FormLabel, HStack, Input, Label, RadioGroup, RadioGroupItem, VStack } from "@gunjo/ui";
import * as React from "react";

export default function LabelPage() {
    const { locale, sectionLabels } = useLocale();
    const [newsletterChecked, setNewsletterChecked] = React.useState(false);
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const code = `import * as React from "react";
import { Checkbox, FormControl, FormGroup, FormLabel, HStack, Input, Label, VStack } from "@gunjo/ui";

export function LabelDemo() {
  const [accepted, setAccepted] = React.useState(false);

  return (
    <VStack gap={4} className="w-full max-w-sm">
      <HStack gap={2}>
        <Checkbox id="terms" checked={accepted} onCheckedChange={setAccepted} />
        <Label htmlFor="terms">${locale === "ja" ? "利用規約に同意する" : "Accept terms and conditions"}</Label>
      </HStack>
      <FormGroup>
        <FormLabel htmlFor="display-name">${locale === "ja" ? "表示名" : "Display name"}</FormLabel>
        <FormControl>
          <Input id="display-name" placeholder="${locale === "ja" ? "田中そら" : "Sora Tanaka"}" />
        </FormControl>
      </FormGroup>
    </VStack>
  );
}`;

    const usageCode = `import { FormControl, FormGroup, FormLabel, Input } from "@gunjo/ui";

export function DisplayNameField() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="display-name">${locale === "ja" ? "表示名" : "Display name"}</FormLabel>
      <FormControl>
        <Input id="display-name" />
      </FormControl>
    </FormGroup>
  );
}`;

    const propsData = [
        {
            name: "htmlFor",
            type: "string",
            description: locale === "ja" ? "ラベルと対象の入力欄を紐づける ID です。" : "The id of the element the label is associated with.",
        },
        {
            name: "children",
            type: "ReactNode",
            description: locale === "ja" ? "ラベルとして表示するテキストや要素です。" : "Label text or elements rendered inside the label.",
        },
    ];

    return (
        <ComponentLayout
            title={metadata.label.title}
            description={metadata.label.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Label", href: "/docs/components/label" },
                { name: "FormLabel", href: "/docs/components/form" },
                { name: "FormGroup", href: "/docs/components/form" },
                { name: "FormControl", href: "/docs/components/form" },
            ]}
            relatedComponents={[
                { name: "Input", href: "/docs/components/input" },
                { name: "Checkbox", href: "/docs/components/checkbox" },
                { name: "RadioGroup", href: "/docs/components/radio-group" },
                { name: "Form", href: "/docs/components/form" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/label" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="md">
                <LabelDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "form-label",
                            title: locale === "ja" ? "入力欄のラベル" : "Input label",
                            description:
                                locale === "ja"
                                    ? "入力欄の id と紐づけると、ラベルをクリックして入力欄へフォーカスできます。"
                                    : "Bind the label to an input id so clicking the label focuses the input.",
                            preview: (
                                <FormGroup className="w-full max-w-sm">
                                    <FormLabel htmlFor="label-name">{locale === "ja" ? "表示名" : "Display name"}</FormLabel>
                                    <FormControl>
                                        <Input id="label-name" placeholder={locale === "ja" ? "田中そら" : "Sora Tanaka"} />
                                    </FormControl>
                                </FormGroup>
                            ),
                            previewHeight: 170,
                            code: usageCode,
                        },
                        {
                            key: "inline-control",
                            title: locale === "ja" ? "チェック項目のラベル" : "Inline control label",
                            description:
                                locale === "ja"
                                    ? "チェックボックスやラジオボタンでは、操作対象とラベルを横並びにして選択内容を明確にします。"
                                    : "For checkbox and radio controls, align the control and label so the choice is easy to scan.",
                            preview: (
                                <HStack gap={2}>
                                    <Checkbox
                                        id="label-newsletter"
                                        checked={newsletterChecked}
                                        onCheckedChange={setNewsletterChecked}
                                    />
                                    <Label htmlFor="label-newsletter">
                                        {locale === "ja" ? "メールで更新を受け取る" : "Receive email updates"}
                                    </Label>
                                </HStack>
                            ),
                            previewHeight: 140,
                            code: `import * as React from "react";
import { Checkbox, HStack, Label } from "@gunjo/ui";

export function NewsletterLabel() {
  const [checked, setChecked] = React.useState(false);

  return (
    <HStack gap={2}>
      <Checkbox id="newsletter" checked={checked} onCheckedChange={setChecked} />
      <Label htmlFor="newsletter">${locale === "ja" ? "メールで更新を受け取る" : "Receive email updates"}</Label>
    </HStack>
  );
}`,
                        },
                        {
                            key: "radio-group",
                            title: locale === "ja" ? "ラジオ選択肢" : "Radio option labels",
                            description:
                                locale === "ja"
                                    ? "排他的な選択肢では、各ラベルを対象のラジオボタンに紐づけます。"
                                    : "For exclusive choices, each label should point to its corresponding radio item.",
                            preview: (
                                <RadioGroup defaultValue="standard" className="gap-3">
                                    <HStack gap={2}>
                                        <RadioGroupItem id="label-plan-basic" value="basic" />
                                        <Label htmlFor="label-plan-basic">{locale === "ja" ? "ベーシック" : "Basic"}</Label>
                                    </HStack>
                                    <HStack gap={2}>
                                        <RadioGroupItem id="label-plan-standard" value="standard" />
                                        <Label htmlFor="label-plan-standard">{locale === "ja" ? "スタンダード" : "Standard"}</Label>
                                    </HStack>
                                </RadioGroup>
                            ),
                            previewHeight: 170,
                            code: `import { HStack, Label, RadioGroup, RadioGroupItem } from "@gunjo/ui";

export function PlanLabels() {
  return (
    <RadioGroup defaultValue="standard" className="gap-3">
      <HStack gap={2}>
        <RadioGroupItem id="plan-basic" value="basic" />
        <Label htmlFor="plan-basic">${locale === "ja" ? "ベーシック" : "Basic"}</Label>
      </HStack>
      <HStack gap={2}>
        <RadioGroupItem id="plan-standard" value="standard" />
        <Label htmlFor="plan-standard">${locale === "ja" ? "スタンダード" : "Standard"}</Label>
      </HStack>
    </RadioGroup>
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
        </ComponentLayout>
    );
}
