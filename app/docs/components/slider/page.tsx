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
    const code = locale === "ja"
        ? `import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  HStack,
  Slider,
} from "@gunjo/ui";

export function SliderDemo() {
  const [value, setValue] = React.useState(64);

  return (
    <FormGroup className="w-full max-w-sm">
      <HStack justify="between">
        <FormLabel htmlFor="volume">音量</FormLabel>
        <span className="font-mono text-sm text-muted-foreground">{value}%</span>
      </HStack>
      <FormControl>
        <Slider
          id="volume"
          value={value}
          onValueChange={setValue}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </FormControl>
      <FormDescription>現在値を横に表示して、ドラッグ中も数値を確認できます。</FormDescription>
    </FormGroup>
  );
}`
        : `import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  HStack,
  Slider,
} from "@gunjo/ui";

export function SliderDemo() {
  const [value, setValue] = React.useState(64);

  return (
    <FormGroup className="w-full max-w-sm">
      <HStack justify="between">
        <FormLabel htmlFor="volume">Volume</FormLabel>
        <span className="font-mono text-sm text-muted-foreground">{value}%</span>
      </HStack>
      <FormControl>
        <Slider
          id="volume"
          value={value}
          onValueChange={setValue}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </FormControl>
      <FormDescription>Show the current value beside the label while dragging.</FormDescription>
    </FormGroup>
  );
}`;

    const usageCode = locale === "ja"
        ? `import * as React from "react";
import { FormControl, FormGroup, FormLabel, HStack, Slider } from "@gunjo/ui";

export function VolumeField() {
  const [value, setValue] = React.useState(60);

  return (
    <FormGroup className="w-full max-w-sm">
      <HStack justify="between">
        <FormLabel htmlFor="volume">音量</FormLabel>
        <span className="font-mono text-sm text-muted-foreground">{value}%</span>
      </HStack>
      <FormControl>
        <Slider
          id="volume"
          value={value}
          onValueChange={setValue}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </FormControl>
    </FormGroup>
  );
}`
        : `import * as React from "react";
import { FormControl, FormGroup, FormLabel, HStack, Slider } from "@gunjo/ui";

export function VolumeField() {
  const [value, setValue] = React.useState(60);

  return (
    <FormGroup className="w-full max-w-sm">
      <HStack justify="between">
        <FormLabel htmlFor="volume">Volume</FormLabel>
        <span className="font-mono text-sm text-muted-foreground">{value}%</span>
      </HStack>
      <FormControl>
        <Slider
          id="volume"
          value={value}
          onValueChange={setValue}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </FormControl>
    </FormGroup>
  );
}`;

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
                            code: locale === "ja"
                                ? `import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  HStack,
  Slider,
} from "@gunjo/ui";

export function StepLabelSlider() {
  const labels = ["低", "標準", "高", "最高"];
  const [value, setValue] = React.useState(2);

  return (
    <FormGroup className="w-full max-w-sm">
      <HStack justify="between">
        <FormLabel htmlFor="quality-slider">品質</FormLabel>
        <span className="font-mono text-sm text-muted-foreground">{labels[value]}</span>
      </HStack>
      <FormControl>
        <Slider
          id="quality-slider"
          value={value}
          onValueChange={setValue}
          min={0}
          max={labels.length - 1}
          step={1}
          className="w-full"
        />
      </FormControl>
      <FormDescription className="flex justify-between text-[11px]">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </FormDescription>
    </FormGroup>
  );
}`
                                : `import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  HStack,
  Slider,
} from "@gunjo/ui";

export function StepLabelSlider() {
  const labels = ["Low", "Standard", "High", "Lossless"];
  const [value, setValue] = React.useState(2);

  return (
    <FormGroup className="w-full max-w-sm">
      <HStack justify="between">
        <FormLabel htmlFor="quality-slider">Quality</FormLabel>
        <span className="font-mono text-sm text-muted-foreground">{labels[value]}</span>
      </HStack>
      <FormControl>
        <Slider
          id="quality-slider"
          value={value}
          onValueChange={setValue}
          min={0}
          max={labels.length - 1}
          step={1}
          className="w-full"
        />
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
                            code: locale === "ja"
                                ? `import { FormControl, FormDescription, FormGroup, FormLabel, HStack, Slider, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export function DisabledSlider() {
  return (
    <FormGroup className="w-full max-w-sm">
      <HStack justify="between">
        <FormLabel htmlFor="volume-slider">音量</FormLabel>
        <span className="font-mono text-sm text-muted-foreground">64%</span>
      </HStack>
      <FormControl>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block w-full" tabIndex={0}>
              <Slider
                id="volume-slider"
                value={64}
                min={0}
                max={100}
                step={1}
                disabled
                className="w-full"
              />
            </span>
          </TooltipTrigger>
          <TooltipContent>管理者が音量を固定しています。</TooltipContent>
        </Tooltip>
      </FormControl>
      <FormDescription>この設定は現在変更できません。</FormDescription>
    </FormGroup>
  );
}`
                                : `import { FormControl, FormDescription, FormGroup, FormLabel, HStack, Slider, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export function DisabledSlider() {
  return (
    <FormGroup className="w-full max-w-sm">
      <HStack justify="between">
        <FormLabel htmlFor="volume-slider">Volume</FormLabel>
        <span className="font-mono text-sm text-muted-foreground">64%</span>
      </HStack>
      <FormControl>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block w-full" tabIndex={0}>
              <Slider
                id="volume-slider"
                value={64}
                min={0}
                max={100}
                step={1}
                disabled
                className="w-full"
              />
            </span>
          </TooltipTrigger>
          <TooltipContent>Volume is locked by your administrator.</TooltipContent>
        </Tooltip>
      </FormControl>
      <FormDescription>This setting cannot be changed right now.</FormDescription>
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
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>現在値の表示は、既定では出さない。</strong>資料は「Slider を使うなら常に現在値を数値で出す」を挙げています。GUNJO は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showValue</code> を渡したときだけ出します。ラベルと値を上の行に並べる形が、置く場所によっては入らないからです。出さない選択をした画面でも、値そのものは近くのどこかに要ります。
                        </li>
                        <li>
                            <strong>読み上げの文言を差し替えられるようにした。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">formatValue</code> を渡すと、その結果が <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-valuetext</code> に入ります。35000000ではなく通貨の形で読ませるためです（#193）。同じ関数が <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showValue</code> の表示にも使われるので、目で見る値と読み上げの値がずれません。
                        </li>
                        <li>
                            <strong>通った部分の塗りは、クラスではなく style で作る。</strong>つまみまでの塗りつぶしは、インラインの <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">linear-gradient</code> で描いています。クラス名の一覧を変えずに済ませるためで、設計の元データとの差分検査がクラス名を見ているからです（#193）。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">value</code> を渡さない使い方でも塗りが追いつくように、部品の中で最後の値を覚えています。2つのつまみで範囲を選ぶ形は、この部品ではなく <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">RangeSlider</code> が持ちます。
                            <br />
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
                            <strong>The numeric readout is off by default.</strong> The article asks that a slider always show its current value as a number. GUNJO shows it only when <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showValue</code> is passed, because the label-and-value row does not always fit where the slider is placed. A screen that turns it off still owes the reader that number somewhere nearby.
                        </li>
                        <li>
                            <strong>The announced value can be rewritten.</strong> Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">formatValue</code> and its result becomes <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-valuetext</code>, so a screen reader says a formatted amount rather than 35000000 (#193). The same function feeds <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showValue</code>, so what is read and what is seen cannot drift apart.
                        </li>
                        <li>
                            <strong>The filled part of the track is inline style, not a class.</strong> The fill up to the thumb is drawn with an inline <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">linear-gradient</code>, which keeps the class list, and therefore the drift check against the design source, unchanged (#193). The component remembers the last value internally so the fill still follows the thumb when no <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">value</code> is passed. A two-handle range lives in <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">RangeSlider</code>, not here.
                            <br />
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
