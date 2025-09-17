"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  CREDIT_PACKAGES,
  formatCredits,
  formatCreditsEstimate,
  calculateCreditsFromAmount,
  validateCustomAmount,
  purchaseCredits,
  formatCurrency,
} from "@/lib/ai-credits"
import { Loader2, CreditCard, Zap, Star, Crown } from "lucide-react"

interface AiCreditsPurchaseProps {
  userId: string
  onPurchaseComplete?: (credits: number) => void
}

export function AiCreditsPurchase({ userId, onPurchaseComplete }: AiCreditsPurchaseProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [purchaseStatus, setPurchaseStatus] = useState<"idle" | "success" | "error">("idle")

  const handlePackagePurchase = async (packageId: string) => {
    setIsLoading(true)
    setPurchaseStatus("idle")

    try {
      const success = await purchaseCredits(userId, packageId)
      if (success) {
        setPurchaseStatus("success")
        const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId)
        if (pkg && onPurchaseComplete) {
          onPurchaseComplete(pkg.credits)
        }
      } else {
        setPurchaseStatus("error")
      }
    } catch (error) {
      setPurchaseStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomPurchase = async () => {
    const amount = Number.parseFloat(customAmount)
    const validation = validateCustomAmount(amount)

    if (!validation.valid) {
      setPurchaseStatus("error")
      return
    }

    setIsLoading(true)
    setPurchaseStatus("idle")

    try {
      const success = await purchaseCredits(userId, "", amount)
      if (success) {
        setPurchaseStatus("success")
        const credits = calculateCreditsFromAmount(amount)
        if (onPurchaseComplete) {
          onPurchaseComplete(credits)
        }
      } else {
        setPurchaseStatus("error")
      }
    } catch (error) {
      setPurchaseStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  const customCredits = customAmount ? calculateCreditsFromAmount(Number.parseFloat(customAmount) || 0) : 0
  const customValidation = customAmount ? validateCustomAmount(Number.parseFloat(customAmount) || 0) : { valid: true }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Comprar Créditos IA</h2>
        <p className="text-muted-foreground">Elige el paquete perfecto para tus necesidades de IA</p>
      </div>

      {purchaseStatus === "success" && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700">
              <Zap className="h-5 w-5" />
              <span className="font-medium">¡Compra exitosa! Tus créditos han sido añadidos.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {purchaseStatus === "error" && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <span className="font-medium">Error en la compra. Por favor, inténtalo de nuevo.</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="packages">Paquetes Predefinidos</TabsTrigger>
          <TabsTrigger value="custom">Cantidad Personalizada</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {CREDIT_PACKAGES.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative cursor-pointer transition-all hover:shadow-lg ${
                  selectedPackage === pkg.id ? "ring-2 ring-primary" : ""
                } ${pkg.popular ? "border-blue-200" : ""} ${pkg.bestValue ? "border-green-200" : ""}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
                {pkg.bestValue && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500">
                    <Crown className="h-3 w-3 mr-1" />
                    Mejor Valor
                  </Badge>
                )}

                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  <div className="text-2xl font-bold text-primary">{formatCurrency(pkg.price)}</div>
                </CardHeader>

                <CardContent className="text-center space-y-2">
                  <div className="text-xl font-semibold">{formatCredits(pkg.credits)} créditos</div>
                  <div className="text-sm text-muted-foreground">{formatCreditsEstimate(pkg.credits)}</div>
                  <div className="text-xs text-muted-foreground">{pkg.description}</div>
                  {pkg.savings && (
                    <div className="text-xs text-green-600 font-medium">Ahorra {formatCurrency(pkg.savings)}</div>
                  )}

                  <Button
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePackagePurchase(pkg.id)
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    Comprar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold">¿Cómo funcionan los créditos?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Consulta Simple</div>
                    <div className="text-muted-foreground">2 créditos</div>
                  </div>
                  <div>
                    <div className="font-medium">Consulta Promedio</div>
                    <div className="text-muted-foreground">5 créditos</div>
                  </div>
                  <div>
                    <div className="font-medium">Consulta Compleja</div>
                    <div className="text-muted-foreground">8-15 créditos</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Cantidad Personalizada</CardTitle>
              <CardDescription>Elige la cantidad exacta que necesitas (mínimo €10)</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Cantidad en Euros</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10.00"
                  min="10"
                  max="999.99"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
                {!customValidation.valid && <p className="text-sm text-red-600">{customValidation.message}</p>}
              </div>

              {customAmount && customValidation.valid && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Créditos:</span>
                    <span className="font-semibold">{formatCredits(customCredits)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimación:</span>
                    <span className="text-sm text-muted-foreground">{formatCreditsEstimate(customCredits)}</span>
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleCustomPurchase}
                disabled={!customAmount || !customValidation.valid || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                Comprar {customAmount && formatCurrency(Number.parseFloat(customAmount) || 0)}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold">Ventajas de la Cantidad Personalizada</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Paga exactamente lo que necesitas</p>
                  <p>• 50 créditos por cada euro</p>
                  <p>• Sin comprometerte a paquetes grandes</p>
                  <p>• Perfecto para necesidades específicas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AiCreditsPurchase
