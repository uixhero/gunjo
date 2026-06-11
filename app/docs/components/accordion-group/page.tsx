"use client";

import {
    AccordionContent,
    AccordionGroup,
    AccordionItem,
    AccordionTrigger,
} from "@gunjo/ui";

import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";

const sectionValues = ["billing", "team", "security"];

function SettingsItems({ locale }: { locale: "ja" | "en" }) {
    const openLabel = locale === "ja" ? "開く" : "Open";
    const closeLabel = locale === "ja" ? "閉じる" : "Close";

    return (
        <>
            <AccordionItem value="billing">
                <AccordionTrigger openLabel={openLabel} closeLabel={closeLabel}>
                    {locale === "ja" ? "請求設定" : "Billing settings"}
                </AccordionTrigger>
                <AccordionContent>
                    {locale === "ja"
                        ? "支払い方法、請求書、更新日を確認できます。"
                        : "Review payment methods, invoices, and renewal dates."}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="team">
                <AccordionTrigger openLabel={openLabel} closeLabel={closeLabel}>
                    {locale === "ja" ? "チーム設定" : "Team settings"}
                </AccordionTrigger>
                <AccordionContent>
                    {locale === "ja"
                        ? "メンバー招待、権限、ロールを管理できます。"
                        : "Manage invitations, permissions, and roles."}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="security">
                <AccordionTrigger openLabel={openLabel} closeLabel={closeLabel}>
                    {locale === "ja" ? "セキュリティ" : "Security"}
                </AccordionTrigger>
                <AccordionContent>
                    {locale === "ja"
                        ? "2段階認証、監査ログ、セッションを確認できます。"
                        : "Review two-factor authentication, audit logs, and sessions."}
                </AccordionContent>
            </AccordionItem>
        </>
    );
}

