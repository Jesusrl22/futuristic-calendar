"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, User, Clock, Crown, Sparkles, Shield, X } from "lucide-react"
import type { User as UserType } from "@/lib/database"

interface SettingsModalProps {
  user: UserType
  onUpdateUser: (updates: Partial<UserType>) => void
  theme: {
    cardBg: string
    border: string
    textPrimary: string
    textSecondary: string
    textMuted: string
    buttonPrimary: string
    buttonSecondary: string
    inputBg: string
  }
  t: (key: string) => string
}

export function SettingsModal({ user, onUpdateUser, theme, t }: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(true)
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
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-400" />
            Configuración
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="ml-auto text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription className="text-slate-400">Personaliza tu experiencia en FutureTask</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700">
            <TabsTrigger value="profile" className="text-white">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="pomodoro" className="text-white">
              <Clock className="h-4 w-4 mr-2" />
              Pomodoro
            </TabsTrigger>
            <TabsTrigger value="subscription" className="text-white">
              <Crown className="h-4 w-4 mr-2" />
              Suscripción
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="h-4 w-4 text-blue-400" />
                Información Personal
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-slate-300">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language" className="text-slate-300">
                    Idioma
                  </Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => setFormData({ ...formData, language: value })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="theme" className="text-slate-300">
                    Tema
                  </Label>
                  <Select value={formData.theme} onValueChange={(value) => setFormData({ ...formData, theme: value })}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Oscuro</SelectItem>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pomodoro" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-400" />
                Configuración Pomodoro
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="work_duration" className="text-slate-300">
                    Duración Trabajo (minutos)
                  </Label>
                  <Input
                    id="work_duration"
                    type="number"
                    value={formData.work_duration}
                    onChange={(e) => setFormData({ ...formData, work_duration: Number.parseInt(e.target.value) || 25 })}
                    className="bg-slate-700 border-slate-600 text-white"
                    min="1"
                    max="60"
                  />
                </div>
                <div>
                  <Label htmlFor="short_break_duration" className="text-slate-300">
                    Descanso Corto (minutos)
                  </Label>
                  <Input
                    id="short_break_duration"
                    type="number"
                    value={formData.short_break_duration}
                    onChange={(e) =>
                      setFormData({ ...formData, short_break_duration: Number.parseInt(e.target.value) || 5 })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    min="1"
                    max="30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="long_break_duration" className="text-slate-300">
                    Descanso Largo (minutos)
                  </Label>
                  <Input
                    id="long_break_duration"
                    type="number"
                    value={formData.long_break_duration}
                    onChange={(e) =>
                      setFormData({ ...formData, long_break_duration: Number.parseInt(e.target.value) || 15 })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    min="1"
                    max="60"
                  />
                </div>
                <div>
                  <Label htmlFor="sessions_until_long_break" className="text-slate-300">
                    Sesiones hasta descanso largo
                  </Label>
                  <Input
                    id="sessions_until_long_break"
                    type="number"
                    value={formData.sessions_until_long_break}
                    onChange={(e) =>
                      setFormData({ ...formData, sessions_until_long_break: Number.parseInt(e.target.value) || 4 })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="font-medium text-blue-400 mb-2">Vista Previa</h4>
                <p className="text-sm text-slate-300">
                  Trabajarás por {formData.work_duration} minutos, luego descansarás {formData.short_break_duration}{" "}
                  minutos. Después de {formData.sessions_until_long_break} sesiones, tendrás un descanso largo de{" "}
                  {formData.long_break_duration} minutos.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-400" />
                Estado de Suscripción
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                  <div className="flex items-center gap-3">
                    {user.email === "admin@futuretask.com" && (
                      <Badge variant="secondary" className="bg-red-600 text-white">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                    {user.is_pro && (
                      <Badge variant="secondary" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Pro
                      </Badge>
                    )}
                    {user.is_premium && !user.is_pro && (
                      <Badge variant="secondary" className="bg-yellow-600 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {!user.is_premium && (
                      <Badge variant="secondary" className="bg-slate-600 text-white">
                        Gratuito
                      </Badge>
                    )}
                  </div>
                </div>

                {user.is_pro && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="font-medium text-purple-400 mb-2">Créditos IA</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Disponibles</p>
                        <p className="text-lg font-bold text-white">{user.ai_credits || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Usados</p>
                        <p className="text-lg font-bold text-white">{user.ai_credits_used || 0}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="font-medium text-white">Funciones Disponibles</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded bg-slate-900/30">
                      <span className="text-slate-300">📅 Calendario básico</span>
                      <Badge variant="secondary" className="bg-green-600 text-white">
                        Incluido
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-900/30">
                      <span className="text-slate-300">✅ Gestión de tareas</span>
                      <Badge variant="secondary" className="bg-green-600 text-white">
                        Incluido
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-900/30">
                      <span className="text-slate-300">🎯 Lista de objetivos</span>
                      <Badge variant="secondary" className={user.is_premium ? "bg-green-600" : "bg-yellow-600"}>
                        {user.is_premium ? "Incluido" : "Premium"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-900/30">
                      <span className="text-slate-300">📝 Sistema de notas</span>
                      <Badge variant="secondary" className={user.is_premium ? "bg-green-600" : "bg-yellow-600"}>
                        {user.is_premium ? "Incluido" : "Premium"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-900/30">
                      <span className="text-slate-300">🤖 Asistente IA</span>
                      <Badge variant="secondary" className={user.is_pro ? "bg-green-600" : "bg-purple-600"}>
                        {user.is_pro ? "Incluido" : "Pro"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
