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
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-block animate-spin mr-2">⟳</span>
                                {actionLabel}...
                            </>
                        ) : (
                            actionLabel
                        )}
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )

    return { confirm, ConfirmDialog }
}
