"use client";

import Link from "next/link";
import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { AuthTemplate, Button, Input, Label } from "@gunjo/ui";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { AuthTemplateDemo } from "@/components/demos/TemplateDemos";
import { useLocale } from "@/components/providers/LocaleProvider";
import patternsMetadata from "@design/patterns-metadata.json";

const usageCode = `import { AuthTemplate } from "@gunjo/ui";
import { LoginForm } from "./LoginForm"; // Example component

export function AuthPage() {
  return (
    <AuthTemplate>
        <LoginForm />
    </AuthTemplate>
  )
}`;

const propsData = [
    {
        name: "logo",
        type: "React.ReactNode",
        description: "Custom logo element to display in the header/panel.",
    },
    {
        name: "quote",
        type: "string",
        description: "Testimonial quote text displayed in the side panel.",
    },
    {
        name: "quoteAuthor",
        type: "string",
        description: "Author name for the testimonial quote.",
    },
    {
        name: "children",
        type: "React.ReactNode",
        description: "The authentication form content.",
    },
    {
        name: "className",
        type: "string",
        description: "Additional classes for the root container.",
    }
];

function SignInFields({ idPrefix, locale }: { idPrefix: string; locale: "en" | "ja" }) {
    return (
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
            <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-email`}>
                    {locale === "ja" ? "メールアドレス" : "Email"}
                </Label>
                <Input id={`${idPrefix}-email`} type="email" placeholder="name@example.com" />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-password`}>
                    {locale === "ja" ? "パスワード" : "Password"}
                </Label>
                <Input id={`${idPrefix}-password`} type="password" />
            </div>
            <Button type="submit" className="w-full">
                {locale === "ja" ? "ログイン" : "Sign in"}
            </Button>
        </form>
    );
}

