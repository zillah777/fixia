"use client"

import { useState } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function useConfirmDialog() {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [actionLabel, setActionLabel] = useState("Eliminar")
    const [cancelLabel, setCancelLabel] = useState("Cancelar")
    const [onConfirm, setOnConfirm] = useState<() => void | Promise<void>>(() => {})
    const [isLoading, setIsLoading] = useState(false)

    const confirm = async (
        confirmTitle: string,
        confirmDescription: string,
        onAction: () => void | Promise<void>,
        options?: {
            actionLabel?: string
            cancelLabel?: string
        }
    ) => {
        setTitle(confirmTitle)
        setDescription(confirmDescription)
        setActionLabel(options?.actionLabel || "Eliminar")
        setCancelLabel(options?.cancelLabel || "Cancelar")
        setOnConfirm(() => onAction)
        setOpen(true)
    }

    const handleConfirm = async () => {
        setIsLoading(true)
        try {
            await onConfirm()
        } finally {
            setIsLoading(false)
            setOpen(false)
        }
    }

    const ConfirmDialog = () => (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
                <div className="flex gap-2 justify-end">
                    <AlertDialogCancel disabled={isLoading}>
                        {cancelLabel}
                    </AlertDialogCancel>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 bg-red-600 text-white hover:opacity-90 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-block animate-spin mr-2">⟳</span>
                                {actionLabel}...
                            </>
                        ) : (
                            actionLabel
                        )}
                    </button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )

    return { confirm, ConfirmDialog }
}
