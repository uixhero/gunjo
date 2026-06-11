"use client";

import { InputCompositionDocPage } from "@/docs/components/_shared/InputCompositionDocPage";
import { PasswordGroupDemo } from "@/components/demos/PasswordGroupDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { PasswordGroup } from "@gunjo/ui";
import * as React from "react";

export default function PasswordGroupPage() {
    const { locale } = useLocale();
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const code = `import * as React from "react";
import { PasswordGroup } from "@gunjo/ui";

export function PasswordGroupDemo() {
  const [value, setValue] = React.useState("GunjoUI2026");

  return (
    <PasswordGroup
      value={value}
      onValueChange={setValue}
      label="${locale === "ja" ? "新しいパスワード" : "New password"}"
      strengthScore={3}
      strengthLabel="${locale === "ja" ? "パスワード強度" : "Password strength"}"
      strengthValueLabel="${locale === "ja" ? "強い" : "Strong"}"
      requirements={[
        { id: "length", label: "${locale === "ja" ? "12文字以上" : "At least 12 characters"}", met: value.length >= 12 },
        { id: "uppercase", label: "${locale === "ja" ? "大文字を含む" : "Includes an uppercase letter"}", met: /[A-Z]/.test(value) },
        { id: "number", label: "${locale === "ja" ? "数字を含む" : "Includes a number"}", met: /\\d/.test(value) },
      ]}
    />
  );
}`;

    function DisabledPreview() {
        return (
            <PasswordGroup
                className="w-full max-w-sm"
                value="managed-password"
                label={locale === "ja" ? "管理済みパスワード" : "Managed password"}
                disabled
                disabledReason={locale === "ja" ? "SSO 管理のため直接変更できません。" : "Managed by SSO and cannot be changed here."}
                description={locale === "ja" ? "無効化理由は入力欄の hover / focus で確認できます。" : "Hover or focus the field to see why it is disabled."}
            />
        );
    }

    return (
        <InputCompositionDocPage
            metadataKey="passwordGroup"
            title={metadata.passwordGroup.title}
            description={metadata.passwordGroup.description}
            embedSrc="/embed/password-group"
            preview={<PasswordGroupDemo />}
            code={code}
            usageCode={code}
            usedComponents={[
                { name: "PasswordGroup", href: "/docs/components/password-group" },
                { name: "PasswordInput", href: "/docs/components/password-input" },
                { name: "PasswordRequirementList", href: "/docs/components/password-requirement-list" },
                { name: "PasswordStrengthMeter", href: "/docs/components/password-strength-meter" },
                { name: "Form", href: "/docs/components/form" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "PasswordInput", href: "/docs/components/password-input" },
                { name: "Form", href: "/docs/components/form" },
            ]}
            propsData={[
                {
                    name: "value / defaultValue / onValueChange",
                    type: "string / (value) => void",
                    description: locale === "ja" ? "パスワード値の制御または初期値です。" : "Controlled value or initial value for the password field.",
                },
                {
                    name: "requirements",
                    type: "PasswordRequirement[]",
                    description: locale === "ja" ? "表示する要件リストです。検証はアプリ側で行います。" : "Requirement list. Validation stays in the application.",
                },
                {
                    name: "strengthScore",
                    type: "number",
                    description: locale === "ja" ? "強度メーターに渡すスコアです。" : "Score passed to the strength meter.",
                },
                {
                    name: "disabledReason",
                    type: "ReactNode",
                    description: locale === "ja" ? "無効化理由としてツールチップに表示します。" : "Shown in a tooltip as the disabled reason.",
                },
            ]}
            states={[
                {
                    key: "standard",
                    title: locale === "ja" ? "要件と強度付き" : "With requirements and strength",
                    description: locale === "ja" ? "パスワード入力、要件、強度を1つの field として扱います。" : "Treat input, requirements, and strength as one field.",
                    preview: <PasswordGroupDemo />,
                    previewHeight: 280,
                    code,
                },
                {
                    key: "disabled",
                    title: locale === "ja" ? "無効化理由付き" : "With disabled reason",
                    description: locale === "ja" ? "変更できない理由をツールチップで伝えます。" : "Explain why the field is unavailable with a Tooltip.",
                    preview: <DisabledPreview />,
                    previewHeight: 180,
                    code: `<PasswordGroup disabled disabledReason="${locale === "ja" ? "SSO 管理のため直接変更できません。" : "Managed by SSO and cannot be changed here."}" />`,
                },
            ]}
        />
    );
}
