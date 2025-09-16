"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface DatabaseStatusProps {
  theme: any
}

export function DatabaseStatus({ theme }: DatabaseStatusProps) {
  const [status, setStatus] = useState<"connected" | "disconnected" | "checking">("checking")
  const [lastCheck, setLastCheck] = useState<Date>(new Date())

  useEffect(() => {
    const checkStatus = () => {
      // Simulate database check
      setTimeout(() => {
        setStatus("connected")
        setLastCheck(new Date())
      }, 1000)
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "disconnected":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case "checking":
        return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "disconnected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "checking":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Conectado"
      case "disconnected":
        return "Desconectado"
      case "checking":
        return "Verificando..."
    }
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border}`}>
      <CardHeader>
        <CardTitle className={`${theme.textPrimary} text-sm flex items-center gap-2`}>
          <Database className="h-4 w-4 text-blue-400" />
          Estado de la Base de Datos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge variant="secondary" className={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </div>
          <span className="text-xs text-slate-500">Última verificación: {lastCheck.toLocaleTimeString()}</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {status === "connected"
            ? "Base de datos en memoria funcionando correctamente"
            : status === "disconnected"
              ? "Error de conexión con la base de datos"
              : "Verificando estado de la conexión..."}
        </p>
      </CardContent>
    </Card>
  )
}
