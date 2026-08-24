"use client";

import { InputCompositionDocPage } from "@/docs/components/_shared/InputCompositionDocPage";
import { PasswordRequirementListDemo } from "@/components/demos/PasswordRequirementListDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { PasswordRequirementList } from "@gunjo/ui";

export default function PasswordRequirementListPage() {
    const { locale } = useLocale();
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const isJa = locale === "ja";
    const code = isJa
        ? `import { PasswordRequirementList } from "@gunjo/ui";

export function SignUpPasswordRequirements() {
  return (
    <PasswordRequirementList
      requirements={[
        { id: "length", label: "12文字以上", met: true },
        { id: "number", label: "数字を含む", met: true },
        { id: "symbol", label: "記号を含む", met: false },
      ]}
    />
  );
}`
        : `import { PasswordRequirementList } from "@gunjo/ui";

export function SignUpPasswordRequirements() {
  return (
    <PasswordRequirementList
      requirements={[
        { id: "length", label: "At least 12 characters", met: true },
        { id: "number", label: "Includes a number", met: true },
        { id: "symbol", label: "Includes a symbol", met: false },
      ]}
    />
  );
}`;
    const usageCode = code;

    return (
        <InputCompositionDocPage
            metadataKey="passwordRequirementList"
            title={metadata.passwordRequirementList.title}
            description={metadata.passwordRequirementList.description}
            embedSrc="/embed/password-requirement-list"
            preview={<PasswordRequirementListDemo />}
            code={code}
            usageCode={usageCode}
            usedComponents={[{ name: "PasswordRequirementList", href: "/docs/components/password-requirement-list" }]}
            relatedComponents={[
                { name: "PasswordGroup", href: "/docs/components/password-group" },
                { name: "PasswordStrengthMeter", href: "/docs/components/password-strength-meter" },
                { name: "PasswordInput", href: "/docs/components/password-input" },
            ]}
            propsData={[
                {
                    name: "requirements",
                    type: "PasswordRequirement[]",
                    description: locale === "ja" ? "表示する要件と達成状態です。" : "Requirements and their current completion state.",
                },
                {
                    name: "metLabel / unmetLabel / pendingLabel",
                    type: "string",
                    description: locale === "ja" ? "各状態の支援技術向けラベルです。" : "Accessible labels for each requirement state.",
                },
            ]}
            states={[
                {
                    key: "mixed",
                    title: locale === "ja" ? "達成と未達成" : "Met and unmet",
                    description: locale === "ja" ? "検証結果をアプリ側で計算し、要件ごとに渡します。" : "Calculate validation in the app and pass it per requirement.",
                    preview: <PasswordRequirementListDemo />,
                    previewHeight: 150,
                    code,
                },
                {
                    key: "pending",
                    title: locale === "ja" ? "未入力" : "Pending",
                    description: locale === "ja" ? "入力前は met を省略して未確認状態にできます。" : "Omit met before input to show a pending state.",
                    preview: (
                        <PasswordRequirementList
                            className="w-full max-w-sm"
                            requirements={[
                                { id: "length", label: locale === "ja" ? "12文字以上" : "At least 12 characters" },
                                { id: "number", label: locale === "ja" ? "数字を含む" : "Includes a number" },
                            ]}
                        />
                    ),
                    previewHeight: 120,
                    code: isJa
                        ? `import { PasswordRequirementList } from "@gunjo/ui";

export function PendingPasswordRequirements() {
  return (
    <PasswordRequirementList
      className="w-full max-w-sm"
      requirements={[
        { id: "length", label: "12文字以上" },
        { id: "number", label: "数字を含む" },
      ]}
    />
  );
}`
                        : `import { PasswordRequirementList } from "@gunjo/ui";

export function PendingPasswordRequirements() {
  return (
    <PasswordRequirementList
      className="w-full max-w-sm"
      requirements={[
        { id: "length", label: "At least 12 characters" },
        { id: "number", label: "Includes a number" },
      ]}
    />
  );
}`,
                },
            ]}
        />
    );
}
