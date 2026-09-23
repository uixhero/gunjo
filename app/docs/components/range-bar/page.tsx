"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { RangeBarRampFigure } from "@/components/doc/MapPartsFigures";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Label, RangeBar, RangeSlider, SegmentedControl } from "@gunjo/ui";

type Locale = "ja" | "en";

const WEEK = {
    ja: ["今日", "あす", "月曜", "火曜", "水曜"],
    en: ["Today", "Tomorrow", "Mon", "Tue", "Wed"],
};
const TEMPS: Array<[number, number]> = [
    [26, 26],
    [21, 24],
    [20, 28],
    [22, 32],
    [20, 27],
];

function WeekDemo({ locale }: { locale: Locale }) {
    const isJa = locale === "ja";
    const [today, setToday] = React.useState<[number, number]>([23, 29]);
    const [variant, setVariant] = React.useState<"gradient" | "solid">("gradient");
    const rows = TEMPS.map((pair, i) => (i === 0 ? today : pair));
    const min = Math.min(...rows.map((r) => r[0]));
    const max = Math.max(...rows.map((r) => r[1]));

    return (
        <div className="flex w-full flex-col gap-5">
            <ul className="divide-y rounded-lg border">
                {rows.map(([low, high], i) => (
                    <li key={WEEK[locale][i]} className="grid grid-cols-[4.5rem_2rem_minmax(0,1fr)_2rem] items-center gap-2 px-4 py-2.5 text-sm">
                        <span className="font-medium">{WEEK[locale][i]}</span>
                        <span className="text-right font-mono tabular-nums text-muted-foreground">{low}°</span>
                        <RangeBar
                            min={min}
                            max={max}
                            low={low}
                            high={high}
                            variant={variant}
                            label={isJa ? `${WEEK.ja[i]}の気温` : `${WEEK.en[i]} temperature`}
                            unit="°"
                        />
                        <span className="font-mono tabular-nums">{high}°</span>
                    </li>
                ))}
            </ul>
            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label>{isJa ? "今日の最低・最高" : "Today's low and high"}</Label>
                    <RangeSlider min={10} max={38} step={1} value={today} onValueChange={setToday} />
                </div>
                <div className="space-y-2">
                    <Label>{isJa ? "塗り方" : "Fill"}</Label>
                    <SegmentedControl
                        value={variant}
                        onValueChange={(next) => setVariant(next as "gradient" | "solid")}
                        options={[
                            { value: "gradient", label: isJa ? "グラデーション" : "Gradient" },
                            { value: "solid", label: isJa ? "単色" : "Solid" },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

export default function RangeBarDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const content = getDocContent("components/range-bar", locale);
    const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
    const title = content?.title ?? metadata.rangeBar.title ?? "RangeBar";
    const description = content?.description ?? metadata.rangeBar.description ?? "";

    const usageCode = isJa
        ? `import { RangeBar } from "@gunjo/ui";

const WEEK = [
  { day: "今日", low: 26, high: 26 },
  { day: "あす", low: 21, high: 24 },
  { day: "月曜", low: 20, high: 28 },
  { day: "火曜", low: 22, high: 32 },
];

// 全部の行で同じ min / max を使うと、帯の位置で比べられます。
const MIN = Math.min(...WEEK.map((d) => d.low));
const MAX = Math.max(...WEEK.map((d) => d.high));

export function WeeklyTemperatures() {
  return (
    <ul className="divide-y rounded-lg border">
      {WEEK.map((d) => (
        <li key={d.day} className="grid grid-cols-[4.5rem_2rem_1fr_2rem] items-center gap-2 px-4 py-2.5 text-sm">
          <span>{d.day}</span>
          <span className="text-right font-mono">{d.low}°</span>
          <RangeBar min={MIN} max={MAX} low={d.low} high={d.high} variant="gradient" label={\`\${d.day}の気温\`} unit="°" />
          <span className="font-mono">{d.high}°</span>
        </li>
      ))}
    </ul>
  );
}`
        : `import { RangeBar } from "@gunjo/ui";

const WEEK = [
  { day: "Today", low: 26, high: 26 },
  { day: "Tomorrow", low: 21, high: 24 },
  { day: "Mon", low: 20, high: 28 },
  { day: "Tue", low: 22, high: 32 },
];

// Every row shares min / max, so the rows line up and compare by position.
const MIN = Math.min(...WEEK.map((d) => d.low));
const MAX = Math.max(...WEEK.map((d) => d.high));

export function WeeklyTemperatures() {
  return (
    <ul className="divide-y rounded-lg border">
      {WEEK.map((d) => (
        <li key={d.day} className="grid grid-cols-[4.5rem_2rem_1fr_2rem] items-center gap-2 px-4 py-2.5 text-sm">
          <span>{d.day}</span>
          <span className="text-right font-mono">{d.low}°</span>
          <RangeBar min={MIN} max={MAX} low={d.low} high={d.high} variant="gradient" label={\`\${d.day} temperature\`} unit="°" />
          <span className="font-mono">{d.high}°</span>
        </li>
      ))}
    </ul>
  );
}`;

    const propsData = [
        { name: "min", type: "number", required: true, description: isJa ? "全体の左端の値。帯を何行か並べるときは、すべての行で同じ値にします。" : "Left end of the whole scale; the same on every row." },
        { name: "max", type: "number", required: true, description: isJa ? "全体の右端の値。" : "Right end of the whole scale." },
        { name: "low", type: "number | null", required: true, description: isJa ? "この行の区間の始まり（最低値）。分からなければ null。" : "Lower end of this row; null while unknown." },
        { name: "high", type: "number | null", required: true, description: isJa ? "この行の区間の終わり（最高値）。" : "Upper end of this row." },
        {
            name: "variant",
            type: '"solid" | "gradient"',
            default: '"solid"',
            description: isJa ? "gradient は全体の幅にグラデーションを1本描き、区間の外を隠します。" : "gradient lays one ramp across the whole scale and shows the covered part.",
        },
        { name: "label", type: "string", default: '"Range"', description: isJa ? "スクリーンリーダーが読み上げる文の先頭に付ける語。" : "Prefix of the accessible name." },
        { name: "unit", type: "string", description: isJa ? "読み上げで両端の値に付ける単位（\"°\"）。" : "Unit added to both ends when read aloud (\"°\")." },
        { name: "valueText", type: "string", description: isJa ? "読み上げる値の文を丸ごと差し替えます。" : "Replaces the whole accessible value text." },
    ];

    const oneRow = (low: number | null, high: number | null, variant: "solid" | "gradient" = "gradient") => (
        <div className="grid w-full max-w-md grid-cols-[2rem_minmax(0,1fr)_2rem] items-center gap-2 text-sm">
            <span className="text-right font-mono text-muted-foreground">{low ?? "—"}</span>
            <RangeBar min={10} max={35} low={low} high={high} variant={variant} label={isJa ? "気温" : "Temperature"} unit="°" />
            <span className="font-mono">{high ?? "—"}</span>
        </div>
    );

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[]}
            relatedComponents={[
                {
                    name: "Meter",
                    href: "/docs/components/meter",
                    boundary: isJa ? "0 から1つの値まで。区間の始まりを持たない。" : "One value from zero; no start of a range.",
                },
                {
                    name: "DistributionBar",
                    href: "/docs/components/distribution-bar",
                    boundary: isJa ? "合計100%の内訳。全体の中の位置ではない。" : "Shares adding up to 100%, not a position.",
                },
                {
                    name: "RangeSlider",
                    href: "/docs/components/range-slider",
                    boundary: isJa ? "つまみで区間を選ぶ入力。RangeBar は見せるだけで操作はできない。" : "An input with thumbs; this only shows.",
                },
            ]}
        >
            <ComponentPreview
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                previewHeight="auto"
                previewBodyWidth="md"
            >
                <WeekDemo locale={locale as Locale} />
            </ComponentPreview>

            <RangeBarRampFigure locale={locale as Locale} />

            <section className="space-y-4">
                <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {isJa ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "gradient-solid",
                            title: isJa ? "グラデーションと単色" : "Gradient and solid",
                            description: isJa
                                ? "gradient は、全体の幅に低い値から高い値へ変わるグラデーションを1本描き、区間の外を隠します。同じ値はどの行でも同じ色になります。solid はテーマの主色（プライマリ色）1色で塗ります。"
                                : "gradient lays one low-to-high ramp across the whole scale and shows the covered part, so a value is the same colour on every row. solid fills with the primary colour.",
                            preview: (
                                <div className="flex w-full flex-col items-center gap-3">
                                    {oneRow(14, 22)}
                                    {oneRow(20, 28)}
                                    {oneRow(20, 28, "solid")}
                                </div>
                            ),
                            code: isJa
                                ? `import { RangeBar } from "@gunjo/ui";

export function Fills() {
  return (
    <div className="flex flex-col gap-3">
      <RangeBar min={10} max={35} low={14} high={22} variant="gradient" label="気温" unit="°" />
      <RangeBar min={10} max={35} low={20} high={28} variant="gradient" label="気温" unit="°" />
      <RangeBar min={10} max={35} low={20} high={28} variant="solid" label="気温" unit="°" />
    </div>
  );
}`
                                : `import { RangeBar } from "@gunjo/ui";

export function Fills() {
  return (
    <div className="flex flex-col gap-3">
      <RangeBar min={10} max={35} low={14} high={22} variant="gradient" label="Temperature" unit="°" />
      <RangeBar min={10} max={35} low={20} high={28} variant="gradient" label="Temperature" unit="°" />
      <RangeBar min={10} max={35} low={20} high={28} variant="solid" label="Temperature" unit="°" />
    </div>
  );
}`,
                        },
                        {
                            key: "equal",
                            title: isJa ? "両端が同じ" : "Equal ends",
                            description: isJa
                                ? "最低と最高が同じでも、帯の太さと同じ直径の丸を1つ出します。「26° から 26°」は値が無いのではなく、幅がゼロの区間だからです。"
                                : "When both ends are equal it still draws a dot as tall as the track: “26° to 26°” is an answer, not a gap.",
                            preview: <div className="flex w-full justify-center">{oneRow(26, 26)}</div>,
                            code: isJa
                                ? `import { RangeBar } from "@gunjo/ui";

export function OneValue() {
  return <RangeBar min={10} max={35} low={26} high={26} variant="gradient" label="気温" unit="°" />;
}`
                                : `import { RangeBar } from "@gunjo/ui";

export function OneValue() {
  return <RangeBar min={10} max={35} low={26} high={26} variant="gradient" label="Temperature" unit="°" />;
}`,
                        },
                        {
                            key: "unknown",
                            title: isJa ? "まだ分からない" : "Not known yet",
                            description: isJa
                                ? "low か high が null のあいだは、背景の帯だけを出します。"
                                : "While low or high is null only the track is drawn; a guessed range is never shown.",
                            preview: <div className="flex w-full justify-center">{oneRow(null, null)}</div>,
                            code: isJa
                                ? `import { RangeBar } from "@gunjo/ui";

export function NotYet() {
  return <RangeBar min={10} max={35} low={null} high={null} label="気温" />;
}`
                                : `import { RangeBar } from "@gunjo/ui";

export function NotYet() {
  return <RangeBar min={10} max={35} low={null} high={null} label="Temperature" />;
}`,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 pb-2">
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
                <div className="pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {isJa ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {isJa ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>数字は帯の外に置きます。</strong>
                            両端の数字の幅や並べ方は画面ごとに違うので、呼び出し側が決めます。
                        </li>
                        <li>
                            <strong>グラデーションは区間ではなく全体の幅に描きます。</strong>
                            区間ごとにグラデーションをやり直すと、20° が行ごとに違う色になり、色で比べられなくなります。
                        </li>
                        <li>
                            <strong>Meter に始点を足すやり方は採りませんでした。</strong>
                            Meter は「0 から1つの値まで」を読み上げるコンポーネントで、始点を持たせると、見た目と読み上げる内容が合わなくなります。
                        </li>
                        <li>
                            <strong>SVG ではなく、HTML の要素に clip-path を掛けて描きます。</strong>
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>The numbers stay outside.</strong> The component is only the line; how wide the
                            numbers are and where they go differs by screen, so the caller decides.
                        </li>
                        <li>
                            <strong>The gradient spans the whole scale, not the range.</strong> Restarting the ramp
                            inside each range would paint 20° a different colour on every row.
                        </li>
                        <li>
                            <strong>Not a Meter with a start.</strong> A meter reads as one value from zero; a start
                            point would make the picture and what it announces disagree.
                        </li>
                        <li>
                            <strong>HTML, not SVG.</strong> A clip-path on an HTML layer draws the range.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
