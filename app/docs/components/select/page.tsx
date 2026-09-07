"use client";

import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import { FormControl, FormDescription, FormGroup, FormLabel, Select } from "@gunjo/ui";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

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
    const content = getDocContent("components/select", locale);
    const isJa = locale === "ja";
    const code = isJa
        ? `import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  Select,
} from "@gunjo/ui";

export function OfficeSelectField() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="office">拠点</FormLabel>
      <FormControl>
        <Select id="office" defaultValue="tokyo">
          <option value="tokyo">東京</option>
          <option value="osaka">大阪</option>
          <option value="fukuoka">福岡</option>
        </Select>
      </FormControl>
      <FormDescription>他の入力欄と同じ幅で揃います。</FormDescription>
    </FormGroup>
  );
}`
        : `import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  Select,
} from "@gunjo/ui";

export function OfficeSelectField() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="office">Office</FormLabel>
      <FormControl>
        <Select id="office" defaultValue="tokyo">
          <option value="tokyo">Tokyo</option>
          <option value="osaka">Osaka</option>
          <option value="fukuoka">Fukuoka</option>
        </Select>
      </FormControl>
      <FormDescription>
        The select aligns to the same field width as other inputs.
      </FormDescription>
    </FormGroup>
  );
}`;

    const usageCode = isJa
        ? `import * as React from "react";
import { FormControl, FormGroup, FormLabel, Select } from "@gunjo/ui";

export function OfficePicker() {
  const [office, setOffice] = React.useState("tokyo");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="office">拠点</FormLabel>
      <FormControl>
        <Select
          id="office"
          value={office}
          onChange={(event) => setOffice(event.target.value)}
        >
          <option value="tokyo">東京</option>
          <option value="osaka">大阪</option>
          <option value="fukuoka">福岡</option>
        </Select>
      </FormControl>
    </FormGroup>
  );
}`
        : `import * as React from "react";
import { FormControl, FormGroup, FormLabel, Select } from "@gunjo/ui";

export function OfficePicker() {
  const [office, setOffice] = React.useState("tokyo");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="office">Office</FormLabel>
      <FormControl>
        <Select
          id="office"
          value={office}
          onChange={(event) => setOffice(event.target.value)}
        >
          <option value="tokyo">Tokyo</option>
          <option value="osaka">Osaka</option>
          <option value="fukuoka">Fukuoka</option>
        </Select>
      </FormControl>
    </FormGroup>
  );
}`;

    const propsData = [
        { name: "value", type: "string", description: locale === "ja" ? "外部から制御する選択値です。" : "Controlled selected value." },
        { name: "defaultValue", type: "string", description: locale === "ja" ? "初期選択値です。" : "Initial selected value for uncontrolled usage." },
        { name: "onChange", type: "React.ChangeEventHandler<HTMLSelectElement>", description: locale === "ja" ? "選択値が変わった時に呼ばれます。" : "Called when the selected value changes." },
        { name: "disabled", type: "boolean", default: "false", description: locale === "ja" ? "選択できない状態にします。理由はツールチップで補足します。" : "Disables selection. Explain the reason with a tooltip." },
        { name: "className", type: "string", description: locale === "ja" ? "Select はデフォルトで親幅いっぱいに広がります。幅は FormGroup や外側の max-w-* で制約します。" : "Select fills its parent by default. Constrain width on FormGroup or an outer max-w-* wrapper." },
    ];

    return (
        <ComponentLayout
            title={content?.title ?? inputsMetadata.select.title}
            description={content?.description ?? inputsMetadata.select.description}
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
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: セレクト（Select）" : "UIXHERO: Select (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/select`,
                },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
                <SelectField />
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
                            code,
                        },
                        {
                            key: "grouped",
                            title: locale === "ja" ? "グループ化" : "Grouped options",
                            description: locale === "ja" ? "候補が多い時は optgroup で分類します。" : "Use optgroup to organize longer option lists.",
                            preview: <SelectField grouped />,
                            code: isJa
                                ? `import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  Select,
} from "@gunjo/ui";

export function GroupedSelect() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="select-framework">技術スタック</FormLabel>
      <FormControl>
        <Select id="select-framework" defaultValue="next">
          <optgroup label="フレームワーク">
            <option value="next">Next.js</option>
            <option value="remix">Remix</option>
            <option value="astro">Astro</option>
          </optgroup>
          <optgroup label="静的サイト">
            <option value="gatsby">Gatsby</option>
            <option value="hugo">Hugo</option>
          </optgroup>
        </Select>
      </FormControl>
      <FormDescription>候補が多い場合はカテゴリで整理します。</FormDescription>
    </FormGroup>
  );
}`
                                : `import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  Select,
} from "@gunjo/ui";

