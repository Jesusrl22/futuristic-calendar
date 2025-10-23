"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Palette, Lock, Clock, Download, Save, Sparkles, Crown, Check, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/hooks/useLanguage"
import { isPremiumOrPro, isPro, canAccessTheme } from "@/lib/subscription"
import type { SubscriptionPlan } from "@/lib/subscription"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onUserUpdate?: (updates: any) => void
}

const THEMES = [
  { id: "light", name: "Light", preview: "from-white to-gray-100", tier: "free" },
  { id: "dark", name: "Dark", preview: "from-gray-900 to-gray-800", tier: "free" },
  { id: "ocean", name: "Ocean", preview: "from-blue-900 to-cyan-800", tier: "premium" },
  { id: "forest", name: "Forest", preview: "from-green-900 to-emerald-800", tier: "premium" },
  { id: "sunset", name: "Sunset", preview: "from-orange-800 to-red-900", tier: "premium" },
  { id: "midnight", name: "Midnight", preview: "from-indigo-950 to-purple-900", tier: "premium" },
  { id: "royal-purple", name: "Royal Purple", preview: "from-purple-900 to-fuchsia-800", tier: "pro" },
  { id: "cyber-pink", name: "Cyber Pink", preview: "from-pink-900 to-rose-800", tier: "pro" },
  { id: "neon-green", name: "Neon Green", preview: "from-green-800 to-lime-700", tier: "pro" },
  { id: "crimson", name: "Crimson", preview: "from-red-900 to-rose-800", tier: "pro" },
  { id: "golden-hour", name: "Golden Hour", preview: "from-yellow-800 to-orange-700", tier: "pro" },
  { id: "arctic-blue", name: "Arctic Blue", preview: "from-sky-800 to-cyan-700", tier: "pro" },
  { id: "amoled", name: "AMOLED", preview: "from-black to-gray-950", tier: "pro" },
  { id: "matrix", name: "Matrix", preview: "from-green-950 to-emerald-900", tier: "pro" },
]

const LANGUAGES = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
]

