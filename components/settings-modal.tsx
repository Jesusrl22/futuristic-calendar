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
import { User, Bell, Palette, Shield, Timer, Moon, Sun, Smartphone, Trash2, Download } from "lucide-react"
import type { User as UserType } from "@/lib/hybrid-database"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserType | null
  onUserUpdate: (updates: Partial<UserType>) => void
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

interface ThemeSettings {
  theme: "light" | "dark" | "system"
  accentColor: string
  fontSize: "small" | "medium" | "large"
  compactMode: boolean
  animations: boolean
}

interface PrivacySettings {
  dataCollection: boolean
  analytics: boolean
  crashReports: boolean
  personalizedAds: boolean
  shareUsageData: boolean
}

export function SettingsModal({ isOpen, onClose, user, onUserUpdate }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    timezone: user?.timezone || "America/Mexico_City",
    language: user?.language || "es",
  })

  // Pomodoro settings
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pomodoroSettings")
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return {
      workDuration: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakInterval: 4,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      enableSounds: true,
      enableTickingSound: false,
      volume: 50,
    }
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("notificationSettings")
      if (saved) {
        return JSON.parse(saved)
      }
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

  // Theme settings
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("themeSettings")
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return {
      theme: "dark",
      accentColor: "purple",
      fontSize: "medium",
      compactMode: false,
      animations: true,
    }
  })

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("privacySettings")
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return {
      dataCollection: true,
      analytics: true,
      crashReports: true,
      personalizedAds: false,
      shareUsageData: false,
    }
  })

  // Save settings to localStorage
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
      localStorage.setItem("themeSettings", JSON.stringify(themeSettings))
    }
  }, [themeSettings])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("privacySettings", JSON.stringify(privacySettings))
    }
  }, [privacySettings])

  const handleSaveProfile = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      await onUserUpdate(profileData)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = () => {
    const data = {
      profile: profileData,
      pomodoro: pomodoroSettings,
      notifications: notificationSettings,
      theme: themeSettings,
      privacy: privacySettings,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "futuretask-settings.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteAccount = () => {
    if (confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      // In a real app, this would call an API to delete the account
      console.log("Account deletion requested")
    }
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Configuración
          </DialogTitle>
          <DialogDescription>Personaliza tu experiencia en FutureTask</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
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

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualiza tu información de perfil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select
                      value={profileData.timezone}
                      onValueChange={(value) => setProfileData({ ...profileData, timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                        <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                        <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokio (GMT+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={profileData.language}
                      onValueChange={(value) => setProfileData({ ...profileData, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pomodoro Tab */}
          <TabsContent value="pomodoro" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Pomodoro</CardTitle>
                <CardDescription>Personaliza tus sesiones de trabajo y descanso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Duración del trabajo (minutos)</Label>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descanso corto (minutos)</Label>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descanso largo (minutos)</Label>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Intervalo para descanso largo</Label>
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
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Iniciar descansos automáticamente</Label>
                      <Switch
                        checked={pomodoroSettings.autoStartBreaks}
                        onCheckedChange={(checked) =>
                          setPomodoroSettings({ ...pomodoroSettings, autoStartBreaks: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Iniciar pomodoros automáticamente</Label>
                      <Switch
                        checked={pomodoroSettings.autoStartPomodoros}
                        onCheckedChange={(checked) =>
                          setPomodoroSettings({ ...pomodoroSettings, autoStartPomodoros: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Habilitar sonidos</Label>
                      <Switch
                        checked={pomodoroSettings.enableSounds}
                        onCheckedChange={(checked) =>
                          setPomodoroSettings({ ...pomodoroSettings, enableSounds: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Sonido de tic-tac</Label>
                      <Switch
                        checked={pomodoroSettings.enableTickingSound}
                        onCheckedChange={(checked) =>
                          setPomodoroSettings({ ...pomodoroSettings, enableTickingSound: checked })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Volumen ({pomodoroSettings.volume}%)</Label>
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
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Notificaciones</CardTitle>
                <CardDescription>Controla cómo y cuándo recibes notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Recordatorios de tareas</Label>
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
                      <Label>Notificaciones de Pomodoro</Label>
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
                      <Label>Notificaciones de logros</Label>
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
                      <Label>Notificaciones por email</Label>
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
                      <Label>Sonido habilitado</Label>
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

          {/* Theme Tab */}
          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Tema</CardTitle>
                <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <Select
                      value={themeSettings.theme}
                      onValueChange={(value: "light" | "dark" | "system") =>
                        setThemeSettings({ ...themeSettings, theme: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Claro
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Oscuro
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            Sistema
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Color de acento</Label>
                    <Select
                      value={themeSettings.accentColor}
                      onValueChange={(value) => setThemeSettings({ ...themeSettings, accentColor: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="purple">Púrpura</SelectItem>
                        <SelectItem value="blue">Azul</SelectItem>
                        <SelectItem value="green">Verde</SelectItem>
                        <SelectItem value="red">Rojo</SelectItem>
                        <SelectItem value="orange">Naranja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tamaño de fuente</Label>
                    <Select
                      value={themeSettings.fontSize}
                      onValueChange={(value: "small" | "medium" | "large") =>
                        setThemeSettings({ ...themeSettings, fontSize: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Pequeña</SelectItem>
                        <SelectItem value="medium">Mediana</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Modo compacto</Label>
                    <Switch
                      checked={themeSettings.compactMode}
                      onCheckedChange={(checked) => setThemeSettings({ ...themeSettings, compactMode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Animaciones</Label>
                    <Switch
                      checked={themeSettings.animations}
                      onCheckedChange={(checked) => setThemeSettings({ ...themeSettings, animations: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Privacidad</CardTitle>
                <CardDescription>Controla cómo se usan tus datos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Recopilación de datos</Label>
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
                      <Label>Análisis de uso</Label>
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
                      <Label>Reportes de errores</Label>
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
                  <h4 className="font-semibold">Gestión de Datos</h4>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={handleExportData}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                      Exportar Datos
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount} className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Eliminar Cuenta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
