"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Avatar,
    AvatarFallback,
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Spinner,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useMockAuth, type MockAuthState } from "../_lib/use-mock-auth";
import { AuthMarqueeChrome } from "../_lib/AuthShell";

const COPY_EN = {
    welcome: (name: string) => `Welcome, ${name}.`,
    subtitle:
        "This post-login screen shows the signed-in identity, plan, and account actions in the same shell used by the auth flow.",
    accountHeading: "Account",
    plan: "Plan",
    email: "Email",
    signOut: "Sign out",
    signedOut: "Signed out — taking you back…",
    notSignedIn: "Not signed in",
    notSignedInBody: "This page only shows when you complete the auth demo.",
    goToLogin: "Go to login",
};

const COPY_JA = {
    welcome: (name: string) => `${name} さん、ようこそ。`,
    subtitle:
        "ログイン後の画面として、サインイン中のユーザー情報、プラン、アカウント操作を同じシェル内で表示します。",
    accountHeading: "アカウント",
    plan: "プラン",
    email: "メールアドレス",
    signOut: "サインアウト",
    signedOut: "サインアウトしました。戻ります…",
    notSignedIn: "サインインしていません",
    notSignedInBody: "このページは auth デモを完了した時だけ表示されます。",
    goToLogin: "ログインへ",
};

const PLAN_LABEL: Record<MockAuthState["plan"], string> = {
    free: "Free",
    standard: "Standard",
    team: "Team",
};

const PLAN_VARIANT: Record<MockAuthState["plan"], "outline" | "secondary" | "default"> = {
    free: "outline",
    standard: "secondary",
    team: "default",
};

export default function AccountPage() {
    const router = useRouter();
    const { locale } = useLocale();
    const t = locale === "ja" ? COPY_JA : COPY_EN;
    const { user, signOut, hydrated } = useMockAuth();

    if (!hydrated) {
        return (
            <AuthMarqueeChrome>{() => (
                <div className="flex h-full items-center justify-center">
                    <Spinner size="lg" />
                </div>
            )}</AuthMarqueeChrome>
        );
    }

    if (!user) {
        return (
            <AuthMarqueeChrome>{() => (
                <div className="flex h-full flex-col items-center justify-center space-y-4 px-8 text-center">
                    <h1 className="text-2xl font-semibold">{t.notSignedIn}</h1>
                    <p className="text-muted-foreground">{t.notSignedInBody}</p>
                    <Button asChild>
                        <Link href="/patterns/auth/login">{t.goToLogin}</Link>
                    </Button>
                </div>
            )}</AuthMarqueeChrome>
        );
    }

    const initials = user.name
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const handleSignOut = () => {
        signOut();
        window.setTimeout(() => router.push("/patterns/auth/login"), 400);
    };

    return (
        <AuthMarqueeChrome>{() => (
            <div className="mx-auto h-full max-w-2xl space-y-8 overflow-y-auto px-8 py-12">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg font-semibold">
                            {initials || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {t.welcome(user.name)}
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-xl">
                            {t.subtitle}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t.accountHeading}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <dt className="text-xs text-muted-foreground">{t.plan}</dt>
                                <dd>
                                    <Badge variant={PLAN_VARIANT[user.plan]}>
                                        {PLAN_LABEL[user.plan]}
                                    </Badge>
                                </dd>
                            </div>
                            <div className="space-y-1">
                                <dt className="text-xs text-muted-foreground">{t.email}</dt>
                                <dd className="font-mono text-xs">{user.email}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={handleSignOut}>
                        {t.signOut}
                    </Button>
                </div>
            </div>
        )}</AuthMarqueeChrome>
    );
}
