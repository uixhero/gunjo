"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Badge, PersonCell, Separator } from "@gunjo/ui";

type Locale = "ja" | "en";

function people(locale: Locale) {
  return locale === "ja"
    ? [
        { name: "佐藤 美咲", secondary: "プロダクト本部 / シニアUXデザイナー", tertiary: "正社員・東京本社", avatar: { src: "https://i.pravatar.cc/80?img=47" }, presence: "online" as const, trailing: <Badge variant="success">在籍</Badge> },
        { name: "高橋 健一", secondary: "デザインマネージャー", tertiary: "大阪支社", avatar: { fallback: "高" }, avatarClassName: "bg-info-subtle text-info-subtle-foreground", presence: "away" as const, trailing: <Badge variant="warning">休職中</Badge> },
        { name: "山田 涼介", secondary: "人事 HRBP", tertiary: "契約更新確認中", avatar: { fallback: "山" }, avatarClassName: "bg-warning-subtle text-warning-subtle-foreground", trailing: <Badge variant="outline">更新待ち</Badge> },
      ]
    : [
        { name: "Mia Sato", secondary: "Product / Senior UX Designer", tertiary: "Full-time / Tokyo", avatar: { src: "https://i.pravatar.cc/80?img=47" }, presence: "online" as const, trailing: <Badge variant="success">Active</Badge> },
        { name: "Ken Takahashi", secondary: "Design Manager", tertiary: "Osaka office", avatar: { fallback: "K" }, avatarClassName: "bg-info-subtle text-info-subtle-foreground", presence: "away" as const, trailing: <Badge variant="warning">Leave</Badge> },
        { name: "Ryo Yamada", secondary: "HR Business Partner", tertiary: "Contract review", avatar: { fallback: "R" }, avatarClassName: "bg-warning-subtle text-warning-subtle-foreground", trailing: <Badge variant="outline">Pending</Badge> },
      ];
}

