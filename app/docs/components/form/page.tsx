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
            {submitting ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="inline-flex w-full" tabIndex={0}>
                            <Button type="submit" disabled className="w-full gap-2">
                                <Spinner size="sm" />
                                {locale === "ja" ? "送信中..." : "Sending..."}
                            </Button>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        {locale === "ja" ? "送信処理が完了するまで再送信できません。" : "You can send again after this submission finishes."}
                    </TooltipContent>
                </Tooltip>
            ) : (
                <Button type="submit" className="w-full">{locale === "ja" ? "送信" : "Send feedback"}</Button>
            )}
        </Form>
    );
}

/** FormField に結線を任せる形。id と aria の対応を自分で書かない。 */
function WiredFieldForm({ locale }: { locale: "ja" | "en" }) {
    const isJa = locale === "ja";
    const [company, setCompany] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);
    const error =
        submitted && company.trim() === ""
            ? isJa
                ? "会社名を入力してください。"
                : "Enter your company name."
            : undefined;

    return (
        <Form
            className="w-full max-w-sm"
            onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
            }}
        >
            <FormField required error={error} className="p-0">
                <FormLabel>{isJa ? "会社名" : "Company"}</FormLabel>
                <FormControl>
                    <Input
                        value={company}
                        onChange={(e) => setCompany(e.currentTarget.value)}
                        placeholder={isJa ? "協栄精密工業" : "Kyoei Precision"}
                    />
                </FormControl>
                <FormDescription>
                    {isJa ? "請求書に印字される名義です。" : "The name printed on the invoice."}
                </FormDescription>
                <FormMessage />
            </FormField>
            <Button type="submit" className="w-full">
                {isJa ? "登録する" : "Register"}
            </Button>
        </Form>
    );
}

export default function FormPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/form", locale);
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const emailLabel = locale === "ja" ? "メールアドレス" : "Email";
    const nameLabel = locale === "ja" ? "名前" : "Name";
    const passwordLabel = locale === "ja" ? "パスワード" : "Password";
    const feedbackLabel = locale === "ja" ? "フィードバック" : "Feedback";
    const helpText = locale === "ja" ? "メールアドレスを共有することはありません。" : "We'll never share your email.";
    const errorText = locale === "ja" ? "メールアドレスは必須です。" : "Email is required.";
    const submitText = locale === "ja" ? "送信" : "Submit";
    const saveText = locale === "ja" ? "保存" : "Save";
    const createAccountText = locale === "ja" ? "アカウントを作成" : "Create account";
    const passwordHelpText = locale === "ja" ? "8文字以上で入力してください。" : "At least 8 characters.";
    const invalidEmailText = locale === "ja" ? "有効なメールアドレスを入力してください。" : "Please enter a valid email address.";
    const passwordLengthText = locale === "ja" ? "パスワードは8文字以上で入力してください。" : "Password must be at least 8 characters.";
    const feedbackHelpText = locale === "ja" ? "すべてのメッセージを確認します。" : "We read every message.";
    const sendFeedbackText = locale === "ja" ? "送信" : "Send feedback";
    const sendingText = locale === "ja" ? "送信中..." : "Sending...";
    const pendingReason = locale === "ja" ? "送信処理が完了するまで再送信できません。" : "You can send again after this submission finishes.";
    const code = locale === "ja"
        ? `import {
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
                <FormLabel htmlFor="email">メールアドレス</FormLabel>
                <FormControl>
                    <Input id="email" type="email" placeholder="name@example.com" />
                </FormControl>
                <FormDescription>メールアドレスを共有することはありません。</FormDescription>
                <FormMessage>メールアドレスは必須です。</FormMessage>
            </FormGroup>
            <Button type="submit" className="w-full">送信</Button>
        </Form>
    );
}`
        : `import {
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
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                    <Input id="email" type="email" placeholder="name@example.com" />
                </FormControl>
                <FormDescription>We'll never share your email.</FormDescription>
                <FormMessage>Email is required.</FormMessage>
            </FormGroup>
            <Button type="submit" className="w-full">Submit</Button>
        </Form>
    );
}`;

    const usageCode = locale === "ja"
        ? `import { Form, FormGroup, FormLabel, FormControl, Input, Button } from "@gunjo/ui"

export function FormUsage() {
  return (
    <Form className="w-full max-w-sm">
      <FormGroup>
        <FormLabel htmlFor="name">名前</FormLabel>
        <FormControl>
          <Input id="name" />
        </FormControl>
      </FormGroup>
      <Button type="submit" className="w-full">保存</Button>
    </Form>
  );
}`
        : `import { Form, FormGroup, FormLabel, FormControl, Input, Button } from "@gunjo/ui"

export function FormUsage() {
  return (
    <Form className="w-full max-w-sm">
      <FormGroup>
        <FormLabel htmlFor="name">Name</FormLabel>
        <FormControl>
          <Input id="name" />
        </FormControl>
      </FormGroup>
      <Button type="submit" className="w-full">Save</Button>
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
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewHeight="auto">
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
                            code: locale === "ja"
                                ? `import * as React from "react";
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

