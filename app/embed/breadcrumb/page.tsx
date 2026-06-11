"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import {
    Alert,
    AlertDescription,
    AlertTitle,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@gunjo/ui";
import type { MouseEvent } from "react";
import { useState } from "react";

export default function Embed() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [message, setMessage] = useState<string | null>(null);
    const handleNavigation = (label: string, href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setMessage(
            isJa
                ? `${label}（${href}）への遷移をプレビュー内で確認しました。`
                : `Previewed navigation to ${label} (${href}).`
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="flex w-full max-w-xl flex-col items-center gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" onClick={handleNavigation(isJa ? "ホーム" : "Home", "/")}>
                                {isJa ? "ホーム" : "Home"}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/docs" onClick={handleNavigation(isJa ? "ドキュメント" : "Docs", "/docs")}>
                                {isJa ? "ドキュメント" : "Docs"}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{isJa ? "パンくず" : "Breadcrumb"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {message ? (
                    <Alert className="w-full max-w-md">
                        <AlertTitle>{isJa ? "遷移を確認しました" : "Navigation previewed"}</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                ) : null}
            </div>
        </div>
    );
}
