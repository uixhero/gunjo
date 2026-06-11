"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import feedbackMetadata from "@design/feedback-metadata.json";
import { ProgressWidget } from "@gunjo/ui";
import {
    IconActivity as Activity,
    IconDatabase as HardDrive,
    IconGauge as Gauge,
    IconTarget as Target,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

function LiveProgressWidgetPreview({ locale }: { locale: "en" | "ja" }) {
    const [value, setValue] = useState(36);
    const isJa = locale === "ja";

    useEffect(() => {
        const timer = window.setInterval(() => {
            setValue((current) => (current >= 96 ? 24 : current + 6));
        }, 900);

        return () => window.clearInterval(timer);
    }, []);

    const remaining = Math.max(0, Math.ceil((100 - value) / 18));

    return (
        <ProgressWidget
            title={isJa ? "同期の進捗" : "Sync progress"}
            value={value}
            max={100}
            subtext={
                isJa
                    ? remaining === 0
                        ? "同期が完了しました。"
                        : `残り ${remaining} 件を同期しています。`
                    : remaining === 0
                    ? "Sync complete."
                    : `Syncing ${remaining} remaining items.`
            }
            progressLabel={isJa ? "同期の進捗" : "Sync progress"}
            subtextLive="polite"
            icon={<Activity className="h-4 w-4" />}
        />
    );
}

export default function ProgressWidgetDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

const code = `import { ProgressWidget } from "@gunjo/ui"
import { IconTarget as Target } from "@tabler/icons-react"

export function GoalProgressWidget() {
  return (
    <ProgressWidget
      title="${isJa ? "四半期目標" : "Quarterly goal"}"
      value={72}
      max={100}
      subtext="${isJa ? "前週比 +8pt" : "+8pt from last week"}"
      progressLabel="${isJa ? "四半期目標の進捗" : "Quarterly goal progress"}"
      icon={<Target className="h-4 w-4" />}
    />
  )
}`;

    const usageCode = code;

const customLabelCode = `import { ProgressWidget } from "@gunjo/ui"
import { IconActivity as Activity } from "@tabler/icons-react"

export function RevenueProgressWidget() {
  return (
    <ProgressWidget
      title="${isJa ? "売上目標" : "Revenue target"}"
      value={25000}
      max={50000}
      label="${isJa ? "25,000円" : "$25,000"}"
      subtext="${isJa ? "年間目標の 50% に到達" : "50% of the annual goal reached"}"
      progressLabel="${isJa ? "売上目標の進捗" : "Revenue target progress"}"
      icon={<Activity className="h-4 w-4" />}
    />
  )
}`;

const storageCode = `import { ProgressWidget } from "@gunjo/ui"
import { IconDatabase as HardDrive } from "@tabler/icons-react"

export function StorageProgressWidget() {
  return (
    <ProgressWidget
      title="${isJa ? "ストレージ使用量" : "Storage usage"}"
      value={42}
      max={64}
      label="42 / 64 GB"
      subtext="${isJa ? "残り 22 GB を利用できます" : "22 GB available"}"
      progressLabel="${isJa ? "ストレージ使用量" : "Storage usage"}"
      icon={<HardDrive className="h-4 w-4" />}
    />
  )
}`;

const highCode = `import { ProgressWidget } from "@gunjo/ui"
import { IconGauge as Gauge } from "@tabler/icons-react"

export function RiskProgressWidget() {
  return (
    <ProgressWidget
      title="${isJa ? "対応率" : "Resolution rate"}"
      value={92}
      max={100}
      subtext="${isJa ? "SLA まで残り 3 件" : "3 items remain before SLA"}"
      progressLabel="${isJa ? "対応率の進捗" : "Resolution rate progress"}"
      icon={<Gauge className="h-4 w-4" />}
    />
  )
}`;

const liveCode = `import { ProgressWidget } from "@gunjo/ui"
import { IconActivity as Activity } from "@tabler/icons-react"
import { useEffect, useState } from "react"

export function LiveSyncProgressWidget() {
  const [value, setValue] = useState(36)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setValue((current) => (current >= 96 ? 24 : current + 6))
    }, 900)

    return () => window.clearInterval(timer)
  }, [])

  const remaining = Math.max(0, Math.ceil((100 - value) / 18))
  const subtext =
    remaining === 0
      ? "${isJa ? "同期が完了しました。" : "Sync complete."}"
      : ${isJa ? "`残り ${remaining} 件を同期しています。`" : "`Syncing ${remaining} remaining items.`"}

  return (
    <ProgressWidget
      title="${isJa ? "同期の進捗" : "Sync progress"}"
      value={value}
      max={100}
      subtext={subtext}
      progressLabel="${isJa ? "同期の進捗" : "Sync progress"}"
      subtextLive="polite"
      icon={<Activity className="h-4 w-4" />}
    />
  )
}`;

    const propsData = [
        {
            name: "title",
            type: "string",
            description: isJa ? "カード上部に表示する指標名です。" : "Metric title shown in the card header.",
            required: true,
        },
        {
            name: "value",
            type: "number",
            description: isJa ? "現在値です。max に対する割合で進捗バーを描画します。" : "Current value used to render the progress bar against max.",
            required: true,
        },
        {
            name: "max",
            type: "number",
            default: "100",
            description: isJa ? "進捗の最大値です。" : "Maximum value for progress calculation.",
        },
        {
            name: "label",
            type: "string",
            description: isJa ? "大きく表示する値です。省略時は割合を表示します。" : "Large displayed value. Defaults to the computed percentage.",
        },
        {
            name: "subtext",
            type: "string",
            description: isJa ? "進捗バーの下に表示する補足文です。" : "Supporting text displayed below the progress bar.",
        },
        {
            name: "progressLabel",
            type: "string",
            description: isJa ? "内部の進捗バーに付けるアクセシブルラベルです。省略時は title を使います。" : "Accessible label for the internal progress bar. Defaults to title.",
        },
        {
            name: "subtextLive",
            type: "'off' | 'polite' | 'assertive'",
            default: "'off'",
            description: isJa ? "動的に変わる補足文をスクリーンリーダーへ通知するかを指定します。" : "Controls whether dynamic supporting text is announced to screen readers.",
        },
        {
            name: "icon",
            type: "React.ReactNode",
            description: isJa ? "ヘッダー右側に表示するアイコンです。" : "Optional icon rendered in the header.",
        },
        {
            name: "className",
            type: "string",
            description: isJa ? "カードのラッパーに追加するクラスです。" : "Additional class names applied to the card wrapper.",
        },
    ];

    return (
        <ComponentLayout
            title={feedbackMetadata.progressWidget.title}
            description={feedbackMetadata.progressWidget.description}
            usedComponents={[
                { name: "ProgressWidget", href: "/docs/components/progress-widget" },
                { name: "Card", href: "/docs/components/card" },
                { name: "Progress", href: "/docs/components/progress" },
                { name: "Icon", href: "/docs/components/icon" },
            ]}
            relatedComponents={[
                { name: "Statistic", href: "/docs/components/statistic" },
                { name: "GaugeChart", href: "/docs/components/gauge-chart" },
                { name: "Progress", href: "/docs/components/progress" },
            ]}
            sectionLabels={sectionLabels}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto" previewBodyWidth="md" sectionLabels={sectionLabels}>
                <ProgressWidget
                    title={isJa ? "四半期目標" : "Quarterly goal"}
                    value={72}
                    max={100}
                    subtext={isJa ? "前週比 +8pt" : "+8pt from last week"}
                    progressLabel={isJa ? "四半期目標の進捗" : "Quarterly goal progress"}
                    icon={<Target className="h-4 w-4" />}
                />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "percentage",
                            title: isJa ? "割合表示" : "Percentage value",
                            description: isJa ? "label を省略すると value / max から割合を表示します。" : "When label is omitted, the widget displays the computed percentage.",
                            preview: (
                                <ProgressWidget
                                    title={isJa ? "四半期目標" : "Quarterly goal"}
                                    value={72}
                                    max={100}
                                    subtext={isJa ? "前週比 +8pt" : "+8pt from last week"}
                                    progressLabel={isJa ? "四半期目標の進捗" : "Quarterly goal progress"}
                                    icon={<Target className="h-4 w-4" />}
                                />
                            ),
                            previewBodyWidth: "md",
                            code,
                        },
                        {
                            key: "live",
                            title: isJa ? "ライブ更新" : "Live updates",
                            description: isJa
                                ? "親の状態が変わると、カード内の値、バー、補足文も更新されます。動的な補足文は subtextLive で通知できます。"
                                : "When parent state changes, the value, bar, and supporting text update together. Dynamic supporting text can be announced with subtextLive.",
                            preview: <LiveProgressWidgetPreview locale={locale} />,
                            previewBodyWidth: "md",
                            code: liveCode,
                        },
                        {
                            key: "custom-label",
                            title: isJa ? "値ラベル付き" : "Custom value label",
                            description: isJa ? "金額や件数など、割合以外を大きく表示したい場合は label を指定します。" : "Use label when the large value should be money, count, or another unit.",
                            preview: (
                                <ProgressWidget
                                    title={isJa ? "売上目標" : "Revenue target"}
                                    value={25000}
                                    max={50000}
                                    label={isJa ? "25,000円" : "$25,000"}
                                    subtext={isJa ? "年間目標の 50% に到達" : "50% of the annual goal reached"}
                                    progressLabel={isJa ? "売上目標の進捗" : "Revenue target progress"}
                                    icon={<Activity className="h-4 w-4" />}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: customLabelCode,
                        },
                        {
                            key: "custom-max",
                            title: isJa ? "容量レンジ" : "Capacity range",
                            description: isJa ? "容量のような 100 以外の範囲では max と label を合わせて指定します。" : "For capacity ranges, pair max with a readable label.",
                            preview: (
                                <ProgressWidget
                                    title={isJa ? "ストレージ使用量" : "Storage usage"}
                                    value={42}
                                    max={64}
                                    label="42 / 64 GB"
                                    subtext={isJa ? "残り 22 GB を利用できます" : "22 GB available"}
                                    progressLabel={isJa ? "ストレージ使用量" : "Storage usage"}
                                    icon={<HardDrive className="h-4 w-4" />}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: storageCode,
                        },
                        {
                            key: "high",
                            title: isJa ? "高い進捗" : "High progress",
                            description: isJa ? "完了に近い進捗でもカードサイズは変えず、補足文で状況を伝えます。" : "Near-complete progress keeps the same card size and uses subtext for context.",
                            preview: (
                                <ProgressWidget
                                    title={isJa ? "対応率" : "Resolution rate"}
                                    value={92}
                                    max={100}
                                    subtext={isJa ? "SLA まで残り 3 件" : "3 items remain before SLA"}
                                    progressLabel={isJa ? "対応率の進捗" : "Resolution rate progress"}
                                    icon={<Gauge className="h-4 w-4" />}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: highCode,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="props">
                    {sectionLabels.props ?? "Props"}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between gap-4 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="usage">
                        {sectionLabels.usage ?? "Usage"}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <CodeBlock code={usageCode} />
            </section>
        </ComponentLayout>
    );
}
