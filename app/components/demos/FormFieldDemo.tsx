"use client";

import {
    Form,
    FormGroup,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    Input,
    Button,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export function FormFieldDemo() {
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
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                    />
                </FormControl>
                <FormDescription>
                    {locale === "ja" ? "メールアドレスを共有することはありません。" : "We'll never share your email."}
                </FormDescription>
                <FormMessage>{locale === "ja" ? "メールアドレスは必須です。" : "Email is required."}</FormMessage>
            </FormGroup>
            <Button type="submit" className="w-full">{locale === "ja" ? "送信" : "Submit"}</Button>
        </Form>
    );
}
