"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, Wifi, WifiOff, RefreshCw, AlertTriangle } from "lucide-react"
import { getDatabaseStatus, testSupabaseConnection } from "@/lib/supabase"

interface DatabaseStatusProps {
  className?: string
}

export function DatabaseStatus({ className }: DatabaseStatusProps) {
  const [status, setStatus] = useState({
    supabaseAvailable: false,
    hasCredentials: false,
    clientInitialized: false,
    validUrl: false,
    initializationError: null as string | null,
  })
  const [connectionTested, setConnectionTested] = useState(false)
  const [connectionWorks, setConnectionWorks] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkStatus = async () => {
    setIsLoading(true)
    try {
      const dbStatus = getDatabaseStatus()
      setStatus(dbStatus)

      // Test actual connection if client is initialized
      if (dbStatus.clientInitialized) {
        const works = await testSupabaseConnection()
        setConnectionWorks(works)
        setConnectionTested(true)
      } else {
        setConnectionTested(false)
        setConnectionWorks(false)
      }
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
    if (connectionTested && connectionWorks) return "bg-green-500"
    if (status.clientInitialized && !connectionTested) return "bg-yellow-500"
    if (status.hasCredentials) return "bg-orange-500"
    return "bg-red-500"
  }

  const getStatusText = () => {
    if (connectionTested && connectionWorks) return "Conectado a Supabase"
    if (status.clientInitialized && !connectionTested) return "Cliente inicializado"
    if (status.hasCredentials && !status.clientInitialized) return "Error de inicialización"
    if (status.hasCredentials) return "Credenciales configuradas"
    return "Solo localStorage"
  }

  const getStatusIcon = () => {
    if (connectionTested && connectionWorks) return <Wifi className="w-4 h-4" />
    if (status.initializationError) return <AlertTriangle className="w-4 h-4" />
    return <WifiOff className="w-4 h-4" />
  }

  const getBadgeText = () => {
    if (connectionTested && connectionWorks) return "Online"
    if (status.clientInitialized) return "Inicializado"
    if (status.hasCredentials) return "Error"
    return "Offline"
  }

  // Solo mostrar si hay problemas o en desarrollo
  if (process.env.NODE_ENV === "production" && connectionTested && connectionWorks) {
    return null
  }

  return (
    <Card className={`bg-black/20 backdrop-blur-xl border-purple-500/20 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center space-x-2 text-white">
          <Database className="w-4 h-4" />
          <span>Estado de la Base de Datos</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm text-gray-300">{getStatusText()}</span>
          </div>
          <Badge className={`${getStatusColor()} text-white`}>{getBadgeText()}</Badge>
        </div>

        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Supabase URL:</span>
            <span>{status.hasCredentials ? "✅ Configurada" : "❌ Falta"}</span>
          </div>
          <div className="flex justify-between">
            <span>URL válida:</span>
            <span>{status.validUrl ? "✅ Sí" : "❌ No"}</span>
          </div>
          <div className="flex justify-between">
            <span>Cliente inicializado:</span>
            <span>{status.clientInitialized ? "✅ Sí" : "❌ No"}</span>
          </div>
          <div className="flex justify-between">
            <span>Conexión probada:</span>
            <span>{connectionTested ? (connectionWorks ? "✅ Funciona" : "❌ Falla") : "⏳ Pendiente"}</span>
          </div>
          <div className="flex justify-between">
            <span>Sincronización:</span>
            <span>{connectionWorks ? "✅ Activa" : "❌ Solo local"}</span>
          </div>
        </div>

        {status.initializationError && (
          <div className="p-2 bg-red-900/20 border border-red-500/30 rounded text-xs">
            <p className="font-medium text-red-300">❌ Error de inicialización</p>
            <p className="text-red-400">{status.initializationError}</p>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={checkStatus}
          disabled={isLoading}
          className="w-full bg-transparent border-white/20 text-gray-300 hover:bg-white/10"
        >
          {isLoading ? <RefreshCw className="w-3 h-3 animate-spin mr-2" /> : <RefreshCw className="w-3 h-3 mr-2" />}
          {isLoading ? "Probando..." : "Probar Conexión"}
        </Button>

        {!connectionWorks && (
          <div className="p-2 bg-yellow-900/20 border border-yellow-500/30 rounded text-xs">
            <p className="font-medium text-yellow-300">⚠️ Sin sincronización</p>
            <p className="text-yellow-400">
              {status.hasCredentials
                ? "Verifica que las credenciales de Supabase sean correctas y que las tablas estén creadas."
                : "Para sincronizar entre dispositivos, configura las variables de entorno de Supabase."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
