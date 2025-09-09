"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Check, X, Edit2, Trash2 } from "lucide-react"

interface WishlistItem {
  id: string
  user_id: string
  text: string
  description?: string
  completed: boolean
  created_at: string
  updated_at: string
}

interface WishlistManagerProps {
  items: WishlistItem[]
  onAddItem: (text: string, description: string) => void
  onToggleItem: (id: string) => void
  onUpdateItem: (id: string, text: string, description: string) => void
  onDeleteItem: (id: string) => void
  theme: any
  t: (key: string) => string
}

export function WishlistManager({
  items,
  onAddItem,
  onToggleItem,
  onUpdateItem,
  onDeleteItem,
  theme,
  t,
}: WishlistManagerProps) {
  const [newItemText, setNewItemText] = useState("")
  const [newItemDescription, setNewItemDescription] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const handleAddItem = () => {
    if (!newItemText.trim()) return
    onAddItem(newItemText, newItemDescription)
    setNewItemText("")
    setNewItemDescription("")
  }

  const handleEditItem = (item: WishlistItem) => {
    setEditingId(item.id)
    setEditText(item.text)
    setEditDescription(item.description || "")
  }

  const handleSaveEdit = () => {
    if (!editingId || !editText.trim()) return
    onUpdateItem(editingId, editText, editDescription)
    setEditingId(null)
    setEditText("")
    setEditDescription("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText("")
    setEditDescription("")
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border}`}>
      <CardHeader>
        <CardTitle className={theme.textPrimary}>⭐ {t("wishlist")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new item form */}
        <div className="space-y-2">
          <Input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Nuevo objetivo..."
            className={`${theme.inputBg} ${theme.placeholder}`}
          />
          <Textarea
            value={newItemDescription}
            onChange={(e) => setNewItemDescription(e.target.value)}
            placeholder="Descripción (opcional)..."
            className={`${theme.inputBg} ${theme.placeholder} min-h-[60px] resize-none`}
            rows={2}
          />
          <Button onClick={handleAddItem} className={`w-full ${theme.buttonPrimary}`}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Objetivo
          </Button>
        </div>

        {/* Items list */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border ${theme.border} ${item.completed ? "opacity-60" : ""}`}
            >
              {editingId === item.id ? (
                <div className="space-y-2">
                  <Input value={editText} onChange={(e) => setEditText(e.target.value)} className={theme.inputBg} />
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className={`${theme.inputBg} min-h-[60px] resize-none`}
                    rows={2}
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSaveEdit} className={theme.buttonPrimary}>
                      <Check className="w-3 h-3 mr-1" />
                      Guardar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit} className={theme.textSecondary}>
                      <X className="w-3 h-3 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleItem(item.id)}
                      className={item.completed ? "text-green-400" : theme.textSecondary}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <div className="flex-1">
                      <p className={`${theme.textPrimary} ${item.completed ? "line-through" : ""}`}>{item.text}</p>
                      {item.description && <p className={`text-sm ${theme.textSecondary} mt-1`}>{item.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditItem(item)}
                      className={theme.textSecondary}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteItem(item.id)} className="text-red-400">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">⭐</div>
              <p className={theme.textPrimary}>No tienes objetivos aún</p>
              <p className={theme.textSecondary}>¡Agrega tu primer objetivo!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
