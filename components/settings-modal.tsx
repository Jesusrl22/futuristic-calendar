"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, X, Save, Lock, Eye, EyeOff } from "lucide-react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onUpdateUser: (updates: any) => void
  theme: any
  t: (key: string) => string
}

const LANGUAGE_OPTIONS = [
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "it", label: "Italiano", flag: "🇮🇹" },
]

const THEMES = {
  free: {
    default: "Futurista (Predeterminado)",
    light: "Claro",
    dark: "Oscuro",
    ocean: "Océano",
    forest: "Bosque",
  },
  premium: {
    neon: "Neón",
    galaxy: "Galaxia",
    sunset: "Atardecer",
    aurora: "Aurora",
    cyberpunk: "Cyberpunk",
  },
}

const POMODORO_PRESETS = {
  classic: { work: 25, short: 5, long: 15, sessions: 4 },
  extended: { work: 30, short: 10, long: 20, sessions: 3 },
  intensive: { work: 45, short: 15, long: 30, sessions: 2 },
  university: { work: 50, short: 10, long: 25, sessions: 3 },
}

export function SettingsModal({ isOpen, onClose, user, onUpdateUser, theme, t }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "pomodoro" | "security">("profile")
  const [profileName, setProfileName] = useState(user.name)
  const [profileEmail, setProfileEmail] = useState(user.email)
  const [profileLanguage, setProfileLanguage] = useState(user.language)
  const [profileTheme, setProfileTheme] = useState(user.theme)
  const [workDuration, setWorkDuration] = useState(user.work_duration)
  const [shortBreakDuration, setShortBreakDuration] = useState(user.short_break_duration)
  const [longBreakDuration, setLongBreakDuration] = useState(user.long_break_duration)
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(user.sessions_until_long_break)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setProfileName(user.name)
      setProfileEmail(user.email)
      setProfileLanguage(user.language)
      setProfileTheme(user.theme)
      setWorkDuration(user.work_duration)
      setShortBreakDuration(user.short_break_duration)
      setLongBreakDuration(user.long_break_duration)
      setSessionsUntilLongBreak(user.sessions_until_long_break)

      // Reset password fields
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }, [isOpen, user])

  const handleSave = () => {
    const updates = {
      name: profileName,
      email: profileEmail,
      language: profileLanguage,
      theme: profileTheme,
      work_duration: workDuration,
      short_break_duration: shortBreakDuration,
      long_break_duration: longBreakDuration,
      sessions_until_long_break: sessionsUntilLongBreak,
    }

    onUpdateUser(updates)
    onClose()
  }

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword) {
      alert("Por favor completa todos los campos de contraseña")
      return
    }

    if (newPassword !== confirmPassword) {
      alert(t("passwordsDoNotMatch"))
      return
    }

    if (newPassword.length < 6) {
      alert("La nueva contraseña debe tener al menos 6 caracteres")
      return
    }

    // Verificar contraseña actual (simulado)
    if (currentPassword !== user.password) {
      alert(t("incorrectCurrentPassword"))
      return
    }

    // Actualizar contraseña
    onUpdateUser({ password: newPassword })

    // Limpiar campos
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")

    alert(t("passwordChangedSuccessfully"))
  }

  const applyPreset = (presetKey: any) => {
    const preset = POMODORO_PRESETS[presetKey]
    setWorkDuration(preset.work)
    setShortBreakDuration(preset.short)
    setLongBreakDuration(preset.long)
    setSessionsUntilLongBreak(preset.sessions)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-2xl ${theme.cardBg} ${theme.border} max-h-[90vh] overflow-hidden`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className={`${theme.textPrimary} text-xl flex items-center space-x-2`}>
              <Settings className="w-5 h-5" />
              <span>{t("settings")}</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className={`${theme.textSecondary} p-1`}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Tabs */}
          <div className="flex space-x-1 p-1 bg-black/20 rounded-lg">
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("profile")}
              className={`flex-1 text-xs ${activeTab === "profile" ? theme.buttonPrimary : theme.textSecondary}`}
            >
              👤 Perfil
            </Button>
            <Button
              variant={activeTab === "appearance" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("appearance")}
              className={`flex-1 text-xs ${activeTab === "appearance" ? theme.buttonPrimary : theme.textSecondary}`}
            >
              🎨 Apariencia
            </Button>
            <Button
              variant={activeTab === "pomodoro" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("pomodoro")}
              className={`flex-1 text-xs ${activeTab === "pomodoro" ? theme.buttonPrimary : theme.textSecondary}`}
            >
              🍅 Pomodoro
            </Button>
            <Button
              variant={activeTab === "security" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("security")}
              className={`flex-1 text-xs ${activeTab === "security" ? theme.buttonPrimary : theme.textSecondary}`}
            >
              🔒 Seguridad
            </Button>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className={`${theme.textSecondary} text-sm`}>Nombre</Label>
                <Input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className={`${theme.inputBg} text-sm`}
                />
              </div>
              <div className="space-y-2">
                <Label className={`${theme.textSecondary} text-sm`}>Email</Label>
                <Input
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className={`${theme.inputBg} text-sm`}
                />
              </div>
              <div className="space-y-2">
                <Label className={`${theme.textSecondary} text-sm`}>Idioma</Label>
                <Select value={profileLanguage} onValueChange={(value) => setProfileLanguage(value)}>
                  <SelectTrigger className={`${theme.inputBg} text-sm`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`${theme.cardBg} ${theme.border}`}>
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value} className={`${theme.textPrimary} text-sm`}>
                        <span className="flex items-center space-x-2">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className={`${theme.textSecondary} text-sm`}>Tema</Label>
                <Select value={profileTheme} onValueChange={setProfileTheme}>
                  <SelectTrigger className={`${theme.inputBg} text-sm`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`${theme.cardBg} ${theme.border}`}>
                    <div className={`px-2 py-1 text-xs font-semibold ${theme.textMuted} uppercase`}>Gratuitos</div>
                    {Object.entries(THEMES.free).map(([key, name]) => (
                      <SelectItem key={key} value={key} className={`${theme.textPrimary} text-sm`}>
                        {name}
                      </SelectItem>
                    ))}
                    {user.is_premium && (
                      <>
                        <div
                          className={`px-2 py-1 text-xs font-semibold ${theme.textMuted} uppercase flex items-center space-x-1`}
                        >
                          <span className="text-yellow-400">👑</span>
                          <span>Premium</span>
                        </div>
                        {Object.entries(THEMES.premium).map(([key, name]) => (
                          <SelectItem key={key} value={key} className={`${theme.textPrimary} text-sm`}>
                            {name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              {!user.is_premium && (
                <div className={`p-3 rounded-lg border border-yellow-500/20 ${theme.cardBg}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-yellow-400">👑</span>
                    <span className={`${theme.textPrimary} text-sm font-medium`}>Temas Premium</span>
                  </div>
                  <p className={`${theme.textSecondary} text-xs`}>
                    Desbloquea temas exclusivos como Neón, Galaxia, Atardecer y más con Premium.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pomodoro Tab */}
          {activeTab === "pomodoro" && (
            <div className="space-y-4">
              {user.is_premium && (
                <div className="space-y-3">
                  <Label className={`${theme.textSecondary} text-sm`}>Configuraciones Predefinidas</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(POMODORO_PRESETS).map(([key, preset]) => (
                      <Button
                        key={key}
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(key)}
                        className={`${theme.buttonSecondary} text-xs p-2 h-auto flex-col`}
                      >
                        <span className="font-medium">
                          {key === "classic" && "Clásico"}
                          {key === "extended" && "Extendido"}
                          {key === "intensive" && "Intensivo"}
                          {key === "university" && "Universitario"}
                        </span>
                        <span className={`${theme.textMuted} text-xs`}>
                          {preset.work}/{preset.short}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className={`${theme.textSecondary} text-sm`}>Trabajo (min)</Label>
                  <Input
                    type="number"
                    value={workDuration}
                    onChange={(e) => setWorkDuration(Number(e.target.value))}
                    className={`${theme.inputBg} text-sm`}
                    disabled={!user.is_premium}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={`${theme.textSecondary} text-sm`}>Descanso corto (min)</Label>
                  <Input
                    type="number"
                    value={shortBreakDuration}
                    onChange={(e) => setShortBreakDuration(Number(e.target.value))}
                    className={`${theme.inputBg} text-sm`}
                    disabled={!user.is_premium}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={`${theme.textSecondary} text-sm`}>Descanso largo (min)</Label>
                  <Input
                    type="number"
                    value={longBreakDuration}
                    onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                    className={`${theme.inputBg} text-sm`}
                    disabled={!user.is_premium}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={`${theme.textSecondary} text-sm`}>Sesiones hasta descanso largo</Label>
                  <Input
                    type="number"
                    value={sessionsUntilLongBreak}
                    onChange={(e) => setSessionsUntilLongBreak(Number(e.target.value))}
                    className={`${theme.inputBg} text-sm`}
                    disabled={!user.is_premium}
                  />
                </div>
              </div>

              {!user.is_premium && (
                <div className={`p-3 rounded-lg border border-yellow-500/20 ${theme.cardBg}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-yellow-400">👑</span>
                    <span className={`${theme.textPrimary} text-sm font-medium`}>Configuración Premium</span>
                  </div>
                  <p className={`${theme.textSecondary} text-xs`}>
                    Personaliza completamente tus duraciones de Pomodoro con Premium.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Lock className="w-5 h-5 text-blue-400" />
                  <h3 className={`${theme.textPrimary} text-lg font-semibold`}>Cambiar Contraseña</h3>
                </div>

                <div className="space-y-2">
                  <Label className={`${theme.textSecondary} text-sm`}>Contraseña Actual</Label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`${theme.inputBg} text-sm pr-10`}
                      placeholder="Ingresa tu contraseña actual"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent ${theme.textMuted}`}
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={`${theme.textSecondary} text-sm`}>Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`${theme.inputBg} text-sm pr-10`}
                      placeholder="Ingresa tu nueva contraseña"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent ${theme.textMuted}`}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={`${theme.textSecondary} text-sm`}>Confirmar Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`${theme.inputBg} text-sm pr-10`}
                      placeholder="Confirma tu nueva contraseña"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent ${theme.textMuted}`}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handlePasswordChange}
                  className={`${theme.buttonPrimary} text-sm`}
                  disabled={!currentPassword || !newPassword || !confirmPassword}
                >
                  <Lock className="w-3 h-3 mr-1" />
                  Cambiar Contraseña
                </Button>

                <div className={`p-3 rounded-lg border border-blue-500/20 ${theme.cardBg} mt-4`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-blue-400">🔒</span>
                    <span className={`${theme.textPrimary} text-sm font-medium`}>Consejos de Seguridad</span>
                  </div>
                  <ul className={`${theme.textSecondary} text-xs space-y-1`}>
                    <li>• Usa al menos 8 caracteres</li>
                    <li>• Combina letras, números y símbolos</li>
                    <li>• No uses información personal</li>
                    <li>• Cambia tu contraseña regularmente</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={onClose} className={`${theme.textSecondary} text-sm`}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className={`${theme.buttonPrimary} text-sm`}>
              <Save className="w-3 h-3 mr-1" />
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
