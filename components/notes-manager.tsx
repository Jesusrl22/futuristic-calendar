"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Search,
  Tag,
  Calendar,
  Crown,
  Lock,
  FileText,
  Lightbulb,
  Heart,
} from "lucide-react"
import { hybridDb, type Note } from "@/lib/hybrid-database"
import { isPremiumOrPro } from "@/lib/subscription"

interface NotesManagerProps {
  userId: string
  userPlan: string
  onUpgrade: () => void
}

const NOTE_COLORS = [
  {
    id: "yellow",
    name: "Amarillo",
    class:
      "bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200",
  },
  {
    id: "blue",
    name: "Azul",
    class: "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200",
  },
  {
    id: "green",
    name: "Verde",
    class: "bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200",
  },
  {
    id: "purple",
    name: "Púrpura",
    class:
      "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-200",
  },
  {
    id: "pink",
    name: "Rosa",
    class: "bg-pink-100 border-pink-300 text-pink-800 dark:bg-pink-900 dark:border-pink-700 dark:text-pink-200",
  },
  {
    id: "gray",
    name: "Gris",
    class: "bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200",
  },
]

export function NotesManager({ userId, userPlan, onUpgrade }: NotesManagerProps) {
  const isPremium = isPremiumOrPro(userPlan)
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTag, setFilterTag] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    color: "yellow",
  })

  useEffect(() => {
    console.log("📝 NotesManager - User Plan:", userPlan, "isPremium:", isPremium)
    if (isPremium) {
      loadNotes()
    } else {
      setIsLoading(false)
    }
  }, [userId, isPremium, userPlan])

  const loadNotes = async () => {
    try {
      setIsLoading(true)
      const userNotes = await hybridDb.getNotes(userId)
      setNotes(userNotes)
    } catch (error) {
      console.error("Error loading notes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isPremium) {
      onUpgrade()
      return
    }

    try {
      const noteData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      if (editingNote) {
        await hybridDb.updateNote(editingNote.id, noteData)
      } else {
        await hybridDb.createNote({ user_id: userId, ...noteData })
      }
      await loadNotes()
      handleCloseForm()
    } catch (error) {
      console.error("Error saving note:", error)
    }
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      tags: Array.isArray(note.tags) ? note.tags.join(", ") : "",
      color: note.color || "yellow",
    })
    setShowForm(true)
  }

  const handleDelete = async (noteId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
      try {
        await hybridDb.deleteNote(noteId)
        await loadNotes()
      } catch (error) {
        console.error("Error deleting note:", error)
      }
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingNote(null)
    setFormData({
      title: "",
      content: "",
      tags: "",
      color: "yellow",
    })
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTag =
      filterTag === "all" ||
      (Array.isArray(note.tags) && note.tags.some((tag) => tag.toLowerCase().includes(filterTag.toLowerCase())))

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "recent" && new Date(note.updated_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000)

    return matchesSearch && matchesTag && matchesTab
  })

  const allTags = Array.from(
    new Set(
      notes
        .flatMap((note) => (Array.isArray(note.tags) ? note.tags : []))
        .filter(Boolean)
        .map((tag) => tag.toLowerCase()),
    ),
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando notas...</p>
        </div>
      </div>
    )
  }

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Notas Avanzadas
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Función Premium</p>
          </div>
        </div>

        <Card className="border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <CardContent className="pt-12 pb-12">
            <div className="text-center max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Notas Avanzadas Premium</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Organiza tus ideas con nuestro sistema avanzado de notas con etiquetas y colores
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Notas ilimitadas con formato avanzado</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Tag className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Sistema de etiquetas para organización</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Colores personalizables para categorización</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Búsqueda avanzada y filtros inteligentes</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={onUpgrade}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Actualizar a Premium o Pro
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400">Desde €2.49/mes • Cancela cuando quieras</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Notas Avanzadas
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {notes.length} notas ({userPlan === "pro" ? "Pro" : "Premium"})
            </p>
          </div>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Nota
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                {editingNote ? "Editar Nota" : "Nueva Nota"}
              </DialogTitle>
              <DialogDescription>
                {editingNote ? "Modifica tu nota existente" : "Crea una nueva nota con etiquetas y colores"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título de tu nota..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenido *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escribe el contenido de tu nota aquí..."
                  rows={8}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="trabajo, personal, ideas..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {NOTE_COLORS.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.id })}
                        className={`w-8 h-8 rounded-full border-2 ${color.class} ${
                          formData.color === color.id ? "ring-2 ring-offset-2 ring-blue-500" : ""
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseForm}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {editingNote ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-300/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Notas</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{notes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-300/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Etiquetas</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{allTags.length}</p>
              </div>
              <Tag className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500/10 to-red-500/10 border-pink-300/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Esta Semana</p>
                <p className="text-2xl font-bold text-pink-700 dark:text-pink-300">
                  {
                    notes.filter((note) => new Date(note.updated_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000)
                      .length
                  }
                </p>
              </div>
              <Calendar className="h-8 w-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-300/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Favoritas</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {notes.filter((note) => note.color === "yellow").length}
                </p>
              </div>
              <Heart className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Todas ({notes.length})
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Recientes (
            {notes.filter((note) => new Date(note.updated_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length})
          </TabsTrigger>
        </TabsList>

        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar notas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterTag === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterTag("all")}
                  className="bg-transparent"
                >
                  Todas
                </Button>
                {allTags.slice(0, 5).map((tag) => (
                  <Button
                    key={tag}
                    variant={filterTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterTag(tag)}
                    className="bg-transparent"
                  >
                    #{tag}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {searchTerm || filterTag !== "all" ? "No se encontraron notas" : "No tienes notas aún"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm || filterTag !== "all"
                      ? "Intenta ajustar los filtros de búsqueda"
                      : "Comienza creando tu primera nota"}
                  </p>
                  {!searchTerm && filterTag === "all" && (
                    <Button
                      onClick={() => setShowForm(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primera Nota
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => {
                const colorClass = NOTE_COLORS.find((c) => c.id === note.color)?.class || NOTE_COLORS[0].class
                return (
                  <Card key={note.id} className={`hover:shadow-xl transition-all duration-300 border-2 ${colorClass}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-2 flex-1">{note.title}</CardTitle>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(note)}
                            className="hover:bg-blue-100 dark:hover:bg-blue-900"
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(note.id)}
                            className="hover:bg-red-100 dark:hover:bg-red-900"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-4 text-sm leading-relaxed">
                        {note.content}
                      </p>

                      {Array.isArray(note.tags) && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                        Actualizada el {new Date(note.updated_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
