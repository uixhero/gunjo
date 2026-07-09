"use client";

import * as React from "react";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { enUS } from "date-fns/locale/en-US";
import { ja } from "date-fns/locale/ja";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import inputsMetadata from "@design/inputs-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import { DatePickerDemo } from "@/components/demos/DatePickerDemo";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { DatePicker, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

function DatePickerStates({ locale }: { locale: "ja" | "en" }) {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [emptyDate, setEmptyDate] = React.useState<Date | undefined>();
    const [reviewDate, setReviewDate] = React.useState<Date | undefined>(new Date());
    const [bookingDate, setBookingDate] = React.useState<Date | undefined>();
    const calendarLocale = locale === "ja" ? ja : enUS;
    const calendarLabel = locale === "ja" ? "カレンダーを開く" : "Open calendar";
    const disabledReason = locale === "ja" ? "請求日が確定済みのため変更できません。" : "Locked because the invoice date is final.";
    const today = React.useMemo(() => new Date(), []);
    const soldOutDates = React.useMemo(
        () => [
            new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
            new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8),
        ],
        [today]
    );
    const disabledBookingDates = React.useMemo(
        () => [{ before: today }, soldOutDates],
        [soldOutDates, today]
    );
    const getBookingDisabledReason = React.useCallback(
        (day: Date) => {
            const isSoldOut = soldOutDates.some((soldOutDate) => (
                soldOutDate.getFullYear() === day.getFullYear() &&
                soldOutDate.getMonth() === day.getMonth() &&
                soldOutDate.getDate() === day.getDate()
            ));
            if (isSoldOut) return locale === "ja" ? "満席です。" : "Fully booked.";
            return locale === "ja" ? "過去日は選択できません。" : "Past dates are unavailable.";
        },
        [locale, soldOutDates]
    );

    return (
        <ComponentDemoStates
            states={[
                {
                    key: "selected",
                    title: locale === "ja" ? "選択済み" : "Selected date",
                    description:
                        locale === "ja"
                            ? "選択済みの日付を入力欄に表示します。フォーム項目として使う場合はラベルと組み合わせます。"
                            : "Displays the selected date in the trigger. Pair it with a Label when used as a form field.",
                    preview: (
                        <FormGroup className="w-full max-w-sm p-1">
                            <FormLabel htmlFor="publish-date-state">{locale === "ja" ? "公開日" : "Publish date"}</FormLabel>
                            <FormControl>
                                <DatePicker
                                    id="publish-date-state"
                                    value={date}
                                    onValueChange={setDate}
                                    locale={calendarLocale}
                                    calendarLabel={calendarLabel}
                                />
                            </FormControl>
                            <FormDescription>
                                {locale === "ja" ? "スケジュールに使う日付です。" : "Used for scheduling."}
                            </FormDescription>
                        </FormGroup>
                    ),
                    code: `import * as React from "react";
import { DatePicker, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";

export default function PublishDateField() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="publish-date">Publish date</FormLabel>
      <FormControl>
        <DatePicker id="publish-date" value={date} onValueChange={setDate} />
      </FormControl>
      <FormDescription>Used for scheduling.</FormDescription>
    </FormGroup>
  );
}`,
                },
                {
                    key: "empty",
                    title: locale === "ja" ? "未選択" : "Empty",
                    description:
                        locale === "ja"
                            ? "日付が未選択の状態です。未入力時の表示で、期待する入力形式を示します。"
                            : "No date is selected. Use placeholder to explain what the user should pick.",
                    preview: (
                        <FormGroup className="w-full max-w-sm p-1">
                            <FormLabel htmlFor="deadline-state">{locale === "ja" ? "締切日" : "Deadline"}</FormLabel>
                            <FormControl>
                                <DatePicker
                                    id="deadline-state"
                                    value={emptyDate}
                                    onValueChange={setEmptyDate}
                                    placeholder="yyyy-mm-dd"
                                    locale={calendarLocale}
                                    calendarLabel={calendarLabel}
                                />
                            </FormControl>
                        </FormGroup>
                    ),
                    code: `import * as React from "react";
import { DatePicker, FormControl, FormGroup, FormLabel } from "@gunjo/ui";

export default function EmptyDateField() {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="deadline">Deadline</FormLabel>
      <FormControl>
        <DatePicker id="deadline" value={date} onValueChange={setDate} placeholder="yyyy-mm-dd" />
      </FormControl>
    </FormGroup>
  );
}`,
                },
                {
                    key: "persistent",
                    title: locale === "ja" ? "連続選択" : "Keep calendar open",
                    description:
                        locale === "ja"
                            ? "日付を選びながら比較したい場合は、選択後もカレンダーを開いたままにできます。"
                            : "Set closeOnSelect to false when users need to compare dates while selecting.",
                    preview: (
                        <FormGroup className="w-full max-w-sm p-1">
                            <FormLabel htmlFor="review-date-state">{locale === "ja" ? "確認日" : "Review date"}</FormLabel>
                            <FormControl>
                                <DatePicker
                                    id="review-date-state"
                                    value={reviewDate}
                                    onValueChange={setReviewDate}
                                    locale={calendarLocale}
                                    calendarLabel={calendarLabel}
                                    closeOnSelect={false}
                                />
                            </FormControl>
                            <FormDescription>
                                {locale === "ja" ? "複数の日付を見比べながら選べます。" : "Compare multiple dates without reopening the calendar."}
                            </FormDescription>
                        </FormGroup>
                    ),
                    code: `import * as React from "react";
import { DatePicker, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";

export default function PersistentDateField() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="review-date">Review date</FormLabel>
      <FormControl>
        <DatePicker id="review-date" value={date} onValueChange={setDate} closeOnSelect={false} />
      </FormControl>
      <FormDescription>Compare multiple dates without reopening the calendar.</FormDescription>
    </FormGroup>
  );
}`,
                },
                {
                    key: "disabled-dates",
                    title: locale === "ja" ? "日付ごとの無効化" : "Disabled dates",
                    description:
                        locale === "ja"
                            ? "disabledDates と modifiers を使うと、過去日や満席日を DatePicker から直接無効化できます。"
                            : "Use disabledDates and modifiers to disable past dates or fully booked days directly from DatePicker.",
                    preview: (
                        <FormGroup className="w-full max-w-sm p-1">
                            <FormLabel htmlFor="booking-date-state">{locale === "ja" ? "予約日" : "Booking date"}</FormLabel>
                            <FormControl>
                                <DatePicker
                                    id="booking-date-state"
                                    value={bookingDate}
                                    onValueChange={setBookingDate}
                                    locale={calendarLocale}
                                    calendarLabel={calendarLabel}
                                    disabledDates={disabledBookingDates}
                                    startMonth={new Date(today.getFullYear(), today.getMonth(), 1)}
                                    modifiers={{ soldOut: soldOutDates }}
                                    modifiersClassNames={{
                                        soldOut: "[&>button]:bg-destructive/10 [&>button]:text-destructive [&>button]:line-through",
                                    }}
                                    getDisabledReason={getBookingDisabledReason}
                                    disabledReasonLabel={(day) => getBookingDisabledReason(day)}
                                />
                            </FormControl>
                            <FormDescription>
                                {locale === "ja" ? "過去日と満席日は選択できません。" : "Past and fully booked dates cannot be selected."}
                            </FormDescription>
                        </FormGroup>
                    ),
                    code: `import * as React from "react";
import { DatePicker, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";

export default function BookingDateField() {
  const [date, setDate] = React.useState<Date | undefined>();
  const today = React.useMemo(() => new Date(), []);
  const soldOutDates = React.useMemo(
    () => [
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8),
    ],
    [today]
  );

  const getDisabledReason = React.useCallback(
    (day: Date) => {
      const isSoldOut = soldOutDates.some((soldOutDate) =>
        soldOutDate.toDateString() === day.toDateString()
      );
      return isSoldOut ? "Fully booked." : "Past dates are unavailable.";
    },
    [soldOutDates]
  );

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="booking-date">Booking date</FormLabel>
      <FormControl>
        <DatePicker
          id="booking-date"
          value={date}
          onValueChange={setDate}
          disabledDates={[{ before: today }, soldOutDates]}
          startMonth={new Date(today.getFullYear(), today.getMonth(), 1)}
          modifiers={{ soldOut: soldOutDates }}
          modifiersClassNames={{
            soldOut: "[&>button]:bg-destructive/10 [&>button]:text-destructive [&>button]:line-through",
          }}
          getDisabledReason={getDisabledReason}
          disabledReasonLabel={(day) => getDisabledReason(day)}
        />
      </FormControl>
      <FormDescription>Past and fully booked dates cannot be selected.</FormDescription>
    </FormGroup>
  );
}`,
                },
                {
                    key: "disabled",
                    title: locale === "ja" ? "無効" : "Disabled",
                    description:
                        locale === "ja"
                            ? "変更できない日付は操作できない状態にします。必要に応じて理由を補足します。"
                            : "Disable the picker when the date cannot be changed. Explain why when needed.",
                    preview: (
                        <FormGroup className="w-full max-w-sm p-1">
                            <FormLabel htmlFor="locked-date-state">{locale === "ja" ? "請求日" : "Billing date"}</FormLabel>
                            <FormControl>
                                <DisabledReasonTooltip fullWidth reason={disabledReason}>
                                    <DatePicker
                                        id="locked-date-state"
                                        value={date}
                                        onValueChange={setDate}
                                        locale={calendarLocale}
                                        calendarLabel={calendarLabel}
                                        disabled
                                    />
                                </DisabledReasonTooltip>
                            </FormControl>
                            <FormDescription>
                                {disabledReason}
                            </FormDescription>
                        </FormGroup>
                    ),
                    code: `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { DatePicker, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";

export default function LockedDateField({ date }: { date: Date }) {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="billing-date">Billing date</FormLabel>
      <FormControl>
        <DisabledReasonTooltip fullWidth reason="Locked because the invoice date is final.">
          <DatePicker id="billing-date" value={date} disabled />
        </DisabledReasonTooltip>
      </FormControl>
      <FormDescription>Locked because the invoice date is final.</FormDescription>
    </FormGroup>
  );
}`,
                },
            ]}
        />
    );
}

