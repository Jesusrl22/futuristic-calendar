"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { notificationService } from "@/lib/notifications"
import { Bell, BellOff, Volume2, Check, X, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface NotificationManagerProps {
  getTasks: () => Promise<any[]>
}

export function NotificationManager({ getTasks }: NotificationManagerProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)

  useEffect(() => {
    setIsSupported(notificationService.isSupported())
    setHasPermission(notificationService.hasPermission())
    setIsEnabled(notificationService.hasPermission())
  }, [])

  const handleRequestPermission = async () => {
    setIsRequesting(true)
    try {
      const granted = await notificationService.requestPermission()
      setHasPermission(granted)
      setIsEnabled(granted)

      if (granted) {
        await notificationService.showNotification("✅ Notificaciones activadas", {
          body: "Recibirás recordatorios de tus tareas",
        })
        notificationService.startMonitoring(getTasks)
      }
    } catch (error) {
      console.error("Error requesting permission:", error)
    } finally {
      setIsRequesting(false)
    }
  }

  const handleToggle = (checked: boolean) => {
    if (checked && !hasPermission) {
      handleRequestPermission()
      return
    }

    setIsEnabled(checked)
    if (checked) {
      notificationService.startMonitoring(getTasks)
    } else {
      notificationService.stopMonitoring()
    }
  }

  const handleTestNotification = async () => {
    if (!hasPermission) {
      await handleRequestPermission()
      return
    }

    await notificationService.showNotification("🔔 Notificación de prueba", {
      body: "¡Las notificaciones están funcionando correctamente!",
    })
  }

  if (!isSupported) {
    return (
      <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800">
        <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          Tu navegador no soporta notificaciones del sistema. Prueba con Chrome, Firefox o Edge.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
      {!hasPermission && (
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            Para recibir recordatorios de tareas, necesitas activar las notificaciones del navegador.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Label
            htmlFor="notifications-enabled"
            className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-white"
          >
            {isEnabled ? <Bell className="h-4 w-4 text-green-600" /> : <BellOff className="h-4 w-4 text-gray-400" />}
            Recordatorios de tareas
          </Label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {hasPermission
              ? "Recibirás notificaciones 15 minutos antes de cada tarea"
              : "Activa para recibir recordatorios"}
          </p>
        </div>
        <Switch id="notifications-enabled" checked={isEnabled} onCheckedChange={handleToggle} disabled={isRequesting} />
      </div>

      <div className="flex gap-2">
        {!hasPermission && (
          <Button
            onClick={handleRequestPermission}
            disabled={isRequesting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            {isRequesting ? "Solicitando..." : "Activar Notificaciones"}
          </Button>
        )}
        {hasPermission && (
          <Button
            onClick={handleTestNotification}
            variant="outline"
            className="flex-1 border-2 border-gray-300 dark:border-gray-600 bg-transparent"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Enviar Prueba
          </Button>
        )}
      </div>

      <div className="pt-2 space-y-2 border-t-2 border-gray-200 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Dispositivos compatibles:</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-600" />
            <span>Chrome Desktop</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-600" />
            <span>Firefox Desktop</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-600" />
            <span>Edge Desktop</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-600" />
            <span>Chrome Android</span>
          </div>
          <div className="flex items-center gap-1">
            <X className="h-3 w-3 text-gray-400" />
            <span>Safari iOS</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-600" />
            <span>Safari Desktop</span>
          </div>
        </div>
      </div>
    </div>
  )
}
