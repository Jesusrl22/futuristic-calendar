"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Loader2, CheckCircle, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface SubscriptionCancellationProps {
  userId: string
  subscriptionId: string
  currentPlan: string
  onCancellationComplete: () => void
  theme: any
}

const CANCELLATION_REASONS = [
  { value: "too_expensive", label: "Demasiado caro" },
  { value: "not_using", label: "No lo uso lo suficiente" },
  { value: "missing_features", label: "Le faltan funcionalidades" },
  { value: "technical_issues", label: "Problemas técnicos" },
  { value: "switching_service", label: "Cambio a otro servicio" },
  { value: "temporary_pause", label: "Pausa temporal" },
  { value: "other", label: "Otro motivo" },
]

export function SubscriptionCancellation({
  userId,
  subscriptionId,
  currentPlan,
  onCancellationComplete,
  theme,
}: SubscriptionCancellationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleCancellation = async () => {
    if (!selectedReason) {
      setErrorMessage("Por favor selecciona un motivo")
      return
    }

    setIsLoading(true)
    setErrorMessage("")
    setStatus("idle")

    try {
      const reason = selectedReason === "other" ? customReason : selectedReason

      const response = await fetch("/api/paypal/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId,
          userId,
          reason,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setTimeout(() => {
          onCancellationComplete()
          setIsOpen(false)
        }, 2000)
      } else {
        setStatus("error")
        setErrorMessage(data.error || "Error al cancelar la suscripción")
      }
    } catch (error) {
      setStatus("error")
      setErrorMessage("Error de conexión. Inténtalo de nuevo.")
      console.error("Cancellation error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedReason("")
    setCustomReason("")
    setStatus("idle")
    setErrorMessage("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`${theme.border} ${theme.textSecondary} hover:bg-red-500/10 hover:border-red-500 hover:text-red-400 transition-colors`}
          onClick={resetForm}
        >
          <XCircle className="w-4 h-4 mr-2" />
          Cancelar Suscripción
        </Button>
      </DialogTrigger>

      <DialogContent className={`${theme.cardBg} ${theme.border} max-w-md`}>
        <DialogHeader>
          <DialogTitle className={`${theme.textPrimary} flex items-center space-x-2`}>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span>Cancelar Suscripción</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {status === "success" ? (
            <Card className={`bg-green-500/10 border-green-500/20`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <h3 className={`font-medium ${theme.textPrimary}`}>Suscripción Cancelada</h3>
                    <p className={`text-sm ${theme.textSecondary} mt-1`}>
                      Tu suscripción se ha cancelado exitosamente. Mantienes acceso hasta el final del período de
                      facturación.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Current Plan Info */}
              <Card className={`${theme.cardBg} ${theme.border}`}>
                <CardContent className="p-4">
                  <h3 className={`font-medium ${theme.textPrimary} mb-2`}>Plan Actual</h3>
                  <p className={`text-sm ${theme.textSecondary}`}>
                    Estás cancelando tu suscripción <span className="font-medium">{currentPlan}</span>
                  </p>
                  <p className={`text-xs ${theme.textMuted} mt-2`}>
                    Mantendrás acceso a todas las funcionalidades hasta el final de tu período de facturación actual.
                  </p>
                </CardContent>
              </Card>

              {/* Cancellation Reason */}
              <div className="space-y-3">
                <Label className={`${theme.textPrimary}`}>¿Por qué cancelas tu suscripción?</Label>
                <Select value={selectedReason} onValueChange={setSelectedReason}>
                  <SelectTrigger className={`${theme.cardBg} ${theme.border} ${theme.textPrimary}`}>
                    <SelectValue placeholder="Selecciona un motivo" />
                  </SelectTrigger>
                  <SelectContent className={`${theme.cardBg} ${theme.border}`}>
                    {CANCELLATION_REASONS.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value} className={`${theme.textPrimary}`}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedReason === "other" && (
                  <div className="space-y-2">
                    <Label className={`${theme.textSecondary} text-sm`}>Describe tu motivo</Label>
                    <Textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Cuéntanos por qué cancelas..."
                      className={`${theme.cardBg} ${theme.border} ${theme.textPrimary} resize-none`}
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Error Message */}
              {(errorMessage || status === "error") && (
                <Card className={`bg-red-500/10 border-red-500/20`}>
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <p className={`text-sm text-red-400`}>{errorMessage || "Error al cancelar la suscripción"}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Warning */}
              <Card className={`bg-yellow-500/10 border-yellow-500/20`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className={`font-medium ${theme.textPrimary} text-sm`}>Importante</h4>
                      <ul className={`text-xs ${theme.textSecondary} mt-1 space-y-1`}>
                        <li>• La cancelación es efectiva inmediatamente</li>
                        <li>• Mantienes acceso hasta el final del período actual</li>
                        <li>• Puedes reactivar tu suscripción en cualquier momento</li>
                        <li>• Tus datos y configuraciones se conservan</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className={`flex-1 ${theme.border} ${theme.textSecondary}`}
                >
                  Mantener Suscripción
                </Button>
                <Button
                  onClick={handleCancellation}
                  disabled={isLoading || !selectedReason || (selectedReason === "other" && !customReason.trim())}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cancelando...
                    </>
                  ) : (
                    "Confirmar Cancelación"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
