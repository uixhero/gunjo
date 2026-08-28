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
    const isJa = locale === "ja";
    const code = isJa
        ? `import * as React from "react";
import { PasswordGroup } from "@gunjo/ui";

export function NewPasswordGroupField() {
  const [value, setValue] = React.useState("GunjoUI2026");

  return (
    <PasswordGroup
      value={value}
      onValueChange={setValue}
      label="新しいパスワード"
      strengthScore={3}
      strengthLabel="パスワード強度"
      strengthValueLabel="強い"
      requirements={[
        {
          id: "length",
          label: "12文字以上",
          met: value.length >= 12,
        },
        {
          id: "uppercase",
          label: "大文字を含む",
          met: /[A-Z]/.test(value),
        },
        {
          id: "number",
          label: "数字を含む",
          met: /\\d/.test(value),
        },
      ]}
    />
  );
}`
        : `import * as React from "react";
import { PasswordGroup } from "@gunjo/ui";

export function NewPasswordGroupField() {
  const [value, setValue] = React.useState("GunjoUI2026");

  return (
    <PasswordGroup
      value={value}
      onValueChange={setValue}
      label="New password"
      strengthScore={3}
      strengthLabel="Password strength"
      strengthValueLabel="Strong"
      requirements={[
        {
          id: "length",
          label: "At least 12 characters",
          met: value.length >= 12,
        },
        {
          id: "uppercase",
          label: "Includes an uppercase letter",
          met: /[A-Z]/.test(value),
        },
        {
          id: "number",
          label: "Includes a number",
          met: /\\d/.test(value),
        },
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

    function RejectedPreview() {
        return (
            <PasswordGroup
                className="w-full max-w-sm"
                value="gunjo"
                label={locale === "ja" ? "新しいパスワード" : "New password"}
                strengthScore={1}
                strengthLabel={locale === "ja" ? "パスワード強度" : "Password strength"}
                strengthValueLabel={locale === "ja" ? "弱い" : "Weak"}
                requirements={[
                    { id: "length", label: locale === "ja" ? "12文字以上" : "At least 12 characters", met: false },
                    { id: "uppercase", label: locale === "ja" ? "大文字を含む" : "Includes an uppercase letter", met: false },
                    { id: "number", label: locale === "ja" ? "数字を含む" : "Includes a number", met: false },
                ]}
                error={locale === "ja" ? "この組み合わせでは登録できません。" : "This password cannot be saved."}
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
                    code: isJa
                        ? `import { PasswordGroup } from "@gunjo/ui";

export function ManagedPasswordGroupField() {
  return (
    <PasswordGroup
      className="w-full max-w-sm"
      value="managed-password"
      label="管理済みパスワード"
      disabled
      disabledReason="SSO 管理のため直接変更できません。"
      description="無効化理由は入力欄の hover / focus で確認できます。"
    />
  );
}`
                        : `import { PasswordGroup } from "@gunjo/ui";

export function ManagedPasswordGroupField() {
  return (
    <PasswordGroup
      className="w-full max-w-sm"
      value="managed-password"
      label="Managed password"
      disabled
      disabledReason="Managed by SSO and cannot be changed here."
      description="Hover or focus the field to see why it is disabled."
    />
  );
}`,
                },
                {
                    key: "rejected",
                    title: locale === "ja" ? "サーバーに弾かれたとき" : "Rejected by the server",
                    description: locale === "ja"
                        ? "requirements は「何が足りないか」、error は「送った結果どうだったか」です。役割が違うので同時に出ます。error は入力欄の下、要件リストのさらに下に置かれます。"
                        : "requirements says what is missing; error says what happened when you submitted. They are different jobs, so both can show at once — error sits below the requirement list.",
                    preview: <RejectedPreview />,
                    previewHeight: 280,
                    code: isJa
                        ? `import { PasswordGroup } from "@gunjo/ui";

const VALUE = "gunjo";

const REQUIREMENTS = [
  { id: "length", label: "12文字以上", met: false },
  { id: "uppercase", label: "大文字を含む", met: false },
  { id: "number", label: "数字を含む", met: false },
];

export function RejectedPasswordGroupField() {
  return (
    <PasswordGroup
      className="w-full max-w-sm"
      value={VALUE}
      label="新しいパスワード"
      strengthScore={1}
      strengthLabel="パスワード強度"
      strengthValueLabel="弱い"
      requirements={REQUIREMENTS}
      error="この組み合わせでは登録できません。"
    />
  );
}`
                        : `import { PasswordGroup } from "@gunjo/ui";

const VALUE = "gunjo";

const REQUIREMENTS = [
  { id: "length", label: "At least 12 characters", met: false },
  { id: "uppercase", label: "Includes an uppercase letter", met: false },
  { id: "number", label: "Includes a number", met: false },
];

export function RejectedPasswordGroupField() {
  return (
    <PasswordGroup
      className="w-full max-w-sm"
      value={VALUE}
      label="New password"
      strengthScore={1}
      strengthLabel="Password strength"
      strengthValueLabel="Weak"
      requirements={REQUIREMENTS}
      error="This password cannot be saved."
    />
  );
}`,
                },
            ]}
        />
    );
}
