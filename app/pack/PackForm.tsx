"use client";

import * as React from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
    Input,
    Select,
    Textarea,
    RadioGroup,
    RadioGroupItem,
    Button,
    Card,
    CardContent,
} from "@gunjo/ui";
import {
    PURPOSE_OPTIONS,
    ROLE_OPTIONS,
    isValidEmail,
    type IndustryOption,
    type PackSubscribePayload,
} from "@/lib/pack";

interface PackFormProps {
    industries: IndustryOption[];
    coldTestCount: number;
}

type FieldErrors = Partial<
    Record<"email" | "industry" | "purpose" | "role", string>
>;

export function PackForm({ industries, coldTestCount }: PackFormProps) {
    const [email, setEmail] = React.useState("");
    const [industry, setIndustry] = React.useState("");
    const [industryOther, setIndustryOther] = React.useState("");
    const [purpose, setPurpose] = React.useState("");
    const [role, setRole] = React.useState("");
    const [trouble, setTrouble] = React.useState("");
    const [errors, setErrors] = React.useState<FieldErrors>({});
    const [status, setStatus] = React.useState<
        "idle" | "submitting" | "success" | "error"
    >("idle");

    // Form-reach count (one of the two metrics TASK-7 asks for).
    React.useEffect(() => {
        track("pack_view");
    }, []);

    function validate(): FieldErrors {
        const next: FieldErrors = {};
        if (!isValidEmail(email.trim()))
            next.email = "メールアドレスを正しく入力してください。";
        if (!industry || (industry === "other" && !industryOther.trim()))
            next.industry = "業界を選んでください。";
        if (!purpose) next.purpose = "目的を選んでください。";
        if (!role) next.role = "役割を選んでください。";
        return next;
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const nextErrors = validate();
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setStatus("submitting");
        const payload: PackSubscribePayload = {
            email: email.trim(),
            industry,
            industryOther: industry === "other" ? industryOther.trim() : undefined,
            purpose: purpose as PackSubscribePayload["purpose"],
            role: role as PackSubscribePayload["role"],
            trouble: trouble.trim() || undefined,
        };
        try {
            const res = await fetch("/api/pack/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`status ${res.status}`);
            // Submit count + a coarse breakdown (no email — just the survey axes).
            track("pack_registered", { purpose, industry, role });
            setStatus("success");
        } catch {
            setStatus("error");
        }
    }

    if (status === "success") {
        return (
            <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
                <Card>
                    <CardContent className="space-y-4 px-6 py-10 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">
                            登録ありがとうございます
                        </h1>
                        <p className="text-muted-foreground">
                            パックができたら最初にお送りします。
                            <br />
                            それまでは{" "}
                            <Link
                                href="/cold-tests"
                                className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                            >
                                コールドテストの記録
                            </Link>{" "}
                            をどうぞ。
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-20">
            <header className="mb-8 space-y-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    AI指示書パック 先行登録
                </h1>
                <p className="text-muted-foreground">
                    業界別「AI指示書パック」を準備中です。コールドテスト
                    {coldTestCount}画面をもとに、あなたのAI（Claude / Cursorなど）に渡せば{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-sm">
                        @gunjo/ui
                    </code>{" "}
                    でその業界の画面が組める指示書をまとめています。欲しい業界を教えてください。できあがったら最初にお送りします。
                </p>
            </header>

            <Card>
                <CardContent className="px-6 py-6">
                    <Form onSubmit={handleSubmit} noValidate>
                        <FormField required error={errors.email}>
                            <FormLabel>メールアドレス</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    inputMode="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormField>

                        <FormField required error={errors.industry}>
                            <FormLabel>業界</FormLabel>
                            <FormControl>
                                <Select
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                >
                                    <option value="" disabled>
                                        選択してください
                                    </option>
                                    {industries.map((i) => (
                                        <option key={i.value} value={i.value}>
                                            {i.label}
                                        </option>
                                    ))}
                                    <option value="other">その他</option>
                                </Select>
                            </FormControl>
                            {industry === "other" ? (
                                <Input
                                    className="mt-2"
                                    placeholder="業界を入力してください"
                                    aria-label="その他の業界"
                                    value={industryOther}
                                    onChange={(e) => setIndustryOther(e.target.value)}
                                />
                            ) : null}
                            <FormMessage />
                        </FormField>

                        <FormField required error={errors.purpose}>
                            <FormLabel>目的</FormLabel>
                            <RadioGroup
                                className="pt-1"
                                aria-label="目的"
                                value={purpose}
                                onValueChange={setPurpose}
                            >
                                {PURPOSE_OPTIONS.map((o) => (
                                    <RadioGroupItem
                                        key={o.value}
                                        value={o.value}
                                        label={o.label}
                                    />
                                ))}
                            </RadioGroup>
                            <FormMessage />
                        </FormField>

                        <FormField required error={errors.role}>
                            <FormLabel>役割</FormLabel>
                            <RadioGroup
                                className="pt-1"
                                aria-label="役割"
                                value={role}
                                onValueChange={setRole}
                            >
                                {ROLE_OPTIONS.map((o) => (
                                    <RadioGroupItem
                                        key={o.value}
                                        value={o.value}
                                        label={o.label}
                                    />
                                ))}
                            </RadioGroup>
                            <FormMessage />
                        </FormField>

                        <FormField>
                            <FormLabel>いま困っていること（任意）</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={3}
                                    placeholder="任意です。あれば教えてください。"
                                    value={trouble}
                                    onChange={(e) => setTrouble(e.target.value)}
                                />
                            </FormControl>
                        </FormField>

                        <p className="text-xs leading-relaxed text-muted-foreground">
                            ご登録いただいたメールアドレスは、パックのお届けと、新パック・新機能・関連サービスのお知らせにのみ使用します。配信はいつでも解除できます。
                            <br />
                            <Link
                                href="/privacy"
                                className="underline underline-offset-4 hover:text-foreground"
                            >
                                プライバシーポリシー
                            </Link>
                        </p>

                        {status === "error" ? (
                            <p role="alert" className="text-sm font-medium text-destructive">
                                送信に失敗しました。時間をおいて、もう一度お試しください。
                            </p>
                        ) : null}

                        <div>
                            <Button type="submit" disabled={status === "submitting"}>
                                {status === "submitting" ? "送信中…" : "先行登録する"}
                            </Button>
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
