"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  MoreHorizontal,
  Calendar,
  Tag,
  FileText,
  Star,
  Heart,
  Lightbulb,
  Coffee,
  Briefcase,
  Home,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

interface Note {
  id: string
  title: string
  content: string
  category: "personal" | "work" | "ideas" | "journal" | "recipes" | "travel" | "learning"
  tags: string[]
  favorite: boolean
  createdAt: Date
  updatedAt: Date
}

interface NotesProps {
  language: "en" | "es" | "fr" | "de" | "it"
}

const noteCategories = [
  { id: "personal", name: "Personal", icon: Heart, color: "bg-pink-500" },
  { id: "work", name: "Trabajo", icon: Briefcase, color: "bg-blue-500" },
  { id: "ideas", name: "Ideas", icon: Lightbulb, color: "bg-yellow-500" },
  { id: "journal", name: "Diario", icon: BookOpen, color: "bg-purple-500" },
  { id: "recipes", name: "Recetas", icon: Coffee, color: "bg-orange-500" },
  { id: "travel", name: "Viajes", icon: Home, color: "bg-green-500" },
  { id: "learning", name: "Aprendizaje", icon: FileText, color: "bg-indigo-500" },
]

const translations = {
  es: {
    title: "Notas y Blog",
    addNote: "Añadir Nota",
    editNote: "Editar Nota",
    noteTitle: "Título de la Nota",
    content: "Contenido",
    category: "Categoría",
    tags: "Etiquetas",
    favorite: "Favorito",
    search: "Buscar notas...",
    noNotes: "No hay notas aún",
    createFirst: "¡Crea tu primera nota para empezar!",
    save: "Guardar",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Eliminar",
    toggleFavorite: "Alternar Favorito",
    filterAll: "Todas",
    filterFavorites: "Favoritas",
    personal: "Personal",
    work: "Trabajo",
    ideas: "Ideas",
    journal: "Diario",
    recipes: "Recetas",
    travel: "Viajes",
    learning: "Aprendizaje",
    tagsPlaceholder: "Añadir etiquetas separadas por comas",
    lastUpdated: "Última actualización",
    wordCount: "palabras",
    totalNotes: "Total de Notas",
    totalWords: "Total de Palabras",
  },
  en: {
    title: "Notes & Blog",
    addNote: "Add Note",
    editNote: "Edit Note",
    noteTitle: "Note Title",
    content: "Content",
    category: "Category",
    tags: "Tags",
    favorite: "Favorite",
    search: "Search notes...",
    noNotes: "No notes yet",
    createFirst: "Create your first note to get started!",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    toggleFavorite: "Toggle Favorite",
    filterAll: "All",
    filterFavorites: "Favorites",
    personal: "Personal",
    work: "Work",
    ideas: "Ideas",
    journal: "Journal",
    recipes: "Recipes",
    travel: "Travel",
    learning: "Learning",
    tagsPlaceholder: "Add tags separated by commas",
    lastUpdated: "Last updated",
    wordCount: "words",
    totalNotes: "Total Notes",
    totalWords: "Total Words",
  },
}