export default function AccordionGroupPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/accordion-group", locale);
    const title = content?.title ?? displayMetadata.accordionGroup.title;
    const description = content?.description ?? displayMetadata.accordionGroup.description;
    const isJa = locale === "ja";
    const expandLabel = isJa ? "すべて開く" : "Open all";
    const collapseLabel = isJa ? "すべて閉じる" : "Close all";

    const code = isJa
        ? `import {
  AccordionContent,
  AccordionGroup,
  AccordionItem,
  AccordionTrigger,
} from "@gunjo/ui";

const values = ["billing", "team", "security"];

export function Example() {
  return (
    <AccordionGroup
      values={values}
      label="設定項目"
      description="必要な項目だけ開くか、まとめて展開できます。"
      expandLabel="すべて開く"
      collapseLabel="すべて閉じる"
      className="w-full max-w-md"
    >
      <AccordionItem value="billing">
        <AccordionTrigger>請求設定</AccordionTrigger>
        <AccordionContent>支払い方法、請求書、更新日を確認できます。</AccordionContent>
      </AccordionItem>
      <AccordionItem value="team">
        <AccordionTrigger>チーム設定</AccordionTrigger>
        <AccordionContent>メンバー招待、権限、ロールを管理できます。</AccordionContent>
      </AccordionItem>
      <AccordionItem value="security">
        <AccordionTrigger>セキュリティ</AccordionTrigger>
        <AccordionContent>2段階認証、監査ログ、セッションを確認できます。</AccordionContent>
      </AccordionItem>
    </AccordionGroup>
  );
}`
        : `import {
  AccordionContent,
  AccordionGroup,
  AccordionItem,
  AccordionTrigger,
} from "@gunjo/ui";

const values = ["billing", "team", "security"];

export function Example() {
  return (
    <AccordionGroup
      values={values}
      label="Settings"
      description="Open only what you need, or expand the full group."
      expandLabel="Open all"
      collapseLabel="Close all"
      className="w-full max-w-md"
    >
      <AccordionItem value="billing">
        <AccordionTrigger>Billing settings</AccordionTrigger>
        <AccordionContent>Review payment methods, invoices, and renewal dates.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="team">
        <AccordionTrigger>Team settings</AccordionTrigger>
        <AccordionContent>Manage invitations, permissions, and roles.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="security">
        <AccordionTrigger>Security</AccordionTrigger>
        <AccordionContent>Review two-factor authentication, audit logs, and sessions.</AccordionContent>
      </AccordionItem>
    </AccordionGroup>
  );
}`;

    const usageCode = isJa
        ? `const sections = [
  { id: "billing", title: "請求設定", body: "支払い方法、請求書、更新日を確認できます。" },
  { id: "team", title: "チーム設定", body: "メンバー招待、権限、ロールを管理できます。" },
  { id: "security", title: "セキュリティ", body: "2段階認証、監査ログ、セッションを確認できます。" },
];

export function SettingsAccordionGroup() {
  return (
    <AccordionGroup
      values={sections.map((section) => section.id)}
      label="設定項目"
      expandLabel="すべて開く"
      collapseLabel="すべて閉じる"
    >
      {sections.map((section) => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger>{section.title}</AccordionTrigger>
          <AccordionContent>{section.body}</AccordionContent>
        </AccordionItem>
      ))}
    </AccordionGroup>
  );
}`
        : `const sections = [
  { id: "billing", title: "Billing settings", body: "Review payment methods, invoices, and renewal dates." },
  { id: "team", title: "Team settings", body: "Manage invitations, permissions, and roles." },
  { id: "security", title: "Security", body: "Review two-factor authentication, audit logs, and sessions." },
];

export function SettingsAccordionGroup() {
  return (
    <AccordionGroup
      values={sections.map((section) => section.id)}
      label="Settings"
      expandLabel="Open all"
      collapseLabel="Close all"
    >
      {sections.map((section) => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger>{section.title}</AccordionTrigger>
          <AccordionContent>{section.body}</AccordionContent>
        </AccordionItem>
      ))}
    </AccordionGroup>
  );
}`;

    const propsData = [
        {
            name: "values",
            type: "string[]",
            required: true,
            description: isJa
                ? "すべて開く操作で開く AccordionItem の value 一覧です。children から推測せず明示します。"
                : "Accordion item values used by the expand-all control. Values are explicit instead of inferred from children.",
        },
        {
            name: "value",
            type: "string[]",
            description: isJa
                ? "開いている項目を制御する値です。"
                : "Controlled open item values.",
        },
        {
            name: "defaultValue",
            type: "string[]",
            default: "[]",
            description: isJa
                ? "初期表示で開く項目の value 一覧です。"
                : "Initial open item values for uncontrolled usage.",
        },
        {
            name: "onValueChange",
            type: "(value: string[]) => void",
            description: isJa
                ? "開いている項目が変わった時に呼ばれます。"
                : "Called when open item values change.",
        },
        {
            name: "label / description",
            type: "ReactNode",
            description: isJa
                ? "グループ見出しと補足説明です。"
                : "Group heading and supporting copy.",
        },
        {
            name: "expandLabel / collapseLabel",
            type: "string",
            default: '"Open all" / "Close all"',
            description: isJa
                ? "開閉状態に応じて切り替わる操作ボタンの表示文言とツールチップです。"
                : "Labels and tooltips for the single toggle control, switching by open state.",
        },
        {
            name: "showControls",
            type: "boolean",
            default: "true",
            description: isJa
                ? "すべて開く・すべて閉じるを切り替える操作を表示するかどうかを指定します。"
                : "Controls whether the expand/collapse toggle control is shown.",
        },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "AccordionGroup", href: "/docs/components/accordion-group" },
                { name: "Accordion", href: "/docs/components/accordion" },
                { name: "Icon", href: "/docs/components/icon" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
            ]}
            relatedComponents={[
                { name: "Accordion", href: "/docs/components/accordion" },
                { name: "CollapsiblePanelToggle", href: "/docs/components/collapsible-panel-toggle" },
                { name: "TreeView", href: "/docs/components/tree-view" },
            ]}
        >
            <ComponentPreview
                code={code}
                codeBlock={<CodeBlock code={code} />}
                className="items-start"
                previewBodyWidth="md"
                previewHeight="auto"
            >
                <AccordionGroup
                    values={sectionValues}
                    label={isJa ? "設定項目" : "Settings"}
                    description={isJa ? "必要な項目だけ開くか、まとめて展開できます。" : "Open only what you need, or expand the full group."}
                    expandLabel={expandLabel}
                    collapseLabel={collapseLabel}
                    controlsLabel={isJa ? "アコーディオン操作" : "Accordion controls"}
                    className="w-full max-w-md"
                >
                    <SettingsItems locale={locale} />
                </AccordionGroup>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {isJa ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "with-description",
                            title: isJa ? "説明付き" : "With description",
                            description: isJa
                                ? "グループの目的を補足し、複数の開閉項目をひとまとまりとして扱います。"
                                : "Add context so multiple disclosure items read as one group.",
                            preview: (
                                <AccordionGroup
                                    values={sectionValues}
                                    defaultValue={["billing"]}
                                    label={isJa ? "アカウント設定" : "Account settings"}
                                    description={isJa ? "請求、チーム、セキュリティを確認できます。" : "Review billing, team, and security settings."}
                                    expandLabel={expandLabel}
                                    collapseLabel={collapseLabel}
                                    className="w-full max-w-md"
                                >
                                    <SettingsItems locale={locale} />
                                </AccordionGroup>
                            ),
                            previewHeight: "auto",
                            previewClassName: "items-start",
                            code,
                        },
                        {
                            key: "initial-open",
                            title: isJa ? "初期展開" : "Initial open",
                            description: isJa
                                ? "重要な項目だけ最初から開き、残りは必要に応じて開けます。"
                                : "Open important sections first while keeping the rest available.",
                            preview: (
                                <AccordionGroup
                                    values={sectionValues}
                                    defaultValue={["team", "security"]}
                                    label={isJa ? "レビュー項目" : "Review items"}
                                    expandLabel={expandLabel}
                                    collapseLabel={collapseLabel}
                                    className="w-full max-w-md"
                                >
                                    <SettingsItems locale={locale} />
                                </AccordionGroup>
                            ),
                            previewHeight: "auto",
                            previewClassName: "items-start",
                            code,
                        },
                        {
                            key: "without-controls",
                            title: isJa ? "操作なし" : "Without controls",
                            description: isJa
                                ? "見出しと説明だけをまとめ、すべて開く・すべて閉じる操作を表示しない構成です。"
                                : "Group sections with label and description while hiding the expand/collapse toggle control.",
                            preview: (
                                <AccordionGroup
                                    values={sectionValues}
                                    showControls={false}
                                    label={isJa ? "公開設定" : "Publishing settings"}
                                    description={isJa ? "必要な項目を個別に開いて確認します。" : "Open each section individually."}
                                    className="w-full max-w-md"
                                >
                                    <SettingsItems locale={locale} />
                                </AccordionGroup>
                            ),
                            previewHeight: "auto",
                            previewClassName: "items-start",
                            code: isJa
                                ? `<AccordionGroup values={sectionValues} showControls={false} label="公開設定">
  <AccordionItem value="billing">
    <AccordionTrigger>請求設定</AccordionTrigger>
    <AccordionContent>支払い方法、請求書、更新日を確認できます。</AccordionContent>
  </AccordionItem>
</AccordionGroup>`
                                : `<AccordionGroup values={sectionValues} showControls={false} label="Publishing settings">
  <AccordionItem value="billing">
    <AccordionTrigger>Billing settings</AccordionTrigger>
    <AccordionContent>Review payment methods, invoices, and renewal dates.</AccordionContent>
  </AccordionItem>
</AccordionGroup>`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {isJa ? "プロパティ" : "Props"}
                </h2>
                <PropsTable data={propsData} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {isJa ? "使い方" : "Usage"}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <CodeBlock code={usageCode} />
            </div>
        </ComponentLayout>
    );
}
