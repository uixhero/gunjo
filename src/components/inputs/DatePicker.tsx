"use client"

import * as React from "react"
import { addDays, addMonths, addYears, format, type Locale } from "date-fns"
import { IconCalendar as CalendarIcon } from "@tabler/icons-react";
import { dateMatchModifiers, type Matcher, type Modifiers } from "react-day-picker"

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import { Input } from "../inputs/Input"
import { Calendar, type CalendarProps } from "./Calendar"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "../overlay/Popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"

export interface DatePickerProps {
    id?: string
    value?: Date
    onValueChange?: (date: Date | undefined) => void
    placeholder?: string
    dateFormat?: string
    className?: string
    triggerClassName?: string
    editable?: boolean
    disabled?: boolean
    locale?: Locale
    calendarLabel?: string
    todayLabel?: string
    previousLabel?: string
    showTodayButton?: boolean
    closeOnSelect?: boolean
    disabledDates?: Matcher | Matcher[]
    modifiers?: CalendarProps["modifiers"]
    modifiersClassNames?: CalendarProps["modifiersClassNames"]
    startMonth?: Date
    endMonth?: Date
    getDisabledReason?: (date: Date, modifiers: Modifiers) => React.ReactNode
    disabledReason?: React.ReactNode
    disabledReasonLabel?: CalendarProps["disabledReasonLabel"]
    disabledReasonPortalContainer?: CalendarProps["disabledReasonPortalContainer"]
}

type DateSegment = "year" | "month" | "day"

function parseIsoDate(value: string): Date | undefined {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
    if (!match) return undefined

    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    const date = new Date(year, month - 1, day)

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return undefined
    }

    return date
}

function formatDate(date: Date | undefined, dateFormat: string, locale?: Locale): string {
    if (!date) return ""
    return format(date, dateFormat, locale ? { locale } : undefined)
}

function getTodayLabel(locale?: Locale): string {
    return locale?.code === "ja" ? "今日" : "Today"
}

function getCloseCalendarLabel(locale?: Locale): string {
    return locale?.code === "ja" ? "カレンダーを閉じる" : "Close calendar"
}

function getPreviousLabel(locale?: Locale): string {
    return locale?.code === "ja" ? "直前の日付へ戻る" : "Return to previous date"
}

function isSameCalendarDay(first: Date | undefined, second: Date | undefined): boolean {
    if (!first || !second) return false
    return (
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate()
    )
}

