"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, User, Palette, Globe, Bell, Crown, Timer, Zap, Target, Check, X } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/hooks/useLanguage"
import type { User as UserType } from "@/lib/hybrid-database"

interface SettingsModalProps {
  user?: UserType | null
  onUserUpdate?: (updates: Partial<UserType>) => void
  onUpgrade?: () => void
  onCancelPlan?: () => void
}

export function SettingsModal({ user, onUserUpdate, onUpgrade, onCancelPlan }: SettingsModalProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const handleSave = () => {
    if (onUserUpdate) {
      onUserUpdate(formData)
    }
    setIsOpen(false)
  }

  const handleThemeChange = (theme: string) => {
    if (onUserUpdate) {
      onUserUpdate({ theme })
    }
  }

  const handleNotificationToggle = (type: string, enabled: boolean) => {
    // Handle notification preferences
    console.log(`${type} notifications:`, enabled)
  }

  const themes = [
    { id: "classic", name: "Clásico", description: "Tema por defecto", free: true },
    { id: "dark", name: "Oscuro", description: "Tema oscuro elegante", free: true },
    { id: "blue", name: "Azul", description: "Tema azul profesional", free: false },
    { id: "purple", name: "Púrpura", description: "Tema púrpura moderno", free: false },
    { id: "green", name: "Verde", description: "Tema verde natural", free: false },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Configuración</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración
          </DialogTitle>
          <DialogDescription>Personaliza tu experiencia en FutureTask</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="gap-1">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Tema</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="gap-1">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Idioma</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notif.</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="gap-1">
              <Crown className="h-4 w-4" />
              <span className="hidden sm:inline">Plan</span>
            </TabsTrigger>
            <TabsTrigger value="pomodoro" className="gap-1">
              <Timer className="h-4 w-4" />
              <span className="hidden sm:inline">Timer</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualiza tu información de perfil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Plan Actual</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.plan === "pro" ? "Plan Pro - Acceso completo" : "Plan Gratuito - Funciones básicas"}
                    </p>
                  </div>
                  <Badge variant={user?.plan === "pro" ? "default" : "secondary"} className="gap-1">
                    {user?.plan === "pro" ? <Zap className="h-3 w-3" /> : <Target className="h-3 w-3" />}
                    {user?.plan === "pro" ? "Pro" : "Free"}
                  </Badge>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave}>Guardar Cambios</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Tab */}
          <TabsContent value="theme" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personalización Visual</CardTitle>
                <CardDescription>Elige el tema que más te guste</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        user?.theme === theme.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      } ${!theme.free && user?.plan !== "pro" ? "opacity-50" : ""}`}
                      onClick={() => {
                        if (theme.free || user?.plan === "pro") {
                          handleThemeChange(theme.id)
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{theme.name}</h4>
                        <div className="flex items-center gap-2">
                          {!theme.free && <Crown className="h-4 w-4 text-yellow-500" />}
                          {user?.theme === theme.id && <Check className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{theme.description}</p>
                      {!theme.free && user?.plan !== "pro" && (
                        <p className="text-xs text-yellow-600 mt-2">Requiere Plan Pro</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Language Tab */}
          <TabsContent value="language" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Idioma</CardTitle>
                <CardDescription>Selecciona tu idioma preferido</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Idioma de la Interfaz</Label>
                    <div className="mt-2">
                      <LanguageSelector />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificaciones</CardTitle>
                <CardDescription>Controla qué notificaciones quieres recibir</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Recordatorios de Tareas</h4>
                    <p className="text-sm text-muted-foreground">Recibe notificaciones cuando vencen las tareas</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleNotificationToggle("tasks", checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Sesiones Pomodoro</h4>
                    <p className="text-sm text-muted-foreground">Notificaciones de inicio y fin de sesiones</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleNotificationToggle("pomodoro", checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Logros Desbloqueados</h4>
                    <p className="text-sm text-muted-foreground">Celebra tus logros con notificaciones</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleNotificationToggle("achievements", checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Actualizaciones del Sistema</h4>
                    <p className="text-sm text-muted-foreground">Información sobre nuevas funciones</p>
                  </div>
                  <Switch onCheckedChange={(checked) => handleNotificationToggle("updates", checked)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Suscripción</CardTitle>
                <CardDescription>Administra tu plan y facturación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {user?.plan === "pro" ? (
                        <>
                          <Zap className="h-4 w-4 text-yellow-500" />
                          Plan Pro
                        </>
                      ) : (
                        <>
                          <Target className="h-4 w-4" />
                          Plan Gratuito
                        </>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.plan === "pro" ? "Acceso completo a todas las funciones" : "Funciones básicas disponibles"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{user?.plan === "pro" ? "$9.99/mes" : "Gratis"}</div>
                    {user?.plan === "pro" && <div className="text-sm text-muted-foreground">Renovación automática</div>}
                  </div>
                </div>

                {user?.plan === "pro" ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Funciones Pro Activas</h4>
                      <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                        <li>• Asistente IA ilimitado</li>
                        <li>• Temas premium</li>
                        <li>• Estadísticas avanzadas</li>
                        <li>• Sincronización en la nube</li>
                        <li>• Soporte prioritario</li>
                      </ul>
                    </div>
                    <Button variant="destructive" onClick={onCancelPlan} className="w-full">
                      <X className="h-4 w-4 mr-2" />
                      Cancelar Suscripción
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Desbloquea el Plan Pro</h4>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 mb-4">
                        <li>• Asistente IA ilimitado</li>
                        <li>• Temas premium exclusivos</li>
                        <li>• Estadísticas detalladas</li>
                        <li>• Sincronización automática</li>
                        <li>• Soporte prioritario 24/7</li>
                      </ul>
                    </div>
                    <Button onClick={onUpgrade} className="w-full">
                      <Crown className="h-4 w-4 mr-2" />
                      Actualizar a Pro - $9.99/mes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pomodoro Tab */}
          <TabsContent value="pomodoro" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Timer Pomodoro</CardTitle>
                <CardDescription>Personaliza tus sesiones de trabajo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Duración del Trabajo (minutos)</Label>
                    <Input type="number" defaultValue="25" min="1" max="60" />
                  </div>
                  <div className="space-y-2">
                    <Label>Descanso Corto (minutos)</Label>
                    <Input type="number" defaultValue="5" min="1" max="30" />
                  </div>
                  <div className="space-y-2">
                    <Label>Descanso Largo (minutos)</Label>
                    <Input type="number" defaultValue="15" min="1" max="60" />
                  </div>
                  <div className="space-y-2">
                    <Label>Sesiones hasta descanso largo</Label>
                    <Input type="number" defaultValue="4" min="2" max="8" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Inicio Automático</h4>
                      <p className="text-sm text-muted-foreground">Iniciar automáticamente la siguiente sesión</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Sonidos de Notificación</h4>
                      <p className="text-sm text-muted-foreground">Reproducir sonido al finalizar sesiones</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Modo No Molestar</h4>
                      <p className="text-sm text-muted-foreground">Bloquear distracciones durante el trabajo</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Guardar Configuración</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
