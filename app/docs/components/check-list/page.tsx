"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import { Badge, CheckList, type CheckListItem } from "@gunjo/ui";

type Locale = "ja" | "en";

function checklistCopy(locale: Locale) {
  return locale === "ja"
    ? {
        docs: [
          { id: "id", label: "本人確認書類（運転免許証等）" },
          { id: "former", label: "転出証明書", description: "前住所地の市区町村が発行" },
          { id: "mynumber", label: "マイナンバーカード / 通知カード" },
          { id: "seal", label: "印鑑（世帯主分）", disabledReason: "オンライン申請では印鑑確認を省略します。" },
        ],
        checked: "確認済",
        unchecked: "未確認",
        progress: "必要書類",
        displayNote: "備考",
        displayDescription: "世帯主のみ来庁",
        displayBadge: "補足",
      }
    : {
        docs: [
          { id: "id", label: "Identity document" },
          { id: "former", label: "Move-out certificate", description: "Issued by the previous municipality" },
          { id: "mynumber", label: "My Number card / notification card" },
          { id: "seal", label: "Household head seal", disabledReason: "Seal verification is skipped for online applications." },
        ],
        checked: "Checked",
        unchecked: "Unchecked",
        progress: "Required documents",
        displayNote: "Note",
        displayDescription: "Only the household head visits the counter",
        displayBadge: "Info",
      };
}

function CheckListPreview({ locale, includeDisplayRow = false, includeDisabled = true }: { locale: Locale; includeDisplayRow?: boolean; includeDisabled?: boolean }) {
  const copy = checklistCopy(locale);
  const [checked, setChecked] = React.useState<Record<string, boolean>>({ id: true });
  const docItems: CheckListItem[] = copy.docs.map((doc) => ({
    ...doc,
    checked: Boolean(checked[doc.id]),
    disabled: includeDisabled && doc.id === "seal",
    disabledReason: includeDisabled && doc.id === "seal" ? doc.disabledReason : undefined,
    trailing: checked[doc.id] ? (
      <Badge variant="success" icon={<IconCheck />}>{copy.checked}</Badge>
    ) : (
      <Badge variant="warning" icon={<IconAlertTriangle />}>{copy.unchecked}</Badge>
    ),
  }));
  const items: CheckListItem[] = includeDisplayRow
    ? [
        ...docItems,
        {
          id: "note",
          label: copy.displayNote,
          description: copy.displayDescription,
          trailing: <Badge variant="secondary">{copy.displayBadge}</Badge>,
        },
      ]
    : docItems;
  const done = copy.docs.filter((doc) => checked[doc.id]).length;

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <CheckList
        items={items}
        onCheckedChange={(id, value) => setChecked((current) => ({ ...current, [id]: value }))}
      />
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {copy.progress}: {done} / {copy.docs.length} {copy.checked}
      </p>
    </div>
  );
}

export default function CheckListDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/check-list", locale);
  const metadata = displayMetadata as Record<string, { title: string; description: string }>;
  const title = content?.title ?? metadata.checkList.title;
  const description = content?.description ?? metadata.checkList.description;

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import { Badge, CheckList, type CheckListItem } from "@gunjo/ui";

const requiredDocs = [
  { id: "id", label: "本人確認書類（運転免許証等）" },
  { id: "former", label: "転出証明書", description: "前住所地の市区町村が発行" },
  { id: "mynumber", label: "マイナンバーカード / 通知カード" },
  { id: "seal", label: "印鑑（世帯主分）", disabledReason: "オンライン申請では印鑑確認を省略します。" },
];

export function RequiredDocumentCheckList() {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({ id: true });
  const items: CheckListItem[] = requiredDocs.map((doc) => ({
    ...doc,
    checked: Boolean(checked[doc.id]),
    disabled: doc.id === "seal",
    disabledReason: doc.id === "seal" ? doc.disabledReason : undefined,
    trailing: checked[doc.id] ? (
      <Badge variant="success" icon={<IconCheck />}>確認済</Badge>
    ) : (
      <Badge variant="warning" icon={<IconAlertTriangle />}>未確認</Badge>
    ),
  }));
  const done = requiredDocs.filter((doc) => checked[doc.id]).length;

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <CheckList
        items={items}
        onCheckedChange={(id, value) => setChecked((current) => ({ ...current, [id]: value }))}
      />
      <p className="text-xs text-muted-foreground" aria-live="polite">
        必要書類: {done} / {requiredDocs.length} 確認済
      </p>
    </div>
  );
}`
    : `import * as React from "react";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import { Badge, CheckList, type CheckListItem } from "@gunjo/ui";

