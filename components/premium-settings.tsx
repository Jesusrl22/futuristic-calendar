"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Crown, Zap, Clock, Download, Upload, Shield, Star } from "lucide-react"
import { toast } from "sonner"

interface PremiumSettingsProps {
  preferences: any
  onPreferencesChange: (preferences: any) => void
}

export function PremiumSettings({ preferences, onPreferencesChange }: PremiumSettingsProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const handlePomodoroSettingChange = (setting: string, value: number | boolean) => {
    onPreferencesChange({
      ...preferences,
      [setting]: value,
    })
  }

  const handleExportData = () => {
    const data = {
      preferences,
      tasks: JSON.parse(localStorage.getItem("tasks") || "[]"),
      notes: JSON.parse(localStorage.getItem("notes-blog") || "[]"),
      goals: JSON.parse(localStorage.getItem("wishlist-goals") || "[]"),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `futuretask-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("¡Datos exportados!", {
      description: "Tu copia de seguridad se ha descargado exitosamente",
    })
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        if (data.preferences) {
          onPreferencesChange(data.preferences)
        }
        if (data.tasks) {
          localStorage.setItem("tasks", JSON.stringify(data.tasks))
        }
        if (data.notes) {
          localStorage.setItem("notes-blog", JSON.stringify(data.notes))
        }
        if (data.goals) {
          localStorage.setItem("wishlist-goals", JSON.stringify(data.goals))
        }

        toast.success("¡Datos importados!", {
          description: "Tu copia de seguridad se ha restaurado exitosamente",
        })

        // Reload the page to apply changes
        window.location.reload()
      } catch (error) {
        toast.error("Error al importar", {
          description: "El archivo no es válido o está corrupto",
        })
      }
    }
    reader.readAsText(file)
  }

  const handleCancelPremium = () => {
    onPreferencesChange({
      ...preferences,
      isPremium: false,
      premiumExpiry: undefined,
    })
    setShowCancelDialog(false)
    toast.success("Premium cancelado", {
      description: "Tu suscripción Premium ha sido cancelada",
    })
  }

  if (!preferences.isPremium) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-8 text-center">
          <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Configuración Premium</h3>
          <p className="text-white/60 mb-6">
            Actualiza a Premium para acceder a configuraciones avanzadas y funciones exclusivas
          </p>
          <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
            <Crown className="h-4 w-4 mr-2" />
            Actualizar a Premium
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Premium Status */}
      <Card className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/30">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Crown className="h-5 w-5 mr-2 text-yellow-400" />
            Estado Premium
            <Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">Activo</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Suscripción Premium</p>
              <p className="text-white/60 text-sm">
                {preferences.premiumExpiry
                  ? `Expira el ${new Date(preferences.premiumExpiry).toLocaleDateString()}`
                  : "Suscripción activa"}
              </p>
            </div>
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Cancelar Premium
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <DialogHeader>
                  <DialogTitle>¿Cancelar Premium?</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-white/80">
                    ¿Estás seguro de que quieres cancelar tu suscripción Premium? Perderás acceso a:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-white/60 text-sm">
                    <li>Temas premium exclusivos</li>
                    <li>Configuraciones avanzadas de Pomodoro</li>
                    <li>Exportación e importación de datos</li>
                    <li>Objetivos y metas avanzadas</li>
                    <li>Sistema de notas completo</li>
                    <li>Sin anuncios</li>
                  </ul>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelDialog(false)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Mantener Premium
                    </Button>
                    <Button onClick={handleCancelPremium} className="bg-red-600 hover:bg-red-700 text-white">
                      Cancelar Premium
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Pomodoro Settings */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Clock className="h-5 w-5 mr-2" />
            Configuración Avanzada de Pomodoro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Tiempo de Enfoque (minutos)</Label>
              <Slider
                value={[preferences.pomodoroTime]}
                onValueChange={(value) => handlePomodoroSettingChange("pomodoroTime", value[0])}
                max={60}
                min={15}
                step={5}
                className="w-full"
              />
              <div className="text-sm text-white/60">{preferences.pomodoroTime} minutos</div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Descanso Corto (minutos)</Label>
              <Slider
                value={[preferences.shortBreakTime]}
                onValueChange={(value) => handlePomodoroSettingChange("shortBreakTime", value[0])}
                max={15}
                min={3}
                step={1}
                className="w-full"
              />
              <div className="text-sm text-white/60">{preferences.shortBreakTime} minutos</div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Descanso Largo (minutos)</Label>
              <Slider
                value={[preferences.longBreakTime]}
                onValueChange={(value) => handlePomodoroSettingChange("longBreakTime", value[0])}
                max={30}
                min={10}
                step={5}
                className="w-full"
              />
              <div className="text-sm text-white/60">{preferences.longBreakTime} minutos</div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Intervalo de Descanso Largo</Label>
              <Slider
                value={[preferences.longBreakInterval]}
                onValueChange={(value) => handlePomodoroSettingChange("longBreakInterval", value[0])}
                max={8}
                min={2}
                step={1}
                className="w-full"
              />
              <div className="text-sm text-white/60">Cada {preferences.longBreakInterval} sesiones</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Auto-iniciar Descansos</Label>
                <p className="text-sm text-white/60">Iniciar automáticamente los períodos de descanso</p>
              </div>
              <Switch
                checked={preferences.autoStartBreaks}
                onCheckedChange={(checked) => handlePomodoroSettingChange("autoStartBreaks", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Auto-iniciar Pomodoros</Label>
                <p className="text-sm text-white/60">Iniciar automáticamente las sesiones de trabajo</p>
              </div>
              <Switch
                checked={preferences.autoStartPomodoros}
                onCheckedChange={(checked) => handlePomodoroSettingChange("autoStartPomodoros", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Settings */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Star className="h-5 w-5 mr-2" />
            Configuración de Objetivos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Objetivo Diario (horas)</Label>
              <Slider
                value={[preferences.dailyGoal]}
                onValueChange={(value) => handlePomodoroSettingChange("dailyGoal", value[0])}
                max={16}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-sm text-white/60">{preferences.dailyGoal} horas por día</div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Objetivo Semanal (horas)</Label>
              <Slider
                value={[preferences.weeklyGoal]}
                onValueChange={(value) => handlePomodoroSettingChange("weeklyGoal", value[0])}
                max={80}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="text-sm text-white/60">{preferences.weeklyGoal} horas por semana</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Shield className="h-5 w-5 mr-2" />
            Gestión de Datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleExportData} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Exportar Datos
            </Button>

            <div>
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" id="import-data" />
              <Button
                onClick={() => document.getElementById("import-data")?.click()}
                className="bg-green-600 hover:bg-green-700 text-white w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar Datos
              </Button>
            </div>
          </div>
          <p className="text-sm text-white/60">
            Exporta tus datos para crear una copia de seguridad o importa datos desde otro dispositivo.
          </p>
        </CardContent>
      </Card>

      {/* Premium Features Overview */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Zap className="h-5 w-5 mr-2" />
            Funciones Premium Activas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white/80">Temas premium exclusivos</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white/80">Configuración avanzada de Pomodoro</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white/80">Sistema completo de notas</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white/80">Objetivos y metas avanzadas</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white/80">Exportación e importación de datos</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white/80">Sin anuncios</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PremiumSettings
