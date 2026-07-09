"use client";

import * as React from "react";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import {
    FormDescription,
    FormGroup,
    FormLabel,
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@gunjo/ui";

function OTPField({
    locale,
    grouped = true,
    disabled = false,
    defaultValue = "",
}: {
    locale: "ja" | "en";
    grouped?: boolean;
    disabled?: boolean;
    defaultValue?: string;
}) {
    const [value, setValue] = React.useState(defaultValue);
    const disabledReason = locale === "ja"
        ? "確認コードを再送信するまで入力できません。"
        : "Disabled until the verification code is resent.";
    const otp = (
        <InputOTP maxLength={6} value={value} onChange={setValue} disabled={disabled}>
            {grouped ? (
                <>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </>
            ) : (
                <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot key={index} index={index} />
                    ))}
                </InputOTPGroup>
            )}
        </InputOTP>
    );

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel>{locale === "ja" ? "確認コード" : "Verification code"}</FormLabel>
            {disabled ? (
                <DisabledReasonTooltip reason={disabledReason} className="w-fit">
                    {otp}
                </DisabledReasonTooltip>
            ) : otp}
            <FormDescription>
                {disabled
                    ? locale === "ja"
                        ? "確認コードを再送信するまで入力できません。"
                        : "Disabled until the verification code is resent."
                    : value
                        ? locale === "ja"
                            ? `入力値: ${value}`
                            : `Value: ${value}`
                        : locale === "ja"
                            ? "6桁の確認コードを入力します。"
                            : "Enter the 6-digit verification code."}
            </FormDescription>
        </FormGroup>
    );
}

export default function InputOTPPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/input-otp", locale);
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;

    const code = `import * as React from "react";
import {
  FormDescription,
  FormGroup,
  FormLabel,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@gunjo/ui";

export function InputOTPDemo() {
  const [value, setValue] = React.useState("");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel>${locale === "ja" ? "確認コード" : "Verification code"}</FormLabel>
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <FormDescription>
        ${locale === "ja" ? "6桁の確認コードを入力します。" : "Enter the 6-digit verification code."}
      </FormDescription>
    </FormGroup>
  );
}`;

    const usageCode = `import { InputOTP, InputOTPGroup, InputOTPSlot } from "@gunjo/ui";

<InputOTP maxLength={6} value={code} onChange={setCode}>
  <InputOTPGroup>
    {[0, 1, 2, 3, 4, 5].map((index) => (
      <InputOTPSlot key={index} index={index} />
    ))}
  </InputOTPGroup>
</InputOTP>`;

    const propsData = [
        {
            name: "InputOTP.maxLength",
            type: "number",
            description: locale === "ja" ? "入力できる総桁数です。6桁コードなら 6 を指定します。" : "Total number of slots, such as 6 for a 6-digit code.",
            default: "-",
        },
        {
            name: "InputOTP.value",
            type: "string",
            description: locale === "ja" ? "外部で管理する入力値です。" : "Controlled value.",
            default: "-",
        },
        {
            name: "InputOTP.onChange",
            type: "(value: string) => void",
            description: locale === "ja" ? "入力値が変わった時に呼ばれる処理です。" : "Callback when the value changes.",
            default: "-",
        },
        {
            name: "InputOTPSlot.index",
            type: "number",
            description: locale === "ja" ? "0 から始まる入力枠の番号です。必須です。" : "Zero-based slot index. Required.",
            default: "-",
        },
        {
            name: "InputOTPSeparator",
            type: "ReactNode",
            description: locale === "ja" ? "入力枠のグループ間に表示する区切りです。" : "Visual separator between slot groups.",
            default: "-",
        },
    ];

    return (
        <ComponentLayout
            title={content?.title ?? metadata.inputOTP.title}
            description={content?.description ?? metadata.inputOTP.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "InputOTP", href: "/docs/components/input-otp" },
                { name: "InputOTPGroup", href: "/docs/components/input-otp" },
                { name: "InputOTPSlot", href: "/docs/components/input-otp" },
                { name: "InputOTPSeparator", href: "/docs/components/input-otp" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
                { name: "FormGroup", href: "/docs/components/form" },
                { name: "FormLabel", href: "/docs/components/form" },
                { name: "FormDescription", href: "/docs/components/form" },
            ]}
            relatedComponents={[
                { name: "Input", href: "/docs/components/input" },
                { name: "PasswordInput", href: "/docs/components/password-input" },
                { name: "Form", href: "/docs/components/form" },
                { name: "NumberInput", href: "/docs/components/number-input" },
            ]}
        >
            <ComponentPreview
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewHeight="auto"
                previewBodyWidth="md"
            >
                <OTPField locale={locale} />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "grouped",
                            title: locale === "ja" ? "3桁ごとの区切り" : "Grouped slots",
                            description: locale === "ja" ? "視認性を上げるため、3桁ごとに区切りを入れます。" : "Use a separator to improve readability for grouped codes.",
                            preview: <OTPField locale={locale} defaultValue="123" />,
                            code: code.replace('React.useState("");', 'React.useState("123");'),
                        },
                        {
                            key: "plain",
                            title: locale === "ja" ? "連続した6桁" : "Continuous slots",
                            description: locale === "ja" ? "短いコードでは、区切りなしで横一列に並べられます。" : "Short codes can be displayed in a single continuous group.",
                            preview: <OTPField locale={locale} grouped={false} defaultValue="2468" />,
                            code: `import * as React from "react";
import { FormDescription, FormGroup, FormLabel, InputOTP, InputOTPGroup, InputOTPSlot } from "@gunjo/ui";

export function ContinuousInputOTP() {
  const [value, setValue] = React.useState("2468");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel>${locale === "ja" ? "確認コード" : "Verification code"}</FormLabel>
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <FormDescription>
        ${locale === "ja" ? "入力値: 2468" : "Value: 2468"}
      </FormDescription>
    </FormGroup>
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "再送信待ちや期限切れでは操作を無効化し、ツールチップで理由を補足します。" : "Disable the input while waiting for resend or when a code expires, and explain the reason with a Tooltip.",
                            preview: <OTPField locale={locale} disabled defaultValue="123456" />,
                            code: `import { FormDescription, FormGroup, FormLabel, InputOTP, InputOTPGroup, InputOTPSlot, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export function DisabledCode() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel>${locale === "ja" ? "確認コード" : "Verification code"}</FormLabel>
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <InputOTP maxLength={6} disabled value="123456">
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </span>
        </TooltipTrigger>
        <TooltipContent>${locale === "ja" ? "確認コードを再送信するまで入力できません。" : "Disabled until the verification code is resent."}</TooltipContent>
      </Tooltip>
      <FormDescription>
        ${locale === "ja" ? "確認コードを再送信するまで入力できません。" : "Disabled until the verification code is resent."}
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
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </section>
        </ComponentLayout>
    );
}