export default function AuthPage() {
    const { locale } = useLocale();

    return (
        <ComponentLayout
            title={patternsMetadata.authTemplate.title}
            description={patternsMetadata.authTemplate.description}
            usedComponents={[
                { name: "AuthTemplate", href: "/docs/components/auth" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Input", href: "/docs/components/input" },
                { name: "Label", href: "/docs/components/label" },
            ]}
            relatedComponents={[
                { name: "ResponsiveAuthCardPattern", href: "/docs/components/responsive-auth-card-pattern" },
                { name: "OnboardingTemplate", href: "/docs/components/onboarding" },
                { name: "Form", href: "/docs/components/form" },
                { name: "PasswordInput", href: "/docs/components/password-input" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/auth" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <AuthTemplateDemo />
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "AuthTemplate が持つ差し替え口は logo・quote・quoteAuthor の3つです。左の紹介パネルは横幅が広いときだけ現れ、フォームは常に中央に置かれます。"
                        : "AuthTemplate exposes three slots: logo, quote, and quoteAuthor. The brand panel on the left appears only on wide viewports, while the form stays centered at every width."}
                </p>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default-panel",
                            title: locale === "ja" ? "既定のパネル" : "Default panel",
                            description: locale === "ja"
                                ? "logo も quote も渡さないときは、組み込みのロゴと推薦文がそのまま出ます。組み込みの推薦文は英語なので、日本語の画面では次の例のように quote を渡して差し替えます。"
                                : "With no logo and no quote, the built-in mark and testimonial are used as-is. This is the shortest way to see the shape.",
                            preview: (
                                <AuthTemplate className="min-h-0">
                                    <SignInFields idPrefix="auth-default" locale={locale} />
                                </AuthTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { AuthTemplate, Button, Input, Label } from "@gunjo/ui";

export function DefaultAuthPanel() {
  return (
    <AuthTemplate className="min-h-0">
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">パスワード</Label>
          <Input id="password" type="password" />
        </div>
        <Button type="submit" className="w-full">ログイン</Button>
      </form>
    </AuthTemplate>
  );
}`
                                : `import { AuthTemplate, Button, Input, Label } from "@gunjo/ui";

export function DefaultAuthPanel() {
  return (
    <AuthTemplate className="min-h-0">
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </AuthTemplate>
  );
}`,
                        },
                        {
                            key: "with-quote",
                            title: locale === "ja" ? "推薦文を差し替える" : "Custom testimonial",
                            description: locale === "ja"
                                ? "quote と quoteAuthor を渡すと、紹介パネルの引用が置き換わります。自社の利用者の声を出す場所です。"
                                : "Pass quote and quoteAuthor to replace the testimonial in the brand panel. This is where a real customer voice goes.",
                            preview: (
                                <AuthTemplate
                                    className="min-h-0"
                                    quote={locale === "ja"
                                        ? "画面の作り直しが1日で終わるようになりました。土台がそろっている強さです。"
                                        : "Rebuilding a screen now takes a day instead of a sprint. That is what a shared foundation buys you."}
                                    quoteAuthor={locale === "ja" ? "田中 美咲 / プロダクト設計" : "Misaki Tanaka, Product Design"}
                                >
                                    <SignInFields idPrefix="auth-quote" locale={locale} />
                                </AuthTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { AuthTemplate, Button, Input, Label } from "@gunjo/ui";

const QUOTE = "画面の作り直しが1日で終わるようになりました。土台がそろっている強さです。";
const QUOTE_AUTHOR = "田中 美咲 / プロダクト設計";

export function AuthWithQuote() {
  return (
    <AuthTemplate className="min-h-0" quote={QUOTE} quoteAuthor={QUOTE_AUTHOR}>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">パスワード</Label>
          <Input id="password" type="password" />
        </div>
        <Button type="submit" className="w-full">ログイン</Button>
      </form>
    </AuthTemplate>
  );
}`
                                : `import { AuthTemplate, Button, Input, Label } from "@gunjo/ui";

const QUOTE = "Rebuilding a screen now takes a day instead of a sprint. That is what a shared foundation buys you.";
const QUOTE_AUTHOR = "Misaki Tanaka, Product Design";

export function AuthWithQuote() {
  return (
    <AuthTemplate className="min-h-0" quote={QUOTE} quoteAuthor={QUOTE_AUTHOR}>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </AuthTemplate>
  );
}`,
                        },
                        {
                            key: "custom-logo",
                            title: locale === "ja" ? "ロゴを差し替える" : "Custom logo",
                            description: locale === "ja"
                                ? "logo にはノードをそのまま渡せます。画像でも、文字と印を組み合わせた行でもかまいません。"
                                : "The logo slot takes any node — an image, or a row that pairs a mark with the product name.",
                            preview: (
                                <AuthTemplate
                                    className="min-h-0"
                                    logo={
                                        <span className="flex items-center gap-2 text-lg font-semibold">
                                            <span className="grid h-7 w-7 place-items-center rounded bg-[hsl(var(--pure-white))] text-sm font-bold text-[hsl(var(--pure-black))]">
                                                G
                                            </span>
                                            Gunjo Cloud
                                        </span>
                                    }
                                >
                                    <SignInFields idPrefix="auth-logo" locale={locale} />
                                </AuthTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { AuthTemplate, Button, Input, Label } from "@gunjo/ui";

export function AuthWithLogo() {
  return (
    <AuthTemplate
      className="min-h-0"
      logo={
        <span className="flex items-center gap-2 text-lg font-semibold">
          <span className="grid h-7 w-7 place-items-center rounded bg-[hsl(var(--pure-white))] text-sm font-bold text-[hsl(var(--pure-black))]">
            G
          </span>
          Gunjo Cloud
        </span>
      }
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">パスワード</Label>
          <Input id="password" type="password" />
        </div>
        <Button type="submit" className="w-full">ログイン</Button>
      </form>
    </AuthTemplate>
  );
}`
                                : `import { AuthTemplate, Button, Input, Label } from "@gunjo/ui";

export function AuthWithLogo() {
  return (
    <AuthTemplate
      className="min-h-0"
      logo={
        <span className="flex items-center gap-2 text-lg font-semibold">
          <span className="grid h-7 w-7 place-items-center rounded bg-[hsl(var(--pure-white))] text-sm font-bold text-[hsl(var(--pure-black))]">
            G
          </span>
          Gunjo Cloud
        </span>
      }
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </AuthTemplate>
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="rounded-lg border border-accent-foreground/20 bg-accent/40 p-5 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1 max-w-md">
                    <h3 className="text-base font-semibold">View as a full app</h3>
                    <p className="text-sm text-muted-foreground">
                        AuthTemplate is wired into a working multi-page mini-site at <code className="font-mono text-xs">/patterns/auth</code> — login, signup, forgot-password, and a post-login account screen with mock state.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/patterns/auth/login">
                        Open mini-site
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Props</h2>
                <PropsTable data={propsData} />
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Usage</h2>
                <CodeBlock code={usageCode} language="tsx" />
            </div>
        </ComponentLayout>
    );
}
