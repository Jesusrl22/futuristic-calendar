"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Settings, User, Crown, Sparkles, X } from "lucide-react"
import type { User as UserType } from "@/lib/database"

interface SettingsModalProps {
  user: UserType
  onUpdateUser: (updates: Partial<UserType>) => void
  theme: any
  t: (key: string) => string
}

export function SettingsModal({ user, onUpdateUser, theme, t }: SettingsModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    language: user.language,
    theme: user.theme,
    work_duration: user.work_duration,
    short_break_duration: user.short_break_duration,
    long_break_duration: user.long_break_duration,
    sessions_until_long_break: user.sessions_until_long_break,
  })

  const handleSave = () => {
    onUpdateUser(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`${theme.cardBg} ${theme.border} w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
                <Settings className="h-5 w-5 text-purple-400" />
                Configuración
              </CardTitle>
              <CardDescription className={theme.textSecondary}>
                Personaliza tu experiencia en FutureTask
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.reload()}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Info */}
          <div className="space-y-4">
            <h3 className={`${theme.textPrimary} font-semibold flex items-center gap-2`}>
              <User className="h-4 w-4" />
              Información de la Cuenta
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className={theme.textPrimary}>
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={theme.inputBg}
                />
              </div>
              <div>
                <Label htmlFor="email" className={theme.textPrimary}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={theme.inputBg}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={theme.textSecondary}>Plan actual:</span>
              {user.is_pro ? (
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Pro
                </Badge>
              ) : user.is_premium ? (
                <Badge className="bg-yellow-600 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              ) : (
                <Badge variant="secondary">Gratuito</Badge>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className={`${theme.textPrimary} font-semibold`}>Preferencias</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language" className={theme.textPrimary}>
                  Idioma
                </Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger className={theme.inputBg}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="theme" className={theme.textPrimary}>
                  Tema
                </Label>
                <Select value={formData.theme} onValueChange={(value) => setFormData({ ...formData, theme: value })}>
                  <SelectTrigger className={theme.inputBg}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="light">Claro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pomodoro Settings */}
          <div className="space-y-4">
            <h3 className={`${theme.textPrimary} font-semibold`}>Configuración Pomodoro</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="work_duration" className={theme.textPrimary}>
                  Duración de trabajo (min)
                </Label>
                <Input
                  id="work_duration"
                  type="number"
                  min="1"
                  max="60"
                  value={formData.work_duration}
                  onChange={(e) => setFormData({ ...formData, work_duration: Number.parseInt(e.target.value) || 25 })}
                  className={theme.inputBg}
                />
              </div>
              <div>
                <Label htmlFor="short_break" className={theme.textPrimary}>
                  Descanso corto (min)
                </Label>
                <Input
                  id="short_break"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.short_break_duration}
                  onChange={(e) =>
                    setFormData({ ...formData, short_break_duration: Number.parseInt(e.target.value) || 5 })
                  }
                  className={theme.inputBg}
                />
              </div>
              <div>
                <Label htmlFor="long_break" className={theme.textPrimary}>
                  Descanso largo (min)
                </Label>
                <Input
                  id="long_break"
                  type="number"
                  min="1"
                  max="60"
                  value={formData.long_break_duration}
                  onChange={(e) =>
                    setFormData({ ...formData, long_break_duration: Number.parseInt(e.target.value) || 15 })
                  }
                  className={theme.inputBg}
                />
              </div>
              <div>
                <Label htmlFor="sessions_until_long" className={theme.textPrimary}>
                  Sesiones hasta descanso largo
                </Label>
                <Input
                  id="sessions_until_long"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.sessions_until_long_break}
                  onChange={(e) =>
                    setFormData({ ...formData, sessions_until_long_break: Number.parseInt(e.target.value) || 4 })
                  }
                  className={theme.inputBg}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-slate-600 text-slate-300"
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} className={theme.buttonPrimary}>
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
