"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, DollarSign, Zap, ArrowLeft } from "lucide-react"
import { getAllUsers } from "@/lib/database"
import { getAICostStats } from "@/lib/ai-credits"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
  is_premium: boolean
  is_pro: boolean
  created_at: string
  ai_credits?: number
  ai_credits_used?: number
  ai_total_cost_eur?: number
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [aiStats, setAiStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const theme = {
    gradient: "from-slate-900 via-purple-900 to-slate-900",
    cardBg: "bg-black/20 backdrop-blur-xl",
    border: "border-purple-500/20",
    textPrimary: "text-white",
    textSecondary: "text-gray-300",
    textMuted: "text-gray-400",
    buttonPrimary: "bg-gradient-to-r from-purple-500 to-cyan-500 text-white",
    buttonSecondary: "bg-white/10 text-white border-white/20",
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersData, statsData] = await Promise.all([getAllUsers(), getAICostStats()])
      setUsers(usersData)
      setAiStats(statsData)
    } catch (error) {
      console.error("Error loading admin data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalUsers = users.length
  const premiumUsers = users.filter((u) => u.is_premium).length
  const proUsers = users.filter((u) => u.is_pro).length
  const freeUsers = totalUsers - premiumUsers

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <div className={`${theme.textPrimary} text-lg font-semibold`}>Cargando panel de administración...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient}`}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Panel de Administración
            </h1>
            <p className={`${theme.textSecondary} text-sm`}>Gestión y estadísticas de FutureTask</p>
          </div>
          <Link href="/">
            <Button variant="ghost" className={theme.textSecondary}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la app
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${theme.cardBg} ${theme.border}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${theme.textSecondary}`}>Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${theme.textPrimary}`}>{totalUsers}</div>
              <p className={`text-xs ${theme.textMuted}`}>usuarios registrados</p>
            </CardContent>
          </Card>

          <Card className={`${theme.cardBg} ${theme.border}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${theme.textSecondary}`}>Usuarios Premium</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${theme.textPrimary}`}>{premiumUsers}</div>
              <p className={`text-xs ${theme.textMuted}`}>
                {totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0}% del total
              </p>
            </CardContent>
          </Card>

          <Card className={`${theme.cardBg} ${theme.border}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${theme.textSecondary}`}>Usuarios Pro</CardTitle>
              <Zap className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${theme.textPrimary}`}>{proUsers}</div>
              <p className={`text-xs ${theme.textMuted}`}>
                {totalUsers > 0 ? Math.round((proUsers / totalUsers) * 100) : 0}% del total
              </p>
            </CardContent>
          </Card>

          <Card className={`${theme.cardBg} ${theme.border}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${theme.textSecondary}`}>Ingresos IA</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${theme.textPrimary}`}>
                €{aiStats?.totalCostEur?.toFixed(2) || "0.00"}
              </div>
              <p className={`text-xs ${theme.textMuted}`}>costo total IA</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Statistics */}
        {aiStats && (
          <Card className={`${theme.cardBg} ${theme.border}`}>
            <CardHeader>
              <CardTitle className={`${theme.textPrimary} flex items-center space-x-2`}>
                <Zap className="w-5 h-5 text-purple-400" />
                <span>Estadísticas de IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-xl font-bold ${theme.textPrimary}`}>{aiStats.totalRequests}</div>
                  <p className={`text-sm ${theme.textMuted}`}>Consultas totales</p>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${theme.textPrimary}`}>
                    {aiStats.totalTokens?.toLocaleString()}
                  </div>
                  <p className={`text-sm ${theme.textMuted}`}>Tokens usados</p>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${theme.textPrimary}`}>
                    €{aiStats.avgCostPerRequest?.toFixed(4)}
                  </div>
                  <p className={`text-sm ${theme.textMuted}`}>Costo por consulta</p>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${theme.textPrimary}`}>
                    €{aiStats.monthlyProjectedCost?.toFixed(2)}
                  </div>
                  <p className={`text-sm ${theme.textMuted}`}>Proyección mensual</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardHeader>
            <CardTitle className={`${theme.textPrimary} flex items-center space-x-2`}>
              <Users className="w-5 h-5 text-blue-400" />
              <span>Lista de Usuarios</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`p-3 rounded-lg border ${theme.border} bg-black/10 flex items-center justify-between`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${theme.textPrimary}`}>{user.name}</span>
                      {user.is_pro && (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Pro</Badge>
                      )}
                      {user.is_premium && !user.is_pro && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Premium</Badge>
                      )}
                    </div>
                    <p className={`text-sm ${theme.textSecondary}`}>{user.email}</p>
                    {user.is_pro && (
                      <p className={`text-xs ${theme.textMuted}`}>
                        Créditos IA: {user.ai_credits || 0} | Usados: {user.ai_credits_used || 0} | Costo: €
                        {(user.ai_total_cost_eur || 0).toFixed(4)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${theme.textMuted}`}>
                      {new Date(user.created_at).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
