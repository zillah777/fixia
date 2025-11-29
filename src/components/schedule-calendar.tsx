"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TimeSlot {
    time: string
    available: boolean
}

interface ScheduleDay {
    date: Date
    slots: TimeSlot[]
    booked: number
}

const TIME_SLOTS: TimeSlot[] = [
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: false },
    { time: "12:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: false },
    { time: "16:00", available: true },
    { time: "17:00", available: true },
]

export function ScheduleCalendar() {
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
    const [selectedTime, setSelectedTime] = React.useState<string | null>(null)

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const firstDay = new Date(year, month, 1).getDay()
        return { daysInMonth, firstDay }
    }

    const { daysInMonth, firstDay } = getDaysInMonth(selectedDate)

    const days = []
    for (let i = 0; i < firstDay; i++) {
        days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i))
    }

    const handlePrevMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))
    }

    const handleNextMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))
    }

    const isToday = (date: Date | null) => {
        if (!date) return false
        const today = new Date()
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
    }

    const isSelected = (date: Date | null) => {
        if (!date) return false
        return (
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear()
        )
    }

    const monthName = selectedDate.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
    })

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {/* Calendar */}
            <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Calendario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePrevMonth}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h3 className="text-sm font-semibold capitalize text-center flex-1">
                            {monthName}
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleNextMonth}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-2">
                        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"].map((day) => (
                            <div key={day} className="text-center text-xs font-semibold text-muted-foreground h-8">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day, index) => (
                            <button
                                key={index}
                                onClick={() => day && setSelectedDate(day)}
                                className={`h-8 rounded text-sm font-medium transition-colors ${
                                    !day
                                        ? "text-transparent"
                                        : isSelected(day)
                                        ? "bg-primary text-primary-foreground"
                                        : isToday(day)
                                        ? "bg-blue-100 dark:bg-blue-900/50 text-primary border border-primary"
                                        : "hover:bg-muted text-foreground"
                                }`}
                            >
                                {day?.getDate()}
                            </button>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="pt-4 border-t space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Seleccionado:</span>
                            <span className="font-semibold">
                                {selectedDate.toLocaleDateString("es-ES")}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Disponibles:</span>
                            <Badge variant="secondary">
                                {TIME_SLOTS.filter((s) => s.available).length}/
                                {TIME_SLOTS.length}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Time Slots */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-lg">
                        Horarios disponibles -{" "}
                        <span className="text-muted-foreground text-sm font-normal">
                            {selectedDate.toLocaleDateString("es-ES")}
                        </span>
                    </CardTitle>
                    <CardDescription>
                        Selecciona un horario para reservar tu servicio
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {TIME_SLOTS.map((slot) => (
                            <button
                                key={slot.time}
                                onClick={() =>
                                    slot.available && setSelectedTime(slot.time)
                                }
                                disabled={!slot.available}
                                className={`h-12 rounded-lg border-2 flex items-center justify-center font-medium transition-all text-sm ${
                                    !slot.available
                                        ? "border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 cursor-not-allowed"
                                        : selectedTime === slot.time
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border hover:border-primary hover:bg-muted"
                                }`}
                            >
                                <Clock className="h-4 w-4 mr-1" />
                                {slot.time}
                            </button>
                        ))}
                    </div>

                    {selectedTime && (
                        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-300">
                                ✓ Horario seleccionado: <strong>{selectedTime}</strong> del{" "}
                                <strong>{selectedDate.toLocaleDateString("es-ES")}</strong>
                            </p>
                        </div>
                    )}

                    <Button className="w-full mt-4" disabled={!selectedTime}>
                        Confirmar Reserva
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
