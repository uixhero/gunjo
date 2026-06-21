"use client"

import * as React from "react"
import { IconClock as Clock } from "@tabler/icons-react";

import { cn } from "../../lib/utils"

export interface TimePickerProps {
    /** Time value in 24-hour format "HH:mm" (e.g. "14:30"). Empty string = unset. */
    value?: string
    onValueChange?: (value: string) => void
    /** 12-hour with AM/PM, or 24-hour. Default 24. */
    hour12?: boolean
    /** Granularity of minute select. Default 1. */
    minuteStep?: 1 | 5 | 10 | 15 | 30
    className?: string
    disabled?: boolean
    hourLabel?: string
    minuteLabel?: string
    periodLabel?: string
    /** Accessible group label for the whole control. Default "Time". */
    label?: string
}

function parse(value: string | undefined): {
    hour: number | null
    minute: number | null
} {
    if (!value) return { hour: null, minute: null }
    const match = /^(\d{1,2}):(\d{2})$/.exec(value)
    if (!match) return { hour: null, minute: null }
    return { hour: Number(match[1]), minute: Number(match[2]) }
}

function format2(n: number) {
    return n.toString().padStart(2, "0")
}

const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
    (
        {
            value,
            onValueChange,
            hour12 = false,
            minuteStep = 1,
            className,
            disabled,
            hourLabel = "Hour",
            minuteLabel = "Minute",
            periodLabel = "AM/PM",
            label = "Time",
        },
        ref
    ) => {
        const { hour, minute } = parse(value)
        const displayHour = hour ?? 0
        const displayMinute = minute ?? 0
        const isUnset = hour === null || minute === null

        const hourOptions = hour12
            ? Array.from({ length: 12 }, (_, i) => i + 1)
            : Array.from({ length: 24 }, (_, i) => i)

        const minuteOptions = Array.from(
            { length: 60 / minuteStep },
            (_, i) => i * minuteStep
        )

        const ampm = displayHour >= 12 ? "PM" : "AM"
        const display12 =
            displayHour === 0 ? 12 : displayHour > 12 ? displayHour - 12 : displayHour

        const setHour = (h: number) => {
            const newHour = hour12
                ? ampm === "PM"
                    ? h === 12
                        ? 12
                        : h + 12
                    : h === 12
                      ? 0
                      : h
                : h
            onValueChange?.(`${format2(newHour)}:${format2(displayMinute)}`)
        }

        const setMinute = (m: number) => {
            onValueChange?.(`${format2(displayHour)}:${format2(m)}`)
        }

        const setAmPm = (next: "AM" | "PM") => {
            let newHour = displayHour
            if (next === "AM" && displayHour >= 12) newHour = displayHour - 12
            else if (next === "PM" && displayHour < 12) newHour = displayHour + 12
            onValueChange?.(`${format2(newHour)}:${format2(displayMinute)}`)
        }

        const selectClass =
            "h-9 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"

        return (
            <div
                ref={ref}
                role="group"
                aria-label={label}
                className={cn("inline-flex items-center gap-2", className)}
                data-slot="time-picker"
            >
                <Clock className="h-4 w-4 text-muted-foreground" />
                <select
                    aria-label={hourLabel}
                    disabled={disabled}
                    value={isUnset ? "" : hour12 ? display12 : displayHour}
                    onChange={(e) => setHour(Number(e.target.value))}
                    className={selectClass}
                >
                    {isUnset ? (
                        <option value="" disabled>
                            --
                        </option>
                    ) : null}
                    {hourOptions.map((h) => (
                        <option key={h} value={h}>
                            {format2(h)}
                        </option>
                    ))}
                </select>
                <span aria-hidden className="text-muted-foreground">
                    :
                </span>
                <select
                    aria-label={minuteLabel}
                    disabled={disabled}
                    value={isUnset ? "" : displayMinute}
                    onChange={(e) => setMinute(Number(e.target.value))}
                    className={selectClass}
                >
                    {isUnset ? (
                        <option value="" disabled>
                            --
                        </option>
                    ) : null}
                    {minuteOptions.map((m) => (
                        <option key={m} value={m}>
                            {format2(m)}
                        </option>
                    ))}
                </select>
                {hour12 ? (
                    <select
                        aria-label={periodLabel}
                        disabled={disabled}
                        value={ampm}
                        onChange={(e) => setAmPm(e.target.value as "AM" | "PM")}
                        className={selectClass}
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                ) : null}
            </div>
        )
    }
)
TimePicker.displayName = "TimePicker"

export { TimePicker }
