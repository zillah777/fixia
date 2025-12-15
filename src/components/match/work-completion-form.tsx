"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface WorkCompletionFormProps {
  matchId: string
  isCompleted: boolean
  clientId: string
  providerId: string
  currentUserId: string
  clientApprovedCompletion?: boolean | null
  providerApprovedCompletion?: boolean | null
}

interface CompletionStatus {
  clientApproved?: boolean
  providerApproved?: boolean
  completedAt?: string
}

export function WorkCompletionForm({
  matchId,
  isCompleted,
  clientId,
  providerId,
  currentUserId,
  clientApprovedCompletion,
  providerApprovedCompletion,
}: WorkCompletionFormProps) {
  const [loading, setLoading] = useState(false)
  // Initialize status from props
  const [status, setStatus] = useState<CompletionStatus>({
    clientApproved: !!clientApprovedCompletion,
    providerApproved: !!providerApprovedCompletion
  })
  const [showForm, setShowForm] = useState(false)
  const [comment, setComment] = useState("")
  const isClient = currentUserId === clientId
  const isProvider = currentUserId === providerId

  const handleMarkComplete = async () => {
    // Comment is now optional for everyone
    // if (!comment.trim() && isProvider) { ... }

    setLoading(true)
    try {
      const res = await fetch(`/api/matches/${matchId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approved: true,
          comment: isProvider ? comment : undefined,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setStatus(data)
        toast.success(
          isProvider
            ? "Trabajo completado. Esperando confirmación del cliente."
            : "Has confirmado el trabajo."
        )
        setComment("")
        setShowForm(false)
      } else {
        throw new Error("Error al marcar como completado")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al procesar solicitud")
    } finally {
      setLoading(false)
    }
  }

  const handleRejectCompletion = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/matches/${matchId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approved: false,
          comment: "El trabajo no está completado",
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setStatus(data)
        toast.success("Se ha indicado que el trabajo no está completado")
      } else {
        throw new Error("Error al rechazar")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al procesar solicitud")
    } finally {
      setLoading(false)
    }
  }

  // If work is already completed, show completion status only
  if (isCompleted) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Trabajo completado. Por favor califica al otro usuario para cerrar este match.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-3">
      {/* Status display */}
      {(status.clientApproved !== undefined || status.providerApproved !== undefined) && (
        <div className="text-xs p-2 bg-muted rounded space-y-1">
          <p className="font-medium">Estado de aprobación:</p>
          <div className="flex items-center gap-2">
            {status.providerApproved ? (
              <CheckCircle2 className="h-3 w-3 text-green-600" />
            ) : (
              <AlertCircle className="h-3 w-3 text-yellow-600" />
            )}
            <span>
              Profesional: {status.providerApproved ? "✓ Confirmó" : "⏳ Pendiente"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {status.clientApproved ? (
              <CheckCircle2 className="h-3 w-3 text-green-600" />
            ) : (
              <AlertCircle className="h-3 w-3 text-yellow-600" />
            )}
            <span>
              Cliente: {status.clientApproved ? "✓ Confirmó" : "⏳ Pendiente"}
            </span>
          </div>
        </div>
      )}

      {/* Form toggle for professionals */}
      {isProvider && !showForm && (
        <Button
          onClick={() => setShowForm(true)}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          <Clock className="h-3 w-3 mr-1" />
          Marcar Trabajo como Completado
        </Button>
      )}

      {/* Form for professionals to declare completion */}
      {isProvider && showForm && (
        <div className="space-y-2 p-3 bg-accent/5 rounded-lg border">
          <label className="block text-xs font-medium">
            Descripción del trabajo realizado
          </label>
          <Textarea
            placeholder="Describe brevemente qué has realizado..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
            className="min-h-[60px] text-sm"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleMarkComplete}
              disabled={loading}
              size="sm"
              className="flex-1 text-xs"
            >
              {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
              Enviar
            </Button>
            <Button
              onClick={() => {
                setShowForm(false)
                setComment("")
              }}
              disabled={loading}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Client approval/rejection buttons */}
      {isClient && (
        <div className="space-y-2">
          <Alert className="text-xs bg-blue-50 border-blue-200">
            <AlertCircle className="h-3 w-3 text-blue-600" />
            <AlertDescription className="text-blue-800">
              ¿El trabajo se ha completado correctamente?
            </AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button
              onClick={handleMarkComplete}
              disabled={loading}
              size="sm"
              className="flex-1 text-xs"
            >
              {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
              Sí, Completado
            </Button>
            <Button
              onClick={handleRejectCompletion}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
            >
              No, Rechazar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
