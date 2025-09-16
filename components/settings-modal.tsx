"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Clock, Save, User, Crown, Sparkles, AlertTriangle, X, Calendar } from "lucide-react"
import { DatabaseStatus } from "./database-status"
import { cancelUserSubscription } from "@/lib/database"

interface SettingsModalProps {
  user: any
  onUpdateUser: (updates: any) => void
  theme: any
  t: (key: string) => string
}

export function SettingsModal({ user, onUpdateUser, theme, t }: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(user.name)
  const [language, setLanguage] = useState(user.language)
  const [workDuration, setWorkDuration] = useState(user.work_duration)
  const [shortBreak, setShortBreak] = useState(user.short_break_duration)
  const [longBreak, setLongBreak] = useState(user.long_break_duration)
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(user.sessions_until_long_break)
  const [showCancelPlan, setShowCancelPlan] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const handleSave = () => {
    onUpdateUser({
      name,
      language,
      work_duration: workDuration,
      short_break_duration: shortBreak,
      long_break_duration: longBreak,
      sessions_until_long_break: sessionsUntilLongBreak,
    })
    setIsOpen(false)
  }

  const handleCancelPlan = async () => {
    setIsCancelling(true)
    try {
      // Cancel the subscription (but keep benefits until end of billing period)
      const success = await cancelUserSubscription(user.id)

      if (success) {
        // Refresh user data to show cancelled status
        window.location.reload()
      } else {
        console.error("Failed to cancel subscription")
      }

      setShowCancelPlan(false)
      setIsOpen(false)
    } catch (error) {
      console.error("Error cancelling plan:", error)
    } finally {
      setIsCancelling(false)
    }
  }

  const applyPreset = (preset: string) => {
    switch (preset) {
      case "classic":
        setWorkDuration(25)
        setShortBreak(5)
        setLongBreak(15)
        setSessionsUntilLongBreak(4)
        break
      case "extended":
        setWorkDuration(30)
        setShortBreak(10)
        setLongBreak(20)
        setSessionsUntilLongBreak(3)
        break
      case "intensive":
        setWorkDuration(45)
        setShortBreak(15)
        setLongBreak(30)
        setSessionsUntilLongBreak(2)
        break
      case "university":
        setWorkDuration(50)
        setShortBreak(10)
        setLongBreak(25)
        setSessionsUntilLongBreak(3)
        break
    }
  }

  const getCurrentPlan = () => {
    if (user.is_pro) return "Pro"
    if (user.is_premium) return "Premium"
    return "Gratuito"
  }

  const getCurrentPlanPrice = () => {
    if (user.is_pro) return "€4.99/mes"
    if (user.is_premium) return "€1.99/mes"
    return "€0/mes"
  }

  const getSubscriptionStatus = () => {
    if (user.subscription_status === "cancelled") {
      const endsAt = user.subscription_ends_at ? new Date(user.subscription_ends_at) : null
      if (endsAt) {
        return {
          status: "Cancelado",
          message: `Tu suscripción terminará el ${endsAt.toLocaleDateString("es-ES")}`,
          color: "text-orange-400",
          bgColor: "bg-orange-500/10 border-orange-500/20",
        }
      }
    }

    if (user.is_pro || user.is_premium) {
      return {
        status: "Activo",
        message: "Tu suscripción está activa",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
      }
    }

    return {
      status: "Inactivo",
      message: "No tienes una suscripción activa",
      color: "text-gray-400",
      bgColor: "bg-gray-500/10 border-gray-500/20",
    }
  }

  const subscriptionInfo = getSubscriptionStatus()
  const isSubscriptionCancelled = user.subscription_status === "cancelled"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={theme.textSecondary}>
          <Settings className="w-4 h-4 mr-2" />
          {t("settings")}
        </Button>
      </DialogTrigger>
      <DialogContent className={`max-w-3xl ${theme.cardBg} ${theme.border}`}>
        <DialogHeader>
          <DialogTitle className={theme.textPrimary}>Configuración</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Profile Settings */}
          <Card className={`${theme.cardBg} ${theme.border}`}>
            <CardHeader>
              <CardTitle className={`${theme.textPrimary} text-lg flex items-center space-x-2`}>
                <User className="w-5 h-5" />
                <span>Perfil</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={theme.textSecondary}>
                  Nombre
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className={theme.inputBg} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className={theme.textSecondary}>
                  Idioma
                </Label>
                <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                  <SelectTrigger className={theme.inputBg}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="it">Italiano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          <Card className={`${theme.cardBg} ${theme.border}`}>
            <CardHeader>
              <CardTitle className={`${theme.textPrimary} text-lg flex items-center justify-between`}>
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span>Suscripción</span>
                </div>
                <Badge
                  variant="secondary"
                  className={`${user.is_pro ? "bg-purple-600" : user.is_premium ? "bg-yellow-600" : "bg-gray-600"} text-white`}
                >
                  {getCurrentPlan()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subscription Status Alert */}
              {isSubscriptionCancelled && (
                <div className={`p-4 rounded-lg ${subscriptionInfo.bgColor} border`}>
                  <div className="flex items-start space-x-2">
                    <Calendar className={`w-5 h-5 ${subscriptionInfo.color} mt-0.5`} />
                    <div>
                      <h4 className={`font-medium ${subscriptionInfo.color} mb-1`}>Suscripción Cancelada</h4>
                      <p className={`text-sm ${theme.textSecondary}`}>{subscriptionInfo.message}</p>
                      <p className={`text-xs ${theme.textSecondary} mt-1`}>
                        Seguirás teniendo acceso a todas las funciones hasta esa fecha.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg bg-slate-800/30 border ${theme.border}`}>
                  <h4 className={`font-medium ${theme.textPrimary} mb-1`}>Plan actual</h4>
                  <p className={`text-2xl font-bold ${theme.textPrimary}`}>{getCurrentPlan()}</p>
                  <p className={`text-sm ${theme.textSecondary}`}>{getCurrentPlanPrice()}</p>
                  <div className="mt-2">
                    <Badge variant="outline" className={`${subscriptionInfo.color} border-current`}>
                      {subscriptionInfo.status}
                    </Badge>
                  </div>
                </div>

                <div className={`p-4 rounded-lg bg-slate-800/30 border ${theme.border}`}>
                  <h4 className={`font-medium ${theme.textPrimary} mb-1`}>Características</h4>
                  <div className="space-y-1">
                    {user.is_pro && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span className={`text-xs ${theme.textSecondary}`}>Acceso completo a IA</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Crown className="w-3 h-3 text-yellow-400" />
                          <span className={`text-xs ${theme.textSecondary}`}>Funciones Premium</span>
                        </div>
                      </>
                    )}
                    {user.is_premium && !user.is_pro && (
                      <div className="flex items-center space-x-2">
                        <Crown className="w-3 h-3 text-yellow-400" />
                        <span className={`text-xs ${theme.textSecondary}`}>Funciones Premium</span>
                      </div>
                    )}
                    {!user.is_premium && !user.is_pro && (
                      <span className={`text-xs ${theme.textSecondary}`}>Funciones básicas</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Cancel Plan Button - Only show if subscription is active */}
              {(user.is_premium || user.is_pro) && !isSubscriptionCancelled && (
                <div className="pt-4 border-t border-gray-600/20">
                  {!showCancelPlan ? (
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelPlan(true)}
                      className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar suscripción
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className={`p-4 rounded-lg bg-red-500/10 border border-red-500/20`}>
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                          <div>
                            <h4 className={`font-medium text-red-400 mb-1`}>¿Estás seguro?</h4>
                            <p className={`text-sm ${theme.textSecondary} mb-3`}>
                              Al cancelar tu suscripción {getCurrentPlan()}:
                            </p>
                            <ul className={`text-xs ${theme.textSecondary} space-y-1 mb-3`}>
                              <li>• Mantendrás acceso hasta el final del período pagado</li>
                              <li>• No se te cobrará en el próximo ciclo de facturación</li>
                              {user.is_pro && <li>• Perderás acceso a IA cuando expire</li>}
                              <li>• Podrás reactivar tu suscripción en cualquier momento</li>
                            </ul>
                            <p className={`text-xs ${theme.textSecondary} font-medium`}>
                              Tu suscripción terminará el{" "}
                              {user.premium_expiry
                                ? new Date(user.premium_expiry).toLocaleDateString("es-ES")
                                : "final del período actual"}
                              .
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowCancelPlan(false)}
                          className={theme.buttonSecondary}
                          disabled={isCancelling}
                        >
                          Mantener plan
                        </Button>
                        <Button
                          onClick={handleCancelPlan}
                          disabled={isCancelling}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {isCancelling ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Cancelando...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <X className="w-4 h-4 mr-2" />
                              Confirmar cancelación
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reactivate Button - Show if subscription is cancelled but still active */}
              {isSubscriptionCancelled && (user.is_premium || user.is_pro) && (
                <div className="pt-4 border-t border-gray-600/20">
                  <Button
                    variant="outline"
                    className="text-green-400 border-green-400/30 hover:bg-green-400/10 bg-transparent"
                    onClick={() => {
                      // Here you would implement reactivation logic
                      alert("Funcionalidad de reactivación - implementar con tu sistema de pagos")
                    }}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Reactivar suscripción
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pomodoro Settings */}
          <Card className={`${theme.cardBg} ${theme.border}`}>
            <CardHeader>
              <CardTitle className={`${theme.textPrimary} text-lg flex items-center space-x-2`}>
                <Clock className="w-5 h-5" />
                <span>Configuración Pomodoro</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="work-duration" className={theme.textSecondary}>
                    Duración trabajo (min)
                  </Label>
                  <Input
                    id="work-duration"
                    type="number"
                    min="1"
                    max="120"
                    value={workDuration}
                    onChange={(e) => setWorkDuration(Number(e.target.value))}
                    className={theme.inputBg}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short-break" className={theme.textSecondary}>
                    Descanso corto (min)
                  </Label>
                  <Input
                    id="short-break"
                    type="number"
                    min="1"
                    max="30"
                    value={shortBreak}
                    onChange={(e) => setShortBreak(Number(e.target.value))}
                    className={theme.inputBg}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="long-break" className={theme.textSecondary}>
                    Descanso largo (min)
                  </Label>
                  <Input
                    id="long-break"
                    type="number"
                    min="1"
                    max="60"
                    value={longBreak}
                    onChange={(e) => setLongBreak(Number(e.target.value))}
                    className={theme.inputBg}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessions-until-long" className={theme.textSecondary}>
                    Sesiones hasta descanso largo
                  </Label>
                  <Input
                    id="sessions-until-long"
                    type="number"
                    min="1"
                    max="10"
                    value={sessionsUntilLongBreak}
                    onChange={(e) => setSessionsUntilLongBreak(Number(e.target.value))}
                    className={theme.inputBg}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={theme.textSecondary}>Configuraciones predefinidas</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset("classic")}
                    className={theme.buttonSecondary}
                  >
                    Clásico
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset("extended")}
                    className={theme.buttonSecondary}
                  >
                    Extendido
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset("intensive")}
                    className={theme.buttonSecondary}
                  >
                    Intensivo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset("university")}
                    className={theme.buttonSecondary}
                  >
                    Universidad
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Database Status */}
          <DatabaseStatus theme={theme} />
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-600/20">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className={theme.buttonPrimary}>
            <Save className="w-4 h-4 mr-2" />
            Guardar cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
