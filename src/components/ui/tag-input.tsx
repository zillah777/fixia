"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TagInputProps extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    maxTags?: number
}

export function TagInput({
    value = [],
    onChange,
    placeholder = "Escribe y presiona Enter...",
    maxTags = 5,
    className,
    ...props
}: TagInputProps) {
    const [inputValue, setInputValue] = React.useState("")

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addTag()
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            removeTag(value.length - 1)
        }
    }

    const addTag = () => {
        const trimmedInput = inputValue.trim()
        if (trimmedInput && !value.includes(trimmedInput) && value.length < maxTags) {
            onChange([...value, trimmedInput])
            setInputValue("")
        }
    }

    const removeTag = (indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove))
    }

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div className="flex flex-wrap gap-2">
                {value.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1 pl-2 pr-1">
                        {tag}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 hover:bg-transparent text-muted-foreground hover:text-foreground"
                            onClick={() => removeTag(index)}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remover {tag}</span>
                        </Button>
                    </Badge>
                ))}
            </div>
            <div className="relative">
                <Input
                    {...props}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={value.length >= maxTags ? `Máximo ${maxTags} tags alcanzado` : placeholder}
                    disabled={value.length >= maxTags || props.disabled}
                />
                <div className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                    {value.length}/{maxTags}
                </div>
            </div>
        </div>
    )
}
