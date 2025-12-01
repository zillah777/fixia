"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Info, TrendingUp, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SmartBudgetSuggestionProps {
    category: string
    onBudgetChange?: (range: [number, number]) => void
}

// Mock data - In real app, this would come from API based on market rates
const MARKET_RATES: Record<string, { min: number, max: number, avg: number }> = {
    "Plomería": { min: 15000, max: 45000, avg: 25000 },
    "Electricidad": { min: 20000, max: 60000, avg: 35000 },
    "Gasista": { min: 25000, max: 80000, avg: 45000 },
    "default": { min: 10000, max: 50000, avg: 20000 }
}

export function SmartBudgetSuggestion({ category, onBudgetChange }: SmartBudgetSuggestionProps) {
    const rates = MARKET_RATES[category] || MARKET_RATES["default"]
    const [range, setRange] = useState<[number, number]>([rates.min, rates.max])

    useEffect(() => {
        setRange([rates.min, rates.max])
    }, [category, rates])

    const handleRangeChange = (value: number[]) => {
        const newRange = [value[0], value[1]] as [number, number]
        setRange(newRange)
        onBudgetChange?.(newRange)
    }

    return (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
            <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                        <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-blue-900">Sugerencia de Presupuesto</h4>
                        <p className="text-xs text-blue-700/80">
                            Basado en trabajos similares de {category} en tu zona.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <div className="text-center">
                            <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Mínimo</span>
                            <div className="text-lg font-bold text-gray-700">${range[0].toLocaleString()}</div>
                        </div>
                        <div className="text-center pb-1">
                            <span className="text-xs text-muted-foreground">-</span>
                        </div>
                        <div className="text-center">
                            <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Máximo</span>
                            <div className="text-lg font-bold text-gray-900">${range[1].toLocaleString()}</div>
                        </div>
                    </div>

                    <Slider
                        defaultValue={[rates.min, rates.max]}
                        value={[range[0], range[1]]}
                        min={rates.min * 0.5}
                        max={rates.max * 1.5}
                        step={1000}
                        onValueChange={handleRangeChange}
                        className="py-2"
                    />

                    <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-100/50 p-2 rounded-md">
                        <Info className="h-3 w-3 shrink-0" />
                        <span>El 80% de los trabajos se cierran en este rango.</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
