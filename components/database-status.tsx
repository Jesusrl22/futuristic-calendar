"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import { getDatabaseStatus, testSupabaseConnection } from "@/lib/supabase"

interface DatabaseStatusProps {
  className?: string
}

export function DatabaseStatus({ className }: DatabaseStatusProps) {
  const [status, setStatus] = useState(getDatabaseStatus())
  const [connectionTest, setConnectionTest] = useState<boolean | null>(null)
  const [isTestingConnection, setIsTestingConnection] = useState(false)

  const testConnection = async () => {
    setIsTestingConnection(true)
    try {
      const result = await testSupabaseConnection()
      setConnectionTest(result)
    } catch (error) {
      setConnectionTest(false)
    } finally {
      setIsTestingConnection(false)
    }
  }

  useEffect(() => {
    // Test connection on mount if Supabase is available
    if (status.supabaseAvailable) {
      testConnection()
    }
  }, [status.supabaseAvailable])

  // Don't show if everything is working fine
  if (status.supabaseAvailable && connectionTest === true) {
    return null
  }

  const getStatusIcon = () => {
    if (status.supabaseAvailable && connectionTest === true) {
      return <CheckCircle className="h-5 w-5 text-green-400" />
    } else if (status.supabaseAvailable && connectionTest === false) {
      return <XCircle className="h-5 w-5 text-red-400" />
    } else if (!status.supabaseAvailable) {
      return <AlertCircle className="h-5 w-5 text-yellow-400" />
    }
    return <Database className="h-5 w-5 text-gray-400" />
  }

  const getStatusText = () => {
    if (!status.hasCredentials) {
      return "Credenciales de Supabase no configuradas"
    }
    if (!status.validUrl) {
      return "URL de Supabase inválida"
    }
    if (!status.clientInitialized) {
      return "Cliente de Supabase no inicializado"
    }
    if (status.initializationError) {
      return `Error: ${status.initializationError}`
    }
    if (connectionTest === false) {
      return "Error de conexión con Supabase"
    }
    if (connectionTest === null && status.supabaseAvailable) {
      return "Probando conexión..."
    }
    return "Usando almacenamiento local"
  }

  const getStatusColor = () => {
    if (status.supabaseAvailable && connectionTest === true) {
      return "border-green-500/30 bg-green-900/20"
    } else if (status.supabaseAvailable && connectionTest === false) {
      return "border-red-500/30 bg-red-900/20"
    } else if (!status.supabaseAvailable) {
      return "border-yellow-500/30 bg-yellow-900/20"
    }
    return "border-gray-500/30 bg-gray-900/20"
  }

  return (
    <Card className={`${getStatusColor()} backdrop-blur-xl ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-white flex items-center space-x-2">
          {getStatusIcon()}
          <span>Estado de la Base de Datos</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-gray-300">{getStatusText()}</p>

        {status.supabaseAvailable && (
          <Button
            size="sm"
            variant="outline"
            onClick={testConnection}
            disabled={isTestingConnection}
            className="w-full text-xs border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            {isTestingConnection ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Probando...
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3 mr-1" />
                Probar Conexión
              </>
            )}
          </Button>
        )}

        {!status.hasCredentials && (
          <div className="text-xs text-gray-400 space-y-1">
            <p>Para configurar Supabase:</p>
            <p>1. Crea un archivo .env.local</p>
            <p>2. Agrega NEXT_PUBLIC_SUPABASE_URL</p>
            <p>3. Agrega NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
          </div>
        )}

        <div className="text-xs text-gray-500">
          {status.supabaseAvailable
            ? connectionTest === true
              ? "✅ Conectado a Supabase"
              : connectionTest === false
                ? "❌ Error de conexión"
                : "🔄 Verificando conexión..."
            : "📱 Usando almacenamiento local"}
        </div>
      </CardContent>
    </Card>
  )
}
