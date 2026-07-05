"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { ExpiryBadge, Label, MetadataList, Slider, classifyExpiry } from "@gunjo/ui";

type Locale = "ja" | "en";

const today = "2026-06-28";
const expiryBadgeAlignClass = "w-[244px] justify-end";
const expiryBadgeStateClass = "w-20 shrink-0 justify-start";
const expiryLabelsJa = { valid: "有効", expiring: "期限間近", expired: "失効", missing: "未登録" } as const;
const expiryLabelsEn = { valid: "Valid", expiring: "Expiring", expired: "Expired", missing: "Missing" } as const;

function formatExpiryRemainingJa(days: number) {
  return days < 0 ? `${Math.abs(days)}日超過` : days === 0 ? "本日まで" : `残${days}日`;
}

function formatExpiryRemainingEn(days: number) {
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return "Due today";
  return `${days} days left`;
}

function expiryLabels(locale: Locale) {
  return locale === "ja" ? expiryLabelsJa : expiryLabelsEn;
}

function formatExpiryRemaining(locale: Locale) {
  return locale === "ja" ? formatExpiryRemainingJa : formatExpiryRemainingEn;
}

function expiryCopy(locale: Locale) {
  return locale === "ja"
    ? {
        warningLabel: "期限間近の判定日数",
        days: "日以内",
        statusText: (days: number | null, state: keyof typeof expiryLabelsJa) =>
          days == null ? "適性診断の期限は未登録です。" : `適性診断は ${days} 日後に期限を迎えます。現在の判定は「${expiryLabelsJa[state]}」です。`,
        rows: [
          { label: "普通二種免許", value: "2029-03-15" },
          { label: "適性診断（適齢）", value: "2026-07-20" },
          { label: "健康診断", value: "2026-06-10" },
          { label: "地理試験合格証", value: null },
        ],
      }
    : {
        warningLabel: "Expiring threshold",
        days: "days",
        statusText: (days: number | null, state: keyof typeof expiryLabelsEn) =>
          days == null ? "The aptitude assessment expiry date is missing." : `The aptitude assessment expires in ${days} days. Current state: ${expiryLabelsEn[state]}.`,
        rows: [
          { label: "Professional driver license", value: "2029-03-15" },
          { label: "Aptitude assessment", value: "2026-07-20" },
          { label: "Health check", value: "2026-06-10" },
          { label: "Geography certificate", value: null },
        ],
      };
}

