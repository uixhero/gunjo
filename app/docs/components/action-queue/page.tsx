"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { ActionQueue, Button, ToggleGroup, ToggleGroupItem, type ActionItem } from "@gunjo/ui";

type Locale = "ja" | "en";

const surfaces = ["all", "expiry", "renewal", "birthday"] as const;
function actionButtonVariant(severity: string): React.ComponentProps<typeof Button>["variant"] {
  switch (severity) {
    case "critical":
      return "destructive";
    case "warning":
      return "warning";
    case "info":
      return "info";
    default:
      return "secondary";
  }
}

function actionQueueCopy(locale: Locale) {
  return locale === "ja"
    ? {
        filters: {
          all: "すべて",
          expiry: "失効",
          renewal: "更新",
          birthday: "誕生日",
        },
        action: "対応",
        selectedPrefix: "対応対象",
        due: "期限",
        emptyLabel: "対応が必要な項目はありません",
        items: [
          {
            surface: "expiry",
            severity: "critical",
            kind: "失効リスク",
            title: "田所 慎一さま - 終身保険が今月末で失効",
            detail: "保険料未入金。失効防止コールを本日中に。",
            meta: "本日",
          },
          {
            surface: "renewal",
            severity: "warning",
            kind: "更新",
            title: "三宅 加奈さま - 収入保障保険の更新期限",
            detail: "更新手続き書類の送付がまだです。",
            meta: "あと7日",
          },
          {
            surface: "renewal",
            severity: "warning",
            kind: "満期",
            title: "黒川 大悟さま - 学資保険が満期",
            detail: "満期金の案内と次プランの提案を準備します。",
            meta: "あと14日",
          },
          {
            surface: "birthday",
            severity: "info",
            kind: "誕生日",
            title: "宇佐美 結菜さま - お誕生日",
            detail: "ご連絡のきっかけ。医療特約の見直し提案も。",
            meta: "明日",
          },
        ],
      }
    : {
        filters: {
          all: "All",
          expiry: "Expiry",
          renewal: "Renewal",
          birthday: "Birthday",
        },
        action: "Open",
        selectedPrefix: "Active follow-up",
        due: "Due",
        emptyLabel: "No action items",
        items: [
          {
            surface: "expiry",
            severity: "critical",
            kind: "Expiry risk",
            title: "Shinichi Tadokoro - whole-life policy expires this month",
            detail: "Payment is missing. Call today to prevent lapse.",
            meta: "Today",
          },
          {
            surface: "renewal",
            severity: "warning",
            kind: "Renewal",
            title: "Kana Miyake - income protection renewal due",
            detail: "Renewal packet has not been sent yet.",
            meta: "7 days",
          },
          {
            surface: "renewal",
            severity: "warning",
            kind: "Maturity",
            title: "Daigo Kurokawa - education policy matures",
            detail: "Prepare maturity payout guidance and the next plan.",
            meta: "14 days",
          },
          {
            surface: "birthday",
            severity: "info",
            kind: "Birthday",
            title: "Yuna Usami - birthday follow-up",
            detail: "A natural contact moment and medical rider review.",
            meta: "Tomorrow",
          },
        ],
      };
}