export function GroupedSelect() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="select-framework">Technology stack</FormLabel>
      <FormControl>
        <Select id="select-framework" defaultValue="next">
          <optgroup label="Frameworks">
            <option value="next">Next.js</option>
            <option value="remix">Remix</option>
            <option value="astro">Astro</option>
          </optgroup>
          <optgroup label="Static sites">
            <option value="gatsby">Gatsby</option>
            <option value="hugo">Hugo</option>
          </optgroup>
        </Select>
      </FormControl>
      <FormDescription>
        Use groups when the option list grows.
      </FormDescription>
    </FormGroup>
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "選べない理由はツールチップと補足文で伝えます。" : "Explain why the field is disabled with a tooltip and helper text.",
                            preview: <SelectField disabled />,
                            code: isJa
                                ? `import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  Select,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gunjo/ui";

export function DisabledOfficeSelect() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="office">拠点</FormLabel>
      <FormControl>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block w-full" tabIndex={0}>
              <Select id="office" disabled defaultValue="tokyo">
                <option value="tokyo">東京</option>
                <option value="osaka">大阪</option>
                <option value="fukuoka">福岡</option>
              </Select>
            </span>
          </TooltipTrigger>
          <TooltipContent>拠点は管理者が固定しています。</TooltipContent>
        </Tooltip>
      </FormControl>
      <FormDescription>
        変更が必要な場合は管理者に依頼してください。
      </FormDescription>
    </FormGroup>
  );
}`
                                : `import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  Select,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gunjo/ui";

export function DisabledOfficeSelect() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="office">Office</FormLabel>
      <FormControl>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block w-full" tabIndex={0}>
              <Select id="office" disabled defaultValue="tokyo">
                <option value="tokyo">Tokyo</option>
                <option value="osaka">Osaka</option>
                <option value="fukuoka">Fukuoka</option>
              </Select>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            The office is managed by your administrator.
          </TooltipContent>
        </Tooltip>
      </FormControl>
      <FormDescription>
        Contact an administrator to change this value.
      </FormDescription>
    </FormGroup>
  );
}`,
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
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>素の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">select</code> のまま出す。</strong>資料は「選択肢が4以下なら Radio、5から15なら Select、15を超えるなら Combobox」を挙げています。GUNJO の Select はその真ん中だけを引き受け、ブラウザの <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">select</code> をそのまま使います。開いた一覧は OS のものになるので、スマホでは端末の選択画面が出ます。検索や複数選択が要る画面は、この部品ではなく Combobox の仕事です。
                        </li>
                        <li>
                            <strong>ラベルを部品の中に入れた。</strong>資料は「ラベルは必ず枠外に常時表示する」を挙げています。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">label</code> を渡すと <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">htmlFor</code> で結んだ文字が上に出て、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">description</code> を渡すと下に補足が出て <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-describedby</code> で結ばれます。どちらも渡さなければ包む箱ごと作らないので、表のセルのような狭い場所にもそのまま置けます。
                        </li>
                        <li>
                            <strong>矢印は飾りとして重ねてある。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">appearance-none</code> で OS の矢印を消し、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">pointer-events-none</code> を付けた山形のアイコンを右に重ねています。クリックはすべて下の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">select</code> に届くので、アイコンの上を押しても開きます。誤りを示す赤い枠も、専用のクラスではなく <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-invalid</code> の属性で切り替わります。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>It stays a native <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">select</code>.</strong> The article splits the space by option count: four or fewer for radios, five to fifteen for a select, more than fifteen for a combobox. GUNJO takes only the middle band and renders the browser control, so on a phone the native picker opens. Search and multi-select belong to a combobox, not here.
                        </li>
                        <li>
                            <strong>The label lives inside the component.</strong> The article treats an always-visible label outside the box as a must. Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">label</code> and it renders above, tied with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">htmlFor</code>; pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">description</code> and it renders below, tied with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-describedby</code>. Pass neither and no wrapper is created at all, so the bare control still fits inside a narrow table cell.
                        </li>
                        <li>
                            <strong>The chevron is decoration layered on top.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">appearance-none</code> removes the native arrow and a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">pointer-events-none</code> chevron sits over the right edge, so every click still reaches the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">select</code> underneath. The invalid state is driven by the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-invalid</code> attribute rather than a separate class.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