export default function SignupForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const emailError = submitted && !email.includes("@") ? "有効なメールアドレスを入力してください。" : null;
  const passwordError = submitted && password.length < 8 ? "パスワードは8文字以上で入力してください。" : null;

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <FormGroup>
        <FormLabel htmlFor="email">メールアドレス</FormLabel>
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
        <FormLabel htmlFor="password">パスワード</FormLabel>
        <FormControl>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            aria-invalid={passwordError ? "true" : undefined}
          />
        </FormControl>
        <FormDescription>8文字以上で入力してください。</FormDescription>
        {passwordError ? <FormMessage>{passwordError}</FormMessage> : null}
      </FormGroup>
      <Button type="submit" className="w-full">アカウントを作成</Button>
    </Form>
  );
}`
                                : `import * as React from "react";
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
                            code: locale === "ja"
                                ? `import * as React from "react";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  Spinner,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gunjo/ui";

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
        <FormLabel htmlFor="feedback">フィードバック</FormLabel>
        <FormControl>
          <Textarea id="feedback" rows={3} />
        </FormControl>
        <FormDescription>すべてのメッセージを確認します。</FormDescription>
      </FormGroup>
      {submitting ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex w-full" tabIndex={0}>
              <Button type="submit" disabled className="w-full gap-2">
                <Spinner size="sm" />
                送信中...
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>送信処理が完了するまで再送信できません。</TooltipContent>
        </Tooltip>
      ) : (
        <Button type="submit" className="w-full">送信</Button>
      )}
    </Form>
  );
}`
                                : `import * as React from "react";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormGroup,
  FormLabel,
  Spinner,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gunjo/ui";

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
      {submitting ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex w-full" tabIndex={0}>
              <Button type="submit" disabled className="w-full gap-2">
                <Spinner size="sm" />
                Sending...
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>You can send again after this submission finishes.</TooltipContent>
        </Tooltip>
      ) : (
        <Button type="submit" className="w-full">Send feedback</Button>
      )}
    </Form>
  );
}`,
                        },
                        {
                            key: "form-field",
                            title: locale === "ja" ? "結線を FormField に任せる" : "Letting FormField do the wiring",
                            description:
                                locale === "ja"
                                    ? "FormGroup は入れ物だけで、id と aria の対応は自分で書きます。FormField に置き換えると、required と error を渡すだけで id・aria-describedby・aria-invalid・aria-required と、ラベルの * が揃います。説明を書かなかった欄は aria-describedby を持ちません。"
                                    : "FormGroup is only a container — you wire the ids and aria yourself. FormField takes required and error instead and derives the id, aria-describedby, aria-invalid, aria-required and the label asterisk. A field with no description gets no aria-describedby at all.",
                            preview: <WiredFieldForm locale={locale} />,
                            code: locale === "ja"
                                ? `import * as React from "react";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  Input,
} from "@gunjo/ui";

export default function CompanyForm() {
  const [company, setCompany] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  // error を渡すかどうかだけで、入力欄と説明とメッセージの結線が変わります。
  const error =
    submitted && company.trim() === "" ? "会社名を入力してください。" : undefined;

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <FormField required error={error}>
        {/* htmlFor も id も書きません。FormField が配ります。 */}
        <FormLabel>会社名</FormLabel>
        <FormControl>
          <Input
            value={company}
            onChange={(e) => setCompany(e.currentTarget.value)}
            placeholder="協栄精密工業"
          />
        </FormControl>
        <FormDescription>請求書に印字される名義です。</FormDescription>
        {/* 本文は error から来ます。error が無ければ何も描きません。 */}
        <FormMessage />
      </FormField>
      <Button type="submit" className="w-full">登録する</Button>
    </Form>
  );
}`
                                : `import * as React from "react";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  Input,
} from "@gunjo/ui";

export default function CompanyForm() {
  const [company, setCompany] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  // Passing error is the only switch: it rewires control, description and message.
  const error =
    submitted && company.trim() === "" ? "Enter your company name." : undefined;

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <FormField required error={error}>
        {/* No htmlFor, no id — FormField hands them out. */}
        <FormLabel>Company</FormLabel>
        <FormControl>
          <Input
            value={company}
            onChange={(e) => setCompany(e.currentTarget.value)}
            placeholder="Kyoei Precision"
          />
        </FormControl>
        <FormDescription>The name printed on the invoice.</FormDescription>
        {/* The body comes from error; with no error nothing renders. */}
        <FormMessage />
      </FormField>
      <Button type="submit" className="w-full">Register</Button>
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