export function SettingsModal({ isOpen, onClose, user, onUserUpdate }: SettingsModalProps) {
  const { toast } = useToast()
  const { language, setLanguage } = useLanguage()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [currentTheme, setCurrentTheme] = useState("dark")
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium")
  const [compactMode, setCompactMode] = useState(false)

  const userPlan: SubscriptionPlan = (user?.subscription_tier || user?.plan || "free") as SubscriptionPlan

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true,
    autoStartPomodoros: false,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    pomodoroComplete: true,
    taskReminders: true,
    dailySummary: false,
    weeklyReport: false,
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      })
    }

    const savedTheme = localStorage.getItem("theme") || "dark"
    const savedFontSize = (localStorage.getItem("fontSize") as "small" | "medium" | "large") || "medium"
    const savedCompactMode = localStorage.getItem("compactMode") === "true"

    setCurrentTheme(savedTheme)
    setFontSize(savedFontSize)
    setCompactMode(savedCompactMode)

    applyTheme(savedTheme)
    applyFontSize(savedFontSize)
    if (savedCompactMode) {
      document.documentElement.setAttribute("data-compact", "true")
    }
  }, [user])

  const applyTheme = (themeId: string) => {
    const html = document.documentElement
    html.setAttribute("data-theme", themeId)

    if (themeId === "light") {
      html.classList.remove("dark")
    } else {
      html.classList.add("dark")
    }

    console.log("✅ Theme applied:", themeId)
  }

  const applyFontSize = (size: "small" | "medium" | "large") => {
    document.documentElement.setAttribute("data-font-size", size)
  }

  const handleThemeChange = (themeId: string) => {
    const theme = THEMES.find((t) => t.id === themeId)
    if (!theme) return

    const canAccess = canAccessTheme(userPlan, themeId)

    if (!canAccess) {
      if (theme.tier === "premium") {
        toast({
          title: "🔒 Tema Premium",
          description: "Este tema requiere una suscripción Premium o Pro",
          variant: "destructive",
        })
      } else if (theme.tier === "pro") {
        toast({
          title: "🔒 Tema Pro",
          description: "Este tema requiere una suscripción Pro",
          variant: "destructive",
        })
      }
      return
    }

    setCurrentTheme(themeId)
    localStorage.setItem("theme", themeId)
    applyTheme(themeId)

    toast({
      title: "✅ Tema actualizado",
      description: `Tema ${theme.name} aplicado correctamente`,
    })
  }

  const handleLanguageChange = (langCode: string) => {
    console.log("🌍 Changing language to:", langCode)
    setLanguage(langCode as any)

    const lang = LANGUAGES.find((l) => l.code === langCode)
    toast({
      title: "✅ Idioma actualizado",
      description: `Idioma cambiado a ${lang?.name}`,
    })
  }

  const handleFontSizeChange = (size: "small" | "medium" | "large") => {
    setFontSize(size)
    localStorage.setItem("fontSize", size)
    applyFontSize(size)

    toast({
      title: "✅ Tamaño de fuente actualizado",
      description: `Tamaño cambiado a ${size}`,
    })
  }

  const handleCompactModeChange = (checked: boolean) => {
    setCompactMode(checked)
    localStorage.setItem("compactMode", checked.toString())

    if (checked) {
      document.documentElement.setAttribute("data-compact", "true")
    } else {
      document.documentElement.removeAttribute("data-compact")
    }

    toast({
      title: "✅ Modo compacto actualizado",
      description: checked ? "Modo compacto activado" : "Modo compacto desactivado",
    })
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: profileData.name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      if (onUserUpdate) {
        onUserUpdate(profileData)
      }

      toast({
        title: "✅ Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "❌ Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = () => {
    const data = {
      profile: profileData,
      pomodoro: pomodoroSettings,
      notifications: notificationSettings,
      theme: currentTheme,
      fontSize: fontSize,
      compactMode: compactMode,
      language: language,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `futuretask-settings-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "📥 Datos exportados",
      description: "Tus configuraciones han sido exportadas",
    })
  }

  if (!user) return null

  console.log("🎯 Settings Modal - User Plan:", userPlan)
  console.log("🎯 Can access premium themes:", isPremiumOrPro(userPlan))
  console.log("🎯 Can access pro themes:", isPro(userPlan))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            Configuración
            {isPro(userPlan) && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <Crown className="h-3 w-3 mr-1" />
                PRO
              </Badge>
            )}
            {isPremiumOrPro(userPlan) && !isPro(userPlan) && (
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>Gestiona tu cuenta y preferencias</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-5 glass-effect">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="pomodoro" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Pomodoro</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notif.</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Tema</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Privac.</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 animate-fade-in mt-4">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Información del Perfil
                </CardTitle>
                <CardDescription>Actualiza tu información personal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Tu nombre"
                    className="glass-effect"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={profileData.email} className="glass-effect" disabled />
                  <p className="text-xs text-muted-foreground">
                    El email no se puede cambiar. Contacta a soporte si necesitas actualizarlo.
                  </p>
                </div>
                <Button onClick={handleSaveProfile} disabled={isLoading} className="btn-gradient">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pomodoro" className="space-y-4 animate-fade-in mt-4">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  Configuración de Pomodoro
                </CardTitle>
                <CardDescription>Personaliza tus duraciones de Pomodoro</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="work-duration">Trabajo (min)</Label>
                    <Input
                      id="work-duration"
                      type="number"
                      min="1"
                      max="60"
                      value={pomodoroSettings.workDuration}
                      onChange={(e) =>
                        setPomodoroSettings({ ...pomodoroSettings, workDuration: Number.parseInt(e.target.value) })
                      }
                      className="glass-effect"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="short-break">Descanso Corto (min)</Label>
                    <Input
                      id="short-break"
                      type="number"
                      min="1"
                      max="30"
                      value={pomodoroSettings.shortBreak}
                      onChange={(e) =>
                        setPomodoroSettings({ ...pomodoroSettings, shortBreak: Number.parseInt(e.target.value) })
                      }
                      className="glass-effect"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="long-break">Descanso Largo (min)</Label>
                    <Input
                      id="long-break"
                      type="number"
                      min="1"
                      max="60"
                      value={pomodoroSettings.longBreak}
                      onChange={(e) =>
                        setPomodoroSettings({ ...pomodoroSettings, longBreak: Number.parseInt(e.target.value) })
                      }
                      className="glass-effect"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between glass-effect p-4 rounded-lg">
                    <div>
                      <Label htmlFor="auto-start-breaks">Auto-iniciar Descansos</Label>
                      <p className="text-sm text-muted-foreground">Iniciar descansos automáticamente</p>
                    </div>
                    <Switch
                      id="auto-start-breaks"
                      checked={pomodoroSettings.autoStartBreaks}
                      onCheckedChange={(checked) =>
                        setPomodoroSettings({ ...pomodoroSettings, autoStartBreaks: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between glass-effect p-4 rounded-lg">
                    <div>
                      <Label htmlFor="auto-start-pomodoros">Auto-iniciar Pomodoros</Label>
                      <p className="text-sm text-muted-foreground">Iniciar trabajo automáticamente</p>
                    </div>
                    <Switch
                      id="auto-start-pomodoros"
                      checked={pomodoroSettings.autoStartPomodoros}
                      onCheckedChange={(checked) =>
                        setPomodoroSettings({ ...pomodoroSettings, autoStartPomodoros: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 animate-fade-in mt-4">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-yellow-500" />
                  Preferencias de Notificaciones
                </CardTitle>
                <CardDescription>Elige qué notificaciones recibir</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between glass-effect p-4 rounded-lg">
                  <div>
                    <Label htmlFor="pomodoro-complete">Pomodoro Completado</Label>
                    <p className="text-sm text-muted-foreground">Notificar al terminar una sesión</p>
                  </div>
                  <Switch
                    id="pomodoro-complete"
                    checked={notificationSettings.pomodoroComplete}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, pomodoroComplete: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between glass-effect p-4 rounded-lg">
                  <div>
                    <Label htmlFor="task-reminders">Recordatorios de Tareas</Label>
                    <p className="text-sm text-muted-foreground">Recordatorios de tareas próximas</p>
                  </div>
                  <Switch
                    id="task-reminders"
                    checked={notificationSettings.taskReminders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, taskReminders: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between glass-effect p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div>
                      <Label htmlFor="daily-summary">Resumen Diario</Label>
                      <p className="text-sm text-muted-foreground">Resumen de productividad diario</p>
                    </div>
                    {isPremiumOrPro(userPlan) && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <Switch
                    id="daily-summary"
                    checked={notificationSettings.dailySummary}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, dailySummary: checked })
                    }
                    disabled={!isPremiumOrPro(userPlan)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between glass-effect p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div>
                      <Label htmlFor="weekly-report">Reporte Semanal</Label>
                      <p className="text-sm text-muted-foreground">Reportes semanales completos</p>
                    </div>
                    {isPro(userPlan) && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs">
                        <Crown className="h-3 w-3 mr-1" />
                        PRO
                      </Badge>
                    )}
                  </div>
                  <Switch
                    id="weekly-report"
                    checked={notificationSettings.weeklyReport}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, weeklyReport: checked })
                    }
                    disabled={!isPro(userPlan)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme" className="space-y-4 animate-fade-in mt-4">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-pink-500" />
                  Apariencia
                </CardTitle>
                <CardDescription>Personaliza tu experiencia visual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Idioma
                  </Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="glass-effect">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Elige un Tema
                    {isPro(userPlan) && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        (Tienes acceso a todos los temas 🎉)
                      </span>
                    )}
                    {isPremiumOrPro(userPlan) && !isPro(userPlan) && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        (Tienes acceso a temas Premium ⭐)
                      </span>
                    )}
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {THEMES.map((theme) => {
                      const canAccess = canAccessTheme(userPlan, theme.id)
                      const isLocked = !canAccess

                      return (
                        <button
                          key={theme.id}
                          onClick={() => !isLocked && handleThemeChange(theme.id)}
                          disabled={isLocked}
                          className={`relative p-4 rounded-xl transition-all hover:scale-105 ${
                            currentTheme === theme.id
                              ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg scale-105"
                              : "hover:shadow-md"
                          } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <div className={`w-full h-20 rounded-lg bg-gradient-to-br ${theme.preview} mb-2`} />
                          <p className="text-sm font-medium text-center">{theme.name}</p>
                          {theme.tier !== "free" && (
                            <div className="absolute top-2 left-2">
                              {theme.tier === "premium" ? (
                                <Badge variant="secondary" className="text-xs">
                                  <Sparkles className="h-3 w-3" />
                                </Badge>
                              ) : (
                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs">
                                  <Crown className="h-3 w-3" />
                                </Badge>
                              )}
                            </div>
                          )}
                          {currentTheme === theme.id && (
                            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label htmlFor="font-size" className="text-base font-semibold">
                    Tamaño de Fuente
                  </Label>
                  <Select value={fontSize} onValueChange={handleFontSizeChange}>
                    <SelectTrigger id="font-size" className="glass-effect">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeño</SelectItem>
                      <SelectItem value="medium">Mediano</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between glass-effect p-4 rounded-lg">
                  <div>
                    <Label htmlFor="compact-mode" className="font-semibold">
                      Modo Compacto
                    </Label>
                    <p className="text-sm text-muted-foreground">Reducir espacios para más contenido</p>
                  </div>
                  <Switch id="compact-mode" checked={compactMode} onCheckedChange={handleCompactModeChange} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 animate-fade-in mt-4">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-green-500" />
                  Datos y Privacidad
                </CardTitle>
                <CardDescription>Gestiona tus datos y privacidad</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="glass-effect p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Download className="h-5 w-5 text-blue-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Exportar Mis Datos</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Descarga una copia de todas tus configuraciones
                      </p>
                      <Button onClick={handleExportData} variant="outline" className="bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar Datos
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="glass-effect p-4 rounded-lg border border-red-500/20">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-red-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1 text-red-500">Eliminar Cuenta</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Eliminar permanentemente tu cuenta y todos los datos. Esta acción no se puede deshacer.
                      </p>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                        Eliminar Cuenta
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
