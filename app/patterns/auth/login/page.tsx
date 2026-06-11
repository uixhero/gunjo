"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Button,
    Form,
    FormLabel,
    FormMessage,
    FormControl,
    FormGroup,
    Input,
    Spinner,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useMockAuth } from "../_lib/use-mock-auth";
import { AuthShell } from "../_lib/AuthShell";

const COPY_EN = {
    heading: "Welcome back",
    subtitle: "Sign in to continue to GunjoUI.",
    email: "Email",
    password: "Password",
    forgot: "Forgot your password?",
    submit: "Sign in",
    submitting: "Signing in…",
    submittingReason: "Sign-in request is already running.",
    noAccount: "Don't have an account?",
    signup: "Create one",
    invalidEmail: "Please enter a valid email address.",
    passwordTooShort: "Password must be at least 8 characters.",
};

const COPY_JA = {
    heading: "おかえりなさい",
    subtitle: "GunjoUI に続けるにはサインインしてください。",
    email: "メールアドレス",
    password: "パスワード",
    forgot: "パスワードを忘れた方",
    submit: "サインイン",
    submitting: "サインイン中…",
    submittingReason: "サインイン処理中のため、完了までお待ちください。",
    noAccount: "まだアカウントをお持ちでない？",
    signup: "新規登録",
    invalidEmail: "有効なメールアドレスを入力してください。",
    passwordTooShort: "パスワードは 8 文字以上必要です。",
};

export default function LoginPage({
    embedded = false,
}: {
    // Rendered as a decorative preview (e.g. the homepage pattern carousel).
    // When embedded, the page title must not be an <h1> in the host outline.
    embedded?: boolean;
} = {}) {
    const router = useRouter();
    const { locale } = useLocale();
    const t = locale === "ja" ? COPY_JA : COPY_EN;
    const HeadingTag = embedded ? "div" : "h1";
    const { signIn } = useMockAuth();

    const [email, setEmail] = React.useState("you@example.com");
    const [password, setPassword] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);

    const emailError = submitted && !email.includes("@") ? t.invalidEmail : null;
    const passwordError =
        submitted && password.length < 8 ? t.passwordTooShort : null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
        if (!email.includes("@") || password.length < 8) return;
        setSubmitting(true);
        window.setTimeout(() => {
            signIn({
                email,
                plan: "standard",
                name: email.split("@")[0] ?? "Member",
            });
            router.push("/patterns/auth/account");
        }, 600);
    };

    return (
        <AuthShell>
            <div ref={setPortalContainer} className="contents">
            <div className="flex flex-col space-y-2 text-center">
                <HeadingTag className="text-2xl font-semibold tracking-tight">{t.heading}</HeadingTag>
                <p className="text-sm text-muted-foreground">{t.subtitle}</p>
            </div>

            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <FormLabel htmlFor="email">{t.email}</FormLabel>
                    <FormControl>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                            placeholder="you@example.com"
                            aria-invalid={emailError ? "true" : undefined}
                            autoComplete="email"
                        />
                    </FormControl>
                    {emailError ? <FormMessage>{emailError}</FormMessage> : null}
                </FormGroup>
                <FormGroup>
                    <div className="flex items-center justify-between">
                        <FormLabel htmlFor="password">{t.password}</FormLabel>
                        <Link
                            href="/patterns/auth/forgot-password"
                            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                        >
                            {t.forgot}
                        </Link>
                    </div>
                    <FormControl>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            aria-invalid={passwordError ? "true" : undefined}
                            autoComplete="current-password"
                        />
                    </FormControl>
                    {passwordError ? <FormMessage>{passwordError}</FormMessage> : null}
                </FormGroup>
                {submitting ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="inline-flex w-full">
                                <Button type="submit" disabled className="gap-2 w-full">
                                    <Spinner size="sm" />
                                    {t.submitting}
                                </Button>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent portalContainer={portalContainer}>
                            {t.submittingReason}
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <Button type="submit" className="gap-2 w-full">
                        {t.submit}
                    </Button>
                )}
            </Form>

            <div className="text-center text-sm text-muted-foreground">
                {t.noAccount}{" "}
                <Link
                    href="/patterns/auth/signup"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                    {t.signup}
                </Link>
            </div>
            </div>
        </AuthShell>
    );
}
