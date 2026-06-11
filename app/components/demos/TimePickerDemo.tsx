"use client";

import * as React from "react";
import {
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
    TimePicker,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export function TimePickerDemo() {
    const { locale } = useLocale();
    const [time, setTime] = React.useState("14:30");

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel>{locale === "ja" ? "開始時刻" : "Start time"}</FormLabel>
            <FormControl>
                <TimePicker
                    value={time}
                    onValueChange={setTime}
                    hourLabel={locale === "ja" ? "時" : "Hour"}
                    minuteLabel={locale === "ja" ? "分" : "Minute"}
                />
            </FormControl>
            <FormDescription>
                {locale === "ja" ? `24時間表記で表示しています。保存される値は「${time}」です。` : `24-hour time, value = "${time}".`}
            </FormDescription>
        </FormGroup>
    );
}
