"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Clock, Save } from "lucide-react"
import { DatabaseStatus } from "./database-status"

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={theme.textSecondary}>
          <Settings className="w-4 h-4 mr-2" />
          {t("settings")}
        </Button>
      </DialogTrigger>
      <DialogContent className={`max-w-2xl ${theme.cardBg} ${theme.border}`}>
        <DialogHeader>
          <DialogTitle className={theme.textPrimary}>{t("configuration")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Profile Settings */}
          <Card className={`${theme.cardBg} ${theme.border}`}>
            <CardHeader>
              <CardTitle className={`${theme.textPrimary} text-lg flex items-center space-x-2`}>
                {/* User icon is removed as it was causing redeclaration */}
                <span>Perfil</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={theme.textSecondary}>
                  {t("name")}
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className={theme.inputBg} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className={theme.textSecondary}>
                  {t("language")}
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

          {/* Pomodoro Settings */}
          <Card className={`${theme.cardBg} ${theme.border}`}>
            <CardHeader>
              <CardTitle className={`${theme.textPrimary} text-lg flex items-center space-x-2`}>
                <Clock className="w-5 h-5" />
                <span>{t("pomodoroSettings")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="work-duration" className={theme.textSecondary}>
                    {t("workDuration")}
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
                    {t("shortBreakDuration")}
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
                    {t("longBreakDuration")}
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
                    {t("sessionsUntilLongBreak")}
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
                <Label className={theme.textSecondary}>{t("presetConfigurations")}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset("classic")}
                    className={theme.buttonSecondary}
                  >
                    {t("classic")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset("extended")}
                    className={theme.buttonSecondary}
                  >
                    {t("extended")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset("intensive")}
                    className={theme.buttonSecondary}
                  >
                    {t("intensive")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset("university")}
                    className={theme.buttonSecondary}
                  >
                    {t("university")}
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
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} className={theme.buttonPrimary}>
            <Save className="w-4 h-4 mr-2" />
            {t("saveChanges")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
