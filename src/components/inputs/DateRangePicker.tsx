"use client"

import * as React from "react"
import { addDays, addMonths, addYears, differenceInCalendarDays, format, type Locale } from "date-fns"
import { IconCalendar as CalendarIcon } from "@tabler/icons-react";
import type { DateRange } from "react-day-picker"

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import { Input } from "../inputs/Input"
import { Calendar } from "./Calendar"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "../overlay/Popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"

export interface DateRangePickerProps {
    id?: string
    /** Optional visible label rendered above the control and associated via `htmlFor` (matches Input/Select/Textarea). (#315) */
    label?: React.ReactNode
    /** Optional helper text under the control, wired via `aria-describedby`. (#315) */
    description?: React.ReactNode
    value?: DateRange
    onValueChange?: (range: DateRange | undefined) => void
    placeholder?: string
    dateFormat?: string
    numberOfMonths?: number
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
    maxRangeDays?: number
    responsiveMonths?: boolean
}

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

function formatRange(range: DateRange | undefined, dateFormat: string, locale?: Locale): string {
    if (!range?.from) return ""
    if (!range.to) return `${formatDate(range.from, dateFormat, locale)} - `
    return `${formatDate(range.from, dateFormat, locale)} - ${formatDate(range.to, dateFormat, locale)}`
}

function getTodayLabel(locale?: Locale): string {
    return locale?.code === "ja" ? "今日" : "Today"
}

function getCloseCalendarLabel(locale?: Locale): string {
    return locale?.code === "ja" ? "カレンダーを閉じる" : "Close calendar"
}

function getPreviousLabel(locale?: Locale): string {
    return locale?.code === "ja" ? "直前の期間へ戻る" : "Return to previous range"
}

function isSameCalendarDay(first: Date | undefined, second: Date | undefined): boolean {
    if (!first || !second) return false
    return (
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate()
    )
}

function isSameRange(first: DateRange | undefined, second: DateRange | undefined): boolean {
    return (
        isSameCalendarDay(first?.from, second?.from) &&
        isSameCalendarDay(first?.to, second?.to)
    )
}

function normalizeRange(range: DateRange | undefined): DateRange | undefined {
    if (!range?.from) return undefined
    if (!range.to) return { from: range.from }
    if (range.from <= range.to) return range
    return { from: range.to, to: range.from }
}

type RangeValidationReason = "format" | "order" | "length"

function getRangeValidation(
    range: DateRange | undefined,
    maxRangeDays?: number
): RangeValidationReason | undefined {
    if (!range?.from || !range.to) return undefined
    if (range.from > range.to) return "order"
    if (
        typeof maxRangeDays === "number" &&
        maxRangeDays > 0 &&
        differenceInCalendarDays(range.to, range.from) + 1 > maxRangeDays
    ) {
        return "length"
    }
    return undefined
}

function getRangeValidationMessage(
    reason: RangeValidationReason | undefined,
    locale?: Locale,
    maxRangeDays?: number
): string | undefined {
    if (!reason) return undefined
    if (locale?.code === "ja") {
        if (reason === "format") return "日付は yyyy-mm-dd - yyyy-mm-dd 形式で入力してください。"
        if (reason === "order") return "終了日は開始日以降を指定してください。"
        return `期間は最大${maxRangeDays ?? 0}日以内で指定してください。`
    }
    if (reason === "format") return "Enter dates in yyyy-mm-dd - yyyy-mm-dd format."
    if (reason === "order") return "End date must be the same as or after the start date."
    return `Choose a range of ${maxRangeDays ?? 0} days or less.`
}

function parseRangeInput(value: string): DateRange | undefined {
    const matches = value.match(/\d{4}-\d{2}-\d{2}/g)
    if (!matches?.length) return undefined

    const from = parseIsoDate(matches[0])
    const to = matches[1] ? parseIsoDate(matches[1]) : undefined
    return from ? { from, to } : undefined
}

type RangeDateSegment =
    | "fromYear"
    | "fromMonth"
    | "fromDay"
    | "toYear"
    | "toMonth"
    | "toDay"

