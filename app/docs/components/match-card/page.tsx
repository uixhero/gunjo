"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Badge, Button, CompanyCell, MatchCard, Toast, type MatchFactor } from "@gunjo/ui";

type Locale = "ja" | "en";

function matchFactors(locale: Locale): MatchFactor[] {
  return locale === "ja"
    ? [
        { label: "対象事業者", value: "◎", tone: "success", detail: "製造業・中小企業" },
        { label: "設備投資要件", value: "△", tone: "warning", detail: "見積追加が必要" },
        { label: "補助率", value: "2/3", tone: "success", detail: "上限 1,250万円" },
      ]
    : [
        { label: "Eligible business", value: "A", tone: "success", detail: "Manufacturing / SMB" },
        { label: "Capital investment", value: "C", tone: "warning", detail: "Additional quote required" },
        { label: "Subsidy rate", value: "2/3", tone: "success", detail: "Up to JPY 12.5M" },
      ];
}

function MatchCardPreview({ locale, actions = true }: { locale: Locale; actions?: boolean }) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  return (
    <div ref={rootRef} className="relative flex w-full max-w-2xl flex-col gap-4">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-3 z-[100] w-[min(340px,calc(100%-1.5rem))]">
          <Toast
            message={toastMessage}
            type="success"
            isVisible
            onClose={() => setToastMessage(null)}
            placement="inline"
            closeLabel={locale === "ja" ? "閉じる" : "Close"}
            tooltipPortalContainer={portalContainer}
          />
        </div>
      ) : null}
      <MatchCard
        label={locale === "ja" ? "補助金適合カード" : "Subsidy match card"}
        left={
          <CompanyCell
            name={locale === "ja" ? "協栄精密工業" : "Kyoei Precision"}
            secondary={locale === "ja" ? "製造業・愛知" : "Manufacturing / Aichi"}
          />
        }
        right={
          <CompanyCell
            name={locale === "ja" ? "ものづくり補助金" : "Manufacturing subsidy"}
            secondary={locale === "ja" ? "設備投資・上限1,250万円" : "Capital investment / up to JPY 12.5M"}
          />
        }
        score={<Badge variant="secondary">92%</Badge>}
        factorsLabel={locale === "ja" ? "適合の内訳" : "Match breakdown"}
        factors={matchFactors(locale)}
        actions={actions ? (
          <Button size="sm" onClick={() => setToastMessage(locale === "ja" ? "申請準備を開始しました。" : "Started application preparation.")}>
            {locale === "ja" ? "申請を準備する" : "Prepare application"}
          </Button>
        ) : undefined}
      />
    </div>
  );
}

export default function MatchCardDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/match-card", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.matchCard.title ?? "MatchCard";
  const description = content?.description ?? metadata.matchCard.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { Badge, Button, CompanyCell, MatchCard, Toast, type MatchFactor } from "@gunjo/ui";

const factors: MatchFactor[] = [
  { label: "対象事業者", value: "◎", tone: "success", detail: "製造業・中小企業" },
  { label: "設備投資要件", value: "△", tone: "warning", detail: "見積追加が必要" },
  { label: "補助率", value: "2/3", tone: "success", detail: "上限 1,250万円" },
];

export function SubsidyMatch() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  return (
    <div ref={rootRef} className="relative flex w-full max-w-2xl flex-col gap-4">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-3 z-[100] w-[min(340px,calc(100%-1.5rem))]">
          <Toast
            message={toastMessage}
            type="success"
            isVisible
            onClose={() => setToastMessage(null)}
            placement="inline"
            closeLabel="閉じる"
            tooltipPortalContainer={portalContainer}
          />
        </div>
      ) : null}
      <MatchCard
        label="補助金適合カード"
        left={<CompanyCell name="協栄精密工業" secondary="製造業・愛知" />}
        right={<CompanyCell name="ものづくり補助金" secondary="設備投資・上限1,250万円" />}
        score={<Badge variant="secondary">92%</Badge>}
        factorsLabel="適合の内訳"
        factors={factors}
        actions={<Button size="sm" onClick={() => setToastMessage("申請準備を開始しました。")}>申請を準備する</Button>}
      />
    </div>
  );
}`
    : `import * as React from "react";
import { Badge, Button, CompanyCell, MatchCard, Toast, type MatchFactor } from "@gunjo/ui";

