"use client";

import * as React from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { IconArrowLeft, IconCircleCheckFilled, IconMailCheck } from "@tabler/icons-react";
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
    Modal,
} from "@gunjo/ui";
import {
    PURPOSE_OPTIONS,
    ROLE_OPTIONS,
    isValidEmail,
    type IndustryOption,
    type PackSubscribePayload,
} from "@/lib/pack";
import { PrivacyPolicyBody } from "@/privacy/PrivacyContent";

interface PackFormProps {
    industries: IndustryOption[];
    coldTestCount: number;
    /** Same-origin path to return to from the completion screen (from the CTA's ?from=). */
    returnPath?: string;
}

type FieldErrors = Partial<
    Record<"email" | "industry" | "purpose" | "role", string>
>;

export function PackForm({ industries, coldTestCount, returnPath }: PackFormProps) {
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
    const [privacyOpen, setPrivacyOpen] = React.useState(false);

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
                <Card className="overflow-hidden">
                    {/* Celebratory band — a soft success gradient behind the seal. */}
                    <div className="relative flex flex-col items-center bg-gradient-to-b from-success-subtle to-card px-6 pt-12 pb-8 text-center">
                        <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-success-subtle text-success ring-8 ring-success-subtle/40">
                            <IconCircleCheckFilled className="size-12" aria-hidden />
                        </div>
                        <p className="mb-1 text-2xl" aria-hidden>
                            🎉
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            先行登録が完了しました！
                        </h1>
                        <p className="mt-3 max-w-md text-muted-foreground">
                            ご登録ありがとうございます。あなたは
                            <span className="font-medium text-foreground">先行登録メンバー</span>
                            です。パックができあがったら、まっさきにお届けします。
                        </p>
                    </div>

                    <CardContent className="space-y-6 px-6 pb-10 pt-6 text-center">
                        <div className="mx-auto flex max-w-md items-start gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-left">
                            <IconMailCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
                            <p className="text-sm text-muted-foreground">
                                確認メールは送られません。次にご連絡するのは、パックのお届けのときです。楽しみにお待ちください。
                            </p>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button asChild>
                                <Link href={returnPath ?? "/cold-tests"}>
                                    {returnPath ? (
                                        <>
                                            <IconArrowLeft className="size-4" aria-hidden />
                                            元のページに戻る
                                        </>
                                    ) : (
                                        "コールドテストを見る"
                                    )}
                                </Link>
                            </Button>
                            {returnPath ? (
                                <Button asChild variant="ghost">
                                    <Link href="/cold-tests">コールドテストの記録を見る</Link>
                                </Button>
                            ) : null}
                        </div>
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
                            <button
                                type="button"
                                onClick={() => setPrivacyOpen(true)}
                                className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                            >
                                プライバシーポリシー
                            </button>
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

            <Modal
                isOpen={privacyOpen}
                onClose={() => setPrivacyOpen(false)}
                title="プライバシーポリシー"
                className="max-w-lg"
                footer={
                    <Button variant="outline" onClick={() => setPrivacyOpen(false)}>
                        閉じる
                    </Button>
                }
            >
                <div className="max-h-[70vh] overflow-y-auto pr-1">
                    <PrivacyPolicyBody linkToPack={false} />
                </div>
            </Modal>
        </div>
    );
}
