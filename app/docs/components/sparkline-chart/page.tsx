"use client";

import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import * as React from "react";
import { AnalyticsCard, Label, Slider, SparklineChart } from "@gunjo/ui";
import { UIXHERO_BASE_URL, type UixheroLink } from "@/lib/uixhero-links";

type Locale = "en" | "ja";
const dataByLocale = {
    en: [
        { label: "Jan", value: 24 },
        { label: "Feb", value: 28 },
        { label: "Mar", value: 22 },
        { label: "Apr", value: 36 },
        { label: "May", value: 32 },
        { label: "Jun", value: 44 },
        { label: "Jul", value: 39 },
        { label: "Aug", value: 52 },
        { label: "Sep", value: 48 },
        { label: "Oct", value: 57 },
        { label: "Nov", value: 51 },
        { label: "Dec", value: 64 },
    ],
    ja: [
        { label: "1月", value: 24 },
        { label: "2月", value: 28 },
        { label: "3月", value: 22 },
        { label: "4月", value: 36 },
        { label: "5月", value: 32 },
        { label: "6月", value: 44 },
        { label: "7月", value: 39 },
        { label: "8月", value: 52 },
        { label: "9月", value: 48 },
        { label: "10月", value: 57 },
        { label: "11月", value: 51 },
        { label: "12月", value: 64 },
    ],
};

/** 31 days, 15 either side of today: the distance to the Moon swings about 25,000 km. */
const moonDays = Array.from({ length: 31 }, (_, i) => ({
    offset: i - 15,
    value: Math.round(384_400 + 21_000 * Math.sin(((i - 15 + 4) / 27.3) * 2 * Math.PI)),
}));

function dayLabel(offset: number, locale: Locale) {
    if (offset === 0) return locale === "ja" ? "今日" : "Today";
    if (locale === "ja") return offset < 0 ? `${-offset}日前` : `${offset}日後`;
    return offset < 0 ? `${-offset} days ago` : `in ${offset} days`;
}

/** R: a KPI card whose trend marks where "now" sits. The slider moves it. */
function CurrentPointDemo({ locale }: { locale: Locale }) {
    const isJa = locale === "ja";
    const [current, setCurrent] = React.useState(15);
    const data = moonDays.map((day) => ({ label: dayLabel(day.offset, locale), value: day.value }));
    const value = moonDays[current].value;
    return (
        <div className="flex w-full max-w-sm flex-col gap-4">
            <AnalyticsCard
                titleAs="p"
                title={isJa ? "地球から月までの距離" : "Distance to the Moon"}
                value={
                    <span>
                        {value.toLocaleString("en-US")} <span className="text-sm font-normal text-muted-foreground">km</span>
                    </span>
                }
                description={isJa ? "地球の中心から月の中心までの距離。1か月で5万kmほど伸び縮みします。" : "Earth centre to Moon centre; it swings by about 50,000 km a month."}
            >
                <SparklineChart
                    data={data}
                    className="h-16"
                    showGrid={false}
                    currentIndex={current}
                    currentLabel={isJa ? "いま" : "Now"}
                    startLabel={isJa ? "15日前" : "15 days ago"}
                    endLabel={isJa ? "15日後" : "in 15 days"}
                    valueFormat="integer"
                />
            </AnalyticsCard>
            <div className="space-y-2">
                <Label htmlFor="sparkline-current">{isJa ? "いまの位置" : "Current point"}</Label>
                <Slider id="sparkline-current" min={0} max={30} step={1} value={current} onValueChange={setCurrent} />
            </div>
        </div>
    );
}

