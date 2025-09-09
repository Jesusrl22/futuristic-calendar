"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Check, Edit2, Trash2, Plus, Save, X } from "lucide-react"

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
  onToggleItem: (itemId: string) => void
  onUpdateItem: (itemId: string, text: string, description: string) => void
  onDeleteItem: (itemId: string) => void
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
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddItem = () => {
    if (newItemText.trim()) {
      onAddItem(newItemText.trim(), newItemDescription.trim())
      setNewItemText("")
      setNewItemDescription("")
      setShowAddForm(false)
    }
  }

  const handleEditItem = (item: WishlistItem) => {
    setEditingId(item.id)
    setEditText(item.text)
    setEditDescription(item.description || "")
  }

  const handleSaveEdit = () => {
    if (editingId && editText.trim()) {
      onUpdateItem(editingId, editText.trim(), editDescription.trim())
      setEditingId(null)
      setEditText("")
      setEditDescription("")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText("")
    setEditDescription("")
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`${theme.textPrimary} text-lg flex items-center space-x-2`}>
            <Star className="w-5 h-5 text-yellow-400" />
            <span>{t("wishlist")}</span>
          </CardTitle>
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)} className={`${theme.buttonPrimary} text-xs`}>
            <Plus className="w-3 h-3 mr-1" />
            Agregar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add Form */}
        {showAddForm && (
          <div className={`p-3 rounded-lg ${theme.cardBg} ${theme.border} space-y-2`}>
            <div className="space-y-1">
              <Label className={`${theme.textSecondary} text-xs`}>Objetivo</Label>
              <Input
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Nuevo objetivo..."
                className={`${theme.inputBg} text-sm`}
              />
            </div>
            <div className="space-y-1">
              <Label className={`${theme.textSecondary} text-xs`}>Descripción</Label>
              <Textarea
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Descripción opcional..."
                className={`${theme.inputBg} text-sm h-16 resize-none`}
              />
            </div>
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleAddItem} className={`${theme.buttonPrimary} text-xs`}>
                <Save className="w-3 h-3 mr-1" />
                Guardar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAddForm(false)}
                className={`${theme.textSecondary} text-xs`}
              >
                <X className="w-3 h-3 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg ${theme.cardBg} ${theme.border} ${item.completed ? "opacity-60" : ""}`}
            >
              {editingId === item.id ? (
                <div className="space-y-2">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className={`${theme.inputBg} text-sm`}
                  />
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className={`${theme.inputBg} text-sm h-16 resize-none`}
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSaveEdit} className={`${theme.buttonPrimary} text-xs`}>
                      <Save className="w-3 h-3 mr-1" />
                      Guardar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelEdit}
                      className={`${theme.textSecondary} text-xs`}
                    >
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
                      className={`${item.completed ? "text-green-400" : theme.textSecondary} p-1`}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <div className="flex-1">
                      <p className={`${theme.textPrimary} text-sm ${item.completed ? "line-through" : ""}`}>
                        {item.text}
                      </p>
                      {item.description && <p className={`${theme.textMuted} text-xs mt-1`}>{item.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditItem(item)}
                      className={`${theme.textSecondary} p-1`}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteItem(item.id)}
                      className="text-red-400 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-6">
              <Star className={`w-8 h-8 mx-auto mb-2 ${theme.textMuted}`} />
              <p className={`${theme.textPrimary} text-sm`}>No hay objetivos aún</p>
              <p className={`${theme.textSecondary} text-xs`}>¡Agrega tu primer objetivo!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