const factors: MatchFactor[] = [
  { label: "Eligible business", value: "A", tone: "success", detail: "Manufacturing / SMB" },
  { label: "Capital investment", value: "C", tone: "warning", detail: "Additional quote required" },
  { label: "Subsidy rate", value: "2/3", tone: "success", detail: "Up to JPY 12.5M" },
];

export function SubsidyMatch() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  return (
    <div ref={rootRef} className="relative flex w-full max-w-2xl flex-col gap-4">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-3 z-[100] w-[min(340px,calc(100%-1.5rem))]">
          <Toast
            message={toastMessage}
            type="success"
            isVisible
            onClose={() => setToastMessage(null)}
            placement="inline"
            closeLabel="Close"
            tooltipPortalContainer={portalContainer}
          />
        </div>
      ) : null}
      <MatchCard
        label="Subsidy match card"
        left={<CompanyCell name="Kyoei Precision" secondary="Manufacturing / Aichi" />}
        right={<CompanyCell name="Manufacturing subsidy" secondary="Capital investment / up to JPY 12.5M" />}
        score={<Badge variant="secondary">92%</Badge>}
        factorsLabel="Match breakdown"
        factors={factors}
        actions={<Button size="sm" onClick={() => setToastMessage("Started application preparation.")}>Prepare application</Button>}
      />
    </div>
  );
}`;

  const propsData = [
    { name: "left / right", type: "ReactNode", description: locale === "ja" ? "左右に置く対象です。CompanyCell や PersonCell など任意の identity node を渡せます。" : "Left and right entities. Pass CompanyCell, PersonCell, or any identity node." },
    { name: "score", type: "ReactNode", description: locale === "ja" ? "中央に置く適合度やスコアです。省略時は交換アイコンです。" : "Center score or connector. Defaults to an exchange icon." },
    { name: "factors", type: "MatchFactor[]", description: locale === "ja" ? "評価項目ごとの判定です。" : "Factor-by-factor match breakdown." },
    { name: "factorsLabel", type: "ReactNode", default: '"適合の内訳"', description: locale === "ja" ? "内訳の見出しです。" : "Heading for the factor list." },
    { name: "actions", type: "ReactNode", description: locale === "ja" ? "打診、申請、NDA などの次操作です。" : "Trailing follow-up actions such as apply, contact, or NDA." },
    { name: "label", type: "ReactNode", description: locale === "ja" ? "カード全体のアクセシブル名です。" : "Accessible name for the card." },
    { name: "MatchFactor.label / value", type: "ReactNode", description: locale === "ja" ? "評価項目名と判定値です。" : "Criterion label and judgement value." },
    { name: "MatchFactor.tone", type: '"default" | "success" | "warning" | "destructive" | "muted"', default: '"default"', description: locale === "ja" ? "判定チップのトーンです。" : "Tone for the judgement chip." },
    { name: "MatchFactor.detail", type: "ReactNode", description: locale === "ja" ? "行下に置く詳細です。" : "Optional detail under a factor row." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "MatchCard", href: "/docs/components/match-card" },
        { name: "CompanyCell", href: "/docs/components/company-cell" },
        { name: "Button", href: "/docs/components/button" },
      ]}
      relatedComponents={[
        { name: "Leaderboard", href: "/docs/components/leaderboard" },
        { name: "Meter", href: "/docs/components/meter" },
        { name: "RelationshipRow", href: "/docs/components/relationship-row" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="lg">
        <MatchCardPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "with-actions",
              title: locale === "ja" ? "アクション付き" : "With actions",
              description: locale === "ja" ? "actions slot には次に取る操作を置き、プレビュー内で結果を表示します。" : "Place follow-up controls in the actions slot and show the result inside the preview.",
              preview: <MatchCardPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "lg",
            },
            {
              key: "read-only",
              title: locale === "ja" ? "表示専用" : "Read-only",
              description: locale === "ja" ? "actions を省略すると、比較結果だけを表示するカードになります。" : "Omit actions for a read-only comparison card.",
              preview: <MatchCardPreview locale={locale} actions={false} />,
              code: `<MatchCard
  left={<CompanyCell name="${locale === "ja" ? "協栄精密工業" : "Kyoei Precision"}" />}
  right={<CompanyCell name="${locale === "ja" ? "ものづくり補助金" : "Manufacturing subsidy"}" />}
  score={<Badge variant="secondary">92%</Badge>}
  factors={factors}
/>`,
              previewBodyWidth: "lg",
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
