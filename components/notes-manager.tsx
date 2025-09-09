"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileText, Edit2, Trash2, Plus, Save, X } from "lucide-react"

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
  onUpdateNote: (noteId: string, title: string, content: string) => void
  onDeleteNote: (noteId: string) => void
  theme: any
  t: (key: string) => string
}

export function NotesManager({ notes, onAddNote, onUpdateNote, onDeleteNote, theme, t }: NotesManagerProps) {
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddNote = () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      onAddNote(newNoteTitle.trim(), newNoteContent.trim())
      setNewNoteTitle("")
      setNewNoteContent("")
      setShowAddForm(false)
    }
  }

  const handleEditNote = (note: Note) => {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim() && editContent.trim()) {
      onUpdateNote(editingId, editTitle.trim(), editContent.trim())
      setEditingId(null)
      setEditTitle("")
      setEditContent("")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
    setEditContent("")
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`${theme.textPrimary} text-lg flex items-center space-x-2`}>
            <FileText className="w-5 h-5 text-blue-400" />
            <span>{t("notes")}</span>
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
              <Label className={`${theme.textSecondary} text-xs`}>Título</Label>
              <Input
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Título de la nota..."
                className={`${theme.inputBg} text-sm`}
              />
            </div>
            <div className="space-y-1">
              <Label className={`${theme.textSecondary} text-xs`}>Contenido</Label>
              <Textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Escribe tu nota aquí..."
                className={`${theme.inputBg} text-sm h-20 resize-none`}
              />
            </div>
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleAddNote} className={`${theme.buttonPrimary} text-xs`}>
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

        {/* Notes List */}
        <div className="space-y-2">
          {notes.map((note) => (
            <div key={note.id} className={`p-3 rounded-lg ${theme.cardBg} ${theme.border}`}>
              {editingId === note.id ? (
                <div className="space-y-2">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className={`${theme.inputBg} text-sm font-medium`}
                  />
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className={`${theme.inputBg} text-sm h-20 resize-none`}
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
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`${theme.textPrimary} text-sm font-medium`}>{note.title}</h4>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNote(note)}
                        className={`${theme.textSecondary} p-1`}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteNote(note.id)}
                        className="text-red-400 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className={`${theme.textSecondary} text-xs leading-relaxed`}>{note.content}</p>
                  <p className={`${theme.textMuted} text-xs mt-2`}>{new Date(note.updated_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          ))}

          {notes.length === 0 && (
            <div className="text-center py-6">
              <FileText className={`w-8 h-8 mx-auto mb-2 ${theme.textMuted}`} />
              <p className={`${theme.textPrimary} text-sm`}>No hay notas aún</p>
              <p className={`${theme.textSecondary} text-xs`}>¡Crea tu primera nota!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
