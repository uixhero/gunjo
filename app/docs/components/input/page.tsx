"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import inputsMetadata from "@design/inputs-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import {
    Button,
    Form,
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
    FormMessage,
    Input,
} from "@gunjo/ui";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";

const meta = inputsMetadata as Record<string, { title: string; description: string }>;

export default function InputPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/input", locale);
    const title = content?.title ?? meta.input.title;
    const description = content?.description ?? meta.input.description;
    const emailLabel = locale === "ja" ? "メールアドレス" : "Email";
    const submitLabel = locale === "ja" ? "登録する" : "Subscribe";
    const helpText = locale === "ja" ? "アカウントと通知の更新に使います。" : "Used for account and notification updates.";
    const invalidMessage = locale === "ja" ? "有効なメールアドレスを入力してください。" : "Please enter a valid email address.";
    const disabledReason = locale === "ja" ? "このアカウントは組織によって管理されています。" : "This account is managed by your organization.";

    const code = `import { Button, Form, FormControl, FormDescription, FormGroup, FormLabel, FormMessage, Input } from "@gunjo/ui"

export function InputDemo() {
  return (
	    <Form className="w-full max-w-sm">
	      <FormGroup>
	        <FormLabel htmlFor="email">${emailLabel}</FormLabel>
	        <FormControl>
	          <Input type="email" id="email" defaultValue="not-an-email" aria-invalid />
	        </FormControl>
	        <FormDescription>${helpText}</FormDescription>
	        <FormMessage>${invalidMessage}</FormMessage>
	      </FormGroup>
	      <Button type="submit" className="w-full">${submitLabel}</Button>
	    </Form>
	  )
	}`

    const usageCode = `import { FormControl, FormDescription, FormGroup, FormLabel, Input } from "@gunjo/ui"

export function LoginInput() {
  return (
	    <FormGroup className="w-full max-w-sm">
	      <FormLabel htmlFor="email">${emailLabel}</FormLabel>
	      <FormControl>
	        <Input type="email" id="email" placeholder="name@example.com" />
	      </FormControl>
	      <FormDescription>${locale === "ja" ? "アカウントに紐づくメールアドレスを入力します。" : "Use the address tied to your account."}</FormDescription>
	    </FormGroup>
	  )
	}`

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Input", href: "/docs/components/input" },
                { name: "FormGroup", href: "/docs/components/form" },
                { name: "FormLabel", href: "/docs/components/form" },
                { name: "FormControl", href: "/docs/components/form" },
                { name: "FormDescription", href: "/docs/components/form" },
                { name: "FormMessage", href: "/docs/components/form" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "Textarea", href: "/docs/components/textarea" },
                { name: "Select", href: "/docs/components/select" },
                { name: "PasswordInput", href: "/docs/components/password-input" },
                { name: "NumberInput", href: "/docs/components/number-input" },
                { name: "SearchInput", href: "/docs/components/search-input" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/input" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="md">
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                    className="w-full max-w-sm"
                >
                    <FormGroup>
                        <FormLabel htmlFor="email">{emailLabel}</FormLabel>
                        <FormControl>
                            <Input
                                type="email"
                                id="email"
                                defaultValue="not-an-email"
                                aria-invalid="true"
                                className="border-destructive ring-destructive focus-visible:ring-destructive"
                            />
                        </FormControl>
                        <FormDescription>{helpText}</FormDescription>
                        <FormMessage>{invalidMessage}</FormMessage>
                    </FormGroup>
                    <Button type="submit" className="w-full">{submitLabel}</Button>
                </Form>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "with-label",
                            title: locale === "ja" ? "ラベル付き" : "With Label",
                            description:
                                locale === "ja"
                                    ? "アクセシブルにする最小構成です。ラベルと入力欄の ID を紐づけます。"
                                    : "Minimum accessible setup — bind a Label to the input via htmlFor.",
	                            preview: (
	                                <FormGroup className="w-full max-w-sm">
                                    <FormLabel htmlFor="email-state">{emailLabel}</FormLabel>
                                    <FormControl>
                                        <Input type="email" id="email-state" placeholder="you@example.com" />
                                    </FormControl>
	                                </FormGroup>
	                            ),
	                            previewHeight: 160,
	                            code: `import { FormControl, FormGroup, FormLabel, Input } from "@gunjo/ui";

export default function EmailField() {
  return (
    <FormGroup className="w-full max-w-sm">
	      <FormLabel htmlFor="email">${emailLabel}</FormLabel>
      <FormControl>
        <Input type="email" id="email" placeholder="you@example.com" />
      </FormControl>
    </FormGroup>
  );
}`,
                        },
                        {
                            key: "invalid",
                            title:
                                locale === "ja"
                                    ? "バリデーションエラー"
                                    : "Validation error",
                            description:
                                locale === "ja"
                                    ? "エラー状態を付与すると、入力欄の輪郭が警告色になります。エラーメッセージは入力欄の直下に置きます。"
                                    : "Set aria-invalid to make the ring switch to destructive. Place the error message directly below the field.",
	                            preview: (
	                                <FormGroup className="w-full max-w-sm">
	                                    <FormLabel htmlFor="email-invalid">{emailLabel}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            id="email-invalid"
                                            defaultValue="not-an-email"
                                            aria-invalid="true"
                                            className="border-destructive ring-destructive focus-visible:ring-destructive"
                                        />
                                    </FormControl>
	                                    <FormMessage>{invalidMessage}</FormMessage>
	                                </FormGroup>
	                            ),
	                            previewHeight: 180,
	                            code: `import { FormControl, FormGroup, FormLabel, FormMessage, Input } from "@gunjo/ui";

export default function InvalidEmail() {
  return (
    <FormGroup className="w-full max-w-sm">
	      <FormLabel htmlFor="email">${emailLabel}</FormLabel>
      <FormControl>
        <Input
          type="email"
          id="email"
          defaultValue="not-an-email"
          aria-invalid
          className="border-destructive ring-destructive focus-visible:ring-destructive"
        />
      </FormControl>
	      <FormMessage>${invalidMessage}</FormMessage>
    </FormGroup>
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description:
                                locale === "ja"
                                    ? "編集できない時の状態です。理由はフィールド上のツールチップと補助テキストで補足します。"
                                    : "When the field can't be edited. Surface the reason through a field tooltip and helper text.",
	                            preview: (
	                                <FormGroup className="w-full max-w-sm">
	                                    <FormLabel htmlFor="email-disabled">{emailLabel}</FormLabel>
                                    <FormControl>
                                        <DisabledReasonTooltip fullWidth reason={disabledReason}>
                                            <Input
                                                type="email"
                                                id="email-disabled"
                                                defaultValue="user@locked.com"
                                                disabled
                                            />
                                        </DisabledReasonTooltip>
                                    </FormControl>
	                                    <FormDescription>{disabledReason}</FormDescription>
	                                </FormGroup>
	                            ),
	                            previewHeight: 180,
	                            code: `import { FormControl, FormDescription, FormGroup, FormLabel, Input, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export default function DisabledEmail() {
  return (
    <FormGroup className="w-full max-w-sm">
	      <FormLabel htmlFor="email">${emailLabel}</FormLabel>
      <FormControl>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Input type="email" id="email" defaultValue="user@locked.com" disabled />
            </span>
          </TooltipTrigger>
          <TooltipContent>${disabledReason}</TooltipContent>
        </Tooltip>
      </FormControl>
      <FormDescription>
	        ${disabledReason}
      </FormDescription>
    </FormGroup>
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">{sectionLabels.props}</h2>
                <PropsTable
                    data={[
	                        {
	                            name: "type",
	                            type: "string",
	                            description: locale === "ja" ? "テキスト、メールアドレス、パスワードなど、入力欄の種類を指定します。" : "The type of input, such as text, email, or password.",
	                        },
	                        {
	                            name: "placeholder",
	                            type: "string",
	                            description: locale === "ja" ? "未入力時に入力欄内へ表示する補助テキストです。" : "Placeholder text shown when the field is empty.",
	                        },
	                        {
	                            name: "disabled",
	                            type: "boolean",
	                            description: locale === "ja" ? "入力できない状態にします。" : "Whether the input is disabled.",
	                        },
                            {
                                name: "className",
                                type: "string",
                                description: locale === "ja" ? "Input はデフォルトで親幅いっぱいに広がります。幅は FormGroup や外側の max-w-* で制約します。" : "Input fills its parent by default. Constrain width on FormGroup or an outer max-w-* wrapper.",
                            },
                    ]}
                />
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
