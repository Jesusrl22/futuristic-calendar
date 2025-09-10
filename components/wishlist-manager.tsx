"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, Plus, Check, Edit2, Trash2 } from "lucide-react"

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
}

export function WishlistManager({
  wishlistItems,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  theme,
  t,
  isPremium,
}: WishlistManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [text, setText] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    if (editingId) {
      onUpdateItem(editingId, {
        text: text.trim(),
        description: description.trim() || undefined,
      })
      setEditingId(null)
    } else {
      onAddItem({
        text: text.trim(),
        description: description.trim() || undefined,
        completed: false,
      })
    }

    setText("")
    setDescription("")
    setShowForm(false)
  }

  const handleEdit = (item: WishlistItem) => {
    setText(item.text)
    setDescription(item.description || "")
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setText("")
    setDescription("")
    setEditingId(null)
    setShowForm(false)
  }

  if (!isPremium) {
    return (
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <CardTitle className={`${theme.textPrimary} flex items-center space-x-2`}>
            <Heart className="w-5 h-5 text-pink-400" />
            <span>{t("wishlist")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Heart className={`w-12 h-12 mx-auto mb-4 ${theme.textMuted}`} />
          <p className={theme.textPrimary}>Función Premium</p>
          <p className={theme.textSecondary}>Actualiza a Premium para usar la lista de deseos</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border}`}>
      <CardHeader>
        <CardTitle className={`${theme.textPrimary} flex items-center justify-between`}>
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-pink-400" />
            <span>{t("wishlist")}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowForm(!showForm)} className={theme.textAccent}>
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-3 p-3 border rounded-lg border-pink-500/20">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Mi objetivo o deseo..."
              className={theme.inputBg}
              required
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción detallada (opcional)..."
              className={theme.inputBg}
              rows={2}
            />
            <div className="flex space-x-2">
              <Button type="submit" size="sm" className={theme.buttonPrimary}>
                {editingId ? "Actualizar" : "Agregar"}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-8">
              <Heart className={`w-8 h-8 mx-auto mb-2 ${theme.textMuted}`} />
              <p className={theme.textSecondary}>No hay objetivos en tu lista de deseos</p>
              <p className={`text-xs ${theme.textMuted}`}>Agrega tus metas y sueños aquí</p>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border ${theme.border} ${
                  item.completed ? "bg-green-500/10 border-green-500/20" : "bg-black/10"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateItem(item.id, { completed: !item.completed })}
                        className="p-0 h-auto"
                      >
                        {item.completed ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <div className="w-4 h-4 border border-gray-400 rounded" />
                        )}
                      </Button>
                      <h4 className={`font-medium ${item.completed ? theme.textMuted : theme.textPrimary}`}>
                        {item.text}
                      </h4>
                      {item.completed && (
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          Completado
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className={`text-sm mt-1 ml-6 ${theme.textSecondary}`}>{item.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className={`p-1 h-auto ${theme.textMuted}`}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteItem(item.id)}
                      className={`p-1 h-auto ${theme.textMuted} hover:text-red-400`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {wishlistItems.length > 0 && (
          <div className={`text-xs ${theme.textMuted} text-center pt-2 border-t ${theme.border}`}>
            {wishlistItems.filter((item) => item.completed).length} de {wishlistItems.length} objetivos completados
          </div>
        )}
      </CardContent>
    </Card>
  )
}
