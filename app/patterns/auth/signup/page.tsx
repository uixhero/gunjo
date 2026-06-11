"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Button,
    Form,
    FormDescription,
    FormLabel,
    FormMessage,
    FormControl,
    FormGroup,
    Input,
    Label,
    RadioGroup,
    RadioGroupItem,
    Spinner,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useMockAuth, type MockAuthState } from "../_lib/use-mock-auth";
import { AuthShell } from "../_lib/AuthShell";

const planOptionClassName =
    "flex w-full cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-muted/40";

const COPY_EN = {
    heading: "Create your account",
    subtitle: "30-second signup. No credit card.",
    name: "Display name",
    email: "Email",
    password: "Password",
    passwordHint: "At least 8 characters.",
    plan: "Plan",
    plans: [
        { value: "free", label: "Free", hint: "3 projects, community support." },
        { value: "standard", label: "Standard", hint: "Unlimited projects, email support." },
        { value: "team", label: "Team", hint: "Shared workspaces + SSO." },
    ],
    submit: "Create account",
    submitting: "Creating…",
    submittingReason: "Account creation is already running.",
    haveAccount: "Already have an account?",
    signin: "Sign in",
    nameRequired: "Name is required.",
    invalidEmail: "Please enter a valid email address.",
    passwordTooShort: "Password must be at least 8 characters.",
};

const COPY_JA = {
    heading: "アカウントを作成",
    subtitle: "30 秒で登録、クレジットカード不要。",
    name: "表示名",
    email: "メールアドレス",
    password: "パスワード",
    passwordHint: "8 文字以上で設定してください。",
    plan: "プラン",
    plans: [
        { value: "free", label: "Free", hint: "3 プロジェクト、コミュニティサポート。" },
        { value: "standard", label: "Standard", hint: "プロジェクト無制限、メールサポート。" },
        { value: "team", label: "Team", hint: "共有ワークスペース + SSO。" },
    ],
    submit: "アカウント作成",
    submitting: "作成中…",
    submittingReason: "アカウント作成中のため、完了までお待ちください。",
    haveAccount: "すでにアカウントをお持ち？",
    signin: "サインイン",
    nameRequired: "名前は必須です。",
    invalidEmail: "有効なメールアドレスを入力してください。",
    passwordTooShort: "パスワードは 8 文字以上必要です。",
};

export default function SignupPage() {
    const router = useRouter();
    const { locale } = useLocale();
    const t = locale === "ja" ? COPY_JA : COPY_EN;
    const { signIn } = useMockAuth();

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [plan, setPlan] = React.useState<MockAuthState["plan"]>("standard");
    const [submitted, setSubmitted] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);

    const nameError = submitted && name.trim().length === 0 ? t.nameRequired : null;
    const emailError = submitted && !email.includes("@") ? t.invalidEmail : null;
    const passwordError =
        submitted && password.length < 8 ? t.passwordTooShort : null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
        if (!name.trim() || !email.includes("@") || password.length < 8) return;
        setSubmitting(true);
        window.setTimeout(() => {
            signIn({ email, plan, name: name.trim() });
            router.push("/patterns/auth/account");
        }, 600);
    };

    return (
        <AuthShell>
            <div ref={setPortalContainer} className="contents">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">{t.heading}</h1>
                <p className="text-sm text-muted-foreground">{t.subtitle}</p>
            </div>

            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <FormLabel htmlFor="signup-name">{t.name}</FormLabel>
                    <FormControl>
                        <Input
                            id="signup-name"
                            value={name}
                            onChange={(e) => setName(e.currentTarget.value)}
                            placeholder="Sora Tanaka"
                            aria-invalid={nameError ? "true" : undefined}
                            autoComplete="name"
                        />
                    </FormControl>
                    {nameError ? <FormMessage>{nameError}</FormMessage> : null}
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="signup-email">{t.email}</FormLabel>
                    <FormControl>
                        <Input
                            id="signup-email"
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
                    <FormLabel htmlFor="signup-password">{t.password}</FormLabel>
                    <FormControl>
                        <Input
                            id="signup-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            aria-invalid={passwordError ? "true" : undefined}
                            autoComplete="new-password"
                        />
                    </FormControl>
                    <FormDescription>{t.passwordHint}</FormDescription>
                    {passwordError ? <FormMessage>{passwordError}</FormMessage> : null}
                </FormGroup>
                <FormGroup>
                    <FormLabel>{t.plan}</FormLabel>
                    <FormControl>
                        <RadioGroup
                            value={plan}
                            onValueChange={(v) => setPlan(v as MockAuthState["plan"])}
                            className="w-full space-y-2"
                        >
                            {t.plans.map((opt) => (
                                <Label
                                    key={opt.value}
                                    htmlFor={`plan-${opt.value}`}
                                    className={planOptionClassName}
                                >
                                    <RadioGroupItem
                                        value={opt.value}
                                        id={`plan-${opt.value}`}
                                        className="mt-0.5"
                                    />
                                    <span className="space-y-0.5">
                                        <span className="block font-medium leading-none">
                                            {opt.label}
                                        </span>
                                        <span className="block text-xs font-normal text-muted-foreground">
                                            {opt.hint}
                                        </span>
                                    </span>
                                </Label>
                            ))}
                        </RadioGroup>
                    </FormControl>
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
                {t.haveAccount}{" "}
                <Link
                    href="/patterns/auth/login"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                    {t.signin}
                </Link>
            </div>
            </div>
        </AuthShell>
    );
}
