"use client";

import { CodeCopyButton, ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChartPreviewWithControls } from "@/components/doc/ChartPreviewWithControls";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { AnalyticsCard, SparklineChart } from "@gunjo/ui";

const codeByLocale = {
    en: `import { AnalyticsCard, SparklineChart } from "@gunjo/ui";

const data = [24, 28, 22, 36, 32, 44, 39, 52, 48, 57, 51, 64];

export function RevenueCard() {
    return (
        <AnalyticsCard
            title="Revenue"
            description="Last 12 months"
            value="$128,430"
            delta="+12.4%"
            deltaDescription="Compared with the previous period."
            variant="positive"
            trend="up"
        >
            <SparklineChart data={data} variant="area" />
        </AnalyticsCard>
    );
}`,
    ja: `import { AnalyticsCard, SparklineChart } from "@gunjo/ui";

const data = [24, 28, 22, 36, 32, 44, 39, 52, 48, 57, 51, 64];

export function RevenueCard() {
    return (
        <AnalyticsCard
            title="売上"
            description="直近12か月"
            value="128,430円"
            delta="+12.4%"
            deltaDescription="前期間と比較しています。"
            variant="positive"
            trend="up"
        >
            <SparklineChart data={data} variant="area" />
        </AnalyticsCard>
    );
}`,
} as const;

const usageCodeByLocale = {
    en: `import { AnalyticsCard, SparklineChart } from "@gunjo/ui";

const data = [24, 28, 22, 36, 32, 44, 39, 52, 48, 57, 51, 64];

<AnalyticsCard
    title="Revenue"
    value="$128,430"
    delta="+12.4%"
    deltaDescription="Compared with the previous period."
    variant="positive"
    trend="up"
>
    <SparklineChart data={data} variant="area" />
</AnalyticsCard>`,
    ja: `import { AnalyticsCard, SparklineChart } from "@gunjo/ui";

const data = [24, 28, 22, 36, 32, 44, 39, 52, 48, 57, 51, 64];

<AnalyticsCard
    title="売上"
    value="128,430円"
    delta="+12.4%"
    deltaDescription="前期間と比較しています。"
    variant="positive"
    trend="up"
>
    <SparklineChart data={data} variant="area" />
</AnalyticsCard>`,
} as const;

const stateCodeByLocale = {
    en: {
        up: `<AnalyticsCard
  title="Revenue"
  description="Last 12 months"
  value="$128,430"
  delta="+12.4%"
  deltaDescription="Compared with the previous period."
  variant="positive"
  trend="up"
>
  <SparklineChart data={revenueData} variant="area" />
</AnalyticsCard>`,
        down: `<AnalyticsCard
  title="Churn risk"
  description="Current cohort"
  value="8.6%"
  delta="+2.1pt"
  deltaDescription="Higher than the previous cohort."
  variant="riskIncrease"
  trend="down"
>
  <SparklineChart data={riskData} color="destructive" />
</AnalyticsCard>`,
        flat: `<AnalyticsCard
  title="Active users"
  description="Daily average"
  value="24,180"
  delta="0.2%"
  deltaDescription="Almost unchanged from the previous period."
  variant="flatWithFooter"
  trend="flat"
  footer="Updated 5 minutes ago"
>
  <SparklineChart data={activeUsersData} variant="step" showDots />
</AnalyticsCard>`,
    },
    ja: {
        up: `<AnalyticsCard
  title="売上"
  description="直近12か月"
  value="128,430円"
  delta="+12.4%"
  deltaDescription="前期間と比較しています。"
  variant="positive"
  trend="up"
>
  <SparklineChart data={revenueData} variant="area" />
</AnalyticsCard>`,
        down: `<AnalyticsCard
  title="解約リスク"
  description="現在のコホート"
  value="8.6%"
  delta="+2.1pt"
  deltaDescription="前コホートより高くなっています。"
  variant="riskIncrease"
  trend="down"
>
  <SparklineChart data={riskData} color="destructive" />
</AnalyticsCard>`,
        flat: `<AnalyticsCard
  title="アクティブユーザー"
  description="日次平均"
  value="24,180"
  delta="0.2%"
  deltaDescription="前期間からほぼ変化していません。"
  variant="flatWithFooter"
  trend="flat"
  footer="5分前に更新"
>
  <SparklineChart data={activeUsersData} variant="step" showDots />
</AnalyticsCard>`,
    },
} as const;

const propsDataByLocale = {
    en: [
        { name: "title", type: "ReactNode", description: "Card title shown in the header." },
        { name: "description", type: "ReactNode", description: "Optional context below the title." },
        { name: "value", type: "ReactNode", description: "Primary metric value shown above the content." },
        { name: "delta", type: "ReactNode", description: "Optional change indicator shown next to the value." },
        { name: "deltaDescription", type: "ReactNode", description: "Tooltip content that explains what the delta compares against." },
        { name: "variant", type: "\"default\" | \"positive\" | \"riskIncrease\" | \"flatWithFooter\"", default: "\"default\"", description: "Selects the registered card treatment from the SSOT variants." },
        { name: "trend", type: "\"up\" | \"down\" | \"flat\"", default: "\"flat\"", description: "Controls the delta icon and semantic tone." },
        { name: "action", type: "ReactNode", description: "Optional control rendered in the card header." },
        { name: "footer", type: "ReactNode", description: "Optional footer content for update time, source, or secondary status." },
        { name: "children", type: "ReactNode", description: "Chart, distribution, list, or any content rendered in CardContent." },
    ],
    ja: [
        { name: "title", type: "ReactNode", description: "カードヘッダーに表示するタイトルです。" },
        { name: "description", type: "ReactNode", description: "タイトル下に表示する任意の補足情報です。" },
        { name: "value", type: "ReactNode", description: "カードの主指標として、チャートや内容の上に表示する値です。" },
        { name: "delta", type: "ReactNode", description: "主指標に添える任意の変化量です。" },
        { name: "deltaDescription", type: "ReactNode", description: "変化量が何と比較した値かを説明するツールチップ内容です。" },
        { name: "variant", type: "\"default\" | \"positive\" | \"riskIncrease\" | \"flatWithFooter\"", default: "\"default\"", description: "SSOT に登録されたカード状態の見た目を切り替えます。" },
        { name: "trend", type: "\"up\" | \"down\" | \"flat\"", default: "\"flat\"", description: "変化量のアイコンと意味上のトーンを切り替えます。" },
        { name: "action", type: "ReactNode", description: "カードヘッダー右側に表示する任意の操作です。" },
        { name: "footer", type: "ReactNode", description: "更新時刻、出典、補助ステータスなどを表示する任意のフッターです。" },
        { name: "children", type: "ReactNode", description: "CardContent に表示するチャート、分布、リストなどの任意の内容です。" },
    ],
} as const;

