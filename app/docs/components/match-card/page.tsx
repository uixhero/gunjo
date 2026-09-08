"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Badge, Button, CompanyCell, MatchCard, PersonCell, Toast, type MatchFactor } from "@gunjo/ui";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

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

/** 左右は同じ種類でなくてよい＝候補者（人）と求人（枠）を突き合わせる形。 */
function CandidateMatchPreview({ locale }: { locale: Locale }) {
  const isJa = locale === "ja";
  const factors: MatchFactor[] = isJa
    ? [
        { label: "経験年数", value: "◎", tone: "success", detail: "希望5年 / 実績7年" },
        { label: "勤務地", value: "×", tone: "destructive", detail: "本人は名古屋・勤務地は東京" },
        { label: "希望年収", value: "○", tone: "success", detail: "620万円 / 提示 650万円" },
      ]
    : [
        { label: "Years of experience", value: "A", tone: "success", detail: "Wanted 5 / has 7" },
        { label: "Location", value: "F", tone: "destructive", detail: "Lives in Nagoya, role is in Tokyo" },
        { label: "Salary", value: "B", tone: "success", detail: "Asking 6.2M / offered 6.5M" },
      ];

  return (
    <div className="w-full max-w-2xl">
      <MatchCard
        label={isJa ? "候補者と求人の適合" : "Candidate and role match"}
        left={
          <PersonCell
            name={isJa ? "中村 涼" : "Ryo Nakamura"}
            secondary={isJa ? "組込みソフト・7年" : "Embedded software, 7 years"}
          />
        }
        right={
          <CompanyCell
            name={isJa ? "制御ソフト開発（東京）" : "Control software (Tokyo)"}
            secondary={isJa ? "正社員・650万円" : "Full time / 6.5M"}
          />
        }
        factorsLabel={isJa ? "突き合わせた項目" : "Compared criteria"}
        factors={factors}
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

  const candidateCode = locale === "ja"
    ? `import { CompanyCell, MatchCard, PersonCell, type MatchFactor } from "@gunjo/ui";

const factors: MatchFactor[] = [
  { label: "経験年数", value: "◎", tone: "success", detail: "希望5年 / 実績7年" },
  { label: "勤務地", value: "×", tone: "destructive", detail: "本人は名古屋・勤務地は東京" },
  { label: "希望年収", value: "○", tone: "success", detail: "620万円 / 提示 650万円" },
];

export function CandidateMatch() {
  return (
    <MatchCard
      label="候補者と求人の適合"
      // 左は人、右は求人。左右が同じ種類である必要はありません。
      left={<PersonCell name="中村 涼" secondary="組込みソフト・7年" />}
      right={<CompanyCell name="制御ソフト開発（東京）" secondary="正社員・650万円" />}
      // score を渡さないと、中央は既定の連結記号になります。
      factorsLabel="突き合わせた項目"
      factors={factors}
    />
  );
}`
    : `import { CompanyCell, MatchCard, PersonCell, type MatchFactor } from "@gunjo/ui";

const factors: MatchFactor[] = [
  {
    label: "Years of experience",
    value: "A",
    tone: "success",
    detail: "Wanted 5 / has 7",
  },
  {
    label: "Location",
    value: "F",
    tone: "destructive",
    detail: "Lives in Nagoya, role is in Tokyo",
  },
  { label: "Salary", value: "B", tone: "success", detail: "Asking 6.2M / offered 6.5M" },
];

export function CandidateMatch() {
  return (
    <MatchCard
      label="Candidate and role match"
      // Left is a person, right is a role — the two sides need not be alike.
      left={
        <PersonCell name="Ryo Nakamura" secondary="Embedded software, 7 years" />
      }
      right={
        <CompanyCell name="Control software (Tokyo)" secondary="Full time / 6.5M" />
      }
      // With no score, the centre falls back to the default connector glyph.
      factorsLabel="Compared criteria"
      factors={factors}
    />
  );
}`;

  const readOnlyCode = locale === "ja"
    ? `import { Badge, CompanyCell, MatchCard, type MatchFactor } from "@gunjo/ui";

const factors: MatchFactor[] = [
  { label: "対象事業者", value: "◎", tone: "success", detail: "製造業・中小企業" },
  { label: "設備投資要件", value: "△", tone: "warning", detail: "見積追加が必要" },
  { label: "補助率", value: "2/3", tone: "success", detail: "上限 1,250万円" },
];

export function ReadOnlySubsidyMatch() {
  return (
    <MatchCard
      left={<CompanyCell name="協栄精密工業" />}
      right={<CompanyCell name="ものづくり補助金" />}
      score={<Badge variant="secondary">92%</Badge>}
      factors={factors}
    />
  );
}`
    : `import { Badge, CompanyCell, MatchCard, type MatchFactor } from "@gunjo/ui";

const factors: MatchFactor[] = [
  { label: "Eligible business", value: "A", tone: "success", detail: "Manufacturing / SMB" },
  { label: "Capital investment", value: "C", tone: "warning", detail: "Additional quote required" },
  { label: "Subsidy rate", value: "2/3", tone: "success", detail: "Up to JPY 12.5M" },
];

export function ReadOnlySubsidyMatch() {
  return (
    <MatchCard
      left={<CompanyCell name="Kyoei Precision" />}
      right={<CompanyCell name="Manufacturing subsidy" />}
      score={<Badge variant="secondary">92%</Badge>}
      factors={factors}
    />
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
      uixheroLinks={[
        {
          label: locale === "ja" ? "UIXHERO: カード（Card）" : "UIXHERO: Card (in Japanese)",
          href: `${UIXHERO_BASE_URL}/resources/ui-components/card`,
          relation: "nearest",
        },
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
              code: readOnlyCode,
              previewBodyWidth: "lg",
            },
            {
              key: "different-kinds",
              title: locale === "ja" ? "左右の種類が違うとき" : "When the two sides differ in kind",
              description: locale === "ja"
                ? "left と right はどちらも任意の識別の一片です。人と求人、荷物と空車のように種類が違っても成り立ちます。score を渡さないと中央は既定の連結記号になり、合わない項目は destructive の色で残します。"
                : "left and right are arbitrary identity nodes, so a person can face a job posting or a load can face a truck. Omit score and the centre falls back to the connector glyph; a criterion that does not fit stays visible in the destructive tone.",
              preview: <CandidateMatchPreview locale={locale} />,
              code: candidateCode,
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
      <section className="space-y-4">
        <div className="border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
            {locale === "ja" ? "設計の判断" : "Design decisions"}
          </h2>
        </div>
        {locale === "ja" ? (
          <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>左右のどちらも「人」だと決めていない。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">left</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">right</code> は任意のノードで、会社と制度、荷物と空車のように、種類の違う2つを並べられます。人どうしに固定した <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">RelationshipRow</code> とは、ここが分かれ目です。
            </li>
            <li>
              <strong>適合度の出し方をカードが決めない。</strong>真ん中の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">score</code> は数値でもメーターでもバッジでもよく、渡さなければ左右をつなぐ記号が出るだけです。「何点なら良いか」は制度ごとに変わるので、部品は判定を持ちません。
            </li>
            <li>
              <strong>内訳は文字つきの印で出す。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">factors</code> の各行は、丸や三角のような文字を色つきの小さな枠に入れて出します。色（<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tone</code>）は補助で、意味は文字が持ちます。色だけで「適合」と「不適合」を分けないためです。
              <br />
              一般のカードの設計は UIXHERO の「カード」にあります。
            </li>
          </ul>
        ) : (
          <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Neither side is assumed to be a person.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">left</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">right</code> take arbitrary nodes, so the pairing can be a company against a subsidy programme, or a shipment against an empty truck. That is what separates this from <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">RelationshipRow</code>, which is fixed at person-to-person.
            </li>
            <li>
              <strong>The card does not decide how a match score is expressed.</strong> The centre <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">score</code> can be a number, a meter or a badge, and without it the card just draws the connector glyph. What counts as a good score differs per programme, so the component holds no judgement of its own.
            </li>
            <li>
              <strong>The breakdown is marked with characters, not colour.</strong> Each <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">factors</code> row puts a symbol in a small tinted chip; <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tone</code> is support and the symbol carries the meaning, so a match and a mismatch are never separated by colour alone.
              <br />
              The general design of cards is covered by UIXHERO&rsquo;s card article.
            </li>
          </ul>
        )}
      </section>
    </ComponentLayout>
  );
}
