"use client";

import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Tag, Timeline, TimelineDescription, TimelineItem, TimelineTime, TimelineTitle } from "@gunjo/ui";
import {
    IconCircleCheck as CheckCircle2,
    IconClockHour3 as Clock3,
    IconRocket as Rocket,
} from "@tabler/icons-react";

const codeByLocale = {
    ja: `import {
  Timeline,
  TimelineDescription,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
  Tag,
} from "@gunjo/ui";

export function Example() {
  return (
    <Timeline>
      <TimelineItem variant="muted">
        <TimelineTime dateTime="2026-05-18">5月18日</TimelineTime>
        <TimelineTitle>キックオフ</TimelineTitle>
        <TimelineDescription>目的と担当範囲を確認しました。</TimelineDescription>
      </TimelineItem>
      <TimelineItem variant="default">
        <TimelineTime dateTime="2026-05-20">5月20日</TimelineTime>
        <TimelineTitle>仕様を確定</TimelineTitle>
        <TimelineDescription>公開前の確認項目を整理しました。</TimelineDescription>
      </TimelineItem>
      <TimelineItem variant="muted">
        <TimelineTime dateTime="2026-05-24">5月24日</TimelineTime>
        <TimelineTitle>素材を準備</TimelineTitle>
        <TimelineDescription>画像、コピー、参照リンクを揃えました。</TimelineDescription>
      </TimelineItem>
      <TimelineItem variant="active">
        <TimelineTime dateTime="2026-05-26">5月26日</TimelineTime>
        <TimelineTitle className="flex items-center gap-2">
          実装中
          <Tag size="sm" variant="outline">現在地</Tag>
        </TimelineTitle>
        <TimelineDescription>UI とドキュメントの差分を確認しています。</TimelineDescription>
      </TimelineItem>
      <TimelineItem variant="outline" connector={false}>
        <TimelineTime dateTime="2026-05-30">5月30日</TimelineTime>
        <TimelineTitle>公開予定</TimelineTitle>
      </TimelineItem>
    </Timeline>
  );
}`,
    en: `import {
  Timeline,
  TimelineDescription,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
  Tag,
} from "@gunjo/ui";

export function Example() {
  return (
    <Timeline>
      <TimelineItem variant="muted">
        <TimelineTime dateTime="2026-05-18">May 18</TimelineTime>
        <TimelineTitle>Kickoff</TimelineTitle>
        <TimelineDescription>Confirmed goals and ownership.</TimelineDescription>
      </TimelineItem>
      <TimelineItem variant="default">
        <TimelineTime dateTime="2026-05-20">May 20</TimelineTime>
        <TimelineTitle>Spec approved</TimelineTitle>
        <TimelineDescription>Pre-release checks were organized.</TimelineDescription>
      </TimelineItem>
      <TimelineItem variant="muted">
        <TimelineTime dateTime="2026-05-24">May 24</TimelineTime>
        <TimelineTitle>Assets prepared</TimelineTitle>
        <TimelineDescription>Images, copy, and reference links were collected.</TimelineDescription>
      </TimelineItem>
      <TimelineItem variant="active">
        <TimelineTime dateTime="2026-05-26">May 26</TimelineTime>
        <TimelineTitle className="flex items-center gap-2">
          Implementation
          <Tag size="sm" variant="outline">Current</Tag>
        </TimelineTitle>
        <TimelineDescription>Reviewing UI and documentation changes.</TimelineDescription>
      </TimelineItem>
      <TimelineItem variant="outline" connector={false}>
        <TimelineTime dateTime="2026-05-30">May 30</TimelineTime>
        <TimelineTitle>Planned release</TimelineTitle>
      </TimelineItem>
    </Timeline>
  );
}`,
} as const;

