"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { useTheme, type ThemeName } from "@/hooks/useTheme"
import { useLanguage } from "@/hooks/useLanguage"
import { hybridDb } from "@/lib/hybrid-database"
import { Settings, UserIcon, Bell, Palette, Clock, Type, Crown } from "lucide-react"
import type { User } from "@/lib/hybrid-database"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onUserUpdate?: () => void
}

const THEMES = [
  { value: "light", label: "Claro", icon: "☀️", tier: "free" },
  { value: "dark", label: "Oscuro", icon: "🌙", tier: "free" },
  { value: "ocean", label: "Océano", icon: "🌊", tier: "premium" },
  { value: "forest", label: "Bosque", icon: "🌲", tier: "premium" },
  { value: "sunset", label: "Atardecer", icon: "🌅", tier: "premium" },
  { value: "midnight", label: "Medianoche", icon: "🌌", tier: "premium" },
  { value: "royal-purple", label: "Púrpura Real", icon: "👑", tier: "premium" },
  { value: "cyber-pink", label: "Rosa Cibernético", icon: "💖", tier: "premium" },
  { value: "neon-green", label: "Verde Neón", icon: "⚡", tier: "premium" },
  { value: "crimson", label: "Carmesí", icon: "❤️", tier: "premium" },
  { value: "golden-hour", label: "Hora Dorada", icon: "✨", tier: "pro" },
  { value: "arctic-blue", label: "Azul Ártico", icon: "🧊", tier: "pro" },
  { value: "amoled", label: "AMOLED", icon: "⚫", tier: "pro" },
  { value: "matrix", label: "Matrix", icon: "🟢", tier: "pro" },
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
  const { theme: currentTheme, setTheme, updateFontSize, toggleCompactMode } = useTheme()
  const { language, setLanguage } = useLanguage()

  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(currentTheme)
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    language: user.language || language || "es",
  })

  const [pomodoroSettings, setPomodoroSettings] = useState({
    workTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    sessionsUntilLongBreak: 4,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    enableNotifications: true,
    notificationSound: true,
  })

  const [uiSettings, setUiSettings] = useState({
    compactMode: false,
    fontSize: "medium" as "small" | "medium" | "large",
  })

  const [isSaving, setIsSaving] = useState(false)

  // Sincronizar tema actual
  useEffect(() => {
    setSelectedTheme(currentTheme)
  }, [currentTheme])

  // Cargar ajustes extendidos desde localStorage
  useEffect(() => {
    const loadExtendedSettings = () => {
      const savedSettings = localStorage.getItem(`user_settings_${user.id}`)
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings)

          if (settings.pomodoro_work_time) {
            setPomodoroSettings({
              workTime: settings.pomodoro_work_time,
              breakTime: settings.pomodoro_break_time || 5,
              longBreakTime: settings.pomodoro_long_break_time || 15,
              sessionsUntilLongBreak: settings.pomodoro_sessions_until_long_break || 4,
            })
          }

          if (settings.enable_notifications !== undefined) {
            setNotificationSettings({
              enableNotifications: settings.enable_notifications,
              notificationSound: settings.notification_sound !== false,
            })
          }

          if (settings.font_size) {
            setUiSettings((prev) => ({
              ...prev,
              fontSize: settings.font_size,
            }))
          }

          if (settings.compact_mode !== undefined) {
            setUiSettings((prev) => ({
              ...prev,
              compactMode: settings.compact_mode,
            }))
          }
        } catch (error) {
          console.error("Error loading settings:", error)
        }
      }
    }

    if (user.id) {
      loadExtendedSettings()
    }
  }, [user.id])

  const canUseTheme = (themeTier: string) => {
    if (themeTier === "free") return true
    if (themeTier === "premium") return user.subscription_tier === "premium" || user.subscription_tier === "pro"
    if (themeTier === "pro") return user.subscription_tier === "pro"
    return false
  }

  const handleThemeChange = (newTheme: string) => {
    const theme = THEMES.find((t) => t.value === newTheme)
    if (!theme || !canUseTheme(theme.tier)) {
      toast({
        title: "🔒 Tema bloqueado",
        description: `Este tema requiere una suscripción ${theme?.tier}`,
        variant: "destructive",
      })
      return
    }

    setSelectedTheme(newTheme as ThemeName)
    setTheme(newTheme as ThemeName)
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Actualizar ajustes básicos y extendidos
      await hybridDb.updateUser(user.id, {
        name: formData.name,
        email: formData.email,
        theme: selectedTheme,
        language: formData.language,
        pomodoro_work_time: pomodoroSettings.workTime,
        pomodoro_break_time: pomodoroSettings.breakTime,
        pomodoro_long_break_time: pomodoroSettings.longBreakTime,
        pomodoro_sessions_until_long_break: pomodoroSettings.sessionsUntilLongBreak,
        enable_notifications: notificationSettings.enableNotifications,
        notification_sound: notificationSettings.notificationSound,
        compact_mode: uiSettings.compactMode,
        font_size: uiSettings.fontSize,
      })

      // Aplicar tema y lenguaje inmediatamente
      setTheme(selectedTheme)
      setLanguage(formData.language)
      updateFontSize(uiSettings.fontSize)

      toast({
        title: "✅ Ajustes guardados",
        description: "Tus preferencias se han actualizado correctamente",
      })

      if (onUserUpdate) {
        onUserUpdate()
      }

      onClose()
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "❌ Error",
        description: "No se pudieron guardar los ajustes",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración
          </DialogTitle>
          <DialogDescription>Personaliza tu experiencia en FutureTask</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">
              <UserIcon className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              Tema
            </TabsTrigger>
            <TabsTrigger value="pomodoro">
              <Clock className="h-4 w-4 mr-2" />
              Pomodoro
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notif.
            </TabsTrigger>
            <TabsTrigger value="ui">
              <Type className="h-4 w-4 mr-2" />
              UI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger>
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

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Plan actual</p>
                  <p className="text-sm text-muted-foreground capitalize">{user.subscription_tier}</p>
                </div>
                {user.subscription_tier !== "pro" && (
                  <Button variant="outline" size="sm">
                    <Crown className="h-4 w-4 mr-2" />
                    Mejorar Plan
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-2">
              <Label>Temas Disponibles</Label>
              <div className="grid grid-cols-2 gap-3">
                {THEMES.map((t) => {
                  const isLocked = !canUseTheme(t.tier)
                  const isSelected = selectedTheme === t.value
                  return (
                    <button
                      key={t.value}
                      onClick={() => handleThemeChange(t.value)}
                      disabled={isLocked}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 ring-2 ring-primary"
                          : "border-border hover:border-primary/50"
                      } ${isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{t.icon}</span>
                        <div className="text-left flex-1">
                          <p className="font-medium text-sm">{t.label}</p>
                          <p className="text-xs text-muted-foreground capitalize">{t.tier}</p>
                        </div>
                        {isLocked && <Crown className="h-4 w-4 text-yellow-500" />}
                        {isSelected && <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pomodoro" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tiempo de trabajo: {pomodoroSettings.workTime} min</Label>
                <Slider
                  value={[pomodoroSettings.workTime]}
                  onValueChange={([value]) => setPomodoroSettings({ ...pomodoroSettings, workTime: value })}
                  min={15}
                  max={60}
                  step={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Descanso corto: {pomodoroSettings.breakTime} min</Label>
                <Slider
                  value={[pomodoroSettings.breakTime]}
                  onValueChange={([value]) => setPomodoroSettings({ ...pomodoroSettings, breakTime: value })}
                  min={3}
                  max={15}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Descanso largo: {pomodoroSettings.longBreakTime} min</Label>
                <Slider
                  value={[pomodoroSettings.longBreakTime]}
                  onValueChange={([value]) => setPomodoroSettings({ ...pomodoroSettings, longBreakTime: value })}
                  min={15}
                  max={30}
                  step={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Sesiones hasta descanso largo: {pomodoroSettings.sessionsUntilLongBreak}</Label>
                <Slider
                  value={[pomodoroSettings.sessionsUntilLongBreak]}
                  onValueChange={([value]) =>
                    setPomodoroSettings({ ...pomodoroSettings, sessionsUntilLongBreak: value })
                  }
                  min={2}
                  max={8}
                  step={1}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Activar notificaciones</Label>
                <p className="text-sm text-muted-foreground">Recibe alertas de tareas y Pomodoro</p>
              </div>
              <Switch
                checked={notificationSettings.enableNotifications}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, enableNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sonido de notificaciones</Label>
                <p className="text-sm text-muted-foreground">Reproducir sonido con las alertas</p>
              </div>
              <Switch
                checked={notificationSettings.notificationSound}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, notificationSound: checked })
                }
                disabled={!notificationSettings.enableNotifications}
              />
            </div>
          </TabsContent>

          <TabsContent value="ui" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fontSize">Tamaño de fuente</Label>
              <Select
                value={uiSettings.fontSize}
                onValueChange={(value: "small" | "medium" | "large") =>
                  setUiSettings({ ...uiSettings, fontSize: value })
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
              <div className="space-y-0.5">
                <Label>Modo compacto</Label>
                <p className="text-sm text-muted-foreground">Reduce el espaciado entre elementos</p>
              </div>
              <Switch
                checked={uiSettings.compactMode}
                onCheckedChange={(checked) => setUiSettings({ ...uiSettings, compactMode: checked })}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
