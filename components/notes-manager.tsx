"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Edit2, Trash2, Save, X } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

interface NotesManagerProps {
  notes: Note[]
  onAddNote: (note: Omit<Note, "id" | "created_at" | "updated_at">) => void
  onUpdateNote: (id: string, updates: Partial<Note>) => void
  onDeleteNote: (id: string) => void
  theme: any
  t: (key: string) => string
  isPremium: boolean
}

export function NotesManager({ notes, onAddNote, onUpdateNote, onDeleteNote, theme, t, isPremium }: NotesManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    if (editingId) {
      onUpdateNote(editingId, {
        title: title.trim(),
        content: content.trim(),
      })
      setEditingId(null)
    } else {
      onAddNote({
        title: title.trim(),
        content: content.trim(),
      })
    }

    setTitle("")
    setContent("")
    setShowForm(false)
  }

  const handleEdit = (note: Note) => {
    setTitle(note.title)
    setContent(note.content)
    setEditingId(note.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setTitle("")
    setContent("")
    setEditingId(null)
    setShowForm(false)
  }

  if (!isPremium) {
    return (
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <CardTitle className={`${theme.textPrimary} flex items-center space-x-2`}>
            <FileText className="w-5 h-5 text-blue-400" />
            <span>{t("notes")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <FileText className={`w-12 h-12 mx-auto mb-4 ${theme.textMuted}`} />
          <p className={theme.textPrimary}>Función Premium</p>
          <p className={theme.textSecondary}>Actualiza a Premium para usar las notas</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border}`}>
      <CardHeader>
        <CardTitle className={`${theme.textPrimary} flex items-center justify-between`}>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>{t("notes")}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowForm(!showForm)} className={theme.textAccent}>
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-3 p-3 border rounded-lg border-blue-500/20">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la nota..."
              className={theme.inputBg}
              required
            />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenido de la nota..."
              className={theme.inputBg}
              rows={4}
            />
            <div className="flex space-x-2">
              <Button type="submit" size="sm" className={theme.buttonPrimary}>
                <Save className="w-3 h-3 mr-1" />
                {editingId ? "Actualizar" : "Guardar"}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                <X className="w-3 h-3 mr-1" />
                Cancelar
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className={`w-8 h-8 mx-auto mb-2 ${theme.textMuted}`} />
              <p className={theme.textSecondary}>No tienes notas guardadas</p>
              <p className={`text-xs ${theme.textMuted}`}>Crea tu primera nota para empezar</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`p-3 rounded-lg border ${theme.border} bg-black/10 hover:bg-black/20 transition-colors`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className={`font-medium ${theme.textPrimary}`}>{note.title}</h4>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(note)}
                      className={`p-1 h-auto ${theme.textMuted}`}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteNote(note.id)}
                      className={`p-1 h-auto ${theme.textMuted} hover:text-red-400`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {note.content && (
                  <p className={`text-sm ${theme.textSecondary} whitespace-pre-wrap`}>
                    {note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content}
                  </p>
                )}

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-600/20">
                  <Badge variant="outline" className="text-xs">
                    {new Date(note.updated_at).toLocaleDateString("es-ES")}
                  </Badge>
                  <span className={`text-xs ${theme.textMuted}`}>{note.content.length} caracteres</span>
                </div>
              </div>
            ))
          )}
        </div>

        {notes.length > 0 && (
          <div className={`text-xs ${theme.textMuted} text-center pt-2 border-t ${theme.border}`}>
            {notes.length} {notes.length === 1 ? "nota guardada" : "notas guardadas"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
