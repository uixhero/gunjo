"use client";

import * as React from "react";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import inputsMetadata from "@design/inputs-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import { ComboboxDemo } from "@/components/demos/ComboboxDemo";
import { CodeBlock } from "@/components/doc/CodeBlock";
import {
    Combobox,
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

const FRAMEWORKS = [
    { value: "next", label: "Next.js" },
    { value: "remix", label: "Remix" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "astro", label: "Astro" },
    { value: "nuxt", label: "Nuxt" },
];

const ROLE_OPTIONS = {
    ja: [
        { value: "owner", label: "オーナー" },
        { value: "admin", label: "管理者" },
        { value: "member", label: "メンバー" },
        {
            value: "viewer",
            label: "閲覧者",
            disabled: true,
            disabledReason: "現在のプランでは閲覧者ロールを追加できません。",
        },
    ],
    en: [
        { value: "owner", label: "Owner" },
        { value: "admin", label: "Admin" },
        { value: "member", label: "Member" },
        {
            value: "viewer",
            label: "Viewer",
            disabled: true,
            disabledReason: "Viewer roles are not available on the current plan.",
        },
    ],
};

function ComboboxStatesContent({ locale }: { locale: "ja" | "en" }) {
    const [framework, setFramework] = React.useState<string>("next");
    const [role, setRole] = React.useState<string>("");
    const roleOptions = ROLE_OPTIONS[locale];

    return (
        <ComponentDemoStates
            states={[
                {
                    key: "with-default",
                    title: locale === "ja" ? "初期選択あり" : "Pre-selected default",
                    description:
                        locale === "ja"
                            ? "よく使う選択肢を初期値にして、操作ステップを減らします。"
                            : "Set the most common option as the default value to skip an interaction step.",
                    preview: (
                        <FormGroup className="w-full max-w-sm">
                            <FormLabel htmlFor="state-framework">{locale === "ja" ? "フレームワーク" : "Framework"}</FormLabel>
                            <FormControl>
                                <Combobox
                                    id="state-framework"
                                    options={FRAMEWORKS}
                                    value={framework}
                                    onValueChange={setFramework}
                                    placeholder={locale === "ja" ? "フレームワークを選択" : "Select framework"}
                                    searchClearLabel={locale === "ja" ? "検索をクリア" : "Clear search"}
                                    clearLabel={locale === "ja" ? "選択をクリア" : "Clear selection"}
                                />
                            </FormControl>
                            <FormDescription>{locale === "ja" ? "よく使う選択肢を初期表示しています。" : "Common option selected by default."}</FormDescription>
                        </FormGroup>
                    ),
                    code: `import * as React from "react";
import { Combobox, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";

const FRAMEWORKS = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "sveltekit", label: "SvelteKit" },
];

export default function FrameworkPicker() {
  const [framework, setFramework] = React.useState("next");
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="framework">Framework</FormLabel>
      <FormControl>
        <Combobox
          id="framework"
          options={FRAMEWORKS}
          value={framework}
          onValueChange={setFramework}
          placeholder="Select framework"
        />
      </FormControl>
      <FormDescription>Common option selected by default.</FormDescription>
    </FormGroup>
  );
}`,
                },
                {
                    key: "disabled-option",
                    title: locale === "ja" ? "選べない項目" : "Disabled option",
                    description:
                        locale === "ja"
                            ? "選択できない項目も表示し、権限や条件によって選べないことを示します。"
                            : "Mark options users cannot pick while keeping them visible and informative.",
                    preview: (
                        <FormGroup className="w-full max-w-sm">
                            <FormLabel htmlFor="state-role">{locale === "ja" ? "ロール" : "Role"}</FormLabel>
                            <FormControl>
                                <Combobox
                                    id="state-role"
                                    options={roleOptions}
                                    value={role}
                                    onValueChange={setRole}
                                    placeholder={locale === "ja" ? "ロールを選択" : "Select role"}
                                    searchClearLabel={locale === "ja" ? "検索をクリア" : "Clear search"}
                                    clearLabel={locale === "ja" ? "選択をクリア" : "Clear selection"}
                                />
                            </FormControl>
                            <FormDescription>{locale === "ja" ? "利用できないロールは表示したまま無効化します。" : "Unavailable roles stay visible but disabled."}</FormDescription>
                        </FormGroup>
                    ),
                    code: `import * as React from "react";
import { Combobox, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";

const ROLES = [
  { value: "owner", label: "${locale === "ja" ? "オーナー" : "Owner"}" },
  { value: "admin", label: "${locale === "ja" ? "管理者" : "Admin"}" },
  { value: "member", label: "${locale === "ja" ? "メンバー" : "Member"}" },
  {
    value: "viewer",
    label: "${locale === "ja" ? "閲覧者" : "Viewer"}",
    disabled: true,
    disabledReason: "${locale === "ja" ? "現在のプランでは閲覧者ロールを追加できません。" : "Viewer roles are not available on the current plan."}",
  },
];

export default function RolePicker() {
  const [role, setRole] = React.useState("");
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="role">${locale === "ja" ? "ロール" : "Role"}</FormLabel>
      <FormControl>
        <Combobox
          id="role"
          options={ROLES}
          value={role}
          onValueChange={setRole}
          placeholder="${locale === "ja" ? "ロールを選択" : "Select role"}"
          clearLabel="${locale === "ja" ? "選択をクリア" : "Clear selection"}"
        />
      </FormControl>
      <FormDescription>${locale === "ja" ? "利用できないロールは表示したまま無効化します。" : "Unavailable roles stay visible but disabled."}</FormDescription>
    </FormGroup>
  );
}`,
                },
                {
                    key: "empty-state",
                    title: locale === "ja" ? "一致なし" : "No matches",
                    description:
                        locale === "ja"
                            ? "検索結果がない場合は、次の行動がわかるメッセージを表示します。"
                            : "Customize emptyMessage to guide the user when their query returns nothing.",
                    preview: (
                        <FormGroup className="w-full max-w-sm">
                            <FormLabel htmlFor="state-empty-framework">{locale === "ja" ? "フレームワーク" : "Framework"}</FormLabel>
                            <FormControl>
                                <Combobox
                                    id="state-empty-framework"
                                    options={FRAMEWORKS}
                                    placeholder={locale === "ja" ? "キーワードを入力" : "Type something obscure"}
                                    searchPlaceholder={locale === "ja" ? "フレームワークを検索" : "Search framework"}
                                    searchClearLabel={locale === "ja" ? "検索をクリア" : "Clear search"}
                                    emptyMessage={locale === "ja" ? "一致するフレームワークがありません。" : "No frameworks match — try Next, Remix, or Astro."}
                                    clearLabel={locale === "ja" ? "選択をクリア" : "Clear selection"}
                                />
                            </FormControl>
                            <FormDescription>{locale === "ja" ? "検索結果の有無は、開いた候補一覧の中で伝えます。" : "Search feedback stays inside the popover."}</FormDescription>
                        </FormGroup>
                    ),
                    code: `import { Combobox, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";

const FRAMEWORKS = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "sveltekit", label: "SvelteKit" },
];

export default function PickyCombobox() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="framework">Framework</FormLabel>
      <FormControl>
        <Combobox
          id="framework"
          options={FRAMEWORKS}
          placeholder="Type something obscure"
          emptyMessage="No frameworks match — try Next, Remix, or Astro."
        />
      </FormControl>
      <FormDescription>Search feedback stays inside the popover.</FormDescription>
    </FormGroup>
  );
}`,
                },
            ]}
        />
    );
}

export default function ComboboxPage() {
    const { locale, sectionLabels } = useLocale();
    const code = `import * as React from "react";
import { Combobox, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";

const frameworks = [
    { value: "next", label: "Next.js" },
    { value: "remix", label: "Remix" },
    { value: "sveltekit", label: "SvelteKit" },
];

export function ComboboxDemo() {
    const [value, setValue] = React.useState<string>("");

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="framework">${locale === "ja" ? "フレームワーク" : "Framework"}</FormLabel>
            <FormControl>
                <Combobox
                    id="framework"
                    options={frameworks}
                    value={value}
                    onValueChange={setValue}
                    placeholder="${locale === "ja" ? "フレームワークを選択..." : "Select framework..."}"
                    searchPlaceholder="${locale === "ja" ? "フレームワークを検索..." : "Search framework..."}"
                    searchClearLabel="${locale === "ja" ? "検索をクリア" : "Clear search"}"
                    emptyMessage="${locale === "ja" ? "一致するフレームワークがありません。" : "No framework found."}"
                    clearLabel="${locale === "ja" ? "選択をクリア" : "Clear selection"}"
                />
            </FormControl>
            <FormDescription>${locale === "ja" ? "検索するか、一覧から選択します。" : "Search or choose from the list."}</FormDescription>
        </FormGroup>
    );
}`;

    const usageCode = `import * as React from "react";
import { Combobox, FormControl, FormGroup, FormLabel } from "@gunjo/ui"

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
];

export function ComboboxUsage() {
  const [value, setValue] = React.useState("");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="option">Option</FormLabel>
      <FormControl>
        <Combobox id="option" options={options} value={value} onValueChange={setValue} />
      </FormControl>
    </FormGroup>
  );
}`;

    const propsData = [
        {
            name: "id",
            type: "string",
            description: locale === "ja" ? "ラベルと選択ボタンを紐づけるための ID です。" : "Applied to the trigger button so FormLabel can target the combobox.",
        },
        {
            name: "options",
            type: "ComboboxOption[]",
            description: locale === "ja" ? "値、表示名、無効化状態、無効化理由を持つ選択肢の配列です。" : "Array of { value, label, disabled?, disabledReason? } options.",
        },
        {
            name: "value",
            type: "string",
            description: locale === "ja" ? "外部で管理する選択値です。" : "Controlled selected value.",
        },
        {
            name: "onValueChange",
            type: "(value: string) => void",
            description: locale === "ja" ? "選択値が変わった時に呼ばれる処理です。クリア時は空文字を返します。" : "Callback fired when selection changes. Clearing returns an empty string.",
        },
        {
            name: "placeholder",
            type: "string",
            default: "'Select option...'",
            description: locale === "ja" ? "未選択時に選択ボタンへ表示するテキストです。" : "Trigger button text when nothing selected.",
        },
        {
            name: "searchPlaceholder",
            type: "string",
            default: "'Search...'",
            description: locale === "ja" ? "候補一覧内の検索欄に表示する入力例です。" : "Search input placeholder inside popover.",
        },
        {
            name: "searchClearLabel",
            type: "string",
            default: "'Clear search'",
            description: locale === "ja" ? "検索欄をクリアするボタンの読み上げ用ラベルです。" : "Accessible label for the search input clear button.",
        },
        {
            name: "emptyMessage",
            type: "string",
            default: "'No option found.'",
            description: locale === "ja" ? "検索結果がない場合に表示するテキスト。" : "Shown when search yields no results.",
        },
        {
            name: "clearable",
            type: "boolean",
            default: "true",
            description: locale === "ja" ? "選択済みの値をクリアするボタンを表示するか。" : "Whether to show a clear button when a value is selected.",
        },
        {
            name: "clearLabel",
            type: "string",
            default: "'Clear selection'",
            description: locale === "ja" ? "選択をクリアするボタンの読み上げ用ラベルとツールチップです。" : "Accessible label and tooltip for the clear button.",
        },
        {
            name: "disabled",
            type: "boolean",
            description: locale === "ja" ? "選択ボタンを操作できない状態にします。" : "Disables the trigger button.",
        },
    ];

    return (
        <ComponentLayout
            title={(inputsMetadata as Record<string, { title: string }>).combobox.title}
            description={(inputsMetadata as Record<string, { description: string }>).combobox.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Combobox", href: "/docs/components/combobox" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Command", href: "/docs/components/command" },
                { name: "Popover", href: "/docs/components/popover" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "Select", href: "/docs/components/select" },
                { name: "CommandPalette", href: "/docs/components/command-palette" },
                { name: "DropdownMenu", href: "/docs/components/dropdown-menu" },
                { name: "Form", href: "/docs/components/form" },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/combobox"
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewBodyWidth="md"
            >
                <ComboboxDemo />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComboboxStatesContent locale={locale} />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={usageCode} />
                </div>
            </div>
        </ComponentLayout>
    );
}