function ExpiryBadgePreview({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const copy = expiryCopy(locale);
  const [warnWithinDays, setWarnWithinDays] = React.useState(30);
  const classified = classifyExpiry("2026-07-20", { today, warnWithinDays });
  const labels = expiryLabels(locale);
  const remainingFormatter = formatExpiryRemaining(locale);

  return (
    <div className="flex w-full max-w-xl flex-col gap-4 rounded-lg border bg-card p-4">
      {!compact ? (
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="expiry-threshold">{copy.warningLabel}</Label>
            <span className="text-sm tabular-nums text-muted-foreground">
              {warnWithinDays} {copy.days}
            </span>
          </div>
          <Slider
            id="expiry-threshold"
            min={7}
            max={90}
            step={1}
            value={warnWithinDays}
            onValueChange={setWarnWithinDays}
            aria-label={copy.warningLabel}
          />
          <p className="text-xs text-muted-foreground">
            {copy.statusText(classified.days, classified.state)}
          </p>
        </div>
      ) : null}

      <MetadataList
        items={copy.rows.map((row) => ({
          label: row.label,
          value: (
            <ExpiryBadge
              value={row.value}
              today={today}
              warnWithinDays={warnWithinDays}
              labels={labels}
              formatRemaining={remainingFormatter}
              className={expiryBadgeAlignClass}
              stateClassName={expiryBadgeStateClass}
              statePosition="end"
            />
          ),
        }))}
      />
    </div>
  );
}

export default function ExpiryBadgeDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/expiry-badge", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.expiryBadge.title ?? "ExpiryBadge";
  const description = content?.description ?? metadata.expiryBadge.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { ExpiryBadge, MetadataList, Slider, classifyExpiry } from "@gunjo/ui";

const today = "2026-06-28";
const expiryBadgeAlignClass = "w-[244px] justify-end";
const expiryBadgeStateClass = "w-20 shrink-0 justify-start";
const expiryLabels = { valid: "有効", expiring: "期限間近", expired: "失効", missing: "未登録" } as const;

function formatExpiryRemaining(days: number) {
  return days < 0 ? \`\${Math.abs(days)}日超過\` : days === 0 ? "本日まで" : \`残\${days}日\`;
}

export function ComplianceExpiryList() {
  const [warnWithinDays, setWarnWithinDays] = React.useState(30);
  const rows = [
    { label: "普通二種免許", value: "2029-03-15" },
    { label: "適性診断（適齢）", value: "2026-07-20" },
    { label: "健康診断", value: "2026-06-10" },
    { label: "地理試験合格証", value: null },
  ];
  const assessment = classifyExpiry("2026-07-20", { today, warnWithinDays });

  return (
    <div className="flex w-full max-w-xl flex-col gap-4 rounded-lg border bg-card p-4">
      <Slider
        min={7}
        max={90}
        step={1}
        value={warnWithinDays}
        onValueChange={setWarnWithinDays}
        aria-label="期限間近の判定日数"
      />
      <p className="text-xs text-muted-foreground">
        適性診断は {assessment.days} 日後に期限を迎えます。現在の判定は「{expiryLabels[assessment.state]}」です。
      </p>
      <MetadataList
        items={rows.map((row) => ({
          label: row.label,
          value: (
            <ExpiryBadge
              value={row.value}
              today={today}
              warnWithinDays={warnWithinDays}
              labels={expiryLabels}
              formatRemaining={formatExpiryRemaining}
              className={expiryBadgeAlignClass}
              stateClassName={expiryBadgeStateClass}
              statePosition="end"
            />
          ),
        }))}
      />
    </div>
  );
}`
    : `import * as React from "react";
import { ExpiryBadge, MetadataList, Slider, classifyExpiry } from "@gunjo/ui";

const today = "2026-06-28";
const expiryBadgeAlignClass = "w-[244px] justify-end";
const expiryBadgeStateClass = "w-20 shrink-0 justify-start";
const expiryLabels = { valid: "Valid", expiring: "Expiring", expired: "Expired", missing: "Missing" } as const;

function formatExpiryRemaining(days: number) {
  if (days < 0) return \`\${Math.abs(days)} days overdue\`;
  if (days === 0) return "Due today";
  return \`\${days} days left\`;
}

export function ComplianceExpiryList() {
  const [warnWithinDays, setWarnWithinDays] = React.useState(30);
  const rows = [
    { label: "Professional driver license", value: "2029-03-15" },
    { label: "Aptitude assessment", value: "2026-07-20" },
    { label: "Health check", value: "2026-06-10" },
    { label: "Geography certificate", value: null },
  ];
  const assessment = classifyExpiry("2026-07-20", { today, warnWithinDays });

  return (
    <div className="flex w-full max-w-xl flex-col gap-4 rounded-lg border bg-card p-4">
      <Slider
        min={7}
        max={90}
        step={1}
        value={warnWithinDays}
        onValueChange={setWarnWithinDays}
        aria-label="Expiring threshold"
      />
      <p className="text-xs text-muted-foreground">
        The aptitude assessment expires in {assessment.days} days. Current state: {expiryLabels[assessment.state]}.
      </p>
      <MetadataList
        items={rows.map((row) => ({
          label: row.label,
          value: (
            <ExpiryBadge
              value={row.value}
              today={today}
              warnWithinDays={warnWithinDays}
              labels={expiryLabels}
              formatRemaining={formatExpiryRemaining}
              className={expiryBadgeAlignClass}
              stateClassName={expiryBadgeStateClass}
              statePosition="end"
            />
          ),
        }))}
      />
    </div>
  );
}`;

  const propsData = [
    {
      name: "value",
      type: "string | number | Date | null",
      description: locale === "ja" ? "判定する期限日です。null または未指定は missing になります。" : "Expiry date to classify. null or undefined becomes missing.",
    },
    {
      name: "today",
      type: "string | number | Date",
      default: "new Date()",
      description: locale === "ja" ? "比較基準日です。SSR では明示指定します。" : "Comparison date. Pass explicitly for SSR determinism.",
    },
    {
      name: "warnWithinDays",
      type: "number",
      default: "30",
      description: locale === "ja" ? "この日数以内を expiring と判定します。" : "Classifies dates within this many days as expiring.",
    },
    {
      name: "showDate",
      type: "boolean",
      default: "true",
      description: locale === "ja" ? "状態チップの横に日付を表示します。" : "Shows the date next to the state chip.",
    },
    {
      name: "hideRemaining",
      type: "boolean",
      default: "false",
      description: locale === "ja" ? "残日数または超過日数を隠します。" : "Hides the remaining or overdue readout.",
    },
    {
      name: "formatDate",
      type: "(date: Date) => string",
      description: locale === "ja" ? "日付表示の整形関数です。" : "Formats the rendered date.",
    },
    {
      name: "formatRemaining",
      type: "(days: number, state: ExpiryState) => ReactNode",
      description: locale === "ja" ? "残日数または超過日数の表示文言を整形します。" : "Formats the remaining or overdue readout.",
    },
    {
      name: "labels",
      type: "Partial<Record<ExpiryState, ReactNode>>",
      description: locale === "ja" ? "状態ラベルを上書きします。" : "Overrides state labels.",
    },
    {
      name: "stateClassName",
      type: "string",
      description: locale === "ja" ? "状態チップ部分だけに追加する className です。表や一覧で幅を揃える時に使います。" : "Class name applied only to the state chip, useful for aligning widths in tables or lists.",
    },
    {
      name: "statePosition",
      type: "\"start\" | \"end\"",
      default: "\"start\"",
      description: locale === "ja" ? "状態チップを日付・残日数の前後どちらに置くかを指定します。" : "Controls whether the state chip is placed before or after the date and remaining text.",
    },
    {
      name: "classifyExpiry",
      type: "(value, options) => { state, days }",
      description: locale === "ja" ? "UI なしで同じ期限分類を返す純関数です。" : "Pure helper that returns the same expiry classification without UI.",
    },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "ExpiryBadge", href: "/docs/components/expiry-badge" },
        { name: "MetadataList", href: "/docs/components/metadata-list" },
        { name: "Slider", href: "/docs/components/slider" },
      ]}
      relatedComponents={[
        { name: "ReferenceValue", href: "/docs/components/reference-value" },
        { name: "Meter", href: "/docs/components/meter" },
        { name: "Badge", href: "/docs/components/badge" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <ExpiryBadgePreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "all-states",
              title: locale === "ja" ? "4つの状態" : "Four states",
              description: locale === "ja"
                ? "valid / expiring / expired / missing を、アイコンと文言を含むチップで表示します。"
                : "Valid, expiring, expired, and missing are shown with both icon and label.",
              preview: <ExpiryBadgePreview locale={locale} compact />,
              code: locale === "ja"
                ? `<ExpiryBadge value="2029-03-15" today="${today}" className="w-[244px] justify-end" stateClassName="w-20 shrink-0 justify-start" statePosition="end" />
<ExpiryBadge value="2026-07-20" today="${today}" className="w-[244px] justify-end" stateClassName="w-20 shrink-0 justify-start" statePosition="end" />
<ExpiryBadge value="2026-06-10" today="${today}" className="w-[244px] justify-end" stateClassName="w-20 shrink-0 justify-start" statePosition="end" />
<ExpiryBadge value={null} today="${today}" className="w-[244px] justify-end" stateClassName="w-20 shrink-0 justify-start" statePosition="end" />`
                : `<ExpiryBadge
  value="2029-03-15"
  today="${today}"
  labels={{ valid: "Valid", expiring: "Expiring", expired: "Expired", missing: "Missing" }}
  formatRemaining={(days) => days < 0 ? \`\${Math.abs(days)} days overdue\` : days === 0 ? "Due today" : \`\${days} days left\`}
  className="w-[244px] justify-end"
  stateClassName="w-20 shrink-0 justify-start"
  statePosition="end"
/>
<ExpiryBadge
  value="2026-07-20"
  today="${today}"
  labels={{ valid: "Valid", expiring: "Expiring", expired: "Expired", missing: "Missing" }}
  formatRemaining={(days) => days < 0 ? \`\${Math.abs(days)} days overdue\` : days === 0 ? "Due today" : \`\${days} days left\`}
  className="w-[244px] justify-end"
  stateClassName="w-20 shrink-0 justify-start"
  statePosition="end"
/>
<ExpiryBadge
  value="2026-06-10"
  today="${today}"
  labels={{ valid: "Valid", expiring: "Expiring", expired: "Expired", missing: "Missing" }}
  formatRemaining={(days) => days < 0 ? \`\${Math.abs(days)} days overdue\` : days === 0 ? "Due today" : \`\${days} days left\`}
  className="w-[244px] justify-end"
  stateClassName="w-20 shrink-0 justify-start"
  statePosition="end"
/>
<ExpiryBadge
  value={null}
  today="${today}"
  labels={{ valid: "Valid", expiring: "Expiring", expired: "Expired", missing: "Missing" }}
  formatRemaining={(days) => days < 0 ? \`\${Math.abs(days)} days overdue\` : days === 0 ? "Due today" : \`\${days} days left\`}
  className="w-[244px] justify-end"
  stateClassName="w-20 shrink-0 justify-start"
  statePosition="end"
/>`,
              previewBodyWidth: "md",
            },
            {
              key: "date-hidden",
              title: locale === "ja" ? "日付と残日数の制御" : "Date and remaining controls",
              description: locale === "ja"
                ? "showDate と hideRemaining で、一覧密度に合わせて表示量を調整します。"
                : "Use showDate and hideRemaining to tune density in lists.",
              preview: (
                <div className="flex flex-wrap items-center gap-3">
                  <ExpiryBadge value="2026-07-20" today={today} showDate={false} labels={expiryLabels(locale)} formatRemaining={formatExpiryRemaining(locale)} />
                  <ExpiryBadge value="2026-07-20" today={today} hideRemaining labels={expiryLabels(locale)} formatRemaining={formatExpiryRemaining(locale)} />
                </div>
              ),
              code: locale === "ja"
                ? `<ExpiryBadge value="2026-07-20" today="${today}" showDate={false} />
<ExpiryBadge value="2026-07-20" today="${today}" hideRemaining />`
                : `<ExpiryBadge
  value="2026-07-20"
  today="${today}"
  showDate={false}
  labels={{ expiring: "Expiring" }}
  formatRemaining={(days) => \`\${days} days left\`}
/>
<ExpiryBadge
  value="2026-07-20"
  today="${today}"
  hideRemaining
  labels={{ expiring: "Expiring" }}
/>`,
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
