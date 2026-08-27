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
    const isJa = locale === "ja";
    const code = isJa
        ? `import * as React from "react";
import { FormControl, FormGroup, FormLabel, RangeSlider } from "@gunjo/ui";

export function PriceRangeSlider() {
  const [range, setRange] = React.useState<[number, number]>([24, 72]);

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="price-range">価格帯</FormLabel>
      <FormControl>
        <RangeSlider
          id="price-range"
          className="w-full"
          value={range}
          onValueChange={setRange}
          min={0}
          max={100}
          step={1}
          minLabel="最小値"
          maxLabel="最大値"
        />
      </FormControl>
    </FormGroup>
  );
}`
        : `import * as React from "react";
import { FormControl, FormGroup, FormLabel, RangeSlider } from "@gunjo/ui";

export function PriceRangeSlider() {
  const [range, setRange] = React.useState<[number, number]>([24, 72]);

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="price-range">Price range</FormLabel>
      <FormControl>
        <RangeSlider
          id="price-range"
          className="w-full"
          value={range}
          onValueChange={setRange}
          min={0}
          max={100}
          step={1}
          minLabel="Minimum"
          maxLabel="Maximum"
        />
      </FormControl>
    </FormGroup>
  );
}`;

    const usageCode = isJa
        ? `import * as React from "react";
import { RangeSlider } from "@gunjo/ui";

export function PriceRangeFilter() {
  const [range, setRange] = React.useState<[number, number]>([24, 72]);

  return (
    <RangeSlider
      className="w-full max-w-sm"
      value={range}
      onValueChange={setRange}
      min={0}
      max={100}
      step={1}
      minLabel="最小値"
      maxLabel="最大値"
    />
  );
}`
        : `import * as React from "react";
import { RangeSlider } from "@gunjo/ui";

export function PriceRangeFilter() {
  const [range, setRange] = React.useState<[number, number]>([24, 72]);

  return (
    <RangeSlider
      className="w-full max-w-sm"
      value={range}
      onValueChange={setRange}
      min={0}
      max={100}
      step={1}
      minLabel="Minimum value"
      maxLabel="Maximum value"
    />
  );
}`;

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
                            code: isJa
                                ? `import * as React from "react";
import { RangeSlider } from "@gunjo/ui";

export function SteppedPriceRangeSlider() {
  const [range, setRange] = React.useState<[number, number]>([20, 80]);

  return (
    <RangeSlider
      className="w-full max-w-sm"
      value={range}
      onValueChange={setRange}
      min={0}
      max={100}
      step={10}
      minLabel="最小値"
      maxLabel="最大値"
    />
  );
}`
                                : `import * as React from "react";
import { RangeSlider } from "@gunjo/ui";

export function SteppedPriceRangeSlider() {
  const [range, setRange] = React.useState<[number, number]>([20, 80]);

  return (
    <RangeSlider
      className="w-full max-w-sm"
      value={range}
      onValueChange={setRange}
      min={0}
      max={100}
      step={10}
      minLabel="Minimum value"
      maxLabel="Maximum value"
    />
  );
}`,
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
                            code: isJa
                                ? `import * as React from "react";
import { NumberInput, RangeSlider } from "@gunjo/ui";

export function PriceRangeWithInputs() {
  const [range, setRange] = React.useState<[number, number]>([24, 72]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <RangeSlider
        value={range}
        onValueChange={setRange}
        minLabel="最小値"
        maxLabel="最大値"
      />
      <div className="flex items-center gap-2">
        <NumberInput
          label="最小値"
          value={range[0]}
          onValueChange={(next) => setRange([next ?? 0, range[1]])}
        />
        <NumberInput
          label="最大値"
          value={range[1]}
          onValueChange={(next) => setRange([range[0], next ?? 100])}
        />
      </div>
    </div>
  );
}`
                                : `import * as React from "react";
import { NumberInput, RangeSlider } from "@gunjo/ui";

export function PriceRangeWithInputs() {
  const [range, setRange] = React.useState<[number, number]>([24, 72]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <RangeSlider
        value={range}
        onValueChange={setRange}
        minLabel="Minimum value"
        maxLabel="Maximum value"
      />
      <div className="flex items-center gap-2">
        <NumberInput
          label="Minimum"
          value={range[0]}
          onValueChange={(next) => setRange([next ?? 0, range[1]])}
        />
        <NumberInput
          label="Maximum"
          value={range[1]}
          onValueChange={(next) => setRange([range[0], next ?? 100])}
        />
      </div>
    </div>
  );
}`,
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
                            code: isJa
                                ? `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { RangeSlider } from "@gunjo/ui";

export function LockedPriceRangeSlider() {
  return (
    <DisabledReasonTooltip
      fullWidth
      reason="契約プランで範囲が固定されています。"
    >
      <RangeSlider disabled value={[32, 68]} />
    </DisabledReasonTooltip>
  );
}`
                                : `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { RangeSlider } from "@gunjo/ui";

export function LockedPriceRangeSlider() {
  return (
    <DisabledReasonTooltip
      fullWidth
      reason="The range is fixed by the current plan."
    >
      <RangeSlider disabled value={[32, 68]} />
    </DisabledReasonTooltip>
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
                            <strong>本物の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">input[type=range]</code> を2本重ねた。</strong>自前のドラッグ処理は書かず、ネイティブの range を2本、同じ場所に重ねています。つまみだけがポインタを受け取り、帯と塗りは背後の飾りです。矢印キー・Home と End・読み上げが最初から効くのは、この作りのためです。
                        </li>
                        <li>
                            <strong>つまみが交差したら、止めずに入れ替える。</strong>資料は「2つのハンドルが交差しないロジックを実装する」を挙げています。GUNJO は交差の手前で止めるのではなく、確定のときに小さいほうを最小・大きいほうを最大として並べ替えます。引っかかって動かないより、追い越せるほうが操作しやすいからです。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">step</code> の丸めも同じ場所でやります。
                        </li>
                        <li>
                            <strong>数値の表示は、まだ書いていません。</strong>資料は「常に現在値を数値で表示する」を核に挙げていますが、この部品は帯とつまみだけで、数字を出しません。単位つきの表示も、数値入力との横並びも持たないので、いまは呼ぶ側が <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">value</code> を受け取って自分で書く形です。
                            <br />
                            一般のスライダーの設計は UIXHERO の「スライダー」にあります。{" "}
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/slider"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: スライダー（Slider）
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Two real <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">input[type=range]</code> elements, stacked.</strong> No hand-rolled drag handling: two native range inputs sit on top of each other, with pointer events reaching only the thumbs while the track and the filled span are decoration behind them. Arrow keys, Home and End and screen-reader support all come for free from that.
                        </li>
                        <li>
                            <strong>Crossing thumbs swap instead of stopping.</strong> The article asks for logic that keeps the two handles from crossing. Rather than blocking at the boundary, GUNJO sorts the pair on commit so the lower value becomes the minimum and the higher one the maximum. Overtaking is easier to operate than jamming. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">step</code> rounding happens in the same place.
                        </li>
                        <li>
                            <strong>The numeric readout is not written yet.</strong> The article&rsquo;s first principle is to always show the current value as a number, and this component shows only the track and the thumbs. There is no unit-aware readout and no paired number input, so today the caller reads <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">value</code> and prints it.
                            <br />
                            The general design of sliders is covered by UIXHERO&rsquo;s slider article.{" "}
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/slider"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: Slider (in Japanese)
                            </a>
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
