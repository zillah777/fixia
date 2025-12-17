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
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { CATEGORIES } from "@/config/categories"

interface CategorySelectorProps {
    value?: string
    onChange: (value: string) => void
    className?: string
    placeholder?: string
}

interface CategorySelectorDrawerProps extends CategorySelectorProps {
    open: boolean
    setOpen: (open: boolean) => void
}

// Hook para detectar si es móvil
function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return isMobile
}

// Variante móvil con Drawer (bottom sheet nativo)
function MobileCategoryDrawer({
    open,
    setOpen,
    value,
    onChange,
    placeholder = "Selecciona una categoría"
}: CategorySelectorDrawerProps) {
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-12 text-base"
                >
                    <span className="truncate">
                        {value
                            ? CATEGORIES.find((category) => category.id === value)?.label
                            : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh]">
                <DrawerHeader>
                    <DrawerTitle>Selecciona una categoría</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-4 overflow-auto">
                    <Command>
                        <CommandInput
                            placeholder="Buscar categoría..."
                            className="h-12 text-base mb-4"
                        />
                        <CommandList className="max-h-[55vh]">
                            <CommandEmpty>
                                <div className="py-8 text-center">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        No se encontró la categoría
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Intenta con otro término
                                    </p>
                                </div>
                            </CommandEmpty>
                            <CommandGroup>
                                {CATEGORIES.map((category) => (
                                    <CommandItem
                                        key={category.id}
                                        value={category.label}
                                        onSelect={() => {
                                            onChange(category.id === value ? "" : category.id)
                                            setOpen(false)
                                        }}
                                        className="px-4 py-3.5 text-base active:bg-accent/50 transition-colors"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-3 h-5 w-5",
                                                value === category.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <span className="flex-1">{category.label}</span>
                                        <span className="ml-auto text-sm text-muted-foreground">
                                            {category.group}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export function CategorySelector({ value, onChange, className, placeholder = "Selecciona una categoría" }: CategorySelectorProps) {
    const [open, setOpen] = React.useState(false)
    const isMobile = useIsMobile()

    // Renderizar variante móvil en pantallas pequeñas
    if (isMobile) {
        return (
            <MobileCategoryDrawer
                open={open}
                setOpen={setOpen}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between h-12 text-base", className)}
                >
                    <span className="truncate">
                        {value
                            ? CATEGORIES.find((category) => category.id === value)?.label
                            : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[min(calc(100vw-1rem),320px)] p-0" align="start" sideOffset={8}>
                <Command>
                    <CommandInput placeholder="Buscar categoría..." className="h-12 text-base" />
                    <CommandList className="max-h-[60vh] sm:max-h-[300px]">
                        <CommandEmpty>
                            <div className="py-8 text-center">
                                <p className="text-sm text-muted-foreground mb-2">
                                    No se encontró la categoría
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Intenta con otro término
                                </p>
                            </div>
                        </CommandEmpty>
                        <CommandGroup>
                            {CATEGORIES.map((category) => (
                                <CommandItem
                                    key={category.id}
                                    value={category.label}
                                    onSelect={() => {
                                        onChange(category.id === value ? "" : category.id)
                                        setOpen(false)
                                    }}
                                    className="px-4 py-3 sm:px-2 sm:py-1.5 text-base sm:text-sm active:bg-accent/50 transition-colors"
                                >
                                    <Check
                                        className={cn(
                                            "mr-3 h-5 w-5 sm:mr-2 sm:h-4 sm:w-4",
                                            value === category.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <span className="flex-1 truncate">{category.label}</span>
                                    <span className="ml-auto text-sm sm:text-xs text-muted-foreground">{category.group}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
