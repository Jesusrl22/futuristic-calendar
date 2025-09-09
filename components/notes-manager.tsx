"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit2, Trash2, Save, X } from "lucide-react"

interface Note {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

interface NotesManagerProps {
  notes: Note[]
  onAddNote: (title: string, content: string) => void
  onUpdateNote: (id: string, title: string, content: string) => void
  onDeleteNote: (id: string) => void
  theme: any
  t: (key: string) => string
}

export function NotesManager({ notes, onAddNote, onUpdateNote, onDeleteNote, theme, t }: NotesManagerProps) {
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  const handleAddNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return
    onAddNote(newNoteTitle, newNoteContent)
    setNewNoteTitle("")
    setNewNoteContent("")
  }

  const handleEditNote = (note: Note) => {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const handleSaveEdit = () => {
    if (!editingId || !editTitle.trim() || !editContent.trim()) return
    onUpdateNote(editingId, editTitle, editContent)
    setEditingId(null)
    setEditTitle("")
    setEditContent("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
    setEditContent("")
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border}`}>
      <CardHeader>
        <CardTitle className={theme.textPrimary}>📝 {t("notes")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new note form */}
        <div className="space-y-2">
          <Input
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            placeholder="Título de la nota..."
            className={`${theme.inputBg} ${theme.placeholder}`}
          />
          <Textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Contenido de la nota..."
            className={`${theme.inputBg} ${theme.placeholder} min-h-[80px] resize-none`}
            rows={3}
          />
          <Button onClick={handleAddNote} className={`w-full ${theme.buttonPrimary}`}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Nota
          </Button>
        </div>

        {/* Notes list */}
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className={`p-3 rounded-lg border ${theme.border}`}>
              {editingId === note.id ? (
                <div className="space-y-2">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className={theme.inputBg}
                    placeholder="Título..."
                  />
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className={`${theme.inputBg} min-h-[80px] resize-none`}
                    rows={3}
                    placeholder="Contenido..."
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSaveEdit} className={theme.buttonPrimary}>
                      <Save className="w-3 h-3 mr-1" />
                      Guardar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit} className={theme.textSecondary}>
                      <X className="w-3 h-3 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold ${theme.textPrimary}`}>{note.title}</h3>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNote(note)}
                        className={theme.textSecondary}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDeleteNote(note.id)} className="text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className={`text-sm ${theme.textSecondary} whitespace-pre-wrap`}>{note.content}</p>
                  <p className={`text-xs ${theme.textMuted} mt-2`}>{new Date(note.updated_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          ))}

          {notes.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📝</div>
              <p className={theme.textPrimary}>No tienes notas aún</p>
              <p className={theme.textSecondary}>¡Agrega tu primera nota!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
