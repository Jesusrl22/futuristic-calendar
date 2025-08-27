"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Crown, CreditCard } from "lucide-react"
import { toast } from "sonner"

interface PayPalButtonProps {
  amount: number
  planType: "monthly" | "yearly"
  onSuccess: () => void
}

export default function PayPalButton({ amount, planType, onSuccess }: PayPalButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful payment
      toast.success("¡Pago procesado exitosamente!")
      onSuccess()
    } catch (error) {
      toast.error("Error al procesar el pago")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={isProcessing}
      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
    >
      {isProcessing ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Procesando...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Crown className="h-4 w-4" />
          <span>Actualizar a Premium - €{amount.toFixed(2)}</span>
          <CreditCard className="h-4 w-4" />
        </div>
      )}
    </Button>
  )
}