function PersonCellPreview({ locale, mode = "list" }: { locale: Locale; mode?: "list" | "sizes" | "minimal" }) {
  if (mode === "sizes") {
    const label = locale === "ja" ? "中野 葵" : "Aoi Nakano";
    const secondary = locale === "ja" ? "エンジニアリング本部" : "Engineering";
    return (
      <div className="grid w-full max-w-md gap-4 rounded-lg border bg-card p-4">
        <PersonCell size="sm" name={label} secondary={secondary} avatar={{ fallback: locale === "ja" ? "中" : "A" }} />
        <PersonCell size="md" name={label} secondary={secondary} avatar={{ fallback: locale === "ja" ? "中" : "A" }} />
        <PersonCell size="lg" name={label} secondary={secondary} avatar={{ fallback: locale === "ja" ? "中" : "A" }} />
      </div>
    );
  }

  if (mode === "minimal") {
    return (
      <div className="w-full max-w-md rounded-lg border bg-card p-4">
        <PersonCell
          name={locale === "ja" ? "小林 トヨ" : "Toyo Kobayashi"}
          secondary={locale === "ja" ? "利用者 / 88歳" : "Client / 88"}
          avatar={{ fallback: locale === "ja" ? "小" : "T" }}
          avatarClassName="bg-secondary text-secondary-foreground"
        />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col rounded-lg border bg-card p-3">
      {people(locale).map((person, index) => (
        <React.Fragment key={person.name}>
          {index > 0 ? <Separator /> : null}
          <div className="py-2.5">
            <PersonCell
              name={person.name}
              secondary={person.secondary}
              tertiary={person.tertiary}
              avatar={person.avatar}
              avatarClassName={person.avatarClassName}
              presence={person.presence}
              presenceLabel={person.presence}
              trailing={person.trailing}
            />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// Interactive variant: onActivate makes each cell a <button> — a chevron is the
// affordance, and keyboard/click both activate. (#341)
function InteractivePeopleDemo({ locale }: { locale: Locale }) {
  const isJa = locale === "ja";
  const [selected, setSelected] = React.useState<string | null>(null);
  const rows = people(locale);
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      {rows.map((person) => (
        <PersonCell
          key={typeof person.name === "string" ? person.name : undefined}
          name={person.name}
          secondary={person.secondary}
          avatar={person.avatar}
          avatarClassName={person.avatarClassName}
          presence={person.presence}
          onActivate={() => setSelected(typeof person.name === "string" ? person.name : null)}
        />
      ))}
      <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
        {isJa ? "選択中: " : "Selected: "}
        <span className="font-medium text-foreground">{selected ?? "—"}</span>
      </p>
    </div>
  );
}

export default function PersonCellDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/person-cell", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.personCell.title ?? "PersonCell";
  const description = content?.description ?? metadata.personCell.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { Badge, PersonCell, Separator } from "@gunjo/ui";

const people = [
  {
    name: "佐藤 美咲",
    secondary: "プロダクト本部 / シニアUXデザイナー",
    tertiary: "正社員・東京本社",
    avatar: { src: "https://i.pravatar.cc/80?img=47" },
    presence: "online",
    trailing: <Badge variant="success">在籍</Badge>,
  },
  {
    name: "高橋 健一",
    secondary: "デザインマネージャー",
    tertiary: "大阪支社",
    avatar: { fallback: "高" },
    avatarClassName: "bg-info-subtle text-info-subtle-foreground",
    presence: "away",
    trailing: <Badge variant="warning">休職中</Badge>,
  },
  {
    name: "山田 涼介",
    secondary: "人事 HRBP",
    tertiary: "契約更新確認中",
    avatar: { fallback: "山" },
    avatarClassName: "bg-warning-subtle text-warning-subtle-foreground",
    trailing: <Badge variant="outline">更新待ち</Badge>,
  },
];

export function DirectoryRows() {
  return (
    <div className="flex w-full max-w-md flex-col rounded-lg border bg-card p-3">
      {people.map((person, index) => (
        <React.Fragment key={person.name}>
          {index > 0 ? <Separator /> : null}
          <div className="py-2.5">
            <PersonCell {...person} presenceLabel={person.presence} />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}`
    : `import * as React from "react";
import { Badge, PersonCell, Separator } from "@gunjo/ui";

const people = [
  {
    name: "Mia Sato",
    secondary: "Product / Senior UX Designer",
    tertiary: "Full-time / Tokyo",
    avatar: { src: "https://i.pravatar.cc/80?img=47" },
    presence: "online",
    trailing: <Badge variant="success">Active</Badge>,
  },
  {
    name: "Ken Takahashi",
    secondary: "Design Manager",
    tertiary: "Osaka office",
    avatar: { fallback: "K" },
    avatarClassName: "bg-info-subtle text-info-subtle-foreground",
    presence: "away",
    trailing: <Badge variant="warning">Leave</Badge>,
  },
  {
    name: "Ryo Yamada",
    secondary: "HR Business Partner",
    tertiary: "Contract review",
    avatar: { fallback: "R" },
    avatarClassName: "bg-warning-subtle text-warning-subtle-foreground",
    trailing: <Badge variant="outline">Pending</Badge>,
  },
];

export function DirectoryRows() {
  return (
    <div className="flex w-full max-w-md flex-col rounded-lg border bg-card p-3">
      {people.map((person, index) => (
        <React.Fragment key={person.name}>
          {index > 0 ? <Separator /> : null}
          <div className="py-2.5">
            <PersonCell {...person} presenceLabel={person.presence} />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}`;

  const sizesStateCode = locale === "ja"
    ? `import { PersonCell } from "@gunjo/ui";

export function PersonCellSizes() {
  return (
    <div className="grid w-full max-w-md gap-4 rounded-lg border bg-card p-4">
      <PersonCell size="sm" name="中野 葵" secondary="エンジニアリング本部" avatar={{ fallback: "中" }} />
      <PersonCell size="md" name="中野 葵" secondary="エンジニアリング本部" avatar={{ fallback: "中" }} />
      <PersonCell size="lg" name="中野 葵" secondary="エンジニアリング本部" avatar={{ fallback: "中" }} />
    </div>
  );
}`
    : `import { PersonCell } from "@gunjo/ui";

export function PersonCellSizes() {
  return (
    <div className="grid w-full max-w-md gap-4 rounded-lg border bg-card p-4">
      <PersonCell size="sm" name="Aoi Nakano" secondary="Engineering" avatar={{ fallback: "A" }} />
      <PersonCell size="md" name="Aoi Nakano" secondary="Engineering" avatar={{ fallback: "A" }} />
      <PersonCell size="lg" name="Aoi Nakano" secondary="Engineering" avatar={{ fallback: "A" }} />
    </div>
  );
}`;

  const minimalStateCode = locale === "ja"
    ? `import { PersonCell } from "@gunjo/ui";

export function MinimalPersonCell() {
  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-4">
      <PersonCell
        name="小林 トヨ"
        secondary="利用者 / 88歳"
        avatar={{ fallback: "小" }}
        avatarClassName="bg-secondary text-secondary-foreground"
      />
    </div>
  );
}`
    : `import { PersonCell } from "@gunjo/ui";

export function MinimalPersonCell() {
  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-4">
      <PersonCell
        name="Toyo Kobayashi"
        secondary="Client / 88"
        avatar={{ fallback: "T" }}
        avatarClassName="bg-secondary text-secondary-foreground"
      />
    </div>
  );
}`;

  const interactiveStateCode = locale === "ja"
    ? `import * as React from "react";
import { PersonCell } from "@gunjo/ui";

export function PeopleList({ people }) {
  const [selected, setSelected] = React.useState(null);
  return (
    <div className="flex flex-col gap-1">
      {people.map((p) => (
        // onActivate → ルートが <button>、chevron が affordance。href なら <a>。
        <PersonCell
          key={p.id}
          name={p.name}
          secondary={p.secondary}
          avatar={p.avatar}
          onActivate={() => setSelected(p.id)}
        />
      ))}
    </div>
  );
}`
    : `import * as React from "react";
import { PersonCell } from "@gunjo/ui";

export function PeopleList({ people }) {
  const [selected, setSelected] = React.useState(null);
  return (
    <div className="flex flex-col gap-1">
      {people.map((p) => (
        // onActivate → root is a <button>, chevron is the affordance. Use href for an <a>.
        <PersonCell
          key={p.id}
          name={p.name}
          secondary={p.secondary}
          avatar={p.avatar}
          onActivate={() => setSelected(p.id)}
        />
      ))}
    </div>
  );
}`;

  const propsData = [
    { name: "name", type: "ReactNode", description: locale === "ja" ? "主行です。文字列なら avatar fallback の頭文字を自動導出します。" : "Primary line. String names derive a fallback initial automatically." },
    { name: "secondary", type: "ReactNode", description: locale === "ja" ? "役職、部署、メールなどの副行です。" : "Secondary line for role, department, or email." },
    { name: "tertiary", type: "ReactNode", description: locale === "ja" ? "雇用形態や勤務地などの3行目です。" : "Optional third line for employment type, location, or extra metadata." },
    { name: "avatar", type: "{ src?: string; alt?: string; fallback?: ReactNode }", description: locale === "ja" ? "画像とfallbackです。src がない場合は fallback または氏名頭文字を表示します。" : "Avatar image and fallback. Without src, fallback or a derived initial is shown." },
    { name: "presence / presenceLabel", type: "Avatar presence", description: locale === "ja" ? "Avatar に渡す在席状態と読み上げラベルです。" : "Presence dot and accessible presence label forwarded to Avatar." },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: locale === "ja" ? "アバターと文字のスケールです。" : "Avatar and text scale." },
    { name: "trailing", type: "ReactNode", description: locale === "ja" ? "ステータスバッジ、件数、操作などの末尾スロットです。" : "Trailing slot for badges, counts, or actions." },
    { name: "href / onActivate", type: "string / () => void", description: locale === "ja" ? "セル全体を activation target にします。href は <a>、onActivate は <button> としてルート描画。未指定なら chevron を affordance に自動表示。ルート自体が interactive なので trailing は非インタラクティブ限定（ネストしない）。行に別アクションも要る場合は presentational のまま行レベルで activation する。(#341)" : "Makes the whole cell an activation target. href renders an <a>; onActivate renders a <button>. A chevron affordance is shown unless a custom trailing is set. Because the root is interactive, trailing must stay non-interactive (no nesting). For rows that also need separate actions, keep it presentational and activate at the row level. (#341)" },
    { name: "avatarClassName", type: "string", description: locale === "ja" ? "fallback avatar の背景色などを調整します。" : "Additional classes for fallback avatar styling." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "PersonCell", href: "/docs/components/person-cell" }, { name: "Avatar", href: "/docs/components/avatar" }, { name: "Badge", href: "/docs/components/badge" }]}
      relatedComponents={[{ name: "RelationshipRow", href: "/docs/components/relationship-row" }, { name: "DataTable", href: "/docs/components/data-table" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <PersonCellPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "presence",
              title: locale === "ja" ? "在席状態つき" : "With presence",
              description: locale === "ja" ? "presence は Avatar のドットとして表示し、presenceLabel で意味を伝えます。" : "presence renders on Avatar and presenceLabel exposes the meaning.",
              preview: <PersonCellPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "md",
            },
            {
              key: "sizes",
              title: locale === "ja" ? "サイズ" : "Sizes",
              description: locale === "ja" ? "sm/md/lg を一覧密度に合わせて使い分けます。" : "Use sm, md, and lg based on list density.",
              preview: <PersonCellPreview locale={locale} mode="sizes" />,
              code: sizesStateCode,
              previewBodyWidth: "md",
            },
            {
              key: "minimal",
              title: locale === "ja" ? "最小構成" : "Minimal",
              description: locale === "ja" ? "画像がない場合でも fallback と副行で識別できます。" : "Fallback initials and secondary text keep the row identifiable without an image.",
              preview: <PersonCellPreview locale={locale} mode="minimal" />,
              code: minimalStateCode,
              previewBodyWidth: "md",
            },
            {
              key: "interactive",
              title: locale === "ja" ? "インタラクティブ" : "Interactive",
              description: locale === "ja"
                ? "onActivate（または href）でセル全体を activation target に。ルートが <button>/<a> になり、chevron が affordance、クリックと Enter/Space で起動します。行に別アクションも要る場合は使わず、行レベルで activation してください。"
                : "onActivate (or href) makes the whole cell the target — the root becomes a <button>/<a>, a chevron is the affordance, and click plus Enter/Space activate. For rows that also need separate actions, activate at the row level instead.",
              preview: <InteractivePeopleDemo locale={locale} />,
              code: interactiveStateCode,
              previewBodyWidth: "md",
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
