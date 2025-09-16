"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { isSupabaseAvailable } from "@/lib/supabase"

interface DatabaseStatusProps {
  theme: {
    cardBg: string
    border: string
    textPrimary: string
    textSecondary: string
  }
}

export function DatabaseStatus({ theme }: DatabaseStatusProps) {
  const [status, setStatus] = useState<"checking" | "connected" | "fallback">("checking")

  useEffect(() => {
    const checkStatus = () => {
      if (isSupabaseAvailable) {
        setStatus("connected")
      } else {
        setStatus("fallback")
      }
    }

    checkStatus()
  }, [])

  const getStatusInfo = () => {
    switch (status) {
      case "checking":
        return {
          icon: <AlertCircle className="h-4 w-4 text-yellow-400" />,
          text: "Verificando conexión...",
          badge: "Verificando",
          badgeColor: "bg-yellow-600",
        }
      case "connected":
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-400" />,
          text: "Conectado a Supabase",
          badge: "Conectado",
          badgeColor: "bg-green-600",
        }
      case "fallback":
        return {
          icon: <XCircle className="h-4 w-4 text-orange-400" />,
          text: "Usando datos locales (modo demo)",
          badge: "Modo Demo",
          badgeColor: "bg-orange-600",
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <Card className={`${theme.cardBg} ${theme.border}`}>
      <CardHeader>
        <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
          <Database className="h-5 w-5 text-blue-400" />
          Estado de la Base de Datos
          <Badge variant="secondary" className={`${statusInfo.badgeColor} text-white`}>
            {statusInfo.badge}
          </Badge>
        </CardTitle>
        <CardDescription className={theme.textSecondary}>
          Información sobre la conexión a la base de datos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          {statusInfo.icon}
          <span className={theme.textPrimary}>{statusInfo.text}</span>
        </div>
        {status === "fallback" && (
          <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <p className="text-sm text-orange-400">
              La aplicación funciona en modo demo con datos locales. Para usar la base de datos completa, configura las
              variables de entorno de Supabase.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
