"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Edit, Trash2, Save, X, Search, Calendar } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { useLanguage } from "@/hooks/useLanguage"

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  userId: string
}

interface NotesManagerProps {
  userId: string
  isPremium?: boolean
}

export function NotesManager({ userId, isPremium = false }: NotesManagerProps) {
  const { resolvedTheme } = useTheme()
  const { t } = useLanguage()

  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  })

  // Load notes on mount
  useEffect(() => {
    const loadNotes = async () => {
      setIsLoading(true)
      try {
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Load from localStorage
        const savedNotes = localStorage.getItem(`notes_${userId}`)
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes))
        } else {
          // Create sample notes for demo
          const sampleNotes: Note[] = [
            {
              id: "1",
              title: "Ideas para el proyecto",
              content:
                "Implementar sistema de notificaciones push, mejorar la interfaz de usuario, agregar integración con calendario externo.",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              updatedAt: new Date(Date.now() - 86400000).toISOString(),
              userId,
            },
            {
              id: "2",
              title: "Lista de compras",
              content: "Leche, pan, huevos, frutas, verduras, arroz, pasta, aceite de oliva.",
              createdAt: new Date(Date.now() - 172800000).toISOString(),
              updatedAt: new Date(Date.now() - 172800000).toISOString(),
              userId,
            },
            {
              id: "3",
              title: "Objetivos del mes",
              content:
                "1. Completar el curso de React\n2. Hacer ejercicio 3 veces por semana\n3. Leer 2 libros\n4. Organizar el escritorio",
              createdAt: new Date(Date.now() - 259200000).toISOString(),
              updatedAt: new Date(Date.now() - 259200000).toISOString(),
              userId,
            },
          ]
          setNotes(sampleNotes)
          localStorage.setItem(`notes_${userId}`, JSON.stringify(sampleNotes))
        }
      } catch (error) {
        console.error("Error loading notes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isPremium) {
      loadNotes()
    } else {
      setIsLoading(false)
    }
  }, [userId, isPremium])

  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem(`notes_${userId}`, JSON.stringify(updatedNotes))
    setNotes(updatedNotes)
  }

  const handleCreateNote = () => {
    if (!formData.title.trim() || !formData.content.trim()) return

    const newNote: Note = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      content: formData.content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    }

    const updatedNotes = [newNote, ...notes]
    saveNotes(updatedNotes)
    setFormData({ title: "", content: "" })
    setShowForm(false)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
    })
    setShowForm(true)
  }

  const handleUpdateNote = () => {
    if (!editingNote || !formData.title.trim() || !formData.content.trim()) return

    const updatedNotes = notes.map((note) =>
      note.id === editingNote.id
        ? {
            ...note,
            title: formData.title.trim(),
            content: formData.content.trim(),
            updatedAt: new Date().toISOString(),
          }
        : note,
    )

    saveNotes(updatedNotes)
    setFormData({ title: "", content: "" })
    setShowForm(false)
    setEditingNote(null)
  }

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId)
    saveNotes(updatedNotes)
  }

  const handleCancelForm = () => {
    setFormData({ title: "", content: "" })
    setShowForm(false)
    setEditingNote(null)
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Show premium upgrade message for free users
  if (!isPremium) {
    return (
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Notas Premium</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Organiza tus ideas y pensamientos con nuestro sistema de notas avanzado
          </p>
          <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
            <FileText className="h-4 w-4 mr-2" />
            Actualizar a Premium
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Mis Notas
              </CardTitle>
              <CardDescription>Organiza tus ideas y pensamientos</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <FileText className="h-5 w-5 text-blue-500" />
              Mis Notas
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Organiza tus ideas y pensamientos
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {notes.length} notas
            </Badge>
            <Button onClick={() => setShowForm(true)} size="sm" className="bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-1" />
              Nueva Nota
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
          />
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <Card className="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-900 dark:text-white">
                  {editingNote ? "Editar Nota" : "Nueva Nota"}
                </h4>
                <Button variant="ghost" size="sm" onClick={handleCancelForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <Input
                  placeholder="Título de la nota..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"
                />
                <Textarea
                  placeholder="Escribe tu nota aquí..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{formData.content.length} caracteres</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancelForm}>
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={editingNote ? handleUpdateNote : handleCreateNote}
                      disabled={!formData.title.trim() || !formData.content.trim()}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {editingNote ? "Actualizar" : "Guardar"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes List */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-3 text-slate-400" />
            <p className="text-slate-500 dark:text-slate-400 mb-2">
              {searchTerm ? "No se encontraron notas" : "No tienes notas guardadas"}
            </p>
            {!searchTerm && (
              <Button variant="outline" onClick={() => setShowForm(true)} className="bg-transparent">
                <Plus className="h-4 w-4 mr-1" />
                Crear tu primera nota
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotes.map((note) => (
              <Card
                key={note.id}
                className="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2 truncate">{note.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3">
                        {note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(note.updatedAt)}
                        </span>
                        <span>{note.content.length} caracteres</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNote(note)}
                        className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
