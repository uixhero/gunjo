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
  { id: "former", label: "Move-out certificate", description: "Issued by the previous municipality" },
  { id: "mynumber", label: "My Number card / notification card" },
  { id: "seal", label: "Household head seal", disabledReason: "Seal verification is skipped for online applications." },
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
              code: locale === "ja"
                ? `const items = [
  { id: "id", label: "本人確認書類", checked: true },
  { id: "note", label: "備考", description: "世帯主のみ来庁", trailing: <Badge variant="secondary">補足</Badge> },
];

<CheckList items={items} />`
                : `const items = [
  { id: "id", label: "Identity document", checked: true },
  { id: "note", label: "Note", description: "Only the household head visits the counter", trailing: <Badge variant="secondary">Info</Badge> },
];

<CheckList items={items} />`,
            },
            {
              key: "disabled-reason",
              title: locale === "ja" ? "無効理由付き" : "Disabled reason",
              description: locale === "ja"
                ? "無効行を見せる時は、disabledReason で hover/focus の理由を行に紐づけます。"
                : "When showing a disabled row, use disabledReason so hover/focus explains why on that row.",
              preview: <CheckListPreview locale={locale} />,
              code: locale === "ja"
                ? `const items = [
  {
    id: "seal",
    label: "印鑑（世帯主分）",
    checked: false,
    disabled: true,
    disabledReason: "オンライン申請では印鑑確認を省略します。",
    trailing: <Badge variant="warning">未確認</Badge>,
  },
];

<CheckList items={items} />`
                : `const items = [
  {
    id: "seal",
    label: "Household head seal",
    checked: false,
    disabled: true,
    disabledReason: "Seal verification is skipped for online applications.",
    trailing: <Badge variant="warning">Unchecked</Badge>,
  },
];

<CheckList items={items} />`,
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