export default function DatePickerPage() {
    const { locale, sectionLabels } = useLocale();
    const code = `import * as React from "react";
import { DatePicker, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="publish-date">${locale === "ja" ? "公開日" : "Publish date"}</FormLabel>
      <FormControl>
        <DatePicker id="publish-date" value={date} onValueChange={setDate} />
      </FormControl>
      <FormDescription>${locale === "ja" ? "スケジュールに使う日付を選択します。" : "Pick the date used for scheduling."}</FormDescription>
    </FormGroup>
  );
}`;

    const usageCode = `import * as React from "react";
import { DatePicker, FormControl, FormGroup, FormLabel } from "@gunjo/ui";

export function DatePickerUsage() {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="date">Date</FormLabel>
      <FormControl>
        <DatePicker id="date" value={date} onValueChange={setDate} placeholder="yyyy-mm-dd" />
      </FormControl>
    </FormGroup>
  );
}`;

    const propsData = [
        { name: "id", type: "string", description: locale === "ja" ? "入力欄に付与する ID です。ラベルと紐づけます。" : "Applied to the input so FormLabel can target the picker." },
        { name: "value", type: "Date", description: locale === "ja" ? "選択中の日付。" : "Controlled selected date." },
        { name: "onValueChange", type: "(date: Date | undefined) => void", description: locale === "ja" ? "入力またはカレンダー選択で日付が変わった時に呼ばれます。" : "Callback fired when selection changes by typing or calendar selection." },
        { name: "placeholder", type: "string", default: "'yyyy-mm-dd'", description: locale === "ja" ? "未入力時に表示する入力形式のヒントです。" : "Input format hint shown when empty." },
        { name: "dateFormat", type: "string", default: "'yyyy-MM-dd'", description: locale === "ja" ? "表示に使う日付書式です。直接入力では yyyy-MM-dd を解釈します。" : "date-fns format string for display. Direct input parses yyyy-MM-dd." },
        { name: "editable", type: "boolean", default: "true", description: locale === "ja" ? "直接入力を許可するかを指定します。許可しない場合はカレンダー選択専用にできます。" : "Whether direct typing is allowed. Set false for calendar-only selection." },
        { name: "locale", type: "Locale", description: locale === "ja" ? "カレンダーと表示書式に使う言語設定です。" : "date-fns locale used by the calendar and formatted value." },
        { name: "calendarLabel", type: "string", default: "'Open calendar'", description: locale === "ja" ? "カレンダーを開くアイコンボタンの読み上げ用ラベルです。" : "Accessible label for the calendar icon button." },
        { name: "todayLabel", type: "string", description: locale === "ja" ? "今日へ戻すボタンのラベルです。未指定時は表示言語に合わせます。" : "Label for the today shortcut button. Falls back to the active locale." },
        { name: "previousLabel", type: "string", description: locale === "ja" ? "今日へ戻す前の日付へ戻るボタンのラベルです。未指定時は表示言語に合わせます。" : "Label for the shortcut button that returns to the date before jumping to today. Falls back to the active locale." },
        { name: "showTodayButton", type: "boolean", default: "true", description: locale === "ja" ? "カレンダー下部に今日へ戻すボタンを表示するか。" : "Whether to show the shortcut button that returns to today." },
        { name: "closeOnSelect", type: "boolean", default: "true", description: locale === "ja" ? "日付をクリックした時にカレンダーを閉じるかを指定します。選択しながら比較する用途では、開いたままにします。" : "Whether the calendar closes after selecting a date. Set false when users need to compare dates while selecting." },
        { name: "disabledDates", type: "Matcher | Matcher[]", description: locale === "ja" ? "Calendar の disabled matcher に渡す日付単位の無効化条件です。disabled boolean とは別です。" : "Date-level disabled matcher forwarded to Calendar. Separate from the boolean disabled prop." },
        { name: "modifiers", type: "CalendarProps['modifiers']", description: locale === "ja" ? "Calendar に渡す日付 modifier です。満席日、休日、予約可能日などの装飾に使います。" : "Date modifiers forwarded to Calendar for states such as sold out, holiday, or available." },
        { name: "modifiersClassNames", type: "CalendarProps['modifiersClassNames']", description: locale === "ja" ? "modifier ごとの className を Calendar に渡します。" : "Class names for each Calendar modifier." },
        { name: "startMonth", type: "Date", description: locale === "ja" ? "月・年移動で選べる最初の月を Calendar に渡します。" : "First month available in Calendar month/year navigation." },
        { name: "endMonth", type: "Date", description: locale === "ja" ? "月・年移動で選べる最後の月を Calendar に渡します。" : "Last month available in Calendar month/year navigation." },
        { name: "getDisabledReason", type: "(date: Date, modifiers: Modifiers) => ReactNode", description: locale === "ja" ? "無効日ごとの理由を Calendar の Tooltip に表示します。" : "Returns the per-date disabled reason shown by Calendar tooltip." },
        { name: "disabled", type: "boolean", description: locale === "ja" ? "入力とカレンダー操作を無効化します。" : "Disables the input and calendar button." },
    ];

    return (
        <ComponentLayout
            title={(inputsMetadata as Record<string, { title: string }>).datePicker.title}
            description={(inputsMetadata as Record<string, { description: string }>).datePicker.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "DatePicker", href: "/docs/components/date-picker" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Calendar", href: "/docs/components/calendar" },
                { name: "Popover", href: "/docs/components/popover" },
            ]}
            relatedComponents={[
                { name: "DateRangePicker", href: "/docs/components/date-range-picker" },
                { name: "Calendar", href: "/docs/components/calendar" },
                { name: "Form", href: "/docs/components/form" },
                { name: "TimePicker", href: "/docs/components/time-picker" },
            ]}
        >
            <ComponentPreview
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewHeight="auto"
                previewBodyWidth="md"
            >
                <DatePickerDemo />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <DatePickerStates locale={locale} />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
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
