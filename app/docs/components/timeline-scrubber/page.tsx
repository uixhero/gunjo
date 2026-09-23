"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import { Label, Slider, TimelineScrubber, type TimelineScrubberStep } from "@gunjo/ui";

type Locale = "ja" | "en";

/** 09:00 to 13:00 every 5 minutes: 49 frames, a label every 30 minutes. */
function makeSteps(pendingFrom = Infinity): TimelineScrubberStep[] {
    return Array.from({ length: 49 }, (_, i) => {
        const minutes = 9 * 60 + i * 5;
        const label = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
        return { label, major: minutes % 30 === 0, pending: i >= pendingFrom };
    });
}

const STEPS = makeSteps();
/** 11:00 is the last measured frame. */
const LAST_OBSERVED = 24;

function labelsFor(locale: Locale) {
    return locale === "ja"
        ? { scrubber: "時刻", observed: "実況", forecast: "予報", play: "再生", pause: "一時停止" }
        : { scrubber: "Time", observed: "Observed", forecast: "Forecast", play: "Play", pause: "Pause" };
}

function ScrubberDemo({ locale }: { locale: Locale }) {
    const isJa = locale === "ja";
    const [value, setValue] = React.useState(LAST_OBSERVED);
    const [lastObserved, setLastObserved] = React.useState(LAST_OBSERVED);
    return (
        <div className="flex w-full flex-col gap-5">
            <div className="rounded-xl border border-transparent contrast-more:border-border forced-colors:border-[CanvasText] bg-card px-3 pb-2 pt-3">
                <TimelineScrubber
                    steps={STEPS}
                    value={value}
                    onValueChange={setValue}
                    lastObservedIndex={lastObserved}
                    labels={labelsFor(locale)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="timeline-scrubber-boundary">
                    {isJa ? "実況の最後の時刻" : "Last observed frame"}: {STEPS[lastObserved].label}
                </Label>
                <Slider
                    id="timeline-scrubber-boundary"
                    min={0}
                    max={STEPS.length - 1}
                    step={1}
                    value={lastObserved}
                    onValueChange={setLastObserved}
                />
            </div>
        </div>
    );
}

function StaticScrubber({
    locale,
    value,
    lastObservedIndex,
    steps = STEPS,
    showHeader,
}: {
    locale: Locale;
    value: number;
    lastObservedIndex?: number;
    steps?: TimelineScrubberStep[];
    showHeader?: boolean;
}) {
    const [current, setCurrent] = React.useState(value);
    return (
        <div className="w-full max-w-md rounded-xl border border-transparent contrast-more:border-border forced-colors:border-[CanvasText] bg-card px-3 pb-2 pt-3">
            <TimelineScrubber
                steps={steps}
                value={current}
                onValueChange={setCurrent}
                lastObservedIndex={lastObservedIndex}
                showHeader={showHeader}
                labels={labelsFor(locale)}
            />
        </div>
    );
}

const CODE = {
    usage: {
        ja: `"use client";

import * as React from "react";
import { TimelineScrubber } from "@gunjo/ui";

// 09:00 から 13:00 まで5分ごと（49コマ）。30分ごとに字を出します。
const STEPS = Array.from({ length: 49 }, (_, i) => {
  const minutes = 9 * 60 + i * 5;
  const label = \`\${String(Math.floor(minutes / 60)).padStart(2, "0")}:\${String(minutes % 60).padStart(2, "0")}\`;
  return { label, major: minutes % 30 === 0 };
});

export function RainTimeline() {
  // 11:00（24番目）までが実況、その先が予報です。
  const [value, setValue] = React.useState(24);
  return (
    <TimelineScrubber
      steps={STEPS}
      value={value}
      onValueChange={setValue}
      lastObservedIndex={24}
      labels={{ scrubber: "時刻", observed: "実況", forecast: "予報", play: "再生", pause: "一時停止" }}
    />
  );
}`,
        en: `"use client";

import * as React from "react";
import { TimelineScrubber } from "@gunjo/ui";

// 09:00 to 13:00 every 5 minutes (49 frames), a label every 30 minutes.
const STEPS = Array.from({ length: 49 }, (_, i) => {
  const minutes = 9 * 60 + i * 5;
  const label = \`\${String(Math.floor(minutes / 60)).padStart(2, "0")}:\${String(minutes % 60).padStart(2, "0")}\`;
  return { label, major: minutes % 30 === 0 };
});

export function RainTimeline() {
  // Frames up to 11:00 (index 24) are observed; later ones are a forecast.
  const [value, setValue] = React.useState(24);
  return (
    <TimelineScrubber
      steps={STEPS}
      value={value}
      onValueChange={setValue}
      lastObservedIndex={24}
      labels={{ scrubber: "Time", observed: "Observed", forecast: "Forecast", play: "Play", pause: "Pause" }}
    />
  );
}`,
    },
    forecast: {
        ja: `"use client";

import * as React from "react";
import { TimelineScrubber } from "@gunjo/ui";

// 09:00 から 13:00 まで5分ごと（49コマ）。30分ごとに字を出します。
const STEPS = Array.from({ length: 49 }, (_, i) => {
  const minutes = 9 * 60 + i * 5;
  const label = \`\${String(Math.floor(minutes / 60)).padStart(2, "0")}:\${String(minutes % 60).padStart(2, "0")}\`;
  return { label, major: minutes % 30 === 0 };
});

export function ForecastSide() {
  const [value, setValue] = React.useState(30);
  return (
    <TimelineScrubber steps={STEPS} value={value} onValueChange={setValue} lastObservedIndex={24} labels={{ scrubber: "時刻", observed: "実況", forecast: "予報", play: "再生", pause: "一時停止" }} />
  );
}`,
        en: `"use client";

import * as React from "react";
import { TimelineScrubber } from "@gunjo/ui";

// 09:00 to 13:00 every 5 minutes (49 frames), a label every 30 minutes.
const STEPS = Array.from({ length: 49 }, (_, i) => {
  const minutes = 9 * 60 + i * 5;
  const label = \`\${String(Math.floor(minutes / 60)).padStart(2, "0")}:\${String(minutes % 60).padStart(2, "0")}\`;
  return { label, major: minutes % 30 === 0 };
});

export function ForecastSide() {
  const [value, setValue] = React.useState(30);
  return (
    <TimelineScrubber steps={STEPS} value={value} onValueChange={setValue} lastObservedIndex={24} labels={{ scrubber: "Time", observed: "Observed", forecast: "Forecast", play: "Play", pause: "Pause" }} />
  );
}`,
    },
    pending: {
        ja: `"use client";

import * as React from "react";
import { TimelineScrubber } from "@gunjo/ui";

// 09:00 から 13:00 まで5分ごと（49コマ）。30分ごとに字を出します。
const STEPS = Array.from({ length: 49 }, (_, i) => {
  const minutes = 9 * 60 + i * 5;
  const label = \`\${String(Math.floor(minutes / 60)).padStart(2, "0")}:\${String(minutes % 60).padStart(2, "0")}\`;
  return { label, major: minutes % 30 === 0, pending: i >= 28 };
});

export function StillLoading() {
  const [value, setValue] = React.useState(24);
  return (
    <TimelineScrubber steps={STEPS} value={value} onValueChange={setValue} lastObservedIndex={24} labels={{ scrubber: "時刻", observed: "実況", forecast: "予報", play: "再生", pause: "一時停止" }} />
  );
}`,
        en: `"use client";

import * as React from "react";
import { TimelineScrubber } from "@gunjo/ui";

// 09:00 to 13:00 every 5 minutes (49 frames), a label every 30 minutes.
const STEPS = Array.from({ length: 49 }, (_, i) => {
  const minutes = 9 * 60 + i * 5;
  const label = \`\${String(Math.floor(minutes / 60)).padStart(2, "0")}:\${String(minutes % 60).padStart(2, "0")}\`;
  return { label, major: minutes % 30 === 0, pending: i >= 28 };
});

export function StillLoading() {
  const [value, setValue] = React.useState(24);
  return (
    <TimelineScrubber steps={STEPS} value={value} onValueChange={setValue} lastObservedIndex={24} labels={{ scrubber: "Time", observed: "Observed", forecast: "Forecast", play: "Play", pause: "Pause" }} />
  );
}`,
    },
    bare: {
        ja: `"use client";

import * as React from "react";
import { TimelineScrubber } from "@gunjo/ui";

// 09:00 から 13:00 まで5分ごと（49コマ）。30分ごとに字を出します。
const STEPS = Array.from({ length: 49 }, (_, i) => {
  const minutes = 9 * 60 + i * 5;
  const label = \`\${String(Math.floor(minutes / 60)).padStart(2, "0")}:\${String(minutes % 60).padStart(2, "0")}\`;
  return { label, major: minutes % 30 === 0 };
});

export function ScaleOnly() {
  const [value, setValue] = React.useState(12);
  return (
    <TimelineScrubber steps={STEPS} value={value} onValueChange={setValue} showHeader={false} labels={{ scrubber: "時刻", observed: "実況", forecast: "予報", play: "再生", pause: "一時停止" }} />
  );
}`,
        en: `"use client";

import * as React from "react";
import { TimelineScrubber } from "@gunjo/ui";

// 09:00 to 13:00 every 5 minutes (49 frames), a label every 30 minutes.
const STEPS = Array.from({ length: 49 }, (_, i) => {
  const minutes = 9 * 60 + i * 5;
  const label = \`\${String(Math.floor(minutes / 60)).padStart(2, "0")}:\${String(minutes % 60).padStart(2, "0")}\`;
  return { label, major: minutes % 30 === 0 };
});

export function ScaleOnly() {
  const [value, setValue] = React.useState(12);
  return (
    <TimelineScrubber steps={STEPS} value={value} onValueChange={setValue} showHeader={false} labels={{ scrubber: "Time", observed: "Observed", forecast: "Forecast", play: "Play", pause: "Pause" }} />
  );
}`,
    },
} as const;

export default function TimelineScrubberDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const content = getDocContent("components/timeline-scrubber", locale);
    const metadata = inputsMetadata as Record<string, { title?: string; description?: string }>;
    const title = content?.title ?? metadata.timelineScrubber.title ?? "TimelineScrubber";
    const description = content?.description ?? metadata.timelineScrubber.description ?? "";
    const lang = isJa ? "ja" : "en";
    const usageCode = CODE.usage[lang];

    const propsData = [
        { name: "steps", type: "TimelineScrubberStep[]", required: true, description: isJa ? "古い順に並べたコマ（1つの時刻ぶんのデータ）。{ label, major?, pending? }。" : "Frames, oldest first: { label, major?, pending? }." },
        { name: "value", type: "number", required: true, description: isJa ? "いま見せているコマの番号。" : "Index of the frame being shown." },
        { name: "onValueChange", type: "(index: number) => void", required: true, description: isJa ? "見ているコマが変わったとき（ドラッグ・キー操作・再生のどれでも）に呼ばれます。" : "Called when the frame changes." },
        { name: "lastObservedIndex", type: "number", description: isJa ? "実況の最後のコマ。その先は予報として描きます。" : "Last measured frame; later ones are drawn as a forecast." },
        { name: "playing", type: "boolean", description: isJa ? "再生中か。渡さなければコンポーネントの内部で管理します。" : "Controlled playback; omit to let it keep its own." },
        { name: "onPlayingChange", type: "(playing: boolean) => void", description: isJa ? "再生・停止が変わったとき。" : "Called when playback starts or stops." },
        { name: "stepInterval", type: "number", default: "300", description: isJa ? "再生で1コマ進める間隔（ms）。" : "Milliseconds per frame while playing." },
        { name: "playable", type: "boolean", default: "true", description: isJa ? "再生ボタンを出すか。" : "Show the play button." },
        { name: "stepWidth", type: "number", default: "28", description: isJa ? "目盛りの間隔（px）。" : "Distance between ticks, in px." },
        { name: "pageStep", type: "number", default: "6", description: isJa ? "PageUp / PageDown で動くコマ数。" : "Frames moved by PageUp / PageDown." },
        { name: "showHeader", type: "boolean", default: "true", description: isJa ? "上の行（実況か予報かのラベル・時刻・再生ボタン）を出すか。" : "Show the row above (side, time, play)." },
        { name: "labels", type: "TimelineScrubberLabels", description: isJa ? "スクリーンリーダーが読み上げる名前と、画面に出す語（実況・予報・再生など）。" : "Accessible name and the words for each side and play." },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Badge", href: "/docs/components/badge" },
                { name: "Button", href: "/docs/components/button" },
            ]}
            relatedComponents={[
                {
                    name: "TimeTransport",
                    href: "/docs/components/time-transport",
                    boundary: isJa ? "時刻を連続で動かし、再生速度を切り替えられる。TimelineScrubber はコマ単位で動く。" : "A continuous clock with speeds; this steps frames.",
                },
                {
                    name: "DayBand",
                    href: "/docs/components/day-band",
                    boundary: isJa ? "1日の帯の上でつまみが動く。中央固定ではない。" : "One day; the thumb moves, the centre does not stay.",
                },
                {
                    name: "Slider",
                    href: "/docs/components/slider",
                    boundary: isJa ? "値を1つ選ぶだけ。実況と予報の境目も再生も無い。" : "Picks a value; no boundary, no playback.",
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
                <ScrubberDemo locale={locale as Locale} />
            </ComponentPreview>


            <section className="space-y-4">
                <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {isJa ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "forecast",
                            title: isJa ? "予報の側にいる" : "On the forecast side",
                            description: isJa
                                ? "境目より先のコマを見ているときは、上のラベルが「予報」になり、中央の印と目盛りの色が変わります。"
                                : "Past the boundary, the badge reads Forecast and the centre marker and ticks change colour. The word and the dashed boundary say it too, not colour alone.",
                            preview: <StaticScrubber locale={locale as Locale} value={30} lastObservedIndex={LAST_OBSERVED} />,
                            code: CODE.forecast[lang],
                        },
                        {
                            key: "pending",
                            title: isJa ? "まだ読み込んでいないコマ" : "Frames not loaded yet",
                            description: isJa
                                ? "pending のコマは目盛りを薄く描きます。選ぶことはできます。届いた順に濃くなるので、どこまで見られるかが分かります。"
                                : "Pending frames are drawn faint and can still be selected. They darken as they arrive, so the reader sees how far is ready.",
                            preview: <StaticScrubber locale={locale as Locale} value={24} lastObservedIndex={LAST_OBSERVED} steps={makeSteps(28)} />,
                            code: CODE.pending[lang],
                        },
                        {
                            key: "bare",
                            title: isJa ? "目盛りだけ" : "The scale only",
                            description: isJa
                                ? "時刻と再生ボタンを画面の別の場所に置くなら、showHeader={false} で上の行を外します。境目が無ければ lastObservedIndex を渡しません。"
                                : "When the time and play live elsewhere, showHeader={false} drops the top row. With no forecast, leave lastObservedIndex out.",
                            preview: <StaticScrubber locale={locale as Locale} value={12} showHeader={false} />,
                            code: CODE.bare[lang],
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
                <div className="max-h-[350px] overflow-auto rounded-md border border-transparent contrast-more:border-border forced-colors:border-[CanvasText] bg-muted font-mono text-sm">
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
                            <strong>中央の印は動かさず、目盛りのほうを動かします。</strong>
                            見ている時刻が、いつも目を置いている場所にあります。両端はぼかして、まだ先があることを示します。
                        </li>
                        <li>
                            <strong>実況と予報は3つの手がかりで分けます。</strong>
                            上のラベルの語・境目の点線・色の3つです。
                        </li>
                        <li>
                            <strong>端末の時計（現在時刻）は参照しません。</strong>
                            自分で進めるのは、再生中のコマ送りだけです。「いま」がどのコマかは呼び出し側が渡します。
                        </li>
                        <li>
                            <strong>縦にスワイプすると、ページがスクロールします。</strong>
                            横の動きだけを目盛りが受け取ります（touch-action: pan-y）。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>The centre stays; the scale moves.</strong> The moment you are looking at stays where
                            your eye already is. The ends fade to say there is more.
                        </li>
                        <li>
                            <strong>Observed and forecast are told apart three ways.</strong> The word on the badge, the
                            dashed boundary and colour. Never colour alone.
                        </li>
                        <li>
                            <strong>No clock.</strong> It owns only the timer that steps frames while playing. Which
                            frame is “now” is the caller’s decision.
                        </li>
                        <li>
                            <strong>A vertical swipe still scrolls the page.</strong> The scale takes only horizontal
                            movement (touch-action: pan-y).
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
