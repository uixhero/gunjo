"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { PropsTable } from "@/components/doc/PropsTable";
import { PasswordInputDemo } from "@/components/demos/PasswordInputDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { FormControl, FormDescription, FormGroup, FormLabel, PasswordInput } from "@gunjo/ui";
import * as React from "react";

function PasswordStatePreview({
    showDefault,
    disabled,
}: {
    showDefault?: boolean;
    disabled?: boolean;
}) {
    const { locale } = useLocale();
    const [value, setValue] = React.useState("sample-password");
    const [show, setShow] = React.useState(Boolean(showDefault));
    const field = (
        <PasswordInput
            id="password-state"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            show={show}
            onShowChange={setShow}
            placeholder={locale === "ja" ? "パスワードを入力" : "Enter password"}
            disabled={disabled}
            showLabel={locale === "ja" ? "パスワードを表示" : "Show password"}
            hideLabel={locale === "ja" ? "パスワードを隠す" : "Hide password"}
        />
    );

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="password-state">{locale === "ja" ? "パスワード" : "Password"}</FormLabel>
            <FormControl>
                {disabled ? (
                    <DisabledReasonTooltip fullWidth reason={locale === "ja" ? "シングルサインオン管理のため直接変更できません。" : "This password is managed by SSO."}>
                        {field}
                    </DisabledReasonTooltip>
                ) : (
                    field
                )}
            </FormControl>
            <FormDescription>
                {locale === "ja"
                    ? "右端のボタンで入力内容の表示・非表示を切り替えます。"
                    : "Use the right-side button to show or hide the value."}
            </FormDescription>
        </FormGroup>
    );
}

export default function PasswordInputPage() {
    const { locale, sectionLabels } = useLocale();
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const code = `import * as React from "react";
import { FormControl, FormDescription, FormGroup, FormLabel, PasswordInput } from "@gunjo/ui";

export function PasswordInputDemo() {
  const [value, setValue] = React.useState("sample-password");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="password">${locale === "ja" ? "パスワード" : "Password"}</FormLabel>
      <FormControl>
        <PasswordInput
          id="password"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="${locale === "ja" ? "パスワードを入力" : "Enter password..."}"
          showLabel="${locale === "ja" ? "パスワードを表示" : "Show password"}"
          hideLabel="${locale === "ja" ? "パスワードを隠す" : "Hide password"}"
        />
      </FormControl>
      <FormDescription>${locale === "ja" ? "右端のボタンで入力内容の表示・非表示を切り替えます。" : "Use the visibility button to inspect the value."}</FormDescription>
    </FormGroup>
  );
}`;

    const usageCode = `import { FormControl, FormGroup, FormLabel, PasswordInput } from "@gunjo/ui";

export function PasswordField() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="password">${locale === "ja" ? "パスワード" : "Password"}</FormLabel>
      <FormControl>
        <PasswordInput
          id="password"
          placeholder="${locale === "ja" ? "パスワードを入力" : "Password"}"
          showLabel="${locale === "ja" ? "パスワードを表示" : "Show password"}"
          hideLabel="${locale === "ja" ? "パスワードを隠す" : "Hide password"}"
        />
      </FormControl>
    </FormGroup>
  );
}`;

    const propsData = [
        {
            name: "show",
            type: "boolean",
            description:
                locale === "ja"
                    ? "表示・非表示の状態を外部から制御する場合に使います。"
                    : "Controlled show / hide state. Leave unset for uncontrolled behavior.",
        },
        {
            name: "onShowChange",
            type: "(show: boolean) => void",
            description:
                locale === "ja"
                    ? "表示切替ボタンが押された時に呼ばれます。"
                    : "Called when the visibility button is pressed.",
        },
        {
            name: "showLabel",
            type: "string",
            default: "'Show password'",
            description:
                locale === "ja"
                    ? "パスワードを表示するボタンの支援技術向けラベルです。"
                    : "Accessible label for the show-password button.",
        },
        {
            name: "hideLabel",
            type: "string",
            default: "'Hide password'",
            description:
                locale === "ja"
                    ? "パスワードを隠すボタンの支援技術向けラベルです。"
                    : "Accessible label for the hide-password button.",
        },
        {
            name: "...rest",
            type: "InputHTMLAttributes",
            description:
                locale === "ja"
                    ? "`type` 以外の、入力欄に渡せる標準属性を指定できます。"
                    : "All standard input props except `type`.",
        },
    ];

    return (
        <ComponentLayout
            title={metadata.passwordInput.title}
            description={metadata.passwordInput.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "PasswordInput", href: "/docs/components/password-input" },
                { name: "Input", href: "/docs/components/input" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "Input", href: "/docs/components/input" },
                { name: "Form", href: "/docs/components/form" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/password-input" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="md">
                <PasswordInputDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "masked",
                            title: locale === "ja" ? "非表示" : "Masked",
                            description:
                                locale === "ja"
                                    ? "初期状態では値を伏せて表示します。"
                                    : "The value is hidden by default.",
                            preview: <PasswordStatePreview />,
                            previewHeight: 170,
                            code: usageCode,
                        },
                        {
                            key: "visible",
                            title: locale === "ja" ? "表示中" : "Visible",
                            description:
                                locale === "ja"
                                    ? "必要に応じて、外部の状態から表示・非表示を制御できます。"
                                    : "Control visibility from external state when needed.",
                            preview: <PasswordStatePreview showDefault />,
                            previewHeight: 170,
                            code: `import { PasswordInput } from "@gunjo/ui";

<PasswordInput show={show} onShowChange={setShow} />`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description:
                                locale === "ja"
                                    ? "変更できない理由はツールチップと補足文で伝えます。"
                                    : "Explain why the password cannot be changed with a Tooltip and helper copy.",
                            preview: <PasswordStatePreview disabled />,
                            previewHeight: 170,
                            code: `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { PasswordInput } from "@gunjo/ui";

<DisabledReasonTooltip fullWidth reason="${locale === "ja" ? "シングルサインオン管理のため直接変更できません。" : "This password is managed by SSO."}">
  <PasswordInput disabled value="sample-password" />
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
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </section>
        </ComponentLayout>
    );
}
