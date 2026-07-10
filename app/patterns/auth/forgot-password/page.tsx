"use client";

import * as React from "react";
import Link from "next/link";
import { IconArrowLeft as ArrowLeft } from "@tabler/icons-react";
import {
    Button,
    Form,
    FormDescription,
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
import { IconCircleCheck as CheckCircle } from "@tabler/icons-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { AuthShell } from "../_lib/AuthShell";

const COPY_EN = {
    heading: "Reset your password",
    subtitle: "Enter the email tied to your account. We'll send a reset link.",
    email: "Email",
    submit: "Send reset link",
    submitting: "Sending…",
    submittingReason: "Reset email is already being sent.",
    backToLogin: "Back to sign in",
    invalidEmail: "Please enter a valid email address.",
    successHeading: "Check your inbox",
    successBody: (email: string) =>
        `If an account exists for ${email}, we've sent a reset link. The link expires in 30 minutes.`,
    successAction: "Confirm inbox flow",
    successFeedback: "Inbox handoff was confirmed in this preview.",
    sendAgain: "Send again",
};

const COPY_JA = {
    heading: "パスワードをリセット",
    subtitle: "アカウントに紐づくメールアドレスを入力してください。リセットリンクを送ります。",
    email: "メールアドレス",
    submit: "リセットリンクを送信",
    submitting: "送信中…",
    submittingReason: "リセットメールを送信中のため、完了までお待ちください。",
    backToLogin: "サインインに戻る",
    invalidEmail: "有効なメールアドレスを入力してください。",
    successHeading: "メールを確認してください",
    successBody: (email: string) =>
        `${email} のアカウントが存在する場合、リセットリンクを送信しました。リンクは 30 分後に失効します。`,
    successAction: "メール確認をプレビュー",
    successFeedback: "このプレビュー内でメール確認の遷移を確認しました。",
    sendAgain: "もう一度送信",
};

export default function ForgotPasswordPage() {
    const { locale } = useLocale();
    const t = locale === "ja" ? COPY_JA : COPY_EN;

    const [email, setEmail] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [sentTo, setSentTo] = React.useState<string | null>(null);
    const [previewFeedback, setPreviewFeedback] = React.useState<string | null>(null);
    const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);

    const emailError = submitted && !email.includes("@") ? t.invalidEmail : null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
        if (!email.includes("@")) return;
        setSubmitting(true);
        window.setTimeout(() => {
            setSubmitting(false);
            setSentTo(email);
        }, 600);
    };

    if (sentTo) {
        return (
            <AuthShell>
            <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-subtle">
                    <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    {t.successHeading}
                </h1>
                <p className="text-sm text-muted-foreground">{t.successBody(sentTo)}</p>
                <div className="flex flex-col gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPreviewFeedback(t.successFeedback)}
                    >
                        {t.successAction}
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSentTo(null);
                            setSubmitted(false);
                            setPreviewFeedback(null);
                        }}
                    >
                        {t.sendAgain}
                    </Button>
                </div>
                {previewFeedback ? (
                    <p className="text-xs font-medium text-success">{previewFeedback}</p>
                ) : null}
                <Link
                    href="/patterns/auth/login"
                    className="block text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                    <ArrowLeft className="mr-0.5 inline size-3.5 align-[-0.1875em]" aria-hidden />
                    {t.backToLogin}
                </Link>
            </div>
            </AuthShell>
        );
    }

    return (
        <AuthShell>
            <div ref={setPortalContainer} className="contents">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">{t.heading}</h1>
                <p className="text-sm text-muted-foreground">{t.subtitle}</p>
            </div>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <FormLabel htmlFor="reset-email">{t.email}</FormLabel>
                    <FormControl>
                        <Input
                            id="reset-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                            placeholder="you@example.com"
                            aria-invalid={emailError ? "true" : undefined}
                            autoComplete="email"
                        />
                    </FormControl>
                    <FormDescription>
                        {locale === "ja"
                            ? "30 分有効なリンクが届きます。"
                            : "The reset link is valid for 30 minutes."}
                    </FormDescription>
                    {emailError ? <FormMessage>{emailError}</FormMessage> : null}
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
            <Link
                href="/patterns/auth/login"
                className="text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
                <ArrowLeft className="mr-0.5 inline size-3.5 align-[-0.1875em]" aria-hidden />
                {t.backToLogin}
            </Link>
            </div>
        </AuthShell>
    );
}
