"use client";

import * as React from "react";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { enUS } from "date-fns/locale/en-US";
import { ja } from "date-fns/locale/ja";
import type { DateRange } from "react-day-picker";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import inputsMetadata from "@design/inputs-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import { DateRangePickerDemo } from "@/components/demos/DateRangePickerDemo";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { DateRangePicker, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

function createRange(daysFromToday: number, durationDays: number): DateRange {
    const from = new Date();
    from.setDate(from.getDate() + daysFromToday);
    const to = new Date(from);
    to.setDate(from.getDate() + durationDays - 1);
    return { from, to };
}

function DateRangePickerStates({ locale }: { locale: "ja" | "en" }) {
    const [range, setRange] = React.useState<DateRange | undefined>(() => createRange(0, 14));
    const [emptyRange, setEmptyRange] = React.useState<DateRange | undefined>();
    const [persistentRange, setPersistentRange] = React.useState<DateRange | undefined>(() => createRange(0, 7));
    const lockedRange = React.useMemo(() => createRange(7, 5), []);
    const calendarLocale = locale === "ja" ? ja : enUS;
    const calendarLabel = locale === "ja" ? "カレンダーを開く" : "Open calendar";
    const disabledReason = locale === "ja" ? "公開予約が確定しているため変更できません。" : "Locked because the publication window is final.";

    return (
        <ComponentDemoStates
            states={[
                {
                    key: "selected",
                    title: locale === "ja" ? "範囲選択済み" : "Selected range",
                    description:
                        locale === "ja"
                            ? "開始日と終了日が選択された状態です。キャンペーン期間やレポート期間の入力に使います。"
                            : "A start and end date are selected. Use this for campaign windows or report periods.",
                    preview: (
                        <FormGroup className="w-full max-w-sm">
                            <FormLabel htmlFor="campaign-window-state">
                                {locale === "ja" ? "キャンペーン期間" : "Campaign window"}
                            </FormLabel>
                            <FormControl>
                                <DateRangePicker
                                    id="campaign-window-state"
                                    value={range}
                                    onValueChange={setRange}
                                    locale={calendarLocale}
                                    calendarLabel={calendarLabel}
                                    maxRangeDays={365}
                                />
                            </FormControl>
                            <FormDescription>
                                {locale === "ja" ? "開始日と終了日をまとめて選択します。" : "Choose start and end dates together."}
                            </FormDescription>
                        </FormGroup>
                    ),
                    code: `import * as React from "react";
import type { DateRange } from "react-day-picker";
import { DateRangePicker, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";

export default function CampaignWindowField() {
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="campaign-window">Campaign window</FormLabel>
      <FormControl>
        <DateRangePicker id="campaign-window" value={range} onValueChange={setRange} />
      </FormControl>
      <FormDescription>Choose start and end dates together.</FormDescription>
    </FormGroup>
  );
}`,
                },
                {
                    key: "empty",
                    title: locale === "ja" ? "未選択" : "Empty",
                    description:
                        locale === "ja"
                            ? "期間が未選択の状態です。未入力時の表示で、期待する入力内容を案内します。"
                            : "No date range is selected. Use placeholder text to guide the expected input.",
                    preview: (
                        <FormGroup className="w-full max-w-sm">
                            <FormLabel htmlFor="report-period-state">
                                {locale === "ja" ? "レポート期間" : "Report period"}
                            </FormLabel>
                            <FormControl>
                                <DateRangePicker
                                    id="report-period-state"
                                    value={emptyRange}
                                    onValueChange={setEmptyRange}
                                    placeholder="yyyy-mm-dd - yyyy-mm-dd"
                                    locale={calendarLocale}
                                    calendarLabel={calendarLabel}
                                />
                            </FormControl>
                        </FormGroup>
                    ),
                    code: `import * as React from "react";
import type { DateRange } from "react-day-picker";
import { DateRangePicker, FormControl, FormGroup, FormLabel } from "@gunjo/ui";

export default function EmptyRangeField() {
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="report-period">Report period</FormLabel>
      <FormControl>
        <DateRangePicker
          id="report-period"
          value={range}
          onValueChange={setRange}
          placeholder="Pick a date range"
        />
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
                            ? "期間を見比べながら調整したい場合は、選択後もカレンダーを開いたままにできます。"
                            : "Set closeOnSelect to false when users need to compare and adjust ranges while selecting.",
                    preview: (
                        <FormGroup className="w-full max-w-sm">
                            <FormLabel htmlFor="comparison-period-state">
                                {locale === "ja" ? "比較期間" : "Comparison period"}
                            </FormLabel>
                            <FormControl>
                                <DateRangePicker
                                    id="comparison-period-state"
                                    value={persistentRange}
                                    onValueChange={setPersistentRange}
                                    locale={calendarLocale}
                                    calendarLabel={calendarLabel}
                                    closeOnSelect={false}
                                />
                            </FormControl>
                            <FormDescription>
                                {locale === "ja" ? "複数の期間を見比べながら選べます。" : "Compare multiple ranges without reopening the calendar."}
                            </FormDescription>
                        </FormGroup>
                    ),
                    code: `import * as React from "react";
import type { DateRange } from "react-day-picker";
import { DateRangePicker, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";

export default function PersistentRangeField() {
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="comparison-period">Comparison period</FormLabel>
      <FormControl>
        <DateRangePicker id="comparison-period" value={range} onValueChange={setRange} closeOnSelect={false} />
      </FormControl>
      <FormDescription>Compare multiple ranges without reopening the calendar.</FormDescription>
    </FormGroup>
  );
}`,
                },
                {
                    key: "disabled",
                    title: locale === "ja" ? "無効" : "Disabled",
                    description:
                        locale === "ja"
                            ? "確定済みで変更できない期間は操作できない状態にします。必要に応じて理由を補足します。"
                            : "Disable the picker when the range is locked. Explain why when needed.",
                    preview: (
                        <FormGroup className="w-full max-w-sm">
                            <FormLabel htmlFor="locked-window-state">
                                {locale === "ja" ? "公開期間" : "Publication window"}
                            </FormLabel>
                            <FormControl>
                                <DisabledReasonTooltip fullWidth reason={disabledReason}>
                                    <DateRangePicker
                                        id="locked-window-state"
                                        value={lockedRange}
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
import type { DateRange } from "react-day-picker";
import { DateRangePicker, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";

export default function LockedRangeField({ range }: { range: DateRange }) {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="publication-window">Publication window</FormLabel>
      <FormControl>
        <DisabledReasonTooltip fullWidth reason="Locked because the publication window is final.">
          <DateRangePicker id="publication-window" value={range} disabled />
        </DisabledReasonTooltip>
      </FormControl>
      <FormDescription>Locked because the publication window is final.</FormDescription>
    </FormGroup>
  );
}`,
                },
            ]}
        />
    );
}

