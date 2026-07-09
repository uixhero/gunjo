"use client";

import * as React from "react";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import { FormControl, FormDescription, FormGroup, FormLabel, HStack, Slider } from "@gunjo/ui";

function ValueSlider({ disabled, steps }: { disabled?: boolean; steps?: boolean }) {
    const { locale } = useLocale();
    const [value, setValue] = React.useState(steps ? 2 : 64);
    const labels = locale === "ja" ? ["低", "標準", "高", "最高"] : ["Low", "Standard", "High", "Lossless"];
    const slider = (
        <Slider
            id={steps ? "quality-slider" : "volume-slider"}
            value={value}
            onValueChange={setValue}
            min={0}
            max={steps ? labels.length - 1 : 100}
            step={1}
            disabled={disabled}
            className="w-full"
        />
    );

    return (
        <FormGroup className="w-full max-w-sm">
            <HStack justify="between">
                <FormLabel htmlFor={steps ? "quality-slider" : "volume-slider"}>
                    {steps ? (locale === "ja" ? "品質" : "Quality") : locale === "ja" ? "音量" : "Volume"}
                </FormLabel>
                <span className="font-mono text-sm text-muted-foreground">
                    {steps ? labels[value] : `${value}%`}
                </span>
            </HStack>
            <FormControl>
                {disabled ? (
                    <DisabledReasonTooltip fullWidth reason={locale === "ja" ? "管理者が音量を固定しています。" : "Volume is locked by your administrator."}>
                        {slider}
                    </DisabledReasonTooltip>
                ) : (
                    slider
                )}
            </FormControl>
            {steps ? (
                <FormDescription className="flex justify-between text-[11px]">
                    {labels.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </FormDescription>
            ) : (
                <FormDescription>
                    {disabled
                        ? locale === "ja"
                            ? "この設定は現在変更できません。"
                            : "This setting cannot be changed right now."
                        : locale === "ja"
                            ? "現在値を横に表示して、ドラッグ中も数値を確認できます。"
                            : "Show the current value beside the label while dragging."}
                </FormDescription>
            )}
        </FormGroup>
    );
}

export default function SliderPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/slider", locale);
    const code = `import * as React from "react";
import { FormControl, FormDescription, FormGroup, FormLabel, HStack, Slider } from "@gunjo/ui";

export function SliderDemo() {
  const [value, setValue] = React.useState(64);

  return (
    <FormGroup className="w-full max-w-sm">
      <HStack justify="between">
        <FormLabel htmlFor="volume">${locale === "ja" ? "音量" : "Volume"}</FormLabel>
        <span className="font-mono text-sm text-muted-foreground">{value}%</span>
      </HStack>
      <FormControl>
        <Slider id="volume" value={value} onValueChange={setValue} min={0} max={100} step={1} className="w-full" />
      </FormControl>
      <FormDescription>${locale === "ja" ? "現在値を横に表示して、ドラッグ中も数値を確認できます。" : "Show the current value beside the label while dragging."}</FormDescription>
    </FormGroup>
  );
}`;

    const usageCode = `import { FormControl, FormGroup, FormLabel, HStack, Slider } from "@gunjo/ui";

<FormGroup className="w-full max-w-sm">
  <HStack justify="between">
    <FormLabel htmlFor="volume">${locale === "ja" ? "音量" : "Volume"}</FormLabel>
    <span className="font-mono text-sm text-muted-foreground">{value}%</span>
  </HStack>
  <FormControl>
    <Slider id="volume" value={value} onValueChange={setValue} min={0} max={100} step={1} className="w-full" />
  </FormControl>
</FormGroup>`;

    const propsData = [
        { name: "value", type: "number", description: locale === "ja" ? "外部から制御する値です。" : "Controlled slider value." },
        { name: "defaultValue", type: "number", description: locale === "ja" ? "初期値です。" : "Initial value for uncontrolled usage." },
        { name: "onValueChange", type: "(value: number) => void", description: locale === "ja" ? "値が変わった時に呼ばれます。" : "Called when the value changes." },
        { name: "min", type: "number", default: "0", description: locale === "ja" ? "選択できる最小値です。" : "Minimum selectable value." },
        { name: "max", type: "number", default: "100", description: locale === "ja" ? "選択できる最大値です。" : "Maximum selectable value." },
        { name: "step", type: "number", default: "1", description: locale === "ja" ? "増減の単位です。" : "Step interval." },
        { name: "disabled", type: "boolean", default: "false", description: locale === "ja" ? "操作できない状態にします。理由はツールチップで補足します。" : "Disables interaction. Explain the reason with a tooltip." },
    ];

    return (
        <ComponentLayout
            title={content?.title ?? inputsMetadata.slider.title}
            description={content?.description ?? inputsMetadata.slider.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Slider", href: "/docs/components/slider" },
                { name: "FormGroup", href: "/docs/components/form" },
                { name: "FormLabel", href: "/docs/components/form" },
                { name: "FormControl", href: "/docs/components/form" },
            ]}
            relatedComponents={[
                { name: "RangeSlider", href: "/docs/components/range-slider" },
                { name: "NumberInput", href: "/docs/components/number-input" },
                { name: "Form", href: "/docs/components/form" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
                <ValueSlider />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "live-value",
                            title: locale === "ja" ? "現在値の表示" : "Live value",
                            description: locale === "ja" ? "ラベル横に現在値を置くと、ドラッグ中も値を確認できます。" : "Show the value beside the label so users can read it while dragging.",
                            preview: <ValueSlider />,
                            code,
                        },
                        {
                            key: "steps",
                            title: locale === "ja" ? "段階ラベル" : "Step labels",
                            description: locale === "ja" ? "数値を意味のある段階名へ対応させる時に使います。" : "Map numeric steps to meaningful labels.",
                            preview: <ValueSlider steps />,
                            code: `import * as React from "react";
import { FormControl, FormDescription, FormGroup, FormLabel, HStack, Slider } from "@gunjo/ui";

export function StepLabelSlider() {
  const labels = [${locale === "ja" ? '"低", "標準", "高", "最高"' : '"Low", "Standard", "High", "Lossless"'}];
  const [value, setValue] = React.useState(2);

  return (
    <FormGroup className="w-full max-w-sm">
      <HStack justify="between">
        <FormLabel htmlFor="quality-slider">${locale === "ja" ? "品質" : "Quality"}</FormLabel>
        <span className="font-mono text-sm text-muted-foreground">{labels[value]}</span>
      </HStack>
      <FormControl>
        <Slider id="quality-slider" value={value} onValueChange={setValue} min={0} max={labels.length - 1} step={1} className="w-full" />
      </FormControl>
      <FormDescription className="flex justify-between text-[11px]">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </FormDescription>
    </FormGroup>
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "操作できない理由はツールチップと補足文で伝えます。" : "Explain why the slider is disabled with a tooltip and helper text.",
                            preview: <ValueSlider disabled />,
                            code: `import { FormControl, FormDescription, FormGroup, FormLabel, HStack, Slider, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export function DisabledSlider() {
  return (
    <FormGroup className="w-full max-w-sm">
      <HStack justify="between">
        <FormLabel htmlFor="volume-slider">${locale === "ja" ? "音量" : "Volume"}</FormLabel>
        <span className="font-mono text-sm text-muted-foreground">64%</span>
      </HStack>
      <FormControl>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block w-full" tabIndex={0}>
              <Slider id="volume-slider" value={64} min={0} max={100} step={1} disabled className="w-full" />
            </span>
          </TooltipTrigger>
          <TooltipContent>${locale === "ja" ? "管理者が音量を固定しています。" : "Volume is locked by your administrator."}</TooltipContent>
        </Tooltip>
      </FormControl>
      <FormDescription>${locale === "ja" ? "この設定は現在変更できません。" : "This setting cannot be changed right now."}</FormDescription>
    </FormGroup>
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
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={usageCode} />
                </div>
            </section>
        </ComponentLayout>
    );
}
