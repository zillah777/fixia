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
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            transitionProperty: 'all',
                            transitionDuration: '200ms',
                            backgroundColor: '#DC2626',
                            color: 'white',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            outline: 'none',
                            height: '40px',
                            paddingLeft: '16px',
                            paddingRight: '16px',
                            paddingTop: '8px',
                            paddingBottom: '8px',
                            minWidth: '100px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.5 : 1,
                            pointerEvents: isLoading ? 'none' : 'auto',
                        }}
                        onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#991B1B')}
                        onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#DC2626')}
                    >
                        {isLoading ? (
                            <>
                                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '8px' }}>⟳</span>
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
