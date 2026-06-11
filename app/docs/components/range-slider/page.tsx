"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { PropsTable } from "@/components/doc/PropsTable";
import { RangeSliderDemo } from "@/components/demos/RangeSliderDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { FormControl, FormDescription, FormGroup, FormLabel, HStack, NumberInput, RangeSlider } from "@gunjo/ui";
import * as React from "react";

function RangeStatePreview({
    disabled,
    step = 1,
    initialValue = [24, 72] as [number, number],
}: {
    disabled?: boolean;
    step?: number;
    initialValue?: [number, number];
}) {
    const { locale } = useLocale();
    const [range, setRange] = React.useState<[number, number]>(initialValue);
    const minLabel = locale === "ja" ? "最小値" : "Minimum";
    const maxLabel = locale === "ja" ? "最大値" : "Maximum";
    const slider = (
        <RangeSlider
            id="range-state"
            className="w-full"
            value={range}
            onValueChange={setRange}
            min={0}
            max={100}
            step={step}
            disabled={disabled}
            minLabel={minLabel}
            maxLabel={maxLabel}
        />
    );

    return (
        <FormGroup className="w-full max-w-sm">
            <HStack justify="between">
                <FormLabel htmlFor="range-state">{locale === "ja" ? "価格帯" : "Price range"}</FormLabel>
                <span className="font-mono text-sm text-muted-foreground">
                    {range[0]} - {range[1]}
                </span>
            </HStack>
            <FormControl>
                {disabled ? (
                    <DisabledReasonTooltip fullWidth reason={locale === "ja" ? "契約プランで範囲が固定されています。" : "The range is fixed by the current plan."}>
                        {slider}
                    </DisabledReasonTooltip>
                ) : (
                    slider
                )}
            </FormControl>
            <FormDescription>
                {locale === "ja" ? "2つのつまみで最小値と最大値を指定します。" : "Use two thumbs to set the minimum and maximum."}
            </FormDescription>
        </FormGroup>
    );
}

export default function RangeSliderPage() {
    const { locale, sectionLabels } = useLocale();
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const code = `import * as React from "react";
import { FormControl, FormGroup, FormLabel, RangeSlider } from "@gunjo/ui";

export function RangeSliderDemo() {
  const [range, setRange] = React.useState<[number, number]>([24, 72]);

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="price-range">${locale === "ja" ? "価格帯" : "Price range"}</FormLabel>
      <FormControl>
        <RangeSlider
          id="price-range"
          className="w-full"
          value={range}
          onValueChange={setRange}
          min={0}
          max={100}
          step={1}
          minLabel="${locale === "ja" ? "最小値" : "Minimum"}"
          maxLabel="${locale === "ja" ? "最大値" : "Maximum"}"
        />
      </FormControl>
    </FormGroup>
  );
}`;

    const usageCode = `import { RangeSlider } from "@gunjo/ui";

<RangeSlider
  value={[min, max]}
  onValueChange={([nextMin, nextMax]) => {
    setMin(nextMin);
    setMax(nextMax);
  }}
  min={0}
  max={100}
  step={1}
  minLabel="${locale === "ja" ? "最小値" : "Minimum value"}"
  maxLabel="${locale === "ja" ? "最大値" : "Maximum value"}"
/>`;

    const propsData = [
        {
            name: "value",
            type: "[number, number]",
            description: locale === "ja" ? "外部から渡す最小値と最大値です。" : "Controlled minimum and maximum values.",
        },
        {
            name: "defaultValue",
            type: "[number, number]",
            description: locale === "ja" ? "内部状態で使う場合の初期値です。" : "Initial uncontrolled minimum and maximum values.",
        },
        {
            name: "onValueChange",
            type: "(value: [number, number]) => void",
            description: locale === "ja" ? "どちらかのつまみが変わった時に呼ばれます。" : "Called when either thumb changes.",
        },
        {
            name: "min",
            type: "number",
            default: "0",
            description: locale === "ja" ? "選択できる最小値です。" : "Minimum allowed value.",
        },
        {
            name: "max",
            type: "number",
            default: "100",
            description: locale === "ja" ? "選択できる最大値です。" : "Maximum allowed value.",
        },
        {
            name: "step",
            type: "number",
            default: "1",
            description: locale === "ja" ? "つまみを動かす単位です。" : "Step size for both thumbs.",
        },
        {
            name: "minLabel",
            type: "string",
            default: "'Minimum value'",
            description: locale === "ja" ? "下限つまみの支援技術向けラベルです。" : "Accessible label for the lower thumb.",
        },
        {
            name: "maxLabel",
            type: "string",
            default: "'Maximum value'",
            description: locale === "ja" ? "上限つまみの支援技術向けラベルです。" : "Accessible label for the upper thumb.",
        },
    ];

    return (
        <ComponentLayout
            title={metadata.rangeSlider.title}
            description={metadata.rangeSlider.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "RangeSlider", href: "/docs/components/range-slider" },
                { name: "NumberInput", href: "/docs/components/number-input" },
                { name: "FormGroup", href: "/docs/components/form" },
                { name: "FormLabel", href: "/docs/components/form" },
            ]}
            relatedComponents={[
                { name: "Slider", href: "/docs/components/slider" },
                { name: "NumberInput", href: "/docs/components/number-input" },
                { name: "FilterButton", href: "/docs/components/filter-button" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/range-slider" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="md">
                <RangeSliderDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "range",
                            title: locale === "ja" ? "範囲指定" : "Bounded range",
                            description:
                                locale === "ja"
                                    ? "最小値と最大値を同じトラック上で指定します。"
                                    : "Select a minimum and maximum on the same track.",
                            preview: <RangeStatePreview />,
                            previewHeight: 190,
                            code: usageCode,
                        },
                        {
                            key: "step",
                            title: locale === "ja" ? "刻み幅" : "Step size",
                            description:
                                locale === "ja"
                                    ? "価格帯や容量のように、決まった単位で選ばせたい時に使います。"
                                    : "Use a larger step for values that should move in fixed increments.",
                            preview: <RangeStatePreview step={10} initialValue={[20, 80]} />,
                            previewHeight: 190,
                            code: `import { RangeSlider } from "@gunjo/ui";

<RangeSlider value={range} onValueChange={setRange} min={0} max={100} step={10} />`,
                        },
                        {
                            key: "with-inputs",
                            title: locale === "ja" ? "入力欄との連動" : "Linked inputs",
                            description:
                                locale === "ja"
                                    ? "正確な値を指定したい場合は、数値入力と組み合わせます。"
                                    : "Pair with NumberInput when users need exact values.",
                            preview: <RangeSliderDemo />,
                            previewHeight: 250,
                            code: `import { NumberInput, RangeSlider } from "@gunjo/ui";

<RangeSlider value={range} onValueChange={setRange} />
<NumberInput value={range[0]} onValueChange={(value) => setRange([value, range[1]])} />
<NumberInput value={range[1]} onValueChange={(value) => setRange([range[0], value])} />`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description:
                                locale === "ja"
                                    ? "操作できない理由はツールチップで伝えます。"
                                    : "Explain why the range cannot be changed with a Tooltip.",
                            preview: <RangeStatePreview disabled initialValue={[32, 68]} />,
                            previewHeight: 190,
                            code: `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { RangeSlider } from "@gunjo/ui";

<DisabledReasonTooltip fullWidth reason="${locale === "ja" ? "契約プランで範囲が固定されています。" : "The range is fixed by the current plan."}">
  <RangeSlider disabled value={[32, 68]} />
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