const revenueData = [24, 28, 22, 36, 32, 44, 39, 52, 48, 57, 51, 64];
const riskData = [4.8, 5.1, 5.4, 5.2, 6.1, 6.8, 6.5, 7.2, 7.8, 8.1, 8.4, 8.6];
const activeUsersData = [23800, 24120, 23940, 24200, 24180, 24320, 24080, 24160, 24240, 24190, 24210, 24180];

export default function AnalyticsCardPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const { locale, sectionLabels } = useLocale();
    const code = codeByLocale[locale];
    const usageCode = usageCodeByLocale[locale];

    return (
        <ComponentLayout
            title={meta.analyticsCard.title}
            description={meta.analyticsCard.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "AnalyticsCard", href: "/docs/components/analytics-card" },
                { name: "SparklineChart", href: "/docs/components/sparkline-chart" },
                { name: "Card", href: "/docs/components/card" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "Statistic", href: "/docs/components/statistic" },
                { name: "BarChart", href: "/docs/components/bar-chart" },
                { name: "DonutChart", href: "/docs/components/donut-chart" },
                { name: "GaugeChart", href: "/docs/components/gauge-chart" },
            ]}
        >
            <ChartPreviewWithControls
                code={code}
                demo="analytics-card"
                embedBase="/embed/analytics-card"
                previewHeight={560}
            />

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "trend-up",
                            title: locale === "ja" ? "上昇傾向" : "Up trend",
                            description: locale === "ja"
                                ? "売上や達成率など、増加が良い意味になる指標に positive variant を組み合わせます。"
                                : "Combines the positive variant with metrics where an increase is positive, such as revenue or completion rate.",
                            preview: (
                                <AnalyticsCard
                                    className="max-w-sm"
                                    title={locale === "ja" ? "売上" : "Revenue"}
                                    description={locale === "ja" ? "直近12か月" : "Last 12 months"}
                                    value={locale === "ja" ? "128,430円" : "$128,430"}
                                    delta="+12.4%"
                                    deltaDescription={locale === "ja" ? "前期間と比較しています。" : "Compared with the previous period."}
                                    variant="positive"
                                    trend="up"
                                >
                                    <SparklineChart data={revenueData} variant="area" />
                                </AnalyticsCard>
                            ),
                            code: stateCodeByLocale[locale].up,
                        },
                        {
                            key: "trend-down",
                            title: locale === "ja" ? "注意が必要な上昇" : "Risk increase",
                            description: locale === "ja"
                                ? "解約率やエラー率など、上昇が悪化を示す指標に riskIncrease variant を組み合わせます。"
                                : "Combines the riskIncrease variant with metrics where an increase is negative, such as churn or error rate.",
                            preview: (
                                <AnalyticsCard
                                    className="max-w-sm"
                                    title={locale === "ja" ? "解約リスク" : "Churn risk"}
                                    description={locale === "ja" ? "現在のコホート" : "Current cohort"}
                                    value="8.6%"
                                    delta="+2.1pt"
                                    deltaDescription={locale === "ja" ? "前コホートより高くなっています。" : "Higher than the previous cohort."}
                                    variant="riskIncrease"
                                    trend="down"
                                >
                                    <SparklineChart data={riskData} color="destructive" />
                                </AnalyticsCard>
                            ),
                            code: stateCodeByLocale[locale].down,
                        },
                        {
                            key: "trend-flat",
                            title: locale === "ja" ? "横ばいと補足情報" : "Flat trend with footer",
                            description: locale === "ja"
                                ? "大きな変化がない指標に flatWithFooter variant と footer の補足情報を組み合わせます。"
                                : "Combines the flatWithFooter variant with footer context for stable metrics.",
                            preview: (
                                <AnalyticsCard
                                    className="max-w-sm"
                                    title={locale === "ja" ? "アクティブユーザー" : "Active users"}
                                    description={locale === "ja" ? "日次平均" : "Daily average"}
                                    value="24,180"
                                    delta="0.2%"
                                    deltaDescription={locale === "ja" ? "前期間からほぼ変化していません。" : "Almost unchanged from the previous period."}
                                    variant="flatWithFooter"
                                    trend="flat"
                                    footer={locale === "ja" ? "5分前に更新" : "Updated 5 minutes ago"}
                                >
                                    <SparklineChart data={activeUsersData} variant="step" showDots />
                                </AnalyticsCard>
                            ),
                            code: stateCodeByLocale[locale].flat,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">{sectionLabels.props}</h2>
                <PropsTable data={propsDataByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">{sectionLabels.usage}</h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <CodeBlock code={usageCode} />
            </div>
        </ComponentLayout>
    );
}