const requiredDocs = [
  { id: "id", label: "Identity document" },
  {
    id: "former",
    label: "Move-out certificate",
    description: "Issued by the previous municipality",
  },
  { id: "mynumber", label: "My Number card / notification card" },
  {
    id: "seal",
    label: "Household head seal",
    disabledReason: "Seal verification is skipped for online applications.",
  },
];

export function RequiredDocumentCheckList() {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({ id: true });
  const items: CheckListItem[] = requiredDocs.map((doc) => ({
    ...doc,
    checked: Boolean(checked[doc.id]),
    disabled: doc.id === "seal",
    disabledReason: doc.id === "seal" ? doc.disabledReason : undefined,
    trailing: checked[doc.id] ? (
      <Badge variant="success" icon={<IconCheck />}>Checked</Badge>
    ) : (
      <Badge variant="warning" icon={<IconAlertTriangle />}>Unchecked</Badge>
    ),
  }));
  const done = requiredDocs.filter((doc) => checked[doc.id]).length;

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <CheckList
        items={items}
        onCheckedChange={(id, value) => setChecked((current) => ({ ...current, [id]: value }))}
      />
      <p className="text-xs text-muted-foreground" aria-live="polite">
        Required documents: {done} / {requiredDocs.length} Checked
      </p>
    </div>
  );
}`;

  const mixedRowCode = locale === "ja"
    ? `import * as React from "react";
import { Badge, CheckList, type CheckListItem } from "@gunjo/ui";

export function MixedRowCheckList() {
  const [checked, setChecked] = React.useState({ id: true });
  const items: CheckListItem[] = [
    { id: "id", label: "本人確認書類", checked: checked.id },
    {
      id: "note",
      label: "備考",
      description: "世帯主のみ来庁",
      trailing: <Badge variant="secondary">{"補足"}</Badge>,
    },
  ];

  return (
    <CheckList
      items={items}
      onCheckedChange={(id, value) =>
        setChecked((current) => ({ ...current, [id]: value }))
      }
    />
  );
}`
    : `import * as React from "react";
import { Badge, CheckList, type CheckListItem } from "@gunjo/ui";

export function MixedRowCheckList() {
  const [checked, setChecked] = React.useState({ id: true });
  const items: CheckListItem[] = [
    { id: "id", label: "Identity document", checked: checked.id },
    {
      id: "note",
      label: "Note",
      description: "Only the household head visits the counter",
      trailing: <Badge variant="secondary">{"Info"}</Badge>,
    },
  ];

  return (
    <CheckList
      items={items}
      onCheckedChange={(id, value) =>
        setChecked((current) => ({ ...current, [id]: value }))
      }
    />
  );
}`;

  const disabledReasonCode = locale === "ja"
    ? `import { Badge, CheckList, type CheckListItem } from "@gunjo/ui";

const items: CheckListItem[] = [
  {
    id: "seal",
    label: "印鑑（世帯主分）",
    checked: false,
    disabled: true,
    disabledReason: "オンライン申請では印鑑確認を省略します。",
    trailing: <Badge variant="warning">{"未確認"}</Badge>,
  },
];

export function DisabledReasonCheckList() {
  return <CheckList items={items} />;
}`
    : `import { Badge, CheckList, type CheckListItem } from "@gunjo/ui";

const items: CheckListItem[] = [
  {
    id: "seal",
    label: "Household head seal",
    checked: false,
    disabled: true,
    disabledReason: "Seal verification is skipped for online applications.",
    trailing: <Badge variant="warning">{"Unchecked"}</Badge>,
  },
];

