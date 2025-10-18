"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Palette, Shield, Timer, Download, Trash2, Lock, Crown, Sparkles, Check } from "lucide-react"
import type { User as UserType } from "@/lib/hybrid-database"
import { useTheme, type ThemeName } from "@/hooks/useTheme"
import { useToast } from "@/hooks/use-toast"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserType | null
  onUserUpdate?: (updates: Partial<UserType>) => void
}

interface PomodoroSettings {
  workDuration: number
  shortBreak: number
  longBreak: number
  longBreakInterval: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  enableSounds: boolean
  enableTickingSound: boolean
  volume: number
}

interface NotificationSettings {
  taskReminders: boolean
  pomodoroNotifications: boolean
  achievementNotifications: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
}

interface PrivacySettings {
  dataCollection: boolean
  analytics: boolean
  crashReports: boolean
  personalizedAds: boolean
  shareUsageData: boolean
}

interface Theme {
  value: ThemeName
  label: string
  preview: string
  description: string
}

const themes = {
  free: [
    {
      value: "default-light" as ThemeName,
      label: "Claro Clásico",
      preview: "bg-white border-2 border-gray-200",
      description: "Tema claro por defecto",
    },
    {
      value: "default-dark" as ThemeName,
      label: "Oscuro Clásico",
      preview: "bg-gray-900 border-2 border-gray-700",
      description: "Tema oscuro por defecto",
    },
  ],
  premium: [
    {
      value: "default-light" as ThemeName,
      label: "Claro Clásico",
      preview: "bg-white border-2 border-gray-200",
      description: "Tema claro por defecto",
    },
    {
      value: "default-dark" as ThemeName,
      label: "Oscuro Clásico",
      preview: "bg-gray-900 border-2 border-gray-700",
      description: "Tema oscuro por defecto",
    },
    {
      value: "ocean" as ThemeName,
      label: "Océano",
      preview: "bg-gradient-to-br from-blue-100 to-blue-300",
      description: "Azul claro y refrescante",
    },
    {
      value: "forest" as ThemeName,
      label: "Bosque",
      preview: "bg-gradient-to-br from-green-100 to-green-300",
      description: "Verde natural y relajante",
    },
    {
      value: "sunset" as ThemeName,
      label: "Atardecer",
      preview: "bg-gradient-to-br from-orange-100 to-orange-300",
      description: "Naranja cálido y acogedor",
    },
    {
      value: "midnight" as ThemeName,
      label: "Medianoche",
      preview: "bg-gradient-to-br from-blue-900 to-blue-950",
      description: "Azul oscuro profundo",
    },
  ],
  pro: [
    {
      value: "default-light" as ThemeName,
      label: "Claro Clásico",
      preview: "bg-white border-2 border-gray-200",
      description: "Tema claro por defecto",
    },
    {
      value: "default-dark" as ThemeName,
      label: "Oscuro Clásico",
      preview: "bg-gray-900 border-2 border-gray-700",
      description: "Tema oscuro por defecto",
    },
    {
      value: "ocean" as ThemeName,
      label: "Océano",
      preview: "bg-gradient-to-br from-blue-100 to-blue-300",
      description: "Azul claro y refrescante",
    },
    {
      value: "forest" as ThemeName,
      label: "Bosque",
      preview: "bg-gradient-to-br from-green-100 to-green-300",
      description: "Verde natural y relajante",
    },
    {
      value: "sunset" as ThemeName,
      label: "Atardecer",
      preview: "bg-gradient-to-br from-orange-100 to-orange-300",
      description: "Naranja cálido y acogedor",
    },
    {
      value: "midnight" as ThemeName,
      label: "Medianoche",
      preview: "bg-gradient-to-br from-blue-900 to-blue-950",
      description: "Azul oscuro profundo",
    },
    {
      value: "royal-purple" as ThemeName,
      label: "Púrpura Real",
      preview: "bg-gradient-to-br from-purple-100 to-purple-300",
      description: "Púrpura elegante y vibrante",
    },
    {
      value: "cyber-pink" as ThemeName,
      label: "Rosa Cyber",
      preview: "bg-gradient-to-br from-pink-100 to-pink-300",
      description: "Rosa futurista y energético",
    },
    {
      value: "neon-green" as ThemeName,
      label: "Verde Neón",
      preview: "bg-gradient-to-br from-green-200 to-green-400",
      description: "Verde brillante y moderno",
    },
    {
      value: "crimson" as ThemeName,
      label: "Carmesí",
      preview: "bg-gradient-to-br from-red-100 to-red-300",
      description: "Rojo intenso y poderoso",
    },
    {
      value: "golden-hour" as ThemeName,
      label: "Hora Dorada",
      preview: "bg-gradient-to-br from-yellow-100 to-yellow-300",
      description: "Dorado luminoso y cálido",
    },
    {
      value: "arctic-blue" as ThemeName,
      label: "Azul Ártico",
      preview: "bg-gradient-to-br from-cyan-100 to-cyan-300",
      description: "Cian fresco y cristalino",
    },
    {
      value: "dark-amoled" as ThemeName,
      label: "AMOLED Negro",
      preview: "bg-black",
      description: "Negro puro para pantallas OLED",
    },
    {
      value: "matrix" as ThemeName,
      label: "Matrix",
      preview: "bg-gradient-to-br from-green-900 to-black",
      description: "Verde Matrix con fondo oscuro",
    },
  ],
}

