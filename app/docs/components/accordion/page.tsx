"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@gunjo/ui";

export default function AccordionPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/accordion", locale);
    const title = content?.title ?? displayMetadata.accordion.title;
    const description = content?.description ?? displayMetadata.accordion.description;
    const openLabel = locale === "ja" ? "開く" : "Open";
    const closeLabel = locale === "ja" ? "閉じる" : "Close";

    const code = locale === "ja"
        ? `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@gunjo/ui";

export function Example() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="overview">
        <AccordionTrigger>請求設定</AccordionTrigger>
        <AccordionContent>
          支払い方法、請求書、更新日を確認できます。
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`
        : `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@gunjo/ui";

export function Example() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="overview">
        <AccordionTrigger>Billing settings</AccordionTrigger>
        <AccordionContent>
          Review payment method, invoices, and renewal date.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`;

    const usageCode = locale === "ja"
        ? `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@gunjo/ui";

const sections = [
  {
    id: "billing",
    title: "請求設定",
    body: "支払い方法、請求書、更新日を確認できます。",
  },
  {
    id: "team",
    title: "チーム設定",
    body: "メンバー招待と権限を管理できます。",
  },
];

export function SettingsAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      {sections.map((section) => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger>{section.title}</AccordionTrigger>
          <AccordionContent>{section.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}`
        : `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@gunjo/ui";

const sections = [
  {
    id: "billing",
    title: "Billing settings",
    body: "Review payment method, invoices, and renewal date.",
  },
  {
    id: "team",
    title: "Team settings",
    body: "Invite members and manage permissions.",
  },
];

export function SettingsAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      {sections.map((section) => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger>{section.title}</AccordionTrigger>
          <AccordionContent>{section.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}`;

    const propsData = [
        {
            name: "type",
            type: '"single" | "multiple"',
            description: locale === "ja" ? "同時に開ける項目数を指定します。" : "Controls whether one or multiple items can be open.",
            required: true,
        },
        {
            name: "collapsible",
            type: "boolean",
            description: locale === "ja" ? "single の時、開いている項目を再クリックで閉じられるようにします。" : "When type is single, allows the open item to close when clicked again.",
        },
        {
            name: "disabled",
            type: "boolean",
            description: locale === "ja" ? "アコーディオン全体の操作を無効化します。" : "Prevents interaction with the accordion.",
        },
        {
            name: "defaultValue",
            type: "string | string[]",
            description: locale === "ja" ? "初期表示で開く項目の value です。" : "Item value or values that should be open on initial render.",
        },
        {
            name: "indicator",
            type: '"chevron" | "plus" | "none"',
            default: '"chevron"',
            description: locale === "ja" ? "トリガー右端の開閉アイコンを指定します。FAQ では plus が使いやすい場合があります。" : "Controls the trailing open/close indicator. Plus works well for FAQ-style disclosure lists.",
        },
        {
            name: "openLabel / closeLabel",
            type: "string",
            default: '"Open" / "Close"',
            description: locale === "ja" ? "アイコンホバー時に表示するツールチップ文言です。" : "Tooltip labels shown when hovering the indicator icon.",
        },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Accordion", href: "/docs/components/accordion" },
                { name: "Icon", href: "/docs/components/icon" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "AccordionGroup", href: "/docs/components/accordion-group" },
                { name: "CollapsiblePanelToggle", href: "/docs/components/collapsible-panel-toggle" },
                { name: "Tabs", href: "/docs/components/tabs" },
                { name: "TreeView", href: "/docs/components/tree-view" },
            ]}
        >
            <ComponentPreview
                code={code}
                codeBlock={<CodeBlock code={code} />}
                className="items-start"
                previewBodyWidth="md"
                previewHeight={160}
            >
                <Accordion type="single" collapsible className="w-full max-w-md">
                    <AccordionItem value="overview">
                        <AccordionTrigger openLabel={openLabel} closeLabel={closeLabel}>
                            {locale === "ja" ? "請求設定" : "Billing settings"}
                        </AccordionTrigger>
                        <AccordionContent>
                            {locale === "ja"
                                ? "支払い方法、請求書、更新日を確認できます。"
                                : "Review payment method, invoices, and renewal date."}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "single-collapsible",
                            title: locale === "ja" ? "1つだけ開く" : "Single collapsible",
                            description: locale === "ja"
                                ? "FAQ や設定説明では、1つだけ開ける構成にすると読み進めやすくなります。"
                                : "Use a single collapsible accordion for FAQs and settings where one answer should be in focus.",
                            preview: (
                                <Accordion type="single" collapsible className="w-full max-w-md">
                                    <AccordionItem value="q1">
                                        <AccordionTrigger openLabel={openLabel} closeLabel={closeLabel}>
                                            {locale === "ja" ? "料金はどう計算されますか？" : "How does pricing work?"}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            {locale === "ja" ? "3プロジェクトまでは無料です。それ以降はプロジェクト単位で課金されます。" : "The first three projects are free. Additional projects are billed per project."}
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="q2">
                                        <AccordionTrigger openLabel={openLabel} closeLabel={closeLabel}>
                                            {locale === "ja" ? "いつでも解約できますか？" : "Can I cancel any time?"}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            {locale === "ja" ? "現在の請求期間の終了時に停止し、30日間は読み取り専用で保持されます。" : "Billing stops at the end of the current cycle and data stays read-only for 30 days."}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ),
                            previewHeight: 260,
                            previewClassName: "items-start",
                            code: usageCode,
                        },
                        {
                            key: "plus-indicator",
                            title: locale === "ja" ? "アイコン変更" : "Indicator variant",
                            description: locale === "ja"
                                ? "FAQ やヘルプでは、開く前は +、開いた後は × に回転するアイコンが自然な場合があります。"
                                : "FAQ and help sections can use a plus indicator that rotates into an x when opened.",
                            preview: (
                                <Accordion type="single" collapsible className="w-full max-w-md">
                                    <AccordionItem value="help">
                                        <AccordionTrigger indicator="plus" openLabel={openLabel} closeLabel={closeLabel}>
                                            {locale === "ja" ? "メンバーを招待できますか？" : "Can I invite members?"}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            {locale === "ja"
                                                ? "ワークスペース設定からメールアドレスを指定して招待できます。"
                                                : "Invite members from workspace settings by entering their email address."}
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="billing">
                                        <AccordionTrigger indicator="plus" openLabel={openLabel} closeLabel={closeLabel}>
                                            {locale === "ja" ? "請求書はどこで確認できますか？" : "Where can I find invoices?"}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            {locale === "ja"
                                                ? "請求設定の履歴からPDFを確認できます。"
                                                : "Invoices are available as PDFs from billing history."}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ),
                            previewHeight: 260,
                            previewClassName: "items-start",
                            code: locale === "ja"
                                ? `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@gunjo/ui";

export function PlusAccordion() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="help">
        <AccordionTrigger indicator="plus" openLabel="開く" closeLabel="閉じる">
          メンバーを招待できますか？
        </AccordionTrigger>
        <AccordionContent>
          ワークスペース設定からメールアドレスを指定して招待できます。
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`
                                : `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@gunjo/ui";

export function PlusAccordion() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="help">
        <AccordionTrigger indicator="plus" openLabel="Open" closeLabel="Close">
          Can I invite members?
        </AccordionTrigger>
        <AccordionContent>
          Invite members from workspace settings by entering their email address.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`,
                        },
                        {
                            key: "multiple-open",
                            title: locale === "ja" ? "複数を同時に開く" : "Multiple sections open",
                            description: locale === "ja"
                                ? "比較しながら読む仕様や設定では、複数の項目を同時に開ける方が自然です。"
                                : "Use multiple mode when users need to compare details across sections.",
                            preview: (
                                <Accordion type="multiple" defaultValue={["billing", "team"]} className="w-full max-w-md">
                                    <AccordionItem value="billing">
                                        <AccordionTrigger openLabel={openLabel} closeLabel={closeLabel}>
                                            {locale === "ja" ? "請求" : "Billing"}
                                        </AccordionTrigger>
                                        <AccordionContent>{locale === "ja" ? "支払い方法と請求書を管理します。" : "Manage payment method and invoices."}</AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="team">
                                        <AccordionTrigger openLabel={openLabel} closeLabel={closeLabel}>
                                            {locale === "ja" ? "チーム" : "Team"}
                                        </AccordionTrigger>
                                        <AccordionContent>{locale === "ja" ? "メンバーと権限を管理します。" : "Manage members and permissions."}</AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ),
                            previewHeight: 280,
                            previewClassName: "items-start",
                            code: locale === "ja"
                                ? `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@gunjo/ui";

export function MultipleAccordion() {
  return (
    <Accordion type="multiple" defaultValue={["billing", "team"]}>
      <AccordionItem value="billing">
        <AccordionTrigger>請求</AccordionTrigger>
        <AccordionContent>支払い方法と請求書を管理します。</AccordionContent>
      </AccordionItem>
      <AccordionItem value="team">
        <AccordionTrigger>チーム</AccordionTrigger>
        <AccordionContent>メンバーと権限を管理します。</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`
                                : `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@gunjo/ui";

export function MultipleAccordion() {
  return (
    <Accordion type="multiple" defaultValue={["billing", "team"]}>
      <AccordionItem value="billing">
        <AccordionTrigger>Billing</AccordionTrigger>
        <AccordionContent>Manage payment method and invoices.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="team">
        <AccordionTrigger>Team</AccordionTrigger>
        <AccordionContent>Manage members and permissions.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja"
                                ? "開閉できない項目は薄い表示にし、ホバーで理由を補足します。"
                                : "Disabled items use muted styling and explain the reason on hover.",
                            preview: (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="w-full max-w-md">
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem value="locked">
                                                    <AccordionTrigger
                                                        disabled
                                                        openLabel={openLabel}
                                                        closeLabel={closeLabel}
                                                    >
                                                        {locale === "ja" ? "管理者設定" : "Admin settings"}
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        {locale === "ja" ? "管理者だけが確認できます。" : "Only admins can view this section."}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {locale === "ja" ? "管理者権限がないため開けません。" : "You need admin permission to open this section."}
                                    </TooltipContent>
                                </Tooltip>
                            ),
                            previewHeight: 180,
                            previewClassName: "items-start",
                            code: locale === "ja"
                                ? `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@gunjo/ui";

export function DisabledAccordion() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="locked">
        <AccordionTrigger disabled>
          管理者設定
        </AccordionTrigger>
        <AccordionContent>
          管理者だけが確認できます。
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`
                                : `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@gunjo/ui";

export function DisabledAccordion() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="locked">
        <AccordionTrigger disabled>
          Admin settings
        </AccordionTrigger>
        <AccordionContent>
          Only admins can view this section.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">{locale === "ja" ? "プロパティ" : "Props"}</h2>
                <PropsTable data={propsData} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">{locale === "ja" ? "使い方" : "Usage"}</h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <CodeBlock code={usageCode} />
            </div>
        </ComponentLayout>
    );
}
