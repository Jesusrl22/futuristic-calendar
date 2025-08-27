"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  MoreHorizontal,
  Star,
  Archive,
  Download,
  Upload,
  Eye,
  Heart,
  Copy,
  SortAsc,
  SortDesc,
  FileText,
  Clock,
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { es, enUS, fr, de, it } from "date-fns/locale"

interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isFavorite: boolean
  isArchived: boolean
  wordCount: number
  readingTime: number
  author: string
  isPublic: boolean
  views: number
  likes: number
}

interface NotesBlogProps {
  language: string
}

const noteCategories = [
  { id: "personal", name: "Personal", color: "bg-blue-500" },
  { id: "work", name: "Trabajo", color: "bg-green-500" },
  { id: "ideas", name: "Ideas", color: "bg-purple-500" },
  { id: "learning", name: "Aprendizaje", color: "bg-orange-500" },
  { id: "projects", name: "Proyectos", color: "bg-pink-500" },
  { id: "journal", name: "Diario", color: "bg-indigo-500" },
  { id: "recipes", name: "Recetas", color: "bg-yellow-500" },
  { id: "travel", name: "Viajes", color: "bg-teal-500" },
]

const locales = {
  es: es,
  en: enUS,
  fr: fr,
  de: de,
  it: it,
}