const currentCode = {
    ja: `import { AnalyticsCard, SparklineChart } from "@gunjo/ui";

// 今日を真ん中に、前後15日ずつ（31点）。
const data = Array.from({ length: 31 }, (_, i) => ({
    label: i === 15 ? "今日" : i < 15 ? \`\${15 - i}日前\` : \`\${i - 15}日後\`,
    value: Math.round(384_400 + 21_000 * Math.sin(((i - 11) / 27.3) * 2 * Math.PI)),
}));

export function MoonDistanceCard() {
    return (
        <AnalyticsCard
            title="地球から月までの距離"
            value="404,148 km"
            description="地球の中心から月の中心までの距離。1か月で5万kmほど伸び縮みします。"
        >
            <SparklineChart
                data={data}
                className="h-16"
                showGrid={false}
                currentIndex={15}
                currentLabel="いま"
                startLabel="15日前"
                endLabel="15日後"
                valueFormat="integer"
            />
        </AnalyticsCard>
    );
}`,
    en: `import { AnalyticsCard, SparklineChart } from "@gunjo/ui";

// Today in the middle, 15 days either side (31 points).
const data = Array.from({ length: 31 }, (_, i) => ({
    label: i === 15 ? "Today" : i < 15 ? \`\${15 - i} days ago\` : \`in \${i - 15} days\`,
    value: Math.round(384_400 + 21_000 * Math.sin(((i - 11) / 27.3) * 2 * Math.PI)),
}));

export function MoonDistanceCard() {
    return (
        <AnalyticsCard
            title="Distance to the Moon"
            value="404,148 km"
            description="Earth centre to Moon centre; it swings by about 50,000 km a month."
        >
            <SparklineChart
                data={data}
                className="h-16"
                showGrid={false}
                currentIndex={15}
                currentLabel="Now"
                startLabel="15 days ago"
                endLabel="in 15 days"
                valueFormat="integer"
            />
        </AnalyticsCard>
    );
}`,
} as const;

const dataCode = {
    en: `const data = [
    { label: "Jan", value: 24 },
    { label: "Feb", value: 28 },
    { label: "Mar", value: 22 },
    { label: "Apr", value: 36 },
    { label: "May", value: 32 },
    { label: "Jun", value: 44 },
    { label: "Jul", value: 39 },
    { label: "Aug", value: 52 },
    { label: "Sep", value: 48 },
    { label: "Oct", value: 57 },
    { label: "Nov", value: 51 },
    { label: "Dec", value: 64 },
];`,
    ja: `const data = [
    { label: "1月", value: 24 },
    { label: "2月", value: 28 },
    { label: "3月", value: 22 },
    { label: "4月", value: 36 },
    { label: "5月", value: 32 },
    { label: "6月", value: 44 },
    { label: "7月", value: 39 },
    { label: "8月", value: 52 },
    { label: "9月", value: 48 },
    { label: "10月", value: 57 },
    { label: "11月", value: 51 },
    { label: "12月", value: 64 },
];`,
} as const;

