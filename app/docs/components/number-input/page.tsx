"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { PropsTable } from "@/components/doc/PropsTable";
import { NumberInputDemo } from "@/components/demos/NumberInputDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { FormControl, FormDescription, FormGroup, FormLabel, NumberInput } from "@gunjo/ui";
import * as React from "react";

function ControlledNumberInput({
    min = 0,
    max = 100,
    step = 1,
    initialValue = 42,
    disabled,
}: {
    min?: number;
    max?: number;
    step?: number;
    initialValue?: number;
    disabled?: boolean;
}) {
    const { locale } = useLocale();
    const [value, setValue] = React.useState(initialValue);
    const field = (
        <NumberInput
            id="number-state"
            value={value}
            onValueChange={setValue}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            incrementLabel={locale === "ja" ? "値を増やす" : "Increase value"}
            decrementLabel={locale === "ja" ? "値を減らす" : "Decrease value"}
        />
    );

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="number-state">{locale === "ja" ? "数量" : "Quantity"}</FormLabel>
            <FormControl>
                {disabled ? (
                    <DisabledReasonTooltip fullWidth reason={locale === "ja" ? "在庫連携中のため数量を変更できません。" : "Quantity is locked while inventory sync is running."}>
                        {field}
                    </DisabledReasonTooltip>
                ) : (
                    field
                )}
            </FormControl>
            <FormDescription>
                {locale === "ja" ? `現在の値: ${value}` : `Current value: ${value}`}
            </FormDescription>
        </FormGroup>
    );
}

export default function NumberInputPage() {
    const { locale, sectionLabels } = useLocale();
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const code = `import * as React from "react";
import { FormControl, FormDescription, FormGroup, FormLabel, NumberInput } from "@gunjo/ui";

export function NumberInputDemo() {
  const [value, setValue] = React.useState(42);

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="quantity">${locale === "ja" ? "数量" : "Quantity"}</FormLabel>
      <FormControl>
        <NumberInput
          id="quantity"
          value={value}
          onValueChange={setValue}
          min={0}
          max={100}
          incrementLabel="${locale === "ja" ? "数量を増やす" : "Increase quantity"}"
          decrementLabel="${locale === "ja" ? "数量を減らす" : "Decrease quantity"}"
        />
      </FormControl>
      <FormDescription>${locale === "ja" ? "現在の値" : "Current value"}: {value}</FormDescription>
    </FormGroup>
  );
}`;

    const usageCode = `import { FormControl, FormGroup, FormLabel, NumberInput } from "@gunjo/ui";

export function CountField() {
  const [count, setCount] = React.useState(0);

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="count">${locale === "ja" ? "件数" : "Count"}</FormLabel>
      <FormControl>
        <NumberInput
          id="count"
          value={count}
          onValueChange={setCount}
          min={0}
          max={100}
          step={5}
          incrementLabel="${locale === "ja" ? "件数を増やす" : "Increase count"}"
          decrementLabel="${locale === "ja" ? "件数を減らす" : "Decrease count"}"
        />
      </FormControl>
    </FormGroup>
  );
}`;

    const propsData = [
        {
            name: "value",
            type: "number",
            description: locale === "ja" ? "外部から渡す現在の数値です。" : "Controlled numeric value.",
        },
        {
            name: "onValueChange",
            type: "(value: number) => void",
            description:
                locale === "ja"
                    ? "値が変わった時に呼ばれます。`min` / `max` の範囲内に丸められます。"
                    : "Called when the value changes. The value is clamped to `min` / `max`.",
        },
        {
            name: "min",
            type: "number",
            description: locale === "ja" ? "入力できる最小値です。" : "Minimum allowed value.",
        },
        {
            name: "max",
            type: "number",
            description: locale === "ja" ? "入力できる最大値です。" : "Maximum allowed value.",
        },
        {
            name: "step",
            type: "number",
            default: "1",
            description: locale === "ja" ? "上下ボタンで増減する単位です。" : "Increment / decrement step size.",
        },
        {
            name: "incrementLabel",
            type: "string",
            default: "'Increment'",
            description:
                locale === "ja"
                    ? "増加ボタンの支援技術向けラベルです。"
                    : "Accessible label for the increment button.",
        },
        {
            name: "decrementLabel",
            type: "string",
            default: "'Decrement'",
            description:
                locale === "ja"
                    ? "減少ボタンの支援技術向けラベルです。"
                    : "Accessible label for the decrement button.",
        },
    ];

    return (
        <ComponentLayout
            title={metadata.numberInput.title}
            description={metadata.numberInput.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "NumberInput", href: "/docs/components/number-input" },
                { name: "Input", href: "/docs/components/input" },
                { name: "Button", href: "/docs/components/button" },
                { name: "FormGroup", href: "/docs/components/form" },
            ]}
            relatedComponents={[
                { name: "RangeSlider", href: "/docs/components/range-slider" },
                { name: "Slider", href: "/docs/components/slider" },
                { name: "Form", href: "/docs/components/form" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/number-input" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="md">
                <NumberInputDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "bounded",
                            title: locale === "ja" ? "最小値と最大値" : "Min and max",
                            description:
                                locale === "ja"
                                    ? "直接入力と上下ボタンのどちらでも、指定した範囲から外れないようにします。"
                                    : "Direct input and stepper buttons stay within the configured bounds.",
                            preview: <ControlledNumberInput min={0} max={100} initialValue={42} />,
                            previewHeight: 170,
                            code: usageCode,
                        },
                        {
                            key: "step",
                            title: locale === "ja" ? "増減単位" : "Step size",
                            description:
                                locale === "ja"
                                    ? "金額やポイントなど、決まった単位で増減する値に使います。"
                                    : "Use a larger step for values that move in fixed increments such as points or currency.",
                            preview: <ControlledNumberInput min={0} max={500} step={25} initialValue={125} />,
                            previewHeight: 170,
                            code: `import { NumberInput } from "@gunjo/ui";

<NumberInput value={value} onValueChange={setValue} min={0} max={500} step={25} />`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description:
                                locale === "ja"
                                    ? "変更できない理由はツールチップと補足文で伝えます。"
                                    : "Explain why the value cannot be changed with a Tooltip and helper copy.",
                            preview: <ControlledNumberInput disabled initialValue={12} />,
                            previewHeight: 170,
                            code: `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { NumberInput } from "@gunjo/ui";

<DisabledReasonTooltip fullWidth reason="${locale === "ja" ? "在庫連携中のため数量を変更できません。" : "Quantity is locked while inventory sync is running."}">
  <NumberInput disabled value={12} />
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
