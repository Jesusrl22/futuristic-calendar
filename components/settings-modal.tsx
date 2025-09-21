"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, User, Bell, Clock, Palette, Save, Lock, Crown, Star } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

interface SettingsModalProps {
  user: any
  onUpdateUser: (updates: any) => void
  t: (key: string) => string
}

export function SettingsModal({ user, onUpdateUser, t }: SettingsModalProps) {
  const { theme, setTheme } = useTheme()

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    notifications_enabled: user?.notifications_enabled || false,
    pomodoro_work_duration: user?.pomodoro_work_duration || 25,
    pomodoro_break_duration: user?.pomodoro_break_duration || 5,
    pomodoro_long_break_duration: user?.pomodoro_long_break_duration || 15,
    theme_preference: user?.theme_preference || "system",
  })

  const [isLoading, setIsLoading] = useState(false)

  // Theme options based on user plan
  const getAvailableThemes = () => {
    const userPlan = user?.subscription_plan || "free"

    const freeThemes = [
      { value: "light", label: "Claro", description: "Tema claro clásico" },
      { value: "dark", label: "Oscuro", description: "Tema oscuro clásico" },
      { value: "system", label: "Sistema", description: "Sigue la configuración del sistema" },
    ]

    const premiumThemes = [
      { value: "blue", label: "Azul Océano", description: "Tonos azules relajantes", premium: true },
      { value: "green", label: "Verde Bosque", description: "Tonos verdes naturales", premium: true },
      { value: "purple", label: "Púrpura Místico", description: "Tonos púrpura elegantes", premium: true },
      { value: "orange", label: "Naranja Atardecer", description: "Tonos cálidos de atardecer", premium: true },
    ]

    const proThemes = [
      { value: "neon", label: "Neón Futurista", description: "Colores neón vibrantes", pro: true },
      { value: "cyberpunk", label: "Cyberpunk", description: "Estética futurista oscura", pro: true },
      { value: "galaxy", label: "Galaxia", description: "Colores del espacio profundo", pro: true },
      { value: "aurora", label: "Aurora Boreal", description: "Colores de aurora mágica", pro: true },
    ]

    let availableThemes = [...freeThemes]

    if (userPlan.includes("premium") || userPlan.includes("pro")) {
      availableThemes = [...availableThemes, ...premiumThemes]
    }

    if (userPlan.includes("pro")) {
      availableThemes = [...availableThemes, ...proThemes]
    }

    return availableThemes
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    handleInputChange("theme_preference", newTheme)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user data
      onUpdateUser(formData)

      // Save to localStorage for persistence
      const updatedUser = { ...user, ...formData }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Error updating user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    // Reset form data to original values
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      notifications_enabled: user?.notifications_enabled || false,
      pomodoro_work_duration: user?.pomodoro_work_duration || 25,
      pomodoro_break_duration: user?.pomodoro_break_duration || 5,
      pomodoro_long_break_duration: user?.pomodoro_long_break_duration || 15,
      theme_preference: user?.theme_preference || "system",
    })
    onUpdateUser({ showSettings: false })
  }

  const availableThemes = getAvailableThemes()
  const userPlan = user?.subscription_plan || "free"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-5 w-5" />
            Configuración
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profile Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-blue-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Perfil</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                />
              </div>
            </div>

            {/* Subscription Badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Plan actual:</span>
              <Badge
                variant={userPlan === "pro" ? "default" : userPlan === "premium" ? "secondary" : "outline"}
                className={
                  userPlan === "pro"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : userPlan === "premium"
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                      : "text-slate-600 dark:text-slate-400"
                }
              >
                {userPlan === "pro" && <Crown className="h-3 w-3 mr-1" />}
                {userPlan === "premium" && <Star className="h-3 w-3 mr-1" />}
                {userPlan.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-4 w-4 text-green-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Notificaciones</h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-700 dark:text-slate-300">Notificaciones habilitadas</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Recibir notificaciones de tareas y recordatorios
                </p>
              </div>
              <Switch
                checked={formData.notifications_enabled}
                onCheckedChange={(checked) => handleInputChange("notifications_enabled", checked)}
              />
            </div>
          </div>

          {/* Pomodoro Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-red-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Configuración Pomodoro</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="work-duration" className="text-slate-700 dark:text-slate-300">
                  Trabajo (minutos)
                </Label>
                <Input
                  id="work-duration"
                  type="number"
                  min="1"
                  max="60"
                  value={formData.pomodoro_work_duration}
                  onChange={(e) => handleInputChange("pomodoro_work_duration", Number.parseInt(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                />
              </div>

              <div>
                <Label htmlFor="break-duration" className="text-slate-700 dark:text-slate-300">
                  Descanso corto (minutos)
                </Label>
                <Input
                  id="break-duration"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.pomodoro_break_duration}
                  onChange={(e) => handleInputChange("pomodoro_break_duration", Number.parseInt(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                />
              </div>

              <div>
                <Label htmlFor="long-break-duration" className="text-slate-700 dark:text-slate-300">
                  Descanso largo (minutos)
                </Label>
                <Input
                  id="long-break-duration"
                  type="number"
                  min="1"
                  max="60"
                  value={formData.pomodoro_long_break_duration}
                  onChange={(e) => handleInputChange("pomodoro_long_break_duration", Number.parseInt(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="h-4 w-4 text-purple-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Apariencia</h3>
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300 mb-2 block">Tema</Label>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableThemes.map((themeOption) => (
                    <SelectItem key={themeOption.value} value={themeOption.value}>
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="flex items-center gap-2">
                            <span>{themeOption.label}</span>
                            {themeOption.premium && (
                              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                                <Star className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                            {themeOption.pro && (
                              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                                <Crown className="h-3 w-3 mr-1" />
                                Pro
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{themeOption.description}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Theme Preview */}
              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Vista previa del tema:</p>
                <div className="flex gap-2">
                  <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-600"></div>
                  <div className="w-4 h-4 rounded bg-slate-300 dark:bg-slate-500"></div>
                  <div className="w-4 h-4 rounded bg-slate-400 dark:bg-slate-400"></div>
                </div>
              </div>

              {/* Upgrade Notice */}
              {!userPlan.includes("premium") && !userPlan.includes("pro") && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm font-medium">Temas Premium Bloqueados</span>
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Actualiza a Premium o Pro para acceder a más temas personalizados
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-600">
            <Button onClick={handleSave} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