const markerCodeByLocale = {
    ja: `import { Timeline, TimelineItem, TimelineTime, TimelineTitle } from "@gunjo/ui";
import { IconCircleCheck as CheckCircle2, IconClockHour3 as Clock3, IconRocket as Rocket } from "@tabler/icons-react";

export function TimelineWithMarkers() {
  return (
    <Timeline>
      <TimelineItem marker={<CheckCircle2 className="h-4 w-4 text-primary" />}>
        <TimelineTime>完了</TimelineTime>
        <TimelineTitle>レビュー完了</TimelineTitle>
      </TimelineItem>
      <TimelineItem marker={<Clock3 className="h-4 w-4 text-muted-foreground" />}>
        <TimelineTime>進行中</TimelineTime>
        <TimelineTitle>検証中</TimelineTitle>
      </TimelineItem>
      <TimelineItem marker={<Rocket className="h-4 w-4 text-primary" />} connector={false}>
        <TimelineTime>予定</TimelineTime>
        <TimelineTitle>公開</TimelineTitle>
      </TimelineItem>
    </Timeline>
  );
}`,
    en: `import { Timeline, TimelineItem, TimelineTime, TimelineTitle } from "@gunjo/ui";
import { IconCircleCheck as CheckCircle2, IconClockHour3 as Clock3, IconRocket as Rocket } from "@tabler/icons-react";

export function TimelineWithMarkers() {
  return (
    <Timeline>
      <TimelineItem marker={<CheckCircle2 className="h-4 w-4 text-primary" />}>
        <TimelineTime>Done</TimelineTime>
        <TimelineTitle>Review complete</TimelineTitle>
      </TimelineItem>
      <TimelineItem marker={<Clock3 className="h-4 w-4 text-muted-foreground" />}>
        <TimelineTime>In progress</TimelineTime>
        <TimelineTitle>Validation</TimelineTitle>
      </TimelineItem>
      <TimelineItem marker={<Rocket className="h-4 w-4 text-primary" />} connector={false}>
        <TimelineTime>Planned</TimelineTime>
        <TimelineTitle>Release</TimelineTitle>
      </TimelineItem>
    </Timeline>
  );
}`,
} as const;

