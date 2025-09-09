"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Palette, Clock, Save } from "lucide-react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onUpdateUser: (updates: any) => void
  theme: any
  t: (key: string) => string
}

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

const LANGUAGE_OPTIONS = [
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "it", label: "Italiano", flag: "🇮🇹" },
]

export function SettingsModal({ isOpen, onClose, user, onUpdateUser, theme, t }: SettingsModalProps) {
  const [profileName, setProfileName] = useState(user.name)
  const [profileEmail, setProfileEmail] = useState(user.email)
  const [profileLanguage, setProfileLanguage] = useState(user.language)
  const [profileTheme, setProfileTheme] = useState(user.theme)
  const [workDuration, setWorkDuration] = useState(user.work_duration)
  const [shortBreakDuration, setShortBreakDuration] = useState(user.short_break_duration)
  const [longBreakDuration, setLongBreakDuration] = useState(user.long_break_duration)
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(user.sessions_until_long_break)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileName(user.name)
      setProfileEmail(user.email)
      setProfileLanguage(user.language)
      setProfileTheme(user.theme)
      setWorkDuration(user.work_duration)
      setShortBreakDuration(user.short_break_duration)
      setLongBreakDuration(user.long_break_duration)
      setSessionsUntilLongBreak(user.sessions_until_long_break)
    }
  }, [user])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onUpdateUser({
        name: profileName,
        email: profileEmail,
        language: profileLanguage,
        theme: profileTheme,
        work_duration: workDuration,
        short_break_duration: shortBreakDuration,
        long_break_duration: longBreakDuration,
        sessions_until_long_break: sessionsUntilLongBreak,
      })
      onClose()
    } catch (error) {
      console.error("Error updating settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyPreset = (preset: string) => {
    switch (preset) {
      case "classic":
        setWorkDuration(25)
        setShortBreakDuration(5)
        setLongBreakDuration(15)
        setSessionsUntilLongBreak(4)
        break
      case "extended":
        setWorkDuration(30)
        setShortBreakDuration(10)
        setLongBreakDuration(20)
        setSessionsUntilLongBreak(3)
        break
      case "intensive":
        setWorkDuration(45)
        setShortBreakDuration(15)
        setLongBreakDuration(30)
        setSessionsUntilLongBreak(2)
        break
      case "university":
        setWorkDuration(50)
        setShortBreakDuration(10)
        setLongBreakDuration(25)
        setSessionsUntilLongBreak(3)
        break
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${theme.cardBg} ${theme.border} max-w-2xl max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className={theme.textPrimary}>{t("settings")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 text-purple-400" />
              <h3 className={`text-lg font-semibold ${theme.textPrimary}`}>Perfil</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={theme.textSecondary}>{t("name")}</Label>
                <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} className={theme.inputBg} />
              </div>
              <div className="space-y-2">
                <Label className={theme.textSecondary}>{t("email")}</Label>
                <Input
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className={theme.inputBg}
                />
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-400" />
              <h3 className={`text-lg font-semibold ${theme.textPrimary}`}>{t("language")}</h3>
            </div>

            <Select value={profileLanguage} onValueChange={(value) => setProfileLanguage(value as any)}>
              <SelectTrigger className={theme.inputBg}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${theme.cardBg} ${theme.border}`}>
                {LANGUAGE_OPTIONS.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value} className={theme.textPrimary}>
                    <span className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Theme Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-green-400" />
              <h3 className={`text-lg font-semibold ${theme.textPrimary}`}>{t("theme")}</h3>
            </div>

            <Select value={profileTheme} onValueChange={setProfileTheme}>
              <SelectTrigger className={theme.inputBg}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${theme.cardBg} ${theme.border}`}>
                {Object.entries(THEMES.free).map(([key, name]) => (
                  <SelectItem key={key} value={key} className={theme.textPrimary}>
                    {name}
                  </SelectItem>
                ))}
                {user.is_premium &&
                  Object.entries(THEMES.premium).map(([key, name]) => (
                    <SelectItem key={key} value={key} className={theme.textPrimary}>
                      {name} (Premium)
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pomodoro Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-red-400" />
              <h3 className={`text-lg font-semibold ${theme.textPrimary}`}>{t("pomodoroSettings")}</h3>
            </div>

            {user.is_premium && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyPreset("classic")}
                  className={theme.buttonSecondary}
                >
                  {t("classic")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyPreset("extended")}
                  className={theme.buttonSecondary}
                >
                  {t("extended")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyPreset("intensive")}
                  className={theme.buttonSecondary}
                >
                  {t("intensive")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyPreset("university")}
                  className={theme.buttonSecondary}
                >
                  {t("university")}
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={theme.textSecondary}>{t("workDuration")}</Label>
                <Input
                  type="number"
                  value={workDuration}
                  onChange={(e) => setWorkDuration(Number(e.target.value))}
                  className={theme.inputBg}
                  disabled={!user.is_premium}
                />
              </div>
              <div className="space-y-2">
                <Label className={theme.textSecondary}>{t("shortBreakDuration")}</Label>
                <Input
                  type="number"
                  value={shortBreakDuration}
                  onChange={(e) => setShortBreakDuration(Number(e.target.value))}
                  className={theme.inputBg}
                  disabled={!user.is_premium}
                />
              </div>
              <div className="space-y-2">
                <Label className={theme.textSecondary}>{t("longBreakDuration")}</Label>
                <Input
                  type="number"
                  value={longBreakDuration}
                  onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                  className={theme.inputBg}
                  disabled={!user.is_premium}
                />
              </div>
              <div className="space-y-2">
                <Label className={theme.textSecondary}>{t("sessionsUntilLongBreak")}</Label>
                <Input
                  type="number"
                  value={sessionsUntilLongBreak}
                  onChange={(e) => setSessionsUntilLongBreak(Number(e.target.value))}
                  className={theme.inputBg}
                  disabled={!user.is_premium}
                />
              </div>
            </div>

            {!user.is_premium && (
              <div className={`text-xs ${theme.textMuted} text-center p-2 border border-yellow-500/20 rounded`}>
                💎 Premium: Personaliza las duraciones del Pomodoro
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="ghost" onClick={onClose} className={theme.textSecondary}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className={theme.buttonPrimary}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Guardando..." : t("saveChanges")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
