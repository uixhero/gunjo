"use client";

import * as React from "react";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import inputsMetadata from "@design/inputs-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import {
    Button,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormGroup,
    FormLabel,
    FormMessage,
    Input,
    Spinner,
    Textarea,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";

function ValidatedSignupForm({ locale }: { locale: "ja" | "en" }) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);

    const emailError = submitted && !email.includes("@")
        ? locale === "ja" ? "有効なメールアドレスを入力してください。" : "Please enter a valid email address."
        : null;
    const passwordError =
        submitted && password.length < 8
            ? locale === "ja" ? "パスワードは8文字以上で入力してください。" : "Password must be at least 8 characters."
            : null;

    return (
        <Form
            className="w-full max-w-sm"
            onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
            }}
        >
            <FormGroup>
                <FormLabel htmlFor="signup-email">{locale === "ja" ? "メールアドレス" : "Email"}</FormLabel>
                <FormControl>
                    <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        placeholder="you@example.com"
                        aria-invalid={emailError ? "true" : undefined}
                    />
                </FormControl>
                {emailError ? <FormMessage>{emailError}</FormMessage> : null}
            </FormGroup>
            <FormGroup>
                <FormLabel htmlFor="signup-password">{locale === "ja" ? "パスワード" : "Password"}</FormLabel>
                <FormControl>
                    <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        aria-invalid={passwordError ? "true" : undefined}
                    />
                </FormControl>
                <FormDescription>{locale === "ja" ? "8文字以上で入力してください。" : "At least 8 characters."}</FormDescription>
                {passwordError ? <FormMessage>{passwordError}</FormMessage> : null}
            </FormGroup>
            <Button type="submit" className="w-full">{locale === "ja" ? "アカウントを作成" : "Create account"}</Button>
        </Form>
    );
}

function PendingSubmitForm({ locale }: { locale: "ja" | "en" }) {
    const [submitting, setSubmitting] = React.useState(false);
    return (
        <Form
            className="w-full max-w-sm"
            onSubmit={(e) => {
                e.preventDefault();
                setSubmitting(true);
                window.setTimeout(() => setSubmitting(false), 2000);
            }}
        >
            <FormGroup>
                <FormLabel htmlFor="feedback">{locale === "ja" ? "フィードバック" : "Feedback"}</FormLabel>
                <FormControl>
                    <Textarea
                        id="feedback"
                        rows={3}
                        defaultValue={locale === "ja" ? "新しいダッシュボードが使いやすいです。" : "Loving the new dashboard!"}
                    />
                </FormControl>
                <FormDescription>{locale === "ja" ? "すべてのメッセージを確認します。" : "We read every message."}</FormDescription>
            </FormGroup>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="inline-flex w-full" tabIndex={submitting ? 0 : -1}>
                        <Button type="submit" disabled={submitting} className="gap-2 w-full">
                            {submitting ? (
                                <>
                                    <Spinner size="sm" />
                                    {locale === "ja" ? "送信中..." : "Sending..."}
                                </>
                            ) : (
                                locale === "ja" ? "送信" : "Send feedback"
                            )}
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    {locale === "ja" ? "送信処理が完了するまで再送信できません。" : "You can send again after this submission finishes."}
                </TooltipContent>
            </Tooltip>
        </Form>
    );
}