const code = { en: `import { AnalyticsCard, SparklineChart } from "@gunjo/ui";

const data = [
    { label: "Jan", value: 24 },
    { label: "Feb", value: 28 },
    { label: "Mar", value: 22 },
    { label: "Apr", value: 36 },
    { label: "May", value: 32 },
    { label: "Jun", value: 44 },
    { label: "Jul", value: 39 },
    { label: "Aug", value: 52 },
    { label: "Sep", value: 48 },
    { label: "Oct", value: 57 },
    { label: "Nov", value: 51 },
    { label: "Dec", value: 64 },
];

export function MonthlyTrendCard() {
    return (
        <AnalyticsCard
            title="Revenue trend"
            description="Monthly recurring revenue"
            value="$128,430"
            delta="+12.4%"
            deltaDescription="Change compared with the previous period."
            trend="up"
        >
            <SparklineChart
                data={data}
                variant="area"
                referenceValue={42}
                referenceLabel="Average"
                showDots
                aria-label="Revenue trend"
            />
        </AnalyticsCard>
    );
}`, ja: `import { AnalyticsCard, SparklineChart } from "@gunjo/ui";

const data = [
    { label: "1月", value: 24 },
    { label: "2月", value: 28 },
    { label: "3月", value: 22 },
    { label: "4月", value: 36 },
    { label: "5月", value: 32 },
    { label: "6月", value: 44 },
    { label: "7月", value: 39 },
    { label: "8月", value: 52 },
    { label: "9月", value: 48 },
    { label: "10月", value: 57 },
    { label: "11月", value: 51 },
    { label: "12月", value: 64 },
];

export function MonthlyTrendCard() {
    return (
        <AnalyticsCard
            title="売上トレンド"
            description="月次経常収益"
            value="$128,430"
            delta="+12.4%"
            deltaDescription="前期間との比較です。"
            trend="up"
        >
            <SparklineChart
                data={data}
                variant="area"
                referenceValue={42}
                referenceLabel="平均"
                showDots
                aria-label="売上トレンド"
            />
        </AnalyticsCard>
    );
}` } as const;
const usageCode = { en: `import { SparklineChart } from "@gunjo/ui";

const data = [
    { label: "Jan", value: 24 },
    { label: "Feb", value: 28 },
    { label: "Mar", value: 22 },
    { label: "Apr", value: 36 },
    { label: "May", value: 32 },
    { label: "Jun", value: 44 },
    { label: "Jul", value: 39 },
    { label: "Aug", value: 52 },
    { label: "Sep", value: 48 },
    { label: "Oct", value: 57 },
    { label: "Nov", value: 51 },
    { label: "Dec", value: 64 },
];

export function MonthlyTrendSparklineVariants() {
    return (
        <div className="grid gap-6">
            <SparklineChart data={data} />
            <SparklineChart data={data} variant="area" color="success" />
            <SparklineChart
              data={data}
              variant="step"
              referenceValue={50}
              referenceLabel="Target"
            />
        </div>
    );
}`, ja: `import { SparklineChart } from "@gunjo/ui";

const data = [
    { label: "1月", value: 24 },
    { label: "2月", value: 28 },
    { label: "3月", value: 22 },
    { label: "4月", value: 36 },
    { label: "5月", value: 32 },
    { label: "6月", value: 44 },
    { label: "7月", value: 39 },
    { label: "8月", value: 52 },
    { label: "9月", value: 48 },
    { label: "10月", value: 57 },
    { label: "11月", value: 51 },
    { label: "12月", value: 64 },
];

export function MonthlyTrendSparklineVariants() {
    return (
        <div className="grid gap-6">
            <SparklineChart data={data} />
            <SparklineChart data={data} variant="area" color="success" />
            <SparklineChart
              data={data}
              variant="step"
              referenceValue={50}
              referenceLabel="目標"
            />
        </div>
    );
}` } as const;
const propsData = { en: [{ name: "data", type: "Array<number | { label?: ReactNode; value: number }>", description: "Numeric trend values rendered across the compact chart." }, { name: "variant", type: "\"line\" | \"area\" | \"step\"", default: "\"line\"", description: "Registered SSOT variant for the sparkline shape." }, { name: "referenceValue", type: "number", description: "Optional dashed reference line." }, { name: "formatValue", type: "(value: number) => ReactNode", description: "Formats each value. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Use valueFormat for RSC-safe formatting." }, { name: "valueFormat", type: "\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions", description: "Serializable numeric format — the RSC-safe alternative to formatValue. Ignored when formatValue is set. Fixed en-US locale. (#338)" }, { name: "currentIndex", type: "number", description: "Index of the current point: a dot and a vertical line." }, { name: "currentLabel", type: "ReactNode", default: "\"Current\"", description: "Name of that point, read after its value." }, { name: "startLabel", type: "ReactNode", description: "Small text under the left end." }, { name: "endLabel", type: "ReactNode", description: "Small text under the right end." }], ja: [{ name: "data", type: "Array<number | { label?: ReactNode; value: number }>", description: "コンパクトなチャート幅に表示する数値トレンドです。" }, { name: "variant", type: "\"line\" | \"area\" | \"step\"", default: "\"line\"", description: "線・面・ステップを切り替える SSOT 登録済みバリエーションです。" }, { name: "referenceValue", type: "number", description: "任意の点線基準値です。" }, { name: "formatValue", type: "(value: number) => ReactNode", description: "各値を整形します。関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。RSC 安全な整形には valueFormat を使う。" }, { name: "valueFormat", type: "\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions", description: "シリアライズ可能な数値フォーマット＝formatValue の RSC 安全な代替。formatValue 指定時は無視。en-US ロケール固定。(#338)" }, { name: "currentIndex", type: "number", description: "いまの点の位置（data の何番目か）。点と縦線を置きます。" }, { name: "currentLabel", type: "ReactNode", default: "\"Current\"", description: "その点の名前。値のあとに読み上げます。" }, { name: "startLabel", type: "ReactNode", description: "左端の下に出す小さなラベル。" }, { name: "endLabel", type: "ReactNode", description: "右端の下に出す小さなラベル。" }] } as const;
const states = { en: [{ key: "line", title: "Line", description: "Simple trend line for dense cards.", preview: <SparklineChart data={dataByLocale.en} />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";

const data = [
    { label: "Jan", value: 24 },
    { label: "Feb", value: 28 },
    { label: "Mar", value: 22 },
    { label: "Apr", value: 36 },
    { label: "May", value: 32 },
    { label: "Jun", value: 44 },
    { label: "Jul", value: 39 },
    { label: "Aug", value: 52 },
    { label: "Sep", value: 48 },
    { label: "Oct", value: 57 },
    { label: "Nov", value: 51 },
    { label: "Dec", value: 64 },
];

export function MonthlyTrendSparkline() {
    return <SparklineChart data={data} />;
}` }, { key: "area", title: "Area", description: "Adds fill for stronger trend emphasis.", preview: <SparklineChart data={dataByLocale.en} variant="area" color="success" />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";

const data = [
    { label: "Jan", value: 24 },
    { label: "Feb", value: 28 },
    { label: "Mar", value: 22 },
    { label: "Apr", value: 36 },
    { label: "May", value: 32 },
    { label: "Jun", value: 44 },
    { label: "Jul", value: 39 },
    { label: "Aug", value: 52 },
    { label: "Sep", value: 48 },
    { label: "Oct", value: 57 },
    { label: "Nov", value: 51 },
    { label: "Dec", value: 64 },
];

export function MonthlyTrendAreaSparkline() {
    return <SparklineChart data={data} variant="area" color="success" />;
}` }, { key: "step", title: "Step", description: "Shows discrete changes such as stages or thresholds.", preview: <SparklineChart data={dataByLocale.en} variant="step" />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";

const data = [
    { label: "Jan", value: 24 },
    { label: "Feb", value: 28 },
    { label: "Mar", value: 22 },
    { label: "Apr", value: 36 },
    { label: "May", value: 32 },
    { label: "Jun", value: 44 },
    { label: "Jul", value: 39 },
    { label: "Aug", value: 52 },
    { label: "Sep", value: 48 },
    { label: "Oct", value: 57 },
    { label: "Nov", value: 51 },
    { label: "Dec", value: 64 },
];

export function MonthlyTrendStepSparkline() {
    return <SparklineChart data={data} variant="step" />;
}` }, { key: "reference", title: "Reference", description: "Displays the target or average line.", preview: <SparklineChart data={dataByLocale.en} variant="area" referenceValue={42} referenceLabel="Average" showDots />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";

const data = [
    { label: "Jan", value: 24 },
    { label: "Feb", value: 28 },
    { label: "Mar", value: 22 },
    { label: "Apr", value: 36 },
    { label: "May", value: 32 },
    { label: "Jun", value: 44 },
    { label: "Jul", value: 39 },
    { label: "Aug", value: 52 },
    { label: "Sep", value: 48 },
    { label: "Oct", value: 57 },
    { label: "Nov", value: 51 },
    { label: "Dec", value: 64 },
];

export function MonthlyTrendWithReference() {
    return (
        <SparklineChart
          data={data}
          variant="area"
          referenceValue={42}
          referenceLabel="Average"
          showDots
        />
    );
}` }, { key: "current", title: "Current point and end labels", description: "currentIndex puts a dot and a thin vertical line on one point along the time axis, so a window that runs into the future shows where today is. startLabel / endLabel name the two ends. The slider moves the point.", preview: <CurrentPointDemo locale="en" />, previewBodyWidth: "md", code: currentCode.en }], ja: [{ key: "line", title: "線表示", description: "密度の高いカードで使うシンプルな傾向線です。", preview: <SparklineChart data={dataByLocale.ja} />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";

const data = [
    { label: "1月", value: 24 },
    { label: "2月", value: 28 },
    { label: "3月", value: 22 },
    { label: "4月", value: 36 },
    { label: "5月", value: 32 },
    { label: "6月", value: 44 },
    { label: "7月", value: 39 },
    { label: "8月", value: 52 },
    { label: "9月", value: 48 },
    { label: "10月", value: 57 },
    { label: "11月", value: 51 },
    { label: "12月", value: 64 },
];

export function MonthlyTrendSparkline() {
    return <SparklineChart data={data} />;
}` }, { key: "area", title: "面表示", description: "塗りを加えて傾向を強調します。", preview: <SparklineChart data={dataByLocale.ja} variant="area" color="success" />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";

const data = [
    { label: "1月", value: 24 },
    { label: "2月", value: 28 },
    { label: "3月", value: 22 },
    { label: "4月", value: 36 },
    { label: "5月", value: 32 },
    { label: "6月", value: 44 },
    { label: "7月", value: 39 },
    { label: "8月", value: 52 },
    { label: "9月", value: 48 },
    { label: "10月", value: 57 },
    { label: "11月", value: 51 },
    { label: "12月", value: 64 },
];

export function MonthlyTrendAreaSparkline() {
    return <SparklineChart data={data} variant="area" color="success" />;
}` }, { key: "step", title: "ステップ", description: "段階的な変化やしきい値の推移に使います。", preview: <SparklineChart data={dataByLocale.ja} variant="step" />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";

const data = [
    { label: "1月", value: 24 },
    { label: "2月", value: 28 },
    { label: "3月", value: 22 },
    { label: "4月", value: 36 },
    { label: "5月", value: 32 },
    { label: "6月", value: 44 },
    { label: "7月", value: 39 },
    { label: "8月", value: 52 },
    { label: "9月", value: 48 },
    { label: "10月", value: 57 },
    { label: "11月", value: 51 },
    { label: "12月", value: 64 },
];

export function MonthlyTrendStepSparkline() {
    return <SparklineChart data={data} variant="step" />;
}` }, { key: "reference", title: "基準線", description: "目標値や平均値を点線で表示します。", preview: <SparklineChart data={dataByLocale.ja} variant="area" referenceValue={42} referenceLabel="平均" showDots />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";

const data = [
    { label: "1月", value: 24 },
    { label: "2月", value: 28 },
    { label: "3月", value: 22 },
    { label: "4月", value: 36 },
    { label: "5月", value: 32 },
    { label: "6月", value: 44 },
    { label: "7月", value: 39 },
    { label: "8月", value: 52 },
    { label: "9月", value: 48 },
    { label: "10月", value: 57 },
    { label: "11月", value: 51 },
    { label: "12月", value: 64 },
];

export function MonthlyTrendWithReference() {
    return <SparklineChart
      data={data}
      variant="area"
      referenceValue={42}
      referenceLabel="平均"
      showDots
    />;
}` }, { key: "current", title: "いまの位置と両端のラベル", description: "currentIndex で、時間の軸の上の1点に点と細い縦線を置きます。先の日付まで続く線でも、今日がどこかが分かります。startLabel / endLabel で両端にラベルを付けます。スライダーで点が動きます。", preview: <CurrentPointDemo locale="ja" />, previewBodyWidth: "md", code: currentCode.ja }] } as const;

