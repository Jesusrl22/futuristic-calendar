"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookOpen, Plus, Edit, Trash2, Search, Calendar, Crown, Lock, FileText, Lightbulb, Clock } from "lucide-react"
import { hybridDb, type Note } from "@/lib/hybrid-database"
import { isPremiumOrPro } from "@/lib/subscription"
import { useLanguage } from "@/hooks/useLanguage"

interface NotesManagerProps {
  userId: string
  userPlan: string
  onUpgrade: () => void
}

export function NotesManager({ userId, userPlan, onUpgrade }: NotesManagerProps) {
  const { t } = useLanguage()
  const isPremium = isPremiumOrPro(userPlan)
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const [formData, setFormData] = useState({
    title: "",
    content: "",
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
        title: formData.title,
        content: formData.content,
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
    })
    setShowForm(true)
  }

  const handleDelete = async (noteId: string) => {
    if (confirm(t("notes.confirmDelete"))) {
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
    })
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "recent" && new Date(note.updated_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000)

    return matchesSearch && matchesTab
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t("common.loading")}</p>
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
              {t("notes.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t("common.premium")}</p>
          </div>
        </div>

        <Card className="border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <CardContent className="pt-12 pb-12">
            <div className="text-center max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t("notes.title")}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Organiza tus ideas con nuestro sistema avanzado de notas
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
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Búsqueda inteligente y rápida</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Sincronización en tiempo real</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Historial de modificaciones</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={onUpgrade}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  {t("common.upgrade")}
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
              {t("notes.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {notes.length} {t("notes.title").toLowerCase()} ({userPlan === "pro" ? "Pro" : "Premium"})
            </p>
          </div>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              {t("notes.addNote")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="w-6 h-6 text-blue-500" />
                {editingNote ? t("notes.editNote") : t("notes.addNote")}
              </DialogTitle>
              <DialogDescription>
                {editingNote ? "Modifica tu nota existente" : "Crea una nueva nota"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-semibold">
                  {t("notes.noteTitle")} *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={t("notes.noteTitle") + "..."}
                  required
                  className="text-lg"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="content" className="text-base font-semibold">
                  {t("notes.noteContent")} *
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder={t("notes.noteContent") + "..."}
                  rows={15}
                  required
                  className="text-base leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseForm} size="lg">
                  {t("common.cancel")}
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white" size="lg">
                  {editingNote ? t("common.save") : t("common.add")}
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
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
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
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t("common.thisWeek")}</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {
                    notes.filter((note) => new Date(note.updated_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000)
                      .length
                  }
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500/10 to-red-500/10 border-pink-300/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 dark:text-pink-400">{t("common.today")}</p>
                <p className="text-2xl font-bold text-pink-700 dark:text-pink-300">
                  {
                    notes.filter(
                      (note) =>
                        new Date(note.created_at).toDateString() === new Date().toDateString() ||
                        new Date(note.updated_at).toDateString() === new Date().toDateString(),
                    ).length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-300/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">{t("common.thisMonth")}</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {
                    notes.filter((note) => new Date(note.created_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000)
                      .length
                  }
                </p>
              </div>
              <Lightbulb className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {t("common.all")} ({notes.length})
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Recientes (
            {notes.filter((note) => new Date(note.updated_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length})
          </TabsTrigger>
        </TabsList>

        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t("notes.searchNotes")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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
                    {searchTerm ? t("notes.noNotes") : t("notes.noNotes")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm ? "Intenta ajustar tu búsqueda" : t("notes.noNotesDescription")}
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={() => setShowForm(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t("notes.addNote")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <Card
                  key={note.id}
                  className="hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-blue-200 dark:border-blue-800"
                >
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
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-6 text-sm leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>

                    <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                      {t("notes.lastModified")} {new Date(note.updated_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