function ActionQueuePreview({ locale, initialSurface = "all", empty = false }: { locale: Locale; initialSurface?: string; empty?: boolean }) {
  const copy = actionQueueCopy(locale);
  const [surface, setSurface] = React.useState(initialSurface);
  const [selected, setSelected] = React.useState<string | null>(null);
  const visibleItems = empty
    ? []
    : surface === "all"
      ? copy.items
      : copy.items.filter((item) => item.surface === surface);
  const selectedItem = visibleItems.find((item) => item.title === selected) ?? visibleItems[0];
  const items: ActionItem[] = visibleItems.map((item) => ({
    ...item,
    severity: item.severity as ActionItem["severity"],
    onSelect: () => setSelected(item.title),
    actions: (
      <Button
        size="sm"
        variant={actionButtonVariant(item.severity)}
        onClick={() => setSelected(item.title)}
      >
        {copy.action}
      </Button>
    ),
  }));

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      {!empty ? (
        <ToggleGroup
          type="single"
          value={surface}
          onValueChange={(value) => value && setSurface(value)}
          variant="outline"
          size="sm"
          disallowEmpty
          aria-label={locale === "ja" ? "対応種別" : "Action category"}
        >
          {surfaces.map((key) => (
            <ToggleGroupItem key={key} value={key}>
              {copy.filters[key]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      ) : null}

      <ActionQueue items={items} emptyLabel={copy.emptyLabel} />

      {selectedItem ? (
        <div className="rounded-md border bg-muted/30 px-3 py-3 text-sm" aria-live="polite">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.selectedPrefix}</span>
            <span className="rounded-full border bg-background px-2 py-0.5 text-xs font-medium text-foreground">{selectedItem.kind}</span>
          </div>
          <p className="mt-2 font-medium text-foreground">{selectedItem.title}</p>
          <p className="mt-1 text-muted-foreground">{selectedItem.detail}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {copy.due}: {selectedItem.meta}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function ActionQueueDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/action-queue", locale);
  const metadata = displayMetadata as Record<string, { title: string; description: string }>;
  const title = content?.title ?? metadata.actionQueue.title;
  const description = content?.description ?? metadata.actionQueue.description;

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { ActionQueue, Button, ToggleGroup, ToggleGroupItem, type ActionItem } from "@gunjo/ui";

const items = [
  {
    surface: "expiry",
    severity: "critical",
    kind: "失効リスク",
    title: "田所 慎一さま - 終身保険が今月末で失効",
    detail: "保険料未入金。失効防止コールを本日中に。",
    meta: "本日",
  },
  {
    surface: "renewal",
    severity: "warning",
    kind: "更新",
    title: "三宅 加奈さま - 収入保障保険の更新期限",
    detail: "更新手続き書類の送付がまだです。",
    meta: "あと7日",
  },
  {
    surface: "renewal",
    severity: "warning",
    kind: "満期",
    title: "黒川 大悟さま - 学資保険が満期",
    detail: "満期金の案内と次プランの提案を準備します。",
    meta: "あと14日",
  },
  {
    surface: "birthday",
    severity: "info",
    kind: "誕生日",
    title: "宇佐美 結菜さま - お誕生日",
    detail: "ご連絡のきっかけ。医療特約の見直し提案も。",
    meta: "明日",
  },
];

function actionButtonVariant(severity: string): React.ComponentProps<typeof Button>["variant"] {
  switch (severity) {
    case "critical":
      return "destructive";
    case "warning":
      return "warning";
    case "info":
      return "info";
    default:
      return "secondary";
  }
}

export function MorningActionQueue() {
  const [surface, setSurface] = React.useState("all");
  const [selected, setSelected] = React.useState<string | null>(null);
  const visibleItems = surface === "all" ? items : items.filter((item) => item.surface === surface);
  const selectedItem = visibleItems.find((item) => item.title === selected) ?? visibleItems[0];
  const actionItems: ActionItem[] = visibleItems.map((item) => ({
    ...item,
    severity: item.severity as ActionItem["severity"],
    onSelect: () => setSelected(item.title),
    actions: (
      <Button
        size="sm"
        variant={actionButtonVariant(item.severity)}
        onClick={() => setSelected(item.title)}
      >
        対応
      </Button>
    ),
  }));

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <ToggleGroup
        type="single"
        value={surface}
        onValueChange={(value) => value && setSurface(value)}
        variant="outline"
        size="sm"
        disallowEmpty
        aria-label="対応種別"
      >
        <ToggleGroupItem value="all">すべて</ToggleGroupItem>
        <ToggleGroupItem value="expiry">失効</ToggleGroupItem>
        <ToggleGroupItem value="renewal">更新</ToggleGroupItem>
        <ToggleGroupItem value="birthday">誕生日</ToggleGroupItem>
      </ToggleGroup>

      <ActionQueue items={actionItems} emptyLabel="対応が必要な項目はありません" />

      {selectedItem ? (
        <div className="rounded-md border bg-muted/30 px-3 py-3 text-sm" aria-live="polite">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">対応対象</span>
            <span className="rounded-full border bg-background px-2 py-0.5 text-xs font-medium text-foreground">{selectedItem.kind}</span>
          </div>
          <p className="mt-2 font-medium text-foreground">{selectedItem.title}</p>
          <p className="mt-1 text-muted-foreground">{selectedItem.detail}</p>
          <p className="mt-2 text-xs text-muted-foreground">期限: {selectedItem.meta}</p>
        </div>
      ) : null}
    </div>
  );
}`
    : `import * as React from "react";
import { ActionQueue, Button, ToggleGroup, ToggleGroupItem, type ActionItem } from "@gunjo/ui";

const items = [
  {
    surface: "expiry",
    severity: "critical",
    kind: "Expiry risk",
    title: "Shinichi Tadokoro - whole-life policy expires this month",
    detail: "Payment is missing. Call today to prevent lapse.",
    meta: "Today",
  },
  {
    surface: "renewal",
    severity: "warning",
    kind: "Renewal",
    title: "Kana Miyake - income protection renewal due",
    detail: "Renewal packet has not been sent yet.",
    meta: "7 days",
  },
  {
    surface: "renewal",
    severity: "warning",
    kind: "Maturity",
    title: "Daigo Kurokawa - education policy matures",
    detail: "Prepare maturity payout guidance and the next plan.",
    meta: "14 days",
  },
  {
    surface: "birthday",
    severity: "info",
    kind: "Birthday",
    title: "Yuna Usami - birthday follow-up",
    detail: "A natural contact moment and medical rider review.",
    meta: "Tomorrow",
  },
];

function actionButtonVariant(severity: string): React.ComponentProps<typeof Button>["variant"] {
  switch (severity) {
    case "critical":
      return "destructive";
    case "warning":
      return "warning";
    case "info":
      return "info";
    default:
      return "secondary";
  }
}

export function MorningActionQueue() {
  const [surface, setSurface] = React.useState("all");
  const [selected, setSelected] = React.useState<string | null>(null);
  const visibleItems = surface === "all" ? items : items.filter((item) => item.surface === surface);
  const selectedItem = visibleItems.find((item) => item.title === selected) ?? visibleItems[0];
  const actionItems: ActionItem[] = visibleItems.map((item) => ({
    ...item,
    severity: item.severity as ActionItem["severity"],
    onSelect: () => setSelected(item.title),
    actions: (
      <Button
        size="sm"
        variant={actionButtonVariant(item.severity)}
        onClick={() => setSelected(item.title)}
      >
        Open
      </Button>
    ),
  }));

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <ToggleGroup
        type="single"
        value={surface}
        onValueChange={(value) => value && setSurface(value)}
        variant="outline"
        size="sm"
        disallowEmpty
        aria-label="Action category"
      >
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="expiry">Expiry</ToggleGroupItem>
        <ToggleGroupItem value="renewal">Renewal</ToggleGroupItem>
        <ToggleGroupItem value="birthday">Birthday</ToggleGroupItem>
      </ToggleGroup>

      <ActionQueue items={actionItems} emptyLabel="No action items" />

      {selectedItem ? (
        <div className="rounded-md border bg-muted/30 px-3 py-3 text-sm" aria-live="polite">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active follow-up</span>
            <span className="rounded-full border bg-background px-2 py-0.5 text-xs font-medium text-foreground">{selectedItem.kind}</span>
          </div>
          <p className="mt-2 font-medium text-foreground">{selectedItem.title}</p>
          <p className="mt-1 text-muted-foreground">{selectedItem.detail}</p>
          <p className="mt-2 text-xs text-muted-foreground">Due: {selectedItem.meta}</p>
        </div>
      ) : null}
    </div>
  );
}`;

  const filteredCode = usageCode.replace(
    'React.useState("all")',
    'React.useState("renewal")'
  );

  const propsData = [
    {
      name: "items",
      type: "ActionItem[]",
      description: locale === "ja"
        ? "表示する対応項目です。重大度、種別、見出し、補足、期日、アクションを行ごとに渡します。"
        : "Action rows. Each row can carry severity, kind, title, detail, due/meta text, and actions.",
    },
    {
      name: "ActionItem.severity",
      type: '"critical" | "warning" | "info" | "neutral"',
      default: '"neutral"',
      description: locale === "ja"
        ? "重大度です。アイコン、トーン、重大度ソートに使います。色だけに依存しません。"
        : "Severity. Drives icon, tone, and severity sorting without relying on color alone.",
    },
    {
      name: "ActionItem.onSelect",
      type: "() => void",
      description: locale === "ja"
        ? "行本文を選択可能にします。省略すると表示専用の行になります。"
        : "Makes the row body activatable. Omit for a presentational row.",
    },
    {
      name: "ActionItem.actions",
      type: "ReactNode",
      description: locale === "ja"
        ? "行末に配置するボタンなどです。行ボタンの内側ではなく兄弟として描画します。"
        : "Trailing controls rendered as siblings, not nested inside the row button.",
    },
    {
      name: "sortBySeverity",
      type: "boolean",
      default: "true",
      description: locale === "ja"
        ? "critical から neutral の順に並び替えます。"
        : "Sorts rows from critical to neutral before rendering.",
    },
    {
      name: "emptyLabel",
      type: "ReactNode",
      default: locale === "ja" ? '"対応が必要な項目はありません"' : '"No action items"',
      description: locale === "ja"
        ? "items が空の時に表示するプレースホルダーです。"
        : "Placeholder shown when items is empty.",
    },
    {
      name: "severityLabels",
      type: "Partial<Record<ActionSeverity, string>>",
      default: locale === "ja" ? "重大 / 警告 / 情報 / 通常" : "重大 / 警告 / 情報 / 通常",
      description: locale === "ja"
        ? "読み上げ用の重大度ラベル（重大 / 警告 / 情報 / 通常）を上書きします。インスタンス単位のローカライズ用で、既定は日本語のままです。"
        : "Overrides the sr-only severity labels (重大 / 警告 / 情報 / 通常). Instance-level localization override; the default stays Japanese.",
    },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "ActionQueue", href: "/docs/components/action-queue" },
        { name: "Button", href: "/docs/components/button" },
        { name: "ToggleGroup", href: "/docs/components/toggle-group" },
      ]}
      relatedComponents={[
        { name: "StatGroup", href: "/docs/components/stat-group" },
        { name: "SafetyBanner", href: "/docs/components/safety-banner" },
        { name: "StatusBoard", href: "/docs/components/status-board" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="lg">
        <ActionQueuePreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "severity-sorted",
              title: locale === "ja" ? "重大度順" : "Severity sorted",
              description: locale === "ja"
                ? "critical / warning / info をアイコンとトーンで示し、既定で重大度順に並びます。"
                : "Critical, warning, and info rows are indicated by icon plus tone and sort by severity by default.",
              preview: <ActionQueuePreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "lg",
            },
            {
              key: "filtered",
              title: locale === "ja" ? "絞り込み済み" : "Filtered",
              description: locale === "ja"
                ? "上位のフィルタやタブで items を絞り込んでも、ActionQueue は同じ行構造を保ちます。"
                : "When a parent filter narrows items, ActionQueue keeps the same row structure.",
              preview: <ActionQueuePreview locale={locale} initialSurface="renewal" />,
              code: filteredCode,
              previewBodyWidth: "lg",
            },
            {
              key: "empty",
              title: locale === "ja" ? "空状態" : "Empty",
              description: locale === "ja"
                ? "対応項目がない場合は、破線のプレースホルダーだけを表示します。"
                : "When there are no rows, a dashed placeholder communicates the empty state.",
              preview: <ActionQueuePreview locale={locale} empty />,
              code: locale === "ja"
                ? `<ActionQueue items={[]} emptyLabel="対応が必要な項目はありません" />`
                : `<ActionQueue items={[]} emptyLabel="No action items" />`,
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
