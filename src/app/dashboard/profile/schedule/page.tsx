"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Clock, CalendarOff } from "lucide-react"

// Days of the week
const DAYS = [
    { id: "mon", label: "Lunes" },
    { id: "tue", label: "Martes" },
    { id: "wed", label: "Miércoles" },
    { id: "thu", label: "Jueves" },
    { id: "fri", label: "Viernes" },
    { id: "sat", label: "Sábado" },
    { id: "sun", label: "Domingo" },
]

// Hours generation
const HOURS = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0")
    return `${hour}:00`
})

export default function SchedulePage() {
    const [vacationMode, setVacationMode] = useState(false)
    const [schedule, setSchedule] = useState(
        DAYS.map(day => ({
            ...day,
            active: day.id !== "sun",
            start: "09:00",
            end: "18:00"
        }))
    )

    const handleDayToggle = (dayId: string) => {
        setSchedule(schedule.map(day =>
            day.id === dayId ? { ...day, active: !day.active } : day
        ))
    }

    const handleTimeChange = (dayId: string, type: "start" | "end", value: string) => {
        setSchedule(schedule.map(day =>
            day.id === dayId ? { ...day, [type]: value } : day
        ))
    }

    const handleSave = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("Disponibilidad actualizada correctamente")
        } catch (error) {
            toast.error("Error al guardar disponibilidad", {
                description: "Hubo un problema al guardar tus horarios."
            })
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Disponibilidad</h2>
                <p className="text-muted-foreground">Configura tus horarios de trabajo para recibir solicitudes.</p>
            </div>

            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-medium">Modo Vacaciones</CardTitle>
                        <CardDescription>
                            Pausa temporalmente tu perfil para no recibir nuevas solicitudes.
                        </CardDescription>
                    </div>
                    <Switch
                        checked={vacationMode}
                        onCheckedChange={setVacationMode}
                    />
                </CardHeader>
            </Card>

            <Card className={vacationMode ? "opacity-50 pointer-events-none" : ""}>
                <CardHeader>
                    <CardTitle>Horarios Semanales</CardTitle>
                    <CardDescription>
                        Define tu franja horaria habitual para cada día.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {schedule.map((day) => (
                        <div key={day.id} className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                            <div className="flex items-center space-x-4">
                                <Switch
                                    id={`switch-${day.id}`}
                                    checked={day.active}
                                    onCheckedChange={() => handleDayToggle(day.id)}
                                />
                                <Label htmlFor={`switch-${day.id}`} className="w-20 font-medium">
                                    {day.label}
                                </Label>
                            </div>

                            {day.active ? (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <Select
                                            value={day.start}
                                            onValueChange={(v) => handleTimeChange(day.id, "start", v)}
                                        >
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {HOURS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <span className="text-muted-foreground">-</span>
                                    <Select
                                        value={day.end}
                                        onValueChange={(v) => handleTimeChange(day.id, "end", v)}
                                    >
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {HOURS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CalendarOff className="h-4 w-4" />
                                    <span className="text-sm">No disponible</span>
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSave}>Guardar Cambios</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