export default function DateRangePickerPage() {
    const { locale, sectionLabels } = useLocale();
    const code = `import * as React from "react";
import type { DateRange } from "react-day-picker";
import { DateRangePicker, FormControl, FormDescription, FormGroup, FormLabel } from "@gunjo/ui";

export function DateRangePickerDemo() {
  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(today.getDate() + 13);
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: today,
    to: twoWeeksLater,
  });

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="campaign-window">${locale === "ja" ? "キャンペーン期間" : "Campaign window"}</FormLabel>
      <FormControl>
        <DateRangePicker
          id="campaign-window"
          value={range}
          onValueChange={setRange}
          maxRangeDays={365}
        />
      </FormControl>
      <FormDescription>${locale === "ja" ? "開始日と終了日をまとめて選択します。" : "Choose start and end dates together."}</FormDescription>
    </FormGroup>
  );
}`;

    const usageCode = `import * as React from "react";
import type { DateRange } from "react-day-picker";
import { DateRangePicker, FormControl, FormGroup, FormLabel } from "@gunjo/ui";

export function DateRangePickerUsage() {
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="date-range">Date range</FormLabel>
      <FormControl>
        <DateRangePicker
          id="date-range"
          value={range}
          onValueChange={setRange}
          numberOfMonths={2}
          maxRangeDays={365}
        />
      </FormControl>
    </FormGroup>
  );
}`;

    const propsData = [
        { name: "id", type: "string", description: locale === "ja" ? "入力欄に付与する ID です。ラベルと紐づけます。" : "Applied to the input so FormLabel can target the picker." },
        { name: "value", type: "DateRange", description: locale === "ja" ? "選択中の期間です。開始日と終了日を持つ値を使います。" : "Controlled selected range { from, to } from react-day-picker." },
        { name: "onValueChange", type: "(range: DateRange | undefined) => void", description: locale === "ja" ? "入力またはカレンダー選択で期間が変わった時に呼ばれます。" : "Callback fired when the range changes by typing or calendar selection." },
        { name: "placeholder", type: "string", default: "'yyyy-mm-dd - yyyy-mm-dd'", description: locale === "ja" ? "未入力時に表示する入力形式のヒントです。" : "Input format hint shown when empty." },
        { name: "dateFormat", type: "string", default: "'yyyy-MM-dd'", description: locale === "ja" ? "表示に使う日付書式です。直接入力では yyyy-MM-dd を解釈します。" : "date-fns format string for display. Direct input parses yyyy-MM-dd." },
        { name: "numberOfMonths", type: "number", default: "2", description: locale === "ja" ? "開いたカレンダー内に横並びで表示する月数です。" : "Number of months shown side-by-side in the popover." },
        { name: "responsiveMonths", type: "boolean", default: "true", description: locale === "ja" ? "スマホ幅では表示月数を 1 に減らし、縦スクロールなしで操作しやすくします。" : "Collapses numberOfMonths to 1 on mobile-width viewports so the calendar remains easier to operate without vertical scrolling." },
        { name: "editable", type: "boolean", default: "true", description: locale === "ja" ? "直接入力を許可するかを指定します。許可しない場合はカレンダー選択専用にできます。" : "Whether direct typing is allowed. Set false for calendar-only selection." },
        { name: "locale", type: "Locale", description: locale === "ja" ? "カレンダーと表示書式に使う言語設定です。" : "date-fns locale used by the calendar and formatted value." },
        { name: "calendarLabel", type: "string", default: "'Open calendar'", description: locale === "ja" ? "カレンダーアイコンボタンの読み上げ用ラベルです。開いている時は閉じる文言に切り替わります。" : "Accessible label for the calendar icon button. It changes to a close label while open." },
        { name: "todayLabel", type: "string", description: locale === "ja" ? "今日へ戻すボタンのラベルです。未指定時は表示言語に合わせます。" : "Label for the today shortcut button. Falls back to the active locale." },
        { name: "previousLabel", type: "string", description: locale === "ja" ? "今日へ戻す前の期間へ戻るボタンのラベルです。未指定時は表示言語に合わせます。" : "Label for the shortcut button that returns to the range before jumping to today. Falls back to the active locale." },
        { name: "showTodayButton", type: "boolean", default: "true", description: locale === "ja" ? "カレンダー下部に今日へ戻すボタンを表示するか。" : "Whether to show the shortcut button that returns to today." },
        { name: "closeOnSelect", type: "boolean", default: "true", description: locale === "ja" ? "開始日と終了日が揃った時にカレンダーを閉じるかを指定します。期間を見比べる用途では、開いたままにします。" : "Whether the calendar closes after both dates are selected. Set false when users need to compare ranges." },
        { name: "maxRangeDays", type: "number", description: locale === "ja" ? "選択できる最大日数。3か月なら 90、半年なら 180、1年なら 365 のように用途ごとに指定します。未指定の場合は上限を設けません。" : "Maximum selectable range in days. Use 90 for three months, 180 for six months, or 365 for one year. Leave undefined for no limit." },
        { name: "disabled", type: "boolean", default: "false", description: locale === "ja" ? "入力とカレンダー操作を無効化します。" : "Disables the input and calendar button." },
    ];

    return (
        <ComponentLayout
            title={(inputsMetadata as Record<string, { title: string }>).dateRangePicker.title}
            description={(inputsMetadata as Record<string, { description: string }>).dateRangePicker.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "DateRangePicker", href: "/docs/components/date-range-picker" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Calendar", href: "/docs/components/calendar" },
                { name: "Popover", href: "/docs/components/popover" },
            ]}
            relatedComponents={[
                { name: "DatePicker", href: "/docs/components/date-picker" },
                { name: "Calendar", href: "/docs/components/calendar" },
                { name: "Form", href: "/docs/components/form" },
                { name: "Combobox", href: "/docs/components/combobox" },
            ]}
        >
            <ComponentPreview
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewHeight="auto"
                previewBodyWidth="md"
            >
                <DateRangePickerDemo />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <DateRangePickerStates locale={locale} />
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
