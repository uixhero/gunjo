"use client";

import * as React from "react";
import { enUS } from "date-fns/locale/en-US";
import { ja } from "date-fns/locale/ja";
import type { DateRange } from "react-day-picker";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import inputsMetadata from "@design/inputs-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import { CalendarDemo } from "@/components/demos/NavigationDemos";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { Calendar } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

function CalendarStatesContent({ locale }: { locale: "ja" | "en" }) {
    const [single, setSingle] = React.useState<Date | undefined>(new Date());
    const [multiple, setMultiple] = React.useState<Date[] | undefined>([
        new Date(2026, 4, 4),
        new Date(2026, 4, 11),
        new Date(2026, 4, 18),
    ]);
    const [range, setRange] = React.useState<DateRange | undefined>(() => {
        const today = new Date();
        const future = new Date();
        future.setDate(future.getDate() + 6);
        return { from: today, to: future };
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const calendarLocale = locale === "ja" ? ja : enUS;
    const disabledPastReason =
        locale === "ja"
            ? "過去日は予約できません。今日以降の日付を選択してください。"
            : "Past dates cannot be booked. Choose today or a future date.";

    return (
        <ComponentDemoStates
            states={[
                {
                    key: "multiple",
                    title: locale === "ja" ? "複数選択" : "Multiple selection",
                    description:
                        locale === "ja"
                            ? "締切日や実施日など、連続しない複数の日付を同じ月内で選択します。"
                            : "Pick several non-contiguous dates in the same month for deadlines or event days.",
                    previewHeight: 460,
                    preview: (
                        <Calendar
                            mode="multiple"
                            selected={multiple}
                            onSelect={setMultiple}
                            defaultMonth={new Date(2026, 4, 1)}
                            locale={calendarLocale}
                            className="rounded-md border"
                        />
                    ),
                    code: `import { Calendar } from "@gunjo/ui";
import * as React from "react";

export default function MultipleCalendar() {
  const [dates, setDates] = React.useState<Date[] | undefined>([
    new Date(2026, 4, 4),
    new Date(2026, 4, 11),
    new Date(2026, 4, 18),
  ]);

  return (
    <Calendar
      mode="multiple"
      selected={dates}
      onSelect={setDates}
      defaultMonth={new Date(2026, 4, 1)}
      className="rounded-md border"
    />
  );
}`,
                },
                {
                    key: "range",
                    title: locale === "ja" ? "範囲選択" : "Range selection",
                    description:
                        locale === "ja"
                            ? "開始日と終了日を同じカレンダーで選択します。レポートの絞り込みや予約フローに使います。"
                            : "Pick a start and end date in one calendar. Useful for filtering reports or booking flows.",
                    previewHeight: 460,
                    preview: (
                        <Calendar
                            mode="range"
                            selected={range}
                            onSelect={setRange}
                            locale={calendarLocale}
                            className="rounded-md border"
                            numberOfMonths={2}
                        />
                    ),
                    code: `import { Calendar } from "@gunjo/ui";
import * as React from "react";
import type { DateRange } from "react-day-picker";

export default function RangeCalendar() {
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      className="rounded-md border"
      numberOfMonths={2}
    />
  );
}`,
                },
                {
                    key: "disabled-past",
                    title: locale === "ja" ? "過去日を無効化" : "Disable past dates",
                    description:
                        locale === "ja"
                            ? "予約フローなどで、すでに過ぎた日付を選択できないようにします。"
                            : "Booking flows: prevent selecting dates that have already happened.",
                    previewHeight: 460,
                    preview: (
                        <Calendar
                            mode="single"
                            selected={single}
                            onSelect={setSingle}
                            locale={calendarLocale}
                            className="rounded-md border"
                            disabled={{ before: today }}
                            disabledReason={disabledPastReason}
                        />
                    ),
                    code: `import { Calendar } from "@gunjo/ui";
import * as React from "react";

export default function FutureOnlyCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
      disabled={{ before: today }}
      disabledReason="${locale === "ja" ? "過去日は予約できません。今日以降の日付を選択してください。" : "Past dates cannot be booked. Choose today or a future date."}"
    />
  );
}`,
                },
            ]}
        />
    );
}

export default function CalendarPage() {
    const { locale, sectionLabels } = useLocale();
    const code = `import { Calendar } from "@gunjo/ui"
import React from "react"

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )
}`;

    const usageCode = `import { Calendar } from "@gunjo/ui"

export function CalendarUsage() {
  return <Calendar mode="single" />
}`

    return (
        <ComponentLayout
            title={inputsMetadata.calendar.title}
            description={inputsMetadata.calendar.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Calendar", href: "/docs/components/calendar" },
            ]}
            relatedComponents={[
                { name: "DatePicker", href: "/docs/components/date-picker" },
                { name: "DateRangePicker", href: "/docs/components/date-range-picker" },
                { name: "Popover", href: "/docs/components/popover" },
                { name: "Form", href: "/docs/components/form" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/calendar" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels}>
                <div className="flex items-center justify-center p-10">
                    <CalendarDemo />
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <CalendarStatesContent locale={locale} />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={[
                    { name: "mode", type: "'single' | 'multiple' | 'range' | 'default'", description: locale === "ja" ? "日付の選択モード。" : "The selection mode of the calendar." },
                    { name: "selected", type: "Date | Date[] | DateRange | undefined", description: locale === "ja" ? "選択中の日付、日付配列、または範囲。" : "The selected date(s)." },
                    { name: "onSelect", type: "(date: any) => void", description: locale === "ja" ? "日付を選択した時に呼ばれる処理です。" : "Event handler called when a date is selected." },
                    { name: "showOutsideDays", type: "boolean", default: "true", description: locale === "ja" ? "前後月の日付を表示するか。" : "Whether to show dates from the previous or next month." },
                    { name: "captionLayout", type: "'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'", default: "'dropdown'", description: locale === "ja" ? "月・年の表示方法です。初期状態では月と年を選択できるメニューを表示します。" : "Caption control style. Defaults to month and year dropdown navigation." },
                    { name: "startMonth", type: "Date", default: "current year - 10", description: locale === "ja" ? "月・年移動で選べる最初の月。" : "First month available in month/year navigation." },
                    { name: "endMonth", type: "Date", default: "current year + 10", description: locale === "ja" ? "月・年移動で選べる最後の月。" : "Last month available in month/year navigation." },
                    { name: "fixedWeeks", type: "boolean", default: "true", description: locale === "ja" ? "月ごとの行数差で高さが変わらないよう、常に6週分の高さで表示します。" : "Always render six weeks so the calendar height does not change between months." },
                    { name: "locale", type: "Locale", default: "ja", description: locale === "ja" ? "月名・曜日名の言語設定です。初期値は日本語です。" : "Locale for month and weekday labels. Defaults to Japanese." },
                    { name: "holidays", type: "CalendarHoliday[]", default: "japaneseHolidays", description: locale === "ja" ? "祝日として扱う日付リスト。外部ファイルの祝日データに差し替え可能。" : "Holiday dates. Replace with an external holiday file when needed." },
                    { name: "showHolidays", type: "boolean", default: "true", description: locale === "ja" ? "祝日の色分けを表示するかを指定します。" : "Whether to render holiday styling." },
                    { name: "showWeekendStyle", type: "boolean", default: "true", description: locale === "ja" ? "土曜・日曜の色分けを表示するかを指定します。" : "Whether to render Saturday and Sunday colors." },
                    { name: "disabledReason", type: "ReactNode", description: locale === "ja" ? "無効な日付に共通して表示する理由です。hover、focus、touch で Tooltip として表示します。" : "Shared reason shown for disabled dates on hover, focus, and touch." },
                    { name: "getDisabledReason", type: "(date, modifiers) => ReactNode", description: locale === "ja" ? "日付や modifier に応じて無効理由を出し分ける関数です。disabledReason より優先されます。" : "Returns a per-date disabled reason. Takes precedence over disabledReason." },
                    { name: "disabledReasonLabel", type: "string | (date, modifiers) => string", description: locale === "ja" ? "無効理由 Tooltip のトリガーに付与する支援技術向けラベルです。" : "Accessible label applied to the disabled-date tooltip trigger." },
                    { name: "disabledReasonPortalContainer", type: "HTMLElement | null", description: locale === "ja" ? "docs プレビューや擬似ブラウザ内に Tooltip を閉じ込めたい場合のポータル先です。" : "Portal container for keeping the tooltip inside a preview or fake-browser viewport." },
                    { name: "className", type: "string", description: locale === "ja" ? "ルート要素に追加するスタイル用クラスです。" : "Additional CSS classes." },
                ]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={usageCode} />
                </div>
            </div>
        </ComponentLayout>
    );
}
