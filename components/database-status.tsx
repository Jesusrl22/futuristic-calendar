"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, Wifi, WifiOff, RefreshCw } from "lucide-react"
import { getDatabaseStatus } from "@/lib/supabase"

interface DatabaseStatusProps {
  className?: string
}

export function DatabaseStatus({ className }: DatabaseStatusProps) {
  const [status, setStatus] = useState({
    supabaseAvailable: false,
    hasCredentials: false,
    clientInitialized: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  const checkStatus = () => {
    setIsLoading(true)
    try {
      const dbStatus = getDatabaseStatus()
      setStatus(dbStatus)
    } catch (error) {
      console.error("Error checking database status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const getStatusColor = () => {
    if (status.supabaseAvailable) return "bg-green-500"
    if (status.hasCredentials) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getStatusText = () => {
    if (status.supabaseAvailable) return "Conectado a Supabase"
    if (status.hasCredentials) return "Credenciales configuradas"
    return "Solo localStorage"
  }

  const getStatusIcon = () => {
    if (status.supabaseAvailable) return <Wifi className="w-4 h-4" />
    return <WifiOff className="w-4 h-4" />
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center space-x-2">
          <Database className="w-4 h-4" />
          <span>Estado de la Base de Datos</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm">{getStatusText()}</span>
          </div>
          <Badge className={getStatusColor()}>{status.supabaseAvailable ? "Online" : "Offline"}</Badge>
        </div>

        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Supabase URL:</span>
            <span>{status.hasCredentials ? "✅ Configurada" : "❌ Falta"}</span>
          </div>
          <div className="flex justify-between">
            <span>Cliente inicializado:</span>
            <span>{status.clientInitialized ? "✅ Sí" : "❌ No"}</span>
          </div>
          <div className="flex justify-between">
            <span>Sincronización:</span>
            <span>{status.supabaseAvailable ? "✅ Activa" : "❌ Solo local"}</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={checkStatus}
          disabled={isLoading}
          className="w-full bg-transparent"
        >
          {isLoading ? <RefreshCw className="w-3 h-3 animate-spin mr-2" /> : <RefreshCw className="w-3 h-3 mr-2" />}
          Actualizar Estado
        </Button>

        {!status.supabaseAvailable && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <p className="font-medium text-yellow-800">⚠️ Sin sincronización</p>
            <p className="text-yellow-700">
              Los datos solo se guardan localmente. Para sincronizar entre dispositivos, configura Supabase.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
