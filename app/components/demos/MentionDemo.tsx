"use client";

import * as React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    Code,
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
    Mention,
} from "@gunjo/ui";

const PEOPLE_EN = [
    { id: "alice", label: "alice", hint: "Alice Chen" },
    { id: "alex", label: "alex", hint: "Alex Park" },
    { id: "bob", label: "bob", hint: "Bob Tanaka" },
    { id: "carol", label: "carol", hint: "Carol Lee" },
    { id: "dan", label: "dan", hint: "Dan Park" },
    { id: "erin", label: "erin", hint: "Erin Liu" },
];

const PEOPLE_JA = [
    { id: "tanaka", label: "田中", hint: "デザイナー" },
    { id: "sato", label: "佐藤", hint: "エンジニア" },
    { id: "suzuki", label: "鈴木", hint: "PM" },
    { id: "ito", label: "伊藤", hint: "QA" },
    { id: "yamada", label: "山田", hint: "サポート" },
    { id: "takahashi", label: "高橋", hint: "営業" },
];

export function MentionDemo() {
    const { locale } = useLocale();
    const options = locale === "ja" ? PEOPLE_JA : PEOPLE_EN;
    const [value, setValue] = React.useState(locale === "ja" ? "担当は @田" : "Hi @al");

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="mention-message">{locale === "ja" ? "メッセージ" : "Message"}</FormLabel>
            <FormControl>
                <Mention
                    id="mention-message"
                    value={value}
                    onValueChange={setValue}
                    options={options}
                    placeholder={locale === "ja" ? "@ を入力してメンションを追加" : "Type @ to mention..."}
                    rows={3}
                />
            </FormControl>
            <FormDescription>
                {locale === "ja" ? "候補を表示するには " : "Type "}
                <Code>@</Code>
                {locale === "ja" ? " を入力します。" : " to trigger suggestions."}
            </FormDescription>
        </FormGroup>
    );
}
