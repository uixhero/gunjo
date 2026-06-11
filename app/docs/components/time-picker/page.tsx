"use client";

import * as React from "react";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { TimePickerDemo } from "@/components/demos/TimePickerDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { FormControl, FormDescription, FormGroup, FormLabel, TimePicker } from "@gunjo/ui";

function TimePickerStatePreview({
    hour12,
    minuteStep = 1,
    disabled,
}: {
    hour12?: boolean;
    minuteStep?: 1 | 5 | 10 | 15 | 30;
    disabled?: boolean;
}) {
    const { locale } = useLocale();
    const [time, setTime] = React.useState(hour12 ? "09:30" : "14:30");
    const picker = (
        <TimePicker
            value={time}
            onValueChange={setTime}
            hour12={hour12}
            minuteStep={minuteStep}
            disabled={disabled}
            hourLabel={locale === "ja" ? "時" : "Hour"}
            minuteLabel={locale === "ja" ? "分" : "Minute"}
            periodLabel={locale === "ja" ? "午前/午後" : "AM/PM"}
            className="w-full justify-start"
        />
    );

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel>{locale === "ja" ? "開始時刻" : "Start time"}</FormLabel>
            <FormControl>
                {disabled ? (
                    <DisabledReasonTooltip fullWidth reason={locale === "ja" ? "公開後の開始時刻は変更できません。" : "The start time cannot be changed after publishing."}>
                        {picker}
                    </DisabledReasonTooltip>
                ) : (
                    picker
                )}
            </FormControl>
            <FormDescription>
                {disabled
                    ? locale === "ja"
                        ? "変更が必要な場合は下書きに戻してください。"
                        : "Move the item back to draft before editing."
                    : hour12
                        ? locale === "ja"
                            ? `12時間表記で表示しています。保存される値は「${time}」です。`
                            : `12-hour UI, stored value = "${time}".`
                        : locale === "ja"
                            ? `24時間表記で表示しています。保存される値は「${time}」です。`
                            : `24-hour UI, stored value = "${time}".`}
            </FormDescription>
        </FormGroup>
    );
}

export default function TimePickerPage() {
    const { locale, sectionLabels } = useLocale();
    const code = `import * as React from "react";
import { FormControl, FormDescription, FormGroup, FormLabel, TimePicker } from "@gunjo/ui";

export function TimePickerDemo() {
  const [time, setTime] = React.useState("14:30");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel>${locale === "ja" ? "開始時刻" : "Start time"}</FormLabel>
      <FormControl>
        <TimePicker
          value={time}
          onValueChange={setTime}
          hourLabel="${locale === "ja" ? "時" : "Hour"}"
          minuteLabel="${locale === "ja" ? "分" : "Minute"}"
        />
      </FormControl>
      <FormDescription>${locale === "ja" ? '24時間表記で表示しています。保存される値は「${time}」です。' : '24-hour time, value = "${time}".'}</FormDescription>
    </FormGroup>
  );
}`;
    const usageCode = `import * as React from "react";
import { FormControl, FormGroup, FormLabel, TimePicker } from "@gunjo/ui";

export function MeetingTimeField() {
  const [time, setTime] = React.useState("09:00");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel>${locale === "ja" ? "会議時刻" : "Meeting time"}</FormLabel>
      <FormControl>
        <TimePicker
          value={time}
          onValueChange={setTime}
          minuteStep={15}
          hourLabel="${locale === "ja" ? "時" : "Hour"}"
          minuteLabel="${locale === "ja" ? "分" : "Minute"}"
        />
      </FormControl>
    </FormGroup>
  );
}`;
    const propsData = [
        { name: "value", type: "string", description: locale === "ja" ? "24時間表記の `HH:mm` 値です。空文字は未設定として扱います。" : "Time in 24-hour `HH:mm` format. Empty string means unset." },
        { name: "onValueChange", type: "(value: string) => void", description: locale === "ja" ? "値が変わった時に呼ばれます。返る値は常に `HH:mm` です。" : "Called when the value changes. The emitted value is always `HH:mm`." },
        { name: "hour12", type: "boolean", default: "false", description: locale === "ja" ? "12時間表記にし、午前/午後を選べるようにします。" : "Uses 12-hour display with an AM/PM select." },
        { name: "minuteStep", type: "1 | 5 | 10 | 15 | 30", default: "1", description: locale === "ja" ? "分の選択単位です。" : "Minute select granularity." },
        { name: "hourLabel / minuteLabel / periodLabel", type: "string", description: locale === "ja" ? "時・分・午前/午後の各選択欄に付ける、支援技術向けのラベルです。" : "Accessible labels for each select." },
        { name: "disabled", type: "boolean", default: "false", description: locale === "ja" ? "時刻を変更できない状態にします。理由はツールチップで補足します。" : "Disables the picker. Explain the reason with a tooltip." },
    ];

    return (
        <ComponentLayout
            title={(inputsMetadata as Record<string, { title: string }>).timePicker.title}
            description={(inputsMetadata as Record<string, { description: string }>).timePicker.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "TimePicker", href: "/docs/components/time-picker" },
                { name: "FormGroup", href: "/docs/components/form" },
                { name: "FormLabel", href: "/docs/components/form" },
                { name: "FormControl", href: "/docs/components/form" },
                { name: "FormDescription", href: "/docs/components/form" },
            ]}
            relatedComponents={[
                { name: "DatePicker", href: "/docs/components/date-picker" },
                { name: "DateRangePicker", href: "/docs/components/date-range-picker" },
                { name: "Select", href: "/docs/components/select" },
                { name: "Form", href: "/docs/components/form" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/time-picker" previewBodyWidth="md" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels}>
                <TimePickerDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "24-hour",
                            title: locale === "ja" ? "24時間表記" : "24-hour",
                            description: locale === "ja" ? "表示と保存値を24時間表記の `HH:mm` に揃えます。" : "Display and store values as `HH:mm`.",
                            preview: <TimePickerStatePreview />,
                            previewHeight: 170,
                            code,
                        },
                        {
                            key: "12-hour",
                            title: locale === "ja" ? "12時間表記" : "12-hour",
                            description: locale === "ja" ? "画面上は午前/午後で選べるようにし、保存値は24時間表記に統一します。" : "Show AM/PM in the UI while storing a 24-hour value.",
                            preview: <TimePickerStatePreview hour12 minuteStep={15} />,
                            previewHeight: 170,
                            code: `<TimePicker value={time} onValueChange={setTime} hour12 minuteStep={15} />`,
                        },
                        {
                            key: "step",
                            title: locale === "ja" ? "15分単位" : "15-minute step",
                            description: locale === "ja" ? "予約やスケジュールでは分の選択肢を絞れます。" : "Limit minute options for scheduling use cases.",
                            preview: <TimePickerStatePreview minuteStep={15} />,
                            previewHeight: 170,
                            code: `<TimePicker value={time} onValueChange={setTime} minuteStep={15} />`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "変更できない理由はツールチップと補足文で説明します。" : "Explain disabled state with a tooltip and helper text.",
                            preview: <TimePickerStatePreview disabled />,
                            previewHeight: 170,
                            code: `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";

<DisabledReasonTooltip fullWidth reason="${locale === "ja" ? "公開後の開始時刻は変更できません。" : "The start time cannot be changed after publishing."}">
  <TimePicker value="14:30" disabled />
</DisabledReasonTooltip>`,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </section>
        </ComponentLayout>
    );
}