const designDecisions = {
    ja: (
        <>
            <li>
                <strong>縦軸の範囲を固定する指定が、まだありません。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SparklineChart</code> は常に、そのデータの最小値から最大値までで正規化します（<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">referenceValue</code> を渡すと、その値も範囲に入ります）。資料が最も起きやすい間違いに挙げる「並べたときにスケールがそろわない」を、この部品では防げません。同じ単位のスパークラインを並べて形を比べたいときは、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">min</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> を持つ <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">LineChart</code> に移ってください。
            </li>
            <li>
                <strong>点ごとに、縦に貫く帯を置きました。</strong>当たり判定は点そのものではなく、その時点から次の時点までを縦いっぱいに覆う帯です。ホバーは図のどこでも近い時点を拾い、キーボードは帯を1つずつたどります。読み上げ名は「時点: 値」です。資料はスパークラインをフォーカス可能にしないよう薦めています（20行の一覧でタブ位置が 160 個になるためです）。GUNJO は、値がツールチップにしか無いことを重く見て帯を残しました。一覧に並べるときは、行が増えるぶんタブ位置も増えることを見込んでください。
            </li>
            <li>
                <strong>点は、既定では出しません。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showDots</code> の既定は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">false</code> です（<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">LineChart</code> は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">true</code>）。スパークラインが伝えるのは向きだけなので、点を出すと小さな折れ線に近づいてしまいます。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'variant="step"'}</code> は在庫や料金プランのように段階的に変わる値のためのもので、連続した値に使うと実際より急な変化に見えます。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">referenceLabel</code> の既定は英語の「Reference」です。何の線かは、図の外の文字でも書いてください。
            </li>
            <li>
                <strong>「いまの位置」は縦の線で示し、横の基準線とは分けました。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">referenceValue</code> は値の高さ（平均・目標）を横に引く線です。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">currentIndex</code> は時間の軸の上の位置で、先の日付まで続く線のどこが今日かを示します。点と縦線は HTML で重ねているので、図の幅が変わっても、点の形と縦線の太さは変わりません。
            </li>
        </>
    ),
    en: (
        <>
            <li>
                <strong>There is still no way to fix the value range.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SparklineChart</code> always normalises to its own smallest and largest value (passing <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">referenceValue</code> folds that number into the range too). The mistake the article calls the most common one — rows of sparklines drawn at different scales — cannot be prevented from inside this component. When several sparklines in the same unit have to be compared by shape, move to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">LineChart</code>, which has <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">min</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code>.
            </li>
            <li>
                <strong>Each point gets a full-height band.</strong> The hit area is not the point but a band covering the full height from that point to the next. Hover picks the nearest point from anywhere in the figure, and the keyboard walks the bands one at a time; the accessible name reads “point: value”. The article advises against making a sparkline focusable at all, since twenty rows would create a hundred and sixty tab stops. GUNJO kept the bands because the values live nowhere but the tooltip. Budget for the extra tab stops when you put these in a list.
            </li>
            <li>
                <strong>Dots are off by default.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showDots</code> defaults to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">false</code> here, where <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">LineChart</code> defaults to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">true</code>: a sparkline conveys direction, and adding dots pushes it towards being a small line chart. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'variant="step"'}</code> is for values that change in steps, such as stock levels or pricing tiers; used on a continuous series it makes the change look sharper than it was. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">referenceLabel</code> defaults to the English “Reference”, so say what the line means in the copy as well.
            </li>
            <li>
                <strong>“Now” is a vertical line, kept apart from the horizontal reference.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">referenceValue</code> draws a level (an average, a target) across. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">currentIndex</code> is a position along time: it shows where today sits on a line that runs on into the future. The dot and line are HTML laid over the plot, so their thickness does not stretch with the figure.
            </li>
        </>
    ),
};

// 本文からこの節へ移した UIXHERO の記事リンク（gunjo #955 の受け口）。
const uixheroLinks: Record<"ja" | "en", UixheroLink[]> = {
    ja: [
        {
            label: "UIXHERO: スパークライン（Sparkline Chart）",
            href: `${UIXHERO_BASE_URL}/resources/ui-components/sparkline-chart`,
        },
    ],
    en: [
        {
            label: "UIXHERO: Sparkline Chart (in Japanese)",
            href: `${UIXHERO_BASE_URL}/resources/ui-components/sparkline-chart`,
        },
    ],
};

export default function SparklineChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage designDecisions={designDecisions} title={{ en: meta.sparklineChart.title, ja: "スパークライン" }} description={{ en: meta.sparklineChart.description, ja: "カード内の小さな領域で傾向を示す線・面・ステップチャートです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="sparkline-chart" embedBase="/embed/sparkline-chart" previewHeight={360} states={states} usedComponents={{ en: [{ name: "SparklineChart", href: "/docs/components/sparkline-chart" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "スパークライン", href: "/docs/components/sparkline-chart" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{ name: "LineChart", href: "/docs/components/line-chart" }, { name: "AnalyticsCard", href: "/docs/components/analytics-card" }], ja: [{ name: "折れ線チャート", href: "/docs/components/line-chart" }, { name: "分析カード", href: "/docs/components/analytics-card" }] }} uixheroLinks={uixheroLinks} />;
}