export function DisabledReasonCheckList() {
  return <CheckList items={items} />;
}`;

  const propsData = [
    {
      name: "items",
      type: "CheckListItem[]",
      description: locale === "ja"
        ? "チェック行または表示行の配列です。checked を省略するとチェックボックスなしの表示行になります。"
        : "Checklist or display rows. Omit checked to render a non-checkable display row.",
    },
    {
      name: "CheckListItem.checked",
      type: "boolean | undefined",
      description: locale === "ja"
        ? "チェック状態です。undefined の場合は表示専用行になります。"
        : "Checked state. Undefined renders a display-only row.",
    },
    {
      name: "CheckListItem.disabled",
      type: "boolean",
      default: "false",
      description: locale === "ja"
        ? "チェック操作を無効化します。"
        : "Disables the check control.",
    },
    {
      name: "CheckListItem.disabledReason",
      type: "ReactNode",
      description: locale === "ja"
        ? "無効行の hover/focus tooltip に表示する理由です。"
        : "Reason shown in a hover/focus tooltip for a disabled row.",
    },
    {
      name: "CheckListItem.trailing",
      type: "ReactNode",
      description: locale === "ja"
        ? "右側に置くステータスバッジや補助操作です。チェック操作とは独立して描画されます。"
        : "Right-aligned badge or supporting action rendered outside the check toggle.",
    },
    {
      name: "onCheckedChange",
      type: "(id: string, checked: boolean) => void",
      description: locale === "ja"
        ? "チェック状態が変わった時に行 id と次の状態を通知します。"
        : "Called with the row id and next checked state when a checkable row changes.",
    },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "CheckList", href: "/docs/components/check-list" },
        { name: "Checkbox", href: "/docs/components/checkbox" },
        { name: "Badge", href: "/docs/components/badge" },
        { name: "Tooltip", href: "/docs/components/tooltip" },
      ]}
      relatedComponents={[
        { name: "List", href: "/docs/components/list" },
        { name: "ActionQueue", href: "/docs/components/action-queue" },
        { name: "Form", href: "/docs/components/form" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto">
        <CheckListPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "interactive",
              title: locale === "ja" ? "チェック可能" : "Checkable",
              description: locale === "ja"
                ? "各行のチェック状態を controlled state として扱い、進捗表示へ反映します。"
                : "Rows are controlled and can update a progress summary.",
              preview: <CheckListPreview locale={locale} includeDisabled={false} />,
              code: usageCode,
            },
            {
              key: "display-row",
              title: locale === "ja" ? "表示行を混ぜる" : "Mixed display row",
              description: locale === "ja"
                ? "checked を省略した行はチェックボックスなしの情報行として同じリストに混ぜられます。"
                : "Rows without checked render as informational rows in the same list.",
              preview: <CheckListPreview locale={locale} includeDisplayRow includeDisabled={false} />,
              code: mixedRowCode,
            },
            {
              key: "disabled-reason",
              title: locale === "ja" ? "無効理由付き" : "Disabled reason",
              description: locale === "ja"
                ? "無効行を見せる時は、disabledReason で hover/focus の理由を行に紐づけます。"
                : "When showing a disabled row, use disabledReason so hover/focus explains why on that row.",
              preview: <CheckListPreview locale={locale} />,
              code: disabledReasonCode,
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
              <strong>チェックの付く行と、付かない行を同じ表に混ぜられる。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">checked</code> を渡さない項目は、チェックボックスの無いただの行として出ます。資料は「複数選択するか」でリストの種類を決めよと書いていますが、実務の確認リストには「確認させる行」と「見せるだけの行」が混ざるので、1つのリストで両方を出せるようにしました。
            </li>
            <li>
              <strong>チェックボックスの名前は必ず行の文字にした。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">label</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">description</code> を <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Checkbox</code> に渡しているので、名前の無いチェックボックスが生まれません。行の文字を別に置いて <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">label</code> をつなぎ忘れる、という壊れ方を型で塞いでいます。
            </li>
            <li>
              <strong>右端の要素はチェックの外に置いた。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">trailing</code>（バッジ・ボタン・金額）はチェックボックスの外側にあるので、押してもチェックが動きません。行全体を押せるようにしていないのは、この切り分けを守るためです。
              <br />
              一般のリストの設計は UIXHERO の「リスト」にあります。{" "}
              <a
                className="underline underline-offset-4"
                href="https://www.uixhero.com/resources/ui-components/list"
                target="_blank"
                rel="noreferrer"
              >
                UIXHERO: リスト（List）
              </a>
            </li>
          </ul>
        ) : (
          <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Checkable and non-checkable rows live in the same list.</strong> An item with no <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">checked</code> renders as a plain row with no checkbox. The article decides list type by asking whether the user multi-selects; real confirmation lists mix rows to tick with rows that are only there to be read, so both are allowed in one list.
            </li>
            <li>
              <strong>A checkbox is always named by its own row.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">label</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">description</code> are passed into <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Checkbox</code>, so an unlabelled checkbox cannot be produced. The classic failure, row text placed separately and never wired to the control, is closed off by the type.
            </li>
            <li>
              <strong>The trailing slot sits outside the toggle.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">trailing</code> (a badge, a button, an amount) is rendered outside the checkbox, so clicking it never flips the tick. That separation is why the whole row is not made pressable.
              <br />
              The general design of lists is covered by UIXHERO&rsquo;s list article.{" "}
              <a
                className="underline underline-offset-4"
                href="https://www.uixhero.com/resources/ui-components/list"
                target="_blank"
                rel="noreferrer"
              >
                UIXHERO: List (in Japanese)
              </a>
            </li>
          </ul>
        )}
      </section>
    </ComponentLayout>
  );
}