export default function FormPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/form", locale);
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const emailLabel = locale === "ja" ? "メールアドレス" : "Email";
    const nameLabel = locale === "ja" ? "名前" : "Name";
    const helpText = locale === "ja" ? "メールアドレスを共有することはありません。" : "We'll never share your email.";
    const errorText = locale === "ja" ? "メールアドレスは必須です。" : "Email is required.";
    const submitText = locale === "ja" ? "送信" : "Submit";
    const saveText = locale === "ja" ? "保存" : "Save";
    const code = `import {
    Form,
    FormGroup,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    Input,
    Button,
} from "@gunjo/ui";

export function FormFieldDemo() {
    return (
        <Form className="w-full max-w-sm">
            <FormGroup>
                <FormLabel htmlFor="email">${emailLabel}</FormLabel>
                <FormControl>
                    <Input id="email" type="email" placeholder="name@example.com" />
                </FormControl>
                <FormDescription>${helpText}</FormDescription>
                <FormMessage>${errorText}</FormMessage>
            </FormGroup>
            <Button type="submit" className="w-full">${submitText}</Button>
        </Form>
    );
}`;

    const usageCode = `import { Form, FormGroup, FormLabel, FormControl, Input, Button } from "@gunjo/ui"

export function FormUsage() {
  return (
    <Form className="w-full max-w-sm">
      <FormGroup>
        <FormLabel htmlFor="name">${nameLabel}</FormLabel>
        <FormControl>
          <Input id="name" />
        </FormControl>
      </FormGroup>
      <Button type="submit" className="w-full">${saveText}</Button>
    </Form>
  );
}`;

    const propsData = [
        {
            name: "(Form)",
            type: "FormHTMLAttributes<HTMLFormElement>",
            default: "—",
            description: locale === "ja" ? "最上位のフォーム要素です。送信時の処理などを渡します。" : "Top-level form wrapper. Pass onSubmit, etc.",
        },
        {
            name: "(FormField)",
            type: "HTMLAttributes<HTMLDivElement>",
            default: "—",
            description: locale === "ja" ? "ラベル、入力欄、補助テキストをまとめる 1 行分のコンテナです。" : "Container for one form row: label, control, and helpers.",
        },
        {
            name: "(FormGroup)",
            type: "HTMLAttributes<HTMLDivElement>",
            default: "—",
            description:
                locale === "ja"
                    ? "アプリ内フォーム向けのコンパクトな行です。余白を抑え、入力欄やテキストエリアをグループ幅に揃えます。"
                    : "Compact form row for app forms. It removes field padding and stretches Input/Textarea controls to the group width.",
        },
        {
            name: "(FormLabel)",
            type: "LabelHTMLAttributes<HTMLLabelElement>",
            default: "—",
            description: locale === "ja" ? "入力欄のラベルです。対応する入力欄の ID と紐づけます。" : "Field label. Use htmlFor to bind to the control id.",
        },
        {
            name: "(FormControl)",
            type: "HTMLAttributes<HTMLDivElement>",
            default: "—",
            description: locale === "ja" ? "入力欄、選択欄、テキストエリアなど、実際の入力 UI を包みます。" : "Wrapper for the actual input, select, textarea, etc.",
        },
        {
            name: "(FormDescription)",
            type: "HTMLAttributes<HTMLParagraphElement>",
            default: "—",
            description: locale === "ja" ? "入力欄の下に表示する補助テキストです。" : "Helper text below the control.",
        },
        {
            name: "(FormMessage)",
            type: "HTMLAttributes<HTMLParagraphElement>",
            default: "—",
            description: locale === "ja" ? "入力内容の問題を伝えるメッセージです。警告色で表示されます。" : "Validation message, styled in destructive color.",
        },
    ];

    return (
        <ComponentLayout
            title={content?.title ?? metadata.form.title}
            description={content?.description ?? metadata.form.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Form", href: "/docs/components/form" },
                { name: "FormGroup", href: "/docs/components/form" },
                { name: "FormField", href: "/docs/components/form" },
                { name: "FormLabel", href: "/docs/components/form" },
                { name: "FormControl", href: "/docs/components/form" },
                { name: "FormDescription", href: "/docs/components/form" },
                { name: "FormMessage", href: "/docs/components/form" },
            ]}
            relatedComponents={[
                { name: "Input", href: "/docs/components/input" },
                { name: "Textarea", href: "/docs/components/textarea" },
                { name: "Select", href: "/docs/components/select" },
                { name: "Button", href: "/docs/components/button" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/form" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels}>
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                    className="w-full max-w-sm"
                >
                    <FormGroup>
                        <FormLabel htmlFor="email">{emailLabel}</FormLabel>
                        <FormControl>
                            <Input id="email" type="email" placeholder="name@example.com" />
                        </FormControl>
                        <FormDescription>{helpText}</FormDescription>
                        <FormMessage>{errorText}</FormMessage>
                    </FormGroup>
                    <Button type="submit" className="w-full">{submitText}</Button>
                </Form>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "client-validation",
                            title: locale === "ja" ? "送信時の入力確認" : "Client-side validation on submit",
                            description:
                                locale === "ja"
                                    ? "入力内容の問題は警告色のメッセージで表示し、入力欄にもエラー状態を付与します。入力中ではなく送信時に検証すると、不要なエラー表示を減らせます。"
                                    : "FormMessage renders in destructive color and pairs with aria-invalid on the control. Validate on submit, not on every keystroke to reduce false negatives.",
	                            preview: <ValidatedSignupForm locale={locale} />,
	                            previewHeight: 360,
	                            code: `import * as React from "react";
import { Button, Form, FormControl, FormDescription, FormGroup, FormLabel, FormMessage, Input } from "@gunjo/ui";

export default function SignupForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const emailError = submitted && !email.includes("@") ? "Please enter a valid email address." : null;
  const passwordError = submitted && password.length < 8 ? "Password must be at least 8 characters." : null;

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <FormGroup>
        <FormLabel htmlFor="email">Email</FormLabel>
        <FormControl>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            aria-invalid={emailError ? "true" : undefined}
          />
        </FormControl>
        {emailError ? <FormMessage>{emailError}</FormMessage> : null}
      </FormGroup>
      <FormGroup>
        <FormLabel htmlFor="password">Password</FormLabel>
        <FormControl>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            aria-invalid={passwordError ? "true" : undefined}
          />
        </FormControl>
        <FormDescription>At least 8 characters.</FormDescription>
        {passwordError ? <FormMessage>{passwordError}</FormMessage> : null}
      </FormGroup>
      <Button type="submit" className="w-full">Create account</Button>
    </Form>
  );
}`,
                        },
                        {
                            key: "pending",
                            title: locale === "ja" ? "送信中" : "Submitting / pending state",
                            description:
                                locale === "ja"
                                    ? "送信中はボタンを無効化し、読み込みアイコンと状態テキストに切り替えます。"
                                    : "Disable the submit button and swap its label for Spinner + status text while the request is in flight.",
	                            preview: <PendingSubmitForm locale={locale} />,
	                            previewHeight: 320,
	                            code: `import * as React from "react";
import { Button, Form, FormControl, FormDescription, FormGroup, FormLabel, Spinner, Textarea, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export default function FeedbackForm() {
  const [submitting, setSubmitting] = React.useState(false);
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitting(true);
        window.setTimeout(() => setSubmitting(false), 2000);
      }}
    >
      <FormGroup>
        <FormLabel htmlFor="feedback">Feedback</FormLabel>
        <FormControl>
          <Textarea id="feedback" rows={3} />
        </FormControl>
        <FormDescription>We read every message.</FormDescription>
      </FormGroup>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex w-full" tabIndex={submitting ? 0 : -1}>
            <Button type="submit" disabled={submitting} className="gap-2 w-full">
              {submitting ? (
                <>
                  <Spinner size="sm" />
                  Sending
                </>
              ) : (
                "Send feedback"
              )}
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>You can send again after this submission finishes.</TooltipContent>
      </Tooltip>
    </Form>
  );
}`,
                        },
                    ]}
                />
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
