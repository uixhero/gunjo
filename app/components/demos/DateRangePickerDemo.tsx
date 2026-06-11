"use client";

import * as React from "react";
import { enUS } from "date-fns/locale/en-US";
import { ja } from "date-fns/locale/ja";
import type { DateRange } from "react-day-picker";
import {
    DateRangePicker,
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export function DateRangePickerDemo() {
    const { locale } = useLocale();
    const today = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(today.getDate() + 13);
    const calendarLocale = locale === "ja" ? ja : enUS;
    const [range, setRange] = React.useState<DateRange | undefined>({
        from: today,
        to: twoWeeksLater,
    });

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="campaign-window">
                {locale === "ja" ? "キャンペーン期間" : "Campaign window"}
            </FormLabel>
            <FormControl>
                <DateRangePicker
                    id="campaign-window"
                    value={range}
                    onValueChange={setRange}
                    locale={calendarLocale}
                    calendarLabel={locale === "ja" ? "カレンダーを開く" : "Open calendar"}
                    maxRangeDays={365}
                />
            </FormControl>
            <FormDescription>
                {locale === "ja" ? "開始日と終了日をまとめて選択します。" : "Choose start and end dates together."}
            </FormDescription>
        </FormGroup>
    );
}
