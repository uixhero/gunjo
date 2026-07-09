"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Badge, RelationshipRow, Separator } from "@gunjo/ui";

type Locale = "ja" | "en";

function pairs(locale: Locale) {
  return locale === "ja"
    ? [
        {
          from: { name: "渡辺 文雄", secondary: "利用者・要介護3", avatar: { fallback: "渡" }, avatarClassName: "bg-info-subtle text-info-subtle-foreground" },
          relationshipLabel: "担当",
          to: { name: "田渕 美和子", secondary: "介護支援専門員", avatar: { fallback: "田" }, presence: "online" as const, presenceLabel: "online" },
          trailing: <Badge variant="success">交付済</Badge>,
        },
        {
          from: { name: "山田 大輔", secondary: "プロダクト本部", avatar: { fallback: "山" } },
          relationshipLabel: "上司",
          to: { name: "伊藤 健太", secondary: "EM", avatar: { fallback: "伊" } },
          trailing: <Badge variant="warning">期限超過</Badge>,
        },
        {
          from: { name: "佐藤 健一", secondary: "訪問ヘルパー", avatar: { fallback: "佐" }, presence: "online" as const, presenceLabel: "online" },
          relationshipLabel: "訪問",
          to: { name: "小林 トヨ", secondary: "利用者・88歳", avatar: { fallback: "小" } },
          trailing: <Badge variant="info">本日2件</Badge>,
        },
      ]
    : [
        {
          from: { name: "Fumio Watanabe", secondary: "Client / care level 3", avatar: { fallback: "F" }, avatarClassName: "bg-info-subtle text-info-subtle-foreground" },
          relationshipLabel: "Assignee",
          to: { name: "Miwako Tabuchi", secondary: "Care manager", avatar: { fallback: "M" }, presence: "online" as const, presenceLabel: "online" },
          trailing: <Badge variant="success">Issued</Badge>,
        },
        {
          from: { name: "Daisuke Yamada", secondary: "Product", avatar: { fallback: "D" } },
          relationshipLabel: "Manager",
          to: { name: "Kenta Ito", secondary: "Engineering manager", avatar: { fallback: "K" } },
          trailing: <Badge variant="warning">Overdue</Badge>,
        },
        {
          from: { name: "Kenichi Sato", secondary: "Home helper", avatar: { fallback: "K" }, presence: "online" as const, presenceLabel: "online" },
          relationshipLabel: "Visit",
          to: { name: "Toyo Kobayashi", secondary: "Client / 88", avatar: { fallback: "T" } },
          trailing: <Badge variant="info">2 today</Badge>,
        },
      ];
}