function formatDateInputValue(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 8)

    if (digits.length <= 4) return digits
    if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`
}

function getInputPositionForDigitCount(digitCount: number): number {
    if (digitCount <= 4) return digitCount
    if (digitCount <= 6) return digitCount + 1
    return digitCount + 2
}

function getDateSegment(position: number): DateSegment {
    if (position <= 4) return "year"
    if (position <= 7) return "month"
    return "day"
}

function getSegmentRange(segment: DateSegment): [number, number] {
    if (segment === "year") return [0, 4]
    if (segment === "month") return [5, 7]
    return [8, 10]
}

function moveDateSegment(segment: DateSegment, direction: 1 | -1): DateSegment {
    const order: DateSegment[] = ["year", "month", "day"]
    const nextIndex = Math.min(Math.max(order.indexOf(segment) + direction, 0), order.length - 1)
    return order[nextIndex]
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
    (
        {
            id,
            value,
            onValueChange,
            placeholder = "yyyy-mm-dd",
            dateFormat = "yyyy-MM-dd",
            className,
            triggerClassName,
            editable = true,
            disabled,
            locale,
            calendarLabel = "Open calendar",
            todayLabel,
            previousLabel,
            showTodayButton = true,
            closeOnSelect = true,
            disabledDates,
            modifiers,
            modifiersClassNames,
            startMonth,
            endMonth,
            getDisabledReason,
            disabledReason,
            disabledReasonLabel,
            disabledReasonPortalContainer,
        },
        ref
    ) => {
        const inputRef = React.useRef<HTMLInputElement | null>(null)
        const [open, setOpen] = React.useState(false)
        const [inputValue, setInputValue] = React.useState(() =>
            formatDate(value, dateFormat, locale)
        )
        const [calendarMonth, setCalendarMonth] = React.useState<Date | undefined>(value)
        const [calendarSelectedDate, setCalendarSelectedDate] = React.useState<Date | undefined>(value)
        const [previousShortcutDate, setPreviousShortcutDate] = React.useState<Date | undefined>()
        const [keepOpenAfterShortcut, setKeepOpenAfterShortcut] = React.useState(false)
        const [invalid, setInvalid] = React.useState(false)

        React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

        const calendarReferenceDate = calendarMonth ?? calendarSelectedDate ?? value ?? new Date()
        const calendarStartMonth = React.useMemo(
            () => startMonth ?? new Date(calendarReferenceDate.getFullYear() - 10, 0, 1),
            [calendarReferenceDate, startMonth]
        )
        const calendarEndMonth = React.useMemo(
            () => endMonth ?? new Date(calendarReferenceDate.getFullYear() + 10, 11, 31),
            [calendarReferenceDate, endMonth]
        )
        const calendarButtonLabel = open ? getCloseCalendarLabel(locale) : calendarLabel
        const isDateDisabled = React.useCallback(
            (date: Date | undefined) => Boolean(date && disabledDates && dateMatchModifiers(date, disabledDates)),
            [disabledDates]
        )

        const selectSegment = React.useCallback((segment: DateSegment) => {
            const [selectionStart, selectionEnd] = getSegmentRange(segment)
            window.requestAnimationFrame(() => {
                inputRef.current?.setSelectionRange(selectionStart, selectionEnd)
            })
        }, [])

        const openCalendarOnNextFrame = React.useCallback(() => {
            window.requestAnimationFrame(() => {
                setOpen(true)
                inputRef.current?.focus()
            })
        }, [])

        const keepCalendarOpenOnNextFrame = React.useCallback(() => {
            window.requestAnimationFrame(() => {
                setOpen(true)
            })
        }, [])

        const handleOpenChange = React.useCallback((nextOpen: boolean) => {
            setOpen(nextOpen)
            if (!nextOpen) {
                setKeepOpenAfterShortcut(false)
            }
        }, [])

        React.useEffect(() => {
            setInputValue(formatDate(value, dateFormat, locale))
            setCalendarMonth(value)
            setCalendarSelectedDate(value)
            setInvalid(false)
        }, [dateFormat, locale, value])

        const alignCalendarToInput = React.useCallback(
            (nextInputValue = inputValue) => {
                const normalizedInputValue =
                    dateFormat === "yyyy-MM-dd"
                        ? formatDateInputValue(nextInputValue)
                        : nextInputValue
                const parsedDate = parseIsoDate(normalizedInputValue)
                setCalendarMonth(parsedDate ?? value)
                setCalendarSelectedDate(parsedDate ?? value)
            },
            [dateFormat, inputValue, value]
        )

        const syncValidInputValue = React.useCallback(
            (nextInputValue: string) => {
                const normalizedInputValue =
                    dateFormat === "yyyy-MM-dd"
                        ? formatDateInputValue(nextInputValue)
                        : nextInputValue
                const trimmedValue = normalizedInputValue.trim()

                if (trimmedValue === "") {
                    setCalendarMonth(undefined)
                    setCalendarSelectedDate(undefined)
                    onValueChange?.(undefined)
                    return
                }

                const nextDate = parseIsoDate(trimmedValue)
                if (!nextDate || isDateDisabled(nextDate)) return

                setCalendarMonth(nextDate)
                setCalendarSelectedDate(nextDate)
                onValueChange?.(nextDate)
            },
            [dateFormat, isDateDisabled, onValueChange]
        )

        const commitInputValue = React.useCallback((nextInputValue = inputValue) => {
            const normalizedInputValue =
                dateFormat === "yyyy-MM-dd"
                    ? formatDateInputValue(nextInputValue)
                    : nextInputValue
            const trimmedValue = normalizedInputValue.trim()

            if (trimmedValue === "") {
                onValueChange?.(undefined)
                setCalendarMonth(undefined)
                setCalendarSelectedDate(undefined)
                setInvalid(false)
                return
            }

            const nextDate = parseIsoDate(trimmedValue)
            if (!nextDate || isDateDisabled(nextDate)) {
                setInvalid(true)
                setInputValue(formatDate(value, dateFormat, locale))
                return
            }

            setInvalid(false)
            setInputValue(formatDate(nextDate, dateFormat, locale))
            setCalendarMonth(nextDate)
            setCalendarSelectedDate(nextDate)
            onValueChange?.(nextDate)
        }, [dateFormat, inputValue, isDateDisabled, locale, onValueChange, value])

        const handleCalendarSelect = React.useCallback(
            (nextDate: Date | undefined) => {
                if (isDateDisabled(nextDate)) return
                setInvalid(false)
                setCalendarMonth(nextDate)
                setCalendarSelectedDate(nextDate)
                onValueChange?.(nextDate)
                if (nextDate && closeOnSelect && !keepOpenAfterShortcut) {
                    setOpen(false)
                } else if (nextDate) {
                    keepCalendarOpenOnNextFrame()
                }
            },
            [closeOnSelect, isDateDisabled, keepCalendarOpenOnNextFrame, keepOpenAfterShortcut, onValueChange]
        )

        const handleTodaySelect = React.useCallback(() => {
            const today = new Date()
            if (isDateDisabled(today)) return
            const nextInputValue = formatDate(today, dateFormat, locale)
            const currentDate = parseIsoDate(inputValue) ?? calendarSelectedDate ?? value

            if (currentDate && !isSameCalendarDay(currentDate, today)) {
                setPreviousShortcutDate(currentDate)
            }
            setInvalid(false)
            setInputValue(nextInputValue)
            setCalendarMonth(today)
            setCalendarSelectedDate(today)
            onValueChange?.(today)
            setKeepOpenAfterShortcut(true)
            setOpen(true)
            keepCalendarOpenOnNextFrame()
        }, [calendarSelectedDate, dateFormat, inputValue, isDateDisabled, keepCalendarOpenOnNextFrame, locale, onValueChange, value])

        const handlePreviousShortcutSelect = React.useCallback(() => {
            if (!previousShortcutDate) return
            if (isDateDisabled(previousShortcutDate)) return

            const nextInputValue = formatDate(previousShortcutDate, dateFormat, locale)
            setInvalid(false)
            setInputValue(nextInputValue)
            setCalendarMonth(previousShortcutDate)
            setCalendarSelectedDate(previousShortcutDate)
            onValueChange?.(previousShortcutDate)
            setPreviousShortcutDate(undefined)
            setKeepOpenAfterShortcut(true)
            setOpen(true)
            keepCalendarOpenOnNextFrame()
        }, [dateFormat, isDateDisabled, keepCalendarOpenOnNextFrame, locale, onValueChange, previousShortcutDate])

        const stepInputValue = React.useCallback(
            (direction: 1 | -1, cursorPosition: number) => {
                if (dateFormat !== "yyyy-MM-dd") return false

                const segment = getDateSegment(cursorPosition)
                const currentDate = parseIsoDate(inputValue) ?? value ?? new Date()
                const nextDate =
                    segment === "year"
                        ? addYears(currentDate, direction)
                        : segment === "month"
                            ? addMonths(currentDate, direction)
                            : addDays(currentDate, direction)
                if (isDateDisabled(nextDate)) return false
                const nextInputValue = formatDate(nextDate, dateFormat, locale)
                const [selectionStart, selectionEnd] = getSegmentRange(segment)

                setInvalid(false)
                setInputValue(nextInputValue)
                setCalendarMonth(nextDate)
                setCalendarSelectedDate(nextDate)
                onValueChange?.(nextDate)
                window.requestAnimationFrame(() => {
                    inputRef.current?.setSelectionRange(selectionStart, selectionEnd)
                })
                return true
            },
            [dateFormat, inputValue, isDateDisabled, locale, onValueChange, value]
        )

        return (
            <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverAnchor asChild>
                    <div className="relative w-full" data-slot="date-picker">
                        <Input
                            id={id}
                            ref={inputRef}
                            value={inputValue}
                            onFocus={() => {
                                alignCalendarToInput()
                                setOpen(true)
                            }}
                            onChange={(event) => {
                                const rawInputValue = event.target.value
                                const digitsBeforeCursor = rawInputValue
                                    .slice(0, event.target.selectionStart ?? rawInputValue.length)
                                    .replace(/\D/g, "").length
                                const nextInputValue =
                                    dateFormat === "yyyy-MM-dd"
                                        ? formatDateInputValue(rawInputValue)
                                        : rawInputValue
                                setInputValue(nextInputValue)
                                setInvalid(false)
                                syncValidInputValue(nextInputValue)
                                if (dateFormat === "yyyy-MM-dd") {
                                    const nextCursorPosition =
                                        getInputPositionForDigitCount(digitsBeforeCursor)
                                    window.requestAnimationFrame(() => {
                                        inputRef.current?.setSelectionRange(
                                            nextCursorPosition,
                                            nextCursorPosition
                                        )
                                    })
                                }
                            }}
                            onKeyDown={(event) => {
                                if (!editable) return
                                if (dateFormat === "yyyy-MM-dd" && event.key === "-") {
                                    event.preventDefault()
                                    return
                                }
                                if (event.key === "Enter") {
                                    event.preventDefault()
                                    const nextInputValue =
                                        dateFormat === "yyyy-MM-dd"
                                            ? formatDateInputValue(event.currentTarget.value)
                                            : event.currentTarget.value
                                    setInputValue(nextInputValue)
                                    commitInputValue(nextInputValue)
                                    alignCalendarToInput(nextInputValue)
                                    openCalendarOnNextFrame()
                                    return
                                }
                                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                                    const handled = stepInputValue(
                                        event.key === "ArrowUp" ? 1 : -1,
                                        event.currentTarget.selectionStart ?? inputValue.length
                                    )
                                    if (handled) {
                                        event.preventDefault()
                                    }
                                    return
                                }
                                if (
                                    dateFormat === "yyyy-MM-dd" &&
                                    (event.key === "ArrowLeft" || event.key === "ArrowRight") &&
                                    !event.altKey &&
                                    !event.ctrlKey &&
                                    !event.metaKey &&
                                    inputValue.length >= 10
                                ) {
                                    const segment = getDateSegment(
                                        event.currentTarget.selectionStart ?? inputValue.length
                                    )
                                    selectSegment(
                                        moveDateSegment(segment, event.key === "ArrowRight" ? 1 : -1)
                                    )
                                    event.preventDefault()
                                    return
                                }
                                if (
                                    dateFormat === "yyyy-MM-dd" &&
                                    event.key === "Tab" &&
                                    inputValue.length >= 10
                                ) {
                                    const segment = getDateSegment(
                                        event.currentTarget.selectionStart ?? inputValue.length
                                    )
                                    if (!event.shiftKey && segment !== "day") {
                                        selectSegment(moveDateSegment(segment, 1))
                                        event.preventDefault()
                                        return
                                    }
                                    if (event.shiftKey && segment !== "year") {
                                        selectSegment(moveDateSegment(segment, -1))
                                        event.preventDefault()
                                    }
                                }
                            }}
                            placeholder={placeholder}
                            readOnly={!editable}
                            disabled={disabled}
                            inputMode={dateFormat === "yyyy-MM-dd" ? "numeric" : undefined}
                            aria-invalid={invalid || undefined}
                            className={cn(
                                "w-full pr-10",
                                !editable && "cursor-pointer",
                                triggerClassName
                            )}
                        />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        disabled={disabled}
                                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 text-muted-foreground hover:text-foreground"
                                        aria-label={calendarButtonLabel}
                                    >
                                        <CalendarIcon className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                            </TooltipTrigger>
                            <TooltipContent>{calendarButtonLabel}</TooltipContent>
                        </Tooltip>
                    </div>
                </PopoverAnchor>
                <PopoverContent
                    className={cn(
                        "w-auto overflow-visible p-0",
                        className
                    )}
                    align="end"
                    sideOffset={8}
                    onOpenAutoFocus={(event) => event.preventDefault()}
                >
                    <Calendar
                        className={showTodayButton ? "rounded-b-none border-0 p-3" : undefined}
                        mode="single"
                        selected={calendarSelectedDate}
                        onSelect={handleCalendarSelect}
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        startMonth={calendarStartMonth}
                        endMonth={calendarEndMonth}
                        locale={locale}
                        disabled={disabledDates}
                        modifiers={modifiers}
                        modifiersClassNames={modifiersClassNames}
                        getDisabledReason={getDisabledReason}
                        disabledReason={disabledReason}
                        disabledReasonLabel={disabledReasonLabel}
                        disabledReasonPortalContainer={disabledReasonPortalContainer}
                    />
                    {showTodayButton ? (
                        <div className="flex items-stretch justify-between gap-2 border-t bg-card p-1.5">
                            {previousShortcutDate ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="h-10 w-fit max-w-[calc(100%-3.5rem)] flex-col items-start justify-center gap-0 px-2 py-1 text-left"
                                    onClick={handlePreviousShortcutSelect}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    <span className="block max-w-full truncate text-[11px] leading-4 text-muted-foreground">
                                        {previousLabel ?? getPreviousLabel(locale)}
                                    </span>
                                    <span className="block max-w-full truncate font-mono text-[11px] leading-4 text-foreground">
                                        {formatDate(previousShortcutDate, dateFormat, locale)}
                                    </span>
                                </Button>
                            ) : null}
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="ml-auto h-10 shrink-0 px-3 text-xs"
                                onClick={handleTodaySelect}
                                onMouseDown={(event) => event.preventDefault()}
                            >
                                {todayLabel ?? getTodayLabel(locale)}
                            </Button>
                        </div>
                    ) : null}
                </PopoverContent>
            </Popover>
        )
    }
)
DatePicker.displayName = "DatePicker"

export { DatePicker }
