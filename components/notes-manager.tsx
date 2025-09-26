"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { FileText, Plus, Search, Pin, Trash2, Edit, Crown, Lock, Calendar, Hash, Palette } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  color: string
  pinned: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

interface NotesManagerProps {
  userId: string
  isPremium: boolean
  onUpgrade: () => void
}

export function NotesManager({ userId, isPremium, onUpgrade }: NotesManagerProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTag, setFilterTag] = useState<string>("all")
  const [filterColor, setFilterColor] = useState<string>("all")

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    color: "blue",
    pinned: false,
  })

  const colors = [
    { id: "blue", name: "Azul", class: "bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700" },
    { id: "green", name: "Verde", class: "bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700" },
    {
      id: "yellow",
      name: "Amarillo",
      class: "bg-yellow-100 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700",
    },
    { id: "red", name: "Rojo", class: "bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700" },
    {
      id: "purple",
      name: "Morado",
      class: "bg-purple-100 border-purple-300 dark:bg-purple-900 dark:border-purple-700",
    },
    { id: "pink", name: "Rosa", class: "bg-pink-100 border-pink-300 dark:bg-pink-900 dark:border-pink-700" },
    { id: "gray", name: "Gris", class: "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600" },
  ]

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${userId}`)
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes))
      } catch (error) {
        console.error("Error loading notes:", error)
      }
    }
  }, [userId])

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem(`notes_${userId}`, JSON.stringify(notes))
  }, [notes, userId])

  const handleAddNote = () => {
    if (!isPremium) {
      onUpgrade()
      return
    }

    if (!formData.title.trim()) return

    const newNote: Note = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      color: formData.color,
      pinned: formData.pinned,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    }

    setNotes((prev) => [newNote, ...prev])
    resetForm()
  }

  const handleEditNote = () => {
    if (!editingNote) return

    const updatedNote: Note = {
      ...editingNote,
      title: formData.title,
      content: formData.content,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      color: formData.color,
      pinned: formData.pinned,
      updatedAt: new Date().toISOString(),
    }

    setNotes((prev) => prev.map((note) => (note.id === editingNote.id ? updatedNote : note)))
    resetForm()
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
  }

  const handleTogglePin = (noteId: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() } : note,
      ),
    )
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      tags: "",
      color: "blue",
      pinned: false,
    })
    setEditingNote(null)
    setShowForm(false)
  }

  const openEditForm = (note: Note) => {
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags.join(", "),
      color: note.color,
      pinned: note.pinned,
    })
    setEditingNote(note)
    setShowForm(true)
  }

  const getColorClass = (colorId: string) => {
    const color = colors.find((c) => c.id === colorId)
    return color?.class || colors[0].class
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTag = filterTag === "all" || note.tags.includes(filterTag)
    const matchesColor = filterColor === "all" || note.color === filterColor

    return matchesSearch && matchesTag && matchesColor
  })

  // Sort notes: pinned first, then by updated date
  const sortedNotes = filteredNotes.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  const stats = {
    total: notes.length,
    pinned: notes.filter((note) => note.pinned).length,
    tags: [...new Set(notes.flatMap((note) => note.tags))].length,
    colors: [...new Set(notes.map((note) => note.color))].length,
  }

  const allTags = [...new Set(notes.flatMap((note) => note.tags))]

  if (!isPremium) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Función Premium</h3>
          <p className="text-gray-600 mb-4">El gestor de notas está disponible para usuarios Premium y Pro</p>
          <Button onClick={onUpgrade} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Crown className="w-4 h-4 mr-2" />
            Actualizar a Premium
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Gestor de Notas</h2>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Nota
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Notas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Pin className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pinned}</p>
                <p className="text-sm text-gray-600">Fijadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Hash className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.tags}</p>
                <p className="text-sm text-gray-600">Etiquetas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.colors}</p>
                <p className="text-sm text-gray-600">Colores</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar notas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger>
                <SelectValue placeholder="Etiqueta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    #{tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterColor} onValueChange={setFilterColor}>
              <SelectTrigger>
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {colors.map((color) => (
                  <SelectItem key={color.id} value={color.id}>
                    {color.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay notas que coincidan con los filtros</p>
            </CardContent>
          </Card>
        ) : (
          sortedNotes.map((note) => (
            <Card
              key={note.id}
              className={`${getColorClass(note.color)} border-2 hover:shadow-lg transition-shadow relative`}
            >
              {note.pinned && <Pin className="absolute top-2 right-2 w-4 h-4 text-yellow-600 fill-current" />}

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg pr-6">{note.title}</h3>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePin(note.id)}
                        className={note.pinned ? "text-yellow-600" : "text-gray-400"}
                      >
                        <Pin className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditForm(note)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {note.content && (
                    <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content}
                    </div>
                  )}

                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 flex items-center justify-between">
                    <span>
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                    {note.pinned && (
                      <Badge variant="outline" className="text-xs">
                        Fijada
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingNote ? "Editar Nota" : "Nueva Nota"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Título de la nota"
              />
            </div>

            <div>
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Escribe tu nota aquí..."
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder="trabajo, personal, importante"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color">Color</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, color: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.id} value={color.id}>
                        {color.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={formData.pinned}
                  onChange={(e) => setFormData((prev) => ({ ...prev, pinned: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="pinned" className="flex items-center space-x-1">
                  <Pin className="w-4 h-4" />
                  <span>Fijar nota</span>
                </Label>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={editingNote ? handleEditNote : handleAddNote}
                className="flex-1"
                disabled={!formData.title.trim()}
              >
                {editingNote ? "Actualizar" : "Crear"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