function RelationshipRowPreview({ locale, mode = "list" }: { locale: Locale; mode?: "list" | "small" | "custom" }) {
  const data = pairs(locale);

  if (mode === "small") {
    return (
      <div className="w-full max-w-xl rounded-lg border bg-card p-4">
        <RelationshipRow from={data[0].from} to={data[0].to} relationshipLabel={data[0].relationshipLabel} trailing={data[0].trailing} size="sm" />
      </div>
    );
  }

  if (mode === "custom") {
    return (
      <div className="w-full max-w-xl rounded-lg border bg-card p-4">
        <RelationshipRow
          from={data[2].from}
          to={data[2].to}
          relationshipLabel={data[2].relationshipLabel}
          connector={<span className="text-xs font-semibold text-primary">→</span>}
          trailing={data[2].trailing}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-xl flex-col rounded-lg border bg-card p-3">
      {data.map((pair, index) => (
        <React.Fragment key={`${pair.from.name}-${pair.to.name}`}>
          {index > 0 ? <Separator /> : null}
          <div className="py-2.5">
            <RelationshipRow from={pair.from} to={pair.to} relationshipLabel={pair.relationshipLabel} trailing={pair.trailing} />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function RelationshipRowDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/relationship-row", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.relationshipRow.title ?? "RelationshipRow";
  const description = content?.description ?? metadata.relationshipRow.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { Badge, RelationshipRow, Separator } from "@gunjo/ui";

const pairs = [
  {
    from: { name: "渡辺 文雄", secondary: "利用者・要介護3", avatar: { fallback: "渡" }, avatarClassName: "bg-info-subtle text-info-subtle-foreground" },
    relationshipLabel: "担当",
    to: { name: "田渕 美和子", secondary: "介護支援専門員", avatar: { fallback: "田" }, presence: "online", presenceLabel: "online" },
    trailing: <Badge variant="success">交付済</Badge>,
  },
  {
    from: { name: "山田 大輔", secondary: "プロダクト本部", avatar: { fallback: "山" } },
    relationshipLabel: "上司",
    to: { name: "伊藤 健太", secondary: "EM", avatar: { fallback: "伊" } },
    trailing: <Badge variant="warning">期限超過</Badge>,
  },
  {
    from: { name: "佐藤 健一", secondary: "訪問ヘルパー", avatar: { fallback: "佐" }, presence: "online", presenceLabel: "online" },
    relationshipLabel: "訪問",
    to: { name: "小林 トヨ", secondary: "利用者・88歳", avatar: { fallback: "小" } },
    trailing: <Badge variant="info">本日2件</Badge>,
  },
];

export function CareRelationship() {
  return (
    <div className="flex w-full max-w-xl flex-col rounded-lg border bg-card p-3">
      {pairs.map((pair, index) => (
        <React.Fragment key={\`\${pair.from.name}-\${pair.to.name}\`}>
          {index > 0 ? <Separator /> : null}
          <div className="py-2.5">
            <RelationshipRow from={pair.from} to={pair.to} relationshipLabel={pair.relationshipLabel} trailing={pair.trailing} />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}`
    : `import * as React from "react";
import { Badge, RelationshipRow, Separator } from "@gunjo/ui";

const pairs = [
  {
    from: { name: "Fumio Watanabe", secondary: "Client / care level 3", avatar: { fallback: "F" }, avatarClassName: "bg-info-subtle text-info-subtle-foreground" },
    relationshipLabel: "Assignee",
    to: { name: "Miwako Tabuchi", secondary: "Care manager", avatar: { fallback: "M" }, presence: "online", presenceLabel: "online" },
    trailing: <Badge variant="success">Issued</Badge>,
  },
  {
    from: { name: "Daisuke Yamada", secondary: "Product", avatar: { fallback: "D" } },
    relationshipLabel: "Manager",
    to: { name: "Kenta Ito", secondary: "Engineering manager", avatar: { fallback: "K" } },
    trailing: <Badge variant="warning">Overdue</Badge>,
  },
  {
    from: { name: "Kenichi Sato", secondary: "Home helper", avatar: { fallback: "K" }, presence: "online", presenceLabel: "online" },
    relationshipLabel: "Visit",
    to: { name: "Toyo Kobayashi", secondary: "Client / 88", avatar: { fallback: "T" } },
    trailing: <Badge variant="info">2 today</Badge>,
  },
];

export function CareRelationship() {
  return (
    <div className="flex w-full max-w-xl flex-col rounded-lg border bg-card p-3">
      {pairs.map((pair, index) => (
        <React.Fragment key={\`\${pair.from.name}-\${pair.to.name}\`}>
          {index > 0 ? <Separator /> : null}
          <div className="py-2.5">
            <RelationshipRow from={pair.from} to={pair.to} relationshipLabel={pair.relationshipLabel} trailing={pair.trailing} />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}`;

  const smallStateCode = locale === "ja"
    ? `import { Badge, RelationshipRow } from "@gunjo/ui";

export function CompactCareRelationship() {
  return (
    <div className="w-full max-w-xl rounded-lg border bg-card p-4">
      <RelationshipRow
        from={{ name: "渡辺 文雄", secondary: "利用者・要介護3", avatar: { fallback: "渡" }, avatarClassName: "bg-info-subtle text-info-subtle-foreground" }}
        to={{ name: "田渕 美和子", secondary: "介護支援専門員", avatar: { fallback: "田" }, presence: "online", presenceLabel: "online" }}
        relationshipLabel="担当"
        trailing={<Badge variant="success">交付済</Badge>}
        size="sm"
      />
    </div>
  );
}`
    : `import { Badge, RelationshipRow } from "@gunjo/ui";

export function CompactCareRelationship() {
  return (
    <div className="w-full max-w-xl rounded-lg border bg-card p-4">
      <RelationshipRow
        from={{ name: "Fumio Watanabe", secondary: "Client / care level 3", avatar: { fallback: "F" }, avatarClassName: "bg-info-subtle text-info-subtle-foreground" }}
        to={{ name: "Miwako Tabuchi", secondary: "Care manager", avatar: { fallback: "M" }, presence: "online", presenceLabel: "online" }}
        relationshipLabel="Assignee"
        trailing={<Badge variant="success">Issued</Badge>}
        size="sm"
      />
    </div>
  );
}`;

  const customStateCode = locale === "ja"
    ? `import { Badge, RelationshipRow } from "@gunjo/ui";

export function VisitRelationship() {
  return (
    <div className="w-full max-w-xl rounded-lg border bg-card p-4">
      <RelationshipRow
        from={{ name: "佐藤 健一", secondary: "訪問ヘルパー", avatar: { fallback: "佐" }, presence: "online", presenceLabel: "online" }}
        to={{ name: "小林 トヨ", secondary: "利用者・88歳", avatar: { fallback: "小" } }}
        relationshipLabel="訪問"
        connector={<span className="text-xs font-semibold text-primary">→</span>}
        trailing={<Badge variant="info">本日2件</Badge>}
      />
    </div>
  );
}`
    : `import { Badge, RelationshipRow } from "@gunjo/ui";

export function VisitRelationship() {
  return (
    <div className="w-full max-w-xl rounded-lg border bg-card p-4">
      <RelationshipRow
        from={{ name: "Kenichi Sato", secondary: "Home helper", avatar: { fallback: "K" }, presence: "online", presenceLabel: "online" }}
        to={{ name: "Toyo Kobayashi", secondary: "Client / 88", avatar: { fallback: "T" } }}
        relationshipLabel="Visit"
        connector={<span className="text-xs font-semibold text-primary">→</span>}
        trailing={<Badge variant="info">2 today</Badge>}
      />
    </div>
  );
}`;

  const propsData = [
    { name: "from / to", type: "PersonCellProps", description: locale === "ja" ? "左右に表示する人物です。PersonCell の name/secondary/avatar/presence などを渡します。" : "Left and right people. Pass PersonCell props such as name, secondary, avatar, and presence." },
    { name: "relationshipLabel", type: "ReactNode", description: locale === "ja" ? "コネクタ下に出す関係ラベルです。" : "Small label under the connector." },
    { name: "connector", type: "ReactNode", default: "双方向矢印", description: locale === "ja" ? "2人の間に置くグリフや要素です。" : "Glyph or element rendered between the two people." },
    { name: "trailing", type: "ReactNode", description: locale === "ja" ? "ステータスバッジ、件数、操作などの末尾スロットです。" : "Trailing slot for status badges, counts, or actions." },
    { name: "size", type: '"sm" | "md" | "lg"', description: locale === "ja" ? "両側の PersonCell に渡すサイズです。from/to 側で個別に上書きできます。" : "Size forwarded to both PersonCells unless each side overrides it." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "RelationshipRow", href: "/docs/components/relationship-row" }, { name: "PersonCell", href: "/docs/components/person-cell" }, { name: "Badge", href: "/docs/components/badge" }]}
      relatedComponents={[{ name: "ListCard", href: "/docs/components/list-card" }, { name: "Table", href: "/docs/components/table" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="lg">
        <RelationshipRowPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "paired",
              title: locale === "ja" ? "関係ペア" : "Paired people",
              description: locale === "ja" ? "左右それぞれが完全な PersonCell なので、在席や末尾情報も持てます。" : "Each side is a full PersonCell, so presence and trailing metadata are preserved.",
              preview: <RelationshipRowPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "lg",
            },
            {
              key: "small",
              title: locale === "ja" ? "小サイズ" : "Small size",
              description: locale === "ja" ? "密な表や管理画面では size=\"sm\" で行高を抑えます。" : "Use size=\"sm\" in dense tables or admin panels.",
              preview: <RelationshipRowPreview locale={locale} mode="small" />,
              code: smallStateCode,
              previewBodyWidth: "lg",
            },
            {
              key: "custom-connector",
              title: locale === "ja" ? "片方向の関係" : "Custom connector",
              description: locale === "ja" ? "訪問や依頼のように方向性がある場合は connector を差し替えます。" : "Swap connector when the relationship has a direction, such as a visit or request.",
              preview: <RelationshipRowPreview locale={locale} mode="custom" />,
              code: customStateCode,
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
