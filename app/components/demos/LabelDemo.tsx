"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import * as React from "react";
import {
    Checkbox,
    FormControl,
    FormGroup,
    FormLabel,
    HStack,
    Input,
    Label,
    VStack,
} from "@gunjo/ui";

export function LabelDemo() {
    const { locale } = useLocale();
    const [accepted, setAccepted] = React.useState(false);

    return (
        <VStack gap={4} className="w-full max-w-sm">
            <HStack gap={2}>
                <Checkbox id="terms" checked={accepted} onCheckedChange={setAccepted} />
                <Label htmlFor="terms">
                    {locale === "ja" ? "利用規約に同意する" : "Accept terms and conditions"}
                </Label>
            </HStack>
            <FormGroup>
                <FormLabel htmlFor="display-name">
                    {locale === "ja" ? "表示名" : "Display name"}
                </FormLabel>
                <FormControl>
                    <Input id="display-name" placeholder={locale === "ja" ? "田中そら" : "Sora Tanaka"} />
                </FormControl>
            </FormGroup>
        </VStack>
    );
}
