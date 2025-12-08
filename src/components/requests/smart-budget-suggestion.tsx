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
    "Plomería": { min: 15000, max: 5000000, avg: 150000 },
    "Gasista": { min: 25000, max: 5000000, avg: 300000 },
    "Electricista": { min: 20000, max: 5000000, avg: 200000 },
    "Albañilería": { min: 30000, max: 10000000, avg: 500000 },
    "Pintura": { min: 25000, max: 5000000, avg: 250000 },
    "Climatización (AA/Calefacción)": { min: 35000, max: 5000000, avg: 180000 },
    "Reparación de PC/Notebooks": { min: 15000, max: 2000000, avg: 80000 },
    "Mecánica Ligera": { min: 20000, max: 5000000, avg: 150000 },
    "Fletes y Mudanzas": { min: 30000, max: 3000000, avg: 120000 },
    "default": { min: 10000, max: 5000000, avg: 100000 }
}

export function SmartBudgetSuggestion({ category, onBudgetChange }: SmartBudgetSuggestionProps) {
    const rates = MARKET_RATES[category] || MARKET_RATES["default"]
    // Default suggestion: Min to ~Avg (rounded)
    const suggestedMax = Math.min(Math.ceil(rates.avg / 5000) * 5000, 100000)
    const [range, setRange] = useState<[number, number]>([rates.min, suggestedMax])

    useEffect(() => {
        // Reset when category changes and NOTIFY parent
        const newRange: [number, number] = [rates.min, suggestedMax]
        setRange(newRange)
        if (onBudgetChange) onBudgetChange(newRange)
    }, [category, rates, suggestedMax, onBudgetChange])

    const handleRangeChange = (value: number[]) => {
        const newRange = [value[0], value[1]] as [number, number]
        setRange(newRange)
        onBudgetChange?.(newRange)
    }

    return (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
            <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-secondary/10 rounded-full text-secondary">
                        <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-blue-900">Sugerencia de Presupuesto</h4>
                        <p className="text-xs text-secondary/80">
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
                        defaultValue={[rates.min, suggestedMax]}
                        value={[range[0], range[1]]}
                        min={0}
                        max={5000000}
                        step={5000}
                        onValueChange={handleRangeChange}
                        className="py-2"
                    />

                    <div className="flex items-center gap-2 text-xs text-secondary bg-secondary/10/50 p-2 rounded-md">
                        <Info className="h-3 w-3 shrink-0" />
                        <span>El 80% de los trabajos se cierran en este rango.</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
