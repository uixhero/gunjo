"use client";

import { Button, Input, Label, VStack } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export function VStackDemo() {
    const { locale } = useLocale();

    return (
        <VStack gap={4} className="w-full max-w-sm rounded-md border bg-background p-4">
            <VStack gap={2}>
                <Label htmlFor="vstack-demo-name">{locale === "ja" ? "名前" : "Name"}</Label>
                <Input id="vstack-demo-name" defaultValue="Gunjo UI" className="w-full" />
            </VStack>
            <VStack gap={2}>
                <Label htmlFor="vstack-demo-email">{locale === "ja" ? "メール" : "Email"}</Label>
                <Input id="vstack-demo-email" defaultValue="team@example.com" className="w-full" />
            </VStack>
            <Button className="self-start">{locale === "ja" ? "保存" : "Save"}</Button>
        </VStack>
    );
}
