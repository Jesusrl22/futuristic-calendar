"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, RefreshCw, Database, HardDrive } from "lucide-react"
import { db } from "@/lib/hybrid-database"

export function DatabaseStatus() {
  const [isOnline, setIsOnline] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkStatus = () => {
      setIsOnline(db.getConnectionStatus())
    }

    checkStatus()
    const interval = setInterval(checkStatus, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleForceSync = async () => {
    setIsLoading(true)
    try {
      await db.forceSync()
      setIsOnline(db.getConnectionStatus())
    } catch (error) {
      console.error("Error during force sync:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Estado de la Base de Datos
        </CardTitle>
        <CardDescription>Sistema híbrido con sincronización automática</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Supabase</span>
              </>
            ) : (
              <>
                <HardDrive className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Local Storage</span>
              </>
            )}
          </div>
          <Badge variant={isOnline ? "default" : "secondary"}>{isOnline ? "🟢 Online" : "🔴 Offline"}</Badge>
        </div>

        <div className="text-xs text-muted-foreground">
          {isOnline
            ? "Conectado a Supabase. Los datos se sincronizan automáticamente."
            : "Usando almacenamiento local. Los datos se sincronizarán cuando haya conexión."}
        </div>

        <Button
          onClick={handleForceSync}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="w-full bg-transparent"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Forzar Sincronización
            </>
          )}
        </Button>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Supabase</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Local</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
