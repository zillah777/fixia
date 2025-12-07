"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CATEGORIES } from "@/config/categories"

interface CategorySelectorProps {
    value?: string
    onChange: (value: string) => void
    className?: string
    placeholder?: string
}

export function CategorySelector({ value, onChange, className, placeholder = "Selecciona una categoría" }: CategorySelectorProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                >
                    {value
                        ? CATEGORIES.find((category) => category.id === value)?.label
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar categoría..." />
                    <CommandList>
                        <CommandEmpty>No se encontró la categoría.</CommandEmpty>
                        <CommandGroup>
                            {CATEGORIES.map((category) => (
                                <CommandItem
                                    key={category.id}
                                    value={category.label} // Command searches by label automatically
                                    onSelect={() => {
                                        onChange(category.id === value ? "" : category.id)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === category.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {category.label}
                                    <span className="ml-auto text-xs text-muted-foreground">{category.group}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
