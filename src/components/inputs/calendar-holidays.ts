export interface CalendarHoliday {
    date: Date
    label: string
}

function holiday(year: number, month: number, day: number, label: string): CalendarHoliday {
    return { date: new Date(year, month - 1, day), label }
}

export function calendarDateKey(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

// Source: Cabinet Office, Government of Japan, "国民の祝日について".
// Keep this list isolated so applications can replace it with their own
// holiday file without changing Calendar rendering logic.
export const japaneseHolidays: CalendarHoliday[] = [
    holiday(2026, 1, 1, "元日"),
    holiday(2026, 1, 12, "成人の日"),
    holiday(2026, 2, 11, "建国記念の日"),
    holiday(2026, 2, 23, "天皇誕生日"),
    holiday(2026, 3, 20, "春分の日"),
    holiday(2026, 4, 29, "昭和の日"),
    holiday(2026, 5, 3, "憲法記念日"),
    holiday(2026, 5, 4, "みどりの日"),
    holiday(2026, 5, 5, "こどもの日"),
    holiday(2026, 5, 6, "休日"),
    holiday(2026, 7, 20, "海の日"),
    holiday(2026, 8, 11, "山の日"),
    holiday(2026, 9, 21, "敬老の日"),
    holiday(2026, 9, 22, "休日"),
    holiday(2026, 9, 23, "秋分の日"),
    holiday(2026, 10, 12, "スポーツの日"),
    holiday(2026, 11, 3, "文化の日"),
    holiday(2026, 11, 23, "勤労感謝の日"),
    holiday(2027, 1, 1, "元日"),
    holiday(2027, 1, 11, "成人の日"),
    holiday(2027, 2, 11, "建国記念の日"),
    holiday(2027, 2, 23, "天皇誕生日"),
    holiday(2027, 3, 21, "春分の日"),
    holiday(2027, 3, 22, "休日"),
    holiday(2027, 4, 29, "昭和の日"),
    holiday(2027, 5, 3, "憲法記念日"),
    holiday(2027, 5, 4, "みどりの日"),
    holiday(2027, 5, 5, "こどもの日"),
    holiday(2027, 7, 19, "海の日"),
    holiday(2027, 8, 11, "山の日"),
    holiday(2027, 9, 20, "敬老の日"),
    holiday(2027, 9, 23, "秋分の日"),
    holiday(2027, 10, 11, "スポーツの日"),
    holiday(2027, 11, 3, "文化の日"),
    holiday(2027, 11, 23, "勤労感謝の日"),
]
