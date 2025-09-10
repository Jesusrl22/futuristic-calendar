"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import { getDatabaseStatus, testSupabaseConnection } from "@/lib/supabase"

interface DatabaseStatusProps {
  theme: any
}

export function DatabaseStatus({ theme }: DatabaseStatusProps) {
  const [status, setStatus] = useState(getDatabaseStatus())
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const connected = await testSupabaseConnection()
      setIsConnected(connected)
    } catch (error) {
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="w-4 h-4 animate-spin" />
    if (isConnected === true) return <CheckCircle className="w-4 h-4 text-green-400" />
    if (isConnected === false) return <XCircle className="w-4 h-4 text-red-400" />
    return <AlertCircle className="w-4 h-4 text-yellow-400" />
  }

  const getStatusText = () => {
    if (isLoading) return "Probando conexión..."
    if (isConnected === true) return "Conectado"
    if (isConnected === false) return "Desconectado"
    return "Desconocido"
  }

  const getStatusColor = () => {
    if (isConnected === true) return "text-green-400"
    if (isConnected === false) return "text-red-400"
    return "text-yellow-400"
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border}`}>
      <CardHeader>
        <CardTitle className={`${theme.textPrimary} flex items-center space-x-2`}>
          <Database className="w-5 h-5" />
          <span>Estado de la Base de Datos</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`font-semibold ${getStatusColor()}`}>{getStatusText()}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={testConnection} disabled={isLoading} className={theme.textMuted}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={theme.textSecondary}>Supabase disponible:</span>
            <Badge variant={status.supabaseAvailable ? "default" : "destructive"}>
              {status.supabaseAvailable ? "Sí" : "No"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className={theme.textSecondary}>Credenciales:</span>
            <Badge variant={status.hasCredentials ? "default" : "destructive"}>
              {status.hasCredentials ? "Configuradas" : "Faltantes"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className={theme.textSecondary}>Cliente inicializado:</span>
            <Badge variant={status.clientInitialized ? "default" : "destructive"}>
              {status.clientInitialized ? "Sí" : "No"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className={theme.textSecondary}>URL válida:</span>
            <Badge variant={status.validUrl ? "default" : "destructive"}>{status.validUrl ? "Sí" : "No"}</Badge>
          </div>
        </div>

        {status.initializationError && (
          <div className={`p-3 rounded border border-red-500/20 bg-red-500/10`}>
            <p className={`text-sm text-red-400`}>Error: {status.initializationError}</p>
          </div>
        )}

        {!status.supabaseAvailable && (
          <div className={`p-3 rounded border border-yellow-500/20 bg-yellow-500/10`}>
            <p className={`text-sm ${theme.textPrimary}`}>
              💡 Configura las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