export function Notes({ language }: NotesProps) {
  const t = translations[language] || translations.es

  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("notes-blog")
      if (saved) {
        try {
          const parsedNotes = JSON.parse(saved)
          return parsedNotes.map((note: any) => ({
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
  const [noteCategory, setNoteCategory] = useState<Note["category"]>("personal")
  const [noteTags, setNoteTags] = useState("")
  const [noteFavorite, setNoteFavorite] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Save notes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("notes-blog", JSON.stringify(notes))
    }
  }, [notes])

  const resetNoteForm = () => {
    setNoteTitle("")
    setNoteContent("")
    setNoteCategory("personal")
    setNoteTags("")
    setNoteFavorite(false)
    setEditingNote(null)
  }

  const handleSaveNote = () => {
    if (!noteTitle.trim()) return

    const noteData: Note = {
      id: editingNote?.id || crypto.randomUUID(),
      title: noteTitle,
      content: noteContent,
      category: noteCategory,
      tags: noteTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      favorite: noteFavorite,
      createdAt: editingNote?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    if (editingNote) {
      setNotes(notes.map((note) => (note.id === editingNote.id ? noteData : note)))
      toast.success("¡Nota actualizada exitosamente!")
    } else {
      setNotes([noteData, ...notes])
      toast.success("¡Nota creada exitosamente!")
    }

    resetNoteForm()
    setShowNoteDialog(false)
  }

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
    toast.success("¡Nota eliminada exitosamente!")
  }

  const toggleFavorite = (noteId: string) => {
    setNotes(
      notes.map((note) => (note.id === noteId ? { ...note, favorite: !note.favorite, updatedAt: new Date() } : note)),
    )
  }

  const editNote = (note: Note) => {
    setEditingNote(note)
    setNoteTitle(note.title)
    setNoteContent(note.content)
    setNoteCategory(note.category)
    setNoteTags(note.tags.join(", "))
    setNoteFavorite(note.favorite)
    setShowNoteDialog(true)
  }

  const getWordCount = (content: string) => {
    return content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = filterCategory === "all" || note.category === filterCategory
    const matchesFavorites = !showFavoritesOnly || note.favorite

    return matchesSearch && matchesCategory && matchesFavorites
  })

  const favoriteNotes = notes.filter((note) => note.favorite)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-white" />
          <h2 className="text-2xl font-bold text-white">{t.title}</h2>
        </div>
        <Button
          onClick={() => setShowNoteDialog(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t.addNote}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{notes.length}</div>
                <div className="text-sm text-white/60">{t.totalNotes}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">{favoriteNotes.length}</div>
                <div className="text-sm text-white/60">{t.filterFavorites}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit3 className="h-5 w-5 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {notes.reduce((total, note) => total + getWordCount(note.content), 0)}
                </div>
                <div className="text-sm text-white/60">{t.totalWords}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.filterAll}</SelectItem>
            {noteCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center space-x-2">
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showFavoritesOnly ? "default" : "outline"}
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={
            showFavoritesOnly
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
          }
        >
          <Star className="h-4 w-4 mr-2" />
          {t.filterFavorites}
        </Button>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t.noNotes}</h3>
              <p className="text-white/60 mb-4">
                {searchQuery || filterCategory !== "all" || showFavoritesOnly
                  ? "No se encontraron notas con los filtros actuales."
                  : t.createFirst}
              </p>
              <Button
                onClick={() => setShowNoteDialog(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.addNote}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => {
              const category = noteCategories.find((c) => c.id === note.category)
              const CategoryIcon = category?.icon || FileText

              return (
                <Card
                  key={note.id}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => editNote(note)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <CategoryIcon className="h-5 w-5 text-white/60 flex-shrink-0" />
                        <CardTitle className="text-white text-lg truncate">{note.title}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(note.id)
                          }}
                          className="p-1 h-auto text-white hover:bg-white/20"
                        >
                          <Star
                            className={`h-4 w-4 ${note.favorite ? "fill-yellow-400 text-yellow-400" : "text-white/60"}`}
                          />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="p-1 h-auto text-white hover:bg-white/20">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => editNote(note)}>
                              <Edit3 className="h-4 w-4 mr-2" />
                              {t.edit}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleFavorite(note.id)}>
                              <Star className="h-4 w-4 mr-2" />
                              {t.toggleFavorite}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteNote(note.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t.delete}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-white/70 text-sm mb-3 line-clamp-3">{note.content || "Sin contenido..."}</p>

                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-white/10 text-white/80">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
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
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(note.updatedAt, "MMM d, yyyy", { locale: es })}</span>
                      </div>
                      <span>
                        {getWordCount(note.content)} {t.wordCount}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="sm:max-w-[800px] bg-white/10 backdrop-blur-md border-white/20 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNote ? t.editNote : t.addNote}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="note-title">{t.noteTitle}</Label>
              <Input
                id="note-title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder={t.noteTitle}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="note-category">{t.category}</Label>
                <Select value={noteCategory} onValueChange={(value: Note["category"]) => setNoteCategory(value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {noteCategories.map((category) => {
                      const Icon = category.icon
                      return (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="note-tags">{t.tags}</Label>
                <Input
                  id="note-tags"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  placeholder={t.tagsPlaceholder}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="note-favorite"
                checked={noteFavorite}
                onChange={(e) => setNoteFavorite(e.target.checked)}
                className="rounded border-white/20 bg-white/10"
              />
              <Label htmlFor="note-favorite" className="flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>{t.favorite}</span>
              </Label>
            </div>

            <div>
              <Label htmlFor="note-content">{t.content}</Label>
              <Textarea
                id="note-content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Escribe el contenido de tu nota aquí..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[300px]"
              />
              <div className="text-xs text-white/60 mt-1">
                {getWordCount(noteContent)} {t.wordCount}
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
                {t.cancel}
              </Button>
              <Button
                onClick={handleSaveNote}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {t.save}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