export function NotesBlog({ language = "es" }: NotesBlogProps) {
  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("notes-blog")
      if (saved) {
        try {
          return JSON.parse(saved).map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          }))
        } catch (error) {
          console.error("Error parsing saved notes:", error)
        }
      }
    }
    return []
  })

  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [noteCategory, setNoteCategory] = useState("personal")
  const [noteTags, setNoteTags] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"date" | "title" | "views" | "likes">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid")
  const [showArchived, setShowArchived] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const locale = locales[language as keyof typeof locales] || locales.es

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("notes-blog", JSON.stringify(notes))
    }
  }, [notes])

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200
    const wordCount = content.trim().split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const calculateWordCount = (content: string): number => {
    return content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  const createNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast.error("Error", {
        description: "El título y contenido son obligatorios",
      })
      return
    }

    const wordCount = calculateWordCount(noteContent)
    const readingTime = calculateReadingTime(noteContent)

    const newNote: Note = {
      id: crypto.randomUUID(),
      title: noteTitle,
      content: noteContent,
      category: noteCategory,
      tags: noteTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
      isArchived: false,
      wordCount,
      readingTime,
      author: "Usuario",
      isPublic: false,
      views: 0,
      likes: 0,
    }

    if (editingNote) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id
            ? {
                ...newNote,
                id: editingNote.id,
                createdAt: editingNote.createdAt,
                views: editingNote.views,
                likes: editingNote.likes,
              }
            : note,
        ),
      )
      toast.success("¡Nota actualizada!")
    } else {
      setNotes((prev) => [newNote, ...prev])
      toast.success("¡Nota creada!")
    }

    resetNoteForm()
    setShowNoteDialog(false)
  }

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
    toast.success("Nota eliminada")
  }

  const toggleFavorite = (noteId: string) => {
    setNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note)))
  }

  const toggleArchive = (noteId: string) => {
    setNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, isArchived: !note.isArchived } : note)))
  }

  const incrementViews = (noteId: string) => {
    setNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, views: note.views + 1 } : note)))
  }

  const toggleLike = (noteId: string) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === noteId ? { ...note, likes: note.likes + (Math.random() > 0.5 ? 1 : -1) } : note)),
    )
  }

  const resetNoteForm = () => {
    setNoteTitle("")
    setNoteContent("")
    setNoteCategory("personal")
    setNoteTags("")
    setEditingNote(null)
  }

  const exportNotes = () => {
    const data = {
      notes,
      exportDate: new Date().toISOString(),
      language,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `notes-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("¡Notas exportadas!")
  }

  const importNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.notes && Array.isArray(data.notes)) {
          const importedNotes = data.notes.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          }))
          setNotes((prev) => [...importedNotes, ...prev])
          toast.success("¡Notas importadas!")
        }
      } catch (error) {
        toast.error("Error al importar", {
          description: "El archivo no es válido",
        })
      }
    }
    reader.readAsText(file)
  }

  const duplicateNote = (note: Note) => {
    const duplicatedNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      title: `${note.title} (Copia)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0,
    }
    setNotes((prev) => [duplicatedNote, ...prev])
    toast.success("Nota duplicada")
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = filterCategory === "all" || note.category === filterCategory
    const matchesTags = filterTags.length === 0 || filterTags.some((tag) => note.tags.includes(tag))
    const matchesArchived = showArchived ? note.isArchived : !note.isArchived
    const matchesFavorites = showFavoritesOnly ? note.isFavorite : true

    return matchesSearch && matchesCategory && matchesTags && matchesArchived && matchesFavorites
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "date":
        comparison = b.updatedAt.getTime() - a.updatedAt.getTime()
        break
      case "title":
        comparison = a.title.localeCompare(b.title)
        break
      case "views":
        comparison = b.views - a.views
        break
      case "likes":
        comparison = b.likes - a.likes
        break
    }

    return sortOrder === "asc" ? -comparison : comparison
  })

  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags)))

  const stats = {
    total: notes.length,
    favorites: notes.filter((note) => note.isFavorite).length,
    archived: notes.filter((note) => note.isArchived).length,
    totalWords: notes.reduce((sum, note) => sum + note.wordCount, 0),
    totalViews: notes.reduce((sum, note) => sum + note.views, 0),
    totalLikes: notes.reduce((sum, note) => sum + note.likes, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <BookOpen className="h-6 w-6 mr-2" />
            Notas y Blog
          </h2>
          <p className="text-white/60">Organiza tus ideas y pensamientos</p>
        </div>
        <div className="flex items-center space-x-2">
          <input type="file" accept=".json" onChange={importNotes} className="hidden" id="import-notes" />
          <Button
            onClick={() => document.getElementById("import-notes")?.click()}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button
            onClick={exportNotes}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button
            onClick={() => setShowNoteDialog(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Nota
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-white/60">Total</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.favorites}</div>
            <div className="text-sm text-white/60">Favoritas</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.archived}</div>
            <div className="text-sm text-white/60">Archivadas</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.totalWords.toLocaleString()}</div>
            <div className="text-sm text-white/60">Palabras</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.totalViews}</div>
            <div className="text-sm text-white/60">Vistas</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.totalLikes}</div>
            <div className="text-sm text-white/60">Me gusta</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/10 border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                <Input
                  placeholder="Buscar notas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {noteCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Fecha</SelectItem>
                  <SelectItem value="title">Título</SelectItem>
                  <SelectItem value="views">Vistas</SelectItem>
                  <SelectItem value="likes">Me gusta</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>

              <Button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                className={
                  showFavoritesOnly
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }
              >
                <Star className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => setShowArchived(!showArchived)}
                variant={showArchived ? "default" : "outline"}
                size="sm"
                className={
                  showArchived
                    ? "bg-gray-500 hover:bg-gray-600 text-white"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }
              >
                <Archive className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNotes.length === 0 ? (
          <div className="col-span-full">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No hay notas</h3>
                <p className="text-white/60 mb-4">
                  {searchQuery || filterCategory !== "all" || showFavoritesOnly || showArchived
                    ? "No se encontraron notas con los filtros actuales"
                    : "Crea tu primera nota para empezar"}
                </p>
                <Button
                  onClick={() => setShowNoteDialog(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Nota
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          sortedNotes.map((note) => {
            const category = noteCategories.find((c) => c.id === note.category)

            return (
              <Card
                key={note.id}
                className="bg-white/10 border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => incrementViews(note.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-white text-lg line-clamp-2">{note.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={`${category?.color} text-white text-xs`}>{category?.name}</Badge>
                        {note.isFavorite && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                        {note.isArchived && <Archive className="h-4 w-4 text-gray-400" />}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingNote(note)
                            setNoteTitle(note.title)
                            setNoteContent(note.content)
                            setNoteCategory(note.category)
                            setNoteTags(note.tags.join(", "))
                            setShowNoteDialog(true)
                          }}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateNote(note)
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(note.id)
                          }}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          {note.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleArchive(note.id)
                          }}
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          {note.isArchived ? "Desarchivar" : "Archivar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNote(note.id)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-white/70 text-sm line-clamp-3 mb-4">{note.content}</p>

                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {note.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-white/10 text-white/80">
                          #{tag}
                        </Badge>
                      ))}
                      {note.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-white/10 text-white/80">
                          +{note.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-white/60">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>{note.wordCount} palabras</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{note.readingTime} min</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{note.views}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleLike(note.id)
                        }}
                        className="flex items-center space-x-1 hover:text-red-400 transition-colors"
                      >
                        <Heart className="h-3 w-3" />
                        <span>{note.likes}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-white/60 mt-2">{format(note.updatedAt, "PPp", { locale })}</div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="sm:max-w-[800px] bg-white/10 backdrop-blur-md border-white/20 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNote ? "Editar Nota" : "Nueva Nota"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="note-title">Título</Label>
              <Input
                id="note-title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Título de la nota"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="note-category">Categoría</Label>
                <Select value={noteCategory} onValueChange={setNoteCategory}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {noteCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="note-tags">Etiquetas (separadas por comas)</Label>
                <Input
                  id="note-tags"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  placeholder="etiqueta1, etiqueta2, etiqueta3"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="note-content">Contenido</Label>
              <Textarea
                id="note-content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Escribe tu nota aquí..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[300px]"
              />
              <div className="text-xs text-white/60 mt-2">
                {calculateWordCount(noteContent)} palabras • {calculateReadingTime(noteContent)} min de lectura
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetNoteForm()
                  setShowNoteDialog(false)
                }}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Cancelar
              </Button>
              <Button
                onClick={createNote}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {editingNote ? "Actualizar Nota" : "Crear Nota"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NotesBlog