export function SettingsModal({ isOpen, onClose, user, onUserUpdate }: SettingsModalProps) {
  const { config, updateTheme, mounted } = useTheme()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)

  const userPlan = (user?.subscription_tier || user?.plan || "free") as "free" | "premium" | "pro"

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    timezone: user?.timezone || "America/Mexico_City",
    language: user?.language || "es",
  })

  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pomodoroSettings")
      if (saved) return JSON.parse(saved)
    }
    return {
      workDuration: user?.pomodoro_work_duration || 25,
      shortBreak: user?.pomodoro_break_duration || 5,
      longBreak: user?.pomodoro_long_break_duration || 15,
      longBreakInterval: user?.pomodoro_sessions_until_long_break || 4,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      enableSounds: true,
      enableTickingSound: false,
      volume: 50,
    }
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("notificationSettings")
      if (saved) return JSON.parse(saved)
    }
    return {
      taskReminders: true,
      pomodoroNotifications: true,
      achievementNotifications: true,
      emailNotifications: false,
      pushNotifications: true,
      soundEnabled: true,
      vibrationEnabled: true,
    }
  })

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("privacySettings")
      if (saved) return JSON.parse(saved)
    }
    return {
      dataCollection: true,
      analytics: true,
      crashReports: true,
      personalizedAds: false,
      shareUsageData: false,
    }
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pomodoroSettings", JSON.stringify(pomodoroSettings))
    }
  }, [pomodoroSettings])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("notificationSettings", JSON.stringify(notificationSettings))
    }
  }, [notificationSettings])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("privacySettings", JSON.stringify(privacySettings))
    }
  }, [privacySettings])

  const handleSaveProfile = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      if (onUserUpdate) {
        await onUserUpdate(profileData)
      }
      toast({
        title: "Perfil actualizado",
        description: "Tus cambios han sido guardados correctamente",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleThemeChange = (themeName: ThemeName) => {
    updateTheme({ theme: themeName })
    toast({
      title: "Tema actualizado",
      description: `Tema ${themes[userPlan].find((t) => t.value === themeName)?.label} aplicado correctamente`,
    })
  }

  const handleExportData = () => {
    const data = {
      profile: profileData,
      pomodoro: pomodoroSettings,
      notifications: notificationSettings,
      theme: config,
      privacy: privacySettings,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `futuretask-settings-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Datos exportados",
      description: "Tu configuración ha sido descargada",
    })
  }

  const handleDeleteAccount = () => {
    if (confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      toast({
        title: "Solicitud recibida",
        description: "Tu cuenta será eliminada en 30 días",
        variant: "destructive",
      })
    }
  }

  const getAvailableThemes = () => {
    return themes[userPlan] || themes.free
  }

  const canUseFeature = (feature: string) => {
    const features: Record<string, string[]> = {
      fontSize: ["premium", "pro"],
      compactMode: ["premium", "pro"],
      premiumThemes: ["premium", "pro"],
      proThemes: ["pro"],
    }
    return features[feature]?.includes(userPlan) ?? false
  }

  if (!user || !mounted) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <User className="h-5 w-5" />
            Configuración
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Personaliza tu experiencia en FutureTask
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-muted">
            <TabsTrigger value="profile" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="pomodoro" className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              <span className="hidden sm:inline">Pomodoro</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificaciones</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-1">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Tema</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacidad</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Información Personal</CardTitle>
                <CardDescription>Actualiza tu información de perfil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Nombre
                    </Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="bg-background border-input text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="bg-background border-input text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-foreground">
                      Zona Horaria
                    </Label>
                    <Select
                      value={profileData.timezone}
                      onValueChange={(value) => setProfileData({ ...profileData, timezone: value })}
                    >
                      <SelectTrigger className="bg-background border-input text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                        <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                        <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokio (GMT+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-foreground">
                      Idioma
                    </Label>
                    <Select
                      value={profileData.language}
                      onValueChange={(value) => setProfileData({ ...profileData, language: value })}
                    >
                      <SelectTrigger className="bg-background border-input text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-primary text-primary-foreground">
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pomodoro" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Configuración del Pomodoro</CardTitle>
                <CardDescription>Personaliza tus sesiones de trabajo y descanso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Duración del trabajo (minutos)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="60"
                        value={pomodoroSettings.workDuration}
                        onChange={(e) =>
                          setPomodoroSettings({
                            ...pomodoroSettings,
                            workDuration: Number.parseInt(e.target.value) || 25,
                          })
                        }
                        className="bg-background border-input text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Descanso corto (minutos)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        value={pomodoroSettings.shortBreak}
                        onChange={(e) =>
                          setPomodoroSettings({
                            ...pomodoroSettings,
                            shortBreak: Number.parseInt(e.target.value) || 5,
                          })
                        }
                        className="bg-background border-input text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Descanso largo (minutos)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="60"
                        value={pomodoroSettings.longBreak}
                        onChange={(e) =>
                          setPomodoroSettings({
                            ...pomodoroSettings,
                            longBreak: Number.parseInt(e.target.value) || 15,
                          })
                        }
                        className="bg-background border-input text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Intervalo para descanso largo</Label>
                      <Input
                        type="number"
                        min="2"
                        max="10"
                        value={pomodoroSettings.longBreakInterval}
                        onChange={(e) =>
                          setPomodoroSettings({
                            ...pomodoroSettings,
                            longBreakInterval: Number.parseInt(e.target.value) || 4,
                          })
                        }
                        className="bg-background border-input text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">Iniciar descansos automáticamente</Label>
                      <Switch
                        checked={pomodoroSettings.autoStartBreaks}
                        onCheckedChange={(checked) =>
                          setPomodoroSettings({ ...pomodoroSettings, autoStartBreaks: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">Iniciar pomodoros automáticamente</Label>
                      <Switch
                        checked={pomodoroSettings.autoStartPomodoros}
                        onCheckedChange={(checked) =>
                          setPomodoroSettings({ ...pomodoroSettings, autoStartPomodoros: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">Habilitar sonidos</Label>
                      <Switch
                        checked={pomodoroSettings.enableSounds}
                        onCheckedChange={(checked) =>
                          setPomodoroSettings({ ...pomodoroSettings, enableSounds: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">Sonido de tic-tac</Label>
                      <Switch
                        checked={pomodoroSettings.enableTickingSound}
                        onCheckedChange={(checked) =>
                          setPomodoroSettings({ ...pomodoroSettings, enableTickingSound: checked })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Volumen ({pomodoroSettings.volume}%)</Label>
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={pomodoroSettings.volume}
                        onChange={(e) =>
                          setPomodoroSettings({
                            ...pomodoroSettings,
                            volume: Number.parseInt(e.target.value),
                          })
                        }
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Configuración de Notificaciones</CardTitle>
                <CardDescription>Controla cómo y cuándo recibes notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-foreground">Recordatorios de tareas</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones sobre tareas próximas a vencer
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.taskReminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, taskReminders: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-foreground">Notificaciones de Pomodoro</Label>
                      <p className="text-sm text-muted-foreground">
                        Alertas cuando terminen las sesiones de trabajo y descanso
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.pomodoroNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, pomodoroNotifications: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-foreground">Notificaciones de logros</Label>
                      <p className="text-sm text-muted-foreground">Celebra cuando desbloquees nuevos logros</p>
                    </div>
                    <Switch
                      checked={notificationSettings.achievementNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, achievementNotifications: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-foreground">Notificaciones por email</Label>
                      <p className="text-sm text-muted-foreground">Recibe resúmenes y actualizaciones por correo</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-foreground">Sonido habilitado</Label>
                      <p className="text-sm text-muted-foreground">Reproducir sonidos con las notificaciones</p>
                    </div>
                    <Switch
                      checked={notificationSettings.soundEnabled}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, soundEnabled: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  Configuración de Tema
                  {userPlan === "pro" && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      PRO
                    </Badge>
                  )}
                  {userPlan === "premium" && (
                    <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Personaliza la apariencia de la aplicación - {getAvailableThemes().length} temas disponibles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-foreground text-lg font-semibold">Selecciona un tema</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getAvailableThemes().map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => handleThemeChange(theme.value)}
                        className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                          config.theme === theme.value
                            ? "border-primary ring-2 ring-primary ring-offset-2"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className={`w-full h-20 rounded ${theme.preview} mb-3`} />
                        <p className="text-sm font-medium text-foreground mb-1">{theme.label}</p>
                        <p className="text-xs text-muted-foreground">{theme.description}</p>
                        {config.theme === theme.value && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {userPlan === "free" && (
                    <div className="bg-muted p-4 rounded-lg border border-border">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">
                            Desbloquea más temas con Premium o Pro
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Obtén acceso a {themes.premium.length - 2} temas adicionales con Premium, o{" "}
                            {themes.pro.length - 2} temas únicos con Pro
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">Tamaño de fuente</Label>
                      {!canUseFeature("fontSize") && (
                        <Badge variant="outline" className="border-border text-muted-foreground">
                          <Lock className="w-3 h-3 mr-1" />
                          Premium/Pro
                        </Badge>
                      )}
                    </div>
                    <Select
                      value={config.fontSize}
                      onValueChange={(value: "small" | "medium" | "large") => updateTheme({ fontSize: value })}
                      disabled={!canUseFeature("fontSize")}
                    >
                      <SelectTrigger className="bg-background border-input text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="small">Pequeña</SelectItem>
                        <SelectItem value="medium">Mediana</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-foreground flex items-center gap-2">
                        Modo compacto
                        {!canUseFeature("compactMode") && (
                          <Badge variant="outline" className="border-border text-muted-foreground">
                            <Lock className="w-3 h-3 mr-1" />
                            Premium/Pro
                          </Badge>
                        )}
                      </Label>
                      <p className="text-sm text-muted-foreground">Reduce el espaciado para ver más contenido</p>
                    </div>
                    <Switch
                      checked={config.compactMode}
                      onCheckedChange={(checked) => updateTheme({ compactMode: checked })}
                      disabled={!canUseFeature("compactMode")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Configuración de Privacidad</CardTitle>
                <CardDescription>Controla cómo se usan tus datos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-foreground">Recopilación de datos</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir la recopilación de datos para mejorar la experiencia
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.dataCollection}
                      onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, dataCollection: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-foreground">Análisis de uso</Label>
                      <p className="text-sm text-muted-foreground">Ayúdanos a entender cómo usas la aplicación</p>
                    </div>
                    <Switch
                      checked={privacySettings.analytics}
                      onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, analytics: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-foreground">Reportes de errores</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar reportes automáticos de errores para mejorar la estabilidad
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.crashReports}
                      onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, crashReports: checked })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Gestión de Datos</h4>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={handleExportData}
                      className="flex items-center gap-2 border-border text-foreground bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                      Exportar Datos
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2 bg-destructive text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar Cuenta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="border-border text-foreground bg-transparent">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
