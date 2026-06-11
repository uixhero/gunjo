"use client";

import {
    Checkbox,
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
    Label,
    RadioGroup,
    RadioGroupItem,
    Textarea,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useState } from "react";

export function TextareaDemo() {
    const { locale } = useLocale();

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="message">{locale === "ja" ? "お問い合わせ内容" : "Your message"}</FormLabel>
            <FormControl>
                <Textarea placeholder={locale === "ja" ? "内容を入力してください。" : "Type your message here."} id="message" />
            </FormControl>
            <FormDescription>
                {locale === "ja" ? "送信内容はサポートチームに共有されます。" : "Your message will be copied to the support team."}
            </FormDescription>
        </FormGroup>
    );
}

export function CheckboxDemo() {
    const [checked, setChecked] = useState<boolean>(false);
    const { locale } = useLocale();

    return (
        <div className="flex items-center gap-2">
            <Checkbox id="terms" checked={checked} onCheckedChange={(c) => setChecked(!!c)} />
            <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {locale === "ja" ? "利用規約に同意する" : "Accept terms and conditions"}
            </Label>
        </div>
    )
}

export function RadioGroupDemo() {
    const { locale } = useLocale();

    return (
        <RadioGroup defaultValue="standard">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="basic" id="plan-basic" />
                <Label htmlFor="plan-basic">{locale === "ja" ? "ベーシック" : "Basic"}</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="plan-standard" />
                <Label htmlFor="plan-standard">{locale === "ja" ? "スタンダード" : "Standard"}</Label>
            </div>
        </RadioGroup>
    )
}
