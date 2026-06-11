"use client";

import { InputCompositionDocPage } from "@/docs/components/_shared/InputCompositionDocPage";
import { PostalCodeInputDemo } from "@/components/demos/PostalCodeInputDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { PostalCodeInput } from "@gunjo/ui";

export default function PostalCodeInputPage() {
    const { locale } = useLocale();
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const code = `import * as React from "react";
import { FormControl, FormDescription, FormGroup, FormLabel, PostalCodeInput } from "@gunjo/ui";

export function PostalCodeInputDemo() {
  const [value, setValue] = React.useState("150-0001");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="postal-code">${locale === "ja" ? "郵便番号" : "Postal code"}</FormLabel>
      <FormControl>
        <PostalCodeInput id="postal-code" value={value} onValueChange={setValue} />
      </FormControl>
      <FormDescription>${locale === "ja" ? "住所補完は上位で接続します。" : "Connect address lookup above this input."}</FormDescription>
    </FormGroup>
  );
}`;

    return (
        <InputCompositionDocPage
            metadataKey="postalCodeInput"
            title={metadata.postalCodeInput.title}
            description={metadata.postalCodeInput.description}
            embedSrc="/embed/postal-code-input"
            preview={<PostalCodeInputDemo />}
            code={code}
            usageCode={code}
            usedComponents={[
                { name: "PostalCodeInput", href: "/docs/components/postal-code-input" },
                { name: "Input", href: "/docs/components/input" },
                { name: "Form", href: "/docs/components/form" },
            ]}
            relatedComponents={[
                { name: "PhoneInput", href: "/docs/components/phone-input" },
                { name: "Input", href: "/docs/components/input" },
            ]}
            propsData={[
                {
                    name: "value / defaultValue / onValueChange",
                    type: "string / (value) => void",
                    description: locale === "ja" ? "郵便番号の値を制御します。" : "Controls the postal-code value.",
                },
                {
                    name: "prefix",
                    type: "ReactNode",
                    default: '"〒"',
                    description: locale === "ja" ? "入力欄の先頭に表示する補助記号です。" : "Prefix affordance shown before the input.",
                },
                {
                    name: "formatValue",
                    type: "(value: string) => string",
                    description: locale === "ja" ? "入力値の整形関数です。既定では 3桁-4桁に整形します。" : "Formatter hook. The default formats Japanese 3-4 postal codes.",
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
                    description: locale === "ja" ? "3桁-4桁の郵便番号として入力を整形します。" : "Formats input as a 3-4 postal code.",
                    preview: <PostalCodeInputDemo />,
                    previewHeight: 170,
                    code,
                },
                {
                    key: "without-prefix",
                    title: locale === "ja" ? "接頭辞なし" : "Without prefix",
                    description: locale === "ja" ? "表組みなど、文脈上 prefix が不要な場合は空にできます。" : "Remove the prefix when surrounding context already explains the value.",
                    preview: <PostalCodeInput className="w-full max-w-sm" value="150-0001" prefix={null} aria-label={locale === "ja" ? "郵便番号" : "Postal code"} />,
                    previewHeight: 100,
                    code: `<PostalCodeInput value="150-0001" prefix={null} />`,
                },
            ]}
        />
    );
}