type ActiveRangeEndpoint = "from" | "to"

const rangeDateSegmentOrder: RangeDateSegment[] = [
    "fromYear",
    "fromMonth",
    "fromDay",
    "toYear",
    "toMonth",
    "toDay",
]

function formatSingleDateInputValue(value: string): string {
    if (value.includes("-")) {
        const [yearValue = "", monthValue = "", ...dayValues] = value.split("-")
        const yearDigits = yearValue.replace(/\D/g, "")
        const year = yearDigits.slice(0, 4)
        const monthDigits = `${yearDigits.slice(4)}${monthValue.replace(/\D/g, "")}`
        const month = monthDigits.slice(0, 2)
        const dayDigits = `${monthDigits.slice(2)}${dayValues.join("").replace(/\D/g, "")}`
        const day = dayDigits.slice(0, 2)

        if (value.split("-").length >= 3 || dayDigits.length > 0) return `${year}-${month}-${day}`
        return `${year}-${month}`
    }

    const digits = value.replace(/\D/g, "").slice(0, 8)

    if (digits.length <= 4) return digits
    if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`
}

function formatDateInputValue(value: string): string {
    const parts = value.split(/\s+-\s+/)
    if (parts.length > 1) {
        const fromValue = formatSingleDateInputValue(parts[0] ?? "")
        const toValue = formatSingleDateInputValue(parts.slice(1).join(" - "))
        return toValue ? `${fromValue} - ${toValue}` : `${fromValue} - `
    }

    const digits = value.replace(/\D/g, "").slice(0, 16)
    if (digits.length <= 8) return formatSingleDateInputValue(digits)
    return `${formatSingleDateInputValue(digits.slice(0, 8))} - ${formatSingleDateInputValue(digits.slice(8))}`
}

function getSingleDateInputPositionForDigitCount(digitCount: number): number {
    if (digitCount <= 4) return digitCount
    if (digitCount <= 6) return digitCount + 1
    return digitCount + 2
}

function getRangeInputPositionForDigitCount(digitCount: number): number {
    if (digitCount <= 8) return getSingleDateInputPositionForDigitCount(digitCount)
    return 13 + getSingleDateInputPositionForDigitCount(digitCount - 8)
}

function getRangeDateSegment(position: number): RangeDateSegment {
    if (position <= 4) return "fromYear"
    if (position <= 7) return "fromMonth"
    if (position <= 10) return "fromDay"
    if (position <= 17) return "toYear"
    if (position <= 20) return "toMonth"
    return "toDay"
}

function getRangeDateSegmentRange(segment: RangeDateSegment): [number, number] {
    if (segment === "fromYear") return [0, 4]
    if (segment === "fromMonth") return [5, 7]
    if (segment === "fromDay") return [8, 10]
    if (segment === "toYear") return [13, 17]
    if (segment === "toMonth") return [18, 20]
    return [21, 23]
}

function moveRangeDateSegment(segment: RangeDateSegment, direction: 1 | -1): RangeDateSegment {
    const nextIndex = Math.min(
        Math.max(rangeDateSegmentOrder.indexOf(segment) + direction, 0),
        rangeDateSegmentOrder.length - 1
    )
    return rangeDateSegmentOrder[nextIndex]
}

function stepDateBySegment(date: Date, segment: RangeDateSegment, direction: 1 | -1): Date {
    if (segment.endsWith("Year")) return addYears(date, direction)
    if (segment.endsWith("Month")) return addMonths(date, direction)
    return addDays(date, direction)
}

function getRangeEndpoint(segment: RangeDateSegment): ActiveRangeEndpoint {
    return segment.startsWith("from") ? "from" : "to"
}

function getActiveEndpointLabel(endpoint: ActiveRangeEndpoint, locale?: Locale): string {
    if (locale?.code === "ja") return endpoint === "from" ? "開始日を編集中" : "終了日を編集中"
    return endpoint === "from" ? "Editing start date" : "Editing end date"
}

function useSmallCalendarViewport() {
    const [isSmallViewport, setIsSmallViewport] = React.useState(false)

    React.useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 639px)")
        const update = () => setIsSmallViewport(mediaQuery.matches)

        update()
        mediaQuery.addEventListener("change", update)
        return () => mediaQuery.removeEventListener("change", update)
    }, [])

    return isSmallViewport
}

const DateRangePicker = React.forwardRef<HTMLInputElement, DateRangePickerProps>(
    (
        {
            id,
            label,
            description,
            value,
            onValueChange,
            placeholder = "yyyy-mm-dd - yyyy-mm-dd",
            dateFormat = "yyyy-MM-dd",
            numberOfMonths = 2,
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
            maxRangeDays,
            responsiveMonths = true,
        },
        ref
    ) => {
        const inputRef = React.useRef<HTMLInputElement | null>(null)
        const reactId = React.useId()
        const hasWrap = Boolean(label || description)
        const controlId = id ?? (hasWrap ? `${reactId}-input` : undefined)
        const descriptionId = description ? `${reactId}-description` : undefined
        const [open, setOpen] = React.useState(false)
        const [inputValue, setInputValue] = React.useState(() =>
            formatRange(value, dateFormat, locale)
        )
        const [calendarMonth, setCalendarMonth] = React.useState<Date | undefined>(value?.from)
        const [calendarSelectedRange, setCalendarSelectedRange] = React.useState<DateRange | undefined>(value)
        const [previousShortcutRange, setPreviousShortcutRange] = React.useState<DateRange | undefined>()
        const [activeEndpoint, setActiveEndpoint] = React.useState<ActiveRangeEndpoint>("from")
        const [keepOpenAfterShortcut, setKeepOpenAfterShortcut] = React.useState(false)
        const [calendarSelectionAnchor, setCalendarSelectionAnchor] = React.useState<Date | undefined>()
        const [validationReason, setValidationReason] = React.useState<RangeValidationReason | undefined>()
        const isSmallCalendarViewport = useSmallCalendarViewport()
        const calendarNumberOfMonths =
            responsiveMonths && isSmallCalendarViewport
                ? 1
                : numberOfMonths
        const useCompactMultiMonthCalendar = Number(calendarNumberOfMonths) > 1

        React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

        const calendarReferenceDate = calendarMonth ?? calendarSelectedRange?.from ?? value?.from ?? new Date()
        const calendarStartMonth = React.useMemo(
            () => new Date(calendarReferenceDate.getFullYear() - 10, 0, 1),
            [calendarReferenceDate]
        )
        const calendarEndMonth = React.useMemo(
            () => new Date(calendarReferenceDate.getFullYear() + 10, 11, 31),
            [calendarReferenceDate]
        )
        const calendarButtonLabel = open ? getCloseCalendarLabel(locale) : calendarLabel

        const selectSegment = React.useCallback((segment: RangeDateSegment) => {
            const [selectionStart, selectionEnd] = getRangeDateSegmentRange(segment)
            setActiveEndpoint(getRangeEndpoint(segment))
            window.requestAnimationFrame(() => {
                inputRef.current?.setSelectionRange(selectionStart, selectionEnd)
            })
        }, [])

        const updateActiveEndpointFromInput = React.useCallback((position: number) => {
            setActiveEndpoint(getRangeEndpoint(getRangeDateSegment(position)))
        }, [])

        const keepCalendarOpenOnNextFrame = React.useCallback(() => {
            window.requestAnimationFrame(() => {
                setOpen(true)
            })
        }, [])

        const openCalendarOnNextFrame = React.useCallback(() => {
            window.requestAnimationFrame(() => {
                setOpen(true)
                inputRef.current?.focus()
            })
        }, [])

        const handleOpenChange = React.useCallback((nextOpen: boolean) => {
            setOpen(nextOpen)
            if (!nextOpen) {
                setKeepOpenAfterShortcut(false)
                setCalendarSelectionAnchor(undefined)
            }
        }, [])

        React.useEffect(() => {
            setInputValue(formatRange(value, dateFormat, locale))
            setCalendarMonth(value?.from)
            setCalendarSelectedRange(value)
            setValidationReason(undefined)
        }, [dateFormat, locale, value])

        const alignCalendarToInput = React.useCallback(
            (nextInputValue = inputValue) => {
                const normalizedInputValue =
                    dateFormat === "yyyy-MM-dd"
                        ? formatDateInputValue(nextInputValue)
                        : nextInputValue
                const parsedRange = parseRangeInput(normalizedInputValue)
                setCalendarMonth(parsedRange?.from ?? value?.from)
                const validation = getRangeValidation(parsedRange, maxRangeDays)
                setCalendarSelectedRange(validation === "order" ? value : parsedRange ?? value)
            },
            [dateFormat, inputValue, maxRangeDays, value]
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
                    setCalendarSelectedRange(undefined)
                    onValueChange?.(undefined)
                    return
                }

                const nextRange = parseRangeInput(trimmedValue)
                if (!nextRange) return

                const validation = getRangeValidation(nextRange, maxRangeDays)
                setCalendarMonth(nextRange.from)
                setValidationReason(validation)
                setCalendarSelectedRange(validation === "order" ? value : nextRange)
                if (!validation && nextRange.from && nextRange.to) {
                    onValueChange?.(nextRange)
                }
            },
            [dateFormat, maxRangeDays, onValueChange, value]
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
                setCalendarSelectedRange(undefined)
                setValidationReason(undefined)
                return
            }

            const nextRange = parseRangeInput(trimmedValue)
            if (!nextRange) {
                setValidationReason("format")
                return
            }
            const validation = getRangeValidation(nextRange, maxRangeDays)
            if (validation) {
                setValidationReason(validation)
                setCalendarMonth(nextRange.from)
                setCalendarSelectedRange(validation === "order" ? value : nextRange)
                return
            }

            setValidationReason(undefined)
            setInputValue(formatRange(nextRange, dateFormat, locale))
            setCalendarMonth(nextRange.from)
            setCalendarSelectedRange(nextRange)
            onValueChange?.(nextRange)
        }, [dateFormat, inputValue, locale, maxRangeDays, onValueChange, value])

        const handleCalendarSelect = React.useCallback(
            (_nextRange: DateRange | undefined, triggerDate?: Date) => {
                if (!triggerDate) return

                const anchor = calendarSelectionAnchor ?? (
                    calendarSelectedRange?.from && !calendarSelectedRange.to
                        ? calendarSelectedRange.from
                        : undefined
                )
                const isCompletingRange = Boolean(anchor)
                const normalizedRange = isCompletingRange
                    ? normalizeRange({ from: anchor, to: triggerDate })
                    : { from: triggerDate }
                const validation = getRangeValidation(normalizedRange, maxRangeDays)
                setValidationReason(validation)
                setCalendarMonth(normalizedRange?.from)
                setCalendarSelectedRange(normalizedRange)
                setInputValue(formatRange(normalizedRange, dateFormat, locale))

                if (!isCompletingRange) {
                    setCalendarSelectionAnchor(triggerDate)
                    setActiveEndpoint("to")
                    onValueChange?.(normalizedRange)
                    keepCalendarOpenOnNextFrame()
                    return
                }

                setCalendarSelectionAnchor(undefined)
                setActiveEndpoint("to")
                if (!validation) {
                    onValueChange?.(normalizedRange)
                }

                if (!validation && normalizedRange?.from && normalizedRange.to && closeOnSelect && !keepOpenAfterShortcut) {
                    setOpen(false)
                } else if (normalizedRange?.from) {
                    keepCalendarOpenOnNextFrame()
                }
            },
            [calendarSelectedRange, calendarSelectionAnchor, closeOnSelect, dateFormat, keepCalendarOpenOnNextFrame, keepOpenAfterShortcut, locale, maxRangeDays, onValueChange]
        )

        const handleTodaySelect = React.useCallback(() => {
            const today = new Date()
            const todayRange = { from: today, to: today }
            const currentRange = parseRangeInput(inputValue) ?? calendarSelectedRange ?? value

            if (currentRange && !isSameRange(currentRange, todayRange)) {
                setPreviousShortcutRange(currentRange)
            }
            setValidationReason(undefined)
            setInputValue(formatRange(todayRange, dateFormat, locale))
            setCalendarMonth(today)
            setCalendarSelectedRange(todayRange)
            setCalendarSelectionAnchor(undefined)
            onValueChange?.(todayRange)
            setKeepOpenAfterShortcut(true)
            setOpen(true)
            keepCalendarOpenOnNextFrame()
        }, [calendarSelectedRange, dateFormat, inputValue, keepCalendarOpenOnNextFrame, locale, onValueChange, value])

        const handlePreviousShortcutSelect = React.useCallback(() => {
            if (!previousShortcutRange?.from) return

            setValidationReason(undefined)
            setInputValue(formatRange(previousShortcutRange, dateFormat, locale))
            setCalendarMonth(previousShortcutRange.from)
            setCalendarSelectedRange(previousShortcutRange)
            setCalendarSelectionAnchor(undefined)
            onValueChange?.(previousShortcutRange)
            setPreviousShortcutRange(undefined)
            setKeepOpenAfterShortcut(true)
            setOpen(true)
            keepCalendarOpenOnNextFrame()
        }, [dateFormat, keepCalendarOpenOnNextFrame, locale, onValueChange, previousShortcutRange])

        const handleInputChange = React.useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const rawInputValue = event.target.value
                const digitsBeforeCursor = rawInputValue
                    .slice(0, event.target.selectionStart ?? rawInputValue.length)
                    .replace(/\D/g, "").length
                const nextInputValue =
                    dateFormat === "yyyy-MM-dd"
                        ? formatDateInputValue(rawInputValue)
                        : rawInputValue
                setInputValue(nextInputValue)
                syncValidInputValue(nextInputValue)
                if (dateFormat === "yyyy-MM-dd") {
                    const nextCursorPosition =
                        getRangeInputPositionForDigitCount(digitsBeforeCursor)
                    window.requestAnimationFrame(() => {
                        inputRef.current?.setSelectionRange(
                            nextCursorPosition,
                            nextCursorPosition
                        )
                    })
                }
            },
            [dateFormat, syncValidInputValue]
        )

        const stepInputValue = React.useCallback(
            (direction: 1 | -1, cursorPosition: number) => {
                if (dateFormat !== "yyyy-MM-dd") return false

                const segment = getRangeDateSegment(cursorPosition)
                const currentRange = parseRangeInput(inputValue) ?? value
                const fallbackDate = new Date()
                const from = currentRange?.from ?? fallbackDate
                const to = currentRange?.to ?? currentRange?.from ?? fallbackDate
                let nextFrom = segment.startsWith("from")
                    ? stepDateBySegment(from, segment, direction)
                    : from
                let nextTo = segment.startsWith("to")
                    ? stepDateBySegment(to, segment, direction)
                    : to

                if (nextFrom > nextTo) {
                    if (segment.startsWith("from")) {
                        nextTo = nextFrom
                    } else {
                        nextFrom = nextTo
                    }
                }
                if (typeof maxRangeDays === "number" && maxRangeDays > 0) {
                    const maxOffset = maxRangeDays - 1
                    if (differenceInCalendarDays(nextTo, nextFrom) > maxOffset) {
                        if (segment.startsWith("from")) {
                            nextTo = addDays(nextFrom, maxOffset)
                        } else {
                            nextFrom = addDays(nextTo, -maxOffset)
                        }
                    }
                }
                const nextRange = { from: nextFrom, to: nextTo }

                const nextInputValue = formatRange(nextRange, dateFormat, locale)
                const [selectionStart, selectionEnd] = getRangeDateSegmentRange(segment)

                setValidationReason(undefined)
                setInputValue(nextInputValue)
                setCalendarMonth(nextRange.from)
                setCalendarSelectedRange(nextRange)
                if (nextRange.from && nextRange.to) {
                    onValueChange?.(nextRange)
                }
                window.requestAnimationFrame(() => {
                    inputRef.current?.setSelectionRange(selectionStart, selectionEnd)
                })
                return true
            },
            [dateFormat, inputValue, locale, maxRangeDays, onValueChange, value]
        )

        const deleteInputValue = React.useCallback(
            (key: "Backspace" | "Delete", selectionStart: number, selectionEnd: number) => {
                if (dateFormat !== "yyyy-MM-dd") return false

                let removeStart = selectionStart
                let removeEnd = selectionEnd

                if (removeStart === removeEnd) {
                    if (key === "Backspace") {
                        let cursor = removeStart - 1
                        while (cursor >= 0 && !/\d/.test(inputValue[cursor] ?? "")) {
                            cursor -= 1
                        }
                        if (cursor < 0) return true
                        removeStart = cursor
                        removeEnd = cursor + 1
                    } else {
                        let cursor = removeEnd
                        while (cursor < inputValue.length && !/\d/.test(inputValue[cursor] ?? "")) {
                            cursor += 1
                        }
                        if (cursor >= inputValue.length) return true
                        removeStart = cursor
                        removeEnd = cursor + 1
                    }
                }

                const nextInputValue = `${inputValue.slice(0, removeStart)}${inputValue.slice(removeEnd)}`
                const parsedRange = parseRangeInput(nextInputValue)

                setInputValue(nextInputValue)
                setValidationReason(undefined)
                if (parsedRange) {
                    const validation = getRangeValidation(parsedRange, maxRangeDays)
                    setCalendarMonth(parsedRange.from)
                    setValidationReason(validation)
                    setCalendarSelectedRange(validation === "order" ? value : parsedRange)
                    if (!validation && parsedRange.from && parsedRange.to) {
                        onValueChange?.(parsedRange)
                    }
                }
                window.requestAnimationFrame(() => {
                    inputRef.current?.setSelectionRange(removeStart, removeStart)
                })
                return true
            },
            [dateFormat, inputValue, maxRangeDays, onValueChange, value]
        )

        const validationMessage = getRangeValidationMessage(validationReason, locale, maxRangeDays)

        const picker = (
            <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverAnchor asChild>
                    <div className="relative w-full" data-slot="date-range-picker">
                        <Input
                            id={controlId}
                            aria-describedby={descriptionId}
                            ref={inputRef}
                            value={inputValue}
                            onFocus={() => {
                                alignCalendarToInput()
                                updateActiveEndpointFromInput(inputRef.current?.selectionStart ?? 0)
                                setOpen(true)
                            }}
                            onClick={(event) => {
                                updateActiveEndpointFromInput(event.currentTarget.selectionStart ?? 0)
                            }}
                            onKeyUp={(event) => {
                                updateActiveEndpointFromInput(event.currentTarget.selectionStart ?? 0)
                            }}
                            onChange={handleInputChange}
                            onKeyDown={(event) => {
                                if (!editable) return
                                if (dateFormat === "yyyy-MM-dd" && event.key === "-") {
                                    event.preventDefault()
                                    return
                                }
                                if (event.key === "Backspace" || event.key === "Delete") {
                                    const handled = deleteInputValue(
                                        event.key,
                                        event.currentTarget.selectionStart ?? inputValue.length,
                                        event.currentTarget.selectionEnd ?? inputValue.length
                                    )
                                    if (handled) {
                                        event.preventDefault()
                                    }
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
                                    inputValue.length >= 23
                                ) {
                                    const segment = getRangeDateSegment(
                                        event.currentTarget.selectionStart ?? inputValue.length
                                    )
                                    selectSegment(
                                        moveRangeDateSegment(segment, event.key === "ArrowRight" ? 1 : -1)
                                    )
                                    event.preventDefault()
                                    return
                                }
                                if (
                                    dateFormat === "yyyy-MM-dd" &&
                                    event.key === "Tab" &&
                                    inputValue.length >= 23
                                ) {
                                    const segment = getRangeDateSegment(
                                        event.currentTarget.selectionStart ?? inputValue.length
                                    )
                                    if (!event.shiftKey && segment !== "toDay") {
                                        selectSegment(moveRangeDateSegment(segment, 1))
                                        event.preventDefault()
                                        return
                                    }
                                    if (event.shiftKey && segment !== "fromYear") {
                                        selectSegment(moveRangeDateSegment(segment, -1))
                                        event.preventDefault()
                                    }
                                }
                            }}
                            placeholder={placeholder}
                            readOnly={!editable}
                            disabled={disabled}
                            inputMode={dateFormat === "yyyy-MM-dd" ? "numeric" : undefined}
                            aria-invalid={Boolean(validationReason) || undefined}
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
                    className={cn("w-auto overflow-visible p-0", className)}
                    align="center"
                    sideOffset={8}
                    onInteractOutside={(event) => {
                        const target = event.target
                        if (
                            target instanceof Node &&
                            inputRef.current?.contains(target)
                        ) {
                            event.preventDefault()
                        }
                    }}
                    onOpenAutoFocus={(event) => event.preventDefault()}
                >
                    <Calendar
                        className={cn(
                            showTodayButton && "rounded-b-none border-0",
                            useCompactMultiMonthCalendar ? "p-2" : showTodayButton ? "p-3" : undefined
                        )}
                        classNames={
                            useCompactMultiMonthCalendar
                                ? {
                                    months: "relative flex flex-col gap-2 sm:flex-row",
                                    month: "space-y-2",
                                    weekday: "h-7 w-9 select-none text-center text-xs font-normal text-muted-foreground",
                                    day: "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20",
                                    day_button:
                                        "relative flex h-9 w-9 items-center justify-center rounded-md p-0 font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
                                }
                                : undefined
                        }
                        mode="range"
                        selected={calendarSelectedRange}
                        onSelect={handleCalendarSelect}
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        startMonth={calendarStartMonth}
                        endMonth={calendarEndMonth}
                        numberOfMonths={calendarNumberOfMonths}
                        locale={locale}
                        modifiers={{
                            activeRangeStart: calendarSelectedRange?.from,
                            activeRangeEnd: calendarSelectedRange?.to,
                        }}
                        modifiersClassNames={{
                            activeRangeStart:
                                activeEndpoint === "from"
                                    ? "[&>button]:ring-2 [&>button]:ring-primary-border [&>button]:ring-offset-2 [&>button]:ring-offset-background"
                                    : "",
                            activeRangeEnd:
                                activeEndpoint === "to"
                                    ? "[&>button]:ring-2 [&>button]:ring-info-border [&>button]:ring-offset-2 [&>button]:ring-offset-background"
                                    : "",
                        }}
                    />
                    {showTodayButton ? (
                        <div className="space-y-1.5 border-t bg-card p-1.5">
                            <div className="flex items-center gap-2 px-1 text-[11px] text-muted-foreground">
                                <span
                                    className={cn(
                                        "h-2 w-2 rounded-full",
                                        activeEndpoint === "from" ? "bg-primary" : "bg-info"
                                    )}
                                />
                                <span>{getActiveEndpointLabel(activeEndpoint, locale)}</span>
                            </div>
                            {validationMessage ? (
                                <p className="px-1 text-[11px] font-medium text-destructive">
                                    {validationMessage}
                                </p>
                            ) : null}
                            <div className="flex items-stretch justify-between gap-2">
                            {previousShortcutRange?.from ? (
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
                                        {formatRange(previousShortcutRange, dateFormat, locale)}
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
                        </div>
                    ) : null}
                </PopoverContent>
            </Popover>
        )

        if (!hasWrap) return picker

        return (
            <div className="flex w-full flex-col gap-1.5">
                {label ? (
                    <label htmlFor={controlId} className="text-sm font-medium leading-none text-foreground">
                        {label}
                    </label>
                ) : null}
                {picker}
                {description ? (
                    <p id={descriptionId} className="text-xs text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </div>
        )
    }
)
DateRangePicker.displayName = "DateRangePicker"

export { DateRangePicker }
