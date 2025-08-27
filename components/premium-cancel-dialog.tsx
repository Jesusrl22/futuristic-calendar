"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import {
  Crown,
  X,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Palette,
  Target,
  BookOpen,
  BarChart3,
  Headphones,
  Zap,
} from "lucide-react"

interface PremiumCancelDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirmCancel: () => void
  currentPlan: "free" | "premium"
}

export default function PremiumCancelDialog({
  isOpen,
  onClose,
  onConfirmCancel,
  currentPlan,
}: PremiumCancelDialogProps) {
  const [step, setStep] = useState(1)
  const [cancelReason, setCancelReason] = useState("")
  const [feedback, setFeedback] = useState("")
  const [showSpecialOffer, setShowSpecialOffer] = useState(false)

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const cancelReasons = [
    { id: "too-expensive", label: "Es muy caro" },
    { id: "not-using", label: "No lo uso lo suficiente" },
    { id: "missing-features", label: "Le faltan funciones que necesito" },
    { id: "technical-issues", label: "Problemas técnicos" },
    { id: "found-alternative", label: "Encontré una alternativa mejor" },
    { id: "other", label: "Otro motivo" },
  ]

  const premiumFeatures = [
    {
      icon: Palette,
      title: "11 Temas Exclusivos",
      description: "Personaliza tu experiencia con temas únicos",
    },
    {
      icon: Target,
      title: "Objetivos Ilimitados",
      description: "Crea y gestiona todos los objetivos que necesites",
    },
    {
      icon: BookOpen,
      title: "Sistema de Notas",
      description: "Blog personal con categorías y búsqueda avanzada",
    },
    {
      icon: BarChart3,
      title: "Estadísticas Avanzadas",
      description: "Análisis detallado de tu productividad",
    },
    {
      icon: Headphones,
      title: "Soporte Prioritario",
      description: "Atención personalizada y respuesta rápida",
    },
    {
      icon: Zap,
      title: "Tareas Ilimitadas",
      description: "Sin límites en la cantidad de tareas",
    },
  ]

  const handleNext = () => {
    if (step === 1 && cancelReason === "too-expensive") {
      setShowSpecialOffer(true)
    }
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleConfirmCancel = () => {
    onConfirmCancel()
    onClose()
    // Reset state
    setStep(1)
    setCancelReason("")
    setFeedback("")
    setShowSpecialOffer(false)
  }

  const handleClose = () => {
    onClose()
    // Reset state
    setStep(1)
    setCancelReason("")
    setFeedback("")
    setShowSpecialOffer(false)
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">¿Estás seguro de que quieres cancelar?</h3>
        <p className="text-gray-600">Perderás acceso a todas las funciones Premium inmediatamente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {premiumFeatures.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title} className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Icon className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">{feature.title}</h4>
                    <p className="text-sm text-red-700">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            <strong>Importante:</strong> Una vez cancelado, no podrás recuperar tus datos Premium como objetivos y
            notas.
          </p>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">¿Por qué quieres cancelar?</h3>
        <p className="text-gray-600">Tu opinión nos ayuda a mejorar FutureTask</p>
      </div>

      <RadioGroup value={cancelReason} onValueChange={setCancelReason}>
        <div className="space-y-3">
          {cancelReasons.map((reason) => (
            <div key={reason.id} className="flex items-center space-x-2">
              <RadioGroupItem value={reason.id} id={reason.id} />
              <Label htmlFor={reason.id} className="flex-1 cursor-pointer">
                {reason.label}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>

      {showSpecialOffer && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="text-center">
              <Crown className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900 mb-2">¡Oferta Especial!</h4>
              <p className="text-sm text-green-800 mb-3">
                Entendemos que el precio puede ser una preocupación. Te ofrecemos un <strong>50% de descuento</strong>{" "}
                por los próximos 3 meses.
              </p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    // Handle special offer acceptance
                    handleClose()
                  }}
                >
                  Aceptar Oferta
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowSpecialOffer(false)}>
                  No, gracias
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {cancelReason === "other" && (
        <div className="space-y-2">
          <Label htmlFor="feedback">Cuéntanos más (opcional)</Label>
          <Textarea
            id="feedback"
            placeholder="¿Qué podríamos hacer mejor?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
          />
        </div>
      )}
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Confirmación Final</h3>
        <p className="text-gray-600">Esta acción no se puede deshacer</p>
      </div>

      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-red-900 mb-2">Al cancelar perderás:</h4>
          <ul className="space-y-1 text-sm text-red-800">
            <li>• Acceso a 11 temas exclusivos</li>
            <li>• Objetivos y wishlist personalizados</li>
            <li>• Sistema de notas y blog personal</li>
            <li>• Estadísticas avanzadas</li>
            <li>• Soporte prioritario</li>
            <li>• Tareas ilimitadas (límite: 50/mes)</li>
          </ul>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">¿Cambio de opinión?</h4>
        <p className="text-sm text-blue-800 mb-3">
          Puedes reactivar Premium en cualquier momento desde la configuración.
        </p>
        <Button
          size="sm"
          variant="outline"
          className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
          onClick={handleClose}
        >
          Mantener Premium
        </Button>
      </div>

      {feedback && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2">Tu comentario:</h4>
            <p className="text-sm text-gray-600 italic">"{feedback}"</p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  if (currentPlan !== "premium") {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <span>Cancelar Premium</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Paso {step} de {totalSteps}
              </span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center space-x-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Anterior</span>
            </Button>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Mantener Premium
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={step === 2 && !cancelReason}
                  className="flex items-center space-x-2"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleConfirmCancel} variant="destructive" className="bg-red-600 hover:bg-red-700">
                  Confirmar Cancelación
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
