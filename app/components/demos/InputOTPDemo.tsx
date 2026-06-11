"use client";

import * as React from "react";
import {
    FormDescription,
    FormGroup,
    FormLabel,
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export function InputOTPDemo() {
    const [value, setValue] = React.useState("");
    const { locale } = useLocale();

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel>{locale === "ja" ? "確認コード" : "Verification code"}</FormLabel>
            <InputOTP maxLength={6} value={value} onChange={setValue}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
            <FormDescription>
                {value
                    ? locale === "ja"
                        ? `入力値: ${value}`
                        : `Value: ${value}`
                    : locale === "ja"
                        ? "6桁の確認コードを入力します。"
                        : "Enter the 6-digit verification code."}
            </FormDescription>
        </FormGroup>
    );
}
