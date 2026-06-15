"use client";

import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { SelectDemo } from "@/components/demos/Batch3Demo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { FormControl, FormDescription, FormGroup, FormLabel, Select } from "@gunjo/ui";

function SelectField({
    disabled,
    grouped,
}: {
    disabled?: boolean;
    grouped?: boolean;
}) {
    const { locale } = useLocale();
    const select = (
        <Select id={grouped ? "select-framework" : "select-timezone"} defaultValue={grouped ? "next" : "tokyo"} disabled={disabled}>
            {grouped ? (
                <>
                    <optgroup label={locale === "ja" ? "フレームワーク" : "Frameworks"}>
                        <option value="next">Next.js</option>
                        <option value="remix">Remix</option>
                        <option value="astro">Astro</option>
                    </optgroup>
                    <optgroup label={locale === "ja" ? "静的サイト" : "Static sites"}>
                        <option value="gatsby">Gatsby</option>
                        <option value="hugo">Hugo</option>
                    </optgroup>
                </>
            ) : (
                <>
                    <option value="tokyo">{locale === "ja" ? "東京" : "Tokyo"}</option>
                    <option value="osaka">{locale === "ja" ? "大阪" : "Osaka"}</option>
                    <option value="fukuoka">{locale === "ja" ? "福岡" : "Fukuoka"}</option>
                </>
            )}
        </Select>
    );

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor={grouped ? "select-framework" : "select-timezone"}>
                {grouped ? (locale === "ja" ? "技術スタック" : "Technology stack") : locale === "ja" ? "拠点" : "Office"}
            </FormLabel>
            <FormControl>
                {disabled ? (
                    <DisabledReasonTooltip fullWidth reason={locale === "ja" ? "拠点は管理者が固定しています。" : "The office is managed by your administrator."}>
                        {select}
                    </DisabledReasonTooltip>
                ) : (
                    select
                )}
            </FormControl>
            <FormDescription>
                {disabled
                    ? locale === "ja"
                        ? "変更が必要な場合は管理者に依頼してください。"
                        : "Contact an administrator to change this value."
                    : grouped
                        ? locale === "ja"
                            ? "候補が多い場合はカテゴリで整理します。"
                            : "Use groups when the option list grows."
                        : locale === "ja"
                            ? "他の入力欄と同じ幅で揃います。"
                            : "The select aligns to the same field width as other inputs."}
            </FormDescription>
        </FormGroup>
    );
}

export default function SelectPage() {
    const { locale, sectionLabels } = useLocale();
    const code = `import { FormControl, FormDescription, FormGroup, FormLabel, Select } from "@gunjo/ui";

export function SelectDemo() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="office">${locale === "ja" ? "拠点" : "Office"}</FormLabel>
      <FormControl>
        <Select id="office" defaultValue="tokyo">
          <option value="tokyo">${locale === "ja" ? "東京" : "Tokyo"}</option>
          <option value="osaka">${locale === "ja" ? "大阪" : "Osaka"}</option>
          <option value="fukuoka">${locale === "ja" ? "福岡" : "Fukuoka"}</option>
        </Select>
      </FormControl>
      <FormDescription>${locale === "ja" ? "他の入力欄と同じ幅で揃います。" : "The select aligns to the same field width as other inputs."}</FormDescription>
    </FormGroup>
  );
}`;

    const usageCode = `import { FormControl, FormGroup, FormLabel, Select } from "@gunjo/ui";

<FormGroup className="w-full max-w-sm">
  <FormLabel htmlFor="office">${locale === "ja" ? "拠点" : "Office"}</FormLabel>
  <FormControl>
    <Select id="office" defaultValue="tokyo">
      <option value="tokyo">${locale === "ja" ? "東京" : "Tokyo"}</option>
      <option value="osaka">${locale === "ja" ? "大阪" : "Osaka"}</option>
      <option value="fukuoka">${locale === "ja" ? "福岡" : "Fukuoka"}</option>
    </Select>
  </FormControl>
</FormGroup>`;

    const propsData = [
        { name: "value", type: "string", description: locale === "ja" ? "外部から制御する選択値です。" : "Controlled selected value." },
        { name: "defaultValue", type: "string", description: locale === "ja" ? "初期選択値です。" : "Initial selected value for uncontrolled usage." },
        { name: "onChange", type: "React.ChangeEventHandler<HTMLSelectElement>", description: locale === "ja" ? "選択値が変わった時に呼ばれます。" : "Called when the selected value changes." },
        { name: "disabled", type: "boolean", default: "false", description: locale === "ja" ? "選択できない状態にします。理由はツールチップで補足します。" : "Disables selection. Explain the reason with a tooltip." },
        { name: "className", type: "string", description: locale === "ja" ? "Select はデフォルトで親幅いっぱいに広がります。幅は FormGroup や外側の max-w-* で制約します。" : "Select fills its parent by default. Constrain width on FormGroup or an outer max-w-* wrapper." },
    ];

    return (
        <ComponentLayout
            title={inputsMetadata.select.title}
            description={inputsMetadata.select.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Select", href: "/docs/components/select" },
                { name: "FormGroup", href: "/docs/components/form" },
                { name: "FormLabel", href: "/docs/components/form" },
                { name: "FormControl", href: "/docs/components/form" },
                { name: "FormDescription", href: "/docs/components/form" },
            ]}
            relatedComponents={[
                { name: "Combobox", href: "/docs/components/combobox" },
                { name: "DropdownMenu", href: "/docs/components/dropdown-menu" },
                { name: "DatePicker", href: "/docs/components/date-picker" },
                { name: "Form", href: "/docs/components/form" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/select" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="md">
                <SelectDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "field",
                            title: locale === "ja" ? "ラベル付き" : "With label",
                            description: locale === "ja" ? "フォーム内ではラベルと補足文を合わせて配置します。" : "Use a label and helper text when the select belongs to a form.",
                            preview: <SelectField />,
                            previewHeight: 190,
                            code,
                        },
                        {
                            key: "grouped",
                            title: locale === "ja" ? "グループ化" : "Grouped options",
                            description: locale === "ja" ? "候補が多い時は optgroup で分類します。" : "Use optgroup to organize longer option lists.",
                            preview: <SelectField grouped />,
                            previewHeight: 190,
                            code: `<Select defaultValue="next">
  <optgroup label="${locale === "ja" ? "フレームワーク" : "Frameworks"}">
    <option value="next">Next.js</option>
    <option value="remix">Remix</option>
  </optgroup>
</Select>`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "選べない理由はツールチップと補足文で伝えます。" : "Explain why the field is disabled with a tooltip and helper text.",
                            preview: <SelectField disabled />,
                            previewHeight: 190,
                            code: `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { Select } from "@gunjo/ui";

<DisabledReasonTooltip fullWidth reason="${locale === "ja" ? "拠点は管理者が固定しています。" : "The office is managed by your administrator."}">
  <Select disabled defaultValue="tokyo">
    <option value="tokyo">${locale === "ja" ? "東京" : "Tokyo"}</option>
  </Select>
</DisabledReasonTooltip>`,
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
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={usageCode} />
                </div>
            </section>
        </ComponentLayout>
    );
}
