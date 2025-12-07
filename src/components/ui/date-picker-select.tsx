"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface DatePickerSelectProps {
    value?: Date
    onChange: (date: Date | undefined) => void
    minYear?: number
    maxYear?: number
}

const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

export function DatePickerSelect({
    value,
    onChange,
    minYear = 1900,
    maxYear = new Date().getFullYear()
}: DatePickerSelectProps) {
    const [day, setDay] = React.useState<string>(value ? value.getDate().toString() : "")
    const [month, setMonth] = React.useState<string>(value ? value.getMonth().toString() : "")
    const [year, setYear] = React.useState<string>(value ? value.getFullYear().toString() : "")

    // Update internal state when value prop changes
    React.useEffect(() => {
        if (value) {
            setDay(value.getDate().toString())
            setMonth(value.getMonth().toString())
            setYear(value.getFullYear().toString())
        }
    }, [value])

    const updateDate = (d: string, m: string, y: string) => {
        if (d && m && y) {
            const newDate = new Date(parseInt(y), parseInt(m), parseInt(d), 12, 0, 0)
            onChange(newDate)
        } else {
            onChange(undefined)
        }
    }

    const handleDayChange = (v: string) => {
        setDay(v)
        updateDate(v, month, year)
    }

    const handleMonthChange = (v: string) => {
        setMonth(v)
        updateDate(day, v, year)
    }

    const handleYearChange = (v: string) => {
        setYear(v)
        updateDate(day, month, v)
    }

    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString())
    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => (maxYear - i).toString())

    return (
        <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
                <Select value={day} onValueChange={handleDayChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Día" />
                    </SelectTrigger>
                    <SelectContent>
                        {days.map((d) => (
                            <SelectItem key={d} value={d}>
                                {d}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Select value={month} onValueChange={handleMonthChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Mes" />
                    </SelectTrigger>
                    <SelectContent>
                        {MONTHS.map((m, i) => (
                            <SelectItem key={i} value={i.toString()}>
                                {m.slice(0, 3)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Select value={year} onValueChange={handleYearChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Año" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((y) => (
                            <SelectItem key={y} value={y}>
                                {y}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
