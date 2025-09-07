"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, Wifi, WifiOff, RefreshCw, AlertTriangle, Copy, ExternalLink } from "lucide-react"
import { getDatabaseStatus, testSupabaseConnection, getSupabaseUrlExamples } from "@/lib/supabase"

interface DatabaseStatusProps {
  className?: string
}

export function DatabaseStatus({ className }: DatabaseStatusProps) {
  const [status, setStatus] = useState({
    supabaseAvailable: false,
    hasCredentials: false,
    hasUrl: false,
    hasKey: false,
    clientInitialized: false,
    urlValidation: { valid: false, error: undefined as string | undefined },
    initializationError: null as string | null,
    currentUrl: undefined as string | undefined,
  })
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; error?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showHelp, setShowHelp] = useState(false)

  const checkStatus = async () => {
    setIsLoading(true)
    setConnectionResult(null)

    try {
      const dbStatus = getDatabaseStatus()
      setStatus(dbStatus)

      // Test actual connection if client is initialized
      if (dbStatus.clientInitialized) {
        const result = await testSupabaseConnection()
        setConnectionResult(result)
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
    if (connectionResult?.success) return "bg-green-500"
    if (status.clientInitialized && !connectionResult) return "bg-yellow-500"
    if (status.hasCredentials && !status.clientInitialized) return "bg-orange-500"
    return "bg-red-500"
  }

  const getStatusText = () => {
    if (connectionResult?.success) return "Conectado a Supabase"
    if (status.clientInitialized && !connectionResult) return "Cliente inicializado"
    if (status.initializationError) return "Error de configuración"
    if (status.hasCredentials) return "Credenciales incompletas"
    return "Sin configurar"
  }

  const getStatusIcon = () => {
    if (connectionResult?.success) return <Wifi className="w-4 h-4" />
    if (status.initializationError || !status.urlValidation.valid) return <AlertTriangle className="w-4 h-4" />
    return <WifiOff className="w-4 h-4" />
  }

  const getBadgeText = () => {
    if (connectionResult?.success) return "Online"
    if (status.clientInitialized) return "Inicializado"
    if (status.hasCredentials) return "Error"
    return "Offline"
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // Solo mostrar si hay problemas o en desarrollo
  if (process.env.NODE_ENV === "production" && connectionResult?.success) {
    return null
  }

  return (
    <Card className={`bg-black/20 backdrop-blur-xl border-purple-500/20 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>Estado de la Base de Datos</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelp(!showHelp)}
            className="text-gray-400 hover:text-white"
          >
            ?
          </Button>
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
            <span>{status.hasUrl ? "✅ Presente" : "❌ Falta"}</span>
          </div>
          <div className="flex justify-between">
            <span>URL válida:</span>
            <span>{status.urlValidation.valid ? "✅ Sí" : "❌ No"}</span>
          </div>
          <div className="flex justify-between">
            <span>Clave API:</span>
            <span>{status.hasKey ? "✅ Presente" : "❌ Falta"}</span>
          </div>
          <div className="flex justify-between">
            <span>Cliente inicializado:</span>
            <span>{status.clientInitialized ? "✅ Sí" : "❌ No"}</span>
          </div>
          {connectionResult && (
            <div className="flex justify-between">
              <span>Conexión:</span>
              <span>{connectionResult.success ? "✅ Funciona" : "❌ Falla"}</span>
            </div>
          )}
        </div>

        {/* Current URL Display */}
        {status.currentUrl && (
          <div className="p-2 bg-gray-900/50 border border-gray-600/30 rounded text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400">URL actual:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(status.currentUrl!)}
                className="h-4 w-4 p-0 text-gray-400 hover:text-white"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <code className="text-gray-300 break-all">{status.currentUrl}</code>
          </div>
        )}

        {/* Error Messages */}
        {status.urlValidation.error && (
          <div className="p-2 bg-red-900/20 border border-red-500/30 rounded text-xs">
            <p className="font-medium text-red-300">❌ Error de URL</p>
            <p className="text-red-400">{status.urlValidation.error}</p>
          </div>
        )}

        {status.initializationError && status.initializationError !== status.urlValidation.error && (
          <div className="p-2 bg-red-900/20 border border-red-500/30 rounded text-xs">
            <p className="font-medium text-red-300">❌ Error de inicialización</p>
            <p className="text-red-400">{status.initializationError}</p>
          </div>
        )}

        {connectionResult && !connectionResult.success && (
          <div className="p-2 bg-red-900/20 border border-red-500/30 rounded text-xs">
            <p className="font-medium text-red-300">❌ Error de conexión</p>
            <p className="text-red-400">{connectionResult.error}</p>
          </div>
        )}

        {/* Help Section */}
        {showHelp && (
          <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded text-xs space-y-2">
            <p className="font-medium text-blue-300">💡 Configuración de Supabase</p>

            <div>
              <p className="text-blue-400 mb-1">1. Crea un archivo .env.local con:</p>
              <div className="bg-black/30 p-2 rounded font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">NEXT_PUBLIC_SUPABASE_URL=</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("NEXT_PUBLIC_SUPABASE_URL=")}
                    className="h-4 w-4 p-0 text-gray-400 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">NEXT_PUBLIC_SUPABASE_ANON_KEY=</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("NEXT_PUBLIC_SUPABASE_ANON_KEY=")}
                    className="h-4 w-4 p-0 text-gray-400 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <p className="text-blue-400 mb-1">2. Ejemplos de URL válidas:</p>
              {getSupabaseUrlExamples().map((example, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-black/30 p-1 rounded font-mono text-gray-300"
                >
                  <span className="text-xs">{example}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(example)}
                    className="h-4 w-4 p-0 text-gray-400 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <ExternalLink className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400">Encuentra tus credenciales en tu dashboard de Supabase</span>
            </div>
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
          {isLoading ? "Verificando..." : "Verificar Estado"}
        </Button>

        {!connectionResult?.success && (
          <div className="p-2 bg-yellow-900/20 border border-yellow-500/30 rounded text-xs">
            <p className="font-medium text-yellow-300">⚠️ Modo sin conexión</p>
            <p className="text-yellow-400">
              {!status.hasCredentials
                ? "Configura las variables de entorno para habilitar la sincronización."
                : "Verifica tu configuración de Supabase y que las tablas estén creadas."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
