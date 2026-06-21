"use client"

import * as React from "react"
import { ja } from "date-fns/locale/ja"
import {
    DayButton as DayPickerDayButton,
    DayPicker,
    type DayButtonProps,
    type Matcher,
    type Modifiers,
} from "react-day-picker"

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import { calendarDateKey, japaneseHolidays, type CalendarHoliday } from "./calendar-holidays"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
    holidays?: CalendarHoliday[]
    showHolidays?: boolean
    showWeekendStyle?: boolean
    /**
     * Shared explanation shown when a disabled day is hovered, focused, or
     * tapped. Use `getDisabledReason` when the reason depends on the date.
     */
    disabledReason?: React.ReactNode
    getDisabledReason?: (date: Date, modifiers: Modifiers) => React.ReactNode
    disabledReasonLabel?: string | ((date: Date, modifiers: Modifiers) => string)
    disabledReasonPortalContainer?: HTMLElement | null
}

function Calendar({
    className,
    classNames,
    components,
    locale = ja,
    holidays = japaneseHolidays,
    // Japanese national holidays are opt-in: an international consumer of the
    // public package shouldn't get them by default. Pass `showHolidays` to enable
    // (and `locale`/`holidays` to localize). (#141)
    showHolidays = false,
    showWeekendStyle = true,
    disabledReason,
    getDisabledReason,
    disabledReasonLabel,
    disabledReasonPortalContainer,
    modifiers,
    modifiersClassNames,
    showOutsideDays = true,
    captionLayout = "dropdown",
    startMonth,
    endMonth,
    formatters,
    labels,
    fixedWeeks = true,
    ...props
}: CalendarProps) {
    const holidayMatcher = React.useMemo<Matcher>(() => {
        const holidayKeys = new Set(holidays.map((item) => calendarDateKey(item.date)))
        return (date: Date) => holidayKeys.has(calendarDateKey(date))
    }, [holidays])

    const numberOfMonths = "numberOfMonths" in props ? props.numberOfMonths : undefined
    const today = React.useMemo(() => new Date(), [])
    const defaultStartMonth = React.useMemo(
        () => new Date(today.getFullYear() - 10, 0, 1),
        [today]
    )
    const defaultEndMonth = React.useMemo(
        () => new Date(today.getFullYear() + 10, 11, 31),
        [today]
    )
    const isJapaneseLocale = (locale as { code?: string })?.code === "ja"
    const BaseDayButton = components?.DayButton ?? DayPickerDayButton
    const DayButtonWithDisabledReason = React.useCallback(
        (dayButtonProps: DayButtonProps) => {
            const reason = dayButtonProps.modifiers.disabled
                ? getDisabledReason?.(dayButtonProps.day.date, dayButtonProps.modifiers) ?? disabledReason
                : null
            const button = <BaseDayButton {...dayButtonProps} />

            if (!reason) return button

            const label =
                typeof disabledReasonLabel === "function"
                    ? disabledReasonLabel(dayButtonProps.day.date, dayButtonProps.modifiers)
                    : disabledReasonLabel ?? (typeof reason === "string" ? reason : undefined)

            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span
                            className="inline-flex h-10 w-10 items-center justify-center"
                            tabIndex={0}
                            aria-label={label}
                        >
                            {button}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent
                        portalContainer={disabledReasonPortalContainer}
                        className="max-w-64 text-left"
                    >
                        {reason}
                    </TooltipContent>
                </Tooltip>
            )
        },
        [
            BaseDayButton,
            disabledReason,
            disabledReasonLabel,
            disabledReasonPortalContainer,
            getDisabledReason,
        ]
    )

    return (
        <DayPicker
            locale={locale}
            showOutsideDays={showOutsideDays}
            fixedWeeks={fixedWeeks}
            captionLayout={captionLayout}
            startMonth={startMonth ?? defaultStartMonth}
            endMonth={endMonth ?? defaultEndMonth}
            components={{
                ...components,
                DayButton: DayButtonWithDisabledReason,
            }}
            formatters={{
                ...(isJapaneseLocale
                    ? {
                        formatYearDropdown: (year: Date) => `${year.getFullYear()}年`,
                    }
                    : {}),
                ...formatters,
            }}
            labels={{
                ...(isJapaneseLocale
                    ? {
                        labelMonthDropdown: () => "月を選択",
                        labelYearDropdown: () => "年を選択",
                        labelPrevious: () => "前の月へ",
                        labelNext: () => "次の月へ",
                    }
                    : {}),
                ...labels,
            }}
            className={cn(
                "w-[320px] max-w-full rounded-lg border bg-card p-4",
                Number(numberOfMonths ?? 1) > 1 && "sm:!w-fit",
                className
            )}
            modifiers={{
                ...(showWeekendStyle
                    ? {
                        sunday: { dayOfWeek: [0] },
                        saturday: { dayOfWeek: [6] },
                    }
                    : {}),
                ...(showHolidays ? { holiday: holidayMatcher } : {}),
                ...modifiers,
            }}
            modifiersClassNames={{
                sunday: "[&:not(.gunjo-calendar-selected):not(.gunjo-calendar-disabled):not(.gunjo-calendar-outside)>button]:text-destructive",
                saturday: "[&:not(.gunjo-calendar-selected):not(.gunjo-calendar-disabled):not(.gunjo-calendar-outside)>button]:text-info",
                holiday: "[&:not(.gunjo-calendar-selected):not(.gunjo-calendar-disabled):not(.gunjo-calendar-outside)>button]:font-semibold [&:not(.gunjo-calendar-selected):not(.gunjo-calendar-disabled):not(.gunjo-calendar-outside)>button]:text-destructive",
                ...modifiersClassNames,
            }}
            classNames={{
                months: "relative flex flex-col gap-4 sm:flex-row",
                month: "space-y-3",
                month_caption: "relative flex h-8 w-full items-center justify-center",
                caption_label: "text-sm sr-only font-semibold",
                dropdowns: "flex items-center justify-center gap-0 text-sm font-semibold",
                dropdown_root: "relative inline-flex items-center",
                dropdown:
                    "h-8 cursor-pointer appearance-none rounded-md bg-transparent px-1.5 py-1 text-center font-semibold text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                months_dropdown: "w-12",
                years_dropdown: "w-[4.25rem]",
                nav: "pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between",
                button_previous: "pointer-events-auto relative z-20 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40",
                button_next: "pointer-events-auto relative z-20 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40",
                chevron: "h-4 w-4",
                month_grid: "w-full border-collapse",
                weekdays: "border-0",
                head_cell: "text-xs",
                weekday: "h-8 w-10 select-none text-center text-xs font-normal text-muted-foreground",
                week: "mt-1",
                day: "relative h-10 w-10 p-0 text-center text-sm focus-within:relative focus-within:z-20",
                day_button:
                    "relative flex h-10 w-10 items-center justify-center rounded-md p-0 font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
                selected:
                    "gunjo-calendar-selected [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground [&>button]:focus:bg-primary [&>button]:focus:text-primary-foreground",
                today:
                    "gunjo-calendar-today [&>button]:bg-accent [&>button]:text-accent-foreground [&>button]:ring-1 [&>button]:ring-primary-border [&>button]:ring-offset-1 [&>button]:ring-offset-background",
                outside:
                    "gunjo-calendar-outside [&>button]:text-muted-foreground [&>button]:opacity-45",
                disabled:
                    "gunjo-calendar-disabled [&>button]:cursor-not-allowed [&>button]:text-muted-foreground [&>button]:opacity-35 [&>button]:line-through [&>button]:hover:bg-transparent",
                range_start:
                    "gunjo-calendar-selected [&>button]:rounded-l-md [&>button]:rounded-r-none [&>button]:bg-primary [&>button]:text-primary-foreground",
                range_middle:
                    "gunjo-calendar-selected [&>button]:rounded-none [&>button]:bg-accent [&>button]:text-accent-foreground",
                range_end:
                    "gunjo-calendar-selected [&>button]:rounded-l-none [&>button]:rounded-r-md [&>button]:bg-info [&>button]:text-info-foreground",
                hidden: "invisible",
                ...classNames,
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
