"use client";

import { InputCompositionDocPage } from "@/docs/components/_shared/InputCompositionDocPage";
import { PhoneInputDemo } from "@/components/demos/PhoneInputDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { PhoneInput } from "@gunjo/ui";
import * as React from "react";

/** 米国の 3-3-4。既定は日本の 3-4-4 なので、国を変えるときは整形も差し替えます。 */
function formatUsPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function PhoneInputPage() {
    const { locale } = useLocale();
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const isJa = locale === "ja";
    const code = isJa
        ? `import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  PhoneInput,
} from "@gunjo/ui";

export function ContactPhoneField() {
  const [value, setValue] = React.useState("090-1234-5678");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="phone">電話番号</FormLabel>
      <FormControl>
        <PhoneInput id="phone" value={value} onValueChange={setValue} />
      </FormControl>
      <FormDescription>
        国番号の表示と電話番号の入力補助を組み合わせます。
      </FormDescription>
    </FormGroup>
  );
}`
        : `import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  PhoneInput,
} from "@gunjo/ui";

export function ContactPhoneField() {
  const [value, setValue] = React.useState("090-1234-5678");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="phone">Phone number</FormLabel>
      <FormControl>
        <PhoneInput id="phone" value={value} onValueChange={setValue} />
      </FormControl>
      <FormDescription>
        Combines country calling code and phone input assistance.
      </FormDescription>
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
                    code: isJa
                        ? `import { PhoneInput } from "@gunjo/ui";

export function ManagedContactPhoneField() {
  return (
    <PhoneInput
      className="w-full max-w-sm"
      value="090-1234-5678"
      disabled
      disabledReason="プロフィールで管理されているため、この画面では変更できません。"
      aria-label="電話番号"
    />
  );
}`
                        : `import { PhoneInput } from "@gunjo/ui";

export function ManagedContactPhoneField() {
  return (
    <PhoneInput
      className="w-full max-w-sm"
      value="090-1234-5678"
      disabled
      disabledReason="Managed in the profile and cannot be changed here."
      aria-label="Phone number"
    />
  );
}`,
                },
                {
                    key: "other-country",
                    title: locale === "ja" ? "日本以外の番号を受ける" : "Accepting a number from another country",
                    description: locale === "ja"
                        ? "国番号は countryCallingCode と countryLabel、区切りの位置は formatValue で決まります。既定の 3-4-4 は日本の形なので、他の国を受けるなら3つとも差し替えます。"
                        : "countryCallingCode and countryLabel set the code; formatValue sets where the dashes fall. The 3-4-4 default is the Japanese shape, so another country means replacing all three.",
                    preview: (
                        <PhoneInput
                            className="w-full max-w-sm"
                            value="415-555-0123"
                            countryCallingCode="+1"
                            countryLabel="United States"
                            formatValue={formatUsPhone}
                            aria-label={locale === "ja" ? "電話番号（米国）" : "Phone number (US)"}
                        />
                    ),
                    previewHeight: 100,
                    code: isJa
                        ? `import { PhoneInput } from "@gunjo/ui";

// 米国の 3-3-4。既定は日本の 3-4-4 なので置き換えます。
function formatUsPhone(value) {
  const digits = value.replace(/\\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return digits.slice(0, 3) + "-" + digits.slice(3);
  return digits.slice(0, 3) + "-" + digits.slice(3, 6) + "-" + digits.slice(6);
}

export function UsContactPhoneField() {
  return (
    <PhoneInput
      className="w-full max-w-sm"
      value="415-555-0123"
      countryCallingCode="+1"
      countryLabel="United States"
      formatValue={formatUsPhone}
      aria-label="電話番号（米国）"
    />
  );
}`
                        : `import { PhoneInput } from "@gunjo/ui";

// The US 3-3-4 shape. The default is the Japanese 3-4-4, so replace it.
function formatUsPhone(value) {
  const digits = value.replace(/\\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return digits.slice(0, 3) + "-" + digits.slice(3);
  return digits.slice(0, 3) + "-" + digits.slice(3, 6) + "-" + digits.slice(6);
}

export function UsContactPhoneField() {
  return (
    <PhoneInput
      className="w-full max-w-sm"
      value="415-555-0123"
      countryCallingCode="+1"
      countryLabel="United States"
      formatValue={formatUsPhone}
      aria-label="Phone number (US)"
    />
  );
}`,
                },
            ]}
        />
    );
}
