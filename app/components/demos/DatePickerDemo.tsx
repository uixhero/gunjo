"use client";

import * as React from "react";
import { enUS } from "date-fns/locale/en-US";
import { ja } from "date-fns/locale/ja";
import {
    DatePicker,
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export function DatePickerDemo() {
    const { locale } = useLocale();
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const calendarLocale = locale === "ja" ? ja : enUS;

    return (
        <FormGroup className="w-full max-w-sm p-1">
            <FormLabel htmlFor="publish-date">{locale === "ja" ? "公開日" : "Publish date"}</FormLabel>
            <FormControl>
                <DatePicker
                    id="publish-date"
                    value={date}
                    onValueChange={setDate}
                    locale={calendarLocale}
                    calendarLabel={locale === "ja" ? "カレンダーを開く" : "Open calendar"}
                />
            </FormControl>
            <FormDescription>
                {locale === "ja" ? "スケジュールに使う日付を選択します。" : "Pick the date used for scheduling."}
            </FormDescription>
        </FormGroup>
    );
}
