"use client";

import { InputCompositionDocPage } from "@/docs/components/_shared/InputCompositionDocPage";
import { PhoneInputDemo } from "@/components/demos/PhoneInputDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { PhoneInput } from "@gunjo/ui";
import * as React from "react";

export default function PhoneInputPage() {
    const { locale } = useLocale();
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const code = `import * as React from "react";
import { FormControl, FormDescription, FormGroup, FormLabel, PhoneInput } from "@gunjo/ui";

export function PhoneInputDemo() {
  const [value, setValue] = React.useState("090-1234-5678");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="phone">${locale === "ja" ? "電話番号" : "Phone number"}</FormLabel>
      <FormControl>
        <PhoneInput id="phone" value={value} onValueChange={setValue} />
      </FormControl>
      <FormDescription>${locale === "ja" ? "国番号の表示と電話番号の入力補助を組み合わせます。" : "Combines country calling code and phone input assistance."}</FormDescription>
    </FormGroup>
  );
}`;
    const disabledReason = locale === "ja" ? "プロフィールで管理されているため、この画面では変更できません。" : "Managed in the profile and cannot be changed here.";

    function DisabledPreview() {
        return <PhoneInput className="w-full max-w-sm" value="090-1234-5678" disabled disabledReason={disabledReason} aria-label={locale === "ja" ? "電話番号" : "Phone number"} />;
    }

    return (
        <InputCompositionDocPage
            metadataKey="phoneInput"
            title={metadata.phoneInput.title}
            description={metadata.phoneInput.description}
            embedSrc="/embed/phone-input"
            preview={<PhoneInputDemo />}
            code={code}
            usageCode={code}
            usedComponents={[
                { name: "PhoneInput", href: "/docs/components/phone-input" },
                { name: "Input", href: "/docs/components/input" },
                { name: "Form", href: "/docs/components/form" },
            ]}
            relatedComponents={[
                { name: "PostalCodeInput", href: "/docs/components/postal-code-input" },
                { name: "Input", href: "/docs/components/input" },
            ]}
            propsData={[
                {
                    name: "value / defaultValue / onValueChange",
                    type: "string / (value) => void",
                    description: locale === "ja" ? "電話番号の値を制御します。" : "Controls the phone-number value.",
                },
                {
                    name: "countryCallingCode / countryLabel",
                    type: "string / ReactNode",
                    default: '"+81" / "Japan"',
                    description: locale === "ja" ? "国番号の表示と支援技術向けラベルです。" : "Calling-code display and accessible country label.",
                },
                {
                    name: "formatValue",
                    type: "(value: string) => string",
                    description: locale === "ja" ? "入力値の整形関数です。国際番号などはここで差し替えます。" : "Formatter hook for product-specific or international phone values.",
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
                    title: locale === "ja" ? "標準表示" : "Standard",
                    description: locale === "ja" ? "日本の国番号と電話番号入力を組み合わせます。" : "Combines Japanese calling code and phone input.",
                    preview: <PhoneInputDemo />,
                    previewHeight: 170,
                    code,
                },
                {
                    key: "disabled",
                    title: locale === "ja" ? "無効化" : "Disabled",
                    description: locale === "ja" ? "値を参照だけにする場合は disabled と disabledReason を渡します。" : "Use disabled and disabledReason when the value is read-only.",
                    preview: <DisabledPreview />,
                    previewHeight: 100,
                    code: `<PhoneInput value="090-1234-5678" disabled disabledReason="${disabledReason}" />`,
                },
            ]}
        />
    );
}