const compactCodeByLocale = {
    ja: `import { Timeline, TimelineItem, TimelineTitle } from "@gunjo/ui";

export function CompactTimeline() {
  return (
    <Timeline className="gap-0">
      <TimelineItem variant="muted">
        <TimelineTitle>受付</TimelineTitle>
      </TimelineItem>
      <TimelineItem variant="active">
        <TimelineTitle>処理中</TimelineTitle>
      </TimelineItem>
      <TimelineItem variant="outline" connector={false}>
        <TimelineTitle>完了待ち</TimelineTitle>
      </TimelineItem>
    </Timeline>
  );
}`,
    en: `import { Timeline, TimelineItem, TimelineTitle } from "@gunjo/ui";

export function CompactTimeline() {
  return (
    <Timeline className="gap-0">
      <TimelineItem variant="muted">
        <TimelineTitle>Received</TimelineTitle>
      </TimelineItem>
      <TimelineItem variant="active">
        <TimelineTitle>Processing</TimelineTitle>
      </TimelineItem>
      <TimelineItem variant="outline" connector={false}>
        <TimelineTitle>Waiting to finish</TimelineTitle>
      </TimelineItem>
    </Timeline>
  );
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "Timeline", type: "HTMLOListElement props", description: "タイムライン全体の ol 要素です。" },
        { name: "Timeline.items", type: "TimelineDataItem[]", description: "データ駆動の簡易API。<TimelineItem> を組む代わりに配列で渡せます（DataTable/StatGroup と同じ形）。各要素は time/title/description/variant/marker。最後の項目の線は自動で省略。compound children も併用可。(#349)" },
        { name: "TimelineItem.connector", type: "boolean", default: "true", description: "次の項目へつながる線を表示します。最後の項目では false にします。" },
        { name: "TimelineItem.variant", type: "\"default\" | \"muted\" | \"active\" | \"outline\"", default: "\"default\"", description: "マーカーの状態表現です。" },
        { name: "TimelineItem.marker", type: "ReactNode", description: "アイコンなどの独自マーカーです。指定すると標準の点を置き換えます。" },
        { name: "TimelineTime", type: "time props", description: "日時や状態ラベルを表示します。" },
        { name: "TimelineTitle", type: "div props", description: "各項目の見出しです。" },
        { name: "TimelineDescription", type: "p props", description: "各項目の補足説明です。" },
    ],
    en: [
        { name: "Timeline", type: "HTMLOListElement props", description: "The root ordered list for timeline items." },
        { name: "Timeline.items", type: "TimelineDataItem[]", description: "Data-prop convenience: pass rows as an array instead of composing <TimelineItem> children (same shape as DataTable/StatGroup). Each item: time/title/description/variant/marker. The last item's connector is dropped automatically. Compound children still work. (#349)" },
        { name: "TimelineItem.connector", type: "boolean", default: "true", description: "Draws the connector to the next item. Set false on the last item." },
        { name: "TimelineItem.variant", type: "\"default\" | \"muted\" | \"active\" | \"outline\"", default: "\"default\"", description: "State treatment for the marker." },
        { name: "TimelineItem.marker", type: "ReactNode", description: "Custom marker such as an icon. Replaces the default dot." },
        { name: "TimelineTime", type: "time props", description: "Displays a date, time, or status label." },
        { name: "TimelineTitle", type: "div props", description: "Heading for each timeline item." },
        { name: "TimelineDescription", type: "p props", description: "Supporting copy for each timeline item." },
    ],
} as const;

function ReleaseTimeline({ locale }: { locale: "ja" | "en" }) {
    return (
        <Timeline className="w-full max-w-xl">
            <TimelineItem variant="muted">
                <TimelineTime dateTime="2026-05-18">{locale === "ja" ? "5月18日" : "May 18"}</TimelineTime>
                <TimelineTitle>{locale === "ja" ? "キックオフ" : "Kickoff"}</TimelineTitle>
                <TimelineDescription>{locale === "ja" ? "目的と担当範囲を確認しました。" : "Confirmed goals and ownership."}</TimelineDescription>
            </TimelineItem>
            <TimelineItem variant="default">
                <TimelineTime dateTime="2026-05-20">{locale === "ja" ? "5月20日" : "May 20"}</TimelineTime>
                <TimelineTitle>{locale === "ja" ? "仕様を確定" : "Spec approved"}</TimelineTitle>
                <TimelineDescription>{locale === "ja" ? "公開前の確認項目を整理しました。" : "Pre-release checks were organized."}</TimelineDescription>
            </TimelineItem>
            <TimelineItem variant="muted">
                <TimelineTime dateTime="2026-05-24">{locale === "ja" ? "5月24日" : "May 24"}</TimelineTime>
                <TimelineTitle>{locale === "ja" ? "素材を準備" : "Assets prepared"}</TimelineTitle>
                <TimelineDescription>{locale === "ja" ? "画像、コピー、参照リンクを揃えました。" : "Images, copy, and reference links were collected."}</TimelineDescription>
            </TimelineItem>
            <TimelineItem variant="active">
                <TimelineTime dateTime="2026-05-26">{locale === "ja" ? "5月26日" : "May 26"}</TimelineTime>
                <TimelineTitle className="flex items-center gap-2">
                    {locale === "ja" ? "実装中" : "Implementation"}
                    <Tag size="sm" variant="outline">{locale === "ja" ? "現在地" : "Current"}</Tag>
                </TimelineTitle>
                <TimelineDescription>{locale === "ja" ? "UI とドキュメントの差分を確認しています。" : "Reviewing UI and documentation changes."}</TimelineDescription>
            </TimelineItem>
            <TimelineItem variant="outline" connector={false}>
                <TimelineTime dateTime="2026-05-30">{locale === "ja" ? "5月30日" : "May 30"}</TimelineTime>
                <TimelineTitle>{locale === "ja" ? "公開予定" : "Planned release"}</TimelineTitle>
            </TimelineItem>
        </Timeline>
    );
}

export default function TimelinePage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/timeline", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const code = codeByLocale[locale];

    return (
        <ComponentLayout
            title={content?.title ?? meta.timeline.title}
            description={content?.description ?? meta.timeline.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Timeline", href: "/docs/components/timeline" },
                { name: "TimelineItem", href: "/docs/components/timeline" },
                { name: "TimelineTime", href: "/docs/components/timeline" },
                { name: "Tag", href: "/docs/components/tag" },
            ]}
            relatedComponents={[
                { name: "ActivityTimelineCard", href: "/docs/components/activity-timeline-card" },
                { name: "SegmentTimelineCard", href: "/docs/components/segment-timeline-card" },
                { name: "List", href: "/docs/components/list" },
                { name: "Separator", href: "/docs/components/separator" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="md" previewHeight="auto">
                <ReleaseTimeline locale={locale} />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "progress",
                            title: locale === "ja" ? "進行状況" : "Progress",
                            description: locale === "ja"
                                ? "過去、現在、予定を marker variant で読み分けられるようにします。"
                                : "Use marker variants to distinguish past, current, and planned steps.",
                            preview: <ReleaseTimeline locale={locale} />,
                            code,
                        },
                        {
                            key: "custom-markers",
                            title: locale === "ja" ? "カスタムマーカー" : "Custom markers",
                            description: locale === "ja"
                                ? "状態が重要な履歴では、アイコンで完了・進行中・予定を補強できます。"
                                : "Use icons when completion, active work, and planned states need stronger scanning.",
                            preview: (
                                <Timeline className="w-full max-w-xl">
                                    <TimelineItem marker={<CheckCircle2 className="h-4 w-4 text-primary" />}>
                                        <TimelineTime>{locale === "ja" ? "完了" : "Done"}</TimelineTime>
                                        <TimelineTitle>{locale === "ja" ? "レビュー完了" : "Review complete"}</TimelineTitle>
                                    </TimelineItem>
                                    <TimelineItem marker={<Clock3 className="h-4 w-4 text-muted-foreground" />}>
                                        <TimelineTime>{locale === "ja" ? "進行中" : "In progress"}</TimelineTime>
                                        <TimelineTitle>{locale === "ja" ? "検証中" : "Validation"}</TimelineTitle>
                                    </TimelineItem>
                                    <TimelineItem marker={<Rocket className="h-4 w-4 text-primary" />} connector={false}>
                                        <TimelineTime>{locale === "ja" ? "予定" : "Planned"}</TimelineTime>
                                        <TimelineTitle>{locale === "ja" ? "公開" : "Release"}</TimelineTitle>
                                    </TimelineItem>
                                </Timeline>
                            ),
                            code: markerCodeByLocale[locale],
                        },
                        {
                            key: "compact",
                            title: locale === "ja" ? "短いステップ" : "Short steps",
                            description: locale === "ja"
                                ? "処理ステップだけを示す場合は説明文を省き、タイトル中心で密度を上げます。"
                                : "When only process steps are needed, omit descriptions and keep the timeline compact.",
                            preview: (
                                <Timeline className="w-full max-w-sm gap-0">
                                    <TimelineItem variant="muted">
                                        <TimelineTitle>{locale === "ja" ? "受付" : "Received"}</TimelineTitle>
                                    </TimelineItem>
                                    <TimelineItem variant="active">
                                        <TimelineTitle>{locale === "ja" ? "処理中" : "Processing"}</TimelineTitle>
                                    </TimelineItem>
                                    <TimelineItem variant="outline" connector={false}>
                                        <TimelineTitle>{locale === "ja" ? "完了待ち" : "Waiting to finish"}</TimelineTitle>
                                    </TimelineItem>
                                </Timeline>
                            ),
                            code: compactCodeByLocale[locale],
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </div>
        </ComponentLayout>
    );
}
