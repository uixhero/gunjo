"use client";

import {
    Button,
    Form,
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
    FormMessage,
    Input,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export function InputDemo() {
    const { locale } = useLocale();

    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
            }}
            className="w-full max-w-sm"
        >
            <FormGroup>
                <FormLabel htmlFor="email">{locale === "ja" ? "メールアドレス" : "Email"}</FormLabel>
                <FormControl>
                    <Input
                        type="email"
                        id="email"
                        defaultValue="not-an-email"
                        aria-invalid="true"
                        className="border-destructive ring-destructive focus-visible:ring-destructive"
                    />
                </FormControl>
                <FormDescription>
                    {locale === "ja" ? "アカウントと通知の更新に使います。" : "Used for account and notification updates."}
                </FormDescription>
                <FormMessage>
                    {locale === "ja" ? "有効なメールアドレスを入力してください。" : "Please enter a valid email address."}
                </FormMessage>
            </FormGroup>
            <Button type="submit" className="w-full">{locale === "ja" ? "登録する" : "Subscribe"}</Button>
        </Form>
    );
}
