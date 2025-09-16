"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Plus, Check, Trash2, Edit, Star, Target } from "lucide-react"
import { checkAndAwardAchievements } from "@/lib/achievements"
import { AchievementNotification } from "@/components/achievement-notification"
import type { Achievement } from "@/lib/achievements"

interface WishlistItem {
  id: string
  text: string
  description?: string
  completed: boolean
  created_at: string
  updated_at: string
}

interface WishlistManagerProps {
  wishlistItems: WishlistItem[]
  onAddItem: (item: Omit<WishlistItem, "id" | "created_at" | "updated_at">) => void
  onUpdateItem: (id: string, updates: Partial<WishlistItem>) => void
  onDeleteItem: (id: string) => void
  theme: any
  t: (key: string) => string
  isPremium: boolean
  userId: string
}

export function WishlistManager({
  wishlistItems,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  theme,
  t,
  isPremium,
  userId,
}: WishlistManagerProps) {
  const [newItem, setNewItem] = useState({ text: "", description: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState({ text: "", description: "" })
  const [showAddForm, setShowAddForm] = useState(false)
  const [achievementNotification, setAchievementNotification] = useState<Achievement | null>(null)

  const handleAddItem = async () => {
    if (!newItem.text.trim()) return

    onAddItem({
      text: newItem.text.trim(),
      description: newItem.description.trim(),
      completed: false,
    })

    setNewItem({ text: "", description: "" })
    setShowAddForm(false)

    // Check for achievements
    try {
      const newAchievements = await checkAndAwardAchievements(userId, "wishlist_complete", 1)
      if (newAchievements.length > 0) {
        setAchievementNotification(newAchievements[0])
      }
    } catch (error) {
      console.error("Error checking achievements:", error)
    }
  }

  const handleCompleteItem = async (id: string) => {
    const item = wishlistItems.find((item) => item.id === id)
    if (!item) return

    onUpdateItem(id, { completed: !item.completed })

    // Check for achievements when completing an item
    if (!item.completed) {
      try {
        const newAchievements = await checkAndAwardAchievements(userId, "wishlist_complete", 1)
        if (newAchievements.length > 0) {
          setAchievementNotification(newAchievements[0])
        }
      } catch (error) {
        console.error("Error checking achievements:", error)
      }
    }
  }

  const handleEditItem = (item: WishlistItem) => {
    setEditingId(item.id)
    setEditingItem({ text: item.text, description: item.description || "" })
  }

  const handleSaveEdit = () => {
    if (!editingId || !editingItem.text.trim()) return

    onUpdateItem(editingId, {
      text: editingItem.text.trim(),
      description: editingItem.description.trim(),
    })

    setEditingId(null)
    setEditingItem({ text: "", description: "" })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingItem({ text: "", description: "" })
  }

  const completedCount = wishlistItems.filter((item) => item.completed).length
  const totalCount = wishlistItems.length
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  if (!isPremium) {
    return (
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
            <Heart className="h-5 w-5 text-red-400" />
            Lista de Deseos
          </CardTitle>
          <CardDescription className={theme.textSecondary}>
            Funcionalidad disponible solo para usuarios Premium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-red-400 mx-auto mb-4 opacity-50" />
            <p className={theme.textSecondary}>
              Actualiza a Premium para acceder a la lista de deseos y el sistema de logros
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Achievement Notification */}
      {achievementNotification && (
        <AchievementNotification
          achievement={achievementNotification}
          onClose={() => setAchievementNotification(null)}
        />
      )}

      {/* Progress Overview */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
            <Target className="h-5 w-5 text-purple-400" />
            Progreso de Objetivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={theme.textPrimary}>Objetivos Completados</span>
              <span className={theme.textSecondary}>
                {completedCount}/{totalCount}
              </span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{completedCount}</div>
                <div className="text-xs text-slate-400">Completados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{totalCount - completedCount}</div>
                <div className="text-xs text-slate-400">Pendientes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{Math.round(completionPercentage)}%</div>
                <div className="text-xs text-slate-400">Progreso</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wishlist Items */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
                <Heart className="h-5 w-5 text-red-400" />
                Lista de Deseos
              </CardTitle>
              <CardDescription className={theme.textSecondary}>
                Define y alcanza tus metas más importantes
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} className={theme.buttonPrimary} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Meta
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Item Form */}
          {showAddForm && (
            <Card className="bg-slate-900/50 border-slate-600">
              <CardContent className="p-4 space-y-4">
                <Input
                  placeholder="¿Cuál es tu meta?"
                  value={newItem.text}
                  onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
                  className={theme.inputBg}
                />
                <Textarea
                  placeholder="Describe tu meta (opcional)"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className={theme.inputBg}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddItem} className={theme.buttonPrimary} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddForm(false)
                      setNewItem({ text: "", description: "" })
                    }}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wishlist Items */}
          <div className="space-y-3">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-red-400 mx-auto mb-4 opacity-50" />
                <p className={theme.textSecondary}>No tienes metas en tu lista de deseos</p>
                <p className="text-sm text-slate-500 mt-2">Agrega tu primera meta para comenzar a desbloquear logros</p>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <Card
                  key={item.id}
                  className={`
                    transition-all duration-200 hover:scale-[1.02]
                    ${
                      item.completed
                        ? "bg-green-500/10 border-green-500/30 shadow-lg shadow-green-500/10"
                        : "bg-slate-800/50 border-slate-600 hover:border-slate-500"
                    }
                  `}
                >
                  <CardContent className="p-4">
                    {editingId === item.id ? (
                      <div className="space-y-3">
                        <Input
                          value={editingItem.text}
                          onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                          className={theme.inputBg}
                        />
                        <Textarea
                          value={editingItem.description}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          className={theme.inputBg}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button onClick={handleSaveEdit} size="sm" className={theme.buttonPrimary}>
                            Guardar
                          </Button>
                          <Button onClick={handleCancelEdit} variant="outline" size="sm">
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => handleCompleteItem(item.id)}
                            className={`
                              mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center
                              transition-all duration-200
                              ${
                                item.completed
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "border-slate-400 hover:border-green-400"
                              }
                            `}
                          >
                            {item.completed && <Check className="h-3 w-3" />}
                          </button>
                          <div className="flex-1">
                            <h3
                              className={`
                              font-medium transition-all duration-200
                              ${item.completed ? "line-through text-slate-400" : theme.textPrimary}
                            `}
                            >
                              {item.text}
                            </h3>
                            {item.description && (
                              <p
                                className={`
                                text-sm mt-1 transition-all duration-200
                                ${item.completed ? "line-through text-slate-500" : theme.textSecondary}
                              `}
                              >
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="secondary"
                                className={
                                  item.completed ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                                }
                              >
                                {item.completed ? "Completado" : "En progreso"}
                              </Badge>
                              {item.completed && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-400" />
                                  <span className="text-xs text-yellow-400">+10 pts</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-3">
                          <Button
                            onClick={() => handleEditItem(item)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => onDeleteItem(item.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
